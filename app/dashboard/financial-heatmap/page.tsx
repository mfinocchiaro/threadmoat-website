"use client"

import { useMemo } from "react"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { FinancialHeatmapChart } from "@/components/charts/financial-heatmap-chart"
import { Skeleton } from "@/components/ui/skeleton"

function FinancialHeatmapInner() {
  const { filtered, isLoading } = useThesisGatedData()

  const filteredNames = useMemo(() => {
    return new Set(filtered.map((c) => c.name))
  }, [filtered])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Financial Heatmap</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Read left to right: Identity → Raw Inputs → Efficiency → Burn &amp; Runway → Valuation → Confidence. Each column builds on the previous — hover any cell for details, click &quot;Show formulas&quot; for calculation logic.
        </p>
      </div>
      {isLoading ? (
        <Skeleton className="h-[600px] rounded-xl" />
      ) : (
          <FinancialHeatmapChart className="min-h-[500px]" filteredCompanyNames={filteredNames} />
      )}
    </div>
  )
}

export default function FinancialHeatmapPage() {
  return (
    <VizPageShell>
      <FinancialHeatmapInner />
    </VizPageShell>
  )
}
