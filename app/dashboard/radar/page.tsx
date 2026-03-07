"use client"

import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { FocusPrompt } from "@/components/dashboard/focus-prompt"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { VizFilterBar } from "@/components/viz-filter-bar"
import { RadarChart } from "@/components/charts/radar-chart"
import { Skeleton } from "@/components/ui/skeleton"

function RadarInner() {
  const { companies, filtered, isLoading, hasThesis } = useThesisGatedData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Radar Chart</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Compare companies across 6 performance dimensions: Market Opportunity, Team Execution, Tech Differentiation,
          Funding Efficiency, Growth Metrics, and Industry Impact.
        </p>
      </div>
      {!hasThesis ? (
        <FocusPrompt label="Set Focus" description="Configure your thesis on the main dashboard to unlock this visualization." />
      ) : isLoading ? (
        <Skeleton className="h-[600px] rounded-xl" />
      ) : (
        <>
          <VizFilterBar companies={companies} />
          <RadarChart data={filtered} className="h-[640px]" />
        </>
      )}
    </div>
  )
}

export default function RadarPage() {
  return (
    <VizPageShell>
      <RadarInner />
    </VizPageShell>
  )
}
