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
    <section className="py-24 lg:py-32 relative overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
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
          <div className="inline-block px-3.5 py-1.5 border mb-7" style={{ backgroundColor: 'rgba(0,135,90,0.08)', borderColor: 'rgba(0,135,90,0.15)', borderRadius: '4px' }}>
            <span className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
              Why creative teams choose digistudio
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl text-white leading-[1.05] mb-7" style={{ fontFamily: 'Georgia, serif' }}>
            A proven process for real, only measurable success
          </h2>
          
          <p className="text-lg lg:text-xl text-white/70 leading-relaxed max-w-3xl">
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
                <div className="text-6xl lg:text-7xl leading-none group-hover:scale-105 transition-transform duration-300 inline-block" style={{ fontFamily: 'Georgia, serif', color: '#00875A' }}>
                  {metric.number}
                </div>
                <div className="h-0.5 w-14" style={{ backgroundColor: '#00875A' }} />
              </div>
              
              <div className="space-y-3">
                <div className="text-lg text-white" style={{ fontFamily: 'Georgia, serif' }}>
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