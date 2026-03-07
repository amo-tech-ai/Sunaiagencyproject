// C-F04 — Fashion Intro Section
// BCG design system: white bg, charcoal text, system sans body

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function FashionIntro() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="border-t" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E8E4' }}>
      <div className="max-w-[900px] mx-auto px-6 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="text-base lg:text-lg leading-relaxed space-y-6" style={{ color: '#6B6B63' }}>
            <p>
              Fashion demands both creativity and efficiency. The best AI implementations
              preserve the art of fashion while revolutionizing the business of fashion —
              reducing waste by predicting what will sell before it's made, accelerating
              design cycles from weeks to hours, and delivering personalized shopping
              experiences that feel like having a personal stylist for every customer.
            </p>

            <p>
              The numbers are staggering. McKinsey projects $150–275 billion in new operating
              profit potential from AI in fashion. Adoption jumped from 20% to 44% in just
              the first half of 2025. And 46% of fashion executives say they're preparing
              for AI agents to become a primary shopping channel. This isn't a future trend —
              it's a present-tense transformation.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
