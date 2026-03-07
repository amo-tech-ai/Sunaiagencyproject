// C-F12 — Fashion CTA Section
// BCG design system dark variant: charcoal bg, white text, Georgia serif, green CTA, 4px radius

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
    <section ref={ref} className="border-t" style={{ backgroundColor: '#1A1A1A', borderColor: '#E8E8E4' }}>
      <div className="max-w-[900px] mx-auto px-6 py-20 lg:py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="space-y-7"
        >
          {/* Headline */}
          <h2 className="text-3xl lg:text-4xl" style={{ fontFamily: 'Georgia, serif', color: '#F5F5F0', lineHeight: 1.15 }}>
            Ready to bring AI into your fashion business?
          </h2>

          {/* Body */}
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>
            Get a personalized fashion AI readiness assessment — including virtual try-on,
            trend forecasting, and styling opportunities specific to your brand.
          </p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onClick={onCTAClick}
            className="group inline-flex items-center gap-3 px-8 py-4 transition-colors"
            style={{ backgroundColor: '#00875A', color: '#FFFFFF', borderRadius: '4px' }}
          >
            <span>Book Your Fashion AI Assessment</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
