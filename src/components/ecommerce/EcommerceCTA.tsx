'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface EcommerceCTAProps {
  onCTAClick?: () => void;
}

export default function EcommerceCTA({ onCTAClick }: EcommerceCTAProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-gray-100 py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Headline */}
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#0F3D3E]">
            Ready to transform your e-commerce with AI?
          </h2>

          {/* Body */}
          <p className="font-['Lora'] text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto">
            Get a free AI readiness assessment and personalized roadmap for your store.
          </p>

          {/* CTA Button */}
          <button
            onClick={onCTAClick}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#84CC16] text-[#0F3D3E] font-['Lora'] hover:bg-[#65A30D] transition-all duration-300"
          >
            <span className="font-medium">Book Your Free Assessment</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}