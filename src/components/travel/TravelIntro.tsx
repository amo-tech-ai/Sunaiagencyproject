// C-T02 — Travel Intro
// BCG design system: white bg, charcoal text

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function TravelIntro() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="border-t" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E8E4' }}>
      <div className="max-w-[900px] mx-auto px-6 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-base lg:text-lg leading-relaxed space-y-6" style={{ color: '#6B6B63' }}>
            <p>
              The travel industry is experiencing its most significant technology shift since online booking replaced the phone call. AI is embedded across the entire travel lifecycle — from inspiration and planning through booking, experience, and post-trip engagement.
            </p>
            <p>
              The global AI in travel market is projected to reach <span style={{ color: '#1A1A1A' }}>$12 billion by 2026</span>. 90% of travel executives already use generative AI. 86% of travelers have used AI to find or book accommodations. And among those who try AI for trip planning, 63% use it for most or every trip afterward. The booking funnel has shifted from search engines to AI engines.
            </p>
            <p>
              McKinsey and Skift identify agentic AI as the defining force: AI systems that plan trips, make bookings, manage itineraries, and handle disruptions autonomously. Only 2% of travel companies have widespread agentic AI today. The gap between early movers and the rest is about to become a chasm.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
