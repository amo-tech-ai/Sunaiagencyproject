interface V2ProcessSectionProps {
  onNavigate?: (page: string) => void;
}

export default function V2ProcessSection({ onNavigate }: V2ProcessSectionProps) {
  const steps = [
    {
      number: '01',
      title: 'Discovery & Strategy',
      description: 'We analyze your business objectives, current systems, and opportunities for AI integration through collaborative workshops.',
      deliverable: 'Strategy Blueprint',
      duration: '2 weeks',
    },
    {
      number: '02',
      title: 'Design & Development',
      description: 'Our team designs, develops, and tests your AI system with continuous feedback loops and iterative improvements.',
      deliverable: 'Working Prototype',
      duration: '6-8 weeks',
    },
    {
      number: '03',
      title: 'Launch & Scale',
      description: 'We deploy, monitor, and optimize your system for maximum performance, ROI, and seamless integration.',
      deliverable: 'Production System',
      duration: '2 weeks',
    },
  ];

  return (
    <section className="bg-[#FAF8F6] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <div className="inline-block px-4 py-2 bg-[#84CC16]/10 border border-[#84CC16]/20 mb-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#84CC16] font-medium">
              How It Works
            </span>
          </div>
          
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-6xl font-bold text-[#1A1A1A] leading-[1.05] mb-6">
            A proven process for real, only measurable success
          </h2>
          
          <p className="text-xl text-[#666666] leading-relaxed font-['Lora']">
            Three phases designed to minimize risk and maximize results. From discovery to deployment in 10-12 weeks.
          </p>
        </div>
        
        {/* Process Steps */}
        <div className="space-y-0">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center py-12 lg:py-16 border-b border-[#EFE9E4] last:border-b-0 group"
            >
              {/* Number */}
              <div className="lg:col-span-3">
                <div className="space-y-4">
                  <div className="text-8xl lg:text-9xl font-['Playfair_Display'] font-bold text-[#84CC16] leading-none group-hover:scale-105 transition-transform duration-300 inline-block">
                    {step.number}
                  </div>
                  <div className="inline-block px-3 py-1.5 bg-white border border-[#EFE9E4]">
                    <span className="text-xs uppercase tracking-wider text-[#666666]">
                      {step.duration}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-3xl lg:text-4xl font-['Playfair_Display'] font-bold text-[#1A1A1A] leading-tight">
                  {step.title}
                </h3>
                <p className="text-lg text-[#666666] leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {/* Deliverable */}
              <div className="lg:col-span-3">
                <div className="bg-white border-2 border-[#EFE9E4] p-6 group-hover:border-[#84CC16] transition-colors">
                  <div className="text-xs uppercase tracking-[0.2em] text-[#666666] mb-3">
                    Deliverable
                  </div>
                  <div className="text-xl font-['Playfair_Display'] font-bold text-[#1A1A1A]">
                    {step.deliverable}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA */}
        <div className="text-center mt-20">
          <button
            onClick={() => onNavigate?.('process-v12')}
            className="px-8 py-4 bg-[#1A1A1A] text-white font-medium text-base hover:bg-[#84CC16] hover:text-[#1A1A1A] transition-colors inline-flex items-center gap-2"
          >
            <span>View Detailed Process</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}