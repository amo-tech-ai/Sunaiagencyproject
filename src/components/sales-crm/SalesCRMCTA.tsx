import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export default function SalesCRMCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: '#0E3E1B' }}>
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
           style={{
             backgroundImage: `linear-gradient(#7EF473 1px, transparent 1px), linear-gradient(90deg, #7EF473 1px, transparent 1px)`,
             backgroundSize: '60px 60px'
           }} />

      {/* Animated Divider Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="h-px bg-gradient-to-r from-transparent via-[#7EF473] to-transparent mb-20"
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
          <h2 className="text-4xl lg:text-6xl xl:text-7xl mb-8 text-[#FAF9F5] leading-tight"
              style={{ fontFamily: 'Georgia, serif' }}>
            Your Sales Team Deserves Better Than Spreadsheets
          </h2>

          {/* Body */}
          <p className="text-xl lg:text-2xl text-[#FAF9F5]/70 mb-12 leading-relaxed max-w-2xl mx-auto"
             style={{ fontFamily: 'system-ui, -apple-system' }}>
            We'll audit your pipeline, identify the leaks, and design a CRM that captures, scores, engages, and closes — automatically.
          </p>

          {/* CTA Button - Orange */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#FF6B4A] text-white px-12 py-5 rounded-full font-semibold hover:bg-[#E85A3A] hover:shadow-2xl hover:shadow-[#FF6B4A]/30 transition-all duration-300 inline-flex items-center gap-3 text-lg"
            style={{ fontFamily: 'system-ui, -apple-system' }}
          >
            Book a Sales Strategy Call
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 text-sm text-[#FAF9F5]/50"
            style={{ fontFamily: 'system-ui, -apple-system' }}
          >
            Walk away with a pipeline map + automation plan.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
