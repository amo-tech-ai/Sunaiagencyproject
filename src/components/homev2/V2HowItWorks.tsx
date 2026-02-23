import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'motion/react';

interface V2HowItWorksProps {
  onNavigate?: (page: string) => void;
}

export default function V2HowItWorks({ onNavigate }: V2HowItWorksProps) {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  // Scroll-based animations for timeline
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  });
  
  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);
  
  const steps = [
    {
      number: '1',
      title: 'Discovery & Scoping',
      description: 'Deep-dive workshops to align on goals, technical requirements, and success metrics from day one.',
    },
    {
      number: '2',
      title: 'Strategic Blueprint',
      description: 'Developing architecture, data strategy, and implementation roadmap shaped around your business.',
    },
    {
      number: '3',
      title: 'Rapid Prototyping',
      description: 'Building working prototypes and MVPs to validate concepts and gather real-world feedback quickly.',
    },
    {
      number: '4',
      title: 'Production Deployment',
      description: 'Full-scale development with rigorous testing, integration, and deployment to your infrastructure.',
    },
    {
      number: '5',
      title: 'Continuous Evolution',
      description: 'Ongoing optimization, monitoring, and feature enhancement to maximize ROI and adapt to change.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const headlineVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section 
      ref={sectionRef}
      className="relative bg-[#0F3D3E] py-32 lg:py-40 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#84CC16]/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-[#84CC16]/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* Left: Sticky Headline */}
          <motion.div 
            className="lg:col-span-5 lg:sticky lg:top-32 space-y-8"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div variants={headlineVariants}>
              <div className="inline-block px-4 py-2 bg-[#84CC16]/10 border border-[#84CC16]/20 mb-8">
                <span className="text-xs uppercase tracking-[0.2em] text-[#84CC16] font-medium">
                  How We Work
                </span>
              </div>
            </motion.div>

            <motion.div variants={headlineVariants}>
              <h2 className="font-['Playfair_Display'] text-5xl lg:text-7xl font-bold text-white leading-[1.05] mb-8">
                Your <span className="italic">plug-in</span> brand team, from kickoff to rollout
              </h2>
            </motion.div>

            <motion.p 
              className="text-xl text-white/70 leading-relaxed font-['Lora'] max-w-xl"
              variants={headlineVariants}
            >
              We work side-by-side with your team to shape, evolve, and scale your AI systems, without the slowdowns of traditional agencies.
            </motion.p>

            <motion.div variants={headlineVariants}>
              <button
                onClick={() => onNavigate?.('process-v12')}
                className="inline-flex items-center gap-2 text-[#84CC16] border-b-2 border-[#84CC16] pb-1 hover:text-white hover:border-white transition-all group mt-8"
              >
                <span className="text-sm uppercase tracking-[0.2em] font-medium">
                  View Detailed Process
                </span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Right: Timeline Steps */}
          <div ref={timelineRef} className="lg:col-span-7 relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10">
              <motion.div
                className="w-full bg-[#84CC16] origin-top"
                style={{ height: lineHeight }}
              />
            </div>

            {/* Steps */}
            <motion.div 
              className="space-y-16 lg:space-y-20"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={containerVariants}
            >
              {steps.map((step, index) => {
                const stepRef = useRef(null);
                const stepInView = useInView(stepRef, { once: true, amount: 0.6 });
                
                return (
                  <motion.div
                    key={index}
                    ref={stepRef}
                    className="relative pl-20 group"
                    variants={stepVariants}
                  >
                    {/* Number Circle with Pulse */}
                    <motion.div 
                      className="absolute left-0 top-0 w-12 h-12 border-2 border-white/20 bg-[#0F3D3E] flex items-center justify-center group-hover:border-[#84CC16] group-hover:bg-[#84CC16] transition-all duration-500"
                      animate={stepInView ? {
                        scale: [1, 1.1, 1],
                      } : {}}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                      }}
                    >
                      <span className="text-xl font-['Playfair_Display'] font-bold text-white group-hover:text-[#0F3D3E] transition-colors duration-500">
                        {step.number}
                      </span>
                    </motion.div>

                    {/* Glow Effect on Hover */}
                    <div className="absolute left-0 top-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-[#84CC16] blur-xl opacity-50" />
                    </div>

                    {/* Content */}
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={stepInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <h3 className="text-2xl lg:text-3xl font-['Playfair_Display'] font-bold text-white group-hover:text-[#84CC16] transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-lg text-white/60 leading-relaxed font-['Lora'] pr-4 group-hover:text-white/80 transition-colors duration-300">
                        {step.description}
                      </p>
                    </motion.div>

                    {/* Connector Dot */}
                    <motion.div 
                      className="absolute left-[23px] top-[23px] w-1.5 h-1.5 bg-[#84CC16]"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={stepInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    />

                    {/* Progress Indicator */}
                    {index < steps.length - 1 && (
                      <motion.div
                        className="absolute left-6 top-16 w-px h-16 bg-gradient-to-b from-[#84CC16]/50 to-transparent"
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={stepInView ? { opacity: 1, scaleY: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        style={{ originY: 0 }}
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