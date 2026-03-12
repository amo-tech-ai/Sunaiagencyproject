// C-AGENT-TEAM-WIDGET — Dashboard "Your AI Team" widget
// Shows matched agents with status and last output
// BCG design: flat white card, Georgia headings, green accent, staggered animations
// Mobile-first: full-width stacked cards on mobile, compact on desktop

import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Users, ArrowRight } from 'lucide-react';
import type { AssignedAgent } from '../wizard/data/agentData';

interface AgentTeamWidgetProps {
  agents: AssignedAgent[];
}

/** Simulated agent statuses — in production, these come from the backend */
const SIMULATED_STATUSES: Record<string, { status: string; lastOutput: string }> = {
  'rapid-prototyper':  { status: 'Building prototype', lastOutput: 'Bot spec v2' },
  'support-responder': { status: 'Mapping FAQ flows',  lastOutput: 'FAQ draft' },
  'finance-tracker':   { status: 'Baseline report',    lastOutput: 'Cost model' },
  'project-shepherd':  { status: 'Sprint planning',    lastOutput: 'Sprint 1 plan' },
  'reality-checker':   { status: 'Reviewing specs',    lastOutput: 'Validation report' },
  'growth-hacker':     { status: 'Funnel analysis',    lastOutput: 'Conversion audit' },
  'pipeline-analyst':  { status: 'Lead scoring',       lastOutput: 'Score model v1' },
  'content-creator':   { status: 'Content calendar',   lastOutput: 'Month 1 plan' },
  'analytics-reporter':{ status: 'Dashboard setup',    lastOutput: 'KPI framework' },
  'brand-guardian':    { status: 'Brand audit',         lastOutput: 'Style guide review' },
  'seo-specialist':    { status: 'Keyword research',   lastOutput: 'Keyword gap report' },
  'software-architect':{ status: 'Architecture plan',  lastOutput: 'Integration map' },
  'outbound-strategist':{ status: 'Outreach design',   lastOutput: 'Sequence draft' },
  'deal-strategist':   { status: 'Pipeline review',    lastOutput: 'Deal analysis' },
  'discovery-coach':   { status: 'Analysis complete',  lastOutput: 'Discovery report' },
  'proposal-strategist':{ status: 'Proposal drafted',  lastOutput: 'Strategy brief' },
};

function getAgentStatus(agentId: string) {
  return SIMULATED_STATUSES[agentId] || { status: 'Active', lastOutput: 'Processing...' };
}

export default function AgentTeamWidget({ agents }: AgentTeamWidgetProps) {
  if (agents.length === 0) return null;

  return (
    <div className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#00875A]" />
          <h3
            className="text-sm sm:text-base"
            style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}
          >
            Your AI Team
          </h3>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded"
          style={{ backgroundColor: '#E6F4ED', color: '#00875A', borderRadius: '2px' }}
        >
          {agents.length} active
        </span>
      </div>

      {/* Agent list */}
      <div className="space-y-3">
        {agents.map((agent, idx) => {
          const AgentIcon = agent.icon;
          const { status, lastOutput } = getAgentStatus(agent.id);

          return (
            <motion.div
              key={agent.id}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
            >
              {/* Agent icon */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: agent.color + '18' }}
              >
                <AgentIcon className="w-4 h-4" style={{ color: agent.color }} />
              </div>

              {/* Agent info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1A1A1A] leading-tight">
                  {agent.name}
                </p>
                <p className="text-xs text-[#6B6B63] mt-0.5">
                  Status: {status}
                </p>
                <p className="text-xs text-[#9CA39B] mt-0.5 truncate">
                  Last output: {lastOutput}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer link */}
      <div className="mt-4 pt-3 border-t border-[#F0F0EC]">
        <Link
          to="/app/agents"
          className="inline-flex items-center gap-1.5 text-sm text-[#00875A] hover:underline transition-colors min-h-[44px] sm:min-h-0"
        >
          View full team
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
