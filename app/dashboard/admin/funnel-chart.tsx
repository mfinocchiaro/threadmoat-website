"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2 } from "lucide-react"

interface FunnelStage {
  stage: string
  count: number
}

export function FunnelChart() {
  const [stages, setStages] = useState<FunnelStage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchFunnel = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/funnel")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setStages(data.funnel || [])
    } catch {
      setError("Failed to load funnel data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFunnel()
  }, [fetchFunnel])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading funnel...
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-destructive py-4">{error}</p>
  }

  const maxCount = Math.max(...stages.map(s => s.count), 1)

  return (
    <div className="space-y-3">
      {stages.map((stage, i) => {
        const pct = (stage.count / maxCount) * 100
        const convRate =
          i > 0 && stages[i - 1].count > 0
            ? ((stage.count / stages[i - 1].count) * 100).toFixed(1)
            : null

        return (
          <div key={stage.stage} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{stage.stage}</span>
              <div className="flex items-center gap-2">
                <span className="text-foreground font-mono">{stage.count}</span>
                {convRate && (
                  <span className="text-xs text-muted-foreground">
                    ({convRate}%)
                  </span>
                )}
              </div>
            </div>
            <div className="h-6 w-full rounded bg-muted/50 overflow-hidden">
              <div
                className="h-full rounded bg-primary/70 transition-all duration-500"
                style={{ width: `${Math.max(pct, 2)}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
