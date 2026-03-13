// C-AGENT-TEAM-WIDGET — Dashboard "Your AI Team" widget (v2)
// Now uses shared AgentAvatar + AgentStatusRow components
// Calls POST /agents/match for AI-powered matching with local fallback
// BCG design: flat white card, Georgia headings, green accent, staggered animations

import { motion } from 'motion/react';
import { Link } from 'react-router';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Users, ArrowRight, Loader2, Zap } from 'lucide-react';
import { agentCatalogApi } from '../../lib/supabase';
import { AgentAvatar } from '../shared/agents/AgentAvatar';
import type { AssignedAgent } from '../wizard/data/agentData';

interface AgentTeamWidgetProps {
  agents: AssignedAgent[];
  industry?: string;
  goals?: string[];
  companySize?: string;
  systemIds?: string[];
}

/** Simulated live statuses — in production, these come from agent run logs */
const SIMULATED_STATUSES: Record<string, { status: 'online' | 'idle' | 'running'; task: string; lastOutput: string; lastRunAt: string }> = {
  'rapid-prototyper':   { status: 'running', task: 'Building prototype',    lastOutput: 'Bot spec v2',          lastRunAt: '2m ago' },
  'support-responder':  { status: 'online',  task: 'Mapping FAQ flows',     lastOutput: 'FAQ draft',             lastRunAt: '15m ago' },
  'finance-tracker':    { status: 'idle',    task: 'Baseline report',       lastOutput: 'Cost model',            lastRunAt: '1h ago' },
  'project-shepherd':   { status: 'online',  task: 'Sprint planning',       lastOutput: 'Sprint 1 plan',         lastRunAt: '5m ago' },
  'reality-checker':    { status: 'online',  task: 'Reviewing specs',       lastOutput: 'Validation report',     lastRunAt: '20m ago' },
  'growth-hacker':      { status: 'running', task: 'Funnel analysis',       lastOutput: 'Conversion audit',      lastRunAt: '3m ago' },
  'pipeline-analyst':   { status: 'online',  task: 'Lead scoring',          lastOutput: 'Score model v1',        lastRunAt: '10m ago' },
  'content-creator':    { status: 'idle',    task: 'Content calendar',      lastOutput: 'Month 1 plan',          lastRunAt: '2h ago' },
  'analytics-reporter': { status: 'idle',    task: 'Dashboard setup',       lastOutput: 'KPI framework',         lastRunAt: '4h ago' },
  'brand-guardian':     { status: 'online',  task: 'Brand audit',           lastOutput: 'Style guide review',    lastRunAt: '30m ago' },
  'seo-specialist':     { status: 'running', task: 'Keyword research',      lastOutput: 'Keyword gap report',    lastRunAt: '1m ago' },
  'software-architect': { status: 'online',  task: 'Architecture plan',     lastOutput: 'Integration map',       lastRunAt: '8m ago' },
  'outbound-strategist':{ status: 'idle',    task: 'Outreach design',       lastOutput: 'Sequence draft',        lastRunAt: '3h ago' },
  'deal-strategist':    { status: 'online',  task: 'Pipeline review',       lastOutput: 'Deal analysis',         lastRunAt: '12m ago' },
  'discovery-coach':    { status: 'idle',    task: 'Analysis complete',     lastOutput: 'Discovery report',      lastRunAt: '1d ago' },
  'proposal-strategist':{ status: 'idle',    task: 'Proposal drafted',      lastOutput: 'Strategy brief',        lastRunAt: '6h ago' },
  'frontend-developer': { status: 'online',  task: 'UI components',         lastOutput: 'Dashboard polish',      lastRunAt: '7m ago' },
  'backend-architect':  { status: 'online',  task: 'API design',            lastOutput: 'Endpoint spec',         lastRunAt: '18m ago' },
  'ai-engineer':        { status: 'running', task: 'Prompt optimization',   lastOutput: 'Prompt v3 deployed',    lastRunAt: '4m ago' },
  'devops-automator':   { status: 'online',  task: 'Pipeline setup',        lastOutput: 'CI/CD configured',      lastRunAt: '25m ago' },
};

function getAgentStatus(slug: string) {
  return SIMULATED_STATUSES[slug] || { status: 'idle' as const, task: 'Standby', lastOutput: 'Awaiting assignment', lastRunAt: '—' };
}

/** Emoji lookup for wizard agents that don't have emoji */
const EMOJI_MAP: Record<string, string> = {
  'rapid-prototyper': '🚀', 'support-responder': '🎧', 'finance-tracker': '💰',
  'project-shepherd': '📋', 'reality-checker': '🛡️', 'growth-hacker': '📈',
  'pipeline-analyst': '📊', 'content-creator': '✍️', 'analytics-reporter': '📊',
  'brand-guardian': '🎨', 'seo-specialist': '🔍', 'software-architect': '🏗️',
  'outbound-strategist': '🎯', 'deal-strategist': '⚡', 'discovery-coach': '🧭',
  'proposal-strategist': '💡', 'frontend-developer': '🖥️', 'backend-architect': '🗄️',
  'ai-engineer': '🤖', 'devops-automator': '⚙️',
};

