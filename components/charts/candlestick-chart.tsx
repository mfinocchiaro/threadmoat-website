"use client"

import React, { useEffect, useRef, useState, useMemo } from "react"
import * as d3 from "d3"
import { formatCurrency } from "@/lib/company-data"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { INVESTMENT_LIST_COLORS } from "@/lib/investment-colors"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface FundingRecord {
  id: string
  company: string
  investmentList: string
  cloudModel: string
  totalFunding: number
  estimatedRevenue: number
  estimatedMarketValue: number
  estimatedValuation: number
  fundingFloor: number
  estimatedValueFinal: number
  arrPerEmployee: number
  annualBurnProxy: number
  runwayProxyMonths: number
  financialConfidence: string
  valuationConfidence: string
  reportedValuation: string
  reportedValuationYear: string
  capitalEfficiency: string
  runwayQuality: string
  scoreFinancial: number
  startupSizeCategory: string
}

interface CandlestickChartProps {
  className?: string
  filteredCompanyNames?: Set<string>
}

// ─── Confidence → color mapping ──────────────────────────────────
const CONFIDENCE_COLORS: Record<string, string> = {
  Strong: "#22c55e",   // green-500
  Medium: "#f59e0b",   // amber-500
  Low:    "#ef4444",    // red-500
}

const RUNWAY_COLORS: Record<string, string> = {
  "Very Strong": "#15803d",  // green-700
  Healthy:       "#22c55e",  // green-500
  Comfortable:   "#84cc16",  // lime-500
  Tight:         "#f59e0b",  // amber-500
  "High Risk":   "#f97316",  // orange-500
  Critical:      "#ef4444",  // red-500
  Unknown:       "#6b7280",  // gray-500
}

type ViewMode = "valuation" | "revenue-burn"
type SortMode = "alphabetical" | "valuation-desc" | "confidence" | "segment"

