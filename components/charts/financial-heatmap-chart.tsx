"use client"

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react"
import * as d3 from "d3"
import { formatCurrency } from "@/lib/company-data"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FundingRecord {
  id: string
  company: string
  cloudModel: string
  cloudFactor: number  // cloud cost % applied (e.g., 20 = 20%)
  cloudArrEfficiency: number
  cloudArrVsBenchmark: number
  scoreFinancial: number
  customerSignalScore: number
  weightedStartupQualityScore: number
  arrMultiple: number
  estimatedValuation: number
  fundingFloor: number
  estimatedValueFinal: number
  arrPerEmployee: number
  annualBurnProxy: number
  runwayProxyMonths: number
  startupSizeCategory: string
  capitalEfficiency: string
  runwayQuality: string
  netBurnLevel: string
  financialConfidence: string
}

interface FinancialHeatmapChartProps {
  className?: string
  filteredCompanyNames?: Set<string>
}

function formatBurnPerMonth(annual: number): string {
  const monthly = annual / 12
  if (monthly >= 1e6) return `$${(monthly / 1e6).toFixed(1)}M`
  if (monthly >= 1e3) return `$${(monthly / 1e3).toFixed(0)}K`
  return `$${monthly.toFixed(0)}`
}

// Unified column definitions in display order.
// type "qual" = qualitative (levels array), type "num" = numeric (format + higherIsGood)
type ColDef =
  | { type: "qual"; key: keyof FundingRecord; label: string; tip: string; levels: string[] }
  | { type: "num";  key: keyof FundingRecord; label: string; tip: string; format: (v: number) => string; higherIsGood: boolean }

const CLOUD_MODEL_ORDER = ["Cloud-Native", "SaaS", "Hybrid", "Edge/HW", "Traditional", "No Data"]

const COLUMNS: ColDef[] = [
  // 0. Cloud Model
  { type: "qual", key: "cloudModel", label: "Cloud Model",
    tip: "Delivery model derived from Operating Model Tags. Cloud-Native = cloud HPC / usage-based billing (+25% cloud cost factor); SaaS = subscription cloud (+20%); Hybrid = cloud + on-prem (+15%); Edge/HW = hardware-centric (+5%); Traditional = on-prem/perpetual (+3%).",
    levels: CLOUD_MODEL_ORDER },
  // 0b. Cloud ARR Efficiency
  { type: "num", key: "cloudArrEfficiency", label: "ARR Efficiency %",
    tip: "Formula: (Estimated ARR ÷ Total Funding Raised) × 100. Measures how many cents of recurring revenue the company generates per dollar of capital raised. 100% = ARR matches all funding ever raised; >100% = capital-efficient; <50% = still burning through raised capital.",
    format: (v: number) => `${v.toFixed(0)}%`, higherIsGood: true },
  // 0c. ARR vs $200K Benchmark
  { type: "num", key: "cloudArrVsBenchmark", label: "vs $200K Bench",
    tip: "Formula: (ARR per Employee ÷ $200K) × 100. The $200K/employee benchmark is the Bessemer/BVP SaaS industry standard for healthy ARR productivity. 100% = at benchmark; >150% = best-in-class; <50% = underperforming.",
    format: (v: number) => `${v.toFixed(0)}%`, higherIsGood: true },
  // 1. Company Size
  { type: "qual", key: "startupSizeCategory", label: "Company Size",
    tip: "Headcount-based size bucket: Large (250+), Medium (50–249), Small (<50).",
    levels: ["Large", "Medium", "Small"] },
  // 2. Capital Efficiency
  { type: "qual", key: "capitalEfficiency", label: "Capital Efficiency",
    tip: "How efficiently the company converts funding into revenue. High = strong returns per dollar raised.",
    levels: ["High", "Medium", "Low", "Small"] },
  // 3. Financial Health
  { type: "num", key: "scoreFinancial", label: "Financial Health",
    tip: "Composite financial health rating from Airtable combining revenue strength, burn sustainability, and funding trajectory. Excellent (30+), Healthy (20–29), Moderate (10–19), Weak (<10).",
    format: (v: number) => {
      if (v >= 30) return "Excellent"
      if (v >= 20) return "Healthy"
      if (v >= 10) return "Moderate"
      if (v > 0) return "Weak"
      return "—"
    }, higherIsGood: true },
  // 4. Burn Rate (per month)
  { type: "num", key: "annualBurnProxy", label: "Burn (monthly)",
    tip: "Formula: (Headcount × $200K/yr + Cloud Cost Factor) ÷ 12. Base cost = $200K/person/year (fully loaded: salary, benefits, office, tools). Cloud factor adds 3–25% depending on Cloud Model: Cloud-Native +25%, SaaS +20%, Hybrid +15%, Edge/HW +5%, Traditional +3%.",
    format: (v: number) => formatBurnPerMonth(v), higherIsGood: false },
  // 5. Burn Level
  { type: "qual", key: "netBurnLevel", label: "Burn Level",
    tip: "Net annual burn (Burn − Revenue) as % of total funding raised. Profitable = revenue exceeds burn; Very Low (<5%); Low (5–15%); Moderate (15–25%); Comfortable (25–40%); High (40–60%); Very High (60–80%); Critical (>80%).",
    levels: ["Profitable", "Very Low", "Low", "Moderate", "Comfortable", "High", "Very High", "Critical", "No Data"] },
  // 6. ARR / Employee (US$)
  { type: "num", key: "arrPerEmployee", label: "ARR/HC ($)",
    tip: "Formula: Estimated ARR ÷ Headcount. Measures revenue productivity per person. BVP benchmark = $200K/employee. >$300K = strong; <$100K = early-stage or R&D-heavy.",
    format: (v: number) => formatCurrency(v), higherIsGood: true },
  // 7. Runway (months)
  { type: "num", key: "runwayProxyMonths", label: "Runway (mo.)",
    tip: "Formula: Total Funding ÷ ((Annual Burn − Annual Revenue) ÷ 12). Uses net burn (gross burn minus revenue). If revenue ≥ burn, company is cash-flow positive and runway shows 999 (effectively infinite). <12 months = critical; 12–24 = tight; 24–36 = healthy; 36+ = very strong.",
    format: (v: number) => v >= 999 ? "∞" : v.toFixed(0), higherIsGood: true },
  // 8. Runway Quality
  { type: "qual", key: "runwayQuality", label: "Runway",
    tip: "Cash-flow Positive = revenue covers burn; Very Strong = 36+ months; Healthy = 24–36; Comfortable = 18–24; Tight = 12–18; High Risk = 6–12; Critical = <6 months.",
    levels: ["Cash-flow Positive", "Very Strong", "Healthy", "Comfortable", "Tight", "High Risk", "Critical", "No Data"] },
  // 9. Data Integrity Confidence
  { type: "qual", key: "financialConfidence", label: "Confidence",
    tip: "How reliable the underlying financial data is. Very High = verified/disclosed sources; Low = estimated from headcount proxies and sparse public data.",
    levels: ["Very High", "Strong", "Medium", "Moderate", "Low", "Very Low"] },
]

