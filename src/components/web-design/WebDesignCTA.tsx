import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function WebDesignCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const navigate = useNavigate();

  return (
    <section ref={ref} className="bg-[#0F3D3E] text-white py-32 lg:py-40 text-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Divider Line */}
        <motion.div
          className="w-full max-w-md mx-auto h-px bg-white/10 mb-12"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8 }}
        />

        {/* Headline */}
        <motion.h2
          className="text-4xl lg:text-5xl mb-8"
          style={{ fontFamily: 'Playfair Display, serif' }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Need a Website That Works as Hard as You Do?
        </motion.h2>

        {/* Body Copy */}
        <motion.p
          className="text-lg text-white/70 mb-10 leading-relaxed font-['Lora'] max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Stop waiting months for a website that loads slowly and converts poorly. Book a web strategy session. We will review your current site, identify the biggest performance and conversion gaps, and outline a build plan that gets you live in weeks — with intelligence built in from day one.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button
            onClick={() => navigate('/booking')}
            className="bg-[#84CC16] text-gray-900 px-10 py-4 font-['Lora'] text-lg font-semibold hover:bg-[#73b512] transition-colors inline-flex items-center gap-2"
          >
            Start Your Website Project
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
