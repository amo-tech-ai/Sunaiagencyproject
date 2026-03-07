// C25 — How It Works Section (Solutions Page)
// BCG design system: charcoal dark variant, green accents, Georgia serif

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
    desc: 'Production-grade systems launched in 4-6 weeks with full testing, monitoring, and team onboarding.',
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
    <section ref={ref} className="border-t" style={{ backgroundColor: '#1A1A1A', borderColor: '#E8E8E4' }}>
      <div className="max-w-[1120px] mx-auto px-6 py-20 md:py-28">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-xs tracking-widest uppercase mb-3"
            style={{ color: '#00875A', letterSpacing: '0.08em' }}
          >
            Our Process
          </p>
          <h2
            className="text-2xl md:text-3xl"
            style={{
              fontFamily: 'Georgia, serif',
              fontWeight: 400,
              color: '#F5F5F0',
              lineHeight: 1.15,
            }}
          >
            How it works
          </h2>
          <div className="mt-4 mx-auto h-0.5 w-12" style={{ backgroundColor: '#00875A' }} />
        </motion.div>

        {/* Step cards */}
        <div className="relative">
          {/* Horizontal connector line (desktop) */}
          <div
            className="hidden lg:block absolute top-[48px] left-[10%] right-[10%] h-px"
            style={{ backgroundColor: 'rgba(245, 245, 240, 0.08)' }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                className="relative rounded p-6"
                style={{
                  backgroundColor: 'rgba(245, 245, 240, 0.03)',
                  border: '1px solid rgba(245, 245, 240, 0.08)',
                  borderRadius: '4px',
                }}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
              >
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'rgba(0, 135, 90, 0.12)', borderRadius: '4px' }}
                >
                  <step.Icon className="w-5 h-5" style={{ color: '#00875A' }} />
                </div>

                {/* Step number */}
                <span
                  className="text-xs tracking-widest uppercase block mb-2"
                  style={{ color: 'rgba(0, 135, 90, 0.6)', letterSpacing: '0.08em' }}
                >
                  Step {step.num}
                </span>

                <h3
                  className="text-base mb-2"
                  style={{ fontFamily: 'Georgia, serif', color: '#F5F5F0' }}
                >
                  {step.title}
                </h3>

                <p className="text-sm" style={{ color: 'rgba(245, 245, 240, 0.45)', lineHeight: 1.6 }}>
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
