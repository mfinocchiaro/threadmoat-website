"use client"

import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { FocusPrompt } from "@/components/dashboard/focus-prompt"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { VizFilterBar } from "@/components/viz-filter-bar"
import { MarimekkoChart } from "@/components/charts/marimekko-chart"
import { Skeleton } from "@/components/ui/skeleton"

function MarimekkoInner() {
  const { companies, filtered, isLoading, hasThesis } = useThesisGatedData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Marimekko Chart</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Market concentration view — cell width and height represent the relative share of each dimension.
        </p>
      </div>
      {isLoading ? (
        <Skeleton className="h-[640px] rounded-xl" />
      ) : !hasThesis ? (
        <FocusPrompt label="Set Focus" description="Configure your thesis on the main dashboard to unlock this visualization." />
      ) : (
        <>
          <VizFilterBar companies={companies} />
          <MarimekkoChart data={filtered} className="w-full" />
        </>
      )}
    </div>
  )
}

export default function MarimekkoPage() {
  return (
    <VizPageShell>
      <MarimekkoInner />
    </VizPageShell>
  )
}
