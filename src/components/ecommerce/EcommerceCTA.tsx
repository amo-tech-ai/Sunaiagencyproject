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
    <section ref={ref} className="py-24 lg:py-32" style={{ backgroundColor: '#F5F5F0' }}>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Headline */}
          <h2 className="text-4xl lg:text-5xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            Ready to transform your e-commerce with AI?
          </h2>

          {/* Body */}
          <p className="text-lg lg:text-xl max-w-3xl mx-auto" style={{ color: '#6B6B63' }}>
            Get a free AI readiness assessment and personalized roadmap for your store.
          </p>

          {/* CTA Button */}
          <button
            onClick={onCTAClick}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#00875A] text-white hover:bg-[#006B47] transition-all duration-300"
            style={{ borderRadius: '4px' }}
          >
            <span className="font-medium">Book Your Free Assessment</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
