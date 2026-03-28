// DealScoreCard — Modal showing 5-factor deal health breakdown
// Displays each scoring factor with its contribution, agent attribution,
// insight text, and a Re-score button to recalculate

import { X, RefreshCw, TrendingUp, Clock, DollarSign, Users, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AgentBadge } from './AgentBadge';
import type { Deal, Stage } from '../../../lib/types/crm-pipeline';

interface DealScoreCardProps {
  deal: Deal | null;
  stages: Stage[];
  open: boolean;
  onClose: () => void;
  onRescore?: () => void;
}

interface ScoreFactor {
  id: string;
  label: string;
  icon: React.ReactNode;
  contribution: number;
  detail: string;
  status: 'positive' | 'neutral' | 'negative';
}

function stageProgress(deal: Deal, stages: Stage[]): number {
  const sorted = [...stages].sort((a, b) => a.position - b.position);
  const idx = sorted.findIndex(s => s.id === deal.stage_id);
  if (idx < 0 || sorted.length <= 1) return 0;
  return idx / (sorted.length - 1);
}

function computeFactors(deal: Deal, stages: Stage[]): ScoreFactor[] {
  const progress = stageProgress(deal, stages);
  const expectedProbability = Math.round(progress * 80 + 10);
  const probDelta = Math.abs(deal.probability - expectedProbability);

  // 1. Probability alignment
  let probContrib: number;
  let probStatus: 'positive' | 'neutral' | 'negative';
  let probDetail: string;
  if (probDelta <= 10) {
    probContrib = 10;
    probStatus = 'positive';
    probDetail = `${deal.probability}% aligns well with stage position (expected ~${expectedProbability}%)`;
  } else if (probDelta <= 25) {
    probContrib = 0;
    probStatus = 'neutral';
    probDetail = `${deal.probability}% vs expected ~${expectedProbability}% — slight misalignment`;
  } else {
    probContrib = -Math.min(15, Math.round(probDelta / 3));
    probStatus = 'negative';
    probDetail = `${deal.probability}% vs expected ~${expectedProbability}% — significant gap`;
  }

  // 2. Recency
  let recencyContrib: number;
  let recencyStatus: 'positive' | 'neutral' | 'negative';
  let recencyDetail: string;
  if (deal.isVeryStale) {
    recencyContrib = progress < 0.4 ? -25 : -20;
    recencyStatus = 'negative';
    recencyDetail = `${deal.daysInStage} days without movement — urgent attention needed`;
  } else if (deal.isStale) {
    recencyContrib = progress < 0.4 ? -15 : -10;
    recencyStatus = 'negative';
    recencyDetail = `${deal.daysInStage} days in stage — follow-up recommended`;
  } else if (deal.daysInStage <= 2) {
    recencyContrib = 5;
    recencyStatus = 'positive';
    recencyDetail = `Fresh activity (${deal.daysInStage}d) — good momentum`;
  } else {
    recencyContrib = 0;
    recencyStatus = 'neutral';
    recencyDetail = `${deal.daysInStage} days in stage — within normal range`;
  }

  // 3. Value weight
  let valueContrib = 0;
  let valueStatus: 'positive' | 'neutral' | 'negative' = 'neutral';
  let valueDetail: string;
  if (deal.value >= 50000) {
    valueContrib = 8;
    valueStatus = 'positive';
    valueDetail = `High-value deal ($${(deal.value / 1000).toFixed(0)}K) — premium attention`;
  } else if (deal.value >= 10000) {
    valueContrib = 5;
    valueStatus = 'positive';
    valueDetail = `Good value ($${(deal.value / 1000).toFixed(0)}K) — standard priority`;
  } else {
    valueDetail = `$${(deal.value / 1000).toFixed(1)}K — standard value range`;
  }

  // 4. Contact coverage
  let contactContrib: number;
  let contactStatus: 'positive' | 'neutral' | 'negative';
  let contactDetail: string;
  if (deal.contact_name || deal.contact_email) {
    contactContrib = 5;
    contactStatus = 'positive';
    contactDetail = `Champion identified: ${deal.contact_name || deal.contact_email}`;
  } else {
    contactContrib = -10;
    contactStatus = 'negative';
    contactDetail = 'No champion assigned — pipeline velocity drops ~40% without one';
  }

  // 5. Notes coverage
  let notesContrib: number;
  let notesStatus: 'positive' | 'neutral' | 'negative';
  let notesDetail: string;
  if (deal.notes && deal.notes.length > 10) {
    notesContrib = 3;
    notesStatus = 'positive';
    notesDetail = 'Deal notes present — context preserved for team';
  } else {
    notesContrib = 0;
    notesStatus = 'neutral';
    notesDetail = 'No notes — consider documenting key details';
  }

  return [
    { id: 'probability', label: 'Probability Alignment', icon: <TrendingUp className="w-4 h-4" />, contribution: probContrib, detail: probDetail, status: probStatus },
    { id: 'recency', label: 'Activity Recency', icon: <Clock className="w-4 h-4" />, contribution: recencyContrib, detail: recencyDetail, status: recencyStatus },
    { id: 'value', label: 'Deal Value', icon: <DollarSign className="w-4 h-4" />, contribution: valueContrib, detail: valueDetail, status: valueStatus },
    { id: 'contact', label: 'Contact Coverage', icon: <Users className="w-4 h-4" />, contribution: contactContrib, detail: contactDetail, status: contactStatus },
    { id: 'notes', label: 'Notes Coverage', icon: <FileText className="w-4 h-4" />, contribution: notesContrib, detail: notesDetail, status: notesStatus },
  ];
}

