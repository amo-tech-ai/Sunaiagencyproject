export default function V2MetricsSection() {
  const metrics = [
    {
      number: '35%',
      label: 'Increase in customer experience',
      description: 'Measured across all client engagements',
    },
    {
      number: '98%',
      label: 'Client satisfaction',
      description: 'Consistent excellence in delivery',
    },
    {
      number: '300+',
      label: 'Projects launched',
      description: 'Spanning multiple industries',
    },
  ];

  return (
    <section className="bg-[#0F3D3E] py-32 lg:py-40 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-4xl mb-20">
          <div className="inline-block px-4 py-2 bg-[#84CC16]/10 border border-[#84CC16]/20 mb-8">
            <span className="text-xs uppercase tracking-[0.2em] text-[#84CC16] font-medium">
              Why creative teams choose digistudio
            </span>
          </div>
          
          <h2 className="font-['Playfair_Display'] text-5xl lg:text-7xl font-bold text-white leading-[1.05] mb-8">
            A proven process for real, only measurable success
          </h2>
          
          <p className="text-xl lg:text-2xl text-white/70 leading-relaxed font-['Lora'] max-w-3xl">
            We don't just deliver projects—we build long-term partnerships that drive continuous growth and innovation.
          </p>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-16 lg:gap-20">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className="space-y-6 group"
            >
              <div className="space-y-4">
                <div className="text-7xl lg:text-8xl font-['Playfair_Display'] font-bold text-[#84CC16] leading-none group-hover:scale-105 transition-transform duration-300 inline-block">
                  {metric.number}
                </div>
                <div className="h-0.5 w-16 bg-[#84CC16]" />
              </div>
              
              <div className="space-y-3">
                <div className="text-xl font-medium text-white font-['Playfair_Display']">
                  {metric.label}
                </div>
                <div className="text-base text-white/60 leading-relaxed">
                  {metric.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}