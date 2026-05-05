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
    return <div className="text-center py-8 text-gray-500">Loading trends...</div>;
  }

  const metricField = metric === 'ctr' ? 'avg_ctr' :
                     metric === 'position' ? 'avg_position' :
                     metric;

  const chartData = data.map(d => ({
    ...d,
    displayValue: metric === 'ctr' ? (d.avg_ctr * 100) : d[metricField as keyof TrendData],
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
      <div className="flex flex-wrap gap-4 bg-white rounded-lg border border-gray-200 p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grouping
          </label>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
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
            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
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
              <Tooltip formatter={(value) => (value as number).toLocaleString()} />
              <Legend />
              <Bar
                dataKey="impressions"
                fill="#3b82f6"
                name="Impressions"
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
        <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
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
