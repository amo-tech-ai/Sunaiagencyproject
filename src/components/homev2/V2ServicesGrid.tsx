// C-V2-04 — V2 Services Grid
// BCG design system: white bg, charcoal text, Georgia serif, green accents, 4px radius

import { Bot, Sparkles, Workflow } from 'lucide-react';

interface V2ServicesGridProps {
  onNavigate?: (page: string) => void;
}

export default function V2ServicesGrid({ onNavigate }: V2ServicesGridProps) {
  const services = [
    {
      icon: Sparkles,
      title: 'AI Products',
      description: 'Custom AI applications built from strategy to deployment. Complete systems that integrate seamlessly with your operations.',
      features: ['End-to-end development', 'Custom model training', 'API integration', 'User interface design'],
      link: '/solutions',
      image: 'https://images.unsplash.com/photo-1768483538267-fce52de424d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      icon: Bot,
      title: 'AI Agents',
      description: 'Autonomous intelligent agents that execute complex workflows, make decisions, and adapt to changing conditions.',
      features: ['Multi-step automation', 'Decision-making logic', 'Real-time adaptation', 'Tool integration'],
      link: '/agents',
      image: 'https://images.unsplash.com/photo-1660165458059-57cfb6cc87e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      icon: Workflow,
      title: 'Automations',
      description: 'Intelligent process automation that eliminates repetitive work and scales operations without increasing headcount.',
      features: ['Workflow orchestration', 'Data processing', 'Smart routing', 'Error handling'],
      link: '/chatbots',
      image: 'https://images.unsplash.com/photo-1739298061766-e2751d92e9db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
  ];

  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3.5 py-1.5 border mb-5" style={{ backgroundColor: 'rgba(0,135,90,0.08)', borderColor: 'rgba(0,135,90,0.15)', borderRadius: '4px' }}>
            <span className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
              Services & Capabilities
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl leading-[1.05] mb-5" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            Full-stack AI development
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: '#6B6B63' }}>
            From concept to production, we build AI systems that deliver results.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, index) => (
            <div key={index} className="group cursor-pointer" onClick={() => onNavigate?.(service.link)}>
              <div className="aspect-[4/5] mb-5 overflow-hidden relative" style={{ borderRadius: '4px' }}>
                <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-5 left-5 w-14 h-14 flex items-center justify-center text-white" style={{ backgroundColor: '#00875A', borderRadius: '4px' }}>
                  <service.icon className="w-7 h-7" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <h3 className="text-xl group-hover:text-[#00875A] transition-colors" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B6B63' }}>{service.description}</p>
                </div>
                <div className="space-y-2.5 pt-4 border-t" style={{ borderColor: '#E8E8E4' }}>
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5" style={{ backgroundColor: '#00875A' }} />
                      <span className="text-sm" style={{ color: '#6B6B63' }}>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3">
                  <span className="inline-flex items-center gap-2 text-sm tracking-widest uppercase group-hover:text-[#00875A] transition-colors" style={{ color: '#1A1A1A', letterSpacing: '0.06em' }}>
                    Learn More <span>→</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
