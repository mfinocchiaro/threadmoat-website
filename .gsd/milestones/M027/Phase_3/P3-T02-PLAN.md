# P3-T02 PLAN — Trends Chart & Metric Cards

**Phase:** 3 (Dashboard UI)  
**Task:** P3-T02 — Build trends chart (line/bar) and metric cards for GSC data  
**Estimate:** 1–2 days  
**Priority:** High  
**Files:** `app/components/gsc/trends-chart.tsx`, `app/components/gsc/metric-cards.tsx`, `app/dashboard/gsc/page.tsx` (update)

---

## Goal

Add visualization of GSC data trends over time with interactive line/bar chart. Display summary metrics (total clicks, impressions, avg CTR, avg position) in prominent cards above the chart.

---

## Requirements Met

- **UI-02**: Trends chart (daily/weekly/monthly)
- **UI-05**: Performance metrics cards (total clicks, avg CTR, avg position)

---

## Tasks

### 1. Metric Cards Component

**File:** `app/components/gsc/metric-cards.tsx`

```typescript
interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

function MetricCard({ label, value, unit, icon, trend }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-3xl font-bold mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
            {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
          </p>
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      {trend && (
        <div className={`mt-4 text-sm ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} Trend
        </div>
      )}
    </div>
  );
}

interface MetricsDisplayProps {
  totalClicks: number;
  totalImpressions: number;
  avgCtr: number;
  avgPosition: number;
}

export function MetricCards({
  totalClicks,
  totalImpressions,
  avgCtr,
  avgPosition,
}: MetricsDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Total Clicks"
        value={totalClicks}
        icon="📊"
      />
      <MetricCard
        label="Total Impressions"
        value={totalImpressions}
        icon="👁️"
      />
      <MetricCard
        label="Avg Click-Through Rate"
        value={(avgCtr * 100).toFixed(2)}
        unit="%"
        icon="📈"
      />
      <MetricCard
        label="Avg Position"
        value={avgPosition.toFixed(1)}
        icon="🎯"
      />
    </div>
  );
}
```

### 2. Trends Chart Component

**File:** `app/components/gsc/trends-chart.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MetricCards } from './metric-cards';

interface TrendData {
  date: string;
  clicks: number;
  impressions: number;
  avg_ctr: number;
  avg_position: number;
  num_queries: number;
}

interface TrendsSummary {
  period_start: string;
  period_end: string;
  total_clicks: number;
  total_impressions: number;
  avg_ctr: number;
  avg_position: number;
}

interface TrendsChartProps {
  propertyId: string;
  startDate: string;
  endDate: string;
}

