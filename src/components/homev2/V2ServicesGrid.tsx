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
      features: [
        'End-to-end development',
        'Custom model training',
        'API integration',
        'User interface design',
      ],
      link: 'solutions',
      image: 'https://images.unsplash.com/photo-1768483538267-fce52de424d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      icon: Bot,
      title: 'AI Agents',
      description: 'Autonomous intelligent agents that execute complex workflows, make decisions, and adapt to changing conditions.',
      features: [
        'Multi-step automation',
        'Decision-making logic',
        'Real-time adaptation',
        'Tool integration',
      ],
      link: 'agents',
      image: 'https://images.unsplash.com/photo-1660165458059-57cfb6cc87e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      icon: Workflow,
      title: 'Automations',
      description: 'Intelligent process automation that eliminates repetitive work and scales operations without increasing headcount.',
      features: [
        'Workflow orchestration',
        'Data processing',
        'Smart routing',
        'Error handling',
      ],
      link: 'chatbots',
      image: 'https://images.unsplash.com/photo-1739298061766-e2751d92e9db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
  ];

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block px-4 py-2 bg-[#84CC16]/10 border border-[#84CC16]/20 mb-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#84CC16] font-medium">
              Services & Capabilities
            </span>
          </div>
          
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-6xl font-bold text-[#1A1A1A] leading-[1.05] mb-6">
            Full-stack AI development
          </h2>
          
          <p className="text-xl text-[#666666] leading-relaxed font-['Lora']">
            From concept to production, we build AI systems that deliver results.
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group cursor-pointer"
              onClick={() => onNavigate?.(service.link)}
            >
              {/* Image */}
              <div className="aspect-[4/5] mb-6 overflow-hidden relative">
                <img 
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Icon Overlay */}
                <div className="absolute top-6 left-6 w-16 h-16 bg-[#84CC16] flex items-center justify-center">
                  <service.icon className="w-8 h-8 text-[#1A1A1A]" />
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              
              {/* Content */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-['Playfair_Display'] font-bold text-[#1A1A1A] group-hover:text-[#84CC16] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-base text-[#666666] leading-relaxed">
                    {service.description}
                  </p>
                </div>
                
                {/* Features List */}
                <div className="space-y-3 pt-4 border-t border-[#EFE9E4]">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-[#84CC16]" />
                      <span className="text-sm text-[#666666]">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* Learn More */}
                <div className="pt-4">
                  <span className="inline-flex items-center gap-2 text-[#1A1A1A] text-sm uppercase tracking-widest font-medium group-hover:text-[#84CC16] transition-colors">
                    Learn More
                    <span>→</span>
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