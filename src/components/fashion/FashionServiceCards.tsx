// C-F06 — Fashion Service Cards (6 AI tools)
// BCG design system: white bg, charcoal text, Georgia serif, green accents, 4px radius

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const services = [
  {
    number: '01',
    badge: { text: 'HIGH DEMAND', bg: '#1A1A1A' },
    title: 'AI Virtual Try-On',
    description:
      'Customer uploads a selfie → sees themselves wearing any garment with accurate fit visualization, fabric drape simulation, and AI-powered size recommendations. Works across brands, categories, and body types. Reduces the single biggest cost in fashion: returns.',
    features: ['Selfie Avatar', 'Fabric Simulation', 'Size AI', 'Multi-Brand', 'Body Inclusive'],
    roiLabel: 'Return Rate Reduction',
    roiValue: '-25%',
    example:
      "DressX Agent creates photorealistic avatars from selfies — customers can try on garments across 200+ luxury brands and 1M+ products. Returns reduced 17-25% in pilots. Google's virtual try-on now supports all body types from XXS to 4XL.",
    buildCost: '$40K–$120K',
    timeToROI: '6–12 months',
  },
  {
    number: '02',
    badge: { text: 'STRATEGIC', bg: '#DC2626' },
    title: 'AI Trend Forecasting',
    description:
      'Scans millions of social media images, runway show footage, street style photography, and search data → predicts colors, fabrics, prints, and silhouettes 18–24 months before they peak. Transforms buying decisions from gut feeling to data-backed confidence.',
    features: ['Social Scanning', '18–24mo Ahead', 'Demand Signals', 'Color Prediction'],
    roiLabel: 'Overproduction Reduction',
    roiValue: '-30%',
    example:
      "Heuritech analyzes millions of images from social media and streets to predict demand by color, fabric, and print. 74% of fashion brands now use AI-based demand forecasting. This directly attacks overproduction — fashion's biggest environmental and financial waste.",
    buildCost: '$25K–$80K',
    timeToROI: '3–6 months',
  },
  {
    number: '03',
    badge: { text: 'AI AGENTS', bg: '#00875A' },
    title: 'AI Personal Stylist',
    description:
      'An evolving AI agent that learns body shape, style preferences, occasion needs, and lifestyle context. Not a recommendation engine — a true personal stylist that remembers, anticipates, and improves across every interaction. Works across 8,000+ brands.',
    features: ['Style Passport', '8,000+ Brands', 'Multimodal', 'Evolving Memory'],
    roiLabel: 'Recommendation Accuracy',
    roiValue: '99.8%',
    example:
      "Daydream launched agentic chat-based shopping across 8,000 brands + 200 retailers. Crescendo AI achieved 99.8% accuracy in fashion recommendations. These agents don't just filter — they style.",
    buildCost: '$25K–$80K',
    timeToROI: '3–6 months',
  },
  {
    number: '04',
    badge: { text: 'CREATIVE AI', bg: '#7C3AED' },
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
    badge: { text: 'HIGH AOV', bg: '#1A1A1A' },
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
    badge: { text: 'COST SAVER', bg: '#DC2626' },
    title: 'AI Size & Fit Prediction',
    description:
      'Analyzes body measurements (from photos or previous purchases), brand-specific sizing curves, and fit preference data → recommends exact size with a confidence score. Eliminates the #1 reason for fashion returns: wrong size.',
    features: ['Body ML', 'Brand-Specific', 'Confidence Score', 'Fit Preference'],
    roiLabel: 'Size-Related Returns Down',
    roiValue: '-22%',
    example:
      "AI predicts purchase intent with 75–82% accuracy in the first 40 seconds of a session. Size-related returns are fashion's costliest problem — each return costs $15–$30 in processing alone, before considering lost lifetime value.",
    buildCost: '$20K–$60K',
    timeToROI: '3–6 months',
  },
];

export default function FashionServiceCards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="border-t" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E8E4' }}>
      <div className="max-w-[1120px] mx-auto px-6 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          <h2 className="text-3xl lg:text-4xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            Our Fashion AI Tools and Resources
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: index * 0.08 }}
              className="group relative border p-8 lg:p-9 transition-colors hover:bg-[#FAFAF8]"
              style={{ borderColor: '#E8E8E4', backgroundColor: '#F5F5F0', borderRadius: '4px' }}
            >
              {/* Large Faded Number */}
              <div
                className="absolute top-6 right-6 text-7xl leading-none pointer-events-none"
                style={{ fontFamily: 'Georgia, serif', color: '#E8E8E4' }}
              >
                {service.number}
              </div>

              <div className="relative space-y-5">
                {/* Badge */}
                <span
                  className="inline-block px-3 py-1 text-xs tracking-widest uppercase"
                  style={{ backgroundColor: service.badge.bg, color: '#FFFFFF', borderRadius: '4px', letterSpacing: '0.06em' }}
                >
                  {service.badge.text}
                </span>

                {/* Title */}
                <h3 className="text-2xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed" style={{ color: '#6B6B63' }}>
                  {service.description}
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 border text-xs"
                      style={{ borderColor: '#E8E8E4', backgroundColor: '#FFFFFF', color: '#6B6B63', borderRadius: '4px' }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* ROI Metric */}
                <div className="pt-5 border-t" style={{ borderColor: '#E8E8E4' }}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm" style={{ color: '#6B6B63' }}>{service.roiLabel}</span>
                    <span className="text-3xl" style={{ fontFamily: 'Georgia, serif', color: '#00875A' }}>
                      {service.roiValue}
                    </span>
                  </div>
                </div>

                {/* Real-World Example */}
                <div className="pt-5 border-t" style={{ borderColor: '#E8E8E4' }}>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B6B63' }}>
                    <span style={{ color: '#1A1A1A' }}>Real-World Example:</span>{' '}
                    {service.example}
                  </p>
                  <div className="flex justify-between items-center text-xs" style={{ color: '#6B6B63' }}>
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
