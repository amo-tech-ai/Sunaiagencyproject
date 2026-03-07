// C-T03 — Travel Stats
// BCG design system: off-white bg, charcoal text, Georgia serif, green values, 4px radius

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const stats = [
  { label: 'AI Travel Market', value: '$12B', context: 'Projected global market by 2026' },
  { label: 'Travelers Using AI', value: '86%', context: 'Have used AI to find or book accommodations' },
  { label: 'Revenue Increase', value: '10-20%', context: 'From AI-powered dynamic pricing' },
  { label: 'Support Cost Cut', value: '$8B', context: 'Global savings from AI call center automation by 2026' },
];

export default function TravelStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="border-t" style={{ backgroundColor: '#F5F5F0', borderColor: '#E8E8E4' }}>
      <div className="max-w-[1120px] mx-auto px-6 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          <h2 className="text-3xl lg:text-4xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            Industry Analysis — Key Stats
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="border p-7"
              style={{ borderColor: '#E8E8E4', backgroundColor: '#FFFFFF', borderRadius: '4px' }}
            >
              <div className="mb-4">
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>{stat.label}</p>
                <p className="text-4xl" style={{ fontFamily: 'Georgia, serif', color: '#00875A' }}>{stat.value}</p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#6B6B63' }}>{stat.context}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
