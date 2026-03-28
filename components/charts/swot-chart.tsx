"use client"

import React, { useState, useMemo, useRef } from "react"
import { Company, formatCurrency } from "@/lib/company-data"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Plus, X, ShieldCheck, ShieldAlert, Lightbulb, AlertTriangle } from "lucide-react"
import { getInvestmentColor } from "@/lib/investment-colors"

interface SwotChartProps {
  data: Company[]
  className?: string
}

// ─── Score-to-SWOT derivation logic ──────────────────────────────
// Strengths:  metrics scoring >= 4
// Weaknesses: metrics scoring <= 2
// Opportunities: derived from market signals + high market opp
// Threats: derived from competitive pressure + low scores

interface SwotMetric {
  key: keyof Company
  label: string
}

const SCORE_METRICS: SwotMetric[] = [
  { key: "competitiveMoat", label: "Competitive Moat" },
  { key: "marketOpportunity", label: "Market Opportunity" },
  { key: "techDifferentiation", label: "Tech Differentiation" },
  { key: "teamExecution", label: "Team Execution" },
  { key: "industryImpact", label: "Industry Impact" },
  { key: "growthMetrics", label: "Growth Metrics" },
  { key: "fundingEfficiency", label: "Funding Efficiency" },
]

interface SwotItem {
  label: string
  value: number
  justification?: string
  companies?: Company[]  // Backing companies for drill-down links
}

interface SwotData {
  strengths: SwotItem[]
  weaknesses: SwotItem[]
  opportunities: SwotItem[]
  threats: SwotItem[]
}

const JUSTIFICATION_KEYS: Record<string, keyof Company> = {
  competitiveMoat: "competitiveMoatJustification",
  marketOpportunity: "marketOpportunityJustification",
  techDifferentiation: "techDifferentiationJustification",
  teamExecution: "teamExecutionJustification",
  industryImpact: "industryImpactJustification",
  growthMetrics: "growthMetricsJustification",
  fundingEfficiency: "fundingEfficiencyJustification",
}

function deriveSwot(company: Company, allData: Company[]): SwotData {
  const strengths: SwotItem[] = []
  const weaknesses: SwotItem[] = []
  const opportunities: SwotItem[] = []
  const threats: SwotItem[] = []

  // Curated strengths/weaknesses from the CSV (analyst-written)
  if (company.strengths) {
    const items = company.strengths.split(/[;\n]+/).map(s => s.trim()).filter(Boolean)
    for (const item of items) {
      strengths.push({ label: item, value: 0 })
    }
  }
  if (company.weaknesses) {
    const items = company.weaknesses.split(/[;\n]+/).map(s => s.trim()).filter(Boolean)
    for (const item of items) {
      weaknesses.push({ label: item, value: 0 })
    }
  }

  // Classify each metric as strength or weakness
  for (const m of SCORE_METRICS) {
    const val = company[m.key] as number
    if (!val || val === 0) continue
    const justKey = JUSTIFICATION_KEYS[m.key as string]
    const justification = justKey ? (company[justKey] as string) : undefined

    if (val >= 4) {
      strengths.push({ label: m.label, value: val, justification })
    } else if (val <= 2) {
      weaknesses.push({ label: m.label, value: val, justification })
    }
  }

  // Financial strength/weakness signals
  if (company.scoreFinancial >= 4) {
    strengths.push({ label: "Financial Health", value: company.scoreFinancial })
  } else if (company.scoreFinancial > 0 && company.scoreFinancial <= 2) {
    weaknesses.push({ label: "Financial Health", value: company.scoreFinancial })
  }

  if (company.customerSignalScore >= 4) {
    strengths.push({ label: "Customer Signal", value: company.customerSignalScore })
  } else if (company.customerSignalScore > 0 && company.customerSignalScore <= 2) {
    weaknesses.push({ label: "Customer Signal", value: company.customerSignalScore })
  }

  // Opportunities: market-level signals
  const sameSegment = allData.filter(c => c.investmentList === company.investmentList && c.id !== company.id)
  const segmentAvgScore = sameSegment.length > 0
    ? sameSegment.reduce((sum, c) => sum + (c.weightedScore || 0), 0) / sameSegment.length
    : 0

  if ((company.marketOpportunity || 0) >= 4) {
    opportunities.push({ label: "Large addressable market", value: company.marketOpportunity })
  }
  if ((company.weightedScore || 0) > segmentAvgScore && sameSegment.length > 0) {
    const belowCompany = sameSegment.filter(c => (c.weightedScore || 0) <= (company.weightedScore || 0))
    opportunities.push({ label: `Above segment average (${segmentAvgScore.toFixed(1)} avg)`, value: company.weightedScore, companies: belowCompany })
  }
  if (company.industriesServed && company.industriesServed.length >= 3) {
    opportunities.push({ label: `Multi-industry reach (${company.industriesServed.length} sectors)`, value: company.industriesServed.length })
  }
  if (company.differentiationTags && company.differentiationTags.length >= 2) {
    opportunities.push({ label: `Strong differentiation (${company.differentiationTags.join(", ")})`, value: company.differentiationTags.length })
  }

  // Threats: competitive pressure signals
  if (sameSegment.length >= 20) {
    threats.push({ label: `Crowded segment (${sameSegment.length} competitors)`, value: sameSegment.length, companies: sameSegment })
  }
  const betterFunded = sameSegment.filter(c => (c.totalFunding || 0) > (company.totalFunding || 0))
  if (betterFunded.length >= 5) {
    threats.push({ label: `${betterFunded.length} better-funded rivals`, value: betterFunded.length, companies: betterFunded })
  }
  const higherScored = sameSegment.filter(c => (c.weightedScore || 0) > (company.weightedScore || 0))
  if (higherScored.length >= 3) {
    threats.push({ label: `${higherScored.length} higher-scoring competitors`, value: higherScored.length, companies: higherScored })
  }
  if ((company.fundingEfficiency || 0) <= 2 && (company.fundingEfficiency || 0) > 0) {
    threats.push({ label: "Low funding efficiency — burn risk", value: company.fundingEfficiency })
  }

  // Sort: curated items (value=0) first, then score-derived descending/ascending
  strengths.sort((a, b) => {
    if (a.value === 0 && b.value !== 0) return -1
    if (a.value !== 0 && b.value === 0) return 1
    return b.value - a.value
  })
  weaknesses.sort((a, b) => {
    if (a.value === 0 && b.value !== 0) return -1
    if (a.value !== 0 && b.value === 0) return 1
    return a.value - b.value
  })

  return { strengths, weaknesses, opportunities, threats }
}

