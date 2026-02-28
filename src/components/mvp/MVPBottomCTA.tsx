import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function MVPBottomCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const navigate = useNavigate();

  return (
    <section ref={ref} className="bg-[#0F3D3E] text-white py-32 lg:py-40 text-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />
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
          Stop planning. Start building.
        </motion.h2>

        {/* Body Copy */}
        <motion.p
          className="text-lg text-white/70 mb-10 leading-relaxed font-['Lora'] max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Your product idea is not going to build itself. Every week you spend evaluating agencies is a week someone else could be building the same thing. Book a 30-minute MVP strategy session. We will review your concept, identify the core features for version one, and tell you honestly whether we are the right fit.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button
            onClick={() => navigate('/booking')}
            className="bg-[#84CC16] text-gray-900 px-10 py-4 rounded-full font-['Lora'] text-lg font-semibold hover:bg-[#73b512] hover:shadow-lg hover:shadow-[#84CC16]/30 transition-all inline-flex items-center gap-3"
          >
            Start Your MVP Brief
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Sub-text */}
        <motion.p
          className="text-sm text-white/50 mt-6 font-['Lora']"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Free 30-minute session. No obligations. No pitch deck required.
        </motion.p>
      </div>
    </section>
  );
}
