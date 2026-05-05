interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
}

function MetricCard({ label, value, unit }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <p className="text-sm text-gray-600 font-medium">{label}</p>
      <p className="text-3xl font-bold mt-2">
        {typeof value === 'number' ? value.toLocaleString() : value}
        {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
      </p>
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
      />
      <MetricCard
        label="Total Impressions"
        value={totalImpressions}
      />
      <MetricCard
        label="Avg Click-Through Rate"
        value={(avgCtr * 100).toFixed(2)}
        unit="%"
      />
      <MetricCard
        label="Avg Position"
        value={avgPosition.toFixed(1)}
      />
    </div>
  );
}
