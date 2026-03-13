"use client"

import React, { useEffect, useRef, useMemo, useState } from "react"
import * as d3 from "d3"
import type { Company } from "@/lib/company-data"
import { buildMetroData, type MetroEntry } from "@/lib/metro-areas"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MetroChartProps {
  data: Company[]
  className?: string
}

type SortMode = "count" | "funding"
type FilterMode = "all" | "us" | "europe" | "apac"

const COUNTRY_GROUPS: Record<FilterMode, Set<string> | null> = {
  all: null,
  us: new Set(["United States", "USA", "US", "Canada"]),
  europe: new Set([
    "United Kingdom", "UK", "Germany", "France", "Netherlands", "Switzerland",
    "Sweden", "Finland", "Norway", "Denmark", "Austria", "Belgium", "Italy",
    "Spain", "Ireland", "Czech Republic", "Poland", "Portugal",
  ]),
  apac: new Set([
    "India", "China", "Japan", "South Korea", "Australia", "Singapore",
    "New Zealand", "Taiwan", "Hong Kong",
  ]),
}

function formatFunding(val: number): string {
  if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`
  if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`
  if (val >= 1e3) return `$${(val / 1e3).toFixed(0)}K`
  return `$${val}`
}

export function MetroChart({ data, className }: MetroChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [sortMode, setSortMode] = useState<SortMode>("count")
  const [filterMode, setFilterMode] = useState<FilterMode>("all")
  const [topN, setTopN] = useState(30)

  const metros = useMemo(() => {
    let filtered = data
    const countrySet = COUNTRY_GROUPS[filterMode]
    if (countrySet) {
      filtered = data.filter(c => {
        const raw = (c.country || "").replace(/[\u{1F300}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, "").trim()
        return countrySet.has(raw)
      })
    }

    const all = buildMetroData(filtered)
    const sorted = sortMode === "funding"
      ? [...all].sort((a, b) => b.totalFunding - a.totalFunding)
      : all // already sorted by count

    return sorted.slice(0, topN)
  }, [data, sortMode, filterMode, topN])

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || metros.length === 0) return

    const container = containerRef.current
    const { width: containerWidth } = container.getBoundingClientRect()

    const margin = { top: 16, right: 120, bottom: 24, left: 160 }
    const barHeight = 24
    const barGap = 4
    const height = margin.top + margin.bottom + metros.length * (barHeight + barGap)
    const width = Math.max(containerWidth, 600)
    const innerWidth = width - margin.left - margin.right

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()
    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", width).attr("height", height)

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    const maxVal = sortMode === "funding"
      ? d3.max(metros, d => d.totalFunding) || 1
      : d3.max(metros, d => d.count) || 1

    const x = d3.scaleLinear().domain([0, maxVal]).range([0, innerWidth])

    const tooltip = d3.select(tooltipRef.current)

    // Color by country group
    const countryColor = (country: string): string => {
      const raw = country.replace(/[\u{1F300}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, "").trim()
      if (["United States", "USA", "US", "Canada"].includes(raw)) return "hsl(var(--primary))"
      if (["United Kingdom", "UK"].includes(raw)) return "#2E6DB4"
      if (["Germany"].includes(raw)) return "#F4B400"
      if (["France"].includes(raw)) return "#D45500"
      if (["Israel"].includes(raw)) return "#2BBFB3"
      if (["India", "China", "Japan", "South Korea", "Singapore", "Australia"].includes(raw)) return "#D642A6"
      return "#8FB3E8"
    }

    // Bars
    const bars = g.selectAll(".bar-group")
      .data(metros)
      .enter()
      .append("g")
      .attr("class", "bar-group")
      .attr("transform", (_, i) => `translate(0,${i * (barHeight + barGap)})`)

    bars.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", d => x(sortMode === "funding" ? d.totalFunding : d.count))
      .attr("height", barHeight)
      .attr("rx", 3)
      .attr("fill", d => countryColor(d.country))
      .attr("opacity", 0.85)
      .on("mouseenter", function (event, d) {
        d3.select(this).attr("opacity", 1)
        const top3 = d.companies.slice(0, 5).join(", ")
        const extra = d.companies.length > 5 ? ` +${d.companies.length - 5} more` : ""
        tooltip
          .style("opacity", 1)
          .html(`
            <div class="font-semibold">${d.metro}</div>
            <div class="text-xs text-muted-foreground">${d.country}</div>
            <div class="mt-1 text-xs">${d.count} companies · ${formatFunding(d.totalFunding)} funding</div>
            <div class="mt-1 text-xs text-muted-foreground">${top3}${extra}</div>
          `)
          .style("left", `${event.offsetX + 12}px`)
          .style("top", `${event.offsetY - 10}px`)
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.offsetX + 12}px`)
          .style("top", `${event.offsetY - 10}px`)
      })
      .on("mouseleave", function () {
        d3.select(this).attr("opacity", 0.85)
        tooltip.style("opacity", 0)
      })

    // Value labels (right of bar)
    bars.append("text")
      .attr("x", d => x(sortMode === "funding" ? d.totalFunding : d.count) + 6)
      .attr("y", barHeight / 2)
      .attr("dy", "0.35em")
      .attr("fill", "hsl(var(--muted-foreground))")
      .attr("font-size", "11px")
      .text(d => sortMode === "funding" ? formatFunding(d.totalFunding) : String(d.count))

    // Metro name labels (left of bar)
    bars.append("text")
      .attr("x", -8)
      .attr("y", barHeight / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .attr("fill", "hsl(var(--foreground))")
      .attr("font-size", "12px")
      .text(d => d.metro.length > 22 ? d.metro.slice(0, 20) + "…" : d.metro)

    // Country tag (smaller, muted)
    bars.append("text")
      .attr("x", -8)
      .attr("y", barHeight / 2 + 12)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .attr("fill", "hsl(var(--muted-foreground))")
      .attr("font-size", "9px")
      .attr("opacity", 0.7)
      .text(d => d.country)

  }, [metros, sortMode])

  const totalHeight = 16 + 24 + metros.length * 28

  return (
    <div className={className}>
      {/* Controls */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Select value={sortMode} onValueChange={v => setSortMode(v as SortMode)}>
          <SelectTrigger className="w-[160px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="count">Sort by # Startups</SelectItem>
            <SelectItem value="funding">Sort by Funding</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterMode} onValueChange={v => setFilterMode(v as FilterMode)}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="us">Americas</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
            <SelectItem value="apac">APAC</SelectItem>
          </SelectContent>
        </Select>

        <Select value={String(topN)} onValueChange={v => setTopN(Number(v))}>
          <SelectTrigger className="w-[100px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">Top 15</SelectItem>
            <SelectItem value="30">Top 30</SelectItem>
            <SelectItem value="50">Top 50</SelectItem>
            <SelectItem value="100">All</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-xs text-muted-foreground ml-auto">
          {metros.length} metro areas · {metros.reduce((s, m) => s + m.count, 0)} companies
        </span>
      </div>

      {/* Chart */}
      <div ref={containerRef} className="relative overflow-x-auto">
        <svg ref={svgRef} style={{ minHeight: Math.max(totalHeight, 200) }} />
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none bg-popover border border-border rounded-md px-3 py-2 shadow-lg text-sm z-50 max-w-xs"
          style={{ opacity: 0, transition: "opacity 0.15s" }}
        />
      </div>
    </div>
  )
}
