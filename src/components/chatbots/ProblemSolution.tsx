// C-CB02 — Problem / Solution Comparison
// BCG design system: white bg, charcoal text, Georgia serif, green accent card, 4px radius

import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { XCircle, CheckCircle, Zap, Database, TrendingUp, Shield, ArrowRight } from 'lucide-react';

export default function ProblemSolution() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const problems = [
    { icon: XCircle, text: 'Only answer FAQs', color: 'text-red-500' },
    { icon: XCircle, text: "Don't connect to real systems", color: 'text-red-500' },
    { icon: XCircle, text: 'Create more work instead of saving time', color: 'text-red-500' },
  ];

  const solutions = [
    { icon: Zap, title: 'Qualify leads', description: 'Score and route high-intent prospects', color: '#00875A' },
    { icon: CheckCircle, title: 'Book calls', description: 'Sync with calendars automatically', color: '#00875A' },
    { icon: Database, title: 'Update your CRM', description: 'Every conversation logged', color: '#00875A' },
    { icon: TrendingUp, title: 'Trigger automations', description: 'Connect workflows end-to-end', color: '#00875A' },
    { icon: Shield, title: 'Escalate to humans', description: 'Only when complexity requires it', color: '#00875A' },
  ];

  return (
    <section ref={containerRef} className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Animated Background Pattern */}
      <motion.div className="absolute inset-0 opacity-[0.02]" style={{ y }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, rgba(0,135,90,0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </motion.div>

      <div ref={sectionRef} className="max-w-[1120px] mx-auto px-6 relative">
        <motion.div className="text-center mb-16" style={{ opacity }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-5"
          >
            <span className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
              The Critical Difference
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl tracking-tight mb-5"
            style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            What This Really Solves
          </motion.h2>

          <motion.p
            className="text-lg max-w-3xl mx-auto"
            style={{ color: '#6B6B63' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Most chatbots fail. Ours are business operators.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative">
          {/* Connection Line - Desktop Only */}
          <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="relative"
            >
              <ArrowRight className="w-14 h-14" style={{ color: '#00875A' }} />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className="text-xs tracking-widest uppercase px-3 py-1" style={{ color: '#6B6B63', backgroundColor: '#FFFFFF', letterSpacing: '0.06em' }}>
                  Transform
                </span>
              </div>
            </motion.div>
          </div>

          {/* Problems Card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="border p-8 md:p-10 h-full relative overflow-hidden group hover:border-[#CDCDC7] transition-colors" style={{ backgroundColor: '#F5F5F0', borderColor: '#E8E8E4', borderRadius: '4px' }}>
              <div className="relative">
                <h3
                  className="text-2xl md:text-3xl mb-2"
                  style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}
                >
                  Most Chatbots Fail
                </h3>
                <p className="text-sm mb-8" style={{ color: '#6B6B63' }}>Because they:</p>

                <div className="space-y-4">
                  {problems.map((problem, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-4 bg-white p-4 border"
                      style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                    >
                      <problem.icon className={`w-6 h-6 ${problem.color} flex-shrink-0 mt-1`} />
                      <span className="text-base" style={{ color: '#1A1A1A' }}>{problem.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Solutions Card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="border-2 p-8 md:p-10 h-full relative overflow-hidden group transition-colors" style={{ borderColor: '#00875A', backgroundColor: 'rgba(0,135,90,0.02)', borderRadius: '4px' }}>
              <div className="relative">
                <h3
                  className="text-2xl md:text-3xl mb-2"
                  style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}
                >
                  Our AI Chatbots
                </h3>
                <p className="mb-8" style={{ color: '#6B6B63' }}>
                  They don't just chat — they <span style={{ color: '#00875A' }}>take action</span>.
                </p>

                <div className="space-y-4">
                  {solutions.map((solution, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-4 bg-white p-4 border transition-colors hover:border-[#00875A]"
                      style={{ borderColor: 'rgba(0,135,90,0.15)', borderRadius: '4px' }}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                    >
                      <div className="w-9 h-9 flex items-center justify-center border flex-shrink-0" style={{ borderColor: '#00875A', borderRadius: '4px' }}>
                        <solution.icon className="w-4 h-4" style={{ color: '#00875A' }} />
                      </div>
                      <div>
                        <p style={{ color: '#1A1A1A' }}>{solution.title}</p>
                        <p className="text-sm" style={{ color: '#6B6B63' }}>{solution.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Insight */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="inline-block text-white px-8 py-5 max-w-2xl" style={{ backgroundColor: '#1A1A1A', borderRadius: '4px' }}>
            <p className="text-base">
              The difference: <span style={{ color: '#00875A' }}>execution</span>, not just conversation.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
