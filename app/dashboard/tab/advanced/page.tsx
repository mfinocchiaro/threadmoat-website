"use client"

import { VizPageShell } from "@/components/dashboard/viz-page-shell"
import { useThesisGatedData } from "@/hooks/use-thesis-gated-data"
import { ChartCard } from "@/components/dashboard/chart-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Radar, Flame, SlidersHorizontal, BoxSelect, Activity, Type, Globe2 } from "lucide-react"
import dynamic from "next/dynamic"

const chartLoading = () => <Skeleton className="w-full h-full rounded-lg" />

const RadarChart = dynamic(
  () => import("@/components/charts/radar-chart").then(m => m.RadarChart),
  { ssr: false, loading: chartLoading }
)
const HeatmapChart = dynamic(
  () => import("@/components/charts/heatmap-chart").then(m => m.HeatmapChart),
  { ssr: false, loading: chartLoading }
)
const ParallelCoordsChart = dynamic(
  () => import("@/components/charts/parallel-coords-chart").then(m => m.ParallelCoordsChart),
  { ssr: false, loading: chartLoading }
)
const BoxPlotChart = dynamic(
  () => import("@/components/charts/box-plot-chart").then(m => m.BoxPlotChart),
  { ssr: false, loading: chartLoading }
)
const DistributionChart = dynamic(
  () => import("@/components/charts/distribution-chart").then(m => m.DistributionChart),
  { ssr: false, loading: chartLoading }
)
const WordcloudChart = dynamic(
  () => import("@/components/charts/wordcloud-chart").then(m => m.WordcloudChart),
  { ssr: false, loading: chartLoading }
)
const IndustryPenetrationChart = dynamic(
  () => import("@/components/charts/industry-penetration-chart").then(m => m.IndustryPenetrationChart),
  { ssr: false, loading: chartLoading }
)

function AdvancedInner() {
  const { filtered, isLoading, shortlistedIds } = useThesisGatedData()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[360px] rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Advanced Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Statistical distributions, correlations, and deep dives — {filtered.length} companies
        </p>
      </div>


      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ChartCard
          title="Radar Chart"
          subtitle="Multi-axis company scoring"
          href="/dashboard/radar"
          icon={Radar}
        >
          <RadarChart data={filtered} className="h-full" />
        </ChartCard>

        <ChartCard
          title="Heatmap"
          subtitle="Dimension cross-tabulation"
          href="/dashboard/heatmap"
          icon={Flame}
        >
          <HeatmapChart data={filtered} className="h-full" />
        </ChartCard>

        <ChartCard
          title="Parallel Coords"
          subtitle="Multi-metric comparison"
          href="/dashboard/parallel"
          icon={SlidersHorizontal}
        >
          <ParallelCoordsChart data={filtered} className="h-full" />
        </ChartCard>

        <ChartCard
          title="Box Plot"
          subtitle="Score distributions by group"
          href="/dashboard/box-plot"
          icon={BoxSelect}
        >
          <BoxPlotChart data={filtered} className="h-full" />
        </ChartCard>

        <ChartCard
          title="Distribution"
          subtitle="Key metric histograms"
          href="/dashboard/distribution"
          icon={Activity}
        >
          <DistributionChart data={filtered} className="h-full" />
        </ChartCard>

        <ChartCard
          title="Word Cloud"
          subtitle="Tag and description frequency"
          href="/dashboard/wordcloud"
          icon={Type}
        >
          <WordcloudChart data={filtered} className="h-full" />
        </ChartCard>

        <ChartCard
          title="Industry Penetration"
          subtitle="Startup density by industry"
          href="/dashboard/industry-penetration"
          icon={Globe2}
        >
          <IndustryPenetrationChart data={filtered} shortlistedIds={shortlistedIds} className="h-full" />
        </ChartCard>
      </div>
    </div>
  )
}

export default function AdvancedTabPage() {
  return (
    <VizPageShell>
      <AdvancedInner />
    </VizPageShell>
  )
}
