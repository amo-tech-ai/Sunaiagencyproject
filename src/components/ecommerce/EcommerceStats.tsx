'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const stats = [
  {
    label: 'GenAI Search Growth',
    value: '4,700%',
    context: 'YoY increase in AI-driven traffic to e-commerce sites',
  },
  {
    label: 'Customer Acquisition Cost',
    value: '-76%',
    context: 'Reduction when using AI personalization vs traditional',
  },
  {
    label: 'Average AI Investment',
    value: '$324K',
    context: 'What e-commerce companies plan to spend on AI in 2026',
  },
  {
    label: 'Revenue Increase (Leaders)',
    value: '+40%',
    context: 'Gap between AI-forward companies and laggards',
  },
];

export default function EcommerceStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-[#FAF8F6] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="border-l-2 border-[#84CC16] pl-6"
            >
              <div className="space-y-3">
                <p className="text-xs tracking-[0.2em] uppercase text-gray-500 font-['Lora']">
                  {stat.label}
                </p>
                <p className="font-['Playfair_Display'] text-5xl lg:text-6xl text-[#84CC16] leading-none">
                  {stat.value}
                </p>
                <p className="text-sm leading-relaxed text-gray-600 font-['Lora']">
                  {stat.context}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}