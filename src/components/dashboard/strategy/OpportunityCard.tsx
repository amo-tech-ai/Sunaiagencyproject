// C14-OPP — Automation Opportunity card with impact score + complexity
// Leaf component used by IntelligencePanel
// BCG design system: warm off-white, charcoal text, green accents

import { Zap } from 'lucide-react';
import type { AutomationOpportunity } from '../../../lib/types/strategy';

const COMPLEXITY_COLORS: Record<string, string> = {
  low: 'text-green-600 bg-green-50',
  medium: 'text-amber-600 bg-amber-50',
  high: 'text-red-600 bg-red-50',
};

interface OpportunityCardProps {
  opp: AutomationOpportunity;
}

export default function OpportunityCard({ opp }: OpportunityCardProps) {
  return (
    <div className="bg-white border border-[#D4CFC8] rounded-lg p-3">
      <div className="flex items-start gap-2">
        <Zap className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-[#1A1A1A]">{opp.title}</div>
          <p className="text-[11px] text-gray-600 mt-1 leading-relaxed line-clamp-2">{opp.description}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[10px] font-medium text-[#00875A]">Impact: {opp.impact_score}/100</span>
            {opp.roi_estimate && (
              <span className="text-[10px] text-gray-500">ROI: {opp.roi_estimate}</span>
            )}
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${COMPLEXITY_COLORS[opp.complexity] || COMPLEXITY_COLORS.medium}`}>
              {opp.complexity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
