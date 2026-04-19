"use client"

import { useEffect, useState } from "react"
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"

interface AnalyticsData {
  range: number
  signupsByDay: { day: string; count: number }[]
  signupsByType: { profile_type: string; count: number }[]
  activeByDay: { day: string; count: number }[]
  topPages: { route: string; views: number; unique_users: number }[]
  onboardingRate: { total: number; completed: number }
  conversion: { trials: number; paid: number }
  tierDistribution: { tier: string; count: number }[]
}

const COLORS = ["#7c3aed", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

const PROFILE_LABELS: Record<string, string> = {
  oem_enterprise: "OEM / Enterprise",
  vc_investor: "VC / Investor",
  startup_founder: "Startup Founder",
  isv_platform: "ISV / Platform",
}

const TIER_LABELS: Record<string, string> = {
  explorer_trial: "Explorer (Trial)",
  explorer: "Explorer",
  analyst_annual: "Analyst",
  strategist_annual: "Strategist",
  investor_annual: "Investor",
  no_subscription: "No Subscription",
}

function formatDay(day: string) {
  return new Date(day).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function CohortAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [range, setRange] = useState(30)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/analytics?range=${range}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [range])

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading analytics...</p>
  }
  if (!data) {
    return <p className="text-sm text-destructive">Failed to load analytics</p>
  }

  const signups = data.signupsByDay.map(d => ({ ...d, day: formatDay(d.day), count: Number(d.count) }))
  const active = data.activeByDay.map(d => ({ ...d, day: formatDay(d.day), count: Number(d.count) }))
  const byType = data.signupsByType.map(d => ({
    name: PROFILE_LABELS[d.profile_type] || d.profile_type,
    value: Number(d.count),
  }))
  const tiers = data.tierDistribution.map(d => ({
    name: TIER_LABELS[d.tier] || d.tier,
    value: Number(d.count),
  }))
  const onboardingPct = data.onboardingRate.total > 0
    ? Math.round((data.onboardingRate.completed / data.onboardingRate.total) * 100)
    : 0
  const conversionPct = data.conversion.trials > 0
    ? Math.round((data.conversion.paid / data.conversion.trials) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Range selector */}
      <div className="flex items-center gap-2">
        {[7, 30, 90].map(d => (
          <button
            key={d}
            onClick={() => setRange(d)}
            className={`px-3 py-1 text-xs rounded-md border transition-colors ${
              range === d
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {d}d
          </button>
        ))}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-md border border-border p-3">
          <p className="text-xs text-muted-foreground">New Signups</p>
          <p className="text-xl font-bold">{signups.reduce((s, d) => s + d.count, 0)}</p>
        </div>
        <div className="rounded-md border border-border p-3">
          <p className="text-xs text-muted-foreground">Onboarding Rate</p>
          <p className="text-xl font-bold">{onboardingPct}%</p>
        </div>
        <div className="rounded-md border border-border p-3">
          <p className="text-xs text-muted-foreground">Trial → Paid</p>
          <p className="text-xl font-bold">{conversionPct}%</p>
          <p className="text-[10px] text-muted-foreground">{data.conversion.paid}/{data.conversion.trials}</p>
        </div>
        <div className="rounded-md border border-border p-3">
          <p className="text-xs text-muted-foreground">Avg Daily Active</p>
          <p className="text-xl font-bold">
            {active.length > 0 ? Math.round(active.reduce((s, d) => s + d.count, 0) / active.length) : 0}
          </p>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Signups over time */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-3">Signups Over Time</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={signups}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#737373" }} />
              <YAxis tick={{ fontSize: 10, fill: "#737373" }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#171717", border: "1px solid #262626", borderRadius: 6 }} />
              <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* DAU trend */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-3">Daily Active Users</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={active}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#737373" }} />
              <YAxis tick={{ fontSize: 10, fill: "#737373" }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#171717", border: "1px solid #262626", borderRadius: 6 }} />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Profile type distribution */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-3">Signups by Profile Type</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={byType} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#171717", border: "1px solid #262626", borderRadius: 6 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tier distribution */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-3">Tier Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={tiers} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {tiers.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#171717", border: "1px solid #262626", borderRadius: 6 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top pages table */}
      <div>
        <h4 className="text-xs font-medium text-muted-foreground mb-3">Top Pages</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 pr-4">Route</th>
                <th className="text-right py-2 px-4">Views</th>
                <th className="text-right py-2 pl-4">Unique Users</th>
              </tr>
            </thead>
            <tbody>
              {data.topPages.map((p, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-1.5 pr-4 font-mono text-foreground">{p.route}</td>
                  <td className="py-1.5 px-4 text-right text-muted-foreground">{Number(p.views)}</td>
                  <td className="py-1.5 pl-4 text-right text-muted-foreground">{Number(p.unique_users)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
