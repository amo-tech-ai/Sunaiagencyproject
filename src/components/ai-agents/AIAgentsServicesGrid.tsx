import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface AgentCard {
  id: string;
  number: string;
  title: string;
  description: string;
  tier: 'Enterprise' | 'Advanced' | 'Core';
  backgroundColor: string;
  textColor: string;
  imageUrl?: string;
  imagePosition: 'bottom' | 'center' | 'right';
}

const agentsData: AgentCard[] = [
  {
    id: 'orchestrator',
    number: '01',
    title: 'Orchestrator',
    description: 'The coordinator. Accepts goals, assigns tasks, monitors execution, handles exceptions.',
    tier: 'Enterprise',
    backgroundColor: '#1A5063',
    textColor: '#FFFFFF',
    imageUrl: 'https://images.unsplash.com/photo-1730098482564-259a89064e47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmNoZXN0cmF0aW9uJTIwY29uZHVjdG9yJTIwbGVhZGVyc2hpcHxlbnwxfHx8fDE3NzIyMTcwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    imagePosition: 'center'
  },
  {
    id: 'planner',
    number: '02',
    title: 'Planner',
    description: 'Breaks goals into steps, sequences tasks, manages dependencies, adapts mid-flight.',
    tier: 'Advanced',
    backgroundColor: '#B8956B',
    textColor: '#2A2A2A',
    imageUrl: 'https://images.unsplash.com/photo-1758873268180-d95d10c86588?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBsYW5uaW5nJTIwc3RyYXRlZ3klMjBib2FyZHxlbnwxfHx8fDE3NzIyMTcwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    imagePosition: 'bottom'
  },
  {
    id: 'analyst',
    number: '03',
    title: 'Analyst',
    description: 'Finds patterns, summarizes insights, prepares decision-ready outputs.',
    tier: 'Advanced',
    backgroundColor: '#E8D4D8',
    textColor: '#2A2A2A',
    imageUrl: 'https://images.unsplash.com/photo-1758876202980-0a28b744fb24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHlzaXMlMjBkYXNoYm9hcmQlMjBjaGFydHN8ZW58MXx8fHwxNzcyMjE3MDUyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    imagePosition: 'center'
  },
  {
    id: 'scorer',
    number: '04',
    title: 'Scorer',
    description: 'Ranks leads/opportunities/risks using criteria you define—outputs confidence scores.',
    tier: 'Advanced',
    backgroundColor: '#1A4642',
    textColor: '#FFFFFF',
    imageUrl: 'https://images.unsplash.com/photo-1560785496-321917f24016?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY29yaW5nJTIwcmFua2luZyUyMGV2YWx1YXRpb24lMjBzeXN0ZW18ZW58MXx8fHwxNzcyMjE3MDUyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    imagePosition: 'bottom'
  },
  {
    id: 'retriever',
    number: '05',
    title: 'Retriever',
    description: 'Pulls the right info from knowledge bases + tools (RAG-powered retrieval).',
    tier: 'Advanced',
    backgroundColor: '#E6E3D0',
    textColor: '#2A2A2A',
    imageUrl: 'https://images.unsplash.com/photo-1616861771635-49063a4636ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMGV4dHJhY3Rpb24lMjBkYXRhJTIwZW50cnl8ZW58MXx8fHwxNzcyMjE3MDY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    imagePosition: 'center'
  },
  {
    id: 'optimizer',
    number: '06',
    title: 'Optimizer',
    description: 'Tracks performance, identifies bottlenecks, suggests parameter + workflow improvements.',
    tier: 'Advanced',
    backgroundColor: '#A8CED8',
    textColor: '#2A2A2A',
    imageUrl: 'https://images.unsplash.com/photo-1763031644012-c4b972600c5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcHRpbWl6YXRpb24lMjBwZXJmb3JtYW5jZSUyMGltcHJvdmVtZW50fGVufDF8fHx8MTc3MjIxNzA1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    imagePosition: 'bottom'
  },
  {
    id: 'controller',
    number: '07',
    title: 'Controller',
    description: 'The safety layer. Enforces approvals, thresholds, spend limits, and permissions.',
    tier: 'Core',
    backgroundColor: '#1A5063',
    textColor: '#FFFFFF',
    imageUrl: 'https://images.unsplash.com/photo-1697382608786-bcf4c113b86e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWN1cml0eSUyMGNvbnRyb2wlMjBwYW5lbCUyMGxvY2tzfGVufDF8fHx8MTc3MjIxNzA1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    imagePosition: 'center'
  },
  {
    id: 'ops',
    number: '08',
    title: 'Ops',
    description: 'Executes tasks at volume: updates records, triggers automations, makes API calls.',
    tier: 'Core',
    backgroundColor: '#B8956B',
    textColor: '#2A2A2A',
    imageUrl: 'https://images.unsplash.com/photo-1759673824858-d4050871d322?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcGVyYXRpb25zJTIwd29ya2Zsb3clMjBwcm9jZXNzJTIwbWFuYWdlbWVudHxlbnwxfHx8fDE3NzIyMTcwNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    imagePosition: 'bottom'
  },
  {
    id: 'content',
    number: '09',
    title: 'Content',
    description: 'Drafts proposals, emails, reports, documentation—aligned to brand + templates.',
    tier: 'Core',
    backgroundColor: '#E8D4D8',
    textColor: '#2A2A2A',
    imageUrl: 'https://images.unsplash.com/photo-1758874385949-cec80d549f67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW50JTIwd3JpdGluZyUyMGNyZWF0aXZlJTIwd29ya3NwYWNlfGVufDF8fHx8MTc3MjIxNzA2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    imagePosition: 'center'
  },
  {
    id: 'extractor',
    number: '10',
    title: 'Extractor',
    description: 'Turns messy inputs (PDFs, emails, forms) into clean structured data.',
    tier: 'Core',
    backgroundColor: '#1A4642',
    textColor: '#FFFFFF',
    imageUrl: 'https://images.unsplash.com/photo-1616861771635-49063a4636ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMGV4dHJhY3Rpb24lMjBkYXRhJTIwZW50cnl8ZW58MXx8fHwxNzcyMjE3MDY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    imagePosition: 'bottom'
  }
];

