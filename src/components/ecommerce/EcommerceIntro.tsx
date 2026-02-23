'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function EcommerceIntro() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-white py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto px-6 lg:px-8"
      >
        <div className="space-y-8 font-['Lora'] text-lg lg:text-xl leading-relaxed text-gray-700">
          <p>
            Winning with e-commerce — securing truly transformational results — takes more than 
            digital platforms and expertise. It requires a holistic strategy and a relentless focus 
            on customer value. It means thinking creatively about the customer journey, integrating 
            AI into every channel and function, and building systems that learn and improve with 
            every interaction.
          </p>
          <p>
            The shift is already underway. <span className="font-semibold text-[#0F3D3E]">
            AI-generated search traffic to e-commerce sites grew 4,700% year over year.</span> Shoppers 
            are discovering products through ChatGPT, Copilot, and Gemini before they ever visit a website. 
            The companies that prepare now will capture this wave. Those that don't will wonder where their 
            traffic went.
          </p>
        </div>
      </motion.div>
    </section>
  );
}