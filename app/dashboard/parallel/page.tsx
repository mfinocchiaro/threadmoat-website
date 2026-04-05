"use client"

import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { ParallelCoordsChart } from "@/components/charts/parallel-coords-chart"
import { Skeleton } from "@/components/ui/skeleton"

function ParallelInner() {
  const { filtered, isLoading } = useThesisGatedData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Parallel Coordinates</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Multi-dimensional company analysis. Drag vertically on any axis to filter companies. Click an axis label to
          clear its filter.
        </p>
        <details className="mt-2 text-xs text-muted-foreground">
          <summary className="cursor-pointer font-medium hover:text-foreground">How to read this chart</summary>
          <p className="mt-1 leading-relaxed">Each vertical axis represents a different metric (funding, score, headcount, etc.) and each line is a company threading through all axes. Lines that converge at the top of an axis indicate high values for that metric. Drag to select a range on any axis — only companies passing through that range stay visible. This reveals correlations: e.g., companies with high growth metrics tend to also have high market opportunity. Crossed lines between two axes indicate inverse relationships.</p>
        </details>
      </div>
      {isLoading ? (
        <Skeleton className="h-[640px] rounded-xl" />
      ) : (
          <ParallelCoordsChart data={filtered} className="h-[640px]" />
      )}
    </div>
  )
}

export default function ParallelPage() {
  return (
    <VizPageShell>
      <ParallelInner />
    </VizPageShell>
  )
}