function formatCompact(v: number): string {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`
  if (v > 0) return `$${v.toFixed(0)}`
  return "—"
}

export function CandlestickChart({ className, filteredCompanyNames }: CandlestickChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [fundingData, setFundingData] = useState<FundingRecord[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("valuation")
  const [sortMode, setSortMode] = useState<SortMode>("valuation-desc")
  const [segmentFilter, setSegmentFilter] = useState<string>("all")

  useEffect(() => {
    fetch("/api/funding")
      .then((r) => r.json())
      .then((result) => {
        if (result.success) setFundingData(result.data)
      })
  }, [])

  // Get available segments
  const segments = useMemo(() => {
    const s = new Set(fundingData.map(d => d.investmentList).filter(Boolean))
    return Array.from(s).sort()
  }, [fundingData])

  // Filter & sort data
  const chartData = useMemo(() => {
    let filtered = fundingData.filter(d => {
      if (filteredCompanyNames && !filteredCompanyNames.has(d.company)) return false
      if (segmentFilter !== "all" && d.investmentList !== segmentFilter) return false
      if (viewMode === "valuation") {
        // Need at least two of the three valuation anchors
        const anchors = [d.fundingFloor, d.estimatedValuation, d.estimatedValueFinal].filter(v => v > 0)
        return anchors.length >= 2
      } else {
        return d.estimatedRevenue > 0 && d.annualBurnProxy > 0
      }
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortMode) {
        case "valuation-desc":
          return (b.estimatedValueFinal || b.estimatedValuation) - (a.estimatedValueFinal || a.estimatedValuation)
        case "confidence": {
          const order: Record<string, number> = { Strong: 0, Medium: 1, Low: 2 }
          return (order[a.financialConfidence] ?? 3) - (order[b.financialConfidence] ?? 3)
        }
        case "segment":
          return (a.investmentList || "").localeCompare(b.investmentList || "") ||
            (b.estimatedValueFinal || 0) - (a.estimatedValueFinal || 0)
        default:
          return a.company.localeCompare(b.company)
      }
    })

    return filtered.slice(0, 80) // Cap at 80 for readability
  }, [fundingData, filteredCompanyNames, segmentFilter, viewMode, sortMode])

  // ─── D3 Rendering ──────────────────────────────────────────────
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || chartData.length === 0) return

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight
    if (!width || !height) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()
    svg.attr("width", width).attr("height", height)

    const margin = { top: 30, right: 20, bottom: 120, left: 70 }
    const plotW = width - margin.left - margin.right
    const plotH = height - margin.top - margin.bottom

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    const tooltipEl = tooltipRef.current
    if (!tooltipEl) return
    const tooltip = d3.select(tooltipEl)

    if (viewMode === "valuation") {
      renderValuationCandlestick(g, chartData, plotW, plotH, margin, tooltip, width)
    } else {
      renderRevenueBurnChart(g, chartData, plotW, plotH, margin, tooltip, width)
    }

    // X-axis labels (company names)
    const xScale = d3.scaleBand()
      .domain(chartData.map(d => d.company))
      .range([0, plotW])
      .padding(0.3)

    g.append("g")
      .attr("transform", `translate(0,${plotH})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "10px")
      .style("fill", "hsl(var(--muted-foreground))")
      .text(function () {
        const t = d3.select(this).text()
        return t.length > 18 ? t.slice(0, 16) + "…" : t
      })

    g.selectAll(".domain, .tick line").style("stroke", "hsl(var(--border))")

  }, [chartData, viewMode])

  return (
    <Card className={cn("p-6", className)}>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Select value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="valuation">Valuation Range</SelectItem>
            <SelectItem value="revenue-burn">Revenue vs Burn</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortMode} onValueChange={(v) => setSortMode(v as SortMode)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="valuation-desc">By Valuation</SelectItem>
            <SelectItem value="confidence">By Confidence</SelectItem>
            <SelectItem value="segment">By Segment</SelectItem>
            <SelectItem value="alphabetical">A → Z</SelectItem>
          </SelectContent>
        </Select>

        <Select value={segmentFilter} onValueChange={setSegmentFilter}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="All Segments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Segments</SelectItem>
            {segments.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-xs text-muted-foreground ml-auto">
          {chartData.length} companies shown
        </span>

        {/* Legend */}
        <div className="flex gap-3 text-xs">
          {viewMode === "valuation" ? (
            <>
              <span className="flex items-center gap-1">
                <span className="size-2.5 rounded-full bg-emerald-500" /> Strong
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2.5 rounded-full bg-amber-500" /> Medium
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2.5 rounded-full bg-red-500" /> Low
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1">
                <span className="size-2.5 rounded-full bg-emerald-500" /> Revenue
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2.5 rounded-full bg-red-400" /> Burn
              </span>
            </>
          )}
        </div>
      </div>

      <div ref={containerRef} className="w-full h-[520px] relative">
        <svg ref={svgRef} className="w-full h-full" />
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none opacity-0 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg px-4 py-3 text-sm z-50 max-w-xs transition-opacity duration-150"
        />
      </div>
    </Card>
  )
}

// ─── Valuation Candlestick Renderer ──────────────────────────────
// Each bar shows: Funding Floor (wick low) → Estimated Valuation (body) → Market Value (wick high)
// Body = range between ARR-derived valuation and final estimated value
// Color = Financial Confidence

