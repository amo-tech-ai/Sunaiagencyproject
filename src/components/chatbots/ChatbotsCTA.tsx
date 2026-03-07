// C-CB06 — Chatbots CTA
// BCG design system dark variant: charcoal bg, white text, Georgia serif, green CTA, 4px radius

import { ArrowRight } from 'lucide-react';

interface ChatbotsCTAProps {
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export default function ChatbotsCTA({ onPrimaryClick, onSecondaryClick }: ChatbotsCTAProps) {
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
            Ready to Turn Conversations into Revenue?
          </h2>

          <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(245,245,240,0.5)' }}>
            Get a custom AI chatbot strategy designed for your business, industry, and goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="px-8 py-4 text-sm transition-all min-w-[280px] flex items-center justify-center gap-2 group"
              style={{ backgroundColor: '#00875A', color: '#FFFFFF', borderRadius: '4px' }}
              onClick={onPrimaryClick}
            >
              Design My AI Chatbot System
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              className="border px-8 py-4 text-sm transition-all min-w-[280px] hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#FFFFFF', borderRadius: '4px' }}
              onClick={onSecondaryClick}
            >
              See Chatbot Use Cases by Industry
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
