"use client"

import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { FocusPrompt } from "@/components/dashboard/focus-prompt"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { VizFilterBar } from "@/components/viz-filter-bar"
import { SunburstChart } from "@/components/charts/sunburst-chart"
import { Skeleton } from "@/components/ui/skeleton"

function SunburstInner() {
  const { companies, filtered, isLoading, hasThesis } = useThesisGatedData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Sunburst Hierarchy</h1>
        <p className="text-muted-foreground text-sm mt-1">Radial hierarchy view of the ecosystem by Investment List or Industry Segment, with a secondary grouping dimension.</p>
      </div>
      {isLoading ? (
        <Skeleton className="h-[calc(100vh-12rem)] rounded-xl" />
      ) : !hasThesis ? (
        <FocusPrompt label="Set Focus" description="Configure your thesis on the main dashboard to unlock this visualization." />
      ) : (
        <>
          <VizFilterBar companies={companies} />
          <SunburstChart data={filtered} />
        </>
      )}
    </div>
  )
}

export default function SunburstPage() {
  return (
    <VizPageShell>
      <SunburstInner />
    </VizPageShell>
  )
}
