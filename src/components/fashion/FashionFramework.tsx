// C-F05 — Fashion AI Framework (Tabbed)
// BCG design system: off-white bg, charcoal text, Georgia serif, green accents, 4px radius

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';

const tabs = [
  { id: 'audit', label: 'Brand & Style Audit' },
  { id: 'implementation', label: 'AI Implementation' },
  { id: 'measure', label: 'Measure & Scale' },
];

const frameworkData = {
  audit: [
    { number: '01', title: 'Visual DNA Mapping', description: 'Catalog structure, sizing, brand identity' },
    { number: '02', title: 'Customer Journey', description: 'Discovery, try-on, purchase, returns path mapped' },
    { number: '03', title: 'Data Readiness', description: 'Product attributes, images, measurements assessed' },
    { number: '04', title: 'AI Opportunity', description: 'Prioritized use cases ranked by ROI and feasibility' },
  ],
  implementation: [
    { number: '01', title: 'Computer Vision', description: 'Train models on your garments, fabrics' },
    { number: '02', title: 'Catalog & PLM', description: 'Product data enrichment + lifecycle management integration' },
    { number: '03', title: 'Storefront Deploy', description: 'Virtual try-on + AI stylist on digital channels' },
    { number: '04', title: 'Trend Engine', description: 'Social scanning + demand prediction activated' },
  ],
  measure: [
    { number: 'R', title: 'Returns Tracking', description: 'Size-related returns measured pre/post AI' },
    { number: 'R', title: 'Revenue Impact', description: 'AOV, CVR, CLV attribution by AI feature' },
    { number: 'W', title: 'Waste Reduction', description: 'Overproduction and markdown metrics tracked' },
    { number: 'E', title: 'Expand & Evolve', description: 'New categories, markets, channels added' },
  ],
};

export default function FashionFramework() {
  const [activeTab, setActiveTab] = useState('audit');
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
            Exhibit 2
          </p>
          <h2 className="text-3xl lg:text-4xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            Our Fashion AI Framework
          </h2>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-10"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-5 py-2.5 text-sm transition-colors"
              style={{
                backgroundColor: activeTab === tab.id ? '#1A1A1A' : '#FFFFFF',
                color: activeTab === tab.id ? '#FFFFFF' : '#6B6B63',
                border: activeTab === tab.id ? '1px solid #1A1A1A' : '1px solid #E8E8E4',
                borderRadius: '4px',
              }}
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
            className="border p-8 lg:p-10"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E8E4', borderRadius: '4px' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {frameworkData[activeTab as keyof typeof frameworkData].map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="text-3xl" style={{ fontFamily: 'Georgia, serif', color: '#00875A' }}>
                    {item.number}
                  </div>
                  <h3 className="text-lg" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B6B63' }}>
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
