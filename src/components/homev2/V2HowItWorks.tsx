// C-V2-10 — V2 How It Works
// BCG design system dark variant: charcoal bg, white text, Georgia serif, green accents, 4px radius

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'motion/react';

interface V2HowItWorksProps {
  onNavigate?: (page: string) => void;
}

export default function V2HowItWorks({ onNavigate }: V2HowItWorksProps) {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

  const steps = [
    { number: '1', title: 'Discovery & Scoping', description: 'Deep-dive workshops to align on goals, technical requirements, and success metrics from day one.' },
    { number: '2', title: 'Strategic Blueprint', description: 'Developing architecture, data strategy, and implementation roadmap shaped around your business.' },
    { number: '3', title: 'Rapid Prototyping', description: 'Building working prototypes and MVPs to validate concepts and gather real-world feedback quickly.' },
    { number: '4', title: 'Production Deployment', description: 'Full-scale development with rigorous testing, integration, and deployment to your infrastructure.' },
    { number: '5', title: 'Continuous Evolution', description: 'Ongoing optimization, monitoring, and feature enhancement to maximize ROI and adapt to change.' },
  ];

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } } };
  const headlineVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } } };
  const stepVariants = { hidden: { opacity: 0, x: 60, scale: 0.95 }, visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(0,135,90,0.05)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute bottom-1/3 left-1/3 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(0,135,90,0.05)' }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
      </div>

      <div className="max-w-[1120px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-20 items-start">
          {/* Left: Sticky Headline */}
          <motion.div className="lg:col-span-5 lg:sticky lg:top-28 space-y-7" initial="hidden" animate={isInView ? "visible" : "hidden"} variants={containerVariants}>
            <motion.div variants={headlineVariants}>
              <div className="inline-block px-3.5 py-1.5 border mb-6" style={{ backgroundColor: 'rgba(0,135,90,0.08)', borderColor: 'rgba(0,135,90,0.15)', borderRadius: '4px' }}>
                <span className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>How We Work</span>
              </div>
            </motion.div>

            <motion.div variants={headlineVariants}>
              <h2 className="text-4xl lg:text-5xl text-white leading-[1.05] mb-7" style={{ fontFamily: 'Georgia, serif' }}>
                Your <span className="italic">plug-in</span> brand team, from kickoff to rollout
              </h2>
            </motion.div>

            <motion.p className="text-lg text-white/70 leading-relaxed max-w-xl" variants={headlineVariants}>
              We work side-by-side with your team to shape, evolve, and scale your AI systems, without the slowdowns of traditional agencies.
            </motion.p>

            <motion.div variants={headlineVariants}>
              <button onClick={() => onNavigate?.('process-v12')} className="inline-flex items-center gap-2 border-b pb-1 hover:text-white hover:border-white transition-all group mt-6" style={{ color: '#00875A', borderColor: '#00875A' }}>
                <span className="text-sm tracking-widest uppercase" style={{ letterSpacing: '0.08em' }}>View Detailed Process</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Right: Timeline Steps */}
          <div ref={timelineRef} className="lg:col-span-7 relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10">
              <motion.div className="w-full origin-top" style={{ height: lineHeight, backgroundColor: '#00875A' }} />
            </div>

            <motion.div className="space-y-14 lg:space-y-18" initial="hidden" animate={isInView ? "visible" : "hidden"} variants={containerVariants}>
              {steps.map((step, index) => {
                const stepRef = useRef(null);
                const stepInView = useInView(stepRef, { once: true, amount: 0.6 });

                return (
                  <motion.div key={index} ref={stepRef} className="relative pl-18 group" style={{ paddingLeft: '5rem' }} variants={stepVariants}>
                    <motion.div
                      className="absolute left-0 top-0 w-12 h-12 border flex items-center justify-center group-hover:border-[#00875A] group-hover:bg-[#00875A] transition-all duration-500"
                      style={{ borderColor: 'rgba(255,255,255,0.2)', backgroundColor: '#1A1A1A', borderRadius: '4px' }}
                      animate={stepInView ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <span className="text-lg text-white group-hover:text-white transition-colors duration-500" style={{ fontFamily: 'Georgia, serif' }}>
                        {step.number}
                      </span>
                    </motion.div>

                    <motion.div className="space-y-3" initial={{ opacity: 0, y: 20 }} animate={stepInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}>
                      <h3 className="text-xl lg:text-2xl text-white group-hover:text-[#00875A] transition-colors duration-300" style={{ fontFamily: 'Georgia, serif' }}>
                        {step.title}
                      </h3>
                      <p className="text-base text-white/60 leading-relaxed pr-4 group-hover:text-white/80 transition-colors duration-300">
                        {step.description}
                      </p>
                    </motion.div>

                    {index < steps.length - 1 && (
                      <motion.div
                        className="absolute left-6 top-16 w-px h-14"
                        style={{ background: 'linear-gradient(to bottom, rgba(0,135,90,0.5), transparent)' }}
                        initial={{ opacity: 0, scaleY: 0 }} animate={stepInView ? { opacity: 1, scaleY: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
