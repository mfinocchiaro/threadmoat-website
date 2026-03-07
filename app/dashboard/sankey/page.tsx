"use client"

import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { FocusPrompt } from "@/components/dashboard/focus-prompt"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { VizFilterBar } from "@/components/viz-filter-bar"
import { SankeyChart } from "@/components/charts/sankey-chart"
import { Skeleton } from "@/components/ui/skeleton"

function SankeyInner() {
  const { companies, filtered, isLoading, hasThesis } = useThesisGatedData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Flow Diagram</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Follow the flow of AI-PLM startups through lifecycle stages, funding levels, and market impact tiers.
        </p>
      </div>
      {!hasThesis ? (
        <FocusPrompt label="Set Focus" description="Configure your thesis on the main dashboard to unlock this visualization." />
      ) : isLoading ? (
        <Skeleton className="h-[600px] rounded-xl" />
      ) : (
        <>
          <VizFilterBar companies={companies} />
          <SankeyChart data={filtered} className="h-[640px]" />
        </>
      )}
    </div>
  )
}

export default function SankeyPage() {
  return (
    <VizPageShell>
      <SankeyInner />
    </VizPageShell>
  )
}
