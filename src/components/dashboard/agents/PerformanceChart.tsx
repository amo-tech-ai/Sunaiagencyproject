// C103-PERFORMANCE-CHART — Horizontal bar chart of AI runs grouped by prompt_type
// Uses pure CSS bars to avoid recharts duplicate-key warnings in vertical layout.
// BCG design: #00875A bars, #F5F5F0 bg, Georgia labels.

import type { AggregateStats } from '../../../lib/supabase';

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

  if (!stats || !stats.byType || Object.keys(stats.byType).length === 0) {
    return (
      <div className="bg-white rounded border border-[#E8E8E4] p-6 text-center">
        <p className="text-sm text-[#6B6B63]">No AI run data available yet.</p>
      </div>
    );
  }

  const chartData = Object.entries(stats.byType || {})
    .filter(([type]) => type != null && type !== '' && type !== 'null' && type !== 'undefined')
    .map(([type, data], index) => ({
      id: type || `unknown-${index}`,
      name: PROMPT_LABELS[type] || (type ? type.replace(/-/g, ' ') : `Unknown ${index + 1}`),
      runs: data.count ?? 0,
      tokens: data.tokens ?? 0,
      avgMs: data.avgMs ?? 0,
      successRate: data.successRate ?? 0,
    }))
    .sort((a, b) => b.runs - a.runs);

  const maxRuns = Math.max(...chartData.map((d) => d.runs), 1);

  return (
    <div className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-6">
      <h3 className="font-[Georgia,serif] text-sm sm:text-base font-semibold text-[#1A1A1A] mb-4">
        Runs by Agent Type
      </h3>
      <div className="space-y-3">
        {chartData.map((entry) => (
          <div key={entry.id} className="group relative">
            {/* Label row */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#6B6B63] truncate max-w-[60%]">
                {entry.name}
              </span>
              <span className="text-xs font-medium text-[#1A1A1A] tabular-nums">
                {entry.runs} {entry.runs === 1 ? 'run' : 'runs'}
              </span>
            </div>
            {/* Bar */}
            <div className="h-5 w-full bg-[#F5F5F0] rounded overflow-hidden">
              <div
                className="h-full bg-[#00875A] rounded transition-all duration-500 ease-out"
                style={{ width: `${(entry.runs / maxRuns) * 100}%`, minWidth: entry.runs > 0 ? 4 : 0 }}
              />
            </div>
            {/* Tooltip on hover */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block z-10 pointer-events-none">
              <div className="bg-white border border-[#E8E8E4] rounded px-3 py-2 shadow-md text-xs whitespace-nowrap">
                <p className="font-medium text-[#1A1A1A] mb-1">{entry.name}</p>
                <p className="text-[#6B6B63]">
                  {entry.runs} runs &middot; {(entry.tokens ?? 0).toLocaleString()} tokens
                </p>
                <p className="text-[#6B6B63]">
                  {entry.avgMs ?? 0}ms avg &middot; {entry.successRate ?? 0}% success
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
