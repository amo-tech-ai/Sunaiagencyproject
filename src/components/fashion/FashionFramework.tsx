'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';

const tabs = [
  { id: 'audit', label: 'Brand & Style Audit' },
  { id: 'implementation', label: 'AI Implementation' },
  { id: 'measure', label: 'Measure & Scale' },
];

const frameworkData = {
  audit: [
    {
      number: '①',
      title: 'Visual DNA Mapping',
      description: 'Catalog structure, sizing, brand identity',
    },
    {
      number: '②',
      title: 'Customer Journey',
      description: 'Discovery, try-on, purchase, returns path mapped',
    },
    {
      number: '③',
      title: 'Data Readiness',
      description: 'Product attributes, images, measurements assessed',
    },
    {
      number: '④',
      title: 'AI Opportunity',
      description: 'Prioritized use cases ranked by ROI and feasibility',
    },
  ],
  implementation: [
    {
      number: '①',
      title: 'Computer Vision',
      description: 'Train models on your garments, fabrics',
    },
    {
      number: '②',
      title: 'Catalog & PLM',
      description: 'Product data enrichment + lifecycle management integration',
    },
    {
      number: '③',
      title: 'Storefront Deploy',
      description: 'Virtual try-on + AI stylist on digital channels',
    },
    {
      number: '④',
      title: 'Trend Engine',
      description: 'Social scanning + demand prediction activated',
    },
  ],
  measure: [
    {
      number: 'RETURNS',
      title: 'TRACKING',
      description: 'Size-related returns measured pre/post AI',
    },
    {
      number: 'REVENUE',
      title: 'IMPACT',
      description: 'AOV, CVR, CLV attribution by AI feature',
    },
    {
      number: 'WASTE',
      title: 'REDUCTION',
      description: 'Overproduction and markdown metrics tracked',
    },
    {
      number: 'EXPAND',
      title: '& EVOLVE',
      description: 'New categories, markets, channels added',
    },
  ],
};

export default function FashionFramework() {
  const [activeTab, setActiveTab] = useState('audit');
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
            EXHIBIT 2
          </p>
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#212427]">
            Our Fashion AI Framework
          </h2>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap gap-4 mb-12"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-['Lora'] text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#0A211F] text-white'
                  : 'bg-white text-[#696969] border border-[#D4D4D4] hover:bg-[#F2F2F2]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-[#D4D4D4] p-8 lg:p-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {frameworkData[activeTab as keyof typeof frameworkData].map((item, index) => (
                <div key={index} className="space-y-4">
                  <div className="font-['Playfair_Display'] text-4xl text-[#0A211F]">
                    {item.number}
                  </div>
                  <h3 className="font-['Playfair_Display'] text-xl text-[#212427]">
                    {item.title}
                  </h3>
                  <p className="font-['Lora'] text-sm text-[#696969] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