export default function AIAgentsServicesGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-white py-32 lg:py-40">
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
              AGENT ROLES
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-5xl lg:text-6xl mb-6 text-[#1E3D36]"
              style={{ fontFamily: 'Playfair Display, serif' }}>
            10 Agent Roles for Every Part of Your Business
          </h2>

          {/* Body */}
          <p className="text-lg text-[#1E3D36]/70 leading-relaxed font-['Lora'] max-w-4xl">
            Every agent has defined inputs, outputs, and escalation rules. Most teams start with <strong className="text-[#1E3D36]">3–4 agents</strong> (Planner, Retriever, Ops, Controller), then expand as the system proves ROI. All roles plug into the same orchestration layer—so adding new capability later is a configuration change, not a rebuild.
          </p>
        </motion.div>

        {/* Agent Cards Grid */}
        <div className="space-y-12">
          {/* Enterprise Tier */}
          <div>
            <h3 className="text-2xl text-[#1E3D36] mb-6 font-['Playfair_Display']">Enterprise Tier</h3>
            <div className="grid grid-cols-1 gap-6">
              {agentsData.filter(a => a.tier === 'Enterprise').map((agent, index) => (
                <AgentCardComponent key={agent.id} agent={agent} index={index} isInView={isInView} />
              ))}
            </div>
          </div>

          {/* Advanced Tier */}
          <div>
            <h3 className="text-2xl text-[#1E3D36] mb-6 font-['Playfair_Display']">Advanced Tier</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentsData.filter(a => a.tier === 'Advanced').map((agent, index) => (
                <AgentCardComponent key={agent.id} agent={agent} index={index} isInView={isInView} />
              ))}
            </div>
          </div>

          {/* Core Tier */}
          <div>
            <h3 className="text-2xl text-[#1E3D36] mb-6 font-['Playfair_Display']">Core Tier</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {agentsData.filter(a => a.tier === 'Core').map((agent, index) => (
                <AgentCardComponent key={agent.id} agent={agent} index={index} isInView={isInView} />
              ))}
            </div>
          </div>
        </div>

        {/* Proof Line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-[#1E3D36]/60 font-['Lora'] font-semibold">
            Start lean. Expand safely. Scale predictably.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function AgentCardComponent({ agent, index, isInView }: { agent: AgentCard; index: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="relative rounded-3xl overflow-hidden shadow-lg hover:-translate-y-2 transition-all duration-300 group"
      style={{
        backgroundColor: agent.backgroundColor,
        minHeight: '340px'
      }}
    >
      {/* Image Background */}
      {agent.imageUrl && (
        <div className="absolute inset-0">
          <img 
            src={agent.imageUrl} 
            alt={agent.title}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              agent.imagePosition === 'bottom' ? 'object-bottom' :
              agent.imagePosition === 'right' ? 'object-right' :
              'object-center'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-8 h-full flex flex-col justify-end">
        {/* Number Badge */}
        <div className="mb-4">
          <span className="inline-block bg-[#84CC16] text-gray-900 px-3 py-1 rounded-full text-xs font-bold font-['Lora']">
            {agent.number}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl lg:text-3xl mb-3 font-['Playfair_Display']"
            style={{ color: agent.textColor }}>
          {agent.title}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed"
           style={{ color: agent.textColor === '#FFFFFF' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(42, 42, 42, 0.8)' }}>
          {agent.description}
        </p>
      </div>
    </motion.div>
  );
}
