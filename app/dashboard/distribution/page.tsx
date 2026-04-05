"use client"

import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { DistributionChart } from "@/components/charts/distribution-chart"
import { Skeleton } from "@/components/ui/skeleton"

function DistributionInner() {
  const { filtered, isLoading } = useThesisGatedData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Funding Distribution</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Box plot of funding distribution by investment category. Click any box to explore the companies within that
          category.
        </p>
        <details className="mt-2 text-xs text-muted-foreground">
          <summary className="cursor-pointer font-medium hover:text-foreground">How to read this chart</summary>
          <p className="mt-1 leading-relaxed">Each box shows how funding is distributed within an investment category. The box spans the 25th to 75th percentile, with the median line showing where most companies fall. Categories with boxes pushed to the right have higher median funding. Outlier dots above the whiskers are heavily funded standouts. Compare box widths — wide boxes indicate large funding spreads within a category, while narrow boxes suggest most companies are funded at similar levels.</p>
        </details>
      </div>
      {isLoading ? (
        <Skeleton className="h-[600px] rounded-xl" />
      ) : (
          <DistributionChart data={filtered} className="h-[600px]" />
      )}
    </div>
  )
}

export default function DistributionPage() {
  return (
    <VizPageShell>
      <DistributionInner />
    </VizPageShell>
  )
}
