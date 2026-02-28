import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Network, Layers, RefreshCw } from 'lucide-react';

const systemImage = 'https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwd29ya2Zsb3clMjBuZXR3b3JrJTIwY29ubmVjdGlvbnxlbnwxfHx8fDE3NzIyMTY5Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080';

export default function TheAgentSystem() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-[#F4F3EE] py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          {/* Eyebrow */}
          <div className="mb-4">
            <span className="text-xs uppercase tracking-widest text-[#84CC16] font-semibold font-['Lora']">
              THE SYSTEM
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-5xl lg:text-6xl mb-6 text-[#1E3D36]"
              style={{ fontFamily: 'Playfair Display, serif' }}>
            Not One Bot. A Coordinated Team.
          </h2>

          {/* Body Copy */}
          <div className="max-w-4xl space-y-4 text-lg text-[#1E3D36]/70 leading-relaxed font-['Lora']">
            <p>
              A single agent saves time. A coordinated system creates leverage. We architect multi-agent teams where each agent specializes—planning, research, scoring, execution—while a Controller enforces approvals and safety rules.
            </p>
            <p>
              This mirrors how enterprise automation actually works: <strong className="text-[#1E3D36]">orchestrate → delegate → verify → execute → learn</strong>. Need more capacity? Add another Ops agent. Need new capability? Introduce a specialist—without rebuilding the system.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl text-[#1E3D36] mb-6 font-['Playfair_Display']">
              What you get:
            </h3>

            {[
              {
                icon: Layers,
                title: 'Orchestrated roles (not "one bot does everything")',
                description: 'Each agent has a specialized function within the larger system'
              },
              {
                icon: Network,
                title: 'Shared memory + connected tools',
                description: 'Agents work from a unified knowledge base and integrated tool stack'
              },
              {
                icon: RefreshCw,
                title: 'Feedback loop that improves performance weekly',
                description: 'System learns from results and adapts decision-making over time'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="flex gap-4 items-start"
              >
                <div className="w-12 h-12 bg-[#84CC16] rounded-xl flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <h4 className="text-lg text-[#1E3D36] mb-2 font-['Lora'] font-semibold">
                    {benefit.title}
                  </h4>
                  <p className="text-[#1E3D36]/70 text-sm leading-relaxed font-['Lora']">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column - Real-World Examples */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-2xl text-[#1E3D36] mb-6 font-['Playfair_Display']">
              Real-world examples:
            </h3>

            <div className="space-y-6">
              {[
                {
                  title: 'Sales System',
                  description: 'Researches leads, drafts outreach, updates CRM',
                  color: '#1A5063'
                },
                {
                  title: 'Ops System',
                  description: 'Processes requests, routes tickets, triggers workflows',
                  color: '#1A4642'
                },
                {
                  title: 'Content System',
                  description: 'Produces drafts from internal knowledge + approvals',
                  color: '#B8956B'
                }
              ].map((example, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 hover:-translate-y-2 transition-all duration-300"
                  style={{ borderLeftWidth: '4px', borderLeftColor: example.color }}
                >
                  <h4 className="text-xl text-[#1E3D36] mb-2 font-['Playfair_Display']">
                    {example.title}
                  </h4>
                  <p className="text-[#1E3D36]/70 text-sm leading-relaxed font-['Lora']">
                    {example.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 rounded-3xl overflow-hidden shadow-2xl"
            >
              <img src={systemImage} alt="Agent System Network" className="w-full h-64 object-cover" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
