import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { TrendingUp, Workflow, FileText } from 'lucide-react';

export default function AIAgentsUseCases() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const useCases = [
    {
      icon: TrendingUp,
      title: 'Sales Pipeline Automation',
      workflow: 'Leads arrive → enrichment → scoring → personalized outreach → CRM updates',
      result: 'Full coverage without building a 4-person SDR machine.',
      example: 'Retriever pulls company + role data, Scorer ranks fit, Content drafts tailored sequences, Ops sends + logs, Controller gates high-value deals for approval.',
      color: '#84CC16'
    },
    {
      icon: Workflow,
      title: 'Operations Management',
      workflow: 'Requests/orders arrive → verify → route → notify → exception handling',
      result: 'Faster processing, fewer mistakes, less headcount pressure.',
      example: 'Planner sequences tasks, Retriever checks inventory/policies, Ops runs updates and notifications, Analyst flags recurring issues.',
      color: '#A8CED8'
    },
    {
      icon: FileText,
      title: 'Content Production at Scale',
      workflow: 'Calendar planning → research → drafting → QA → approvals → publishing',
      result: 'More output, consistent quality, predictable review cycles.',
      example: 'Retriever pulls brand rules + past winners, Content drafts, Scorer checks quality criteria, Controller routes high-visibility pieces for approval.',
      color: '#E8D4D8'
    }
  ];

  return (
    <section ref={ref} className="relative py-32 lg:py-40 overflow-hidden" style={{ backgroundColor: '#0F3D3E' }}>
      {/* Dot Pattern Background */}
      <div className="absolute inset-0 opacity-5"
           style={{
             backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
             backgroundSize: '30px 30px'
           }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
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
              USE CASES
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-5xl lg:text-6xl mb-6 text-white"
              style={{ fontFamily: 'Playfair Display, serif' }}>
            Where Agents Create the Most Leverage
          </h2>

          {/* Body */}
          <p className="text-lg text-white/70 leading-relaxed font-['Lora'] max-w-4xl">
            Agents shine in workflows that are multi-step, repetitive, and context-heavy—where delays cost revenue and manual work burns your best people. Here are three proven scenarios where agent systems deliver compounding operational leverage.
          </p>
        </motion.div>

        {/* Use Case Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-[#84CC16]/50 hover:-translate-y-2 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                   style={{ backgroundColor: useCase.color }}>
                <useCase.icon className="w-7 h-7 text-gray-900" />
              </div>

              {/* Title */}
              <h3 className="text-2xl lg:text-3xl mb-4 text-white font-['Playfair_Display']">
                {useCase.title}
              </h3>

              {/* Workflow */}
              <div className="mb-4 pb-4 border-b border-white/10">
                <p className="text-xs uppercase tracking-wider text-[#84CC16] mb-2 font-['Lora'] font-semibold">
                  What happens
                </p>
                <p className="text-sm text-white/80 leading-relaxed font-['Lora']">
                  {useCase.workflow}
                </p>
              </div>

              {/* Result */}
              <div className="mb-4 pb-4 border-b border-white/10">
                <p className="text-xs uppercase tracking-wider text-[#84CC16] mb-2 font-['Lora'] font-semibold">
                  Result
                </p>
                <p className="text-sm text-white/90 leading-relaxed font-['Lora'] font-semibold">
                  {useCase.result}
                </p>
              </div>

              {/* Example */}
              <div>
                <p className="text-xs uppercase tracking-wider text-[#84CC16] mb-2 font-['Lora'] font-semibold">
                  Example
                </p>
                <p className="text-sm text-white/70 leading-relaxed font-['Lora']">
                  {useCase.example}
                </p>
              </div>
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
            <p className="text-white font-['Lora'] font-semibold">
              Best fit when the work is repetitive, expensive, and easy to standardize.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
