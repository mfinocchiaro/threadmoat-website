"use client";

import dynamic from "next/dynamic";
import { Company, formatCurrency } from "@/lib/company-data";
import { useFilter } from "@/contexts/filter-context";
import { useThesis, ScoredCompany } from "@/contexts/thesis-context";
import { KPICard } from "@/components/widgets/kpi-card";
import { WidgetCard } from "@/components/widgets/widget-card";
import { VizFilterBar } from "@/components/viz-filter-bar";
import { BubbleChart } from "@/components/charts/bubble-chart";
import { QuadrantChart } from "@/components/charts/quadrant-chart";
import { PeriodicTable } from "@/components/charts/periodic-table";
import { AlertTriangle, BarChart3, Target, CheckCircle2 } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { FocusPrompt } from "@/components/dashboard/focus-prompt";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

const MapChart = dynamic(() => import("@/components/charts/map-chart").then(m => m.MapChart), {
    ssr: false,
    loading: () => <Skeleton className="w-full h-full min-h-[450px] rounded-lg" />,
});

function CompanyHoverRow({ scored }: { scored: ScoredCompany }) {
    const c = scored.company;
    return (
        <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
                <div className="flex items-start gap-3 p-2 bg-red-50/10 border border-red-200/20 rounded cursor-default">
                    <AlertTriangle className="size-4 text-red-500 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold truncate">{c.name}</div>
                        <div className="text-xs text-muted-foreground">
                            Funding efficiency: {c.fundingEfficiency?.toFixed(1)}/10 · {formatCurrency(c.totalFunding || 0)} raised
                        </div>
                    </div>
                </div>
            </HoverCardTrigger>
            <HoverCardContent side="left" className="w-80">
                <CompanyDetail company={c} score={scored.score} />
            </HoverCardContent>
        </HoverCard>
    );
}

function CompanyDetail({ company: c, score }: { company: Company; score?: number }) {
    return (
        <div className="space-y-2">
            <div>
                <div className="font-semibold text-sm">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.hqLocation}</div>
            </div>
            <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-[10px]">{c.investmentList}</Badge>
                {c.subsegment && <Badge variant="secondary" className="text-[10px]">{c.subsegment}</Badge>}
                {c.latestFundingRound && <Badge variant="secondary" className="text-[10px]">{c.latestFundingRound}</Badge>}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {score != null && (
                    <div><span className="text-muted-foreground">Match:</span> <span className="font-medium">{score}%</span></div>
                )}
                <div><span className="text-muted-foreground">Founded:</span> {c.founded || "—"}</div>
                <div><span className="text-muted-foreground">Headcount:</span> {c.headcount || "—"}</div>
                <div><span className="text-muted-foreground">Total Funding:</span> {formatCurrency(c.totalFunding || 0)}</div>
                <div><span className="text-muted-foreground">Revenue:</span> {formatCurrency(c.estimatedRevenue || 0)}</div>
                <div><span className="text-muted-foreground">Moat:</span> {c.weightedScore?.toFixed(0) || "—"}</div>
            </div>
            {c.strengths && (
                <div className="text-xs">
                    <span className="text-muted-foreground">Strengths:</span>
                    <p className="mt-0.5 line-clamp-2">{c.strengths}</p>
                </div>
            )}
        </div>
    );
}

