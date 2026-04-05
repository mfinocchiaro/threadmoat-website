"use client"

import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { HeatmapChart } from "@/components/charts/heatmap-chart"
import { Skeleton } from "@/components/ui/skeleton"

function HeatmapInner() {
  const { filtered, isLoading } = useThesisGatedData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Pattern Heatmap</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Discover patterns across investment categories and startup phases. Darker cells indicate higher metric values.
        </p>
        <details className="mt-2 text-xs text-muted-foreground">
          <summary className="cursor-pointer font-medium hover:text-foreground">How to read this chart</summary>
          <p className="mt-1 leading-relaxed">Each cell represents the intersection of an investment category (row) and a funding stage or lifecycle phase (column). The color intensity reflects the average metric value — darker cells signal higher concentration or scores. Look for horizontal bands of dark color to identify categories with consistently strong metrics, or vertical bands to spot lifecycle phases where most startups cluster. Isolated dark cells may indicate niche sweet spots worth investigating.</p>
        </details>
      </div>
      {isLoading ? (
        <Skeleton className="h-[600px] rounded-xl" />
      ) : (
          <HeatmapChart data={filtered} className="min-h-[400px]" />
      )}
    </div>
  )
}

export default function HeatmapPage() {
  return (
    <VizPageShell>
      <HeatmapInner />
    </VizPageShell>
  )
}
