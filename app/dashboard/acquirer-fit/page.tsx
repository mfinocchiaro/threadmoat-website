"use client"

import { useMemo } from "react"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import type { Company } from "@/lib/company-data"

interface ScoredCompany extends Company {
  acquirerFitScore: number
  fitBreakdown: {
    techDiff: number
    moat: number
    impact: number
    efficiency: number
    teamExec: number
  }
}

function computeAcquirerFit(c: Company): ScoredCompany {
  // Acquirer fit scoring: weighted composite of dimensions most relevant for M&A
  // Tech differentiation (30%) — unique tech = higher acquisition value
  // Competitive moat (25%) — defensibility signals IP value
  // Industry impact (20%) — market positioning matters for strategic fit
  // Funding efficiency (15%) — capital efficiency signals operational maturity
  // Team execution (10%) — team quality is a signal for post-acquisition success
  const techDiff = c.techDifferentiation || 0
  const moat = c.competitiveMoat || 0
  const impact = c.industryImpact || 0
  const efficiency = c.fundingEfficiency || 0
  const teamExec = c.teamExecution || 0

  const acquirerFitScore =
    techDiff * 0.3 +
    moat * 0.25 +
    impact * 0.2 +
    efficiency * 0.15 +
    teamExec * 0.1

  return {
    ...c,
    acquirerFitScore: Math.round(acquirerFitScore * 10) / 10,
    fitBreakdown: { techDiff, moat, impact, efficiency, teamExec },
  }
}

function ScoreBar({ value, max = 10, color = "bg-primary/60" }: { value: number; max?: number; color?: string }) {
  return (
    <div className="h-2 w-16 rounded bg-muted/50 overflow-hidden">
      <div className={`h-full rounded ${color}`} style={{ width: `${(value / max) * 100}%` }} />
    </div>
  )
}

function AcquirerFitInner() {
  const { filtered, isLoading } = useThesisGatedData()

  const ranked = useMemo(() => {
    return filtered
      .map(computeAcquirerFit)
      .filter(c => c.acquirerFitScore > 0)
      .sort((a, b) => b.acquirerFitScore - a.acquirerFitScore)
  }, [filtered])

  if (isLoading) return <Skeleton className="h-[600px] rounded-xl" />

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Acquirer Fit Scoring</h1>
          <Badge variant="secondary" className="text-xs">OEM / Enterprise</Badge>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Startups ranked by acquisition fit score. Weighted: Tech Differentiation (30%), Competitive Moat (25%),
          Industry Impact (20%), Funding Efficiency (15%), Team Execution (10%).
        </p>
      </div>

      <div className="rounded-lg border border-border overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-3 py-2 font-medium w-8">#</th>
              <th className="text-left px-3 py-2 font-medium">Company</th>
              <th className="text-left px-3 py-2 font-medium">Category</th>
              <th className="text-center px-3 py-2 font-medium">Fit Score</th>
              <th className="text-center px-3 py-2 font-medium">Tech</th>
              <th className="text-center px-3 py-2 font-medium">Moat</th>
              <th className="text-center px-3 py-2 font-medium">Impact</th>
              <th className="text-center px-3 py-2 font-medium">Efficiency</th>
              <th className="text-center px-3 py-2 font-medium">Team</th>
            </tr>
          </thead>
          <tbody>
            {ranked.slice(0, 50).map((c, i) => (
              <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                <td className="px-3 py-2">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.hqLocation}</div>
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground max-w-[200px] truncate">
                  {c.discipline || c.categoryTags?.join(", ") || "—"}
                </td>
                <td className="px-3 py-2 text-center">
                  <span className="font-mono font-bold text-primary">{c.acquirerFitScore}</span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <ScoreBar value={c.fitBreakdown.techDiff} />
                    <span className="text-xs font-mono w-4">{c.fitBreakdown.techDiff}</span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <ScoreBar value={c.fitBreakdown.moat} />
                    <span className="text-xs font-mono w-4">{c.fitBreakdown.moat}</span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <ScoreBar value={c.fitBreakdown.impact} />
                    <span className="text-xs font-mono w-4">{c.fitBreakdown.impact}</span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <ScoreBar value={c.fitBreakdown.efficiency} />
                    <span className="text-xs font-mono w-4">{c.fitBreakdown.efficiency}</span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <ScoreBar value={c.fitBreakdown.teamExec} />
                    <span className="text-xs font-mono w-4">{c.fitBreakdown.teamExec}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ranked.length > 50 && (
        <p className="text-xs text-muted-foreground text-center">
          Showing top 50 of {ranked.length} companies
        </p>
      )}
    </div>
  )
}

export default function AcquirerFitPage() {
  return (
    <VizPageShell>
      <AcquirerFitInner />
    </VizPageShell>
  )
}