function getScoreColor(score: number): string {
  if (score >= 75) return '#22C55E';
  if (score >= 50) return '#EAB308';
  if (score >= 25) return '#F97316';
  return '#EF4444';
}

function getContribColor(status: 'positive' | 'neutral' | 'negative'): { text: string; bg: string } {
  if (status === 'positive') return { text: '#15803D', bg: '#F0FDF4' };
  if (status === 'negative') return { text: '#B91C1C', bg: '#FEF2F2' };
  return { text: '#6B7280', bg: '#F9FAFB' };
}

export function DealScoreCard({ deal, stages, open, onClose, onRescore }: DealScoreCardProps) {
  if (!deal || !open) return null;

  const score = deal.healthScore ?? 70;
  const factors = computeFactors(deal, stages);
  const totalContribution = factors.reduce((sum, f) => sum + f.contribution, 0);
  const agentSlug = deal.scoringAgent === 'Pipeline Analyst' ? 'pipeline-analyst'
    : deal.scoringAgent === 'Deal Strategist' ? 'deal-strategist'
    : undefined;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-[#E8E8E4] flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#00875A] mb-1" style={{ letterSpacing: '0.08em' }}>
                    Deal Health Score
                  </p>
                  <h2 className="text-base font-semibold text-[#1A1A1A] leading-tight">
                    {deal.title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-[#F5F5F0] rounded transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-[#6B6B63]" />
                </button>
              </div>

              {/* Score Summary */}
              <div className="px-5 py-4 bg-[#FAFAF8] border-b border-[#E8E8E4]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-3xl font-mono font-bold"
                      style={{ color: getScoreColor(score) }}
                    >
                      {score}
                    </span>
                    <span className="text-sm text-[#9CA39B]">/ 100</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {agentSlug && <AgentBadge slug={agentSlug} />}
                    <span
                      className="text-xs font-medium px-2 py-1 rounded"
                      style={{
                        backgroundColor: score >= 70 ? '#F0FDF4' : score >= 45 ? '#FEF9E7' : '#FEF2F2',
                        color: score >= 70 ? '#15803D' : score >= 45 ? '#A16207' : '#B91C1C',
                      }}
                    >
                      {deal.healthLabel || (score >= 70 ? 'Healthy' : score >= 45 ? 'At Risk' : 'Critical')}
                    </span>
                  </div>
                </div>
                {/* Score bar */}
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${getScoreColor(score)}20` }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: getScoreColor(score) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(score, 3)}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-xs text-[#6B6B63] mt-2">
                  Base 70 {totalContribution >= 0 ? '+' : ''}{totalContribution} from 5 factors
                </p>
              </div>

              {/* Factor Breakdown */}
              <div className="px-5 py-3 space-y-0 max-h-[320px] overflow-y-auto">
                {factors.map((factor, idx) => {
                  const colors = getContribColor(factor.status);
                  return (
                    <motion.div
                      key={factor.id}
                      className="py-3 border-b border-[#F3F4F6] last:border-b-0"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span style={{ color: colors.text }}>{factor.icon}</span>
                          <span className="text-sm font-medium text-[#1A1A1A]">{factor.label}</span>
                        </div>
                        <span
                          className="text-xs font-mono font-semibold px-2 py-0.5 rounded"
                          style={{ backgroundColor: colors.bg, color: colors.text }}
                        >
                          {factor.contribution > 0 ? '+' : ''}{factor.contribution}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] leading-relaxed pl-6">
                        {factor.detail}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Insight + Actions */}
              <div className="px-5 py-4 border-t border-[#E8E8E4] bg-[#FAFAF8]">
                {deal.healthInsight && (
                  <p className="text-xs text-[#374151] leading-relaxed mb-3 italic">
                    "{deal.healthInsight}"
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#9CA39B]">
                    Scored by {deal.scoringAgent || 'Pipeline Analyst'}
                  </span>
                  {onRescore && (
                    <button
                      onClick={() => { onRescore(); onClose(); }}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-[#1A1A1A] text-white rounded hover:bg-[#333] transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Re-score
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
