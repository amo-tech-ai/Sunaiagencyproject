import PageHeader from './shared/PageHeader';

interface Solution {
  title: string;
  description: string;
}

const SOLUTIONS: Solution[] = [
  {
    title: 'AI Web Design',
    description: 'Custom web applications powered by AI',
  },
  {
    title: 'App Development',
    description: 'Native and cross-platform applications',
  },
  {
    title: 'AI Agents',
    description: 'Autonomous AI systems for business automation',
  },
  {
    title: 'AI Chatbots',
    description: 'Intelligent customer service solutions',
  },
  {
    title: 'Sales CRM',
    description: 'AI-powered customer relationship management',
  },
  {
    title: 'MVP Builder',
    description: 'Rapid prototyping and product validation',
  },
];

export default function SolutionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <PageHeader
        title="Solutions"
        description="Comprehensive AI services tailored to your business needs"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SOLUTIONS.map((solution, index) => (
          <div key={index} className="border border-gray-200 p-8">
            <h3 className="text-2xl tracking-tight mb-4">{solution.title}</h3>
            <p className="text-gray-600">{solution.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
