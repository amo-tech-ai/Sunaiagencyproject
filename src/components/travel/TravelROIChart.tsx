// C-T07 — Travel ROI Chart
// BCG design system: off-white bg, green bars, Georgia serif, 4px radius

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
    <section ref={ref} className="border-t" style={{ backgroundColor: '#F5F5F0', borderColor: '#E8E8E4' }}>
      <div className="max-w-[1120px] mx-auto px-6 py-20 lg:py-28">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <div className="border p-8 lg:p-10" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E8E4', borderRadius: '4px' }}>
            <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#00875A', letterSpacing: '0.08em' }}>Exhibit 9</p>
            <h3 className="text-2xl lg:text-3xl mb-10" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
              Travel AI ROI by Application Area
            </h3>

            <div className="space-y-6">
              {chartData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -40 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm w-40" style={{ color: '#1A1A1A' }}>{item.label}</span>
                    <div className="flex-1 h-7 relative border" style={{ backgroundColor: '#F5F5F0', borderColor: '#E8E8E4', borderRadius: '2px' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${item.value}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                        className="h-full"
                        style={{ backgroundColor: '#00875A', borderRadius: '2px' }}
                      />
                    </div>
                    <span className="text-sm w-40 text-right" style={{ color: '#1A1A1A' }}>{item.metric}</span>
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
