"use client"

import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { FocusPrompt } from "@/components/dashboard/focus-prompt"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { VizFilterBar } from "@/components/viz-filter-bar"
import { HeatmapChart } from "@/components/charts/heatmap-chart"
import { Skeleton } from "@/components/ui/skeleton"

function HeatmapInner() {
  const { companies, filtered, isLoading, hasThesis } = useThesisGatedData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Pattern Heatmap</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Discover patterns across investment categories and startup phases. Darker cells indicate higher metric values.
        </p>
      </div>
      {!hasThesis ? (
        <FocusPrompt label="Set Focus" description="Configure your thesis on the main dashboard to unlock this visualization." />
      ) : isLoading ? (
        <Skeleton className="h-[600px] rounded-xl" />
      ) : (
        <>
          <VizFilterBar companies={companies} />
          <HeatmapChart data={filtered} className="min-h-[400px]" />
        </>
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
