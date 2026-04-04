"use client"

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { Company, formatCurrency } from "@/lib/company-data"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Search, TrendingUp, Users, DollarSign, Star, Layers } from "lucide-react"
import { getInvestmentColor } from "@/lib/investment-colors"

interface InvestorCompareChartProps {
  data: Company[]
  className?: string
}

interface InvestorProfile {
  name: string
  companies: Company[]
  portfolioSize: number
  totalFunding: number
  avgScore: number
  topSectors: { name: string; count: number }[]
  stageDistribution: { stage: string; count: number }[]
}

const EXCLUDED_INVESTORS = new Set([
  "bootstrapped", "angel funded", "undisclosed", "unknown", "n a", "n/a",
  "self-funded", "self funded", "none", "undisclosed or unknown",
])

const MAX_SELECTED = 3

export function InvestorCompareChart({ data, className }: InvestorCompareChartProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Build investor → company mapping
  const investorMap = useMemo(() => {
    const map = new Map<string, Company[]>()
    for (const company of data) {
      for (const inv of company.investors || []) {
        const name = inv.trim()
        if (!name || EXCLUDED_INVESTORS.has(name.toLowerCase())) continue
        if (name.includes("'state'") || name.includes("'isStale'") || name.startsWith("{")) continue
        const existing = map.get(name)
        if (existing) {
          existing.push(company)
        } else {
          map.set(name, [company])
        }
      }
    }
    return map
  }, [data])

  // All investor names with 2+ companies, sorted by portfolio size
  const allInvestors = useMemo(() => {
    return Array.from(investorMap.entries())
      .filter(([, companies]) => companies.length >= 2)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([name]) => name)
  }, [investorMap])

  // Search filter
  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return allInvestors
      .filter(name => !selected.includes(name) && name.toLowerCase().includes(q))
      .slice(0, 8)
  }, [allInvestors, search, selected])

  // Build profiles for selected investors
  const profiles = useMemo<InvestorProfile[]>(() => {
    return selected.map(name => {
      const companies = investorMap.get(name) || []
      const totalFunding = companies.reduce((s, c) => s + (c.totalFunding || 0), 0)
      const scores = companies.map(c => c.weightedScore).filter(s => s > 0)
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0

      // Sector distribution from investmentList
      const sectorCounts = new Map<string, number>()
      for (const c of companies) {
        const list = (c.investmentList || "").replace(/^\d+-/, "").trim()
        if (list && list !== "Unknown") {
          sectorCounts.set(list, (sectorCounts.get(list) || 0) + 1)
        }
      }
      const topSectors = Array.from(sectorCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }))

      // Stage distribution
      const stageCounts = new Map<string, number>()
      for (const c of companies) {
        const stage = c.latestFundingRound || c.startupLifecyclePhase || "Unknown"
        stageCounts.set(stage, (stageCounts.get(stage) || 0) + 1)
      }
      const stageDistribution = Array.from(stageCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([stage, count]) => ({ stage, count }))

      return { name, companies, portfolioSize: companies.length, totalFunding, avgScore, topSectors, stageDistribution }
    })
  }, [selected, investorMap])

  // Overlap analysis
  const overlap = useMemo(() => {
    if (selected.length < 2) return { companies: [], counts: new Map<string, string[]>() }

    const companyInvestors = new Map<string, { company: Company; backedBy: string[] }>()
    for (const profile of profiles) {
      for (const c of profile.companies) {
        const existing = companyInvestors.get(c.id)
        if (existing) {
          existing.backedBy.push(profile.name)
        } else {
          companyInvestors.set(c.id, { company: c, backedBy: [profile.name] })
        }
      }
    }

    const sharedCompanies = Array.from(companyInvestors.values())
      .filter(entry => entry.backedBy.length >= 2)
      .sort((a, b) => b.backedBy.length - a.backedBy.length || (b.company.totalFunding || 0) - (a.company.totalFunding || 0))

    return { companies: sharedCompanies }
  }, [profiles, selected])

  const addInvestor = useCallback((name: string) => {
    if (selected.length >= MAX_SELECTED) return
    setSelected(prev => [...prev, name])
    setSearch("")
    setShowDropdown(false)
  }, [selected])

  const removeInvestor = useCallback((name: string) => {
    setSelected(prev => prev.filter(n => n !== name))
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const PROFILE_COLORS = ["#6366f1", "#f59e0b", "#10b981"]

  return (
    <div className={cn("space-y-6", className)}>
      {/* Investor selection */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          {selected.map((name, i) => (
            <Badge
              key={name}
              variant="secondary"
              className="text-sm px-3 py-1.5 gap-1.5 border"
              style={{ borderColor: PROFILE_COLORS[i] + "60", backgroundColor: PROFILE_COLORS[i] + "15" }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PROFILE_COLORS[i] }} />
              {name}
              <button onClick={() => removeInvestor(name)} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selected.length < MAX_SELECTED && (
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder={selected.length === 0 ? "Search investors to compare..." : "Add another investor..."}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowDropdown(true) }}
                onFocus={() => search && setShowDropdown(true)}
                className="pl-9 h-9 text-sm"
              />
              {showDropdown && searchResults.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute z-50 top-10 left-0 w-full bg-popover border border-border rounded-md shadow-lg max-h-56 overflow-y-auto"
                >
                  {searchResults.map(name => {
                    const count = investorMap.get(name)?.length || 0
                    return (
                      <button
                        key={name}
                        onClick={() => addInvestor(name)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent flex items-center justify-between"
                      >
                        <span>{name}</span>
                        <span className="text-xs text-muted-foreground">{count} companies</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        {selected.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Select 2–3 investors to compare their portfolios side by side.
            Showing {allInvestors.length} investors with 2+ backed companies.
          </p>
        )}
      </div>

      {/* Side-by-side profiles */}
      {profiles.length > 0 && (
        <div className={cn("grid gap-4", profiles.length === 1 ? "grid-cols-1" : profiles.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
          {profiles.map((profile, i) => (
            <div key={profile.name} className="bg-card border border-border/60 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: PROFILE_COLORS[i] }} />
                <h3 className="font-bold text-sm truncate">{profile.name}</h3>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase">
                    <Users className="h-3 w-3" /> Portfolio
                  </div>
                  <div className="text-lg font-bold mt-0.5">{profile.portfolioSize}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase">
                    <DollarSign className="h-3 w-3" /> Funding
                  </div>
                  <div className="text-lg font-bold mt-0.5">{formatCurrency(profile.totalFunding)}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase">
                    <Star className="h-3 w-3" /> Avg Score
                  </div>
                  <div className="text-lg font-bold mt-0.5">{profile.avgScore > 0 ? profile.avgScore.toFixed(2) : "—"}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase">
                    <Layers className="h-3 w-3" /> Sectors
                  </div>
                  <div className="text-lg font-bold mt-0.5">{profile.topSectors.length}</div>
                </div>
              </div>

              {/* Sector distribution */}
              <div>
                <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-1.5">Investment Lists</p>
                <div className="flex flex-wrap gap-1">
                  {profile.topSectors.map(s => {
                    const color = getInvestmentColor(s.name)
                    return (
                      <Badge
                        key={s.name}
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 border"
                        style={{ backgroundColor: color + "20", color, borderColor: color + "40" }}
                      >
                        {s.name.length > 20 ? s.name.slice(0, 18) + "…" : s.name} ({s.count})
                      </Badge>
                    )
                  })}
                </div>
              </div>

              {/* Stage distribution */}
              <div>
                <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-1.5">Stage Distribution</p>
                <div className="space-y-1">
                  {profile.stageDistribution.slice(0, 5).map(s => (
                    <div key={s.stage} className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground w-24 truncate">{s.stage}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(s.count / profile.portfolioSize) * 100}%`,
                            backgroundColor: PROFILE_COLORS[i],
                          }}
                        />
                      </div>
                      <span className="text-muted-foreground w-6 text-right">{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Portfolio overlap */}
      {selected.length >= 2 && (
        <div className="bg-card border border-border/60 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-sm">Portfolio Overlap</h3>
            <Badge variant="outline" className="text-xs">
              {overlap.companies.length} shared compan{overlap.companies.length === 1 ? "y" : "ies"}
            </Badge>
          </div>

          {overlap.companies.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No overlapping companies found between selected investors.
            </p>
          ) : (
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-2">
                {overlap.companies.map(({ company, backedBy }) => (
                  <div key={company.id} className="flex items-center justify-between bg-muted border border-border rounded-lg px-3 py-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{company.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">{company.weightedScore?.toFixed(1) || "—"}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {company.investmentList || "N/A"} · {formatCurrency(company.totalFunding)}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0 ml-2">
                      {backedBy.map(inv => {
                        const idx = selected.indexOf(inv)
                        return (
                          <span
                            key={inv}
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: PROFILE_COLORS[idx] }}
                            title={inv}
                          />
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      )}
    </div>
  )
}
