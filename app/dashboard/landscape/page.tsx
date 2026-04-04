"use client"

import dynamic from "next/dynamic"
import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { Skeleton } from "@/components/ui/skeleton"

const LandscapeChart = dynamic(
  () => import("@/components/charts/landscape-chart").then(m => m.LandscapeChart),
  { ssr: false, loading: () => <Skeleton className="h-[600px] rounded-xl" /> }
)

function LandscapeInner() {
  const { filtered, isLoading } = useThesisGatedData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Market Landscape</h1>
        <p className="text-muted-foreground text-sm mt-1">Companies grouped by investment category and subsegment — hover to zoom, click to view details.</p>
      </div>
      {isLoading ? (
        <Skeleton className="h-[600px] rounded-xl" />
      ) : (
          <LandscapeChart data={filtered} />
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
