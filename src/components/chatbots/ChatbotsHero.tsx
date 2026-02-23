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
    <section className="relative bg-[#1A1A1A] overflow-hidden min-h-screen flex items-center">
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

      {/* Radial Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(26,26,26,0) 0%, rgba(26,26,26,0.6) 100%)',
        }}
      />

      {/* Floating Accent Elements */}
      <div 
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#F59E0B] opacity-[0.03] blur-3xl rounded-full"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      />
      <div 
        className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#F59E0B] opacity-[0.02] blur-3xl rounded-full"
        style={{ transform: `translateY(${scrollY * -0.15}px)` }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="inline-block mb-6">
            <span className="text-xs uppercase tracking-widest text-[#F59E0B] font-medium border border-[#F59E0B] px-4 py-2">
              AI Chatbots That Actually Run Your Business
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight mb-6 leading-[1.1] text-white">
            AI Chatbots That Do the Work — Not Just Talk
          </h1>

          {/* Sub-headline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
            Automate sales, support, and operations with AI chatbots that answer questions, execute workflows, 
            qualify leads, and sync with your CRM — 24/7.
          </p>

          {/* Value Bullets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-3xl mx-auto">
            {bullets.map((bullet, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 text-left"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <CheckCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-1" />
                <span className="text-gray-300 text-sm md:text-base">{bullet}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="bg-[#F59E0B] hover:bg-[#FCD34D] text-[#1A1A1A] px-8 py-4 text-base font-medium transition-all duration-300 min-w-[280px] flex items-center justify-center gap-2 group"
              onClick={onPrimaryClick}
            >
              Get Your AI Chatbot Strategy
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              className="border border-gray-600 hover:border-[#F59E0B] hover:bg-gray-800 text-white px-8 py-4 text-base font-medium transition-all duration-300 min-w-[280px]"
              onClick={onSecondaryClick}
            >
              See Real Use Cases
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