const NUM_COLUMNS = COLUMNS.filter((c): c is Extract<ColDef, { type: "num" }> => c.type === "num")

type SortKey = "scoreFinancial" | "arrPerEmployee" | "annualBurnProxy" | "runwayProxyMonths" | "estimatedValuation" | "cloudArrEfficiency" | "cloudArrVsBenchmark"

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "scoreFinancial",      label: "Financial Score" },
  { value: "estimatedValuation",  label: "Valuation" },
  { value: "arrPerEmployee",      label: "ARR / Employee" },
  { value: "cloudArrEfficiency",  label: "ARR Efficiency %" },
  { value: "cloudArrVsBenchmark", label: "vs $200K Benchmark" },
  { value: "annualBurnProxy",     label: "Annual Burn" },
  { value: "runwayProxyMonths",   label: "Runway Months" },
]

const TOP_N_OPTIONS = [10, 15, 20]

// Unified green → yellow → orange → red color ramp
const RAMP_STOPS = ["#16a34a", "#22c55e", "#84cc16", "#eab308", "#f97316", "#ef4444", "#dc2626"]

function rampColor(t: number): string {
  // t: 0 = green (safe), 1 = red (danger)
  const clamped = Math.max(0, Math.min(1, t))
  const scaled = clamped * (RAMP_STOPS.length - 1)
  const lo = Math.floor(scaled)
  const hi = Math.min(lo + 1, RAMP_STOPS.length - 1)
  return d3.interpolateRgb(RAMP_STOPS[lo], RAMP_STOPS[hi])(scaled - lo)
}

// Color for qualitative levels — green (best) → red (worst)
function qualColor(levelIndex: number, totalLevels: number): string {
  if (totalLevels <= 1) return RAMP_STOPS[0]
  return rampColor(levelIndex / (totalLevels - 1))
}