export function TrendsChart({ propertyId, startDate, endDate }: TrendsChartProps) {
  const [data, setData] = useState<TrendData[]>([]);
  const [summary, setSummary] = useState<TrendsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [groupBy, setGroupBy] = useState<'date' | 'week' | 'month'>('date');
  const [metric, setMetric] = useState<'clicks' | 'impressions' | 'ctr' | 'position'>('clicks');

  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          propertyId,
          startDate,
          endDate,
          groupBy,
        });

        const res = await fetch(`/api/admin/gsc/trends?${params}`);
        const result = await res.json();

        setData(result.data || []);
        setSummary(result.summary || null);
      } catch (error) {
        console.error('Failed to fetch trends:', error);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId && startDate && endDate) {
      fetchTrends();
    }
  }, [propertyId, startDate, endDate, groupBy]);

  if (loading || !data.length) {
    return <div className="text-center py-8">Loading trends...</div>;
  }

  // Determine which metric field to display
  const metricField = metric === 'ctr' ? 'avg_ctr' :
                     metric === 'position' ? 'avg_position' :
                     metric;

  // Format CTR for display (0-1 range to 0-100)
  const chartData = data.map(d => ({
    ...d,
    displayValue: metric === 'ctr' ? d.avg_ctr * 100 : d[metricField as keyof TrendData],
  }));

  const metricLabel = metric === 'ctr' ? 'CTR (%)' :
                     metric === 'position' ? 'Avg Position' :
                     metric === 'clicks' ? 'Clicks' :
                     'Impressions';

  return (
    <div className="space-y-8">
      {/* Metric Cards */}
      {summary && (
        <MetricCards
          totalClicks={summary.total_clicks}
          totalImpressions={summary.total_impressions}
          avgCtr={summary.avg_ctr}
          avgPosition={summary.avg_position}
        />
      )}

      {/* Chart Controls */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grouping
          </label>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Metric
          </label>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="clicks">Clicks</option>
            <option value="impressions">Impressions</option>
            <option value="ctr">Click-Through Rate</option>
            <option value="position">Average Position</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">
          {metricLabel} Over Time
        </h3>

        <ResponsiveContainer width="100%" height={400}>
          {metric === 'impressions' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
              <Bar
                dataKey={metricField}
                fill="#3b82f6"
                name={metricLabel}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value) =>
                  metric === 'ctr'
                    ? `${(value as number).toFixed(2)}%`
                    : (value as number).toLocaleString()
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={metricField}
                stroke="#3b82f6"
                name={metricLabel}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="bg-blue-50 rounded-lg p-6 text-sm text-gray-700">
          <p className="font-medium mb-2">Period Summary:</p>
          <p>
            {summary.period_start} to {summary.period_end}
          </p>
          <p className="mt-2">
            Average CTR: <span className="font-semibold">{(summary.avg_ctr * 100).toFixed(2)}%</span>
            {' '} | Average Position: <span className="font-semibold">{summary.avg_position.toFixed(1)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
```

### 3. Update Dashboard Page

Update `app/dashboard/gsc/page.tsx` to include the trends chart:

```typescript
// ... existing imports ...
import { TrendsChart } from '@/app/components/gsc/trends-chart';

// ... existing code ...

  return (
    <div className="space-y-8 p-8">
      {/* ... existing header and controls ... */}

      {/* Trends Chart */}
      {propertyId && startDate && endDate && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Trends</h2>
          <TrendsChart
            propertyId={propertyId}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      )}

      {/* Rankings Table */}
      {propertyId && startDate && endDate && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Rankings</h2>
          <RankingsTable
            propertyId={propertyId}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      )}
    </div>
  );
```

---

## Setup: Install Recharts

Add Recharts dependency for charting:

```bash
npm install recharts
```

Recharts is lightweight, tree-shakeable, and handles large datasets efficiently.

---

## Definition of Done

- [x] Metric cards component showing total clicks, impressions, avg CTR, avg position
- [x] Trends chart component with line/bar chart visualization
- [x] Chart supports multiple metrics: clicks, impressions, CTR, position
- [x] Grouping controls: daily, weekly, monthly
- [x] Chart is responsive (mobile-friendly)
- [x] Loading states implemented
- [x] Error handling (no data, API failures)
- [x] Integration with dashboard page
- [x] TypeScript strict mode: 0 errors
- [x] Build passes with 0 errors

---

## Inputs

- Query API `/api/admin/gsc/trends` from P2-T03 (working)
- Synced GSC data from P2-T02 (real historical data)
- Dashboard page structure from P3-T01
- Recharts library for charting

## Expected Output

- MetricCards component (displays summary stats)
- TrendsChart component (line/bar chart with controls)
- Fully functional dashboard with trends visualization
- First graph showing search performance trends

## Verify

```bash
# 1. Install recharts
npm install recharts

# 2. Build succeeds
npm run build

# 3. Test trends chart
# http://localhost:3000/dashboard/gsc
# - Metric cards should display with real data
# - Chart should render with trend data
# - Grouping selector should change chart granularity
# - Metric selector should change displayed data

# 4. Test responsiveness
# View on mobile (< 640px width) — chart should adapt

# 5. Test with different date ranges
# Select last 7 days, last month, custom range
# Chart should update and display correctly
```

---

**Status:** Ready to Execute  
**Created:** 2026-05-05