// ─── SWOT Quadrant Card ──────────────────────────────────────────

const QUADRANT_CONFIG = {
  strengths: {
    label: "Strengths",
    icon: ShieldCheck,
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/20",
    headerBg: "bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
  },
  weaknesses: {
    label: "Weaknesses",
    icon: ShieldAlert,
    bg: "bg-red-500/5",
    border: "border-red-500/20",
    headerBg: "bg-red-500/10",
    text: "text-red-700 dark:text-red-400",
    badge: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/25",
  },
  opportunities: {
    label: "Opportunities",
    icon: Lightbulb,
    bg: "bg-blue-500/5",
    border: "border-blue-500/20",
    headerBg: "bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-400",
    badge: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/25",
  },
  threats: {
    label: "Threats",
    icon: AlertTriangle,
    bg: "bg-amber-500/5",
    border: "border-amber-500/20",
    headerBg: "bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25",
  },
} as const

function SwotQuadrant({
  quadrant,
  items,
  onDrillDown,
  activeDrillLabel,
}: {
  quadrant: keyof typeof QUADRANT_CONFIG
  items: SwotItem[]
  onDrillDown?: (item: SwotItem) => void
  activeDrillLabel?: string | null
}) {
  const cfg = QUADRANT_CONFIG[quadrant]
  const Icon = cfg.icon

  return (
    <div className={cn("rounded-lg border p-4 flex flex-col", cfg.bg, cfg.border)}>
      <div className={cn("flex items-center gap-2 rounded-md px-3 py-1.5 mb-3 -mx-1 -mt-1", cfg.headerBg)}>
        <Icon className={cn("size-4", cfg.text)} />
        <span className={cn("text-sm font-semibold", cfg.text)}>{cfg.label}</span>
        <span className={cn("ml-auto text-xs font-medium", cfg.text)}>{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">No significant signals</p>
      ) : (
        <ul className="space-y-2 flex-1">
          {items.map((item, i) => {
            const hasCompanies = item.companies && item.companies.length > 0
            const isActive = activeDrillLabel === item.label

            return (
              <li key={i} className="text-sm">
                <div
                  className={cn(
                    "flex items-start gap-2 rounded-md px-1 -mx-1 py-0.5",
                    hasCompanies && "cursor-pointer hover:bg-white/5 transition-colors",
                    isActive && "bg-white/10 ring-1 ring-white/10"
                  )}
                  onClick={hasCompanies ? () => onDrillDown?.(item) : undefined}
                >
                  {item.value > 0 ? (
                    <span className={cn("inline-flex px-1.5 py-0.5 rounded text-[11px] font-medium border shrink-0", cfg.badge)}>
                      {item.value <= 5 ? `${item.value.toFixed(1)}/5` : item.value}
                    </span>
                  ) : (
                    <span className={cn("inline-flex px-1 py-0.5 rounded text-[11px] shrink-0", cfg.badge)}>
                      &bull;
                    </span>
                  )}
                  <span className={cn(
                    "text-foreground",
                    hasCompanies && "underline decoration-dotted underline-offset-4 decoration-muted-foreground/40"
                  )}>
                    {item.label}
                  </span>
                </div>
                {item.justification && (
                  <p className="text-xs text-muted-foreground mt-0.5 ml-10 line-clamp-2">
                    {item.justification}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// ─── Main SWOT Chart Component ───────────────────────────────────

export function SwotChart({ data, className }: SwotChartProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [drillItem, setDrillItem] = useState<SwotItem | null>(null)

  const sortedData = useMemo(
    () => [...data].filter(d => d.weightedScore > 0).sort((a, b) => b.weightedScore - a.weightedScore),
    [data]
  )

  const filtered = sortedData.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectedCompany = data.find(c => c.id === selectedId)
  const swot = useMemo(
    () => selectedCompany ? deriveSwot(selectedCompany, data) : null,
    [selectedCompany, data]
  )

  const handleDrillDown = (item: SwotItem) => {
    setDrillItem(prev => prev?.label === item.label ? null : item)
  }

  // Clear drill-down when company changes
  const handleSelectCompany = (id: string) => {
    setSelectedId(id)
    setDrillItem(null)
  }

  // Sort drill-down companies by weighted score descending
  const drillCompanies = useMemo(() => {
    if (!drillItem?.companies) return []
    return [...drillItem.companies].sort((a, b) => (b.weightedScore || 0) - (a.weightedScore || 0))
  }, [drillItem])

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex gap-6 h-full">
        {/* Company selector panel */}
        <div className="w-64 shrink-0 flex flex-col">
          <Input
            placeholder="Search companies…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="mb-3"
          />
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 max-h-[560px]">
            {filtered.slice(0, 50).map(c => (
              <button
                key={c.id}
                onClick={() => handleSelectCompany(c.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                  "hover:bg-muted/50",
                  selectedId === c.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: getInvestmentColor(c.investmentList) }}
                  />
                  <span className="truncate">{c.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {(c.weightedScore || 0).toFixed(1)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SWOT grid */}
        <div className="flex-1 min-w-0">
          {!selectedCompany ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a company from the list to view its SWOT analysis
            </div>
          ) : (
            <div className="space-y-4">
              {/* Company header */}
              <div className="flex items-center gap-3">
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: getInvestmentColor(selectedCompany.investmentList) }}
                />
                <h2 className="text-lg font-semibold">{selectedCompany.name}</h2>
                <Badge variant="outline" className="text-xs">
                  {selectedCompany.investmentList}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Score: {(selectedCompany.weightedScore || 0).toFixed(2)}
                </Badge>
                {selectedCompany.totalFunding > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    ${(selectedCompany.totalFunding / 1e6).toFixed(1)}M raised
                  </Badge>
                )}
              </div>

              {/* 2×2 SWOT Grid */}
              {swot && (
                <div className="grid grid-cols-2 gap-4">
                  <SwotQuadrant quadrant="strengths" items={swot.strengths} onDrillDown={handleDrillDown} activeDrillLabel={drillItem?.label} />
                  <SwotQuadrant quadrant="weaknesses" items={swot.weaknesses} onDrillDown={handleDrillDown} activeDrillLabel={drillItem?.label} />
                  <SwotQuadrant quadrant="opportunities" items={swot.opportunities} onDrillDown={handleDrillDown} activeDrillLabel={drillItem?.label} />
                  <SwotQuadrant quadrant="threats" items={swot.threats} onDrillDown={handleDrillDown} activeDrillLabel={drillItem?.label} />
                </div>
              )}

              {/* Drill-down company list */}
              {drillItem && drillCompanies.length > 0 && (
                <div className="rounded-lg border border-border bg-muted/20 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold">{drillItem.label}</h3>
                      <p className="text-xs text-muted-foreground">{drillCompanies.length} companies</p>
                    </div>
                    <button
                      onClick={() => setDrillItem(null)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
                    {drillCompanies.map(c => (
                      <div
                        key={c.id}
                        className="flex items-center gap-3 px-3 py-2 rounded-md border border-border/50 bg-background/50 text-sm"
                      >
                        <span
                          className="size-2 rounded-full shrink-0"
                          style={{ backgroundColor: getInvestmentColor(c.investmentList) }}
                        />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium">{c.name}</span>
                          <p className="text-xs text-muted-foreground truncate">
                            {c.investmentList}{c.country ? ` · ${c.country}` : ""}
                          </p>
                        </div>
                        {c.totalFunding > 0 && (
                          <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                            {formatCurrency(c.totalFunding)}
                          </span>
                        )}
                        <span className="text-xs font-medium tabular-nums shrink-0">
                          {(c.weightedScore || 0).toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
