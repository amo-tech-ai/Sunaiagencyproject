// C-F03 — Fashion Approach Section
// BCG design system: off-white bg, charcoal text, Georgia serif, green accent bar

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function FashionApproach() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="border-t" style={{ backgroundColor: '#F5F5F0', borderColor: '#E8E8E4' }}>
      <div className="max-w-[900px] mx-auto px-6 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Green Accent Line */}
          <div className="w-16 h-0.5" style={{ backgroundColor: '#00875A' }} />

          {/* Section Title */}
          <h2 className="text-3xl lg:text-4xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A', lineHeight: 1.15 }}>
            How We Help Fashion Retailers Digitize Without Compromising the Art of Fashion
          </h2>

          {/* Body Copy */}
          <div className="text-base lg:text-lg leading-relaxed space-y-6" style={{ color: '#6B6B63' }}>
            <p>
              We've worked with brands at every stage — from emerging DTC labels to multi-brand
              retailers to luxury houses. Our approach respects the creative process while
              bringing data intelligence to every business decision. We believe AI should
              amplify the designer's vision, not replace it. It should make the stylist's
              intuition scalable, the buyer's instinct quantifiable, and the supply chain's
              waste eliminable.
            </p>

            <p>
              We combine deep fashion industry knowledge with technical AI expertise to deliver
              solutions that understand fabric, fit, and feeling — not just data points.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
