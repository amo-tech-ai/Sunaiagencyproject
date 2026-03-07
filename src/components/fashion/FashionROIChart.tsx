// C-F07 — Fashion ROI Chart
// BCG design system: white bg, charcoal bars, Georgia serif, green accents, 4px radius

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
    <section ref={ref} className="border-t" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E8E4' }}>
      <div className="max-w-[1120px] mx-auto px-6 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
            Exhibit 3
          </p>
          <h2 className="text-3xl lg:text-4xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            Fashion AI Impact by Application Area
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="border p-8 lg:p-10"
          style={{ backgroundColor: '#F5F5F0', borderColor: '#E8E8E4', borderRadius: '4px' }}
        >
          <div className="space-y-6">
            {chartData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm w-40" style={{ color: '#1A1A1A' }}>
                    {item.name}
                  </span>
                  <div className="flex-1 h-7 relative border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E8E4', borderRadius: '2px' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${item.value}%` } : { width: 0 }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                      className="h-full"
                      style={{ backgroundColor: '#00875A', borderRadius: '2px' }}
                    />
                  </div>
                  <span className="text-sm w-40 text-right" style={{ color: '#1A1A1A' }}>
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
