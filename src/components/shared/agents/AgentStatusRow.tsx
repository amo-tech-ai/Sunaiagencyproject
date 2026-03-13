// Agent status row — compact row for dashboard Agent Team widget
// Shows agent name, status dot, last output preview, and last run time

import { AgentAvatar } from './AgentAvatar';

interface AgentStatusRowProps {
  slug: string;
  name: string;
  emoji: string;
  status: 'online' | 'idle' | 'running' | 'error';
  lastOutput?: string;
  lastRunAt?: string;
  className?: string;
}

const STATUS_DOT = {
  online: { color: '#22C55E', label: 'Online' },
  idle: { color: '#9CA3AF', label: 'Idle' },
  running: { color: '#3B82F6', label: 'Running' },
  error: { color: '#EF4444', label: 'Error' },
};

export function AgentStatusRow({ slug, name, emoji, status, lastOutput, lastRunAt, className = '' }: AgentStatusRowProps) {
  const dot = STATUS_DOT[status];

  return (
    <div className={`flex items-center gap-3 py-2.5 border-b border-[#F3F4F6] last:border-0 ${className}`}>
      <AgentAvatar slug={slug} emoji={emoji} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#111827]">{name}</span>
          <span className="flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${status === 'running' ? 'animate-pulse' : ''}`}
              style={{ backgroundColor: dot.color }}
            />
            <span className="text-[10px] text-[#9CA3AF]">{dot.label}</span>
          </span>
        </div>
        {lastOutput && (
          <p className="text-xs text-[#6B7280] truncate mt-0.5">{lastOutput}</p>
        )}
      </div>
      {lastRunAt && (
        <span className="text-[10px] text-[#9CA3AF] shrink-0">{lastRunAt}</span>
      )}
    </div>
  );
}
