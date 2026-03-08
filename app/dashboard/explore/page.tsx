"use client"

import { useEffect, useState } from "react"
import { loadCompanyData } from "@/lib/company-data"
import type { Company } from "@/lib/company-data"
import { NetworkGraphToggle } from "@/components/charts/network-graph-toggle"
import { GlobeChart } from "@/components/charts/globe-chart"
import { Skeleton } from "@/components/ui/skeleton"
import { Lock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ExplorePage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCompanyData().then(data => {
      setCompanies(data)
      setIsLoading(false)
    })
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Explore the AI PLM Ecosystem</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {companies.length > 0 ? `${companies.length} companies` : "Loading…"} — network relationships and global footprint. Free preview.
          </p>
        </div>
        <Link href="/pricing">
          <Button className="gap-2">
            <Lock className="h-4 w-4" />
            Unlock full analytics
          </Button>
        </Link>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground border border-border rounded-md px-3 py-2 bg-muted/40">
        ⚠ Research estimates only — figures are educated approximations from public sources and may contain errors.
        Not investment advice. Always conduct your own due diligence.
      </p>

      {/* Network Graph */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Competitive Network</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Force-directed graph showing relationships between companies, investment categories, manufacturing types, and subcategories. Drag nodes to explore clusters.
        </p>
        {isLoading ? (
          <Skeleton className="h-[620px] rounded-xl" />
        ) : (
          <div className="rounded-xl border border-border overflow-hidden h-[620px]">
            <NetworkGraphToggle data={companies} />
          </div>
        )}
      </section>

      {/* Globe */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Global Startup Footprint</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Geographic distribution of AI PLM startups by hub. Bar height = company count. Hover for funding and category breakdown.
        </p>
        {isLoading ? (
          <Skeleton className="h-[520px] rounded-xl" />
        ) : (
          <div className="rounded-xl border border-border overflow-hidden bg-black h-[520px]">
            <GlobeChart data={companies} />
          </div>
        )}
      </section>

      {/* Upgrade CTA */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center space-y-3">
        <h3 className="text-lg font-semibold">Want the full picture?</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Full subscribers get access to financial heatmaps, investment thesis scoring, periodic table, timeline, Marimekko analysis, and 20+ more charts across {companies.length} companies.
        </p>
        <Link href="/pricing">
          <Button size="lg" className="gap-2">
            <Lock className="h-4 w-4" />
            See plans &amp; pricing
          </Button>
        </Link>
      </div>
    </div>
  )
}
