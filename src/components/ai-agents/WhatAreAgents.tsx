import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { FileText, Target, TrendingUp } from 'lucide-react';

export default function WhatAreAgents() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-white py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8 }}
          >
            {/* Eyebrow */}
            <div className="mb-4">
              <span className="text-xs uppercase tracking-widest text-[#84CC16] font-semibold font-['Lora']">
                DEFINITION
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-5xl lg:text-6xl mb-6 text-[#1E3D36]"
                style={{ fontFamily: 'Playfair Display, serif' }}>
              Think Employees, Not Software
            </h2>

            {/* Body Copy */}
            <div className="space-y-4 text-lg text-[#1E3D36]/70 leading-relaxed font-['Lora']">
              <p>
                An AI agent isn't a chatbot—and it's not a brittle automation rule. It's a <strong className="text-[#1E3D36]">digital worker</strong> with a defined role, access to specific data, the ability to take real actions, and the judgment to escalate when confidence is low.
              </p>
              <p>
                Each agent we deploy has a job description: what it can read, what it can do, what "done" looks like, and when it must ask for approval. Instead of you managing tools, you manage outcomes.
              </p>
              <p>
                Traditional automation follows if/then logic. Agents work with context, evaluate options, and choose the next best step—then learn from results over time.
              </p>
            </div>

            {/* Proof Line */}
            <div className="mt-8 p-4 bg-[#F4F3EE] rounded-2xl border border-[#1E3D36]/10">
              <p className="text-sm text-[#1E3D36] font-['Lora'] font-semibold">
                Built around explicit boundaries, audit trails, and approval thresholds.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Quick Scan Bullets */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {[
              {
                icon: FileText,
                title: 'Reads structured + unstructured data',
                description: 'Docs, emails, CRM notes—agents understand context, not just keywords'
              },
              {
                icon: Target,
                title: 'Makes decisions with confidence scoring',
                description: 'Every action includes a confidence level; low confidence triggers escalation'
              },
              {
                icon: TrendingUp,
                title: 'Escalates with full context',
                description: 'Not silent failures—agents provide complete context when asking for help'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white border border-gray-200 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 shadow-lg"
              >
                <div className="w-12 h-12 bg-[#84CC16] rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-xl text-[#1E3D36] mb-2 font-['Playfair_Display']">
                  {item.title}
                </h3>
                <p className="text-[#1E3D36]/70 text-sm leading-relaxed font-['Lora']">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
