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
    <section ref={ref} className="py-24 lg:py-32" style={{ backgroundColor: '#F5F5F0' }}>
      <div className="max-w-[1120px] mx-auto px-6 lg:px-8">
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
              className="border-l-2 pl-6"
              style={{ borderColor: '#00875A' }}
            >
              <div className="space-y-3">
                <p className="text-xs tracking-[0.2em] uppercase" style={{ color: '#9CA39B' }}>
                  {stat.label}
                </p>
                <p className="text-5xl lg:text-6xl leading-none" style={{ fontFamily: 'Georgia, serif', color: '#00875A' }}>
                  {stat.value}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#6B6B63' }}>
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
