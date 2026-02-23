import { ArrowRight } from 'lucide-react';

export default function AgentSystemDiagram() {
  return (
    <section className="bg-[#FDFCFB] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-gray-900 mb-8 text-center">
          How Agents Work Together
        </h2>
        
        <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
          A coordinated system where each agent has a specific role and humans maintain control
        </p>

        {/* Desktop Flow Diagram */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Phase 1: Plan & Coordinate */}
            <div className="mb-16">
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-6 text-center">
                Phase 1: Plan & Coordinate
              </div>
              <div className="grid grid-cols-3 gap-8">
                <AgentNode 
                  title="Orchestrator" 
                  description="Routes tasks to right agents"
                />
                <AgentNode 
                  title="Planner" 
                  description="Creates execution strategy"
                />
                <AgentNode 
                  title="Retriever" 
                  description="Gathers context & data"
                />
              </div>
            </div>

            {/* Arrow Down */}
            <div className="flex justify-center mb-8">
              <ArrowRight className="w-8 h-8 text-[#F59E0B] rotate-90" />
            </div>

            {/* Phase 2: Analyze & Decide */}
            <div className="mb-16">
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-6 text-center">
                Phase 2: Analyze & Decide
              </div>
              <div className="grid grid-cols-3 gap-8">
                <AgentNode 
                  title="Analyst" 
                  description="Evaluates options & patterns"
                />
                <AgentNode 
                  title="Scorer" 
                  description="Rates decisions by priority"
                />
                <AgentNode 
                  title="Optimizer" 
                  description="Refines approach"
                />
              </div>
            </div>

            {/* Arrow Down */}
            <div className="flex justify-center mb-8">
              <ArrowRight className="w-8 h-8 text-[#F59E0B] rotate-90" />
            </div>

            {/* Phase 3: Control & Execute */}
            <div className="mb-8">
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-6 text-center">
                Phase 3: Control & Execute
              </div>
              <div className="grid grid-cols-4 gap-8">
                <AgentNode 
                  title="Controller" 
                  description="Approval gate"
                  highlight
                />
                <AgentNode 
                  title="Ops Agent" 
                  description="Executes tasks"
                />
                <AgentNode 
                  title="Content Agent" 
                  description="Creates output"
                />
                <AgentNode 
                  title="Extractor" 
                  description="Processes data"
                />
              </div>
            </div>

            {/* Human Override */}
            <div className="mt-12 text-center p-6 border border-[#F59E0B] bg-[#FFFBEB]">
              <p className="text-sm font-medium text-gray-900">
                <span className="text-[#F59E0B]">Human Override:</span> Approval required at critical decision points
              </p>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Simplified */}
        <div className="lg:hidden space-y-6">
          <SimplifiedPhase 
            phase="1" 
            title="Plan & Coordinate" 
            agents={['Orchestrator', 'Planner', 'Retriever']}
          />
          <SimplifiedPhase 
            phase="2" 
            title="Analyze & Decide" 
            agents={['Analyst', 'Scorer', 'Optimizer']}
          />
          <SimplifiedPhase 
            phase="3" 
            title="Control & Execute" 
            agents={['Controller (Gate)', 'Ops Agent', 'Content Agent', 'Extractor']}
          />
          <div className="p-6 border border-[#F59E0B] bg-[#FFFBEB] text-center">
            <p className="text-sm font-medium text-gray-900">
              <span className="text-[#F59E0B]">Human Override:</span> Always in control
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AgentNode({ 
  title, 
  description, 
  highlight = false 
}: { 
  title: string; 
  description: string; 
  highlight?: boolean;
}) {
  return (
    <div className={`p-6 border ${highlight ? 'border-[#F59E0B] bg-[#FFFBEB]' : 'border-gray-200 bg-white'} hover:border-[#F59E0B] transition-colors duration-200`}>
      <h4 className="font-medium text-gray-900 mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function SimplifiedPhase({ 
  phase, 
  title, 
  agents 
}: { 
  phase: string; 
  title: string; 
  agents: string[];
}) {
  return (
    <div className="border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-8 h-8 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-sm font-medium">
          {phase}
        </span>
        <h4 className="font-medium text-gray-900">{title}</h4>
      </div>
      <div className="pl-11 space-y-2">
        {agents.map((agent, i) => (
          <p key={i} className="text-sm text-gray-600">• {agent}</p>
        ))}
      </div>
    </div>
  );
}
