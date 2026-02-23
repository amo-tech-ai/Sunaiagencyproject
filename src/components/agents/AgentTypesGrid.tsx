import { 
  Network, 
  Calendar, 
  BarChart, 
  Target, 
  Shield, 
  Zap, 
  FileText, 
  Database, 
  Package, 
  TrendingUp 
} from 'lucide-react';

interface Agent {
  name: string;
  tier: 'Core' | 'Advanced' | 'Enterprise';
  description: string;
  outcome: string;
  icon: any;
}

export default function AgentTypesGrid() {
  const agents: Agent[] = [
    {
      name: 'Orchestrator',
      tier: 'Enterprise',
      description: 'Routes tasks to the right agents and manages workflow coordination',
      outcome: 'Nothing breaks, no duplicates, seamless operation',
      icon: Network,
    },
    {
      name: 'Planner',
      tier: 'Advanced',
      description: 'Creates execution strategies and determines optimal action sequences',
      outcome: 'Strategic execution, not reactive responses',
      icon: Calendar,
    },
    {
      name: 'Analyst',
      tier: 'Advanced',
      description: 'Evaluates patterns, identifies trends, and surfaces insights',
      outcome: 'Better decisions based on data, not gut feel',
      icon: BarChart,
    },
    {
      name: 'Scorer',
      tier: 'Advanced',
      description: 'Rates and prioritizes decisions by business impact',
      outcome: 'Focus on high-value opportunities first',
      icon: Target,
    },
    {
      name: 'Controller (Approval Gate)',
      tier: 'Core',
      description: 'Human-in-the-loop approval for critical decisions',
      outcome: 'Humans stay in control, AI executes safely',
      icon: Shield,
    },
    {
      name: 'Ops Automation',
      tier: 'Core',
      description: 'Executes recurring workflows and operational tasks',
      outcome: 'Hours saved weekly on repetitive work',
      icon: Zap,
    },
    {
      name: 'Content & Comms',
      tier: 'Core',
      description: 'Creates messages, emails, and communication content',
      outcome: 'Consistent output without manual effort',
      icon: FileText,
    },
    {
      name: 'Retriever (RAG)',
      tier: 'Advanced',
      description: 'Searches and retrieves relevant context from your data',
      outcome: 'Accurate responses backed by your knowledge base',
      icon: Database,
    },
    {
      name: 'Extractor',
      tier: 'Core',
      description: 'Processes and structures data from documents and systems',
      outcome: 'Clean data without manual entry',
      icon: Package,
    },
    {
      name: 'Optimizer',
      tier: 'Advanced',
      description: 'Continuously improves workflows based on performance',
      outcome: 'Systems get better over time automatically',
      icon: TrendingUp,
    },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Core': return 'bg-gray-100 text-gray-700';
      case 'Advanced': return 'bg-[#FFFBEB] text-[#92400E]';
      case 'Enterprise': return 'bg-[#FEF3C7] text-[#78350F]';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-gray-900 mb-6">
            AI Agent Types
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each agent has a specific role in your business system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, index) => (
            <div
              key={index}
              className="border border-gray-200 p-8 hover:border-[#F59E0B] transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 flex items-center justify-center border border-gray-200 group-hover:border-[#F59E0B] transition-colors">
                  <agent.icon className="w-6 h-6 text-gray-700" />
                </div>
                <span className={`px-3 py-1 text-xs font-medium uppercase tracking-wider ${getTierColor(agent.tier)}`}>
                  {agent.tier}
                </span>
              </div>

              <h3 className="font-serif text-2xl text-gray-900 mb-3">
                {agent.name}
              </h3>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {agent.description}
              </p>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-4">
                  <span className="font-medium text-gray-900">Outcome:</span> {agent.outcome}
                </p>
                <button className="text-sm font-medium text-[#F59E0B] hover:text-[#D97706] transition-colors">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
