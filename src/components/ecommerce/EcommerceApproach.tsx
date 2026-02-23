'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function EcommerceApproach() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-white py-24 lg:py-32">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Section Title */}
          <div className="space-y-4">
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#0F3D3E]">
              Our Approach to E-Commerce AI
            </h2>
            <div className="w-12 h-[3px] bg-[#84CC16]" />
          </div>

          {/* Body Copy */}
          <p className="font-['Lora'] text-lg lg:text-xl leading-relaxed text-gray-700">
            By combining AI expertise and strategy, we help companies seize the full potential 
            of e-commerce. There are a lot of things to get right: customer journey mapping, 
            product strategy, digital organization and operating models, new ways of reaching 
            and retaining customers, and real insights about what works. We take an end-to-end 
            approach — one designed to spark innovation, deliver value quickly, and enable 
            companies to continue on the path long after we've set the course.
          </p>
        </motion.div>
      </div>
    </section>
  );
}