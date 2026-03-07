"use client"

import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { FocusPrompt } from "@/components/dashboard/focus-prompt"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { VizFilterBar } from "@/components/viz-filter-bar"
import { SpiralTimelineChart } from "@/components/charts/spiral-timeline-chart"
import { Skeleton } from "@/components/ui/skeleton"

function SpiralInner() {
  const { companies, filtered, isLoading, hasThesis } = useThesisGatedData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Spiral Timeline</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Companies plotted along a spiral by founding year — center is earliest, outer edge is most recent. Click any dot for details.
        </p>
      </div>
      {isLoading ? (
        <Skeleton className="h-[680px] rounded-xl" />
      ) : !hasThesis ? (
        <FocusPrompt label="Set Focus" description="Configure your thesis on the main dashboard to unlock this visualization." />
      ) : (
        <>
          <VizFilterBar companies={companies} />
          <SpiralTimelineChart data={filtered} className="w-full" />
        </>
      )}
    </div>
  )
}

export default function SpiralPage() {
  return (
    <VizPageShell>
      <SpiralInner />
    </VizPageShell>
  )
}
