'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface TravelCTAProps {
  onNavigate?: (page: string) => void;
}

export default function TravelCTA({ onNavigate }: TravelCTAProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-[#0E3E1B] text-white py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl mb-6">
            Ready to make your travel business AI-powered?
          </h2>
          <p className="font-['Lora'] text-xl text-white/80 mb-12">
            Get a personalized travel AI readiness assessment covering dynamic pricing, AI agents, personalization, and AEO strategy.
          </p>
          <button
            onClick={() => onNavigate?.('booking')}
            className="group inline-flex items-center gap-3 bg-[#7EF473] text-[#212427] px-8 py-4 font-['Lora'] text-base hover:bg-[#6de362] transition-colors"
          >
            Book Your Travel AI Assessment
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
