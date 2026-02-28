import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const backgroundImg = 'https://images.unsplash.com/photo-1768323275769-6615e7cfcbe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByb2JvdCUyMGF1dG9tYXRpb24lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MjIxNjk3OHww&ixlib=rb-4.1.0&q=80&w=1080';

export default function AIAgentsHero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: '#0F3D3E' }}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img src={backgroundImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
      </div>

      {/* Dot Pattern Overlay */}
      <div className="absolute inset-0 opacity-5"
           style={{
             backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
             backgroundSize: '30px 30px'
           }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8 }}
          >
            {/* Eyebrow */}
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-[#84CC16] font-semibold font-['Lora']">
                AI AGENTS
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-7xl xl:text-8xl mb-8 text-white leading-[1.1]"
                style={{ fontFamily: 'Playfair Display, serif' }}>
              AI Agents That Run Operations—{' '}
              <span className="italic">Not Just Conversations</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg lg:text-xl text-white/90 mb-12 leading-relaxed font-['Lora']">
              Coordinated digital workers that plan, execute, and improve multi-step workflows—with human oversight where it matters. Replace repetitive ops with automation that scales.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="bg-[#84CC16] text-gray-900 px-8 py-4 rounded-full font-semibold font-['Lora'] hover:bg-[#73b512] hover:shadow-lg hover:shadow-[#84CC16]/30 transition-all duration-300 flex items-center justify-center gap-2">
                Explore Agent Capabilities
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-white/20 text-white px-8 py-4 rounded-full font-semibold font-['Lora'] hover:bg-white/10 hover:border-white/40 transition-all duration-300">
                Build Your Agent System
              </button>
            </div>

            {/* Proof Line */}
            <p className="text-sm text-white/60 mb-6 font-['Lora']">
              Powering 150+ autonomous workflows across sales, operations, and content.
            </p>

            {/* Micro-Trust Bullets */}
            <div className="space-y-3">
              {[
                'Human-in-the-loop gates for critical actions',
                'Real integrations (CRM, inbox, databases, tools)',
                'Logged decisions + measurable outcomes'
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-[#84CC16] flex-shrink-0" />
                  <span className="text-white/80 text-sm font-['Lora']">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Visual Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Agent System Diagram Card */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="mb-6">
                  <div className="inline-block bg-[#84CC16] text-gray-900 px-4 py-2 rounded-full text-xs font-bold font-['Lora']">
                    ORCHESTRATOR
                  </div>
                </div>
                
                <h3 className="text-2xl text-white mb-4 font-['Playfair_Display']">
                  Coordinated Agent Team
                </h3>
                
                <div className="space-y-3">
                  {[
                    { name: 'Planner', status: 'Sequencing tasks' },
                    { name: 'Retriever', status: 'Pulling knowledge' },
                    { name: 'Ops', status: 'Executing actions' },
                    { name: 'Controller', status: 'Enforcing rules' }
                  ].map((agent, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#84CC16] rounded-full animate-pulse" />
                        <span className="text-white font-['Lora'] font-medium">{agent.name}</span>
                      </div>
                      <span className="text-white/60 text-sm font-['Lora']">{agent.status}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60 font-['Lora']">Active Workflows</span>
                    <span className="text-[#84CC16] font-bold font-['Lora']">37 running</span>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-[#84CC16] text-gray-900 rounded-2xl p-4 shadow-xl"
              >
                <div className="text-3xl font-bold font-['Playfair_Display']">94%</div>
                <div className="text-xs font-['Lora'] font-semibold">Automation Rate</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
