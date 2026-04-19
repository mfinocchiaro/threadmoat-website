"use client"

import { useState, useEffect, useMemo } from "react"
import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { Skeleton } from "@/components/ui/skeleton"

interface FundingRow {
  company: string
  totalFunding: number
  estimatedRevenue: number
  investmentList: string
}

interface YearBucket {
  year: string
  totalFunding: number
  dealCount: number
  avgDealSize: number
}

function FundingTrendsInner() {
  const [data, setData] = useState<FundingRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/funding")
      .then(r => r.json())
      .then(d => setData(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Aggregate funding by investment list category (proxy for time periods since we have category data)
  const categoryData = useMemo(() => {
    if (data.length === 0) return []
    const byCategory = new Map<string, { total: number; count: number; revenue: number }>()
    for (const row of data) {
      const cat = row.investmentList || "Uncategorized"
      const existing = byCategory.get(cat) || { total: 0, count: 0, revenue: 0 }
      existing.total += row.totalFunding
      existing.count += 1
      existing.revenue += row.estimatedRevenue
      byCategory.set(cat, existing)
    }
    return Array.from(byCategory.entries())
      .map(([category, stats]) => ({
        category,
        totalFunding: stats.total,
        dealCount: stats.count,
        avgDealSize: stats.count > 0 ? stats.total / stats.count : 0,
        totalRevenue: stats.revenue,
      }))
      .filter(c => c.totalFunding > 0)
      .sort((a, b) => b.totalFunding - a.totalFunding)
  }, [data])

  // Size distribution
  const sizeDistribution = useMemo(() => {
    const buckets = [
      { label: "< $1M", min: 0, max: 1_000_000, count: 0, total: 0 },
      { label: "$1M - $10M", min: 1_000_000, max: 10_000_000, count: 0, total: 0 },
      { label: "$10M - $50M", min: 10_000_000, max: 50_000_000, count: 0, total: 0 },
      { label: "$50M - $100M", min: 50_000_000, max: 100_000_000, count: 0, total: 0 },
      { label: "$100M - $500M", min: 100_000_000, max: 500_000_000, count: 0, total: 0 },
      { label: "> $500M", min: 500_000_000, max: Infinity, count: 0, total: 0 },
    ]
    for (const row of data) {
      if (row.totalFunding <= 0) continue
      const bucket = buckets.find(b => row.totalFunding >= b.min && row.totalFunding < b.max)
      if (bucket) {
        bucket.count++
        bucket.total += row.totalFunding
      }
    }
    return buckets
  }, [data])

  const maxFunding = Math.max(...categoryData.map(c => c.totalFunding), 1)
  const maxBucketCount = Math.max(...sizeDistribution.map(b => b.count), 1)

  function formatM(n: number): string {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
    return `$${n.toFixed(0)}`
  }

  if (loading) return <Skeleton className="h-[600px] rounded-xl" />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Funding Trends</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Funding distribution across investment categories and deal sizes.
          {data.length > 0 && ` ${data.length} companies tracked.`}
        </p>
      </div>

      {/* By Category */}
      <div className="rounded-lg border border-border p-4 bg-card space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Total Funding by Category
        </h3>
        {categoryData.map(c => (
          <div key={c.category} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium truncate max-w-[60%]">{c.category}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{c.dealCount} companies</span>
                <span className="font-mono text-xs">{formatM(c.totalFunding)}</span>
              </div>
            </div>
            <div className="h-4 w-full rounded bg-muted/50 overflow-hidden">
              <div
                className="h-full rounded bg-primary/60 transition-all duration-500"
                style={{ width: `${Math.max((c.totalFunding / maxFunding) * 100, 1)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Deal Size Distribution */}
      <div className="rounded-lg border border-border p-4 bg-card space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Deal Size Distribution
        </h3>
        <div className="grid grid-cols-6 gap-2">
          {sizeDistribution.map(b => (
            <div key={b.label} className="text-center">
              <div className="h-32 flex items-end justify-center">
                <div
                  className="w-full max-w-[40px] rounded-t bg-primary/50 transition-all duration-500"
                  style={{ height: `${Math.max((b.count / maxBucketCount) * 100, 4)}%` }}
                />
              </div>
              <div className="mt-2 text-xs font-mono">{b.count}</div>
              <div className="text-[10px] text-muted-foreground leading-tight">{b.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function FundingTrendsPage() {
  return (
    <VizPageShell>
      <FundingTrendsInner />
    </VizPageShell>
  )
}
