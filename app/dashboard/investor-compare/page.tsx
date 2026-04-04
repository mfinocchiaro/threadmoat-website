"use client"

import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { InvestorCompareChart } from "@/components/charts/investor-compare-chart"
import { Skeleton } from "@/components/ui/skeleton"

function InvestorCompareInner() {
  const { filtered, isLoading } = useThesisGatedData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Investor Comparison</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Select 2–3 investors to compare their portfolio size, funding, sector focus, and overlapping companies side by side.
        </p>
      </div>
      {isLoading ? (
        <Skeleton className="h-[600px] rounded-xl" />
      ) : (
        <InvestorCompareChart data={filtered} className="w-full" />
      )}
    </div>
  )
}

export default function InvestorComparePage() {
  return (
    <VizPageShell>
      <InvestorCompareInner />
    </VizPageShell>
  )
}
