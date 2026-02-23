'use client';

import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';

const tabs = [
  { id: 'journey', label: 'Traveler Journey AI' },
  { id: 'implementation', label: 'Implementation Path' },
  { id: 'business', label: 'Business Model Focus' },
];

export default function TravelFramework() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeTab, setActiveTab] = useState('journey');

  return (
    <section ref={ref} className="bg-[#F1EEEA] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#212427] mb-8">
            Framework
          </h2>

          {/* Tabs */}
          <div className="flex flex-wrap gap-4 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-['Lora'] text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#7EF473] text-[#212427]'
                    : 'bg-white text-[#696969] hover:bg-[#F2F2F2]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-[#D4D4D4] p-8 lg:p-12"
        >
          {activeTab === 'journey' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {[
                  {
                    title: 'INSPIRATION',
                    subtitle: 'AI DISCOVERY',
                    items: ['Personalized destination suggestions', 'AEO-ready content'],
                  },
                  {
                    title: 'PLANNING',
                    subtitle: 'AI ITINERARY PLANNER',
                    items: ['Multi-stop itineraries', 'Budget optimization'],
                  },
                  {
                    title: 'BOOKING',
                    subtitle: 'DYNAMIC PRICING ENGINE',
                    items: ['Demand-based pricing', 'Competitor analysis'],
                  },
                  {
                    title: 'EXPERIENCE',
                    subtitle: 'REAL-TIME TRAVEL ASSISTANT',
                    items: ['Disruption management', 'Auto-rebooking', '24/7 chat support'],
                  },
                  {
                    title: 'POST-TRIP',
                    subtitle: 'AI LOYALTY ENGINE',
                    items: ['Personalized rewards', 'Review generation', 'Re-engagement'],
                  },
                ].map((stage, index) => (
                  <div key={index} className="border border-[#D4D4D4] p-6">
                    <h3 className="font-['Lora'] text-xs text-[#212427] uppercase tracking-wider mb-2">
                      {stage.title}
                    </h3>
                    <p className="font-['Playfair_Display'] text-lg text-[#7EF473] mb-4">
                      {stage.subtitle}
                    </p>
                    <ul className="space-y-2">
                      {stage.items.map((item, idx) => (
                        <li key={idx} className="font-['Lora'] text-sm text-[#696969]">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'implementation' && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                {
                  number: '①',
                  title: 'Travel Ops Audit',
                  items: ['Booking flows', 'CRM systems', 'Support channels'],
                },
                {
                  number: '②',
                  title: 'Data & Systems Connect',
                  items: ['GDS integration', 'PMS connection', 'Channel manager', 'CRM link'],
                },
                {
                  number: '③',
                  title: 'AI Agent Deploy',
                  items: ['Chatbot launch', 'Pricing engine', 'Itinerary agents'],
                },
                {
                  number: '④',
                  title: 'Shadow Mode',
                  items: ['AI runs alongside', 'Existing systems', 'Performance tracking'],
                },
                {
                  number: '⑤',
                  title: 'Scale & Automate',
                  items: ['Full agentic deployment', 'End-to-end automation'],
                },
              ].map((phase, index) => (
                <div key={index} className="border border-[#D4D4D4] p-6">
                  <div className="font-['Playfair_Display'] text-3xl text-[#7EF473] mb-3">
                    {phase.number}
                  </div>
                  <h3 className="font-['Playfair_Display'] text-xl text-[#212427] mb-4">
                    {phase.title}
                  </h3>
                  <ul className="space-y-2">
                    {phase.items.map((item, idx) => (
                      <li key={idx} className="font-['Lora'] text-sm text-[#696969]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'business' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'OTA / BOOKING',
                  items: [
                    { label: '1. Dynamic Pricing', impact: '→ +10-20% rev' },
                    { label: '2. AI Chatbot', impact: '→ 80% auto' },
                    { label: '3. Personalization', impact: '→ +70% CVR' },
                    { label: '4. Fraud Detection', impact: '→ -40% losses' },
                  ],
                  timeline: 'TIMELINE: 8-14 wk',
                },
                {
                  title: 'TOUR OPERATOR',
                  items: [
                    { label: '1. AI Itinerary Generator', impact: '' },
                    { label: '2. WhatsApp Travel Assistant', impact: '' },
                    { label: '3. Disruption Mgmt', impact: '→ Auto-rebook' },
                    { label: '4. Dynamic Pricing', impact: '→ Package optim' },
                  ],
                  timeline: 'TIMELINE: 8-16 wk',
                },
                {
                  title: 'DMO / DESTINATION',
                  items: [
                    { label: '1. AI Content Gen', impact: '→ Scale content' },
                    { label: '2. Personalization', impact: '→ +25% bookings' },
                    { label: '3. AEO Strategy', impact: '→ AI visibility' },
                    { label: '4. Demand Forecast', impact: '→ Visitor intel' },
                  ],
                  timeline: 'TIMELINE: 6-12 wk',
                },
              ].map((model, index) => (
                <div key={index} className="border border-[#D4D4D4] p-8">
                  <h3 className="font-['Playfair_Display'] text-2xl text-[#212427] mb-6">
                    {model.title}
                  </h3>
                  <div className="space-y-4 mb-6">
                    {model.items.map((item, idx) => (
                      <div key={idx}>
                        <p className="font-['Lora'] text-[#212427]">{item.label}</p>
                        {item.impact && (
                          <p className="font-['Lora'] text-sm text-[#7EF473]">{item.impact}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="font-['Lora'] text-sm text-[#696969] uppercase tracking-wider">
                    {model.timeline}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
