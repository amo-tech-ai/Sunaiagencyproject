// C-AG01 — Agents Hero
// BCG design system dark variant: charcoal bg, white text, Georgia serif, green accents, 4px radius

import { ArrowRight } from 'lucide-react';

interface AgentsHeroProps {
  onExploreClick?: () => void;
  onLearnMoreClick?: () => void;
}

export default function AgentsHero({ onExploreClick, onLearnMoreClick }: AgentsHeroProps) {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Content */}
      <div className="relative max-w-[1120px] mx-auto px-6 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="text-4xl md:text-5xl tracking-tight mb-7 leading-tight text-white"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            AI Agents That Run Your Business — Together
          </h1>

          <p className="text-lg md:text-xl text-neutral-300 mb-6 leading-relaxed max-w-2xl mx-auto">
            Not isolated bots. A coordinated system with planning, intelligence, and control.
          </p>

          <blockquote className="text-base italic mb-10 max-w-2xl mx-auto border-l-2 pl-6 py-2" style={{ color: 'rgba(245,245,240,0.5)', borderColor: '#00875A' }}>
            Every action follows a plan. Every decision is scored. Every execution is gated.
          </blockquote>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="px-8 py-4 text-sm transition-colors min-w-[240px] flex items-center justify-center gap-2"
              style={{ backgroundColor: '#00875A', color: '#FFFFFF', borderRadius: '4px' }}
              onClick={onExploreClick}
            >
              See How Agents Work Together
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              className="border px-8 py-4 text-sm transition-colors min-w-[240px] hover:bg-white hover:text-[#1A1A1A]"
              style={{ borderColor: '#FFFFFF', color: '#FFFFFF', borderRadius: '4px' }}
              onClick={onLearnMoreClick}
            >
              Explore Agent Roles
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
