import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Layers, Settings, Store } from 'lucide-react';

export default function WhatWeBuild() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const capabilities = [
    {
      icon: Layers,
      title: 'SaaS Platforms',
      description: 'Multi-tenant systems with billing, dashboards, and AI differentiation.',
      imageUrl: 'https://images.unsplash.com/photo-1579882392185-581038fbc8c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWFzJTIwcGxhdGZvcm0lMjBzb2Z0d2FyZSUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzIyMTg2NTR8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      icon: Settings,
      title: 'Internal Systems',
      description: 'Custom ops dashboards, workflow engines, automation layers.',
      imageUrl: 'https://images.unsplash.com/photo-1744230673231-865d54a0aba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlbGxpZ2VudCUyMGF1dG9tYXRpb24lMjB0ZWNobm9sb2d5JTIwbmV0d29ya3xlbnwxfHx8fDE3NzIyMTg2NTN8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      icon: Store,
      title: 'Customer Platforms',
      description: 'Marketplaces, portals, booking systems enhanced with AI.',
      imageUrl: 'https://images.unsplash.com/photo-1642132652860-471b4228023e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHBvcnRhbCUyMG1hcmtldHBsYWNlJTIwcGxhdGZvcm18ZW58MXx8fHwxNzcyMjE4NjU0fDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  return (
    <section ref={ref} className="py-24 lg:py-32" style={{ backgroundColor: '#F1EEEA' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          {/* Eyebrow */}
          <div className="mb-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#7EF473] font-semibold" style={{ fontFamily: 'system-ui, -apple-system' }}>
              CAPABILITIES
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl lg:text-6xl mb-6 text-[#0E3E1B]"
              style={{ fontFamily: 'Georgia, serif' }}>
            Built for Startups and Scaling Teams
          </h2>
        </motion.div>

        {/* Capability Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
              style={{ minHeight: '420px' }}
            >
              {/* Image Background */}
              <div className="absolute inset-0">
                <img 
                  src={capability.imageUrl} 
                  alt={capability.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E3E1B]/90 via-[#0E3E1B]/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                {/* Icon */}
                <div className="w-12 h-12 bg-[#7EF473] rounded-xl flex items-center justify-center mb-6">
                  <capability.icon className="w-6 h-6 text-[#0E3E1B]" strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-3xl mb-3 text-white"
                    style={{ fontFamily: 'Georgia, serif' }}>
                  {capability.title}
                </h3>

                {/* Description */}
                <p className="text-white/80 leading-relaxed text-lg"
                   style={{ fontFamily: 'system-ui, -apple-system' }}>
                  {capability.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
