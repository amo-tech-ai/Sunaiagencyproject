'use client';

import { ArrowRight } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface FashionCTAProps {
  onCTAClick?: () => void;
}

export default function FashionCTA({ onCTAClick }: FashionCTAProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-[#0E3E1B] text-white py-24 lg:py-32">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Headline */}
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl leading-tight">
            Ready to bring AI into your fashion business?
          </h2>

          {/* Body */}
          <p className="font-['Lora'] text-xl leading-relaxed text-white/90 max-w-3xl mx-auto">
            Get a personalized fashion AI readiness assessment — including virtual try-on, 
            trend forecasting, and styling opportunities specific to your brand.
          </p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onClick={onCTAClick}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#0A211F] text-white font-['Lora'] hover:bg-[#0d2926] transition-all duration-300"
          >
            <span className="font-medium">Book Your Fashion AI Assessment</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
