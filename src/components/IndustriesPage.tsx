import PageHeader from './shared/PageHeader';

interface Industry {
  name: string;
  description: string;
}

const INDUSTRIES: Industry[] = [
  {
    name: 'Healthcare',
    description: 'AI solutions for medical practices and healthcare providers',
  },
  {
    name: 'Finance',
    description: 'Automated systems for financial services and banking',
  },
  {
    name: 'Retail',
    description: 'Customer experience and inventory optimization',
  },
  {
    name: 'Manufacturing',
    description: 'Process automation and quality control systems',
  },
  {
    name: 'Education',
    description: 'Learning platforms and educational technology',
  },
  {
    name: 'Professional Services',
    description: 'Workflow automation for service-based businesses',
  },
  {
    name: 'Real Estate',
    description: 'Property management and client engagement tools',
  },
  {
    name: 'Logistics',
    description: 'Supply chain optimization and tracking systems',
  },
];

export default function IndustriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <PageHeader
        title="Industries"
        description="We serve businesses across diverse sectors"
      />

      <div className="space-y-8">
        {INDUSTRIES.map((industry, index) => (
          <div key={index} className="border-l-2 border-gray-900 pl-6 py-4">
            <h3 className="text-xl mb-2">{industry.name}</h3>
            <p className="text-gray-600">{industry.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
