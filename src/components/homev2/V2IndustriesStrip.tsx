interface V2IndustriesStripProps {
  onNavigate?: (page: string) => void;
}

export default function V2IndustriesStrip({ onNavigate }: V2IndustriesStripProps) {
  const industries = [
    { name: 'Financial Services', projects: '85+' },
    { name: 'Healthcare', projects: '62+' },
    { name: 'E-commerce', projects: '94+' },
    { name: 'Legal Tech', projects: '41+' },
    { name: 'Manufacturing', projects: '38+' },
    { name: 'Education', projects: '29+' },
  ];

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <div className="inline-block px-4 py-2 bg-[#84CC16]/10 border border-[#84CC16]/20 mb-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#84CC16] font-medium">
              Cross-Industry Expertise
            </span>
          </div>
          
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-6xl font-bold text-[#1A1A1A] leading-[1.05] mb-6">
            Built for every sector
          </h2>
          
          <p className="text-xl text-[#666666] leading-relaxed font-['Lora']">
            Our AI systems adapt to the unique challenges and opportunities within your industry.
          </p>
        </div>
        
        {/* Industries Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
          {industries.map((industry, index) => (
            <button
              key={index}
              onClick={() => onNavigate?.('industries')}
              className="group bg-[#FAF8F6] border-2 border-[#EFE9E4] p-10 lg:p-12 hover:border-[#84CC16] transition-all hover:shadow-lg text-left space-y-4"
            >
              <div className="space-y-3">
                <h3 className="text-xl font-['Playfair_Display'] font-bold text-[#1A1A1A] group-hover:text-[#84CC16] transition-colors leading-tight">
                  {industry.name}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-12 bg-[#84CC16]" />
                  <span className="text-sm text-[#666666] font-medium">
                    {industry.projects} projects
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* View All Link */}
        <div className="text-center mt-16">
          <button
            onClick={() => onNavigate?.('industries')}
            className="px-8 py-4 border-2 border-[#1A1A1A] text-[#1A1A1A] font-medium text-base hover:bg-[#1A1A1A] hover:text-white transition-colors inline-flex items-center gap-2"
          >
            <span>Explore All Industries</span>
            <span className="text-[#84CC16]">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}