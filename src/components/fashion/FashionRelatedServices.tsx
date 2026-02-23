'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const relatedServices = [
  {
    tag: 'INDUSTRY',
    title: 'Luxury Goods',
    gradient: 'from-amber-600 to-yellow-700',
  },
  {
    tag: 'INDUSTRY',
    title: 'Retail Industry',
    gradient: 'from-green-600 to-emerald-700',
  },
  {
    tag: 'CAPABILITY',
    title: 'Customer Experience',
    gradient: 'from-blue-600 to-cyan-700',
  },
];

export default function FashionRelatedServices() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-[#F1EEEA] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#212427]">
            Explore Related Services
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group cursor-pointer border border-[#D4D4D4] overflow-hidden hover:border-[#0A211F] transition-colors duration-300"
            >
              {/* Gradient Image Area */}
              <div className={`h-64 bg-gradient-to-br ${service.gradient} p-6 flex flex-col justify-between`}>
                <span className="inline-block w-fit px-3 py-1 bg-white/90 text-[#212427] text-xs tracking-wider uppercase font-['Lora']">
                  {service.tag}
                </span>
                <h3 className="font-['Playfair_Display'] text-3xl text-white">
                  {service.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
