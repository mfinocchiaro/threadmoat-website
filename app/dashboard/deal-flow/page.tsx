"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronRight, X, RotateCcw } from "lucide-react"
import type { Company } from "@/lib/company-data"

const STORAGE_KEY = "threadmoat-deal-flow"

type PipelineStage = "screening" | "evaluating" | "shortlisted" | "passed"

const STAGE_CONFIG: { key: PipelineStage; label: string; color: string; bgColor: string }[] = [
  { key: "screening", label: "Screening", color: "text-blue-500", bgColor: "bg-blue-500/10 border-blue-500/20" },
  { key: "evaluating", label: "Evaluating", color: "text-amber-500", bgColor: "bg-amber-500/10 border-amber-500/20" },
  { key: "shortlisted", label: "Shortlisted", color: "text-green-500", bgColor: "bg-green-500/10 border-green-500/20" },
  { key: "passed", label: "Passed", color: "text-muted-foreground", bgColor: "bg-muted/30 border-border" },
]

interface PipelineState {
  [companyId: string]: PipelineStage
}

function usePipelineState(): [PipelineState, (id: string, stage: PipelineStage | null) => void, () => void, boolean] {
  const [state, setState] = useState<PipelineState>({})
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (typeof parsed === "object" && parsed !== null) {
          setState(parsed)
        }
      }
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {}
  }, [state, hydrated])

  const setStage = useCallback((id: string, stage: PipelineStage | null) => {
    setState(prev => {
      if (stage === null) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: stage }
    })
  }, [])

  const reset = useCallback(() => setState({}), [])

  return [state, setStage, reset, hydrated]
}

function CompanyCard({
  company,
  stage,
  onMove,
  onRemove,
}: {
  company: Company
  stage: PipelineStage
  onMove: (nextStage: PipelineStage) => void
  onRemove: () => void
}) {
  const stageIdx = STAGE_CONFIG.findIndex(s => s.key === stage)
  const nextStage = stageIdx < STAGE_CONFIG.length - 1 ? STAGE_CONFIG[stageIdx + 1] : null

  return (
    <div className="rounded-md border border-border/50 p-3 bg-card hover:bg-muted/20 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="font-medium text-sm truncate">{company.name}</div>
          <div className="text-xs text-muted-foreground truncate">{company.discipline || "—"}</div>
          {company.hqLocation && (
            <div className="text-xs text-muted-foreground/60 mt-0.5">{company.hqLocation}</div>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {nextStage && (
            <button
              onClick={() => onMove(nextStage.key)}
              className={`rounded p-1 hover:bg-muted transition-colors ${nextStage.color}`}
              title={`Move to ${nextStage.label}`}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={onRemove}
            className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Remove from pipeline"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs font-mono text-primary">{company.weightedScore?.toFixed(1) || "—"}</span>
        {company.totalFunding > 0 && (
          <span className="text-xs text-muted-foreground">
            ${company.totalFunding >= 1_000_000 ? `${(company.totalFunding / 1_000_000).toFixed(0)}M` : `${(company.totalFunding / 1_000).toFixed(0)}K`}
          </span>
        )}
      </div>
    </div>
  )
}

function DealFlowInner() {
  const { filtered, isLoading } = useThesisGatedData()
  const [pipeline, setStage, resetPipeline, hydrated] = usePipelineState()
  const [search, setSearch] = useState("")
  const [addingTo, setAddingTo] = useState<PipelineStage | null>(null)

  const companyMap = useMemo(() => {
    const map = new Map<string, Company>()
    for (const c of filtered) map.set(c.id, c)
    return map
  }, [filtered])

  // Companies in pipeline by stage
  const stageCompanies = useMemo(() => {
    const result: Record<PipelineStage, Company[]> = {
      screening: [],
      evaluating: [],
      shortlisted: [],
      passed: [],
    }
    for (const [id, stage] of Object.entries(pipeline)) {
      const company = companyMap.get(id)
      if (company) result[stage].push(company)
    }
    // Sort each stage by weightedScore
    for (const key of Object.keys(result) as PipelineStage[]) {
      result[key].sort((a, b) => (b.weightedScore || 0) - (a.weightedScore || 0))
    }
    return result
  }, [pipeline, companyMap])

  // Search results for adding companies
  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return filtered
      .filter(c => !pipeline[c.id])
      .filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.discipline || "").toLowerCase().includes(q) ||
        (c.categoryTags || []).some(t => t.toLowerCase().includes(q))
      )
      .slice(0, 8)
  }, [filtered, search, pipeline])

  const totalInPipeline = Object.keys(pipeline).length

  if (isLoading || !hydrated) return <Skeleton className="h-[600px] rounded-xl" />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Deal Flow Pipeline</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track and evaluate companies through your assessment pipeline.
            {totalInPipeline > 0 && ` ${totalInPipeline} companies in pipeline.`}
          </p>
        </div>
        {totalInPipeline > 0 && (
          <Button variant="ghost" size="sm" onClick={resetPipeline} className="text-muted-foreground">
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Add company search */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search to add companies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => !addingTo && setAddingTo("screening")}
              className="pl-9"
            />
          </div>
          {search && (
            <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setAddingTo(null) }}>
              Cancel
            </Button>
          )}
        </div>
        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full max-w-md rounded-lg border border-border bg-card shadow-lg">
            {searchResults.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setStage(c.id, addingTo || "screening")
                  setSearch("")
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <div className="text-left">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.discipline || "—"}</div>
                </div>
                <Badge variant="outline" className="text-xs">+ {addingTo || "screening"}</Badge>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pipeline columns */}
      <div className="grid grid-cols-4 gap-4">
        {STAGE_CONFIG.map(config => (
          <div key={config.key} className={`rounded-lg border p-3 ${config.bgColor}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-medium ${config.color}`}>{config.label}</h3>
              <span className="text-xs text-muted-foreground">{stageCompanies[config.key].length}</span>
            </div>
            <div className="space-y-2 min-h-[100px]">
              {stageCompanies[config.key].map(c => (
                <CompanyCard
                  key={c.id}
                  company={c}
                  stage={config.key}
                  onMove={nextStage => setStage(c.id, nextStage)}
                  onRemove={() => setStage(c.id, null)}
                />
              ))}
              {stageCompanies[config.key].length === 0 && (
                <div className="flex items-center justify-center h-[80px] text-xs text-muted-foreground/50">
                  No companies
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DealFlowPage() {
  return (
    <VizPageShell>
      <DealFlowInner />
    </VizPageShell>
  )
}
