import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export default function AIAgentsCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-32 lg:py-40 overflow-hidden" style={{ backgroundColor: '#0F3D3E' }}>
      {/* Dot Pattern Background */}
      <div className="absolute inset-0 opacity-5"
           style={{
             backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
             backgroundSize: '30px 30px'
           }} />

      {/* Animated Divider Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="h-px bg-gradient-to-r from-transparent via-[#84CC16] to-transparent mb-20"
        style={{ transformOrigin: 'center' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Headline */}
          <h2 className="text-4xl lg:text-5xl xl:text-6xl mb-8 text-white leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}>
            Replace Repetitive Work With Agents That Scale
          </h2>

          {/* Body */}
          <p className="text-lg text-white/70 mb-12 leading-relaxed font-['Lora'] max-w-2xl mx-auto">
            Every hour spent on lead research, manual updates, reporting, and process management is an hour not spent on growth. Book a session to map your highest-leverage workflows. We'll design an agent system for your operations—with a clear build plan, timeline, and ROI targets.
          </p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#84CC16] text-gray-900 px-10 py-4 rounded-full font-semibold font-['Lora'] hover:bg-[#73b512] hover:shadow-lg hover:shadow-[#84CC16]/30 transition-all duration-300 inline-flex items-center gap-2"
          >
            Build Your Agent System
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-6 text-sm text-white/50 font-['Lora']"
          >
            Clear scope. Safe controls. Visible results in weeks—not quarters.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
