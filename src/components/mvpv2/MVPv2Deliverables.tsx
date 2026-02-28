import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function MVPv2Deliverables() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const phases = [
    {
      week: 'Week 1',
      title: 'Scope Workshop',
      description:
        'Define v1 with ruthless focus. We prioritize features around one measurable hypothesis.',
      color: '#F5F5F0',
    },
    {
      week: 'Week 1–2',
      title: 'Architecture & Data Design',
      description:
        'Database schema, AI capability map, APIs, integrations, deployment plan.',
      color: '#E8E4D8',
    },
    {
      week: 'Week 2–4',
      title: 'Core Build (2 Sprints)',
      description:
        'Daily visibility, staging environment, weekly releases, tight feedback loop.',
      color: '#D4E8E0',
    },
    {
      week: 'Week 4–5',
      title: 'AI Integration + Product Polish',
      description:
        'AI features wired in (search, recommendations, automation), UI refinement, performance pass.',
      color: '#B8D6A8',
    },
    {
      week: 'Week 5–6',
      title: 'Launch & Onboarding',
      description:
        'Production deploy, monitoring, analytics, admin training, handoff docs.',
      color: '#E6D4C0',
    },
    {
      week: 'Post-Launch',
      title: '30 Days Support',
      description:
        'Bug fixes + weekly review of usage data → v2 priorities.',
      color: '#C4D8D4',
    },
  ];

  return (
    <section ref={ref} className="bg-white py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="mb-16 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-4">
            <span className="text-xs uppercase tracking-widest text-[#84CC16] font-semibold font-['Lora']">
              DELIVERABLES
            </span>
          </div>
          <h2
            className="text-5xl lg:text-6xl mb-6 text-[#1E3D36]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            From Concept to Deployed Product
          </h2>
          <p className="text-lg text-[#1E3D36]/70 leading-relaxed font-['Lora']">
            You get a complete MVP engagement: scope, architecture, design,
            build, AI integration, deployment, and launch support. This is not a
            clickable prototype. It's a real product you can onboard users into.
          </p>
        </motion.div>

        {/* Phase Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {phases.map((phase, index) => (
            <motion.div
              key={index}
              className="rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: phase.color }}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="mb-4">
                <span className="text-xs uppercase tracking-widest text-[#84CC16] font-semibold font-['Lora']">
                  {phase.week}
                </span>
              </div>
              <h3
                className="text-2xl mb-4 text-[#1E3D36]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {phase.title}
              </h3>
              <p className="text-[#1E3D36]/70 font-['Lora'] leading-relaxed">
                {phase.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Real-World MVP Examples */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3
            className="text-3xl lg:text-4xl mb-8 text-[#1E3D36]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Real-World MVP Examples
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'AI Support Inbox',
                description:
                  'Web chat + helpdesk triage + "suggested replies" trained on your docs',
                color: '#E8D4D8',
              },
              {
                title: 'Internal Ops Copilot',
                description:
                  'One dashboard that answers team questions + automates routine workflows',
                color: '#D4E8E0',
              },
              {
                title: 'Lead-to-Call Funnel',
                description:
                  'Landing page + qualification + booking + CRM capture + follow-up automation',
                color: '#B8D6A8',
              },
            ].map((example, index) => (
              <motion.div
                key={index}
                className="rounded-3xl p-8 shadow-lg"
                style={{ backgroundColor: example.color }}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
              >
                <h4
                  className="text-xl mb-4 text-[#1E3D36]"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {example.title}
                </h4>
                <p className="text-[#1E3D36]/70 font-['Lora']">
                  {example.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
