'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const stats = [
  {
    label: 'AI Profit Potential',
    value: '$275B',
    context: 'McKinsey projection for fashion industry',
  },
  {
    label: 'AI Adoption Rate',
    value: '44%',
    context: 'Up from 20% in H1 2025 alone',
  },
  {
    label: 'Fashion AI Market CAGR',
    value: '40.8%',
    context: 'Fastest-growing AI vertical market',
  },
  {
    label: 'Return Reduction (Try-On)',
    value: '-25%',
    context: 'Virtual try-on impact on return rates',
  },
];

export default function FashionStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Exhibit Label */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <p className="text-xs tracking-wider text-[#696969] uppercase font-['Lora'] mb-2">
            EXHIBIT 1
          </p>
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#212427]">
            Industry Analysis — Key Stats
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="border border-[#D4D4D4] bg-[#F1EEEA] p-8"
            >
              <div className="mb-4">
                <p className="font-['Lora'] text-sm text-[#696969] uppercase tracking-wider mb-3">
                  {stat.label}
                </p>
                <p className="font-['Playfair_Display'] text-5xl text-[#0A211F]">
                  {stat.value}
                </p>
              </div>
              <p className="font-['Lora'] text-sm text-[#696969] leading-relaxed">
                {stat.context}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Additional Context */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-[#D4D4D4]"
        >
          <div className="font-['Lora'] text-base text-[#696969] space-y-3">
            <p>• 74% of fashion brands now use AI-based forecasting (BoF/McKinsey State of Fashion 2026)</p>
            <p>• Fashion returns cost the industry $800B+ annually — AI sizing cuts returns 17-25%</p>
            <p>• AI can reduce design cycles from 12 weeks to under 1 week</p>
            <p>• Overproduction accounts for 10% of global CO₂ — AI trend prediction reduces it 20-30%</p>
            <p>• The global AI in fashion market is projected to reach $4.4B by 2027</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
