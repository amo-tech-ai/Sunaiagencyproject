// Agent team grid — renders a list of AgentTeamCards with loading/error states
// Extracted from StepExecutiveSummary + StepLaunchProject to avoid duplication

import { AgentTeamCard, type AgentTeamCardAgent } from './AgentTeamCard';
import { Loader2, AlertCircle } from 'lucide-react';

interface AgentTeamGridProps {
  agents: AgentTeamCardAgent[];
  loading?: boolean;
  error?: string | null;
  status?: 'active' | 'standby' | 'working';
  animationDelay?: number;
}

export function AgentTeamGrid({
  agents,
  loading = false,
  error = null,
  status = 'active',
  animationDelay = 0,
}: AgentTeamGridProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 border rounded" style={{ borderColor: '#E8E8E4', borderRadius: '4px', backgroundColor: '#FAFAF8' }}>
        <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#00875A' }} />
        <span className="text-xs" style={{ color: '#6B6B63' }}>Matching AI agents to your project…</span>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded text-xs" style={{ backgroundColor: '#FEF9E7', color: '#D97706' }}>
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          Using local matching — AI matching unavailable
        </div>
      )}
      <div className="space-y-2.5">
        {agents.map((agent, idx) => (
          <AgentTeamCard
            key={agent.slug}
            agent={agent}
            status={status}
            delay={animationDelay + idx * 0.06}
          />
        ))}
      </div>
    </>
  );
}
