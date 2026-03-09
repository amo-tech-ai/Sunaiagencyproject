// C14-METRICS — Strategy Metrics Bar (5 KPI cards)
// Mobile: compact 2×2 grid with tap-to-expand. Tablet: 3-col. Desktop: 5-col.
// BCG design system: warm off-white, charcoal text, green accents

import { useState } from 'react';
import {
  Activity, Target, Lightbulb, Clock, Zap, ChevronDown, ChevronUp,
} from 'lucide-react';
import type { StrategyMetrics } from '../../../lib/types/strategy';

interface StrategyMetricsBarProps {
  metrics: StrategyMetrics;
}

export default function StrategyMetricsBar({ metrics }: StrategyMetricsBarProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const cards = [
    {
      label: 'Health Score',
      shortLabel: 'Health',
      value: `${metrics.healthScore}%`,
      icon: Activity,
      color: metrics.healthScore >= 60
        ? 'text-green-600'
        : metrics.healthScore >= 30
          ? 'text-amber-500'
          : 'text-red-500',
    },
    {
      label: 'Canvas Complete',
      shortLabel: 'Canvas',
      value: `${metrics.canvasCompleteness}%`,
      icon: Target,
      color: 'text-[#00875A]',
    },
    {
      label: 'Insights',
      shortLabel: 'Insights',
      value: String(metrics.insightCount),
      icon: Lightbulb,
      color: 'text-blue-600',
    },
    {
      label: 'Pending Approvals',
      shortLabel: 'Pending',
      value: String(metrics.pendingApprovals),
      icon: Clock,
      color: metrics.pendingApprovals > 0 ? 'text-amber-500' : 'text-gray-400',
    },
    {
      label: 'Opportunities',
      shortLabel: 'Opps',
      value: String(metrics.opportunitiesDetected),
      icon: Zap,
      color: 'text-purple-600',
    },
  ];

  return (
    <>
      {/* Mobile: Compact 2×2 summary strip with tap-to-expand */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="w-full grid grid-cols-2 gap-2 text-xs p-3 bg-white border border-[#E8E8E4] rounded-lg"
        >
          {(mobileExpanded ? cards : cards.slice(0, 4)).map(({ shortLabel, value, color }) => (
            <div key={shortLabel} className="flex items-center justify-between px-1">
              <span className="text-[#9CA39B]">{shortLabel}:</span>
              <span className={`font-semibold ${color}`}>{value}</span>
            </div>
          ))}
          {!mobileExpanded && (
            <div className="col-span-2 flex items-center justify-center gap-1 pt-1 text-[10px] text-[#9CA39B]">
              <ChevronDown className="w-3 h-3" /> Tap to expand
            </div>
          )}
          {mobileExpanded && (
            <div className="col-span-2 flex items-center justify-center gap-1 pt-1 text-[10px] text-[#9CA39B]">
              <ChevronUp className="w-3 h-3" /> Collapse
            </div>
          )}
        </button>
      </div>

      {/* Tablet: 3+2 grid / Desktop: 5-column row */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-lg border border-[#D4CFC8] p-3 flex items-center gap-3">
            <div className={`p-2 rounded-md bg-gray-50 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-gray-500 leading-tight">{label}</div>
              <div className="text-lg font-semibold text-[#1A1A1A] leading-tight">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
