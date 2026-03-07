// C-F08 — Fashion AI Value Chain
// BCG design system: off-white bg, charcoal text, Georgia serif, green accents, 4px radius

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const valueChainStages = [
  { stage: 'Design', applications: ['AI Design Generation', 'Mood Boards', 'Colorway Variants'], impact: '10x Faster' },
  { stage: 'Source', applications: ['Trend Forecast', 'Supplier Matching', 'Sustainability'], impact: '-30% Waste' },
  { stage: 'Produce', applications: ['Demand Planning', 'Quality Control', 'Waste Reduction'], impact: '-20% Costs' },
  { stage: 'Distribute', applications: ['Inventory Optimiz.', 'Route Optimiz.', 'Demand Forecast'], impact: '-15% Logistics' },
  { stage: 'Sell', applications: ['Virtual Try-On', 'Personal Stylist', 'Complete the Look'], impact: '+26% AOV' },
  { stage: 'Post-Sale', applications: ['Size Predict', 'Returns Mgmt', 'Resale Pricing'], impact: '-25% Returns' },
];

export default function FashionValueChain() {
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
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
            Exhibit 4
          </p>
          <h2 className="text-3xl lg:text-4xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            Fashion AI Value Chain — Where AI Creates Value
          </h2>
        </motion.div>

        {/* Value Chain Stages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {valueChainStages.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: index * 0.08 }}
              className="border p-6 transition-colors hover:bg-[#FAFAF8]"
              style={{ borderColor: '#E8E8E4', backgroundColor: '#FFFFFF', borderRadius: '4px' }}
            >
              {/* Stage Header */}
              <div className="mb-5 pb-4 border-b" style={{ borderColor: '#E8E8E4' }}>
                <h3 className="text-xl mb-1" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
                  {item.stage}
                </h3>
                <p className="text-base" style={{ color: '#00875A' }}>{item.impact}</p>
              </div>

              {/* Applications */}
              <div className="space-y-2">
                {item.applications.map((app, idx) => (
                  <div key={idx} className="text-sm flex items-start" style={{ color: '#6B6B63' }}>
                    <span className="mr-2" style={{ color: '#00875A' }}>&#8226;</span>
                    <span>{app}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 text-center"
        >
          <p className="text-sm" style={{ color: '#6B6B63' }}>
            AI creates value at every stage of the fashion value chain — from initial design
            concepts through post-purchase customer experience.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
