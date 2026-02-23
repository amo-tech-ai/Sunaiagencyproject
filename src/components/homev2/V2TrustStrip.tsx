export default function V2TrustStrip() {
  const companies = [
    { name: 'TechCorp', logo: 'TC' },
    { name: 'FinanceHub', logo: 'FH' },
    { name: 'HealthFirst', logo: 'HF' },
    { name: 'RetailPro', logo: 'RP' },
    { name: 'LegalTech', logo: 'LT' },
    { name: 'EduSmart', logo: 'ES' },
  ];

  return (
    <section className="bg-white border-y border-[#EFE9E4] py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-[#666666] font-medium">
            Trusted by industry leaders
          </p>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 lg:gap-12 items-center">
          {companies.map((company, index) => (
            <div 
              key={index}
              className="flex items-center justify-center group cursor-pointer"
            >
              <div className="w-16 h-16 border-2 border-[#EFE9E4] flex items-center justify-center group-hover:border-[#84CC16] transition-colors">
                <span className="text-sm font-['Playfair_Display'] font-bold text-[#666666] group-hover:text-[#84CC16] transition-colors">
                  {company.logo}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}