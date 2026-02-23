import PageHeader from './shared/PageHeader';

interface ProcessPhase {
  number: string;
  title: string;
  description: string;
  deliverables: string[];
}

const PROCESS_PHASES: ProcessPhase[] = [
  {
    number: '01',
    title: 'Discovery',
    description:
      'We start by understanding your business, challenges, and goals. This phase includes stakeholder interviews and requirement gathering.',
    deliverables: [
      'Business analysis',
      'Technical requirements',
      'Project scope',
    ],
  },
  {
    number: '02',
    title: 'Strategy',
    description:
      'We design the AI solution architecture and create a detailed implementation plan that aligns with your objectives.',
    deliverables: [
      'System architecture',
      'Technical specification',
      'Timeline and milestones',
    ],
  },
  {
    number: '03',
    title: 'Build',
    description:
      'Our team develops your AI system with regular check-ins and iterative feedback to ensure we stay on track.',
    deliverables: ['Working system', 'Documentation', 'Testing results'],
  },
  {
    number: '04',
    title: 'Deploy',
    description:
      'We launch your system and provide training and ongoing support to ensure successful adoption and operation.',
    deliverables: ['Production deployment', 'User training', 'Support plan'],
  },
];

export default function ProcessPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <PageHeader
        title="Process"
        description="Our proven methodology for delivering successful AI projects"
      />

      <div className="space-y-16">
        {PROCESS_PHASES.map((phase, index) => (
          <div key={index} className="border-t border-gray-200 pt-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-2">
                <p className="text-5xl text-gray-300">{phase.number}</p>
              </div>
              <div className="md:col-span-10">
                <h2 className="text-3xl tracking-tight mb-4">{phase.title}</h2>
                <p className="text-lg text-gray-600 mb-6">
                  {phase.description}
                </p>
                <div>
                  <p className="text-sm mb-3">Deliverables:</p>
                  <ul className="space-y-2">
                    {phase.deliverables.map((deliverable, idx) => (
                      <li
                        key={idx}
                        className="text-gray-600 flex items-start"
                      >
                        <span className="mr-2">•</span>
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
