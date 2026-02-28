import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { UserCheck, Target, FileSearch, Shield } from 'lucide-react';

export default function BuiltInAIAgents() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: UserCheck,
      title: 'Human-in-the-Loop Gates',
      description: 'Approvals required for customer-facing, financial, or high-stakes actions. Agents never proceed without explicit permission on critical decisions.'
    },
    {
      icon: Target,
      title: 'Confidence Scoring',
      description: 'Every decision includes a confidence level. Below threshold → immediate escalation with full context. No silent failures or guesswork.'
    },
    {
      icon: FileSearch,
      title: 'Audit Trails',
      description: 'Searchable record of every action + decision with timestamps, rationale, and data sources. Complete visibility into what agents do and why.'
    },
    {
      icon: Shield,
      title: 'Role-Based Access',
      description: 'Least-privilege permissions by agent role. Each agent can only access and modify what it needs for its specific function—nothing more.'
    }
  ];

  return (
    <section ref={ref} className="bg-[#F3F4F6] py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-16 max-w-4xl"
        >
          {/* Eyebrow */}
          <div className="mb-4">
            <span className="text-xs uppercase tracking-widest text-[#84CC16] font-semibold font-['Lora']">
              SAFETY
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-5xl lg:text-6xl mb-6 text-[#1E3D36]"
              style={{ fontFamily: 'Playfair Display, serif' }}>
            Autonomous Does Not Mean Unsupervised
          </h2>

          {/* Body Copy */}
          <div className="space-y-4 text-lg text-[#1E3D36]/70 leading-relaxed font-['Lora']">
            <p>
              The biggest risk with agents isn't capability—it's control. That's why every system includes a Controller layer that enforces approvals, confidence thresholds, and strict permissions.
            </p>
            <p>
              Agents don't "just do things." They act inside rules you define: what's allowed, what requires approval, and what must escalate. Every action is logged. Every decision includes confidence + rationale. And circuit breakers stop execution when something falls outside expected parameters.
            </p>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              className="bg-white border border-gray-200 rounded-3xl p-8 hover:-translate-y-2 hover:border-[#84CC16]/50 transition-all duration-300 shadow-lg"
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-[#84CC16] rounded-2xl flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-gray-900" />
              </div>

              {/* Title */}
              <h3 className="text-2xl text-[#1E3D36] mb-4 font-['Playfair_Display']">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-[#1E3D36]/70 leading-relaxed font-['Lora']">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Proof Line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-[#84CC16]/10 border border-[#84CC16]/20 rounded-2xl px-8 py-4">
            <p className="text-[#1E3D36] font-['Lora'] font-semibold">
              Built for responsible autonomy—fast execution, strict oversight.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
