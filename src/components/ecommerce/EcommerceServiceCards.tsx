'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const services = [
  {
    number: '01',
    badge: { text: 'HIGH DEMAND', color: 'bg-[#84CC16]' },
    title: 'Hyper-Personalization Engine',
    description:
      'Every customer sees a unique homepage, product order, and pricing — dynamically generated from real-time behavior signals. Not segments. Not cohorts. Individual-level personalization that feels like the store was built just for them.',
    features: ['Real-Time ML', 'Behavioral', 'CLV Boost', 'Dynamic UI'],
    roiLabel: 'Revenue Increase (Leaders)',
    roiValue: '+40%',
    example:
      'Sessions with AI personalization show 369% higher AOV. Fast-growing companies derive 40% more revenue from personalization than their peers. McKinsey finds that 71% of consumers expect personalized interactions — and 76% get frustrated when they don\'t get them.',
    buildCost: '$30K–$100K',
    timeToROI: '3–6 months',
  },
  {
    number: '02',
    badge: { text: 'QUICK WIN', color: 'bg-purple-600' },
    title: 'AI Cart Recovery Agent',
    description:
      'Detects abandonment intent in real time — then sends perfectly-timed WhatsApp, email, or SMS with a personalized incentive. Not a generic "you left something behind" email. A smart agent that knows what discount will convert this specific customer, on which channel, at what time.',
    features: ['WhatsApp', 'Email', 'SMS', 'Auto-Discount', 'Intent Detection'],
    roiLabel: 'Cart Conversion Rate',
    roiValue: '33.8%',
    example:
      'Snow (DTC skincare) used Rep AI\'s cart recovery agent → achieved 33.85% conversion on abandoned carts, recovering $220K+ in revenue. WhatsApp messages achieve 45% open rate vs 20% for email.',
    buildCost: '$5K–$25K',
    timeToROI: '1–2 months',
  },
  {
    number: '03',
    badge: { text: '2026 TREND', color: 'bg-blue-600' },
    title: 'Conversational Commerce',
    description:
      'AI shopping assistant embedded inside messaging apps. Customers browse, compare, ask questions, and purchase — all without leaving the chat. The checkout happens inside the conversation. Zero redirects, zero friction, zero abandoned carts from page-load drops.',
    features: ['Chat-to-Buy', 'Copilot Checkout', 'Voice', 'Multi-Platform'],
    roiLabel: 'Satisfaction vs Traditional',
    roiValue: '+85%',
    example:
      'Microsoft Copilot Checkout launched January 2026 — customers can buy from Urban Outfitters, Etsy, and other retailers directly inside Copilot. No redirect to the merchant\'s website. OpenAI partnered with Target to enable shopping entirely within ChatGPT.',
    buildCost: '$25K–$80K',
    timeToROI: '3–6 months',
  },
  {
    number: '04',
    badge: { text: 'PROVEN ROI', color: 'bg-orange-600' },
    title: 'AI Email & SMS Automation',
    description:
      'Behavioral triggers, micro-segmented campaigns, AI-written subject lines, and send-time prediction. Every message is optimized for the individual recipient. The system runs A/B tests automatically, learns from results, and improves continuously without manual intervention.',
    features: ['Triggered Flows', 'Segmentation', 'A/B Auto', 'Send-Time AI'],
    roiLabel: 'Revenue per Recipient vs Batch',
    roiValue: '30x',
    example:
      'Klaviyo analyzed 325 billion+ emails and found that 77% of email ROI comes from AI-triggered campaigns, not batch sends. Triggered flows generate 30x more revenue per recipient. The system essentially writes, sends, and optimizes itself.',
    buildCost: '$3K–$15K',
    timeToROI: '1–2 months',
  },
  {
    number: '05',
    badge: { text: 'GROWING FAST', color: 'bg-[#84CC16]' },
    title: 'Visual Search & Discovery',
    description:
      'Customers snap a photo or upload an image → AI instantly finds matching products from your catalog. "Shop the look" from any social media post or street photo. AR try-on integration ready for fashion, beauty, and home categories.',
    features: ['Image Search', 'Shop the Look', 'AR Ready', 'Social Integration'],
    roiLabel: 'Holiday AI Traffic Surge',
    roiValue: '693%',
    example:
      'Adobe reported that AI-driven ecommerce traffic surged 693% during the 2025 holiday season. Visual search is becoming the primary product discovery method for Gen Z and Millennial shoppers. Pinterest Lens processes 600M+ visual searches per month.',
    buildCost: '$15K–$50K',
    timeToROI: '2–4 months',
  },
  {
    number: '06',
    badge: { text: 'ESSENTIAL', color: 'bg-blue-600' },
    title: 'AI Fraud Detection',
    description:
      'Scores every transaction in real time using behavioral biometrics, device fingerprinting, and purchase pattern analysis. Detects anomalies, prevents account takeover, and predicts chargebacks before they happen. Critical as AI shopping agents increase transaction volume.',
    features: ['Real-Time Scoring', 'Behavioral Biometrics', 'Chargeback AI'],
    roiLabel: 'False Positive Reduction',
    roiValue: '-60%',
    example:
      'AI fraud systems catch 40% more fraud while reducing false positives by 60% — meaning fewer legitimate customers get blocked. As AI agents begin making purchases autonomously, transaction velocity increases dramatically, making real-time scoring non-negotiable.',
    buildCost: '$15K–$50K',
    timeToROI: '2–4 months',
  },
];

export default function EcommerceServiceCards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative border border-gray-300 p-8 lg:p-10 hover:bg-gray-50 transition-colors duration-300"
            >
              {/* Large Faded Number */}
              <div className="absolute top-6 right-6 font-['Playfair_Display'] text-8xl text-gray-200 leading-none pointer-events-none">
                {service.number}
              </div>

              <div className="relative space-y-6">
                {/* Badge */}
                <span
                  className={`inline-block px-3 py-1 ${service.badge.color} text-white text-xs tracking-wider uppercase font-['Lora']`}
                >
                  {service.badge.text}
                </span>

                {/* Title */}
                <h3 className="font-['Playfair_Display'] text-2xl lg:text-3xl text-[#0F3D3E]">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="font-['Lora'] text-base leading-relaxed text-gray-700">
                  {service.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 border border-gray-300 text-xs text-gray-600 font-['Lora']"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* ROI Metric */}
                <div className="border-t border-gray-300 pt-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-['Lora'] text-sm text-gray-600">
                      {service.roiLabel}
                    </span>
                    <span className="font-['Playfair_Display'] text-3xl text-[#84CC16]">
                      {service.roiValue}
                    </span>
                  </div>
                </div>

                {/* Real-World Example */}
                <div className="border-l-2 border-[#84CC16] pl-4">
                  <p className="font-['Lora'] text-sm leading-relaxed text-gray-600">
                    {service.example}
                  </p>
                </div>

                {/* Cost & Timeline */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-['Lora']">
                      Build Cost
                    </p>
                    <p className="font-['Lora'] text-sm text-gray-700">{service.buildCost}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-['Lora']">
                      Time to ROI
                    </p>
                    <p className="font-['Lora'] text-sm text-gray-700">{service.timeToROI}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}