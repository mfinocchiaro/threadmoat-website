"use client"

import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { ReportGenerator } from "@/components/charts/report-generator"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { usePlan } from "@/contexts/plan-context"
import { FileDown, Lock, BarChart2, TrendingUp, Loader2, CheckCircle2 } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { AccessTier } from "@/lib/tiers"

type DownloadPolicy = 'none' | 'one_total' | 'one_per_report' | 'unlimited'

function getPolicy(tier: AccessTier): DownloadPolicy {
  switch (tier) {
    case 'explorer':   return 'none'
    case 'analyst':    return 'one_total'
    case 'investor':   return 'one_per_report'
    case 'strategist': return 'one_per_report'
    case 'admin':      return 'unlimited'
  }
}

const PUBLISHED_REPORTS = [
  {
    slug: "industrials-report-2026-Q1",
    title: "Industrials Tech Report — Q1 2026",
    description: "Deep-dive into 150+ industrial-tech startups: category concentration, disruption exposure scores, top-20 rankings, and investor/customer overlap analysis.",
    date: "Q1 2026",
    filename: "/reports/industrials-report-2026-Q1.pdf",
    icon: BarChart2,
  },
  {
    slug: "btb-market-pulse-q1-2026-v2",
    title: "B2B Market Pulse — Q1 2026",
    description: "Quarterly market pulse covering funding trends, sector momentum shifts, and key signals across the B2B software and industrial automation landscape.",
    date: "Q1 2026",
    filename: "/reports/btb-market-pulse-q1-2026-v2.pdf",
    icon: TrendingUp,
  },
]

type DownloadState = 'idle' | 'loading' | 'done' | 'locked' | 'limit_reached'

function getButtonLabel(state: DownloadState): React.ReactNode {
  switch (state) {
    case 'loading':       return <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Downloading…</>
    case 'done':          return <><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />Downloaded</>
    case 'locked':        return <><Lock className="mr-1.5 h-3.5 w-3.5" />Subscribers only</>
    case 'limit_reached': return <><Lock className="mr-1.5 h-3.5 w-3.5" />Download limit reached</>
    default:              return <><FileDown className="mr-1.5 h-3.5 w-3.5" />Download PDF</>
  }
}

function PublishedReports() {
  const { accessTier } = usePlan()
  const policy = getPolicy(accessTier)

  // downloaded slugs fetched from the server
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set())
  const [fetched, setFetched] = useState(false)

  // per-report loading state
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null)

  useEffect(() => {
    if (policy === 'none') { setFetched(true); return }
    fetch('/api/reports/download')
      .then(r => r.json())
      .then((data: { downloaded?: string[] }) => {
        if (data.downloaded) setDownloaded(new Set(data.downloaded))
      })
      .catch(() => {/* non-fatal */})
      .finally(() => setFetched(true))
  }, [policy])

  const resolveState = useCallback((slug: string): DownloadState => {
    if (policy === 'none') return 'locked'
    if (policy === 'unlimited') return 'idle'
    if (downloaded.has(slug)) return 'done'
    if (policy === 'one_total' && downloaded.size > 0) return 'limit_reached'
    return 'idle'
  }, [policy, downloaded])

  const handleDownload = useCallback(async (slug: string, filename: string) => {
    setLoadingSlug(slug)
    try {
      const res = await fetch('/api/reports/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      const data = await res.json() as { ok: boolean; reason?: string }
      if (!data.ok) {
        // refresh state — server may have changed
        const status = await fetch('/api/reports/download').then(r => r.json()) as { downloaded?: string[] }
        if (status.downloaded) setDownloaded(new Set(status.downloaded))
        return
      }
      // Record locally and trigger file download
      setDownloaded(prev => new Set([...prev, slug]))
      const a = document.createElement('a')
      a.href = filename
      a.download = ''
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch {
      // network error — don't block the user
    } finally {
      setLoadingSlug(null)
    }
  }, [])

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Published Research Reports</h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Curated sector reports available for download.
          {policy === 'one_total' && (
            <span className="ml-1 text-amber-600 dark:text-amber-400">
              Your plan includes 1 report download.
            </span>
          )}
          {policy === 'one_per_report' && (
            <span className="ml-1 text-muted-foreground">
              Each report can be downloaded once.
            </span>
          )}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {PUBLISHED_REPORTS.map((report) => {
          const Icon = report.icon
          const state: DownloadState = loadingSlug === report.slug
            ? 'loading'
            : fetched ? resolveState(report.slug) : (policy === 'none' ? 'locked' : 'idle')
          const isDisabled = state === 'locked' || state === 'limit_reached' || state === 'loading'
          const isDone = state === 'done'

          return (
            <div
              key={report.slug}
              className="flex gap-3 rounded-xl border bg-card p-4"
            >
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div>
                  <div className="text-sm font-medium leading-snug">{report.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{report.date}</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{report.description}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-fit mt-auto"
                  disabled={isDisabled || isDone}
                  onClick={!isDisabled && !isDone ? () => handleDownload(report.slug, report.filename) : undefined}
                >
                  {getButtonLabel(state)}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ReportsInner() {
  const { filtered, isLoading } = useThesisGatedData()

  return (
    <div className="space-y-8">
      <PublishedReports />
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Report Generator</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Search companies and generate detailed IC-memo style investment reports with score breakdowns, strengths, and weaknesses.
          </p>
        </div>
        {isLoading ? (
          <Skeleton className="h-[600px] rounded-xl" />
        ) : (
          <ReportGenerator data={filtered} className="w-full" />
        )}
      </div>
    </div>
  )
}

export function ReportsContent() {
  return (
    <VizPageShell>
      <ReportsInner />
    </VizPageShell>
  )
}
