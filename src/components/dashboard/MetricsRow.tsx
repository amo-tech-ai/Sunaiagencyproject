// C84-METRICS — 4 stat cards row: Readiness, Systems, Phase, Investment
// Mobile-first: 2×2 grid. sm: 2×2 with more padding. lg: 4 columns.
// Uses dl/dt/dd for accessibility, staggered fade-in animation.

import { motion } from 'motion/react';
import { Activity, Layers, GitBranch, DollarSign } from 'lucide-react';

interface MetricsRowProps {
  readinessScore: number;
  systemsCount: number;
  currentPhase: number;
  totalPhases: number;
  totalInvestment: string;
}

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color?: string;
  index: number;
}

function MetricCard({ label, value, subtitle, icon, color = '#1A1A1A', index }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: index * 0.05 }}
      className="bg-white rounded border border-[#E8E8E4] p-3 sm:p-4"
    >
      <dl>
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
          <div className="text-[#6B6B63]">{icon}</div>
          <dt className="text-[10px] sm:text-xs text-[#6B6B63] uppercase tracking-wider">{label}</dt>
        </div>
        <dd className="font-mono text-xl sm:text-2xl font-semibold" style={{ color }}>
          {value}
        </dd>
        {subtitle && (
          <dd className="text-[10px] sm:text-xs text-[#9CA39B] mt-0.5">{subtitle}</dd>
        )}
      </dl>
    </motion.div>
  );
}

export default function MetricsRow({
  readinessScore, systemsCount, currentPhase, totalPhases, totalInvestment,
}: MetricsRowProps) {
  const scoreColor = readinessScore >= 70 ? '#00875A' : readinessScore >= 40 ? '#D97706' : '#DC2626';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
      <MetricCard
        label="Readiness"
        value={`${readinessScore}`}
        subtitle="out of 100"
        icon={<Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        color={scoreColor}
        index={0}
      />
      <MetricCard
        label="AI Systems"
        value={`${systemsCount}`}
        subtitle="selected"
        icon={<Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        index={1}
      />
      <MetricCard
        label="Phase"
        value={`${currentPhase}/${totalPhases}`}
        subtitle="in progress"
        icon={<GitBranch className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        index={2}
      />
      <MetricCard
        label="Investment"
        value={totalInvestment || '—'}
        subtitle="estimated total"
        icon={<DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        index={3}
      />
    </div>
  );
}
