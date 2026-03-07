"use client"

import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { FocusPrompt } from "@/components/dashboard/focus-prompt"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { VizFilterBar } from "@/components/viz-filter-bar"
import { ChordChart } from "@/components/charts/chord-chart"
import { Skeleton } from "@/components/ui/skeleton"

function ChordInner() {
  const { companies, filtered, isLoading, hasThesis } = useThesisGatedData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Chord Diagram</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Relationship flows between investment categories and countries — ribbon thickness represents total funding.
        </p>
      </div>
      {isLoading ? (
        <Skeleton className="h-[680px] rounded-xl" />
      ) : !hasThesis ? (
        <FocusPrompt label="Set Focus" description="Configure your thesis on the main dashboard to unlock this visualization." />
      ) : (
        <>
          <VizFilterBar companies={companies} />
          <ChordChart data={filtered} className="h-[680px]" />
        </>
      )}
    </div>
  )
}

export default function ChordPage() {
  return (
    <VizPageShell>
      <ChordInner />
    </VizPageShell>
  )
}
