import { ArrowRight, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function AgentSystemDiagram() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const agents = [
    { id: 'orchestrator', name: 'Orchestrator', role: 'Routes conversations & tasks' },
    { id: 'analyst', name: 'Analyst', role: 'Understands intent & context' },
    { id: 'retriever', name: 'Retriever (RAG)', role: 'Pulls accurate info from docs' },
    { id: 'ops', name: 'Ops Automation', role: 'Executes workflows' },
    { id: 'scorer', name: 'Scorer', role: 'Rates lead quality' },
    { id: 'controller', name: 'Controller', role: 'Applies rules & approvals', highlight: true },
  ];

  return (
    <section ref={sectionRef} className="bg-[#1A1A1A] py-24 md:py-32 overflow-hidden relative">
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-white mb-6">
            AI Agents Behind the Chatbot
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Your chatbot is powered by <span className="text-white font-medium">specialized AI agents</span>, not a single brain
          </p>
        </div>

        {/* Desktop: Horizontal Flow */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Agent Flow */}
            <div className="flex items-center justify-center gap-4 mb-12">
              {agents.map((agent, index) => (
                <div key={agent.id} className="flex items-center">
                  {/* Agent Card */}
                  <div
                    className={`p-6 border w-48 transition-all duration-700 ${
                      agent.highlight
                        ? 'border-[#F59E0B] bg-[#2A2416]'
                        : 'border-gray-700 bg-[#262626]'
                    } ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <h4 className="font-medium text-white mb-2 text-sm">
                      {agent.name}
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {agent.role}
                    </p>
                    {agent.highlight && (
                      <div className="mt-3 pt-3 border-t border-[#F59E0B]">
                        <p className="text-xs text-[#F59E0B] uppercase tracking-wider">
                          Approval Gate
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  {index < agents.length - 1 && (
                    <ArrowRight 
                      className={`w-6 h-6 text-[#F59E0B] mx-3 transition-all duration-700 ${
                        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      }`}
                      style={{ transitionDelay: `${index * 100 + 50}ms` }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Human-in-the-Loop Connection */}
            <div 
              className={`flex items-center justify-center gap-4 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <div className="w-16 h-0.5 bg-[#F59E0B]" />
              <div className="flex items-center gap-3 bg-[#2A2416] border border-[#F59E0B] px-6 py-4">
                <User className="w-5 h-5 text-[#F59E0B]" />
                <span className="text-white text-sm font-medium">Human-in-the-Loop</span>
              </div>
              <div className="w-16 h-0.5 bg-[#F59E0B]" />
            </div>
          </div>
        </div>

        {/* Mobile/Tablet: Vertical Flow */}
        <div className="lg:hidden space-y-4">
          {agents.map((agent, index) => (
            <div key={agent.id}>
              <div
                className={`p-6 border transition-all duration-700 ${
                  agent.highlight
                    ? 'border-[#F59E0B] bg-[#2A2416]'
                    : 'border-gray-700 bg-[#262626]'
                } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h4 className="font-medium text-white mb-2">
                  {agent.name}
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {agent.role}
                </p>
                {agent.highlight && (
                  <div className="mt-4 pt-4 border-t border-[#F59E0B]">
                    <p className="text-xs text-[#F59E0B] uppercase tracking-wider">
                      Approval Gate
                    </p>
                  </div>
                )}
              </div>
              {index < agents.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowRight className="w-6 h-6 text-[#F59E0B] rotate-90" />
                </div>
              )}
            </div>
          ))}

          {/* Human-in-the-Loop */}
          <div className="mt-8 flex items-center gap-3 bg-[#2A2416] border border-[#F59E0B] px-6 py-4">
            <User className="w-5 h-5 text-[#F59E0B]" />
            <span className="text-white text-sm font-medium">Human-in-the-Loop</span>
          </div>
        </div>

        {/* Annotation */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <p className="text-gray-400 leading-relaxed">
            This ensures <span className="text-white font-medium">accuracy, safety, and consistency</span>. 
            No single AI makes all decisions — specialized agents handle specific tasks.
          </p>
        </div>
      </div>
    </section>
  );
}
