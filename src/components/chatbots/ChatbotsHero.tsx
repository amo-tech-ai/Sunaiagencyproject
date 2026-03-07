// C-CB01 — Chatbots Hero
// BCG design system dark variant: charcoal bg, white text, Georgia serif, green accents, 4px radius

import { ArrowRight, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ChatbotsHeroProps {
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export default function ChatbotsHero({ onPrimaryClick, onSecondaryClick }: ChatbotsHeroProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bullets = [
    'Handle 60–80% of conversations automatically',
    'Respond instantly on Website, WhatsApp, Email',
    'Convert visitors into leads, bookings, and sales',
    'Fully connected to your CRM, workflows, and data',
  ];

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center" style={{ backgroundColor: '#1A1A1A' }}>
      {/* Animated Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />

      {/* Floating Accent Elements */}
      <div
        className="absolute top-1/4 right-1/4 w-96 h-96 opacity-[0.03] blur-3xl rounded-full"
        style={{ backgroundColor: '#00875A', transform: `translateY(${scrollY * 0.2}px)` }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-96 h-96 opacity-[0.02] blur-3xl rounded-full"
        style={{ backgroundColor: '#00875A', transform: `translateY(${scrollY * -0.15}px)` }}
      />

      {/* Content */}
      <div className="relative max-w-[1120px] mx-auto px-6 py-28">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="mb-6">
            <span className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
              AI Chatbots That Actually Run Your Business
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className="text-4xl md:text-5xl tracking-tight mb-6 leading-[1.1] text-white"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            AI Chatbots That Do the Work — Not Just Talk
          </h1>

          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-neutral-300 mb-10 leading-relaxed max-w-3xl mx-auto">
            Automate sales, support, and operations with AI chatbots that answer questions, execute workflows,
            qualify leads, and sync with your CRM — 24/7.
          </p>

          {/* Value Bullets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
            {bullets.map((bullet, index) => (
              <div
                key={index}
                className="flex items-start gap-3 text-left"
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#00875A' }} />
                <span className="text-neutral-300 text-sm md:text-base">{bullet}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="px-8 py-4 text-sm transition-all min-w-[280px] flex items-center justify-center gap-2 group"
              style={{ backgroundColor: '#00875A', color: '#FFFFFF', borderRadius: '4px' }}
              onClick={onPrimaryClick}
            >
              Get Your AI Chatbot Strategy
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              className="border px-8 py-4 text-sm transition-all min-w-[280px] hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#FFFFFF', borderRadius: '4px' }}
              onClick={onSecondaryClick}
            >
              See Real Use Cases
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
