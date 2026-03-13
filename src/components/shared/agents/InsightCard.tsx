// Insight card with agent attribution — used on Insights page and Dashboard feed
// Shows priority badge, title, body, impact label, and which agent generated it

import { motion } from 'motion/react';
import { AgentBadge } from './AgentBadge';
import { AlertCircle, TrendingUp, Lightbulb } from 'lucide-react';

interface InsightCardProps {
  id: string;
  title: string;
  body: string;
  priority: 'high' | 'medium' | 'low';
  impactLabel?: string;
  agentSlug?: string;
  status?: 'new' | 'viewed' | 'acted' | 'dismissed';
  onStatusChange?: (id: string, status: string) => void;
  delay?: number;
  className?: string;
}

const PRIORITY_CONFIG = {
  high: { label: 'High Priority', color: '#DC2626', bg: '#FEF2F2', Icon: AlertCircle },
  medium: { label: 'Medium', color: '#D97706', bg: '#FEF9E7', Icon: TrendingUp },
  low: { label: 'Insight', color: '#6B7280', bg: '#F9FAFB', Icon: Lightbulb },
};

export function InsightCard({
  id,
  title,
  body,
  priority,
  impactLabel,
  agentSlug,
  status = 'new',
  onStatusChange,
  delay = 0,
  className = '',
}: InsightCardProps) {
  const pc = PRIORITY_CONFIG[priority];
  const Icon = pc.Icon;

  return (
    <motion.div
      className={`border rounded-lg bg-white overflow-hidden transition-all hover:shadow-sm ${
        status === 'dismissed' ? 'opacity-50' : ''
      } ${className}`}
      style={{ borderColor: '#E5E7EB', borderLeft: `3px solid ${pc.color}` }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
    >
      <div className="px-4 py-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{ backgroundColor: pc.bg, color: pc.color }}
            >
              <Icon className="w-3 h-3" />
              {pc.label}
            </span>
            {status === 'new' && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title="New" />
            )}
          </div>
          {agentSlug && <AgentBadge slug={agentSlug} />}
        </div>

        {/* Content */}
        <h4 className="text-sm font-medium text-[#111827] leading-snug">{title}</h4>
        <p className="text-xs text-[#6B7280] mt-1 leading-relaxed line-clamp-2">{body}</p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#F3F4F6]">
          {impactLabel && (
            <span className="text-[10px] text-[#9CA3AF]">
              Impact: <span className="text-[#374151] font-medium">{impactLabel}</span>
            </span>
          )}
          {onStatusChange && status !== 'dismissed' && (
            <div className="flex items-center gap-2 ml-auto">
              {status === 'new' && (
                <button
                  onClick={() => onStatusChange(id, 'viewed')}
                  className="text-[10px] text-[#6B7280] hover:text-[#111827] transition-colors"
                >
                  Mark read
                </button>
              )}
              <button
                onClick={() => onStatusChange(id, 'acted')}
                className="text-[10px] text-[#2563EB] hover:text-[#1D4ED8] transition-colors font-medium"
              >
                Take action
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
