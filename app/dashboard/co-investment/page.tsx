"use client"

import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { CoInvestmentHeatmap } from "@/components/charts/co-investment-heatmap"
import { Skeleton } from "@/components/ui/skeleton"

function CoInvestmentInner() {
  const { filtered, isLoading } = useThesisGatedData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Co-Investment Heatmap</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Which investors frequently co-invest together? Darker cells indicate more shared portfolio companies.
          Click any cell to see the specific companies both investors have backed.
        </p>
      </div>
      {isLoading ? (
        <Skeleton className="h-[600px] rounded-xl" />
      ) : (
        <CoInvestmentHeatmap data={filtered} className="w-full" />
      )}
    </div>
  )
}

export default function CoInvestmentPage() {
  return (
    <VizPageShell>
      <CoInvestmentInner />
    </VizPageShell>
  )
}
