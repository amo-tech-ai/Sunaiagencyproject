import { Check } from 'lucide-react';

interface V2PricingSectionProps {
  onNavigate?: (page: string) => void;
}

export default function V2PricingSection({ onNavigate }: V2PricingSectionProps) {
  const tiers = [
    {
      name: 'Discovery',
      description: 'For businesses exploring AI opportunities',
      price: 'Custom',
      duration: '2-4 weeks',
      features: [
        'AI strategy workshop',
        'Opportunity assessment',
        'Technical feasibility study',
        'ROI projections',
        'Implementation roadmap',
      ],
      cta: 'Start Discovery',
      highlighted: false,
    },
    {
      name: 'Build',
      description: 'For companies ready to deploy AI systems',
      price: 'Custom',
      duration: '8-16 weeks',
      features: [
        'Everything in Discovery',
        'Custom AI development',
        'Model training & testing',
        'System integration',
        'Deployment & monitoring',
        'Team training',
      ],
      cta: 'Start Build',
      highlighted: true,
    },
    {
      name: 'Partnership',
      description: 'For organizations scaling AI operations',
      price: 'Custom',
      duration: 'Ongoing',
      features: [
        'Everything in Build',
        'Dedicated AI team',
        'Continuous optimization',
        'Priority support',
        'Strategic guidance',
        'Quarterly reviews',
      ],
      cta: 'Become Partner',
      highlighted: false,
    },
  ];

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block px-4 py-2 bg-[#84CC16]/10 border border-[#84CC16]/20 mb-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#84CC16] font-medium">
              Investment Levels
            </span>
          </div>
          
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-6xl font-bold text-[#1A1A1A] leading-[1.05] mb-6">
            Flexible engagement models
          </h2>
          
          <p className="text-xl text-[#666666] leading-relaxed font-['Lora']">
            Choose the partnership level that matches your ambition and timeline.
          </p>
        </div>
        
        {/* Pricing Grid */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {tiers.map((tier, index) => (
            <div 
              key={index}
              className={`bg-[#FAF8F6] border-2 p-10 lg:p-12 space-y-8 relative transition-all hover:shadow-xl ${
                tier.highlighted 
                  ? 'border-[#84CC16] lg:scale-105' 
                  : 'border-[#EFE9E4]'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#84CC16] px-6 py-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#1A1A1A] font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              {/* Header */}
              <div className="space-y-6 pt-4">
                <div className="space-y-3">
                  <h3 className="text-3xl font-['Playfair_Display'] font-bold text-[#1A1A1A]">
                    {tier.name}
                  </h3>
                  <p className="text-base text-[#666666] leading-relaxed">
                    {tier.description}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-[#EFE9E4]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-['Playfair_Display'] font-bold text-[#1A1A1A]">
                      {tier.price}
                    </span>
                  </div>
                  <div className="text-sm text-[#666666] mt-2">
                    Timeline: {tier.duration}
                  </div>
                </div>
              </div>
              
              {/* Features */}
              <div className="border-t-2 border-[#EFE9E4] pt-8 space-y-4">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#84CC16] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-[#1A1A1A]" />
                    </div>
                    <span className="text-base text-[#666666]">{feature}</span>
                  </div>
                ))}
              </div>
              
              {/* CTA */}
              <div className="pt-6">
                <button
                  onClick={() => onNavigate?.('booking')}
                  className={`w-full py-4 text-center font-medium text-base transition-all ${
                    tier.highlighted
                      ? 'bg-[#84CC16] text-[#1A1A1A] hover:bg-[#65A30D] hover:scale-105'
                      : 'border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Note */}
        <div className="text-center mt-16 max-w-2xl mx-auto">
          <p className="text-base text-[#666666] leading-relaxed">
            All engagements are customized to your specific needs and goals. Final pricing is determined after the discovery phase based on project scope and complexity.
          </p>
        </div>
      </div>
    </section>
  );
}