function renderValuationCandlestick(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: FundingRecord[],
  plotW: number,
  plotH: number,
  margin: { top: number; right: number; bottom: number; left: number },
  tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>,
  totalWidth: number
) {
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.company))
    .range([0, plotW])
    .padding(0.3)

  // Compute per-company ranges
  const ranges = data.map(d => {
    const low = Math.min(
      ...[d.fundingFloor, d.estimatedValuation, d.estimatedValueFinal, d.estimatedMarketValue].filter(v => v > 0)
    )
    const high = Math.max(
      ...[d.fundingFloor, d.estimatedValuation, d.estimatedValueFinal, d.estimatedMarketValue].filter(v => v > 0)
    )
    // Body = the ARR-based valuation vs the final estimate
    const bodyLow = Math.min(d.estimatedValuation || Infinity, d.estimatedValueFinal || Infinity)
    const bodyHigh = Math.max(d.estimatedValuation || 0, d.estimatedValueFinal || 0)
    return { ...d, low, high, bodyLow: bodyLow === Infinity ? low : bodyLow, bodyHigh: bodyHigh || high }
  })

  const yMax = d3.max(ranges, d => d.high) || 1
  const yScale = d3.scaleLog()
    .domain([Math.max(1e5, d3.min(ranges, d => d.low) || 1e5), yMax * 1.2])
    .range([plotH, 0])
    .clamp(true)

  // Y-axis
  g.append("g")
    .call(d3.axisLeft(yScale)
      .ticks(6, (d: number) => formatCompact(d))
    )
    .selectAll("text")
    .style("font-size", "11px")
    .style("fill", "hsl(var(--muted-foreground))")

  g.selectAll(".domain, .tick line").style("stroke", "hsl(var(--border))")

  // Y-axis label
  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -plotH / 2)
    .attr("y", -55)
    .attr("text-anchor", "middle")
    .style("font-size", "11px")
    .style("fill", "hsl(var(--muted-foreground))")
    .text("Valuation Range (log scale)")

  // Grid lines
  g.append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(yScale).ticks(6).tickSize(-plotW).tickFormat(() => ""))
    .selectAll("line")
    .style("stroke", "hsl(var(--border))")
    .style("stroke-opacity", 0.3)
  g.select(".grid .domain").remove()

  // Draw candlesticks
  const barGroup = g.selectAll(".candle")
    .data(ranges)
    .join("g")
    .attr("class", "candle")
    .attr("transform", d => `translate(${(xScale(d.company) || 0) + xScale.bandwidth() / 2}, 0)`)

  // Wick (thin line from low to high)
  barGroup.append("line")
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", d => yScale(d.high))
    .attr("y2", d => yScale(d.low))
    .attr("stroke", d => CONFIDENCE_COLORS[d.financialConfidence] || "#6b7280")
    .attr("stroke-width", 1.5)
    .attr("stroke-opacity", 0.6)

  // Body (thick rect between body low and body high)
  const halfBar = Math.min(xScale.bandwidth() / 2, 14)
  barGroup.append("rect")
    .attr("x", -halfBar)
    .attr("y", d => yScale(d.bodyHigh))
    .attr("width", halfBar * 2)
    .attr("height", d => Math.max(2, yScale(d.bodyLow) - yScale(d.bodyHigh)))
    .attr("rx", 2)
    .attr("fill", d => CONFIDENCE_COLORS[d.financialConfidence] || "#6b7280")
    .attr("fill-opacity", 0.7)
    .attr("stroke", d => CONFIDENCE_COLORS[d.financialConfidence] || "#6b7280")
    .attr("stroke-width", 1)

  // Funding floor marker (horizontal tick)
  barGroup.filter(d => d.fundingFloor > 0)
    .append("line")
    .attr("x1", -halfBar - 2)
    .attr("x2", halfBar + 2)
    .attr("y1", d => yScale(d.fundingFloor))
    .attr("y2", d => yScale(d.fundingFloor))
    .attr("stroke", "hsl(var(--muted-foreground))")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "2,2")

  // Tooltip interaction
  barGroup.append("rect")
    .attr("x", -xScale.bandwidth() / 2)
    .attr("y", 0)
    .attr("width", xScale.bandwidth())
    .attr("height", plotH)
    .attr("fill", "transparent")
    .attr("cursor", "pointer")
    .on("mouseenter", (event, d) => {
      tooltip
        .style("opacity", "1")
        .html(`
          <div class="font-semibold mb-1">${d.company}</div>
          <div class="text-xs text-muted-foreground mb-2">${d.investmentList || "—"}</div>
          <div class="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
            <span class="text-muted-foreground">Market Value:</span>
            <span class="font-medium">${formatCompact(d.estimatedMarketValue)}</span>
            <span class="text-muted-foreground">Est. Valuation:</span>
            <span class="font-medium">${formatCompact(d.estimatedValuation)}</span>
            <span class="text-muted-foreground">Final Estimate:</span>
            <span class="font-medium">${formatCompact(d.estimatedValueFinal)}</span>
            <span class="text-muted-foreground">Funding Floor:</span>
            <span class="font-medium">${formatCompact(d.fundingFloor)}</span>
            <span class="text-muted-foreground">Total Funding:</span>
            <span class="font-medium">${formatCompact(d.totalFunding)}</span>
            <span class="text-muted-foreground">Revenue:</span>
            <span class="font-medium">${formatCompact(d.estimatedRevenue)}</span>
            <span class="text-muted-foreground">Confidence:</span>
            <span class="font-medium" style="color: ${CONFIDENCE_COLORS[d.financialConfidence] || "#6b7280"}">${d.financialConfidence || "—"}</span>
            <span class="text-muted-foreground">Val. Confidence:</span>
            <span class="font-medium" style="color: ${CONFIDENCE_COLORS[d.valuationConfidence] || "#6b7280"}">${d.valuationConfidence || "—"}</span>
            ${d.reportedValuation ? `<span class="text-muted-foreground">Reported Val.:</span><span class="font-medium">${d.reportedValuation}</span>` : ""}
            ${d.reportedValuationYear ? `<span class="text-muted-foreground">Val. Year:</span><span class="font-medium">${d.reportedValuationYear}</span>` : ""}
          </div>
        `)
    })
    .on("mousemove", (event) => {
      const [mx, my] = d3.pointer(event, event.currentTarget.closest("svg"))
      const ttNode = tooltip.node()
      const ttW = ttNode?.offsetWidth || 200
      const left = mx + 15 + ttW > totalWidth ? mx - ttW - 10 : mx + 15
      tooltip
        .style("left", `${left}px`)
        .style("top", `${my - 10}px`)
    })
    .on("mouseleave", () => {
      tooltip.style("opacity", "0")
    })
}

