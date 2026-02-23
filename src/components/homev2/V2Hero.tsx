import { ArrowRight } from 'lucide-react';

interface V2HeroProps {
  onNavigate?: (page: string) => void;
}

export default function V2Hero({ onNavigate }: V2HeroProps) {
  return (
    <section className="relative bg-[#0F3D3E] pt-32 pb-0 lg:pt-40 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center pb-24 lg:pb-32">
          {/* Left: Editorial Headline */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-[#84CC16]/10 border border-[#84CC16]/20">
                <span className="text-xs uppercase tracking-[0.2em] text-[#84CC16] font-medium">
                  Design meets Intelligence
                </span>
              </div>
              
              <h1 className="font-['Playfair_Display'] text-5xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
                Build AI that scales
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/70 leading-relaxed max-w-xl font-['Lora']">
                We design intuitive digital experiences built to scale, delivering measurable results through intelligence.
              </p>
            </div>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => onNavigate?.('booking')}
                className="px-8 py-4 bg-[#84CC16] text-[#1A1A1A] font-medium text-base hover:bg-[#65A30D] transition-all hover:scale-105 inline-flex items-center justify-center gap-2 group"
              >
                <span>Start Project</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate?.('process-v12')}
                className="px-8 py-4 border-2 border-white/20 text-white font-medium text-base hover:bg-white/5 transition-colors"
              >
                View Process
              </button>
            </div>
          </div>
          
          {/* Right: Image */}
          <div className="relative">
            <div className="aspect-[4/5] relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1530281834572-02d15fa61f64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Professional executive"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F3D3E] via-transparent to-transparent" />
              
              {/* Floating Stats */}
              <div className="absolute bottom-8 left-8 right-8 grid grid-cols-2 gap-4">
                <div className="bg-white/95 backdrop-blur-sm p-6">
                  <div className="text-3xl font-['Playfair_Display'] font-bold text-[#0F3D3E]">98%</div>
                  <div className="text-xs uppercase tracking-wider text-[#666666] mt-1">Satisfaction</div>
                </div>
                <div className="bg-[#84CC16] p-6">
                  <div className="text-3xl font-['Playfair_Display'] font-bold text-[#1A1A1A]">3.2x</div>
                  <div className="text-xs uppercase tracking-wider text-[#1A1A1A]/70 mt-1">Avg ROI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}