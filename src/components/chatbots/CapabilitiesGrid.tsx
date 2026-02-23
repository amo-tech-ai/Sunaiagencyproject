import { 
  Clock, 
  Brain, 
  Database, 
  Users, 
  MessageSquare, 
  Workflow, 
  BarChart,
  Target,
  Sparkles,
  TrendingUp 
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function CapabilitiesGrid() {
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

  const coreCapabilities = [
    { icon: Clock, title: '24/7 Instant Responses', impact: 'No missed leads or slow replies' },
    { icon: Brain, title: 'Intent Detection', impact: 'Understands what users actually want' },
    { icon: Database, title: 'Knowledge Base Answers', impact: 'Accurate, consistent replies' },
    { icon: Users, title: 'Human Handoff', impact: 'Escalates only when needed' },
    { icon: MessageSquare, title: 'Multi-Channel', impact: 'Website, WhatsApp, Email' },
  ];

  const advancedCapabilities = [
    { icon: Workflow, title: 'Workflow Execution', impact: 'Refunds, bookings, updates handled automatically' },
    { icon: BarChart, title: 'CRM Sync', impact: 'Every conversation updates leads & contacts' },
    { icon: Target, title: 'Lead Qualification', impact: 'Sales talks only to high-intent prospects' },
    { icon: Sparkles, title: 'Personalization', impact: 'Tailored responses based on user data' },
    { icon: TrendingUp, title: 'Analytics & Insights', impact: 'See what customers ask and where deals drop' },
  ];

  return (
    <section ref={sectionRef} className="bg-[#FDFCFB] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-gray-900 mb-6">
            Core Capabilities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built for immediate value and long-term scale
          </p>
        </div>

        {/* Core Grid */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 bg-[#F59E0B]" />
            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-medium">
              Immediate Value
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreCapabilities.map((capability, index) => (
              <div
                key={index}
                className={`bg-white border border-gray-200 p-8 hover:border-[#F59E0B] transition-all duration-300 group ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  animation: isVisible ? `slideUp 0.6s ease-out ${index * 0.1}s both` : 'none',
                }}
              >
                <div className="w-12 h-12 flex items-center justify-center border border-gray-200 group-hover:border-[#F59E0B] transition-colors mb-6">
                  <capability.icon className="w-6 h-6 text-gray-700" />
                </div>
                <h4 className="font-medium text-gray-900 mb-3 text-lg">
                  {capability.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {capability.impact}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Grid */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 bg-[#F59E0B]" />
            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-medium">
              Scale & Revenue
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedCapabilities.map((capability, index) => (
              <div
                key={index}
                className={`bg-white border border-gray-200 p-8 hover:border-[#F59E0B] transition-all duration-300 group ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  animation: isVisible ? `slideUp 0.6s ease-out ${(index + 5) * 0.1}s both` : 'none',
                }}
              >
                <div className="w-12 h-12 flex items-center justify-center border border-gray-200 group-hover:border-[#F59E0B] transition-colors mb-6">
                  <capability.icon className="w-6 h-6 text-gray-700" />
                </div>
                <h4 className="font-medium text-gray-900 mb-3 text-lg">
                  {capability.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {capability.impact}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
