'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const chartData = [
  { name: 'Virtual Try-On', value: 80, label: '-25% Returns' },
  { name: 'Trend Forecasting', value: 75, label: '-30% Overproduction' },
  { name: 'Personalization', value: 65, label: '+26% AOV' },
  { name: 'Design Generation', value: 90, label: '10x Faster Cycles' },
  { name: 'Supply Chain', value: 50, label: '-20% Costs' },
];

export default function FashionROIChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <p className="text-xs tracking-wider text-[#696969] uppercase font-['Lora'] mb-2">
            EXHIBIT 3
          </p>
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#212427]">
            Fashion AI Impact by Application Area
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-[#F1EEEA] border border-[#D4D4D4] p-8 lg:p-12"
        >
          <div className="space-y-8">
            {chartData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-['Lora'] text-sm text-[#212427] w-40">
                    {item.name}
                  </span>
                  <div className="flex-1 bg-white h-8 relative border border-[#D4D4D4]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${item.value}%` } : { width: 0 }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                      className="bg-[#0A211F] h-full"
                    />
                  </div>
                  <span className="font-['Lora'] text-sm text-[#212427] w-40 text-right">
                    {item.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
