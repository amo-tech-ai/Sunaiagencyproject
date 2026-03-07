// C-V2-07 — V2 Industries Strip
// BCG design system: white bg, charcoal text, Georgia serif, green accents, 4px radius

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
    <section className="py-20 lg:py-28" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-[1120px] mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-block px-3.5 py-1.5 border mb-5" style={{ backgroundColor: 'rgba(0,135,90,0.08)', borderColor: 'rgba(0,135,90,0.15)', borderRadius: '4px' }}>
            <span className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
              Cross-Industry Expertise
            </span>
          </div>

          <h2 className="text-3xl lg:text-4xl leading-[1.05] mb-5" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            Built for every sector
          </h2>

          <p className="text-lg leading-relaxed" style={{ color: '#6B6B63' }}>
            Our AI systems adapt to the unique challenges and opportunities within your industry.
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 lg:gap-6">
          {industries.map((industry, index) => (
            <button
              key={index}
              onClick={() => onNavigate?.('industries')}
              className="group border p-8 lg:p-10 hover:border-[#00875A] transition-all text-left space-y-3"
              style={{ backgroundColor: '#F5F5F0', borderColor: '#E8E8E4', borderRadius: '4px' }}
            >
              <h3 className="text-lg leading-tight group-hover:text-[#00875A] transition-colors" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
                {industry.name}
              </h3>
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-10" style={{ backgroundColor: '#00875A' }} />
                <span className="text-sm" style={{ color: '#6B6B63' }}>
                  {industry.projects} projects
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-14">
          <button
            onClick={() => onNavigate?.('industries')}
            className="px-8 py-4 border text-sm hover:bg-[#1A1A1A] hover:text-white transition-colors inline-flex items-center gap-2"
            style={{ borderColor: '#1A1A1A', color: '#1A1A1A', borderRadius: '4px' }}
          >
            <span>Explore All Industries</span>
            <span style={{ color: '#00875A' }}>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
