"use client"

import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { FocusPrompt } from "@/components/dashboard/focus-prompt"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { VizFilterBar } from "@/components/viz-filter-bar"
import { WordcloudChart } from "@/components/charts/wordcloud-chart"
import { Skeleton } from "@/components/ui/skeleton"

function WordcloudInner() {
  const { companies, filtered, isLoading, hasThesis } = useThesisGatedData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Word Cloud</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Tag frequency visualization — larger words appear in more companies.
        </p>
      </div>
      {isLoading ? (
        <Skeleton className="h-[600px] rounded-xl" />
      ) : !hasThesis ? (
        <FocusPrompt label="Set Focus" description="Configure your thesis on the main dashboard to unlock this visualization." />
      ) : (
        <>
          <VizFilterBar companies={companies} />
          <WordcloudChart data={filtered} className="h-[640px]" />
        </>
      )}
    </div>
  )
}

export default function WordcloudPage() {
  return (
    <VizPageShell>
      <WordcloudInner />
    </VizPageShell>
  )
}
