// C-F02 — Fashion Industry Stats
// BCG design system: white bg, charcoal text, Georgia serif, green accents, 4px radius

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const stats = [
  { label: 'AI Profit Potential', value: '$275B', context: 'McKinsey projection for fashion industry' },
  { label: 'AI Adoption Rate', value: '44%', context: 'Up from 20% in H1 2025 alone' },
  { label: 'Fashion AI Market CAGR', value: '40.8%', context: 'Fastest-growing AI vertical market' },
  { label: 'Return Reduction (Try-On)', value: '-25%', context: 'Virtual try-on impact on return rates' },
];

export default function FashionStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="border-t" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E8E4' }}>
      <div className="max-w-[1120px] mx-auto px-6 py-20 lg:py-28">
        {/* Exhibit Label */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
            Exhibit 1
          </p>
          <h2 className="text-3xl lg:text-4xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            Industry Analysis — Key Stats
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="border p-7"
              style={{ borderColor: '#E8E8E4', backgroundColor: '#F5F5F0', borderRadius: '4px' }}
            >
              <div className="mb-4">
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>
                  {stat.label}
                </p>
                <p className="text-4xl" style={{ fontFamily: 'Georgia, serif', color: '#00875A' }}>
                  {stat.value}
                </p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#6B6B63' }}>
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
          className="mt-14 pt-8 border-t"
          style={{ borderColor: '#E8E8E4' }}
        >
          <div className="text-sm space-y-2.5" style={{ color: '#6B6B63', lineHeight: 1.7 }}>
            <p><span style={{ color: '#00875A' }}>&#8226;</span> 74% of fashion brands now use AI-based forecasting (BoF/McKinsey State of Fashion 2026)</p>
            <p><span style={{ color: '#00875A' }}>&#8226;</span> Fashion returns cost the industry $800B+ annually — AI sizing cuts returns 17-25%</p>
            <p><span style={{ color: '#00875A' }}>&#8226;</span> AI can reduce design cycles from 12 weeks to under 1 week</p>
            <p><span style={{ color: '#00875A' }}>&#8226;</span> Overproduction accounts for 10% of global CO₂ — AI trend prediction reduces it 20-30%</p>
            <p><span style={{ color: '#00875A' }}>&#8226;</span> The global AI in fashion market is projected to reach $4.4B by 2027</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
