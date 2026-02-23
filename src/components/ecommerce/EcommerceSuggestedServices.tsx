'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { FileText, Star, TrendingUp, Users } from 'lucide-react';

const services = [
  {
    icon: FileText,
    title: 'AI Product Descriptions',
    description: 'SEO-optimized, brand-consistent copy at scale. 40% faster listing creation.',
  },
  {
    icon: Star,
    title: 'Review Management AI',
    description: 'Auto-requests reviews, sentiment analysis, UGC curation for social proof.',
  },
  {
    icon: TrendingUp,
    title: 'Demand Forecasting',
    description: 'Predict demand by product, location, season. Forecast errors reduced 30–50%.',
  },
  {
    icon: Users,
    title: 'Customer Segmentation',
    description: 'Auto-clusters by behavior, value, lifecycle → CAC reduced up to 50%.',
  },
];

export default function EcommerceSuggestedServices() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-[#FAF8F6] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group bg-white border border-gray-300 p-6 hover:border-[#84CC16] hover:bg-[#f0fdf4] transition-all duration-300"
              >
                <div className="space-y-4">
                  <Icon className="w-8 h-8 text-[#84CC16]" />
                  <h3 className="font-['Playfair_Display'] text-xl text-[#0F3D3E]">
                    {service.title}
                  </h3>
                  <p className="font-['Lora'] text-sm leading-relaxed text-gray-600">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}