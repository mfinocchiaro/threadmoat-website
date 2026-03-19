"use client"

import React, { useEffect, useRef, useState, useMemo } from "react"
import * as d3 from "d3"
import { formatCurrency } from "@/lib/company-data"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FundingRecord {
  id: string
  company: string
  cloudModel: string
  cloudSaasMultiplier: number
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
  enhancedBurnPerEmployee: number
  runwayProxyMonths: number
  startupSizeCategory: string
  capitalEfficiency: string
  runwayQuality: string
  netBurnLevel: string
  financialConfidence: string
  aiIntensity: string
  aiIntensityScore: number
  enhancedBurnRate: string
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

// Column definitions in display order.
// type "qual" = qualitative (levels array, index 0 = green, last = red)
// type "num"  = numeric (format fn). "neutral" numeric columns get a blue intensity ramp
//              instead of green-red to avoid contradicting qualitative Airtable assessments.
// type "desc" = descriptive/categorical (neutral blue palette, no good/bad implied)
type ColDef =
  | { type: "qual"; key: keyof FundingRecord; label: string; tip: string; levels: string[] }
  | { type: "num";  key: keyof FundingRecord; label: string; tip: string; format: (v: number) => string; higherIsGood: boolean; neutral?: boolean }
  | { type: "desc"; key: keyof FundingRecord; label: string; tip: string; levels: string[] }

const CLOUD_MODEL_ORDER = ["Cloud-Native", "SaaS", "Hybrid", "Edge/HW", "Traditional", "No Data"]

const COLUMNS: ColDef[] = [
  // ── Identity & Context ──
  { type: "desc", key: "startupSizeCategory", label: "Size",
    tip: "Headcount-based size bucket from Airtable: Large (250+), Medium (50-249), Small (<50).",
    levels: ["Large", "Medium", "Small"] },
  { type: "desc", key: "aiIntensity", label: "AI Intens.",
    tip: "AI Intensity rating from Airtable based on product signals. High = core AI/ML product; Medium = AI-augmented features; Low = minimal or no AI.",
    levels: ["High", "Medium", "Low"] },
  { type: "desc", key: "cloudModel", label: "Cloud",
    tip: "Delivery model classified from Operating Model Tags. Cloud-Native = cloud HPC/usage-based; SaaS = subscription cloud; Hybrid = cloud + on-prem; Edge/HW = hardware-centric; Traditional = on-prem/perpetual.",
    levels: CLOUD_MODEL_ORDER },
  // ── Financial Health (from Airtable — source of truth) ──
  { type: "num", key: "scoreFinancial", label: "Fin. Health",
    tip: "Composite financial health score from Airtable combining revenue strength, burn sustainability, and funding trajectory. Excellent (30+), Healthy (20-29), Moderate (10-19), Weak (<10).",
    format: (v: number) => {
      if (v >= 30) return "Excellent"
      if (v >= 20) return "Healthy"
      if (v >= 10) return "Moderate"
      if (v > 0) return "Weak"
      return "—"
    }, higherIsGood: true },
  { type: "qual", key: "capitalEfficiency", label: "Cap. Eff.",
    tip: "How efficiently the company converts funding into revenue. High = strong returns per dollar raised. From Airtable.",
    levels: ["High", "Medium", "Low"] },
  // ── Revenue Productivity (neutral — absolute numbers, context-dependent) ──
  { type: "num", key: "arrPerEmployee", label: "ARR/HC",
    tip: "Annual Recurring Revenue per employee from Airtable. BVP benchmark = $200K/employee. >$300K = strong; <$100K = early-stage or R&D-heavy.",
    format: (v: number) => formatCurrency(v), higherIsGood: true, neutral: true },
  { type: "num", key: "cloudArrEfficiency", label: "ARR Eff. %",
    tip: "Derived: (Estimated ARR / Total Funding) x 100. Measures cents of recurring revenue per dollar of capital raised. 100% = ARR matches total funding; >100% = capital-efficient.",
    format: (v: number) => `${v.toFixed(0)}%`, higherIsGood: true, neutral: true },
  { type: "num", key: "cloudArrVsBenchmark", label: "vs $200K",
    tip: "Derived: (ARR per Employee / $200K) x 100. The $200K/employee is the Bessemer/BVP SaaS benchmark. 100% = at benchmark; >150% = best-in-class.",
    format: (v: number) => `${v.toFixed(0)}%`, higherIsGood: true, neutral: true },
  // ── Burn & Runway (qualitative = Airtable truth, numeric = neutral context) ──
  { type: "num", key: "annualBurnProxy", label: "Burn/mo",
    tip: "Monthly burn rate from Airtable (Annual Burn Proxy / 12). Absolute number — use Burn Lvl and Adj. Burn for health assessment.",
    format: (v: number) => formatBurnPerMonth(v), higherIsGood: false, neutral: true },
  { type: "qual", key: "netBurnLevel", label: "Burn Lvl",
    tip: "Net burn level from Airtable based on headcount cost model. Very Low (<5% of funding/yr); Low (5-15%); Moderate (15-25%); High (40-60%); Very High (60-80%).",
    levels: ["Very Low", "Low", "Moderate", "High", "Very High"] },
  { type: "qual", key: "enhancedBurnRate", label: "Adj. Burn",
    tip: "Enhanced burn rate from Airtable factoring in headcount + cloud infrastructure + AI compute costs. Low = lean operation; Very High = heavy cloud/AI spend.",
    levels: ["Low", "Medium", "High", "Very High"] },
  { type: "num", key: "runwayProxyMonths", label: "Runway",
    tip: "Estimated runway in months from Airtable. Absolute number — use Run. Qual for health assessment.",
    format: (v: number) => v >= 999 ? "∞" : v.toFixed(0), higherIsGood: true, neutral: true },
  { type: "qual", key: "runwayQuality", label: "Run. Qual",
    tip: "Runway quality from Airtable. Very Strong = 36+ months; Healthy = 24-36; Comfortable = 18-24; Tight = 12-18; High Risk = 6-12; Critical = <6 months.",
    levels: ["Very Strong", "Healthy", "Comfortable", "Tight", "High Risk", "Critical"] },
  // ── Data Quality ──
  { type: "qual", key: "financialConfidence", label: "Conf.",
    tip: "Data confidence from Airtable. Strong = verified/disclosed sources; Medium = public estimates + signals; Low = estimated from sparse public data.",
    levels: ["Strong", "Medium", "Low"] },
]

const NUM_COLUMNS = COLUMNS.filter((c): c is Extract<ColDef, { type: "num" }> => c.type === "num")

type SortKey = "scoreFinancial" | "arrPerEmployee" | "annualBurnProxy" | "runwayProxyMonths" | "estimatedValuation" | "cloudArrEfficiency" | "cloudArrVsBenchmark" | "aiIntensityScore"

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "scoreFinancial",      label: "Financial Score" },
  { value: "estimatedValuation",  label: "Valuation" },
  { value: "arrPerEmployee",      label: "ARR / Employee" },
  { value: "cloudArrEfficiency",  label: "ARR Efficiency %" },
  { value: "cloudArrVsBenchmark", label: "vs $200K Benchmark" },
  { value: "annualBurnProxy",     label: "Annual Burn" },
  { value: "runwayProxyMonths",   label: "Runway Months" },
  { value: "aiIntensityScore",    label: "AI Intensity Score" },
]