interface AIMatchedAgent {
  slug: string;
  name: string;
  emoji: string;
  division: string;
  role: string;
  fitScore: number;
  reason: string;
  firstTask: string;
}

export default function AgentTeamWidget({ agents, industry, goals, companySize, systemIds }: AgentTeamWidgetProps) {
  const [aiTeam, setAiTeam] = useState<AIMatchedAgent[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const fetchedRef = useRef(false);

  // Call POST /agents/match for AI-powered matching
  useEffect(() => {
    if (fetchedRef.current || !industry) return;
    fetchedRef.current = true;

    async function fetchAiTeam() {
      setAiLoading(true);
      try {
        const { data, error } = await agentCatalogApi.match({
          industry: industry || '',
          goals: goals || [],
          companySize: companySize || '',
          systemIds: systemIds || [],
        });
        if (!error && data?.matches) {
          setAiTeam(data.matches);
        }
      } catch (e) {
        console.warn('[AgentTeamWidget] AI match failed, using local:', e);
      } finally {
        setAiLoading(false);
      }
    }
    fetchAiTeam();
  }, [industry, goals, companySize, systemIds]);

  // Display team: AI-matched first, then local fallback
  const displayAgents = useMemo(() => {
    if (aiTeam.length > 0) {
      return aiTeam.map(a => ({
        slug: a.slug,
        name: a.name,
        emoji: a.emoji || EMOJI_MAP[a.slug] || '🤖',
        division: a.division,
        role: a.role,
        firstTask: a.firstTask,
        fitScore: a.fitScore,
      }));
    }
    return agents.map(a => ({
      slug: a.id,
      name: a.name,
      emoji: EMOJI_MAP[a.id] || '🤖',
      division: a.division,
      role: a.role,
      firstTask: a.task,
      fitScore: undefined as number | undefined,
    }));
  }, [aiTeam, agents]);

  if (displayAgents.length === 0 && !aiLoading) return null;

  const runningCount = displayAgents.filter(a => getAgentStatus(a.slug).status === 'running').length;
  const onlineCount = displayAgents.filter(a => getAgentStatus(a.slug).status !== 'idle').length;

  return (
    <div className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#00875A]" />
          <h3 className="text-sm sm:text-base" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            Your AI Team
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {runningCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
              <Zap className="w-2.5 h-2.5" />
              {runningCount} running
            </span>
          )}
          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#E6F4ED', color: '#00875A', borderRadius: '2px' }}>
            {onlineCount}/{displayAgents.length} active
          </span>
        </div>
      </div>

      {/* Loading */}
      {aiLoading && (
        <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded" style={{ backgroundColor: '#FAFAF8', border: '1px solid #E8E8E4' }}>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00875A]" />
          <span className="text-xs text-[#6B6B63]">Matching agents…</span>
        </div>
      )}

      {/* Agent list */}
      <div className="space-y-1 flex-1 overflow-y-auto max-h-[360px]">
        {displayAgents.map((agent, idx) => {
          const { status, task, lastOutput, lastRunAt } = getAgentStatus(agent.slug);
          const statusDot = status === 'running' ? '#3B82F6' : status === 'online' ? '#22C55E' : '#9CA3AF';

          return (
            <motion.div
              key={agent.slug}
              className="flex items-center gap-3 py-2.5 border-b border-[#F5F5F0] last:border-0 group hover:bg-[#FAFAF8] rounded px-2 -mx-2 transition-colors"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
            >
              {/* Avatar */}
              <AgentAvatar slug={agent.slug} emoji={agent.emoji} size="sm" />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-[#1A1A1A] leading-tight truncate">
                    {agent.name}
                  </p>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status === 'running' ? 'animate-pulse' : ''}`} style={{ backgroundColor: statusDot }} />
                </div>
                <p className="text-[11px] text-[#6B6B63] mt-0.5 truncate">
                  {task}
                </p>
              </div>

              {/* Right side: fit score or last run */}
              <div className="flex flex-col items-end shrink-0">
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
                <span className="text-[10px] text-[#9CA3AF] mt-0.5">{lastRunAt}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer link */}
      <div className="mt-4 pt-3 border-t border-[#F0F0EC]">
        <Link
          to="/app/agents/catalog"
          className="inline-flex items-center gap-1.5 text-sm text-[#00875A] hover:underline transition-colors min-h-[44px] sm:min-h-0"
        >
          View agent catalog
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}