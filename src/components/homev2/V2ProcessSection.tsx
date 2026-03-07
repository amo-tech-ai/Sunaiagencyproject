// C-V2-05 — V2 Process Section
// BCG design system: off-white bg, charcoal text, Georgia serif, green accents, 4px radius

interface V2ProcessSectionProps {
  onNavigate?: (page: string) => void;
}

export default function V2ProcessSection({ onNavigate }: V2ProcessSectionProps) {
  const steps = [
    { number: '01', title: 'Discovery & Strategy', description: 'We analyze your business objectives, current systems, and opportunities for AI integration through collaborative workshops.', deliverable: 'Strategy Blueprint', duration: '2 weeks' },
    { number: '02', title: 'Design & Development', description: 'Our team designs, develops, and tests your AI system with continuous feedback loops and iterative improvements.', deliverable: 'Working Prototype', duration: '6-8 weeks' },
    { number: '03', title: 'Launch & Scale', description: 'We deploy, monitor, and optimize your system for maximum performance, ROI, and seamless integration.', deliverable: 'Production System', duration: '2 weeks' },
  ];

  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: '#F5F5F0' }}>
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <div className="inline-block px-3.5 py-1.5 border mb-5" style={{ backgroundColor: 'rgba(0,135,90,0.08)', borderColor: 'rgba(0,135,90,0.15)', borderRadius: '4px' }}>
            <span className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>How It Works</span>
          </div>
          <h2 className="text-3xl lg:text-4xl leading-[1.05] mb-5" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            A proven process for real, only measurable success
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: '#6B6B63' }}>
            Three phases designed to minimize risk and maximize results. From discovery to deployment in 10-12 weeks.
          </p>
        </div>

        <div className="space-y-0">
          {steps.map((step, index) => (
            <div key={index} className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center py-10 lg:py-14 border-b last:border-b-0 group" style={{ borderColor: '#E8E8E4' }}>
              <div className="lg:col-span-3">
                <div className="space-y-3">
                  <div className="text-7xl lg:text-8xl leading-none group-hover:scale-105 transition-transform duration-300 inline-block" style={{ fontFamily: 'Georgia, serif', color: '#00875A' }}>
                    {step.number}
                  </div>
                  <div className="inline-block px-3 py-1.5 border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E8E4', borderRadius: '4px' }}>
                    <span className="text-xs tracking-widest uppercase" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>{step.duration}</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6 space-y-3">
                <h3 className="text-2xl lg:text-3xl leading-tight" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>{step.title}</h3>
                <p className="text-base leading-relaxed" style={{ color: '#6B6B63' }}>{step.description}</p>
              </div>
              <div className="lg:col-span-3">
                <div className="bg-white border p-5 group-hover:border-[#00875A] transition-colors" style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}>
                  <div className="text-xs tracking-widest uppercase mb-2" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>Deliverable</div>
                  <div className="text-lg" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>{step.deliverable}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button
            onClick={() => onNavigate?.('process-v12')}
            className="px-8 py-4 text-sm text-white hover:bg-[#00875A] transition-colors inline-flex items-center gap-2"
            style={{ backgroundColor: '#1A1A1A', borderRadius: '4px' }}
          >
            <span>View Detailed Process</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
