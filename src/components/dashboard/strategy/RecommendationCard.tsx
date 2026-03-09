// C14-REC — Strategy Recommendation card with governed approve/reject
// Leaf component used by IntelligencePanel
// BCG design system: warm off-white, charcoal text, green accents

import { motion } from 'motion/react';
import { Bot, ThumbsUp, ThumbsDown, CheckCircle2, XCircle } from 'lucide-react';
import type { StrategyRecommendation } from '../../../lib/types/strategy';

interface RecommendationCardProps {
  rec: StrategyRecommendation;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function RecommendationCard({ rec, onApprove, onReject }: RecommendationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-[#D4CFC8] rounded-lg p-3"
    >
      <div className="flex items-start gap-2">
        <Bot className="w-4 h-4 text-[#00875A] mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-[#1A1A1A]">{rec.title}</div>
          <p className="text-[11px] text-gray-600 mt-1 leading-relaxed line-clamp-2">{rec.rationale}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
              {rec.recommendation_type.replace('_', ' ')}
            </span>
            <span className="text-[10px] text-gray-400">by {rec.agent_name}</span>
          </div>
        </div>
      </div>

      {rec.approval_status === 'pending' && (
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
          <button
            onClick={() => onApprove(rec.id)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-[#00875A] text-white rounded hover:bg-[#006644] transition-colors"
          >
            <ThumbsUp className="w-3 h-3" /> Approve
          </button>
          <button
            onClick={() => onReject(rec.id)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
          >
            <ThumbsDown className="w-3 h-3" /> Reject
          </button>
        </div>
      )}

      {rec.approval_status !== 'pending' && (
        <div className={`flex items-center gap-1 mt-2 text-[10px] ${
          rec.approval_status === 'approved' ? 'text-green-600' : 'text-red-500'
        }`}>
          {rec.approval_status === 'approved'
            ? <CheckCircle2 className="w-3 h-3" />
            : <XCircle className="w-3 h-3" />
          }
          {rec.approval_status}
        </div>
      )}
    </motion.div>
  );
}
