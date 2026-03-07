// C-V2-06 — V2 Pricing Section
// BCG design system: white bg, charcoal text, Georgia serif, green accents, 4px radius

import { Check } from 'lucide-react';

interface V2PricingSectionProps {
  onNavigate?: (page: string) => void;
}

export default function V2PricingSection({ onNavigate }: V2PricingSectionProps) {
  const tiers = [
    { name: 'Discovery', description: 'For businesses exploring AI opportunities', price: 'Custom', duration: '2-4 weeks', features: ['AI strategy workshop', 'Opportunity assessment', 'Technical feasibility study', 'ROI projections', 'Implementation roadmap'], cta: 'Start Discovery', highlighted: false },
    { name: 'Build', description: 'For companies ready to deploy AI systems', price: 'Custom', duration: '8-16 weeks', features: ['Everything in Discovery', 'Custom AI development', 'Model training & testing', 'System integration', 'Deployment & monitoring', 'Team training'], cta: 'Start Build', highlighted: true },
    { name: 'Partnership', description: 'For organizations scaling AI operations', price: 'Custom', duration: 'Ongoing', features: ['Everything in Build', 'Dedicated AI team', 'Continuous optimization', 'Priority support', 'Strategic guidance', 'Quarterly reviews'], cta: 'Become Partner', highlighted: false },
  ];

  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3.5 py-1.5 border mb-5" style={{ backgroundColor: 'rgba(0,135,90,0.08)', borderColor: 'rgba(0,135,90,0.15)', borderRadius: '4px' }}>
            <span className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>Investment Levels</span>
          </div>
          <h2 className="text-3xl lg:text-4xl leading-[1.05] mb-5" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            Flexible engagement models
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: '#6B6B63' }}>
            Choose the partnership level that matches your ambition and timeline.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`border p-8 lg:p-10 space-y-7 relative transition-all hover:shadow-lg ${tier.highlighted ? 'lg:scale-105' : ''}`}
              style={{ backgroundColor: '#F5F5F0', borderColor: tier.highlighted ? '#00875A' : '#E8E8E4', borderWidth: tier.highlighted ? '2px' : '1px', borderRadius: '4px' }}
            >
              {tier.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 text-white" style={{ backgroundColor: '#00875A', borderRadius: '4px' }}>
                  <span className="text-xs tracking-widest uppercase" style={{ letterSpacing: '0.06em' }}>Most Popular</span>
                </div>
              )}

              <div className="space-y-5 pt-2">
                <div className="space-y-2">
                  <h3 className="text-2xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>{tier.name}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B6B63' }}>{tier.description}</p>
                </div>
                <div className="pt-4 border-t" style={{ borderColor: '#E8E8E4' }}>
                  <div className="text-4xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>{tier.price}</div>
                  <div className="text-sm mt-1" style={{ color: '#6B6B63' }}>Timeline: {tier.duration}</div>
                </div>
              </div>

              <div className="border-t pt-7 space-y-3" style={{ borderColor: '#E8E8E4' }}>
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#00875A', borderRadius: '2px' }}>
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm" style={{ color: '#6B6B63' }}>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onNavigate?.('booking')}
                  className="w-full py-3.5 text-center text-sm transition-all"
                  style={tier.highlighted
                    ? { backgroundColor: '#00875A', color: '#FFFFFF', borderRadius: '4px' }
                    : { border: '1px solid #1A1A1A', color: '#1A1A1A', borderRadius: '4px' }
                  }
                >
                  {tier.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14 max-w-2xl mx-auto">
          <p className="text-sm leading-relaxed" style={{ color: '#6B6B63' }}>
            All engagements are customized to your specific needs and goals. Final pricing is determined after the discovery phase based on project scope and complexity.
          </p>
        </div>
      </div>
    </section>
  );
}
