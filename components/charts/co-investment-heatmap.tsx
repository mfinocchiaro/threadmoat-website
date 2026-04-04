"use client"

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react"
import * as d3 from "d3"
import { Company, formatCurrency } from "@/lib/company-data"
import { cn, contrastTextColor } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface CoInvestmentHeatmapProps {
  data: Company[]
  className?: string
}

interface CoInvestPair {
  investorA: string
  investorB: string
  count: number
  companies: { name: string; id: string; funding: number }[]
}

interface DrillDownData {
  investorA: string
  investorB: string
  companies: { name: string; id: string; funding: number }[]
}

const EXCLUDED_INVESTORS = new Set([
  "bootstrapped", "angel funded", "undisclosed", "unknown", "n a", "n/a",
  "self-funded", "self funded", "none", "undisclosed or unknown",
])

const TOP_N = 25
const MIN_CO_OPTIONS = ["1", "2", "3", "5"]

export function CoInvestmentHeatmap({ data, className }: CoInvestmentHeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [minCoInvest, setMinCoInvest] = useState("2")
  const [drillDown, setDrillDown] = useState<DrillDownData | null>(null)

  // Compute co-investment matrix
  const { pairMap, topInvestors, maxCount } = useMemo(() => {
    // Count how many companies each investor backs
    const investorCompanyCount = new Map<string, number>()
    // Build co-investment pairs
    const pairs = new Map<string, CoInvestPair>()

    for (const company of data) {
      const investors = (company.investors || [])
        .map(i => i.trim())
        .filter(i => i && !EXCLUDED_INVESTORS.has(i.toLowerCase()))
        // Filter out Airtable dict fragments
        .filter(i => !i.includes("'state'") && !i.includes("'isStale'") && !i.startsWith("{"))

      if (investors.length < 2) continue

      // Count per investor
      for (const inv of investors) {
        investorCompanyCount.set(inv, (investorCompanyCount.get(inv) || 0) + 1)
      }

      // Generate all pairs
      for (let i = 0; i < investors.length; i++) {
        for (let j = i + 1; j < investors.length; j++) {
          const [a, b] = [investors[i], investors[j]].sort()
          const key = `${a}|||${b}`
          const existing = pairs.get(key)
          if (existing) {
            existing.count++
            existing.companies.push({ name: company.name, id: company.id, funding: company.totalFunding || 0 })
          } else {
            pairs.set(key, {
              investorA: a,
              investorB: b,
              count: 1,
              companies: [{ name: company.name, id: company.id, funding: company.totalFunding || 0 }],
            })
          }
        }
      }
    }

    // Filter pairs by minimum threshold
    const minThreshold = parseInt(minCoInvest) || 2
    const filteredPairs = Array.from(pairs.values()).filter(p => p.count >= minThreshold)

    // Find top investors by co-investment involvement
    const investorScore = new Map<string, number>()
    for (const pair of filteredPairs) {
      investorScore.set(pair.investorA, (investorScore.get(pair.investorA) || 0) + pair.count)
      investorScore.set(pair.investorB, (investorScore.get(pair.investorB) || 0) + pair.count)
    }

    const topInvs = Array.from(investorScore.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_N)
      .map(([name]) => name)

    const topSet = new Set(topInvs)

    // Build pair lookup for top investors only
    const pairLookup = new Map<string, CoInvestPair>()
    let max = 0
    for (const pair of filteredPairs) {
      if (topSet.has(pair.investorA) && topSet.has(pair.investorB)) {
        const key = `${pair.investorA}|||${pair.investorB}`
        pairLookup.set(key, pair)
        if (pair.count > max) max = pair.count
      }
    }

    return { pairMap: pairLookup, topInvestors: topInvs, maxCount: max }
  }, [data, minCoInvest])

  const handleCellClick = useCallback((investorA: string, investorB: string) => {
    const [a, b] = [investorA, investorB].sort()
    const pair = pairMap.get(`${a}|||${b}`)
    if (pair && pair.count > 0) {
      setDrillDown({
        investorA: a,
        investorB: b,
        companies: pair.companies.sort((x, y) => y.funding - x.funding),
      })
    }
  }, [pairMap])

  // D3 heatmap rendering
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || topInvestors.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const containerWidth = containerRef.current.clientWidth
    const margin = { top: 160, right: 30, bottom: 30, left: 180 }
    const cellSize = Math.max(14, Math.min(28, (containerWidth - margin.left - margin.right) / topInvestors.length))
    const width = margin.left + cellSize * topInvestors.length + margin.right
    const height = margin.top + cellSize * topInvestors.length + margin.bottom

    svg.attr("width", width).attr("height", height).attr("viewBox", `0 0 ${width} ${height}`)

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Color scale
    const colorScale = d3.scaleSequential(d3.interpolatePurples).domain([0, maxCount])

    // X axis labels (top, rotated)
    g.selectAll(".x-label")
      .data(topInvestors)
      .enter()
      .append("text")
      .attr("class", "x-label")
      .attr("x", (_, i) => i * cellSize + cellSize / 2)
      .attr("y", -8)
      .attr("text-anchor", "start")
      .attr("transform", (_, i) => `rotate(-55, ${i * cellSize + cellSize / 2}, -8)`)
      .attr("font-size", Math.min(11, cellSize * 0.5))
      .attr("fill", "currentColor")
      .text(d => d.length > 18 ? d.slice(0, 16) + "…" : d)

    // Y axis labels (left)
    g.selectAll(".y-label")
      .data(topInvestors)
      .enter()
      .append("text")
      .attr("class", "y-label")
      .attr("x", -8)
      .attr("y", (_, i) => i * cellSize + cellSize / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("font-size", Math.min(11, cellSize * 0.5))
      .attr("fill", "currentColor")
      .text(d => d.length > 22 ? d.slice(0, 20) + "…" : d)

    // Cells
    for (let row = 0; row < topInvestors.length; row++) {
      for (let col = 0; col < topInvestors.length; col++) {
        if (row === col) continue // skip diagonal

        const [a, b] = [topInvestors[row], topInvestors[col]].sort()
        const pair = pairMap.get(`${a}|||${b}`)
        const count = pair?.count || 0

        if (count === 0) continue

        const color = colorScale(count)

        g.append("rect")
          .attr("x", col * cellSize)
          .attr("y", row * cellSize)
          .attr("width", cellSize - 1)
          .attr("height", cellSize - 1)
          .attr("rx", 2)
          .attr("fill", color)
          .attr("cursor", "pointer")
          .attr("class", "heatmap-cell")
          .on("click", () => handleCellClick(topInvestors[row], topInvestors[col]))
          .on("mouseenter", function (event) {
            d3.select(this).attr("stroke", "var(--foreground)").attr("stroke-width", 2)
            if (tooltipRef.current) {
              tooltipRef.current.style.display = "block"
              tooltipRef.current.style.left = `${event.pageX + 12}px`
              tooltipRef.current.style.top = `${event.pageY - 10}px`
              tooltipRef.current.innerHTML = `
                <div class="font-semibold text-xs">${topInvestors[row]} × ${topInvestors[col]}</div>
                <div class="text-[11px] text-muted-foreground mt-0.5">${count} shared compan${count === 1 ? "y" : "ies"}</div>
                <div class="text-[10px] text-muted-foreground/70 mt-0.5">Click for details</div>
              `
            }
          })
          .on("mousemove", function (event) {
            if (tooltipRef.current) {
              tooltipRef.current.style.left = `${event.pageX + 12}px`
              tooltipRef.current.style.top = `${event.pageY - 10}px`
            }
          })
          .on("mouseleave", function () {
            d3.select(this).attr("stroke", "none")
            if (tooltipRef.current) tooltipRef.current.style.display = "none"
          })

        // Cell text for larger cells
        if (cellSize >= 20 && count > 0) {
          g.append("text")
            .attr("x", col * cellSize + cellSize / 2 - 0.5)
            .attr("y", row * cellSize + cellSize / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("font-size", Math.min(10, cellSize * 0.4))
            .attr("fill", contrastTextColor(color))
            .attr("pointer-events", "none")
            .text(count)
        }
      }
    }

    // Legend
    const legendWidth = 120
    const legendHeight = 10
    const legendX = topInvestors.length * cellSize - legendWidth
    const legendY = topInvestors.length * cellSize + 15

    const defs = svg.append("defs")
    const gradientId = "co-invest-legend-grad"
    const gradient = defs.append("linearGradient").attr("id", gradientId)
    gradient.append("stop").attr("offset", "0%").attr("stop-color", colorScale(0))
    gradient.append("stop").attr("offset", "100%").attr("stop-color", colorScale(maxCount))

    g.append("rect")
      .attr("x", legendX)
      .attr("y", legendY)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("fill", `url(#${gradientId})`)
      .attr("rx", 2)

    g.append("text")
      .attr("x", legendX)
      .attr("y", legendY + legendHeight + 12)
      .attr("font-size", 9)
      .attr("fill", "currentColor")
      .text("0")

    g.append("text")
      .attr("x", legendX + legendWidth)
      .attr("y", legendY + legendHeight + 12)
      .attr("text-anchor", "end")
      .attr("font-size", 9)
      .attr("fill", "currentColor")
      .text(String(maxCount))

    g.append("text")
      .attr("x", legendX + legendWidth / 2)
      .attr("y", legendY - 4)
      .attr("text-anchor", "middle")
      .attr("font-size", 9)
      .attr("fill", "currentColor")
      .attr("opacity", 0.7)
      .text("Shared companies")

  }, [topInvestors, pairMap, maxCount, handleCellClick])

  // Summary stats
  const stats = useMemo(() => {
    const totalPairs = pairMap.size
    const totalShared = Array.from(pairMap.values()).reduce((s, p) => s + p.count, 0)
    const topPair = Array.from(pairMap.values()).sort((a, b) => b.count - a.count)[0]
    return { totalPairs, totalShared, topPair }
  }, [pairMap])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border border-border/60 rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Co-Investor Pairs</div>
          <div className="text-2xl font-bold">{stats.totalPairs}</div>
        </div>
        <div className="bg-card border border-border/60 rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Total Shared Deals</div>
          <div className="text-2xl font-bold">{stats.totalShared}</div>
        </div>
        <div className="bg-card border border-border/60 rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Top Investors Shown</div>
          <div className="text-2xl font-bold">{topInvestors.length}</div>
        </div>
        <div className="bg-card border border-border/60 rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Strongest Pair</div>
          <div className="text-sm font-bold truncate">
            {stats.topPair
              ? `${stats.topPair.investorA.split(" ").slice(0, 2).join(" ")} × ${stats.topPair.investorB.split(" ").slice(0, 2).join(" ")}`
              : "—"}
          </div>
          {stats.topPair && (
            <div className="text-xs text-muted-foreground">{stats.topPair.count} shared</div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Min. shared companies</Label>
          <Select value={minCoInvest} onValueChange={setMinCoInvest}>
            <SelectTrigger className="w-28 h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MIN_CO_OPTIONS.map(v => (
                <SelectItem key={v} value={v}>{v}+</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Heatmap */}
      <div ref={containerRef} className="relative overflow-x-auto">
        {topInvestors.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">
            No co-investment pairs found with the current filter. Try lowering the minimum.
          </div>
        ) : (
          <svg ref={svgRef} className="mx-auto" />
        )}
        <div
          ref={tooltipRef}
          className="fixed hidden z-50 pointer-events-none bg-popover text-popover-foreground border border-border rounded-md shadow-md px-3 py-2"
          style={{ display: "none" }}
        />
      </div>

      {/* Drill-down dialog */}
      <Dialog open={!!drillDown} onOpenChange={() => setDrillDown(null)}>
        <DialogContent className="max-w-lg max-h-[75vh] overflow-y-auto">
          {drillDown && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">
                  {drillDown.investorA} × {drillDown.investorB}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {drillDown.companies.length} shared compan{drillDown.companies.length === 1 ? "y" : "ies"}
                </p>
              </DialogHeader>
              <div className="space-y-2 mt-2">
                {drillDown.companies.map((c) => (
                  <div key={c.id} className="flex items-center justify-between bg-muted border border-border rounded-lg px-3 py-2">
                    <span className="font-medium text-sm">{c.name}</span>
                    <Badge variant="outline" className="text-xs font-mono">
                      {formatCurrency(c.funding)}
                    </Badge>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