export function FinancialHeatmapChart({ className, filteredCompanyNames }: FinancialHeatmapChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const [fundingData, setFundingData] = useState<FundingRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortKey>("scoreFinancial")
  const [topN, setTopN] = useState(15)
  const [cloudOnly, setCloudOnly] = useState(false)
  const [showLegend, setShowLegend] = useState(false)

  useEffect(() => {
    fetch("/api/funding")
      .then((r) => r.json())
      .then((result) => {
        if (result.success) setFundingData(result.data)
        else setError(result.error || "Failed to load funding data")
      })
      .catch(() => setError("Network error loading funding data"))
      .finally(() => setIsLoading(false))
  }, [])

  const ranked = useMemo(() => {
    let pool = fundingData
    if (filteredCompanyNames && filteredCompanyNames.size > 0) {
      pool = pool.filter((r) => filteredCompanyNames.has(r.company))
    }
    if (cloudOnly) {
      pool = pool.filter((r) => r.cloudModel === "Cloud-Native" || r.cloudModel === "SaaS")
    }
    return [...pool]
      .filter((r) => (r[sortBy] as number) > 0)
      .sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number))
      .slice(0, topN)
  }, [fundingData, filteredCompanyNames, sortBy, topN, cloudOnly])

  // Normalize numeric columns to 0–1 for color intensity
  const numScales = useMemo(() => {
    const scales: Map<string, d3.ScaleLinear<number, number>> = new Map()
    for (const col of NUM_COLUMNS) {
      const max = d3.max(ranked, (r) => (r[col.key] as number) || 0) || 1
      scales.set(col.key, d3.scaleLinear().domain([0, max]).range([0, 1]).clamp(true))
    }
    return scales
  }, [ranked])

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || ranked.length === 0) return

    const width = containerRef.current.clientWidth
    if (!width) return

    const rowHeight = 48
    const margin = { top: 120, right: 60, bottom: 10, left: 280 }
    const height = ranked.length * rowHeight + margin.top + margin.bottom

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()
    svg.attr("width", width).attr("height", height)

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)
    const innerWidth = width - margin.left - margin.right

    const allCols = COLUMNS.map((c) => c.label)
    const xScale = d3.scaleBand().domain(allCols).range([0, innerWidth]).padding(0.06)
    const yScale = d3.scaleBand().domain(ranked.map((r) => r.id)).range([0, ranked.length * rowHeight]).padding(0.12)

    // Column headers with description tooltips
    const headerGroups = g.selectAll("g.col-header")
      .data(COLUMNS)
      .join("g")
      .attr("class", "col-header")
      .attr("transform", (col) => {
        const x = (xScale(col.label) ?? 0) + xScale.bandwidth() / 2
        return `translate(${x}, -12) rotate(-40)`
      })
      .style("cursor", "help")

    headerGroups.append("text")
      .attr("text-anchor", "start")
      .attr("fill", "#cbd5e1")
      .attr("font-size", "14px")
      .attr("font-weight", "600")
      .text((col) => col.label)

    headerGroups.append("title")
      .text((col) => col.tip)

    // Rows
    for (const rec of ranked) {
      const y = yScale(rec.id) ?? 0
      const bh = yScale.bandwidth()

      // Company name
      g.append("text")
        .attr("x", -12)
        .attr("y", y + bh / 2)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "central")
        .attr("fill", "#cbd5e1")
        .attr("font-size", "24px")
        .attr("font-weight", "600")
        .text(rec.company.length > 20 ? rec.company.slice(0, 18) + "..." : rec.company)

      // Render each column cell
      for (const col of COLUMNS) {
        const cx = xScale(col.label) ?? 0
        const bw = xScale.bandwidth()
        let cellColor: string
        let cellText: string

        if (col.type === "qual") {
          const val = (rec[col.key] as string) || ""
          const levelIdx = col.levels.indexOf(val)
          cellColor = levelIdx >= 0 ? qualColor(levelIdx, col.levels.length) : "#334155"
          cellText = val || "—"
        } else {
          const raw = (rec[col.key] as number) || 0
          const norm = numScales.get(col.key)!(raw)
          const t = col.higherIsGood ? 1 - norm : norm
          cellColor = raw === 0 ? "#334155" : rampColor(t)
          cellText = raw > 0 ? col.format(raw) : "—"
        }

        g.append("rect")
          .attr("x", cx).attr("y", y)
          .attr("width", bw).attr("height", bh)
          .attr("fill", cellColor).attr("rx", 4)
          .attr("opacity", 0.85)
          .style("cursor", "pointer")
          .on("mouseover", (event) => showTooltip(event, rec))
          .on("mousemove", moveTooltip)
          .on("mouseout", hideTooltip)

        g.append("text")
          .attr("x", cx + bw / 2).attr("y", y + bh / 2)
          .attr("text-anchor", "middle").attr("dominant-baseline", "central")
          .attr("fill", "#fff").attr("font-size", "12px").attr("font-weight", "600")
          .attr("pointer-events", "none")
          .text(cellText)
      }
    }

    // Remove default axis elements
    g.selectAll(".domain").remove()
    g.selectAll(".tick line").remove()

    function showTooltip(event: MouseEvent, rec: FundingRecord) {
      if (!tooltipRef.current) return
      const lines = [
        `<strong style="font-size:14px">${rec.company}</strong>`,
        `Cloud Model: <strong>${rec.cloudModel}</strong> (+${rec.cloudFactor}% infra cost)`,
        ``,
        ...COLUMNS.filter(col => col.key !== "cloudModel").map((col) => {
          if (col.type === "qual") {
            return `${col.label}: <strong>${(rec[col.key] as string) || "—"}</strong>`
          }
          const v = (rec[col.key] as number) || 0
          return `${col.label}: <strong>${v > 0 ? col.format(v) : "—"}</strong>`
        }),
        ``,
        `Valuation: <strong>${formatCurrency(rec.estimatedValuation)}</strong>`,
        `Funding Floor: <strong>${formatCurrency(rec.fundingFloor)}</strong>`,
      ]
      tooltipRef.current.style.visibility = "visible"
      tooltipRef.current.style.top = `${event.pageY - 10}px`
      tooltipRef.current.style.left = `${event.pageX + 15}px`
      tooltipRef.current.innerHTML = lines.join("<br>")
    }

    function moveTooltip(event: MouseEvent) {
      if (!tooltipRef.current) return
      tooltipRef.current.style.top = `${event.pageY - 10}px`
      tooltipRef.current.style.left = `${event.pageX + 15}px`
    }

    function hideTooltip() {
      if (tooltipRef.current) tooltipRef.current.style.visibility = "hidden"
    }
  }, [ranked, numScales, sortBy])

  if (isLoading) {
    return (
      <Card className={cn("flex items-center justify-center min-h-[400px]", className)}>
        <p className="text-sm text-muted-foreground">Loading financial data...</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={cn("flex items-center justify-center min-h-[400px]", className)}>
        <p className="text-sm text-red-400">{error}</p>
      </Card>
    )
  }

  return (
    <Card className={cn("flex flex-col", className)}>
      <div className="flex flex-wrap gap-4 items-center p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="text-xs bg-background border border-border rounded px-2 py-1"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground">Show top</label>
          <select
            value={topN}
            onChange={(e) => setTopN(Number(e.target.value))}
            className="text-xs bg-background border border-border rounded px-2 py-1"
          >
            {TOP_N_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={cloudOnly}
            onChange={(e) => setCloudOnly(e.target.checked)}
            className="rounded"
          />
          Cloud &amp; SaaS only
        </label>
        <span className="text-xs text-muted-foreground ml-auto">
          {ranked.length} of {fundingData.length} startups
        </span>
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2"
        >
          {showLegend ? "Hide legend" : "What do these metrics mean?"}
        </button>
      </div>
      {showLegend && (
        <div className="px-4 py-3 border-b border-border bg-muted/20 text-xs text-muted-foreground space-y-1.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
            {COLUMNS.map(col => (
              <div key={col.label}>
                <span className="font-semibold text-foreground">{col.label}</span>
                {" — "}{col.tip}
              </div>
            ))}
            <div>
              <span className="font-semibold text-foreground">Valuation</span>
              {" — "}Estimated enterprise value derived from ARR multiples and comparable transactions.
            </div>
            <div>
              <span className="font-semibold text-foreground">Funding Floor</span>
              {" — "}Minimum implied valuation based on total capital raised (post-money floor).
            </div>
          </div>
          <div className="flex gap-4 pt-1 border-t border-border/50 mt-1.5">
            <span><span className="inline-block w-3 h-3 rounded-sm mr-1" style={{background: "#16a34a"}} />Green = strong/healthy</span>
            <span><span className="inline-block w-3 h-3 rounded-sm mr-1" style={{background: "#eab308"}} />Yellow = moderate</span>
            <span><span className="inline-block w-3 h-3 rounded-sm mr-1" style={{background: "#ef4444"}} />Red = weak/at risk</span>
            <span><span className="inline-block w-3 h-3 rounded-sm mr-1" style={{background: "#334155"}} />Gray = no data</span>
          </div>
        </div>
      )}
      <div ref={containerRef} className="flex-1 w-full min-h-0 overflow-y-auto p-2">
        <svg ref={svgRef} className="w-full" />
        <div
          ref={tooltipRef}
          style={{
            position: "fixed",
            visibility: "hidden",
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "6px",
            padding: "10px 14px",
            fontSize: "13px",
            color: "#f1f5f9",
            lineHeight: "1.6",
            pointerEvents: "none",
            zIndex: 9999,
            maxWidth: "340px",
          }}
        />
      </div>
    </Card>
  )
}
