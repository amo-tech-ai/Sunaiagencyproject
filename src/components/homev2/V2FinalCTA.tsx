// C-V2-09 — V2 Final CTA
// BCG design system dark variant: charcoal bg, white text, Georgia serif, green accents, 4px radius

interface V2FinalCTAProps {
  onNavigate?: (page: string) => void;
}

export default function V2FinalCTA({ onNavigate }: V2FinalCTAProps) {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
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

      <div className="max-w-[1120px] mx-auto px-6 text-center relative z-10">
        <div className="space-y-8">
          <div className="inline-block px-3.5 py-1.5 border" style={{ backgroundColor: 'rgba(0,135,90,0.08)', borderColor: 'rgba(0,135,90,0.15)', borderRadius: '4px' }}>
            <span className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
              Ready to get started?
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl text-white leading-[1.05]" style={{ fontFamily: 'Georgia, serif' }}>
            Find out how we&apos;d tackle your AI project
          </h2>

          <p className="text-lg lg:text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
            Join 200+ companies building intelligent systems that deliver measurable results. Schedule a free strategy call to discuss your project.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate?.('booking')}
              className="px-8 py-4 text-sm transition-all inline-flex items-center justify-center gap-2 group text-white"
              style={{ backgroundColor: '#00875A', borderRadius: '4px' }}
            >
              <span>Schedule Strategy Call</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button
              onClick={() => onNavigate?.('projects')}
              className="px-8 py-4 border text-sm text-white hover:bg-white/5 transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}
            >
              View Case Studies
            </button>
          </div>

          <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-7 text-white/60">
            {['Response within 24 hours', 'No commitment required', 'Free consultation'].map((text, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2" style={{ backgroundColor: '#00875A' }} />
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
