import { ArrowRight } from 'lucide-react';

interface AgentsHeroProps {
  onExploreClick?: () => void;
  onLearnMoreClick?: () => void;
}

export default function AgentsHero({ onExploreClick, onLearnMoreClick }: AgentsHeroProps) {
  return (
    <section className="relative bg-[#0F3D3E] overflow-hidden">
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
          background: 'radial-gradient(ellipse at center, rgba(15,61,62,0) 0%, rgba(15,61,62,0.4) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-5xl mx-auto text-center">
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl tracking-tight mb-8 leading-tight text-white"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            AI Agents That Run Your Business — Together
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-6 leading-relaxed max-w-3xl mx-auto font-['Lora']">
            Not isolated bots. A coordinated system with planning, intelligence, and control.
          </p>

          <blockquote className="text-lg text-gray-400 italic mb-12 max-w-2xl mx-auto border-l-2 border-[#84CC16] pl-6 py-2 font-['Lora']">
            Every action follows a plan. Every decision is scored. Every execution is gated.
          </blockquote>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="bg-[#84CC16] hover:bg-[#73b512] text-gray-900 px-8 py-4 text-base font-semibold transition-colors duration-200 min-w-[240px] flex items-center justify-center gap-2 font-['Lora']"
              onClick={onExploreClick}
            >
              See How Agents Work Together
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              className="border border-white hover:bg-white hover:text-[#0F3D3E] text-white px-8 py-4 text-base font-semibold transition-colors duration-200 min-w-[240px] font-['Lora']"
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