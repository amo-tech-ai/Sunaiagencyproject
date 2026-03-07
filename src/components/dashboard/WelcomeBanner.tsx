// C83-WELCOME — Welcome banner with org name + readiness score ring
// Mobile-first: stacked layout → horizontal on sm+. Score ring always labeled. ARIA accessible.

import type { DashboardOrg, ReadinessData } from '../../lib/hooks/useDashboardData';
import { motion } from 'motion/react';

interface WelcomeBannerProps {
  org: DashboardOrg;
  readiness: ReadinessData;
}

function ScoreRing({ score }: { score: number }) {
  const size = 72;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 70 ? '#00875A' : score >= 40 ? '#D97706' : '#DC2626';
  const label = score >= 70 ? 'Strong' : score >= 40 ? 'Moderate' : 'Needs Work';

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`AI Readiness Score: ${score} out of 100 — ${label}`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#E8E8E4" strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-semibold text-[#1A1A1A] font-mono">{score}</span>
      </div>
    </div>
  );
}

export default function WelcomeBanner({ org, readiness }: WelcomeBannerProps) {
  return (
    <div className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-5 md:p-6">
      {/* Mobile: stacked with score at top-right. sm+: horizontal flex */}
      <div className="flex items-start gap-4 sm:items-center">
        <div className="flex-1 min-w-0">
          <h2 className="font-[Georgia,serif] text-lg sm:text-xl font-semibold text-[#1A1A1A] truncate">
            {org.name}
          </h2>
          <p className="text-sm text-[#6B6B63] mt-0.5">
            {org.industry}{org.size !== 'Unknown' ? ` · ${org.size}` : ''}
          </p>
          {org.description && (
            <p className="text-xs text-[#9CA39B] mt-1.5 line-clamp-2 sm:line-clamp-1">{org.description}</p>
          )}
        </div>

        {/* Score ring + label */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <ScoreRing score={readiness.overall} />
          <p className="text-[10px] text-[#9CA39B] uppercase tracking-wider leading-none">
            Readiness
          </p>
        </div>
      </div>
    </div>
  );
}
