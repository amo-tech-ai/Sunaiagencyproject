// C-AG02 — Agents CTA
// BCG design system dark variant: charcoal bg, white text, Georgia serif, green CTA, 4px radius

import { ArrowRight } from 'lucide-react';

interface AgentsCTAProps {
  onWizardClick?: () => void;
}

export default function AgentsCTA({ onWizardClick }: AgentsCTAProps) {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
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

      <div className="relative max-w-[1120px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2
            className="text-3xl md:text-4xl text-white mb-6 leading-tight tracking-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            See Which Agents Your Business Needs
          </h2>

          <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(245,245,240,0.5)' }}>
            Answer a few questions. Get a tailored system recommendation.
          </p>

          <button
            className="px-8 py-4 text-sm transition-colors min-w-[280px] flex items-center justify-center gap-2 mx-auto"
            style={{ backgroundColor: '#00875A', color: '#FFFFFF', borderRadius: '4px' }}
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
