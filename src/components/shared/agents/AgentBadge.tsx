// Compact agent attribution badge — emoji + name in a pill
// Used on insight cards, deal cards, recommendations

import { ALL_CATALOG_AGENTS, DIVISION_COLORS, type Division } from '../../wizard/data/agentCatalog';

interface AgentBadgeProps {
  slug: string;
  className?: string;
}

export function AgentBadge({ slug, className = '' }: AgentBadgeProps) {
  const agent = ALL_CATALOG_AGENTS.find(a => a.slug === slug);
  if (!agent) return null;

  const divisionColor = DIVISION_COLORS[agent.division as Division] || '#64748B';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{
        backgroundColor: `${divisionColor}10`,
        color: divisionColor,
        border: `1px solid ${divisionColor}25`,
      }}
    >
      <span role="img" aria-hidden="true">{agent.emoji}</span>
      {agent.name}
    </span>
  );
}