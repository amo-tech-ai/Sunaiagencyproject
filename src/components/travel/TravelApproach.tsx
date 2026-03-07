// C-T04 — Travel Approach
// BCG design system: white bg, charcoal text, Georgia serif, green accent bar

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function TravelApproach() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="border-t" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E8E4' }}>
      <div className="max-w-[1120px] mx-auto px-6 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6">
            <div className="w-16 h-0.5 mb-8" style={{ backgroundColor: '#00875A' }} />
            <h2 className="text-3xl lg:text-4xl mb-8" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
              Our Approach to Travel AI
            </h2>
          </div>

          <div className="max-w-3xl text-base lg:text-lg leading-relaxed space-y-6" style={{ color: '#6B6B63' }}>
            <p>
              Travel is uniquely complex. A single booking involves multiple systems — airlines, hotels, ground transport, activities, insurance, payments — across geographies, currencies, and regulatory environments. AI must work across all of these simultaneously while handling real-time disruptions.
            </p>
            <p>
              Our approach starts with understanding your specific position in the travel value chain — OTA optimizing conversions, tour operator personalizing itineraries, DMO driving destination awareness, or corporate travel manager proving ROI. We map AI solutions to highest-impact touchpoints, starting with quick wins and building toward agentic AI systems.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