const TOP_N_OPTIONS = [10, 15, 20, 30]

// Green → yellow → orange → red ramp for qualitative health columns
const RAMP_STOPS = ["#16a34a", "#22c55e", "#84cc16", "#eab308", "#f97316", "#ef4444", "#dc2626"]

function rampColor(t: number): string {
  const clamped = Math.max(0, Math.min(1, t))
  const scaled = clamped * (RAMP_STOPS.length - 1)
  const lo = Math.floor(scaled)
  const hi = Math.min(lo + 1, RAMP_STOPS.length - 1)
  return d3.interpolateRgb(RAMP_STOPS[lo], RAMP_STOPS[hi])(scaled - lo)
}

// Green → red for qualitative columns (index 0 = green/good, last = red/bad)
function qualColor(levelIndex: number, totalLevels: number): string {
  if (totalLevels <= 1) return RAMP_STOPS[0]
  return rampColor(levelIndex / (totalLevels - 1))
}

// Neutral blue intensity for descriptive columns and neutral numeric columns
// Avoids implying good/bad — just shows relative magnitude
const NEUTRAL_STOPS = ["#1e3a5f", "#2563eb", "#60a5fa"]
function neutralColor(t: number): string {
  const clamped = Math.max(0, Math.min(1, t))
  const scaled = clamped * (NEUTRAL_STOPS.length - 1)
  const lo = Math.floor(scaled)
  const hi = Math.min(lo + 1, NEUTRAL_STOPS.length - 1)
  return d3.interpolateRgb(NEUTRAL_STOPS[lo], NEUTRAL_STOPS[hi])(scaled - lo)
}

