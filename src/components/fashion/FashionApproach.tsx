'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function FashionApproach() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-[#F1EEEA] py-24 lg:py-32">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Green Accent Line */}
          <div className="w-16 h-1 bg-[#0A211F]" />

          {/* Section Title */}
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#212427] leading-tight">
            How We Help Fashion Retailers Digitize Without Compromising the Art of Fashion
          </h2>

          {/* Body Copy */}
          <div className="font-['Lora'] text-lg lg:text-xl leading-relaxed text-[#696969] space-y-6">
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
