// C-T05 — Travel Framework (3-tab)
// BCG design system: off-white bg, charcoal text, Georgia serif, green accents, 4px radius

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
    <section ref={ref} className="border-t" style={{ backgroundColor: '#F5F5F0', borderColor: '#E8E8E4' }}>
      <div className="max-w-[1120px] mx-auto px-6 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          <h2 className="text-3xl lg:text-4xl mb-8" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            Framework
          </h2>

          {/* Tabs */}
          <div className="flex flex-wrap gap-3">
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
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border p-8 lg:p-10"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E8E4', borderRadius: '4px' }}
        >
          {activeTab === 'journey' && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
              {[
                { title: 'Inspiration', subtitle: 'AI Discovery', items: ['Personalized destination suggestions', 'AEO-ready content'] },
                { title: 'Planning', subtitle: 'AI Itinerary Planner', items: ['Multi-stop itineraries', 'Budget optimization'] },
                { title: 'Booking', subtitle: 'Dynamic Pricing Engine', items: ['Demand-based pricing', 'Competitor analysis'] },
                { title: 'Experience', subtitle: 'Real-Time Travel Assistant', items: ['Disruption management', 'Auto-rebooking', '24/7 chat support'] },
                { title: 'Post-Trip', subtitle: 'AI Loyalty Engine', items: ['Personalized rewards', 'Review generation', 'Re-engagement'] },
              ].map((stage, index) => (
                <div key={index} className="border p-5" style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}>
                  <h3 className="text-xs uppercase tracking-widest mb-2" style={{ color: '#1A1A1A', letterSpacing: '0.06em' }}>{stage.title}</h3>
                  <p className="text-base mb-3" style={{ fontFamily: 'Georgia, serif', color: '#00875A' }}>{stage.subtitle}</p>
                  <ul className="space-y-1.5">
                    {stage.items.map((item, idx) => (
                      <li key={idx} className="text-sm" style={{ color: '#6B6B63' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'implementation' && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
              {[
                { number: '01', title: 'Travel Ops Audit', items: ['Booking flows', 'CRM systems', 'Support channels'] },
                { number: '02', title: 'Data & Systems Connect', items: ['GDS integration', 'PMS connection', 'Channel manager', 'CRM link'] },
                { number: '03', title: 'AI Agent Deploy', items: ['Chatbot launch', 'Pricing engine', 'Itinerary agents'] },
                { number: '04', title: 'Shadow Mode', items: ['AI runs alongside', 'Existing systems', 'Performance tracking'] },
                { number: '05', title: 'Scale & Automate', items: ['Full agentic deployment', 'End-to-end automation'] },
              ].map((phase, index) => (
                <div key={index} className="border p-5" style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}>
                  <div className="text-2xl mb-2" style={{ fontFamily: 'Georgia, serif', color: '#00875A' }}>{phase.number}</div>
                  <h3 className="text-lg mb-3" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>{phase.title}</h3>
                  <ul className="space-y-1.5">
                    {phase.items.map((item, idx) => (
                      <li key={idx} className="text-sm" style={{ color: '#6B6B63' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'business' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  title: 'OTA / Booking',
                  items: [
                    { label: '1. Dynamic Pricing', impact: '+10-20% rev' },
                    { label: '2. AI Chatbot', impact: '80% auto' },
                    { label: '3. Personalization', impact: '+70% CVR' },
                    { label: '4. Fraud Detection', impact: '-40% losses' },
                  ],
                  timeline: 'Timeline: 8-14 wk',
                },
                {
                  title: 'Tour Operator',
                  items: [
                    { label: '1. AI Itinerary Generator', impact: '' },
                    { label: '2. WhatsApp Travel Assistant', impact: '' },
                    { label: '3. Disruption Mgmt', impact: 'Auto-rebook' },
                    { label: '4. Dynamic Pricing', impact: 'Package optim' },
                  ],
                  timeline: 'Timeline: 8-16 wk',
                },
                {
                  title: 'DMO / Destination',
                  items: [
                    { label: '1. AI Content Gen', impact: 'Scale content' },
                    { label: '2. Personalization', impact: '+25% bookings' },
                    { label: '3. AEO Strategy', impact: 'AI visibility' },
                    { label: '4. Demand Forecast', impact: 'Visitor intel' },
                  ],
                  timeline: 'Timeline: 6-12 wk',
                },
              ].map((model, index) => (
                <div key={index} className="border p-7" style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}>
                  <h3 className="text-xl mb-5" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>{model.title}</h3>
                  <div className="space-y-3 mb-5">
                    {model.items.map((item, idx) => (
                      <div key={idx}>
                        <p className="text-sm" style={{ color: '#1A1A1A' }}>{item.label}</p>
                        {item.impact && <p className="text-xs" style={{ color: '#00875A' }}>{item.impact}</p>}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs tracking-widest uppercase" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>{model.timeline}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
