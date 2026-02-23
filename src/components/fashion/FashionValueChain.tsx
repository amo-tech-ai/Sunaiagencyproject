'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const valueChainStages = [
  {
    stage: 'DESIGN',
    applications: ['AI Design Generation', 'Mood Boards', 'Colorway Variants'],
    impact: '10x Faster',
  },
  {
    stage: 'SOURCE',
    applications: ['Trend Forecast', 'Supplier Matching', 'Sustainability'],
    impact: '-30% Waste',
  },
  {
    stage: 'PRODUCE',
    applications: ['Demand Planning', 'Quality Control', 'Waste Reduction'],
    impact: '-20% Costs',
  },
  {
    stage: 'DISTRIBUTE',
    applications: ['Inventory Optimiz.', 'Route Optimiz.', 'Demand Forecast'],
    impact: '-15% Logistics',
  },
  {
    stage: 'SELL',
    applications: ['Virtual Try-On', 'Personal Stylist', 'Complete the Look'],
    impact: '+26% AOV',
  },
  {
    stage: 'POST-SALE',
    applications: ['Size Predict', 'Returns Mgmt', 'Resale Pricing'],
    impact: '-25% Returns',
  },
];

export default function FashionValueChain() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-[#F1EEEA] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="text-xs tracking-wider text-[#696969] uppercase font-['Lora'] mb-2">
            EXHIBIT 4
          </p>
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#212427]">
            Fashion AI Value Chain — Where AI Creates Value
          </h2>
        </motion.div>

        {/* Value Chain Stages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {valueChainStages.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="border border-[#D4D4D4] bg-white p-6 hover:bg-[#F2F2F2] transition-colors duration-300"
            >
              {/* Stage Header */}
              <div className="mb-6 pb-4 border-b border-[#D4D4D4]">
                <h3 className="font-['Playfair_Display'] text-2xl text-[#212427] mb-2">
                  {item.stage}
                </h3>
                <p className="font-['Lora'] text-lg text-[#0A211F]">{item.impact}</p>
              </div>

              {/* Applications */}
              <div className="space-y-2">
                {item.applications.map((app, idx) => (
                  <div
                    key={idx}
                    className="font-['Lora'] text-sm text-[#696969] flex items-start"
                  >
                    <span className="text-[#0A211F] mr-2">•</span>
                    <span>{app}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Flow Arrows */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="font-['Lora'] text-base text-[#696969]">
            AI creates value at every stage of the fashion value chain — from initial design 
            concepts through post-purchase customer experience.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
