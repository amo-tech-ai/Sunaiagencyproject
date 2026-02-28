import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const backgroundImg = 'https://images.unsplash.com/photo-1638845604906-6c87bd9ddd01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3ZWIlMjBhcHBsaWNhdGlvbiUyMGRhc2hib2FyZCUyMGludGVyZmFjZXxlbnwxfHx8fDE3NzIyMTg2NTN8MA&ixlib=rb-4.1.0&q=80&w=1080';

export default function WebAppsHero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: '#0E3E1B' }}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img src={backgroundImg} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
           style={{
             backgroundImage: `linear-gradient(#7EF473 1px, transparent 1px), linear-gradient(90deg, #7EF473 1px, transparent 1px)`,
             backgroundSize: '60px 60px'
           }} />

      {/* Content - Centered */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-8 py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Eyebrow */}
          <div className="mb-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#7EF473] font-semibold" style={{ fontFamily: 'system-ui, -apple-system' }}>
              AI WEB APPS
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-7xl xl:text-8xl mb-6 text-[#FAF9F5] leading-[1.1] max-w-5xl mx-auto"
              style={{ fontFamily: 'Georgia, serif' }}>
            Intelligent Web Applications Built to Scale
          </h1>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-block mb-8"
          >
            <div className="bg-[#7EF473]/10 backdrop-blur-sm border border-[#7EF473]/20 rounded-full px-6 py-2">
              <span className="text-[#7EF473] text-sm font-semibold" style={{ fontFamily: 'system-ui, -apple-system' }}>
                Live in 6–8 Weeks
              </span>
            </div>
          </motion.div>

          {/* Subhead */}
          <p className="text-xl lg:text-2xl text-[#FAF9F5]/80 mb-12 leading-relaxed max-w-3xl mx-auto"
             style={{ fontFamily: 'system-ui, -apple-system' }}>
            Custom web applications with AI embedded at the architecture level. Designed for performance, automation, and real-world growth — from MVP to enterprise.
          </p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button className="bg-[#7EF473] text-[#0E3E1B] px-10 py-5 rounded-full font-semibold hover:bg-[#6DE362] hover:shadow-lg hover:shadow-[#7EF473]/30 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                    style={{ fontFamily: 'system-ui, -apple-system' }}>
              Start Your AI Web App
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-[#FAF9F5]/20 text-[#FAF9F5] px-10 py-5 rounded-full font-semibold hover:bg-white/5 hover:border-[#FAF9F5]/40 transition-all duration-300 text-lg backdrop-blur-sm"
                    style={{ fontFamily: 'system-ui, -apple-system' }}>
              View Case Studies
            </button>
          </motion.div>

          {/* Trust Line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-sm text-[#FAF9F5]/50"
            style={{ fontFamily: 'system-ui, -apple-system' }}
          >
            15+ AI-powered web apps launched in the past year.
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAF9F5] to-transparent" />
    </section>
  );
}
