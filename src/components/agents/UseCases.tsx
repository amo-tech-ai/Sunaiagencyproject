import { useState } from 'react';
import { TrendingUp, Target, Zap, Headphones, Lightbulb } from 'lucide-react';

export default function UseCases() {
  const [activeTab, setActiveTab] = useState('sales');

  const tabs = [
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'marketing', label: 'Marketing', icon: Target },
    { id: 'operations', label: 'Operations', icon: Zap },
    { id: 'support', label: 'Customer Support', icon: Headphones },
    { id: 'strategy', label: 'Strategy', icon: Lightbulb },
  ];

  const content: Record<string, { title: string; items: string[] }> = {
    sales: {
      title: 'Sales Automation',
      items: [
        'AI qualifies leads based on scoring criteria',
        'Follows up instantly via email, SMS, or WhatsApp',
        'Books meetings and syncs with calendar',
        'Escalates high-value deals to human sales team',
        'Updates CRM automatically with all interactions',
      ],
    },
    marketing: {
      title: 'Marketing Intelligence',
      items: [
        'Creates campaign content and social posts',
        'Analyzes campaign performance and suggests optimizations',
        'Segments audiences based on behavior patterns',
        'Automates email nurture sequences',
        'Generates performance reports and insights',
      ],
    },
    operations: {
      title: 'Operations & Workflow',
      items: [
        'Automates recurring operational tasks',
        'Routes requests to the right team members',
        'Generates reports and status updates',
        'Monitors systems and sends alerts',
        'Coordinates cross-functional workflows',
      ],
    },
    support: {
      title: 'Customer Support',
      items: [
        'Answers common questions instantly',
        'Escalates complex issues to human agents',
        'Tracks support tickets and follows up',
        'Provides 24/7 availability across channels',
        'Analyzes support patterns to improve products',
      ],
    },
    strategy: {
      title: 'Strategic Planning',
      items: [
        'Analyzes business data for opportunities',
        'Scores initiatives by potential impact',
        'Creates execution plans with milestones',
        'Monitors progress against goals',
        'Recommends adjustments based on results',
      ],
    },
  };

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-gray-900 mb-6">
            How Businesses Use AI Agents
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real applications across every business function
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 border transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-[#F59E0B] bg-[#FFFBEB] text-gray-900'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#FDFCFB] border border-gray-200 p-8 md:p-12">
            <h3 className="font-serif text-3xl text-gray-900 mb-8">
              {content[activeTab].title}
            </h3>
            <ul className="space-y-4">
              {content[activeTab].items.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed pt-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
