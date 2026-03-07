// C88-INSIGHTS — AI recommendation cards panel
// Mobile-first: 48px min touch target for expand/collapse, responsive padding,
// focus-visible ring, ARIA expanded state
// v0.13.1: Accepts optional loading prop for live AI insights fetching

import type { InsightItem } from '../../lib/hooks/useDashboardData';
import { Link } from 'react-router';
import { Lightbulb, AlertTriangle, Info, ChevronRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AIInsightsPanelProps {
  insights: InsightItem[];
  loading?: boolean;
}

const PRIORITY_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  high: { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]', border: 'border-[#FECACA]' },
  medium: { icon: <Lightbulb className="w-4 h-4" />, color: 'text-[#D97706]', bg: 'bg-[#FEF3CD]', border: 'border-[#FDE68A]' },
  low: { icon: <Info className="w-4 h-4" />, color: 'text-[#00875A]', bg: 'bg-[#E6F4ED]', border: 'border-[#A7F3D0]' },
};

function InsightCard({ insight }: { insight: InsightItem }) {
  const [expanded, setExpanded] = useState(false);
  const config = PRIORITY_CONFIG[insight.priority] || PRIORITY_CONFIG.low;

  return (
    <div className="bg-white rounded border border-[#E8E8E4] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full text-left p-3 sm:p-4 flex items-start gap-3 hover:bg-[#F5F5F0]/50 transition-colors min-h-[52px] focus-visible:outline-2 focus-visible:outline-[#00875A] focus-visible:outline-offset-[-2px]"
      >
        <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 mt-0.5 ${config.bg} ${config.color}`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#1A1A1A]">{insight.title}</p>
          {!expanded && (
            <p className="text-xs text-[#9CA39B] mt-0.5 line-clamp-1">{insight.description}</p>
          )}
        </div>
        <ChevronRight
          className={`w-4 h-4 text-[#9CA39B] shrink-0 mt-1 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 sm:px-4 pb-3 sm:pb-4 pl-[52px] sm:pl-14">
              <p className="text-sm text-[#6B6B63] mb-3 leading-relaxed">{insight.description}</p>
              {insight.action && insight.actionLabel && (
                <Link
                  to={insight.action}
                  className="inline-flex items-center gap-1 text-sm text-[#00875A] hover:underline font-medium min-h-[44px] sm:min-h-0"
                >
                  {insight.actionLabel}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AIInsightsPanel({ insights, loading }: AIInsightsPanelProps) {
  if (insights.length === 0 && !loading) return null;

  return (
    <section aria-labelledby="insights-heading">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-[#00875A]" />
        <h3 id="insights-heading" className="font-[Georgia,serif] text-sm sm:text-base font-semibold text-[#1A1A1A]">
          AI Insights
        </h3>
        {loading ? (
          <span className="flex items-center gap-1.5 text-xs text-[#9CA39B] ml-auto">
            <Loader2 className="w-3 h-3 animate-spin" />
            Generating insights...
          </span>
        ) : (
          <span className="text-xs text-[#9CA39B] ml-auto">{insights.length} recommendation{insights.length !== 1 ? 's' : ''}</span>
        )}
      </div>
      {loading && insights.length === 0 ? (
        <div className="space-y-2">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded border border-[#E8E8E4] p-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded bg-[#F5F5F0] shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#F5F5F0] rounded w-3/4" />
                  <div className="h-3 bg-[#F5F5F0] rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {insights.map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}
    </section>
  );
}