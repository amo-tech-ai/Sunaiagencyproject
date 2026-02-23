'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { BarChart3, RefreshCw, Camera, Factory } from 'lucide-react';

const services = [
  {
    icon: BarChart3,
    title: 'Catalog Intelligence',
    description:
      'Clean, enrich, structure product data for AI agent shopping readiness. Tag attributes automatically.',
  },
  {
    icon: RefreshCw,
    title: 'Circular Fashion AI',
    description:
      'Computer vision for garment condition assessment, resale pricing, and authentication for recommerce.',
  },
  {
    icon: Camera,
    title: 'AI Campaign Content',
    description:
      'Virtual model photography, social content variants, campaign A/B testing. Save $5–20K per photoshoot.',
  },
  {
    icon: Factory,
    title: 'Supply Chain Optimization',
    description:
      'LVMH-style allocation intelligence, markdown management, waste reduction across SKUs and seasons.',
  },
];

export default function FashionSuggestedServices() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#212427]">
            Suggested Additional Services
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-[#F1EEEA] border border-[#D4D4D4] p-8 hover:bg-white transition-colors duration-300"
              >
                <div className="w-12 h-12 bg-[#0A211F] flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="font-['Playfair_Display'] text-2xl text-[#212427] mb-4">
                  {service.title}
                </h3>

                <p className="font-['Lora'] text-base text-[#696969] leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
