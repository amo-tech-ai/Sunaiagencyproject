import { ArrowRight } from 'lucide-react';

interface AgentsCTAProps {
  onWizardClick?: () => void;
}

export default function AgentsCTA({ onWizardClick }: AgentsCTAProps) {
  return (
    <section className="relative bg-[#1A1A1A] py-32 md:py-40 overflow-hidden">
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight tracking-tight">
            See Which Agents Your Business Needs
          </h2>

          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Answer a few questions. Get a tailored system recommendation.
          </p>

          <button
            className="bg-[#F59E0B] hover:bg-[#FCD34D] text-[#1A1A1A] px-8 py-4 text-base font-medium transition-colors duration-200 min-w-[280px] flex items-center justify-center gap-2 mx-auto"
            onClick={onWizardClick}
          >
            Start the AI Readiness Wizard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