// ─── Revenue vs Burn Renderer ────────────────────────────────────
// Paired bars: revenue (green) vs annual burn (red), colored by runway quality

function renderRevenueBurnChart(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: FundingRecord[],
  plotW: number,
  plotH: number,
  margin: { top: number; right: number; bottom: number; left: number },
  tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>,
  totalWidth: number
) {
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.company))
    .range([0, plotW])
    .padding(0.2)

  const yMax = d3.max(data, d => Math.max(d.estimatedRevenue, d.annualBurnProxy)) || 1
  const yScale = d3.scaleLinear()
    .domain([0, yMax * 1.1])
    .range([plotH, 0])

  // Y-axis
  g.append("g")
    .call(d3.axisLeft(yScale).ticks(6).tickFormat(d => formatCompact(d as number)))
    .selectAll("text")
    .style("font-size", "11px")
    .style("fill", "hsl(var(--muted-foreground))")

  g.selectAll(".domain, .tick line").style("stroke", "hsl(var(--border))")

  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -plotH / 2)
    .attr("y", -55)
    .attr("text-anchor", "middle")
    .style("font-size", "11px")
    .style("fill", "hsl(var(--muted-foreground))")
    .text("Annual Amount ($)")

  // Grid
  g.append("g")
    .call(d3.axisLeft(yScale).ticks(6).tickSize(-plotW).tickFormat(() => ""))
    .selectAll("line")
    .style("stroke", "hsl(var(--border))")
    .style("stroke-opacity", 0.3)
  g.select(".grid .domain").remove()

  const barW = Math.min(xScale.bandwidth() / 2 - 1, 16)

  // Revenue bars
  g.selectAll(".rev-bar")
    .data(data)
    .join("rect")
    .attr("class", "rev-bar")
    .attr("x", d => (xScale(d.company) || 0) + xScale.bandwidth() / 2 - barW - 1)
    .attr("y", d => yScale(d.estimatedRevenue))
    .attr("width", barW)
    .attr("height", d => plotH - yScale(d.estimatedRevenue))
    .attr("rx", 2)
    .attr("fill", "#22c55e")
    .attr("fill-opacity", 0.7)

  // Burn bars
  g.selectAll(".burn-bar")
    .data(data)
    .join("rect")
    .attr("class", "burn-bar")
    .attr("x", d => (xScale(d.company) || 0) + xScale.bandwidth() / 2 + 1)
    .attr("y", d => yScale(d.annualBurnProxy))
    .attr("width", barW)
    .attr("height", d => plotH - yScale(d.annualBurnProxy))
    .attr("rx", 2)
    .attr("fill", d => RUNWAY_COLORS[d.runwayQuality] || "#ef4444")
    .attr("fill-opacity", 0.7)

  // Runway indicator line at top of burn bar
  g.selectAll(".runway-tick")
    .data(data)
    .join("text")
    .attr("class", "runway-tick")
    .attr("x", d => (xScale(d.company) || 0) + xScale.bandwidth() / 2 + 1 + barW / 2)
    .attr("y", d => yScale(Math.max(d.estimatedRevenue, d.annualBurnProxy)) - 4)
    .attr("text-anchor", "middle")
    .style("font-size", "9px")
    .style("fill", d => RUNWAY_COLORS[d.runwayQuality] || "#6b7280")
    .text(d => d.runwayProxyMonths > 0 && d.runwayProxyMonths < 999 ? `${d.runwayProxyMonths}mo` : "")

  // Tooltip hitbox
  g.selectAll(".hitbox")
    .data(data)
    .join("rect")
    .attr("class", "hitbox")
    .attr("x", d => xScale(d.company) || 0)
    .attr("y", 0)
    .attr("width", xScale.bandwidth())
    .attr("height", plotH)
    .attr("fill", "transparent")
    .attr("cursor", "pointer")
    .on("mouseenter", (event, d) => {
      tooltip
        .style("opacity", "1")
        .html(`
          <div class="font-semibold mb-1">${d.company}</div>
          <div class="text-xs text-muted-foreground mb-2">${d.investmentList || "—"}</div>
          <div class="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
            <span class="text-muted-foreground">Est. Revenue:</span>
            <span class="font-medium text-emerald-500">${formatCompact(d.estimatedRevenue)}</span>
            <span class="text-muted-foreground">Annual Burn:</span>
            <span class="font-medium text-red-400">${formatCompact(d.annualBurnProxy)}</span>
            <span class="text-muted-foreground">ARR/Employee:</span>
            <span class="font-medium">${formatCompact(d.arrPerEmployee)}</span>
            <span class="text-muted-foreground">Runway:</span>
            <span class="font-medium" style="color: ${RUNWAY_COLORS[d.runwayQuality] || "#6b7280"}">${d.runwayProxyMonths > 0 && d.runwayProxyMonths < 999 ? `${d.runwayProxyMonths} months` : "—"}</span>
            <span class="text-muted-foreground">Runway Quality:</span>
            <span class="font-medium" style="color: ${RUNWAY_COLORS[d.runwayQuality] || "#6b7280"}">${d.runwayQuality || "—"}</span>
            <span class="text-muted-foreground">Confidence:</span>
            <span class="font-medium" style="color: ${CONFIDENCE_COLORS[d.financialConfidence] || "#6b7280"}">${d.financialConfidence || "—"}</span>
          </div>
        `)
    })
    .on("mousemove", (event) => {
      const [mx, my] = d3.pointer(event, event.currentTarget.closest("svg"))
      const ttNode = tooltip.node()
      const ttW = ttNode?.offsetWidth || 200
      const left = mx + 15 + ttW > totalWidth ? mx - ttW - 10 : mx + 15
      tooltip
        .style("left", `${left}px`)
        .style("top", `${my - 10}px`)
    })
    .on("mouseleave", () => {
      tooltip.style("opacity", "0")
    })
}
