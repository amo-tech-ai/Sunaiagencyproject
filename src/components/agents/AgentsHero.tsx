import { ArrowRight } from 'lucide-react';

interface AgentsHeroProps {
  onExploreClick?: () => void;
  onLearnMoreClick?: () => void;
}

export default function AgentsHero({ onExploreClick, onLearnMoreClick }: AgentsHeroProps) {
  return (
    <section className="relative bg-[#1A1A1A] overflow-hidden">
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

      {/* Radial Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(26,26,26,0) 0%, rgba(26,26,26,0.4) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight mb-8 leading-tight text-white">
            AI Agents That Run Your Business — Together
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-6 leading-relaxed max-w-3xl mx-auto">
            Not isolated bots. A coordinated system with planning, intelligence, and control.
          </p>

          <blockquote className="text-lg text-gray-400 italic mb-12 max-w-2xl mx-auto border-l-2 border-[#F59E0B] pl-6 py-2">
            Every action follows a plan. Every decision is scored. Every execution is gated.
          </blockquote>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="bg-[#F59E0B] hover:bg-[#FCD34D] text-[#1A1A1A] px-8 py-4 text-base font-medium transition-colors duration-200 min-w-[240px] flex items-center justify-center gap-2"
              onClick={onExploreClick}
            >
              See How Agents Work Together
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              className="border border-gray-700 hover:bg-gray-800 text-white px-8 py-4 text-base font-medium transition-colors duration-200 min-w-[240px]"
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
