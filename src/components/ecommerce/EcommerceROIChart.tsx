'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const chartData = [
  { label: 'Personalization', value: 40, metric: '+40% Revenue' },
  { label: 'Cart Recovery', value: 33.8, metric: '33.8% Conv' },
  { label: 'Email Automation', value: 30, metric: '30x Rev/Rcpt' },
  { label: 'Visual Search', value: 69, metric: '693% Traffic' },
  { label: 'Fraud Detection', value: 60, metric: '-60% False Pos' },
];

const maxValue = Math.max(...chartData.map((d) => d.value));

export default function EcommerceROIChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 lg:py-32" style={{ backgroundColor: '#F5F5F0' }}>
      <div className="max-w-[1120px] mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="border bg-white p-8 lg:p-12"
          style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}
        >
          {/* Label */}
          <div className="mb-6">
            <span className="text-xs tracking-[0.2em] uppercase" style={{ color: '#9CA39B' }}>
              EXHIBIT 1
            </span>
          </div>

          {/* Title */}
          <h3 className="text-2xl lg:text-3xl mb-12" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            E-Commerce AI ROI by Application Area
          </h3>

          {/* Chart */}
          <div className="space-y-8">
            {chartData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm min-w-[160px]" style={{ color: '#1A1A1A' }}>
                    {item.label}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: '#00875A' }}>
                    {item.metric}
                  </span>
                </div>
                <div className="relative h-8" style={{ backgroundColor: '#F5F5F0' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${(item.value / maxValue) * 100}%` } : { width: 0 }}
                    transition={{ duration: 1.2, delay: index * 0.1 + 0.3, ease: 'easeOut' }}
                    className="absolute inset-y-0 left-0"
                    style={{ backgroundColor: '#00875A' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
