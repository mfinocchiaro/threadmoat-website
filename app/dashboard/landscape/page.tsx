"use client"

import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { FocusPrompt } from "@/components/dashboard/focus-prompt"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { VizFilterBar } from "@/components/viz-filter-bar"
import { LandscapeChart } from "@/components/charts/landscape-chart"
import { Skeleton } from "@/components/ui/skeleton"

function LandscapeInner() {
  const { companies, filtered, isLoading, hasThesis } = useThesisGatedData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Market Landscape</h1>
        <p className="text-muted-foreground text-sm mt-1">Companies grouped by investment category and subsegment — hover to zoom, click to view details.</p>
      </div>
      {isLoading ? (
        <Skeleton className="h-[600px] rounded-xl" />
      ) : !hasThesis ? (
        <FocusPrompt label="Set Focus" description="Configure your thesis on the main dashboard to unlock this visualization." />
      ) : (
        <>
          <VizFilterBar companies={companies} />
          <LandscapeChart data={filtered} />
        </>
      )}
    </div>
  )
}

export default function LandscapePage() {
  return (
    <VizPageShell>
      <LandscapeInner />
    </VizPageShell>
  )
}
