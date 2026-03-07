// C99-INSIGHT-DETAIL-CARDS — Full-width insight cards with priority badges + actions
// Mobile-first: stacked layout, 44px action buttons, responsive padding.
// BCG design: flat white cards, thin borders, green accent on actions.

import type { InsightItem } from '../../../lib/hooks/useDashboardData';
import { Link } from 'react-router';
import { AlertTriangle, Lightbulb, Info, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface InsightDetailCardsProps {
  insights: InsightItem[];
  loading?: boolean;
}

const PRIORITY_META: Record<string, {
  icon: React.ReactNode;
  label: string;
  color: string;
  bg: string;
  border: string;
  dot: string;
}> = {
  high: {
    icon: <AlertTriangle className="w-4 h-4" />,
    label: 'High Priority',
    color: 'text-[#DC2626]',
    bg: 'bg-[#FEF2F2]',
    border: 'border-[#FECACA]',
    dot: 'bg-[#DC2626]',
  },
  medium: {
    icon: <Lightbulb className="w-4 h-4" />,
    label: 'Medium Priority',
    color: 'text-[#D97706]',
    bg: 'bg-[#FEF3CD]',
    border: 'border-[#FDE68A]',
    dot: 'bg-[#D97706]',
  },
  low: {
    icon: <Info className="w-4 h-4" />,
    label: 'Recommendation',
    color: 'text-[#00875A]',
    bg: 'bg-[#E6F4ED]',
    border: 'border-[#A7F3D0]',
    dot: 'bg-[#00875A]',
  },
};

function InsightCard({ insight, index }: { insight: InsightItem; index: number }) {
  const meta = PRIORITY_META[insight.priority] || PRIORITY_META.low;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        {/* Priority icon */}
        <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${meta.bg} ${meta.color}`}>
          {meta.icon}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h4 className="text-sm font-medium text-[#1A1A1A]">{insight.title}</h4>
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${meta.bg} ${meta.color} ${meta.border} border`}>
              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-[#6B6B63] leading-relaxed mb-3">
            {insight.description}
          </p>

          {/* Action */}
          {insight.action && insight.actionLabel && (
            <Link
              to={insight.action}
              className="inline-flex items-center gap-1.5 text-sm text-[#00875A] hover:underline font-medium min-h-[44px] sm:min-h-0 transition-colors"
            >
              {insight.actionLabel}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function InsightDetailCards({ insights, loading }: InsightDetailCardsProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded border border-[#E8E8E4] p-5 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#F5F5F0] rounded shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[#F5F5F0] rounded w-2/3" />
                <div className="h-3 bg-[#F5F5F0] rounded w-full" />
                <div className="h-3 bg-[#F5F5F0] rounded w-4/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="bg-white rounded border border-[#E8E8E4] p-6 text-center">
        <Lightbulb className="w-8 h-8 text-[#E8E8E4] mx-auto mb-2" />
        <p className="text-sm text-[#6B6B63]">No insights generated yet.</p>
        <p className="text-xs text-[#9CA39B] mt-1">Click "Generate Insights" to get AI recommendations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {insights.map((insight, i) => (
        <InsightCard key={insight.id} insight={insight} index={i} />
      ))}
    </div>
  );
}
