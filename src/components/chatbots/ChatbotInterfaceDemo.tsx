import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Workflow, Database, BarChart, TrendingUp, Settings } from 'lucide-react';

export default function ChatbotInterfaceDemo() {
  const [activeTab, setActiveTab] = useState('conversation');
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

  const tabs = [
    { id: 'conversation', label: 'Conversation', icon: MessageSquare },
    { id: 'workflows', label: 'Workflows', icon: Workflow },
    { id: 'knowledge', label: 'Knowledge Base', icon: Database },
    { id: 'crm', label: 'CRM Sync', icon: BarChart },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'escalation', label: 'Escalation', icon: Settings },
  ];

  const content: Record<string, { title: string; description: string; features: string[] }> = {
    conversation: {
      title: 'Live Chat with Memory & Context',
      description: 'Real-time conversations that remember previous interactions and understand user intent.',
      features: [
        'Multi-turn conversation memory',
        'Context-aware responses',
        'Natural language understanding',
        'Sentiment detection',
      ],
    },
    workflows: {
      title: 'Action Triggers & Execution',
      description: 'Automated workflows that execute business processes without human intervention.',
      features: [
        'Refund processing',
        'Meeting bookings',
        'Order status updates',
        'Follow-up sequences',
      ],
    },
    knowledge: {
      title: 'Documents, FAQs, SOPs (RAG-Powered)',
      description: 'Accurate answers pulled from your business documentation and knowledge base.',
      features: [
        'RAG-powered retrieval',
        'No hallucinations',
        'Source citations',
        'Real-time updates',
      ],
    },
    crm: {
      title: 'Contacts, Leads, Deal Updates',
      description: 'Seamless integration with your CRM for automatic lead tracking and updates.',
      features: [
        'Lead creation & scoring',
        'Contact enrichment',
        'Deal stage progression',
        'Activity logging',
      ],
    },
    insights: {
      title: 'Resolution Rate & Performance',
      description: 'Comprehensive analytics showing what works and where to improve.',
      features: [
        'Resolution metrics',
        'Conversion tracking',
        'Common questions',
        'Drop-off points',
      ],
    },
    escalation: {
      title: 'When to Involve a Human',
      description: 'Smart rules that determine when conversations need human expertise.',
      features: [
        'Complexity detection',
        'High-value lead routing',
        'Sentiment-based escalation',
        'Manual override options',
      ],
    },
  };

  return (
    <section ref={sectionRef} className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-gray-900 mb-6">
            Multi-Tab Chatbot Interface
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your chatbot is not a single chat window — it's a <span className="font-medium text-gray-900">complete business system</span>
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 md:px-6 py-3 border transition-all duration-300 ${
                activeTab === tab.id
                  ? 'border-[#F59E0B] bg-[#FFFBEB] text-gray-900'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm md:text-base">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div 
          className={`max-w-5xl mx-auto transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-[#FDFCFB] border-2 border-gray-200 overflow-hidden">
            {/* Interface Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="text-xs uppercase tracking-widest text-gray-500">
                AI Chatbot Dashboard
              </div>
              <div className="w-16" /> {/* Spacer */}
            </div>

            {/* Content Area */}
            <div className="p-8 md:p-12">
              <div className="mb-6">
                <h3 className="font-serif text-3xl text-gray-900 mb-3">
                  {content[activeTab].title}
                </h3>
                <p className="text-gray-600 text-lg">
                  {content[activeTab].description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content[activeTab].features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-white border border-gray-200"
                  >
                    <div className="w-2 h-2 bg-[#F59E0B]" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Annotation */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 italic border-l-2 border-[#F59E0B] pl-6 inline-block text-left">
              This makes the chatbot <span className="font-medium text-gray-900">auditable, controllable, and enterprise-safe</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
