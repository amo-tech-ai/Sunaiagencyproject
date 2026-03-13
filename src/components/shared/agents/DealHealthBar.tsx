// Deal health bar — horizontal score bar for CRM pipeline deal cards
// Shows 0-100 score with color coding and risk label, with agent attribution

import { AgentBadge } from './AgentBadge';

interface DealHealthBarProps {
  score: number;       // 0-100
  riskLabel?: string;  // e.g. "Low Risk", "At Risk", "Stale"
  agentSlug?: string;  // Which agent calculated this score
  className?: string;
}

function getScoreColor(score: number): { bar: string; text: string; bg: string } {
  if (score >= 75) return { bar: '#22C55E', text: '#15803D', bg: '#F0FDF4' };
  if (score >= 50) return { bar: '#EAB308', text: '#A16207', bg: '#FEFCE8' };
  if (score >= 25) return { bar: '#F97316', text: '#C2410C', bg: '#FFF7ED' };
  return { bar: '#EF4444', text: '#B91C1C', bg: '#FEF2F2' };
}

export function DealHealthBar({ score, riskLabel, agentSlug, className = '' }: DealHealthBarProps) {
  const colors = getScoreColor(score);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Score bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${colors.bar}20` }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(score, 3)}%`, backgroundColor: colors.bar }}
          />
        </div>
        <span className="text-xs font-mono font-semibold shrink-0" style={{ color: colors.text }}>
          {score}
        </span>
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between">
        {riskLabel && (
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {riskLabel}
          </span>
        )}
        {agentSlug && <AgentBadge slug={agentSlug} />}
      </div>
    </div>
  );
}
