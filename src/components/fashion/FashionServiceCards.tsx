'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const services = [
  {
    number: '01',
    badge: { text: 'HIGH DEMAND', color: 'bg-[#0A211F] text-white' },
    title: 'AI Virtual Try-On',
    description:
      'Customer uploads a selfie → sees themselves wearing any garment with accurate fit visualization, fabric drape simulation, and AI-powered size recommendations. Works across brands, categories, and body types. Reduces the single biggest cost in fashion: returns.',
    features: ['Selfie Avatar', 'Fabric Simulation', 'Size AI', 'Multi-Brand', 'Body Inclusive'],
    roiLabel: 'Return Rate Reduction',
    roiValue: '-25%',
    example:
      'DressX Agent creates photorealistic avatars from selfies — customers can try on garments across 200+ luxury brands and 1M+ products. Returns reduced 17-25% in pilots. Google\'s virtual try-on now supports all body types from XXS to 4XL.',
    buildCost: '$40K–$120K',
    timeToROI: '6–12 months',
  },
  {
    number: '02',
    badge: { text: 'STRATEGIC', color: 'bg-[#FF5B4D] text-white' },
    title: 'AI Trend Forecasting',
    description:
      'Scans millions of social media images, runway show footage, street style photography, and search data → predicts colors, fabrics, prints, and silhouettes 18–24 months before they peak. Transforms buying decisions from gut feeling to data-backed confidence.',
    features: ['Social Scanning', '18–24mo Ahead', 'Demand Signals', 'Color Prediction'],
    roiLabel: 'Overproduction Reduction',
    roiValue: '-30%',
    example:
      'Heuritech analyzes millions of images from social media and streets to predict demand by color, fabric, and print. 74% of fashion brands now use AI-based demand forecasting. This directly attacks overproduction — fashion\'s biggest environmental and financial waste.',
    buildCost: '$25K–$80K',
    timeToROI: '3–6 months',
  },
  {
    number: '03',
    badge: { text: 'AI AGENTS', color: 'bg-[#0E3E1B] text-white' },
    title: 'AI Personal Stylist',
    description:
      'An evolving AI agent that learns body shape, style preferences, occasion needs, and lifestyle context. Not a recommendation engine — a true personal stylist that remembers, anticipates, and improves across every interaction. Works across 8,000+ brands.',
    features: ['Style Passport', '8,000+ Brands', 'Multimodal', 'Evolving Memory'],
    roiLabel: 'Recommendation Accuracy',
    roiValue: '99.8%',
    example:
      'Daydream launched agentic chat-based shopping across 8,000 brands + 200 retailers. Crescendo AI achieved 99.8% accuracy in fashion recommendations. These agents don\'t just filter — they style.',
    buildCost: '$25K–$80K',
    timeToROI: '3–6 months',
  },
  {
    number: '04',
    badge: { text: 'CREATIVE AI', color: 'bg-purple-700 text-white' },
    title: 'AI Design Generation',
    description:
      'Designers upload rough hand-drawn sketches or type text prompts → AI generates fully rendered fashion visuals, mood boards, colorway variations, and collection cohesion checks. Accelerates the creative process without replacing the creative vision.',
    features: ['Sketch-to-Render', 'Text-to-Design', 'Mood Boards', 'Collection Check'],
    roiLabel: 'Design Cycle Speedup',
    roiValue: '10x',
    example:
      'What used to take design teams weeks — rendering concepts, creating variations, testing colorways — now takes hours. AI generates 50+ design variations from a single sketch. Designers curate and refine rather than create from scratch every time.',
    buildCost: '$20K–$60K',
    timeToROI: '2–4 months',
  },
  {
    number: '05',
    badge: { text: 'HIGH AOV', color: 'bg-[#0A211F] text-white' },
    title: 'Complete-the-Look Builder',
    description:
      'Automatically merchandises complete outfits around any single product. Customer views a blazer → AI presents the perfect shirt, trousers, shoes, and accessories that match. Shoppable looks generated at scale that feel curated by a stylist, not an algorithm.',
    features: ['Outfit Builder', 'Cross-Category', 'Shoppable', 'Style-Matched'],
    roiLabel: 'Average Order Value Lift',
    roiValue: '+26%',
    example:
      'FINDMINE auto-merchandises outfits around single products for major fashion retailers. Customers who engage with complete-the-look features purchase 2.5x more items per session. AOV increases of 26% are typical.',
    buildCost: '$15K–$50K',
    timeToROI: '3–6 months',
  },
  {
    number: '06',
    badge: { text: 'COST SAVER', color: 'bg-[#FF5B4D] text-white' },
    title: 'AI Size & Fit Prediction',
    description:
      'Analyzes body measurements (from photos or previous purchases), brand-specific sizing curves, and fit preference data → recommends exact size with a confidence score. Eliminates the #1 reason for fashion returns: wrong size.',
    features: ['Body ML', 'Brand-Specific', 'Confidence Score', 'Fit Preference'],
    roiLabel: 'Size-Related Returns Down',
    roiValue: '-22%',
    example:
      'AI predicts purchase intent with 75–82% accuracy in the first 40 seconds of a session. Size-related returns are fashion\'s costliest problem — each return costs $15–$30 in processing alone, before considering lost lifetime value.',
    buildCost: '$20K–$60K',
    timeToROI: '3–6 months',
  },
];

export default function FashionServiceCards() {
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
            Our Fashion AI Tools and Resources
          </h2>
        </motion.div>

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
              className="group relative border border-[#D4D4D4] bg-[#F1EEEA] p-8 lg:p-10 hover:bg-white transition-colors duration-300"
            >
              {/* Large Faded Number */}
              <div className="absolute top-6 right-6 font-['Playfair_Display'] text-8xl text-[#D4D4D4] leading-none pointer-events-none">
                {service.number}
              </div>

              <div className="relative space-y-6">
                {/* Badge */}
                <div>
                  <span
                    className={`inline-block px-3 py-1 ${service.badge.color} text-xs tracking-wider uppercase font-['Lora']`}
                  >
                    {service.badge.text}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-['Playfair_Display'] text-3xl text-[#212427]">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="font-['Lora'] text-base text-[#696969] leading-relaxed">
                  {service.description}
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 border border-[#D4D4D4] bg-white text-[#696969] text-xs font-['Lora']"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* ROI Metric */}
                <div className="pt-6 border-t border-[#D4D4D4]">
                  <div className="flex items-baseline justify-between">
                    <span className="font-['Lora'] text-sm text-[#696969]">
                      {service.roiLabel}
                    </span>
                    <span className="font-['Playfair_Display'] text-4xl text-[#0A211F]">
                      {service.roiValue}
                    </span>
                  </div>
                </div>

                {/* Real-World Example */}
                <div className="pt-6 border-t border-[#D4D4D4]">
                  <p className="font-['Lora'] text-sm text-[#696969] leading-relaxed mb-4">
                    <span className="text-[#212427] font-medium">Real-World Example:</span>{' '}
                    {service.example}
                  </p>
                  <div className="flex justify-between items-center text-sm font-['Lora'] text-[#696969]">
                    <span>Build Cost: {service.buildCost}</span>
                    <span>Time to ROI: {service.timeToROI}</span>
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
