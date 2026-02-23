'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const chartData = [
  { label: 'AI Travel Agent', value: 80, metric: '80% Auto-Resolved' },
  { label: 'Dynamic Pricing', value: 75, metric: '+10-20% Revenue' },
  { label: 'Itinerary Generator', value: 70, metric: '70% Faster Planning' },
  { label: 'Disruption Mgmt', value: 60, metric: '85% Prediction' },
  { label: 'Personalization', value: 55, metric: '+70% Conversion' },
  { label: 'AEO', value: 50, metric: '84% Book Likelihood' },
];

export default function TravelROIChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-[#F1EEEA] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white border border-[#D4D4D4] p-8 lg:p-12">
            <div className="mb-2">
              <span className="font-['Lora'] text-xs text-[#696969] uppercase tracking-wider">
                EXHIBIT 9
              </span>
            </div>
            <h3 className="font-['Playfair_Display'] text-2xl lg:text-3xl text-[#212427] mb-12">
              Travel AI ROI by Application Area
            </h3>

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
                      {item.label}
                    </span>
                    <div className="flex-1 bg-[#F2F2F2] h-8 relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${item.value}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                        className="bg-[#7EF473] h-full"
                      />
                    </div>
                    <span className="font-['Lora'] text-sm text-[#212427] w-40 text-right">
                      {item.metric}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
