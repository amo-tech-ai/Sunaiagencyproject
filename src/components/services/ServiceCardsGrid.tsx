import ServiceCard, { type CardVariant } from './ServiceCard';
import { cardVisuals } from './ServiceCardVisuals';

const SERVICES = [
  {
    title: 'AI Agent Systems',
    description:
      'Autonomous digital workers that handle leads, onboard customers, and manage operations.',
    href: '/agents',
  },
  {
    title: 'AI Chatbots',
    description:
      'Production-grade chatbots with RAG, CRM sync, and workflow execution.',
    href: '/chatbots',
  },
  {
    title: 'WhatsApp AI Automation',
    description:
      'Turn WhatsApp into a sales and support channel with AI agents and CRM sync.',
    href: '/solutions',
  },
  {
    title: 'AI Sales & Marketing CRM',
    description:
      'AI-powered lead capture, scoring, automated outreach, and proposal generation.',
    href: '/solutions',
  },
  {
    title: 'AI MVP Development',
    description:
      'Turn your AI idea into a working product in 4–6 weeks.',
    href: '/booking',
  },
  {
    title: 'Custom AI Development',
    description:
      'RAG systems, personalization engines, predictive analytics, decision dashboards.',
    href: '/solutions',
  },
  {
    title: 'Industry Chatbot Packages',
    description:
      'Pre-configured chatbot solutions for Healthcare, Real Estate, Automotive, Tourism, and E-commerce.',
    href: '/chatbots',
  },
  {
    title: 'AI-Powered Web Development',
    description:
      'AI-accelerated websites with smart copy, embedded chatbots, and 90+ Lighthouse scores.',
    href: '/projects',
  },
  {
    title: 'E-commerce AI',
    description:
      'Product recommendations, cart recovery, checkout optimization, and personalized flows.',
    href: '/industries/e-commerce',
  },
];

// All cards use light variant on teal background
export default function ServiceCardsGrid() {
  return (
    <section className="bg-[#0F3D3E] py-24 sm:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section header */}
        <div className="max-w-2xl mb-16 sm:mb-20">
          <p
            className="text-[#F1EEEA]/70 uppercase tracking-widest mb-4"
            style={{ fontSize: '0.75rem', fontWeight: 600 }}
          >
            Our Services
          </p>
          <h2
            className="text-[#F1EEEA] tracking-tight mb-5"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 600, lineHeight: 1.15 }}
          >
            AI solutions engineered for enterprise impact
          </h2>
          <p className="text-[#F1EEEA]/50 leading-relaxed" style={{ fontSize: '1.05rem' }}>
            From autonomous agents to full-stack AI products — we design, build, and deploy
            systems that drive measurable business outcomes.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {SERVICES.map((service, i) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              variant="light"
              visual={cardVisuals[i]}
              href={service.href}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}