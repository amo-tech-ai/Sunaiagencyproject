// C14-INSIGHT — Strategy Insight card with priority border + dismiss
// Leaf component used by IntelligencePanel
// BCG design system: warm off-white, charcoal text, green accents

import { motion } from 'motion/react';
import {
  TrendingUp, AlertTriangle, Lightbulb, BarChart3, XCircle,
} from 'lucide-react';
import type { StrategyInsight } from '../../../lib/types/strategy';

const PRIORITY_COLORS: Record<string, string> = {
  high: 'border-l-red-500 bg-red-50/30',
  medium: 'border-l-amber-500 bg-amber-50/30',
  low: 'border-l-blue-500 bg-blue-50/30',
};

const TYPE_ICONS: Record<string, typeof Lightbulb> = {
  opportunity: TrendingUp,
  risk: AlertTriangle,
  recommendation: Lightbulb,
  trend: BarChart3,
};

interface InsightCardProps {
  insight: StrategyInsight;
  onDismiss: (id: string) => void;
}

export default function InsightCard({ insight, onDismiss }: InsightCardProps) {
  const Icon = TYPE_ICONS[insight.insight_type] || Lightbulb;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`border-l-2 rounded-r-lg p-3 ${PRIORITY_COLORS[insight.priority] || PRIORITY_COLORS.medium}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <Icon className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <div className="text-xs font-medium text-[#1A1A1A] leading-tight">{insight.title}</div>
            <p className="text-[11px] text-gray-600 mt-1 leading-relaxed line-clamp-2">{insight.description}</p>
            {insight.confidence != null && (
              <span className="inline-block text-[10px] text-gray-400 mt-1">
                {Math.round(insight.confidence * 100)}% confidence
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => onDismiss(insight.id)}
          className="p-1 text-gray-400 hover:text-gray-600 shrink-0"
          title="Dismiss"
        >
          <XCircle className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
