"use client"

import { useMemo, useState } from "react"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import type { Company } from "@/lib/company-data"

interface CategoryHHI {
  category: string
  hhi: number
  companyCount: number
  topPlayer: string
  topPlayerShare: number
  concentration: "High" | "Moderate" | "Low"
}

function computeHHI(companies: Company[], groupBy: "discipline" | "investmentList"): CategoryHHI[] {
  // Group companies by category
  const groups = new Map<string, Company[]>()
  for (const c of companies) {
    const key = (groupBy === "discipline" ? c.discipline : c.investmentList) || "Uncategorized"
    if (!key || key === "Uncategorized") continue
    const list = groups.get(key) || []
    list.push(c)
    groups.set(key, list)
  }

  const results: CategoryHHI[] = []

  for (const [category, members] of groups) {
    if (members.length < 2) continue

    // Use weightedScore as proxy for market share
    const totalScore = members.reduce((sum, c) => sum + (c.weightedScore || 0), 0)
    if (totalScore === 0) continue

    // Compute HHI: sum of squared market shares (0-10000 scale)
    let hhi = 0
    let topPlayer = ""
    let topPlayerShare = 0

    for (const c of members) {
      const share = ((c.weightedScore || 0) / totalScore) * 100
      hhi += share * share
      if (share > topPlayerShare) {
        topPlayerShare = share
        topPlayer = c.name
      }
    }

    const concentration: "High" | "Moderate" | "Low" =
      hhi > 2500 ? "High" : hhi > 1500 ? "Moderate" : "Low"

    results.push({
      category,
      hhi: Math.round(hhi),
      companyCount: members.length,
      topPlayer,
      topPlayerShare: Math.round(topPlayerShare * 10) / 10,
      concentration,
    })
  }

  return results.sort((a, b) => b.hhi - a.hhi)
}

function concentrationColor(level: string): string {
  if (level === "High") return "text-red-500"
  if (level === "Moderate") return "text-amber-500"
  return "text-green-500"
}

function concentrationBadge(level: string): "destructive" | "secondary" | "default" {
  if (level === "High") return "destructive"
  if (level === "Moderate") return "secondary"
  return "default"
}

function MarketConcentrationInner() {
  const { filtered, isLoading } = useThesisGatedData()
  const [groupBy, setGroupBy] = useState<"discipline" | "investmentList">("discipline")

  const hhiData = useMemo(() => computeHHI(filtered, groupBy), [filtered, groupBy])

  const maxHHI = Math.max(...hhiData.map(h => h.hhi), 1)

  if (isLoading) return <Skeleton className="h-[600px] rounded-xl" />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Market Concentration (HHI)</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Herfindahl-Hirschman Index by category. HHI &gt; 2500 = highly concentrated,
          1500-2500 = moderately concentrated, &lt; 1500 = competitive.
          Uses weighted quality scores as market share proxy.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setGroupBy("discipline")}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            groupBy === "discipline"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          By Discipline
        </button>
        <button
          onClick={() => setGroupBy("investmentList")}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            groupBy === "investmentList"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          By Investment List
        </button>
      </div>

      <div className="rounded-lg border border-border overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-3 py-2 font-medium">Category</th>
              <th className="text-left px-3 py-2 font-medium">HHI</th>
              <th className="text-left px-3 py-2 font-medium w-48">Distribution</th>
              <th className="text-left px-3 py-2 font-medium">Level</th>
              <th className="text-left px-3 py-2 font-medium">Companies</th>
              <th className="text-left px-3 py-2 font-medium">Top Player</th>
            </tr>
          </thead>
          <tbody>
            {hhiData.map(h => (
              <tr key={h.category} className="border-b border-border/50 hover:bg-muted/30">
                <td className="px-3 py-2 font-medium max-w-[200px] truncate">{h.category}</td>
                <td className="px-3 py-2">
                  <span className={`font-mono font-bold ${concentrationColor(h.concentration)}`}>
                    {h.hhi}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="h-3 w-full rounded bg-muted/50 overflow-hidden">
                    <div
                      className={`h-full rounded transition-all duration-500 ${
                        h.concentration === "High"
                          ? "bg-red-500/60"
                          : h.concentration === "Moderate"
                            ? "bg-amber-500/60"
                            : "bg-green-500/60"
                      }`}
                      style={{ width: `${(h.hhi / maxHHI) * 100}%` }}
                    />
                  </div>
                </td>
                <td className="px-3 py-2">
                  <Badge variant={concentrationBadge(h.concentration)} className="text-xs">
                    {h.concentration}
                  </Badge>
                </td>
                <td className="px-3 py-2 text-muted-foreground">{h.companyCount}</td>
                <td className="px-3 py-2">
                  <div className="text-xs">
                    <span className="font-medium">{h.topPlayer}</span>
                    <span className="text-muted-foreground ml-1">({h.topPlayerShare}%)</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border p-3 bg-card text-center">
          <div className="text-2xl font-bold text-red-500">
            {hhiData.filter(h => h.concentration === "High").length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Highly Concentrated</div>
        </div>
        <div className="rounded-lg border border-border p-3 bg-card text-center">
          <div className="text-2xl font-bold text-amber-500">
            {hhiData.filter(h => h.concentration === "Moderate").length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Moderate</div>
        </div>
        <div className="rounded-lg border border-border p-3 bg-card text-center">
          <div className="text-2xl font-bold text-green-500">
            {hhiData.filter(h => h.concentration === "Low").length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Competitive</div>
        </div>
      </div>
    </div>
  )
}

export default function MarketConcentrationPage() {
  return (
    <VizPageShell>
      <MarketConcentrationInner />
    </VizPageShell>
  )
}
