'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function TravelApproach() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6">
            <div className="w-16 h-1 bg-[#7EF473] mb-8"></div>
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#212427] mb-8">
              Our Approach to Travel AI
            </h2>
          </div>

          <div className="max-w-4xl space-y-6 font-['Lora'] text-lg text-[#696969] leading-relaxed">
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
