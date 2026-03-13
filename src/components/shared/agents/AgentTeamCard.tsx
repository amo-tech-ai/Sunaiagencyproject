// Agent team card — shows assigned agent with role, first task, and status
// Used in wizard Steps 4-5 and dashboard Agent Team widget

import { motion } from 'motion/react';
import { AgentAvatar } from './AgentAvatar';

export interface AgentTeamCardAgent {
  slug: string;
  name: string;
  emoji: string;
  division: string;
  role: string;
  firstTask: string;
  fitScore?: number;
  reason?: string;
}

interface AgentTeamCardProps {
  agent: AgentTeamCardAgent;
  status?: 'active' | 'idle' | 'running' | 'completed';
  delay?: number;
  compact?: boolean;
  className?: string;
}

const STATUS_CONFIG = {
  active: { label: 'Active', color: '#00875A', bg: '#E6F4ED', dot: true },
  idle: { label: 'Standby', color: '#9CA39B', bg: '#F5F5F0', dot: false },
  running: { label: 'Running…', color: '#2563EB', bg: '#EFF6FF', dot: true },
  completed: { label: 'Done', color: '#00875A', bg: '#E6F4ED', dot: false },
};

export function AgentTeamCard({
  agent,
  status = 'active',
  delay = 0,
  compact = false,
  className = '',
}: AgentTeamCardProps) {
  const sc = STATUS_CONFIG[status];

  return (
    <motion.div
      className={`border rounded-lg bg-white transition-all hover:shadow-sm ${className}`}
      style={{ borderColor: '#E5E7EB' }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25 }}
    >
      <div className={compact ? 'px-3 py-2.5' : 'px-4 py-3.5'}>
        <div className="flex items-start gap-3">
          <AgentAvatar slug={agent.slug} emoji={agent.emoji} size={compact ? 'sm' : 'md'} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className={`font-medium text-[#111827] ${compact ? 'text-xs' : 'text-sm'}`}>
                {agent.name}
              </h4>
              {agent.fitScore !== undefined && agent.fitScore > 0 && (
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: agent.fitScore >= 80 ? '#E6F4ED' : agent.fitScore >= 50 ? '#FEF9E7' : '#F5F5F0',
                    color: agent.fitScore >= 80 ? '#00875A' : agent.fitScore >= 50 ? '#D97706' : '#6B6B63',
                  }}
                >
                  {agent.fitScore}%
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#6B7280] mt-0.5">
              {agent.division} · {agent.role}
            </p>
            {!compact && (
              <p className="text-xs text-[#374151] mt-1.5 leading-relaxed">
                <span className="text-[#9CA3AF]">First task:</span>{' '}
                {agent.firstTask}
              </p>
            )}
            {agent.reason && !compact && (
              <p className="text-[10px] text-[#9CA3AF] mt-1 italic">
                {agent.reason}
              </p>
            )}
          </div>
          <span
            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full shrink-0"
            style={{ backgroundColor: sc.bg, color: sc.color }}
          >
            {sc.dot && (
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: sc.color }} />
            )}
            {sc.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