function descColor(levelIndex: number, totalLevels: number): string {
  if (totalLevels <= 1) return NEUTRAL_STOPS[1]
  return neutralColor(levelIndex / (totalLevels - 1))
}

/** Metric descriptions shown below the chart (matches column display order) */
const METRIC_DESCRIPTIONS: { label: string; description: string; color: "neutral" | "health" }[] = [
  { label: "Size", color: "neutral", description: "Company headcount bucket: Large (250+), Medium (50-249), Small (<50). Shown in blue — size is context, not a health indicator." },
  { label: "AI Intens.", color: "neutral", description: "AI Intensity — rated from product and technology signals. High = core AI/ML product with deep learning, generative AI, or simulation-driven AI. Medium = AI-augmented features. Low = minimal or no AI. Shown in blue — descriptive, not a health rating." },
  { label: "Cloud", color: "neutral", description: "Cloud delivery model classified from Operating Model Tags. Cloud-Native = cloud HPC or usage-based billing; SaaS = subscription cloud; Hybrid = cloud + on-prem; Edge/HW = hardware-centric; Traditional = on-prem/perpetual license. Shown in blue — descriptive." },
  { label: "Fin. Health", color: "health", description: "Composite score from Airtable (0-40) combining revenue strength, burn sustainability, and funding trajectory. Excellent (30+), Healthy (20-29), Moderate (10-19), Weak (<10)." },
  { label: "Cap. Eff.", color: "health", description: "Capital Efficiency from Airtable — how well the company converts total funding raised into revenue. High (green) = strong returns per dollar invested; Low (red) = poor conversion." },
  { label: "ARR/HC", color: "neutral", description: "Annual Recurring Revenue per employee from Airtable. The Bessemer/BVP industry benchmark is $200K/employee. Above $300K signals a highly efficient revenue engine; below $100K often indicates early-stage or heavy R&D spend. Shown in blue — absolute number." },
  { label: "ARR Eff. %", color: "neutral", description: "ARR Efficiency — (Estimated ARR / Total Funding) x 100. Measures how many cents of recurring revenue the company earns per dollar of capital raised. Above 100% means the company's ARR exceeds total capital raised. Shown in blue — absolute number." },
  { label: "vs $200K", color: "neutral", description: "ARR per Employee as a percentage of the $200K Bessemer/BVP SaaS benchmark. 100% = at benchmark, 150% = 50% above, <50% = underperforming. Shown in blue — absolute number." },
  { label: "Burn/mo", color: "neutral", description: "Monthly burn rate from Airtable (Annual Burn Proxy / 12). Shown in blue because absolute burn scales with company size — see Burn Lvl and Adj. Burn for health assessment." },
  { label: "Burn Lvl", color: "health", description: "Net Burn Level from Airtable — annual net burn (burn minus revenue) as a percentage of total funding raised. Green = low burn relative to capital (Very Low, Low); Red = high burn (High, Very High)." },
  { label: "Adj. Burn", color: "health", description: "Enhanced HR+Cloud+AI Burn Rate from Airtable — adjusted burn accounting for headcount costs, cloud infrastructure, and AI compute. Green = lean (Low); Red = heavy spend (Very High)." },
  { label: "Runway", color: "neutral", description: "Estimated months of runway remaining from Airtable. Shows infinity when revenue exceeds burn. Shown in blue — see Run. Qual for health assessment." },
  { label: "Run. Qual", color: "health", description: "Runway Quality from Airtable. Green = Very Strong (36+ months); Red = Critical (<6 months). The definitive health signal for cash position." },
  { label: "Conf.", color: "health", description: "Financial data confidence from Airtable. Green = Strong (verified/disclosed); Red = Low (estimated from sparse data)." },
]

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

  // Normalize numeric columns to 0-1 for color intensity
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
        } else if (col.type === "desc") {
          const val = (rec[col.key] as string) || ""
          const levelIdx = col.levels.indexOf(val)
          cellColor = levelIdx >= 0 ? descColor(levelIdx, col.levels.length) : "#334155"
          cellText = val || "—"
        } else {
          const raw = (rec[col.key] as number) || 0
          const norm = numScales.get(col.key)!(raw)
          if (col.neutral) {
            // Neutral blue — shows relative magnitude without implying good/bad
            cellColor = raw === 0 ? "#334155" : neutralColor(norm)
          } else {
            const t = col.higherIsGood ? 1 - norm : norm
            cellColor = raw === 0 ? "#334155" : rampColor(t)
          }
          cellText = raw > 0 ? col.format(raw) : "—"
        }

        // Clip group so text cannot spill outside the cell
        const clipId = `clip-${rec.id}-${col.key}`
        g.append("clipPath")
          .attr("id", clipId)
          .append("rect")
          .attr("x", cx + 2).attr("y", y)
          .attr("width", Math.max(0, bw - 4)).attr("height", bh)

        g.append("rect")
          .attr("x", cx).attr("y", y)
          .attr("width", bw).attr("height", bh)
          .attr("fill", cellColor).attr("rx", 4)
          .attr("opacity", 0.85)
          .style("cursor", "pointer")
          .on("mouseover", (event) => showTooltip(event, rec))
          .on("mousemove", moveTooltip)
          .on("mouseout", hideTooltip)

        // Truncate text to fit cell width (approx 7px per char at 11px font)
        const maxChars = Math.max(2, Math.floor(bw / 7))
        const displayText = cellText.length > maxChars ? cellText.slice(0, maxChars - 1) + "\u2026" : cellText

        g.append("text")
          .attr("x", cx + bw / 2).attr("y", y + bh / 2)
          .attr("text-anchor", "middle").attr("dominant-baseline", "central")
          .attr("fill", "#fff").attr("font-size", "11px").attr("font-weight", "600")
          .attr("pointer-events", "none")
          .attr("clip-path", `url(#${clipId})`)
          .text(displayText)
      }
    }

    // Remove default axis elements
    g.selectAll(".domain").remove()
    g.selectAll(".tick line").remove()

    function showTooltip(event: MouseEvent, rec: FundingRecord) {
      if (!tooltipRef.current) return
      const lines = [
        `<strong style="font-size:14px">${rec.company}</strong>`,
        `Cloud Model: <strong>${rec.cloudModel}</strong> (${rec.cloudSaasMultiplier}x multiplier)`,
        `AI Intensity: <strong>${rec.aiIntensity}</strong> (score: ${rec.aiIntensityScore})`,
        ``,
        ...COLUMNS.filter(col => col.key !== "cloudModel" && col.key !== "aiIntensity").map((col) => {
          if (col.type === "qual" || col.type === "desc") {
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
      </div>
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
      {/* Metric descriptions */}
      <div className="border-t border-border px-4 py-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">Metric Definitions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-muted-foreground">
          {METRIC_DESCRIPTIONS.map(m => (
            <div key={m.label}>
              <span className="font-semibold text-foreground">{m.label}</span>
              {" — "}{m.description}
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
        <div className="flex flex-wrap gap-4 pt-3 border-t border-border/50 mt-3">
          <span className="text-xs font-medium text-foreground mr-1">Health columns:</span>
          <span className="text-xs"><span className="inline-block w-3 h-3 rounded-sm mr-1" style={{background: "#16a34a"}} />Green = strong/healthy</span>
          <span className="text-xs"><span className="inline-block w-3 h-3 rounded-sm mr-1" style={{background: "#eab308"}} />Yellow = moderate</span>
          <span className="text-xs"><span className="inline-block w-3 h-3 rounded-sm mr-1" style={{background: "#ef4444"}} />Red = weak/at risk</span>
          <span className="text-xs font-medium text-foreground ml-2 mr-1">Neutral columns:</span>
          <span className="text-xs"><span className="inline-block w-3 h-3 rounded-sm mr-1" style={{background: "#2563eb"}} />Blue = factual data (no good/bad implied)</span>
          <span className="text-xs"><span className="inline-block w-3 h-3 rounded-sm mr-1" style={{background: "#334155"}} />Gray = no data</span>
        </div>
      </div>
    </Card>
  )
}
