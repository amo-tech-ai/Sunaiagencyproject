import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Shield, Target, Sparkles, Handshake } from 'lucide-react';

export default function MVPv2Framework() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const principles = [
    {
      icon: Shield,
      title: 'Production-Grade Architecture',
      description:
        'Same engineering standards as full-scale builds. The difference is scope—not quality.',
    },
    {
      icon: Target,
      title: 'Scoped for Validation',
      description:
        'Every v1 feature proves something: demand, willingness to pay, workflow lift, retention.',
    },
    {
      icon: Sparkles,
      title: 'AI-Native from Day One',
      description:
        'AI is designed into the system early (not bolted on at the end).',
    },
    {
      icon: Handshake,
      title: 'Built for Handoff',
      description:
        'Documentation, CI/CD, clear structure—so your future team can continue immediately.',
    },
  ];

  return (
    <section ref={ref} className="bg-[#F4F3EE] py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="max-w-4xl mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-4">
            <span className="text-xs uppercase tracking-widest text-[#84CC16] font-semibold font-['Lora']">
              FRAMEWORK
            </span>
          </div>
          <h2
            className="text-5xl lg:text-6xl mb-8 text-[#1E3D36]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Scoped for Validation. <span className="italic">Built</span> for
            Scale.
          </h2>
          <p className="text-lg text-[#1E3D36]/70 leading-relaxed font-['Lora']">
            Most MVPs fail because they're built like demos. We build MVPs like
            foundations: clean architecture, tested flows, and deployment
            discipline—so if it works, you can scale without rebuilding from
            scratch.
          </p>
        </motion.div>

        {/* 2x2 Principles Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <motion.div
                key={index}
                className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-[#84CC16]/10 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-[#84CC16]" />
                    </div>
                  </div>
                  <div>
                    <h3
                      className="text-2xl mb-4 text-[#1E3D36]"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {principle.title}
                    </h3>
                    <p className="text-[#1E3D36]/70 font-['Lora'] leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Anti-bullshit Line */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-sm text-[#1E3D36]/60 font-['Lora'] italic">
            No vague timelines. No "phase 2 will fix it." v1 ships with real
            capabilities.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
