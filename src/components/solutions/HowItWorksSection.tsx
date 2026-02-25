import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Search, Cpu, Rocket, BarChart3 } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'Discovery & Audit',
    desc: 'We map your workflows, data sources, and bottlenecks to identify the highest-impact AI opportunities.',
    Icon: Search,
  },
  {
    num: '02',
    title: 'Architecture Design',
    desc: 'Custom AI system blueprint — agents, integrations, data pipelines — scoped to your industry and scale.',
    Icon: Cpu,
  },
  {
    num: '03',
    title: 'Build & Deploy',
    desc: 'Production-grade systems launched in 4–6 weeks with full testing, monitoring, and team onboarding.',
    Icon: Rocket,
  },
  {
    num: '04',
    title: 'Measure & Scale',
    desc: 'Continuous optimization with real-time dashboards, ROI tracking, and expansion into new workflows.',
    Icon: BarChart3,
  },
];

export default function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative bg-[#0A211F] py-24 sm:py-32 overflow-hidden">
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(241,238,234,0.06)] to-transparent" />

      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-[#84CC16]/60 uppercase tracking-[0.25em] mb-4"
            style={{ fontSize: '0.65rem', fontWeight: 600 }}
          >
            Our Process
          </p>
          <h2
            className="text-[#F1EEEA] tracking-tight"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 600,
              lineHeight: 1.12,
            }}
          >
            How it <span style={{ fontStyle: 'italic' }}>works</span>
          </h2>
        </motion.div>

        {/* Step cards with connectors */}
        <div className="relative">
          {/* Horizontal connector line (desktop) */}
          <div
            className="hidden lg:block absolute top-[52px] left-[12%] right-[12%] h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(132,204,22,0.15) 15%, rgba(132,204,22,0.15) 85%, transparent)',
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                className="relative rounded-2xl p-7 group"
                style={{
                  background: 'rgba(241,238,234,0.025)',
                  border: '1px solid rgba(241,238,234,0.06)',
                  transition: 'border-color 0.3s, background 0.3s',
                }}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(132,204,22,0.18)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(132,204,22,0.03)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(241,238,234,0.06)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(241,238,234,0.025)';
                }}
              >
                {/* Icon circle */}
                <div
                  className="w-[44px] h-[44px] rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: 'rgba(132,204,22,0.08)',
                    border: '1px solid rgba(132,204,22,0.12)',
                  }}
                >
                  <step.Icon className="w-5 h-5 text-[#84CC16]/70" />
                </div>

                {/* Step number */}
                <span
                  className="text-[#84CC16]/30 block mb-2"
                  style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em' }}
                >
                  STEP {step.num}
                </span>

                <h3
                  className="text-[#F1EEEA]/90 mb-2.5"
                  style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.3 }}
                >
                  {step.title}
                </h3>

                <p
                  className="text-[#F1EEEA]/35"
                  style={{ fontSize: '0.825rem', lineHeight: 1.6 }}
                >
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
