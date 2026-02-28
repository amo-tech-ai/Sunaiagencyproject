import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Code, Target, Sparkles, GitBranch } from 'lucide-react';

const principles = [
  {
    icon: Code,
    title: 'Production-Grade Architecture',
    description:
      'Same stack, same patterns, same quality standards as our full-build engagements. React or Next.js frontend. Node.js or Python backend. PostgreSQL database. The difference is scope, not quality.',
    color: '#B8956B',
  },
  {
    icon: Target,
    title: 'Scoped for Validation',
    description:
      'Every feature in version one exists to answer a specific question: Will users do X? Will they pay for Y? If a feature does not validate a hypothesis, it belongs in version two.',
    color: '#1A5063',
  },
  {
    icon: Sparkles,
    title: 'AI-Native from Day One',
    description:
      'AI is not an afterthought. Whether it is a recommendation engine, an NLP interface, or an automated workflow — the intelligent layer is designed and integrated from the architecture phase.',
    color: '#1A4642',
  },
  {
    icon: GitBranch,
    title: 'Built for Handoff',
    description:
      'Clean code. Comprehensive documentation. Automated testing. CI/CD pipeline. Your future engineering team inherits a codebase they can work with immediately. No reverse-engineering required.',
    color: '#84CC16',
  },
];

export default function MVPFramework() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-[#F4F3EE] py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="mb-16 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-4">
            <span className="text-xs uppercase tracking-widest text-[#2E6F5E] font-semibold font-['Lora']">
              OUR FRAMEWORK
            </span>
          </div>
          <h2
            className="text-5xl lg:text-6xl mb-6 text-[#1E3D36]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Scoped for validation. Built for scale.
          </h2>
          <p className="text-lg text-[#1E3D36]/70 leading-relaxed font-['Lora']">
            There is a critical difference between an MVP and a throwaway prototype. Prototypes are built to demonstrate. MVPs are built to validate — and then to grow. Every product we ship is architected on the same production-grade stack we use for full-scale applications.
          </p>
        </motion.div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <motion.div
                key={principle.title}
                className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg transition-all duration-500 hover:-translate-y-2 group cursor-pointer"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: principle.color }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3
                  className="text-2xl lg:text-3xl mb-4 text-[#1E3D36]"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 400,
                  }}
                >
                  {principle.title}
                </h3>

                {/* Description */}
                <p
                  className="text-base leading-relaxed text-[#1E3D36]/70"
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    lineHeight: '1.7',
                  }}
                >
                  {principle.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Context */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 bg-gradient-to-br from-[#0F3D3E] to-[#1a5f5e] rounded-3xl p-8 lg:p-12 text-white"
        >
          <h3
            className="text-3xl lg:text-4xl mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            No "MVP rebuild" tax
          </h3>
          <p className="text-lg text-white/90 leading-relaxed font-['Lora'] max-w-3xl">
            When your product validates and you are ready to scale — whether that means raising a round, onboarding enterprise clients, or expanding features — the architecture supports it. We do not build technical debt. We build a foundation your future engineering team inherits with confidence.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
