// C101-INSIGHTS-SUMMARY-HEADER — Top summary card for AI Insights page
// Shows overall score ring, AI greeting, key stats, and re-run button.
// Mobile-first: stacked on xs, side-by-side on sm+, 44px touch targets.
// BCG design: Georgia headings, green accent, flat white card.

import { Lightbulb, RefreshCw, Brain, BarChart3, Layers } from 'lucide-react';
import { motion } from 'motion/react';

interface InsightsSummaryHeaderProps {
  overall: number;
  dimensionCount: number;
  insightCount: number;
  systemsCount: number;
  aiGreeting?: string;
  aiSummary?: string;
  onRerun: () => void;
  loading: boolean;
}

function ScoreRing({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#00875A' : score >= 40 ? '#D97706' : '#DC2626';

  return (
    <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0" role="img" aria-label={`Readiness score: ${score} out of 100`}>
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#E8E8E4" strokeWidth="6" />
        <motion.circle
          cx="50" cy="50" r={radius}
          fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl sm:text-3xl font-semibold font-mono" style={{ color }}>{score}</span>
        <span className="text-[10px] text-[#9CA39B] mt-0.5">Readiness</span>
      </div>
    </div>
  );
}

export default function InsightsSummaryHeader({
  overall, dimensionCount, insightCount, systemsCount,
  aiGreeting, aiSummary, onRerun, loading,
}: InsightsSummaryHeaderProps) {
  return (
    <div className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Score ring */}
        <div className="flex justify-center sm:justify-start">
          <ScoreRing score={overall} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* AI greeting */}
          <div className="mb-3">
            {aiGreeting ? (
              <h2 className="font-[Georgia,serif] text-base sm:text-lg font-semibold text-[#1A1A1A] mb-1">
                {aiGreeting}
              </h2>
            ) : (
              <h2 className="font-[Georgia,serif] text-base sm:text-lg font-semibold text-[#1A1A1A] mb-1">
                AI Readiness Assessment
              </h2>
            )}
            {aiSummary ? (
              <p className="text-sm text-[#6B6B63] leading-relaxed line-clamp-3">{aiSummary}</p>
            ) : (
              <p className="text-sm text-[#6B6B63]">
                Review your AI readiness dimensions, recommendations, and track progress over time.
              </p>
            )}
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3 sm:gap-5 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-[#6B6B63]">
              <BarChart3 className="w-3.5 h-3.5 text-[#9CA39B]" />
              <span className="font-mono font-medium text-[#1A1A1A]">{dimensionCount}</span>
              <span>dimensions</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#6B6B63]">
              <Lightbulb className="w-3.5 h-3.5 text-[#9CA39B]" />
              <span className="font-mono font-medium text-[#1A1A1A]">{insightCount}</span>
              <span>insights</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#6B6B63]">
              <Layers className="w-3.5 h-3.5 text-[#9CA39B]" />
              <span className="font-mono font-medium text-[#1A1A1A]">{systemsCount}</span>
              <span>systems</span>
            </div>
          </div>

          {/* Re-run button */}
          <button
            onClick={onRerun}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-[#F5F5F0] text-sm rounded hover:bg-[#333] transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Generating...' : 'Generate New Insights'}
            <Brain className="w-3.5 h-3.5 text-[#00875A]" />
          </button>
        </div>
      </div>
    </div>
  );
}
