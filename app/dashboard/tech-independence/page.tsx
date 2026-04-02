"use client"

import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { TechIndependenceChart } from "@/components/charts/tech-independence-chart"
import { Skeleton } from "@/components/ui/skeleton"

function TechIndependenceInner() {
  const { filtered, isLoading, shortlistedIds } = useThesisGatedData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Technology Independence</h1>
        <p className="text-muted-foreground text-sm mt-1">
          How independent are startups from major platform ecosystems? Higher scores indicate proprietary
          technology and fewer dependencies on Siemens, Dassault, PTC, or Autodesk platforms.
        </p>
      </div>
      {isLoading ? (
        <Skeleton className="h-[600px] rounded-xl" />
      ) : (
        <TechIndependenceChart data={filtered} shortlistedIds={shortlistedIds} className="min-h-[500px]" />
      )}
    </div>
  )
}

export default function TechIndependencePage() {
  return (
    <VizPageShell>
      <TechIndependenceInner />
    </VizPageShell>
  )
}
