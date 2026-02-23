import { Shield, Clock, Users, Zap } from 'lucide-react';

export default function V2ValueSection() {
  return (
    <section className="bg-[#FDFCFB] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Large Image */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[3/4] relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1765366417030-16d9765d920a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Modern office workspace"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Text */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 lg:p-12">
                <h3 className="font-['Playfair_Display'] text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                  Your digital experience should feel like your brand
                </h3>
                <p className="text-lg text-white/80 leading-relaxed font-['Lora']">
                  Thoughtfully designed systems that adapt to your needs
                </p>
              </div>
            </div>
          </div>
          
          {/* Right: Content */}
          <div className="space-y-10 order-1 lg:order-2">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-[#84CC16]/10 border border-[#84CC16]/20">
                <span className="text-xs uppercase tracking-[0.2em] text-[#84CC16] font-medium">
                  A product-quality partner you can trust
                </span>
              </div>
              
              <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-[1.1]">
                The building blocks of great digital experience
              </h2>
            </div>
            
            {/* Value Props */}
            <div className="grid gap-8">
              {[
                { 
                  icon: Shield, 
                  label: 'Enterprise Security',
                  description: 'Bank-grade encryption and compliance standards' 
                },
                { 
                  icon: Clock, 
                  label: '24/7 Monitoring',
                  description: 'Always-on support and proactive maintenance'
                },
                { 
                  icon: Users, 
                  label: 'Dedicated Team',
                  description: 'Strategic partners invested in your success'
                },
                { 
                  icon: Zap, 
                  label: 'Rapid Iteration',
                  description: 'Continuous improvement based on real data'
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-[#84CC16]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#84CC16] transition-colors">
                    <item.icon className="w-6 h-6 text-[#84CC16] group-hover:text-[#1A1A1A] transition-colors" />
                  </div>
                  <div className="pt-1 space-y-1">
                    <div className="text-lg font-medium text-[#1A1A1A] font-['Playfair_Display']">
                      {item.label}
                    </div>
                    <div className="text-base text-[#666666] leading-relaxed">
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