export function VCDashboard({ data, isLoading }: { data: Company[]; isLoading: boolean }) {
    const { filterCompany } = useFilter();
    const { activeThesis, activeConfig, scoreCompanies } = useThesis();
    const filtered = data.filter(filterCompany);

    const scored = useMemo(() => scoreCompanies(data), [scoreCompanies, data]);
    const matches = useMemo(() => scored.filter(r => r.score >= 50), [scored]);

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading portfolio data…</div>;

    const hasThesis = activeThesis === "vc" || activeThesis === "founder";

    // When thesis is active, widgets show thesis matches; otherwise filter-bar results
    const displayData = hasThesis ? matches.map(r => r.company) : filtered;

    // KPI values — thesis-driven when active, factual when not
    const kpi1Value = hasThesis ? matches.length.toString() : filtered.length.toString();
    const kpi1Label = hasThesis ? "Thesis Matches" : "Companies in View";
    const kpi1Sub = hasThesis ? `from ${data.length} total` : "Apply a focus to filter";

    const avgScore = filtered.length > 0
        ? (filtered.reduce((s, c) => s + (c.weightedScore || 0), 0) / filtered.length).toFixed(1)
        : "0.0";
    const matchAvgScore = matches.length > 0
        ? (matches.reduce((s, r) => s + r.score, 0) / matches.length).toFixed(0)
        : "0";

    // Red flags: only when thesis active — companies matching thesis with low funding efficiency
    const redFlags = useMemo(() => {
        if (!hasThesis) return [];
        return matches
            .filter(r => (r.company.fundingEfficiency || 0) < 3 && (r.company.totalFunding || 0) > 1_000_000)
            .slice(0, 5);
    }, [hasThesis, matches]);

    const focusLabel = activeConfig?.buttonText ?? "Set Focus";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Investor Intelligence</h1>
                <p className="text-muted-foreground">Deal flow analysis, portfolio tracking, and market landscape mapping.</p>
            </div>

            <VizFilterBar companies={data} />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 row-span-2">
                    <WidgetCard title="Global Deal Flow & Portfolio" subtitle="Geographic distribution of opportunities" className="h-full min-h-[500px]" href="/dashboard/map">
                        <MapChart data={displayData} className="h-full min-h-[450px]" />
                    </WidgetCard>
                </div>

                <div className="space-y-4">
                    <KPICard title={kpi1Label} value={kpi1Value} subtitle={kpi1Sub} trend={hasThesis ? "up" : undefined} icon={<Target className="size-4" />} />
                    <KPICard
                        title={hasThesis ? "Avg. Match Score" : "Avg. Moat Score"}
                        value={hasThesis ? `${matchAvgScore}%` : avgScore}
                        subtitle={hasThesis ? "Across thesis matches" : "All companies in view"}
                        icon={<BarChart3 className="size-4" />}
                    />
                    {!hasThesis ? (
                        <FocusPrompt label={focusLabel} description="Define your deal criteria to see burn warnings, match scores, and pipeline insights." />
                    ) : redFlags.length > 0 ? (
                        <WidgetCard title="Burn Warnings" subtitle="Thesis matches with low funding efficiency">
                            <div className="space-y-3">
                                {redFlags.map(r => (
                                    <CompanyHoverRow key={r.company.id} scored={r} />
                                ))}
                            </div>
                        </WidgetCard>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-emerald-200/30 bg-emerald-50/5 p-6 text-center">
                            <CheckCircle2 className="size-5 text-emerald-500" />
                            <p className="text-sm font-medium">No burn warnings</p>
                            <p className="text-xs text-muted-foreground">All {matches.length} thesis matches have healthy funding efficiency.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <WidgetCard title="Funding Distribution" subtitle={hasThesis ? `${displayData.length} thesis matches` : "Momentum vs round size"} href="/dashboard/bubbles">
                    <BubbleChart data={displayData} className="h-[400px]" />
                </WidgetCard>
                <WidgetCard title="Competitive Positioning" subtitle={hasThesis ? `${displayData.length} thesis matches` : "Market presence vs execution"} href="/dashboard/quadrant">
                    <QuadrantChart data={displayData} className="h-[400px]" />
                </WidgetCard>
            </div>

            <WidgetCard title="Intelligence Master List" subtitle={hasThesis ? `${displayData.length} thesis matches` : "Quick metrics overview"} href="/dashboard/periodic-table">
                <PeriodicTable data={displayData} compact={true} />
            </WidgetCard>
        </div>
    );
}
