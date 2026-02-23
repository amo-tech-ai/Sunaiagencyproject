'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const stats = [
  {
    label: 'AI Travel Market',
    value: '$12B',
    context: 'Projected global market by 2026',
  },
  {
    label: 'Travelers Using AI',
    value: '86%',
    context: 'Have used AI to find or book accommodations',
  },
  {
    label: 'Revenue Increase',
    value: '10–20%',
    context: 'From AI-powered dynamic pricing',
  },
  {
    label: 'Support Cost Cut',
    value: '$8B',
    context: 'Global savings from AI call center automation by 2026',
  },
];

export default function TravelStats() {
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
            Industry Analysis — Key Stats
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="border border-[#D4D4D4] bg-white p-8"
            >
              <div className="mb-4">
                <p className="font-['Lora'] text-sm text-[#696969] uppercase tracking-wider mb-3">
                  {stat.label}
                </p>
                <p className="font-['Playfair_Display'] text-5xl text-[#7EF473]">
                  {stat.value}
                </p>
              </div>
              <p className="font-['Lora'] text-sm text-[#696969] leading-relaxed">
                {stat.context}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
