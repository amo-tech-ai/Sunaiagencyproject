// C-V2-01 — V2 Hero
// BCG design system dark variant: charcoal bg, white text, Georgia serif, green accents, 4px radius

import { ArrowRight } from 'lucide-react';

interface V2HeroProps {
  onNavigate?: (page: string) => void;
}

export default function V2Hero({ onNavigate }: V2HeroProps) {
  return (
    <section className="relative pt-28 pb-0 lg:pt-36 overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-[1120px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center pb-20 lg:pb-28">
          {/* Left: Editorial Headline */}
          <div className="space-y-7">
            <div className="space-y-5">
              <div className="inline-block px-3.5 py-1.5 border" style={{ backgroundColor: 'rgba(0,135,90,0.08)', borderColor: 'rgba(0,135,90,0.15)', borderRadius: '4px' }}>
                <span className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
                  Design meets Intelligence
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl text-white leading-[1.05] tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                Build AI that scales
              </h1>

              <p className="text-lg lg:text-xl text-white/70 leading-relaxed max-w-xl">
                We design intuitive digital experiences built to scale, delivering measurable results through intelligence.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => onNavigate?.('booking')}
                className="px-8 py-4 text-sm transition-all inline-flex items-center justify-center gap-2 group"
                style={{ backgroundColor: '#00875A', color: '#FFFFFF', borderRadius: '4px' }}
              >
                <span>Start Project</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate?.('process-v12')}
                className="px-8 py-4 border text-sm text-white hover:bg-white/5 transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}
              >
                View Process
              </button>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative">
            <div className="aspect-[4/5] relative overflow-hidden" style={{ borderRadius: '4px' }}>
              <img
                src="https://images.unsplash.com/photo-1530281834572-02d15fa61f64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Professional executive"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />

              {/* Floating Stats */}
              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-3">
                <div className="bg-white/95 backdrop-blur-sm p-5" style={{ borderRadius: '4px' }}>
                  <div className="text-2xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>98%</div>
                  <div className="text-xs tracking-widest uppercase mt-1" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>Satisfaction</div>
                </div>
                <div className="p-5" style={{ backgroundColor: '#00875A', borderRadius: '4px' }}>
                  <div className="text-2xl text-white" style={{ fontFamily: 'Georgia, serif' }}>3.2x</div>
                  <div className="text-xs tracking-widest uppercase text-white/70 mt-1" style={{ letterSpacing: '0.06em' }}>Avg ROI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
