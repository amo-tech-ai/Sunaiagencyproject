// C103-PERFORMANCE-CHART — Bar chart of AI runs grouped by prompt_type
// Uses recharts BarChart. BCG design: #00875A bars, #F5F5F0 bg, Georgia labels.
// Mobile-first: responsive, horizontal scroll on xs if needed.

import type { AggregateStats } from '../../../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface PerformanceChartProps {
  stats: AggregateStats | null;
  loading: boolean;
}

const PROMPT_LABELS: Record<string, string> = {
  'analyze-business': 'Business Analysis',
  'industry-diagnostics': 'Diagnostics',
  'system-recommendations': 'Recommendations',
  'readiness-score': 'Readiness Score',
  'generate-roadmap': 'Roadmap',
  'dashboard-insights': 'Insights',
};

export default function PerformanceChart({ stats, loading }: PerformanceChartProps) {
  if (loading) {
    return (
      <div className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-6">
        <div className="h-4 bg-[#F5F5F0] rounded w-40 mb-4" />
        <div className="h-52 bg-[#F5F5F0] rounded animate-pulse" />
      </div>
    );
  }

  if (!stats || Object.keys(stats.byType).length === 0) {
    return (
      <div className="bg-white rounded border border-[#E8E8E4] p-6 text-center">
        <p className="text-sm text-[#6B6B63]">No AI run data available yet.</p>
      </div>
    );
  }

  const chartData = Object.entries(stats.byType).map(([type, data]) => ({
    name: PROMPT_LABELS[type] || type.replace(/-/g, ' '),
    runs: data.count,
    tokens: data.tokens,
    avgMs: data.avgMs,
    successRate: data.successRate,
  })).sort((a, b) => b.runs - a.runs);

  return (
    <div className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-6">
      <h3 className="font-[Georgia,serif] text-sm sm:text-base font-semibold text-[#1A1A1A] mb-4">
        Runs by Agent Type
      </h3>
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E4" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA39B' }} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: '#6B6B63' }}
              width={120}
            />
            <Tooltip
              content={({ payload }) => {
                if (!payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-white border border-[#E8E8E4] rounded px-3 py-2 shadow-sm text-xs">
                    <p className="font-medium text-[#1A1A1A] mb-1">{d.name}</p>
                    <p className="text-[#6B6B63]">{d.runs} runs &middot; {d.tokens.toLocaleString()} tokens</p>
                    <p className="text-[#6B6B63]">{d.avgMs}ms avg &middot; {d.successRate}% success</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="runs" fill="#00875A" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
