// C14-INTEL — Intelligence Panel (right column)
// Composite: PendingApprovalsSection + Insights + Opportunities + Recent Decisions
// Reused in both desktop grid and mobile tab view
// BCG design system: warm off-white, charcoal text, green accents

import { AnimatePresence } from 'motion/react';
import { Shield, Lightbulb, Zap, FileText, Sparkles } from 'lucide-react';
import type {
  StrategyInsight, StrategyRecommendation, AutomationOpportunity,
} from '../../../lib/types/strategy';
import InsightCard from './InsightCard';
import RecommendationCard from './RecommendationCard';
import OpportunityCard from './OpportunityCard';

interface IntelligencePanelProps {
  insights: StrategyInsight[];
  pendingRecs: StrategyRecommendation[];
  resolvedRecs: StrategyRecommendation[];
  opportunities: AutomationOpportunity[];
  approveRecommendation: (id: string, approved: boolean) => Promise<boolean>;
  updateInsightStatus: (id: string, status: string) => Promise<boolean>;
}

export default function IntelligencePanel({
  insights, pendingRecs, resolvedRecs, opportunities,
  approveRecommendation, updateInsightStatus,
}: IntelligencePanelProps) {
  return (
    <div className="space-y-5">
      {/* ── Pending Approvals Section (amber badge in sidebar matches this count) ── */}
      {pendingRecs.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-500" /> Pending Approvals ({pendingRecs.length})
          </h3>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {pendingRecs.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  rec={rec}
                  onApprove={(id) => approveRecommendation(id, true)}
                  onReject={(id) => approveRecommendation(id, false)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ── Insights ── */}
      {insights.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-blue-600" /> Insights ({insights.length})
          </h3>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {insights.slice(0, 8).map((insight) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  onDismiss={(id) => updateInsightStatus(id, 'dismissed')}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ── Automation Opportunities ── */}
      {opportunities.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-purple-600" /> Automation Opportunities ({opportunities.length})
          </h3>
          <div className="space-y-2">
            {opportunities.slice(0, 5).map((opp) => (
              <OpportunityCard key={opp.id} opp={opp} />
            ))}
          </div>
        </div>
      )}

      {/* ── Recent Decisions ── */}
      {resolvedRecs.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-gray-400" /> Recent Decisions ({resolvedRecs.length})
          </h3>
          <div className="space-y-2">
            {resolvedRecs.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} onApprove={() => {}} onReject={() => {}} />
            ))}
          </div>
        </div>
      )}

      {/* ── Empty State ── */}
      {insights.length === 0 && pendingRecs.length === 0 && opportunities.length === 0 && (
        <div className="text-center py-10">
          <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 mb-1">No intelligence yet</p>
          <p className="text-xs text-gray-400">Click &quot;Run Analysis&quot; to generate insights and recommendations.</p>
        </div>
      )}
    </div>
  );
}
