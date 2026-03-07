// C98-READINESS-BREAKDOWN — Dimension score bars + strengths/gaps lists
// Mobile-first: stacked layout, 44px touch targets, responsive padding.
// BCG design: progress bars with #00875A/#D97706/#DC2626 color coding.

import type { ReadinessData } from '../../../lib/hooks/useDashboardData';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface ReadinessBreakdownProps {
  readiness: ReadinessData;
}

function DimensionBar({ name, score, index }: { name: string; score: number; index: number }) {
  const color = score >= 70 ? '#00875A' : score >= 40 ? '#D97706' : '#DC2626';
  const bg = score >= 70 ? 'bg-[#E6F4ED]' : score >= 40 ? 'bg-[#FEF3CD]' : 'bg-[#FEF2F2]';

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#1A1A1A]">{name}</span>
        <span className="text-sm font-mono font-medium" style={{ color }}>{score}</span>
      </div>
      <div className={`h-2 rounded-full ${bg} overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(score, 100)}%` }}
          transition={{ duration: 0.6, delay: 0.2 + index * 0.08 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${name}: ${score} out of 100`}
        />
      </div>
    </motion.div>
  );
}

export default function ReadinessBreakdown({ readiness }: ReadinessBreakdownProps) {
  return (
    <div className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-6">
      <h3 className="font-[Georgia,serif] text-sm sm:text-base font-semibold text-[#1A1A1A] mb-4">
        Dimension Scores
      </h3>

      {/* Dimension bars */}
      {readiness.dimensions.length > 0 ? (
        <div className="space-y-4 mb-6">
          {readiness.dimensions.map((d, i) => (
            <DimensionBar key={d.name} name={d.name} score={d.score} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#6B6B63] mb-6">No dimension data available.</p>
      )}

      {/* Strengths */}
      {readiness.strengths.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-[#6B6B63] uppercase tracking-wider mb-2">
            Strengths
          </h4>
          <ul className="space-y-1.5">
            {readiness.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1A1A1A]">
                <CheckCircle className="w-4 h-4 text-[#00875A] shrink-0 mt-0.5" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gaps */}
      {readiness.gaps.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-[#6B6B63] uppercase tracking-wider mb-2">
            Gaps to Address
          </h4>
          <ul className="space-y-1.5">
            {readiness.gaps.map((g, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1A1A1A]">
                <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
