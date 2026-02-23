'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';

const tabs = [
  { id: 'direction', label: 'Set the Direction' },
  { id: 'journey', label: 'Define the Customer Journey' },
  { id: 'timeline', label: 'Deploy & Scale Timeline' },
];

const frameworkData = {
  direction: [
    {
      number: '①',
      title: 'Store & Data Audit',
      description: 'Map data sources, conversion gaps, segments',
    },
    {
      number: '②',
      title: 'AI Model Selection',
      description: 'Choose personalize, fraud, rec models for your catalog',
    },
    {
      number: '③',
      title: 'Platform Integration',
      description: 'Shopify, Stripe, Klaviyo, WhatsApp API native',
    },
    {
      number: '④',
      title: 'Pilot & Validate',
      description: 'Split traffic A/B test conversion, AOV, revenue',
    },
    {
      number: '⑤',
      title: 'Scale & Optimize',
      description: 'All channels continuous learning loop',
    },
  ],
  journey: [
    {
      number: '①',
      title: 'AWARENESS',
      description: 'AI-powered SEO, Answer Engine Optimization social targeting',
    },
    {
      number: '②',
      title: 'DISCOVERY',
      description: 'Visual search, personalized browsing, AI recs',
    },
    {
      number: '③',
      title: 'CONSIDERATION',
      description: 'Conversational commerce, reviews AI, social proof',
    },
    {
      number: '④',
      title: 'PURCHASE',
      description: 'Smart checkout, fraud detection, cart recovery',
    },
    {
      number: '⑤',
      title: 'LOYALTY',
      description: 'Post-purchase nurture, re-engage, CLV optimization',
    },
  ],
  timeline: [
    {
      number: 'WEEKS 1–4',
      title: 'QUICK WINS',
      description: '• Cart recovery\n• Email automation\n\nROI: 1–2 mo',
    },
    {
      number: 'WEEKS 4–8',
      title: 'CORE PLATFORM',
      description: '• Personalization engine\n• Visual search\n\nROI: 3–6 mo',
    },
    {
      number: 'WEEKS 8–12',
      title: 'ADVANCED AI',
      description: '• Conversational commerce\n• Fraud detection\n• A/B tuning\n\nROI: 6–12 mo',
    },
    {
      number: 'ONGOING',
      title: 'AUTONOMOUS',
      description: '• Self-improving AI agents\n• End-to-end management\n\nContinuous',
    },
  ],
};

export default function EcommerceFramework() {
  const [activeTab, setActiveTab] = useState('direction');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-[#FAF8F6] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-4 mb-12 border-b border-gray-300">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-['Lora'] text-base transition-all duration-300 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#84CC16] text-[#0F3D3E] font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Framework Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-gray-300 p-8 lg:p-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-4">
                {frameworkData[activeTab as keyof typeof frameworkData].map((step, index) => (
                  <div key={index} className="relative">
                    {/* Step Card */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-center w-12 h-12 border-2 border-[#84CC16] text-[#84CC16] font-['Playfair_Display'] text-2xl">
                        {step.number}
                      </div>
                      <h3 className="font-['Playfair_Display'] text-lg text-[#0F3D3E]">
                        {step.title}
                      </h3>
                      <p className="font-['Lora'] text-sm leading-relaxed text-gray-600 whitespace-pre-line">
                        {step.description}
                      </p>
                    </div>

                    {/* Arrow (except last item) */}
                    {index < frameworkData[activeTab as keyof typeof frameworkData].length - 1 && (
                      <div className="hidden lg:block absolute top-6 -right-2 transform translate-x-full">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M1 8h14M9 1l7 7-7 7"
                            stroke="#84CC16"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}