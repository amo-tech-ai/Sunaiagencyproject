interface V2FinalCTAProps {
  onNavigate?: (page: string) => void;
}

export default function V2FinalCTA({ onNavigate }: V2FinalCTAProps) {
  return (
    <section className="relative bg-[#0F3D3E] py-32 lg:py-40 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1668502741331-09e1c8917496?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Team collaboration"
          className="w-full h-full object-cover opacity-10"
        />
      </div>
      
      <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center relative z-10">
        <div className="space-y-10">
          <div className="inline-block px-4 py-2 bg-[#84CC16]/10 border border-[#84CC16]/20">
            <span className="text-xs uppercase tracking-[0.2em] text-[#84CC16] font-medium">
              Ready to get started?
            </span>
          </div>
          
          <h2 className="font-['Playfair_Display'] text-5xl lg:text-7xl font-bold text-white leading-[1.05]">
            Find out how we&apos;d tackle your AI project
          </h2>
          
          <p className="text-xl lg:text-2xl text-white/70 leading-relaxed max-w-3xl mx-auto font-['Lora']">
            Join 200+ companies building intelligent systems that deliver measurable results. Schedule a free strategy call to discuss your project.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate?.('booking')}
              className="px-10 py-5 bg-[#84CC16] text-[#1A1A1A] font-medium text-lg hover:bg-[#65A30D] transition-all hover:scale-105 inline-flex items-center justify-center gap-2 group"
            >
              <span>Schedule Strategy Call</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            
            <button
              onClick={() => onNavigate?.('projects')}
              className="px-10 py-5 border-2 border-white/20 text-white font-medium text-lg hover:bg-white/5 transition-colors"
            >
              View Case Studies
            </button>
          </div>
          
          <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#84CC16]" />
              <span className="text-sm">Response within 24 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#84CC16]" />
              <span className="text-sm">No commitment required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#84CC16]" />
              <span className="text-sm">Free consultation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}