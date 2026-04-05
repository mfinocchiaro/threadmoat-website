"use client"

import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { SplomChart } from "@/components/charts/splom-chart"
import { Skeleton } from "@/components/ui/skeleton"

function SplomInner() {
  const { filtered, isLoading } = useThesisGatedData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Scatter Plot Matrix</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Pairwise relationships between all key metrics — diagonal shows distributions, off-diagonal shows correlations. Click any dot for company details.
        </p>
        <details className="mt-2 text-xs text-muted-foreground">
          <summary className="cursor-pointer font-medium hover:text-foreground">How to read this chart</summary>
          <p className="mt-1 leading-relaxed">This matrix shows every possible pair of metrics plotted against each other. Diagonal cells show the distribution of a single metric. Off-diagonal cells show scatter plots — dots clustering along a diagonal line indicate positive correlation (e.g., higher growth = higher market opportunity). Look for tight clusters (consensus), outliers (standouts), or empty quadrants (opportunity gaps). The upper-right quadrant of any cell shows companies that score high on both metrics — prime targets for deep dives.</p>
        </details>
      </div>
      {isLoading ? (
        <Skeleton className="h-[760px] rounded-xl" />
      ) : (
          <SplomChart data={filtered} className="h-[760px]" />
      )}
    </div>
  )
}

export default function SplomPage() {
  return (
    <VizPageShell>
      <SplomInner />
    </VizPageShell>
  )
}
