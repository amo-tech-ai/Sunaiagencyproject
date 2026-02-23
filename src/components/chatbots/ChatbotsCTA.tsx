import { ArrowRight } from 'lucide-react';

interface ChatbotsCTAProps {
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export default function ChatbotsCTA({ onPrimaryClick, onSecondaryClick }: ChatbotsCTAProps) {
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

      {/* Radial Glow */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.05) 0%, rgba(26,26,26,0) 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight tracking-tight">
            Ready to Turn Conversations into Revenue?
          </h2>

          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Get a custom AI chatbot strategy designed for your business, industry, and goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="bg-[#F59E0B] hover:bg-[#FCD34D] text-[#1A1A1A] px-8 py-4 text-base font-medium transition-all duration-300 min-w-[280px] flex items-center justify-center gap-2 group"
              onClick={onPrimaryClick}
            >
              Design My AI Chatbot System
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              className="border border-gray-600 hover:border-[#F59E0B] hover:bg-gray-800 text-white px-8 py-4 text-base font-medium transition-all duration-300 min-w-[280px]"
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
