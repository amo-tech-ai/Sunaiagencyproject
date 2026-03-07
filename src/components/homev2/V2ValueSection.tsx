// C-V2-03 — V2 Value Section
// BCG design system: off-white bg, charcoal text, Georgia serif, green accents, 4px radius

import { Shield, Clock, Users, Zap } from 'lucide-react';

export default function V2ValueSection() {
  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: '#F5F5F0' }}>
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left: Large Image */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[3/4] relative overflow-hidden" style={{ borderRadius: '4px' }}>
              <img
                src="https://images.unsplash.com/photo-1765366417030-16d9765d920a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Modern office workspace"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-7 lg:p-10">
                <h3 className="text-2xl lg:text-3xl text-white leading-tight mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  Your digital experience should feel like your brand
                </h3>
                <p className="text-base text-white/80 leading-relaxed">
                  Thoughtfully designed systems that adapt to your needs
                </p>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="space-y-5">
              <div className="inline-block px-3.5 py-1.5 border" style={{ backgroundColor: 'rgba(0,135,90,0.08)', borderColor: 'rgba(0,135,90,0.15)', borderRadius: '4px' }}>
                <span className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
                  A product-quality partner you can trust
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl leading-[1.1]" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
                The building blocks of great digital experience
              </h2>
            </div>

            {/* Value Props */}
            <div className="grid gap-7">
              {[
                { icon: Shield, label: 'Enterprise Security', description: 'Bank-grade encryption and compliance standards' },
                { icon: Clock, label: '24/7 Monitoring', description: 'Always-on support and proactive maintenance' },
                { icon: Users, label: 'Dedicated Team', description: 'Strategic partners invested in your success' },
                { icon: Zap, label: 'Rapid Iteration', description: 'Continuous improvement based on real data' },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="w-11 h-11 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00875A] transition-colors" style={{ backgroundColor: 'rgba(0,135,90,0.08)', borderRadius: '4px' }}>
                    <item.icon className="w-5 h-5 group-hover:text-white transition-colors" style={{ color: '#00875A' }} />
                  </div>
                  <div className="pt-0.5 space-y-1">
                    <div className="text-base" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
                      {item.label}
                    </div>
                    <div className="text-sm leading-relaxed" style={{ color: '#6B6B63' }}>
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
