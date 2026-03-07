// C07-FORECAST — Weighted pipeline value forecast chart (Recharts BarChart)
// Shows next 6 months of weighted pipeline: sum(value * probability/100)
// BCG design: #00875A bars, #1A1A1A text, #F5F5F0 background

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ForecastDataPoint } from '../../../lib/types/crm-pipeline';

interface ForecastChartProps {
  data: ForecastDataPoint[];
  totalWeightedPipeline: number;
  totalActiveDeals: number;
}

function formatCurrency(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
  return `$${value.toLocaleString()}`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload as ForecastDataPoint;
  return (
    <div className="bg-white border border-[#E8E8E4] rounded-lg px-3 py-2 shadow-md">
      <p className="text-sm font-medium text-[#1A1A1A]">{label}</p>
      <p className="text-sm text-[#00875A] font-semibold">
        {formatCurrency(data.weightedValue)}
      </p>
      <p className="text-xs text-[#6B6B63]">
        {data.dealCount} {data.dealCount === 1 ? 'deal' : 'deals'}
      </p>
    </div>
  );
}

export default function ForecastChart({
  data,
  totalWeightedPipeline,
  totalActiveDeals,
}: ForecastChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white border border-[#E8E8E4] rounded-lg p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#1A1A1A]">
          Forecast &mdash; Weighted Pipeline Value
        </h3>
        <span className="text-xs text-[#6B6B63]">
          Total: {formatCurrency(totalWeightedPipeline)} across {totalActiveDeals} active deals
        </span>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#6B6B63' }}
            axisLine={false}
            tickLine={false}
            allowDuplicatedCategory={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9CA39B' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => formatCurrency(v)}
            width={50}
            allowDuplicatedCategory={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F5F5F0' }} />
          <Bar dataKey="weightedValue" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {data.map((entry, index) => (
              <Cell
                key={`forecast-bar-${index}`}
                fill={entry.weightedValue > 0 ? '#00875A' : '#E8E8E4'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
