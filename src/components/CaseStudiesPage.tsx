import PageHeader from './shared/PageHeader';

interface CaseStudy {
  title: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    title: 'Healthcare Provider Automation',
    industry: 'Healthcare',
    challenge: 'Manual patient scheduling and follow-up processes',
    solution: 'AI-powered scheduling system with automated reminders',
    results: [
      '80% reduction in scheduling time',
      '95% appointment attendance',
      '50% decrease in administrative costs',
    ],
  },
  {
    title: 'E-commerce Personalization',
    industry: 'Retail',
    challenge: 'Low conversion rates and generic customer experience',
    solution: 'AI recommendation engine and personalized marketing',
    results: [
      '35% increase in conversion rate',
      '2.5x higher average order value',
      '60% improvement in customer retention',
    ],
  },
  {
    title: 'Financial Services Chatbot',
    industry: 'Finance',
    challenge: 'High volume of repetitive customer inquiries',
    solution: 'Intelligent chatbot for customer support and account management',
    results: [
      '70% of inquiries handled automatically',
      '24/7 customer support',
      '90% customer satisfaction score',
    ],
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <PageHeader
        title="Case Studies"
        description="Real results from real projects"
      />

      <div className="space-y-16">
        {CASE_STUDIES.map((study, index) => (
          <div key={index} className="border border-gray-200 p-8 md:p-12">
            <div className="mb-4">
              <span className="text-sm text-gray-500">{study.industry}</span>
            </div>
            <h2 className="text-2xl md:text-3xl tracking-tight mb-8">
              {study.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm mb-2">Challenge</h3>
                <p className="text-gray-600">{study.challenge}</p>
              </div>
              <div>
                <h3 className="text-sm mb-2">Solution</h3>
                <p className="text-gray-600">{study.solution}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm mb-4">Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {study.results.map((result, idx) => (
                  <div key={idx} className="border-l-2 border-gray-900 pl-4">
                    <p className="text-gray-600">{result}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
