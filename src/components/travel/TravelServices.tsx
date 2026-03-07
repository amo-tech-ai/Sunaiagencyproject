// C-T06 — Travel AI Services (6 cards)
// BCG design system: white bg, charcoal text, Georgia serif, green accents, 4px radius

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const services = [
  { badge: 'HIGH DEMAND', badgeBg: '#00875A', title: 'AI Travel Agent / Chatbot', description: 'Conversational AI handling trip planning, booking inquiries, itinerary changes, cancellation requests, and real-time travel support — 24/7 in 40+ languages.', features: ['24/7 Support', '40+ Languages', 'Booking Actions', 'Live Pricing', 'Contextual Memory'], roiLabel: 'Customer Queries Auto-Resolved', roiValue: '80%', example: 'Kayak AI Mode powered by ChatGPT — users plan trips through conversation with real-time pricing. AI chatbots save travel industry $8B in call center costs by 2026.', cost: '$10K–$60K', timeToRoi: '1–3 months' },
  { badge: 'TOP ROI', badgeBg: '#DC2626', title: 'Dynamic Pricing Engine', description: 'Monitors demand patterns, competitor rates, booking velocity, seasonality, local events → adjusts pricing continuously.', features: ['Demand Sensing', 'Competitor Watch', 'Yield Optimize', 'Micro-Segment', 'Real-Time'], roiLabel: 'Revenue Increase', roiValue: '10-20%', example: 'Marriott AI dynamic pricing adjusts room rates in real time. Hotel revenue increases up to 20%. Profit margins improve 10-12%.', cost: '$20K–$80K', timeToRoi: '3–6 months' },
  { badge: 'AGENTIC AI', badgeBg: '#1A1A1A', title: 'AI Itinerary Generator', description: 'Traveler describes preferences in natural language → AI generates complete multi-day itineraries with flights, hotels, activities optimized for budget, time, and interests.', features: ['Natural Language', 'Multi-Modal', 'Budget Optimize', 'Dynamic Updates', 'Shoppable'], roiLabel: 'Planning Time Reduction', roiValue: '70%', example: 'Mindtrip auto-updates itineraries as users make choices. 63% of travelers who try AI planning use it for most or every trip afterward.', cost: '$15K–$50K', timeToRoi: '2–4 months' },
  { badge: 'ESSENTIAL', badgeBg: '#1A1A1A', title: 'Disruption Management AI', description: 'Monitors flight data, weather, airport capacity → detects disruptions before official announcement → proactively rebooks and notifies travelers.', features: ['Predictive Alerts', 'Auto-Rebook', 'Proactive Notify', 'Multi-Carrier', '85% Accuracy'], roiLabel: 'Delay Prediction Accuracy', roiValue: '85%', example: 'American Airlines AI-based rebooking — passengers rebook instantly via app. AI predicts delays 85% accurately 2 hours before announcement.', cost: '$25K–$100K', timeToRoi: '3–6 months' },
  { badge: 'PROVEN ROI', badgeBg: '#00875A', title: 'Traveler Personalization Engine', description: 'Analyzes past bookings, browsing, preferences, travel purpose → personalized destinations, hotels, activities, pricing for every touchpoint.', features: ['Behavioral ML', 'Cross-Channel', 'Upsell AI', 'Loyalty Integration', 'A/B Auto'], roiLabel: 'Conversion Rate Increase', roiValue: '+70%', example: 'AI personalization increases travel conversion by up to 70%. Repeat bookings up 25%. 82% of airlines use AI for personalization.', cost: '$15K–$60K', timeToRoi: '2–4 months' },
  { badge: 'CRITICAL 2026', badgeBg: '#DC2626', title: 'Answer Engine Optimization (AEO)', description: 'Structures your destination and experience data so AI agents can discover, understand, and recommend your offerings. SEO for the AI age.', features: ['AEO Strategy', 'Structured Data', 'Agent-Ready', 'Schema Markup', 'AI Visibility'], roiLabel: 'AI-Booked Likelihood', roiValue: '84%', example: '84% of travelers say trusted AI recommendation increases booking likelihood. Properties not in AI recommendations are losing bookings now.', cost: '$8K–$30K', timeToRoi: '2–4 months' },
];

export default function TravelServices() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="border-t" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E8E4' }}>
      <div className="max-w-[1120px] mx-auto px-6 py-20 lg:py-28">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="mb-14">
          <h2 className="text-3xl lg:text-4xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>Travel AI Services</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.08 }}
              className="border p-8 transition-colors hover:bg-[#FAFAF8]"
              style={{ borderColor: '#E8E8E4', backgroundColor: '#F5F5F0', borderRadius: '4px' }}
            >
              {/* Badge */}
              <div className="mb-5">
                <span className="inline-block px-3 py-1 text-xs tracking-widest uppercase" style={{ backgroundColor: service.badgeBg, color: '#FFFFFF', borderRadius: '4px', letterSpacing: '0.06em' }}>
                  {service.badge}
                </span>
              </div>

              <h3 className="text-2xl mb-3" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>{service.title}</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#6B6B63' }}>{service.description}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-5">
                {service.features.map((f, idx) => (
                  <span key={idx} className="text-xs px-3 py-1 border" style={{ borderColor: '#E8E8E4', backgroundColor: '#FFFFFF', color: '#6B6B63', borderRadius: '4px' }}>{f}</span>
                ))}
              </div>

              {/* ROI */}
              <div className="border p-5 mb-5" style={{ borderColor: '#E8E8E4', backgroundColor: '#FFFFFF', borderRadius: '4px' }}>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#6B6B63' }}>{service.roiLabel}</span>
                  <span className="text-2xl" style={{ fontFamily: 'Georgia, serif', color: '#00875A' }}>{service.roiValue}</span>
                </div>
              </div>

              {/* Example */}
              <div className="mb-5">
                <h4 className="text-xs uppercase tracking-widest mb-2" style={{ color: '#1A1A1A', letterSpacing: '0.06em' }}>Real-World Example</h4>
                <p className="text-sm leading-relaxed" style={{ color: '#6B6B63' }}>{service.example}</p>
              </div>

              {/* Cost */}
              <div className="flex justify-between items-center pt-5 border-t" style={{ borderColor: '#E8E8E4' }}>
                <div>
                  <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>Build Cost</p>
                  <p className="text-sm" style={{ color: '#1A1A1A' }}>{service.cost}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>Time to ROI</p>
                  <p className="text-sm" style={{ color: '#1A1A1A' }}>{service.timeToRoi}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
