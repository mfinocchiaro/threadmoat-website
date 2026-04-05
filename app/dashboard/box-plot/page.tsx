"use client"

import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { BoxPlotChart } from "@/components/charts/box-plot-chart"
import { Skeleton } from "@/components/ui/skeleton"

function BoxPlotInner() {
  const { filtered, isLoading } = useThesisGatedData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Box Plot</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Statistical distribution of metrics across categories. Shows median, quartiles, and outliers for each group.
        </p>
        <details className="mt-2 text-xs text-muted-foreground">
          <summary className="cursor-pointer font-medium hover:text-foreground">How to read this chart</summary>
          <p className="mt-1 leading-relaxed">Each box shows the middle 50% of companies in that category (the interquartile range). The line inside the box is the median. Whiskers extend to the min and max non-outlier values. Dots beyond the whiskers are outliers — companies that are significantly above or below the norm. Taller boxes mean more variation within a category; narrow boxes indicate consistency. Compare medians across categories to spot which segments score highest on a given metric.</p>
        </details>
      </div>
      {isLoading ? (
        <Skeleton className="h-[600px] rounded-xl" />
      ) : (
          <BoxPlotChart data={filtered} className="h-[600px]" />
      )}
    </div>
  )
}

export default function BoxPlotPage() {
  return (
    <VizPageShell>
      <BoxPlotInner />
    </VizPageShell>
  )
}
