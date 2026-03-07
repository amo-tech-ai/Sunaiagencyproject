// C104-TOKEN-USAGE — Token consumption breakdown by agent type
// Shows proportional bars for each prompt_type's token usage.
// Mobile-first: responsive, 44px touch targets on expand.

import type { AggregateStats } from '../../../lib/supabase';
import { motion } from 'motion/react';

interface TokenUsagePanelProps {
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

const TYPE_COLORS: Record<string, string> = {
  'analyze-business': '#00875A',
  'industry-diagnostics': '#0284C7',
  'system-recommendations': '#7C3AED',
  'readiness-score': '#D97706',
  'generate-roadmap': '#DC2626',
  'dashboard-insights': '#059669',
};

export default function TokenUsagePanel({ stats, loading }: TokenUsagePanelProps) {
  if (loading) {
    return (
      <div className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-6">
        <div className="h-4 bg-[#F5F5F0] rounded w-36 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-10 bg-[#F5F5F0] rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats || !stats.totalTokens) {
    return (
      <div className="bg-white rounded border border-[#E8E8E4] p-6 text-center">
        <p className="text-sm text-[#6B6B63]">No token usage data yet.</p>
      </div>
    );
  }

  const typeEntries = Object.entries(stats.byType || {})
    .sort((a, b) => (b[1].tokens ?? 0) - (a[1].tokens ?? 0));

  return (
    <div className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-[Georgia,serif] text-sm sm:text-base font-semibold text-[#1A1A1A]">
          Token Usage
        </h3>
        <span className="text-xs text-[#9CA39B] font-mono">{(stats.totalTokens ?? 0).toLocaleString()} total</span>
      </div>

      <div className="space-y-3">
        {typeEntries.map(([type, data], i) => {
          const pct = stats.totalTokens ? Math.round(((data.tokens ?? 0) / stats.totalTokens) * 100) : 0;
          const color = TYPE_COLORS[type] || '#6B6B63';
          return (
            <div key={type}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#1A1A1A]">{PROMPT_LABELS[type] || type}</span>
                <span className="text-[#6B6B63] font-mono">{(data.tokens ?? 0).toLocaleString()} ({pct}%)</span>
              </div>
              <div className="h-2 rounded-full bg-[#F5F5F0] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}