// Reusable agent avatar — emoji in a colored circle
// Used across wizard, dashboard, catalog, and CRM

import { CATALOG_AGENTS, DIVISION_COLORS, type Division } from '../../wizard/data/agentCatalog';

interface AgentAvatarProps {
  slug: string;
  size?: 'sm' | 'md' | 'lg';
  emoji?: string;
  color?: string;
  className?: string;
}

const SIZE_MAP = {
  sm: { box: 'w-7 h-7', text: 'text-sm' },
  md: { box: 'w-9 h-9', text: 'text-lg' },
  lg: { box: 'w-12 h-12', text: 'text-2xl' },
};

export function AgentAvatar({ slug, size = 'md', emoji, color, className = '' }: AgentAvatarProps) {
  const agent = CATALOG_AGENTS.find(a => a.slug === slug);
  const displayEmoji = emoji || agent?.emoji || '🤖';
  const divisionColor = color || agent?.color || DIVISION_COLORS[agent?.division as Division] || '#64748B';
  const s = SIZE_MAP[size];

  return (
    <div
      className={`${s.box} rounded-full flex items-center justify-center shrink-0 ${className}`}
      style={{ backgroundColor: `${divisionColor}15`, border: `1.5px solid ${divisionColor}30` }}
      title={agent?.name || slug}
    >
      <span className={s.text} role="img" aria-label={agent?.name || slug}>
        {displayEmoji}
      </span>
    </div>
  );
}
