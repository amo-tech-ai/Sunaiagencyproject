import { useState } from 'react';
import PhaseCard from './PhaseCard';
import {
  Lightbulb,
  FileText,
  Palette,
  Code,
  TestTube,
  Rocket,
  Headphones,
} from 'lucide-react';

const PHASES = [
  {
    number: '01',
    name: 'Discovery',
    duration: '3-5 Days',
    icon: Lightbulb,
    description:
      'Deep dive into your business goals, challenges, and AI opportunities.',
    deliverables: [
      'Stakeholder interviews',
      'Technical requirements document',
      'Competitive analysis',
      'Project scope & timeline',
    ],
    clientActions: [
      'Attend kickoff meeting',
      'Provide access to relevant data/systems',
      'Review and approve project scope',
    ],
  },
  {
    number: '02',
    name: 'Strategy',
    duration: '5-7 Days',
    icon: FileText,
    description: 'Design a custom AI solution tailored to your specific needs.',
    deliverables: [
      'Technical architecture blueprint',
      'AI model selection & training plan',
      'Data pipeline design',
      'Risk assessment & mitigation strategy',
    ],
    clientActions: [
      'Review technical proposal',
      'Provide feedback on approach',
      'Approve technology stack',
    ],
  },
  {
    number: '03',
    name: 'Design',
    duration: '5-7 Days',
    icon: Palette,
    description: 'Create intuitive interfaces and user experiences for your AI system.',
    deliverables: [
      'Wireframes and user flows',
      'High-fidelity mockups',
      'Interactive prototypes',
      'Design system components',
    ],
    clientActions: [
      'Review design concepts',
      'Provide brand assets',
      'Approve final designs',
    ],
  },
  {
    number: '04',
    name: 'Development',
    duration: '14-21 Days',
    icon: Code,
    description: 'Build and train your AI system with regular feedback cycles.',
    deliverables: [
      'Trained AI models',
      'Backend API development',
      'Frontend implementation',
      'Weekly progress demos',
    ],
    clientActions: [
      'Attend weekly standups',
      'Test staging builds',
      'Provide ongoing feedback',
    ],
  },
  {
    number: '05',
    name: 'Testing',
    duration: '5-7 Days',
    icon: TestTube,
    description: 'Rigorous QA to ensure your system works flawlessly.',
    deliverables: [
      'Automated test suites',
      'Performance optimization',
      'Security audit',
      'Bug fixes & refinements',
    ],
    clientActions: [
      'Participate in UAT',
      'Report issues',
      'Sign off on fixes',
    ],
  },
  {
    number: '06',
    name: 'Deployment',
    duration: '3-5 Days',
    icon: Rocket,
    description: 'Launch your AI system to production with zero downtime.',
    deliverables: [
      'Production infrastructure setup',
      'Deployment automation',
      'Monitoring & logging',
      'Go-live support',
    ],
    clientActions: [
      'Approve deployment plan',
      'Coordinate internal teams',
      'Announce to stakeholders',
    ],
  },
  {
    number: '07',
    name: 'Support',
    duration: 'Ongoing',
    icon: Headphones,
    description: 'Continuous optimization and support after launch.',
    deliverables: [
      '30-day post-launch support',
      'Performance monitoring',
      'Model retraining',
      'Feature enhancements',
    ],
    clientActions: [
      'Monitor system performance',
      'Provide user feedback',
      'Request improvements',
    ],
  },
];

export default function PhaseCardsSection() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  const handleToggle = (phaseNumber: string) => {
    setExpandedPhase(expandedPhase === phaseNumber ? null : phaseNumber);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div className="mb-16">
        <h2
          className="text-5xl md:text-6xl font-bold text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Our 7-Phase Process
        </h2>
        <p className="text-xl text-[#666666] max-w-3xl">
          A proven methodology that delivers results in weeks, not months.
        </p>
      </div>

      <div className="space-y-4">
        {PHASES.map((phase) => (
          <PhaseCard
            key={phase.number}
            {...phase}
            isExpanded={expandedPhase === phase.number}
            onToggle={() => handleToggle(phase.number)}
          />
        ))}
      </div>
    </section>
  );
}
