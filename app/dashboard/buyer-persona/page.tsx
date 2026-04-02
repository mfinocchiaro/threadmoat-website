"use client"

import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { BuyerPersonaChart } from "@/components/charts/buyer-persona-chart"
import { Skeleton } from "@/components/ui/skeleton"

function BuyerPersonaInner() {
  const { filtered, isLoading, shortlistedIds } = useThesisGatedData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Buyer Persona</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Who buys these products? Startups mapped by their target buyer persona —
          from Manufacturing/OT teams to Design Engineering, R&D Leadership, and Supply Chain.
        </p>
      </div>
      {isLoading ? (
        <Skeleton className="h-[600px] rounded-xl" />
      ) : (
        <BuyerPersonaChart data={filtered} shortlistedIds={shortlistedIds} className="min-h-[500px]" />
      )}
    </div>
  )
}

export default function BuyerPersonaPage() {
  return (
    <VizPageShell>
      <BuyerPersonaInner />
    </VizPageShell>
  )
}
