'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const services = [
  {
    badge: 'HIGH DEMAND',
    badgeColor: 'bg-[#7EF473]',
    title: 'AI Travel Agent / Chatbot',
    description:
      'Conversational AI handling trip planning, booking inquiries, itinerary changes, cancellation requests, and real-time travel support — 24/7 in 40+ languages. A contextual agent that remembers preferences, accesses live pricing, and takes action.',
    features: ['24/7 Support', '40+ Languages', 'Booking Actions', 'Live Pricing', 'Contextual Memory'],
    roiLabel: 'Customer Queries Auto-Resolved',
    roiValue: '80%',
    example:
      'Kayak AI Mode powered by ChatGPT — users plan trips through conversation with real-time pricing. Trip.com AI assistant replans and rebooks automatically during disruptions. AI chatbots save travel industry $8B in call center costs by 2026.',
    cost: '$10K–$60K',
    timeToRoi: '1–3 months',
  },
  {
    badge: 'TOP ROI',
    badgeColor: 'bg-[#FF5B4D]',
    title: 'Dynamic Pricing Engine',
    description:
      'Monitors demand patterns, competitor rates, booking velocity, seasonality, local events, and customer price sensitivity → adjusts pricing continuously. Captures peak-demand value while staying competitive during lulls.',
    features: ['Demand Sensing', 'Competitor Watch', 'Yield Optimize', 'Micro-Segment', 'Real-Time'],
    roiLabel: 'Revenue Increase',
    roiValue: '10–20%',
    example:
      'Marriott AI dynamic pricing adjusts room rates in real time. Hotel revenue increases up to 20%, airline revenue per seat up to 5%. Profit margins improve 10-12% with AI revenue optimization.',
    cost: '$20K–$80K',
    timeToRoi: '3–6 months',
  },
  {
    badge: 'AGENTIC AI',
    badgeColor: 'bg-[#0E3E1B] text-white',
    title: 'AI Itinerary Generator',
    description:
      'Traveler describes preferences in natural language → AI generates complete multi-day itineraries with flights, hotels, activities, restaurants optimized for budget, time, and interests. Adapts dynamically as changes occur.',
    features: ['Natural Language', 'Multi-Modal', 'Budget Optimize', 'Dynamic Updates', 'Shoppable'],
    roiLabel: 'Planning Time Reduction',
    roiValue: '70%',
    example:
      'Mindtrip auto-updates itineraries as users make choices. Hopper predicts best time to buy. 63% of travelers who try AI planning use it for most or every trip afterward.',
    cost: '$15K–$50K',
    timeToRoi: '2–4 months',
  },
  {
    badge: 'ESSENTIAL',
    badgeColor: 'bg-[#0E3E1B] text-white',
    title: 'Disruption Management AI',
    description:
      'Monitors flight data, weather, airport capacity, traffic → detects disruptions before official announcement → proactively rebooks, adjusts itineraries, notifies travelers, offers alternatives.',
    features: ['Predictive Alerts', 'Auto-Rebook', 'Proactive Notify', 'Multi-Carrier', '85% Accuracy'],
    roiLabel: 'Delay Prediction Accuracy',
    roiValue: '85%',
    example:
      'American Airlines AI-based rebooking — passengers rebook instantly via app without queuing. AI predicts delays 85% accurately 2 hours before announcement. Airlines reduce churn 20%.',
    cost: '$25K–$100K',
    timeToRoi: '3–6 months',
  },
  {
    badge: 'PROVEN ROI',
    badgeColor: 'bg-[#7EF473]',
    title: 'Traveler Personalization Engine',
    description:
      'Analyzes past bookings, browsing, preferences, travel purpose, demographics → personalized destinations, hotels, activities, pricing. Every touchpoint curated for the individual.',
    features: ['Behavioral ML', 'Cross-Channel', 'Upsell AI', 'Loyalty Integration', 'A/B Auto'],
    roiLabel: 'Conversion Rate Increase',
    roiValue: '+70%',
    example:
      'AI personalization increases travel conversion by up to 70%. Repeat bookings up 25%. 82% of airlines use AI for personalization. 80% of travelers willing to share data for customized experiences.',
    cost: '$15K–$60K',
    timeToRoi: '2–4 months',
  },
  {
    badge: 'CRITICAL 2026',
    badgeColor: 'bg-[#FF5B4D]',
    title: 'Answer Engine Optimization (AEO)',
    description:
      'Structures your destination, property, and experience data so AI agents — ChatGPT, Copilot, Gemini, Perplexity — can discover, understand, and recommend your offerings. SEO for the AI age.',
    features: ['AEO Strategy', 'Structured Data', 'Agent-Ready', 'Schema Markup', 'AI Visibility'],
    roiLabel: 'AI-Booked Likelihood',
    roiValue: '84%',
    example:
      '84% of travelers say trusted AI recommendation increases booking likelihood. Sam Altman stated travelers will book hotels in one click through ChatGPT. Properties not in AI recommendations are losing bookings now.',
    cost: '$8K–$30K',
    timeToRoi: '2–4 months',
  },
];

export default function TravelServices() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#212427]">
            Travel AI Services
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="border border-[#D4D4D4] bg-[#F1EEEA] p-8"
            >
              {/* Badge */}
              <div className="mb-6">
                <span className={`inline-block px-3 py-1 ${service.badgeColor} font-['Lora'] text-xs tracking-wider uppercase`}>
                  {service.badge}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-['Playfair_Display'] text-2xl lg:text-3xl text-[#212427] mb-4">
                {service.title}
              </h3>

              {/* Description */}
              <p className="font-['Lora'] text-[#696969] leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-6">
                {service.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="font-['Lora'] text-xs text-[#696969] px-3 py-1 border border-[#D4D4D4] bg-white"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* ROI Metric */}
              <div className="border border-[#D4D4D4] bg-white p-6 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-['Lora'] text-sm text-[#696969]">{service.roiLabel}</span>
                  <span className="font-['Playfair_Display'] text-3xl text-[#7EF473]">
                    {service.roiValue}
                  </span>
                </div>
              </div>

              {/* Real-World Example */}
              <div className="mb-6">
                <h4 className="font-['Lora'] text-sm text-[#212427] uppercase tracking-wider mb-3">
                  Real-World Example
                </h4>
                <p className="font-['Lora'] text-sm text-[#696969] leading-relaxed">
                  {service.example}
                </p>
              </div>

              {/* Cost & Timeline */}
              <div className="flex justify-between items-center pt-6 border-t border-[#D4D4D4]">
                <div>
                  <p className="font-['Lora'] text-xs text-[#696969] uppercase tracking-wider mb-1">
                    Build Cost
                  </p>
                  <p className="font-['Lora'] text-sm text-[#212427]">{service.cost}</p>
                </div>
                <div className="text-right">
                  <p className="font-['Lora'] text-xs text-[#696969] uppercase tracking-wider mb-1">
                    Time to ROI
                  </p>
                  <p className="font-['Lora'] text-sm text-[#212427]">{service.timeToRoi}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
