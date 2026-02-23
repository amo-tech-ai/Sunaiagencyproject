import PremiumServiceCard, { type PremiumCardVariant } from './PremiumServiceCard';

const SERVICES = [
  {
    title: 'AI Agent Systems',
    description:
      'Autonomous digital workers that handle leads, onboard customers, and manage operations.',
    href: '/agents',
    image:
      'https://images.unsplash.com/photo-1769839271832-cfd7a1f6854f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYXV0b21hdGlvbiUyMHJvYm90JTIwZnV0dXJpc3RpY3xlbnwxfHx8fDE3NzE4NTI2OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    title: 'AI Chatbots',
    description:
      'Production-grade chatbots with RAG, CRM sync, and workflow execution.',
    href: '/chatbots',
    image:
      'https://images.unsplash.com/photo-1762330465857-07e4c81c0dfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGF0Ym90JTIwY29udmVyc2F0aW9uJTIwQUklMjBhc3Npc3RhbnQlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzcxODUyNjkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    title: 'WhatsApp AI Automation',
    description:
      'Turn WhatsApp into a sales and support channel with AI agents and CRM sync.',
    href: '/solutions',
    image:
      'https://images.unsplash.com/photo-1642724978770-e27d781662d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGF0c2FwcCUyMG1vYmlsZSUyMHBob25lJTIwZ3JlZW4lMjBtZXNzYWdpbmd8ZW58MXx8fHwxNzcxODUyNjkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    title: 'AI Sales & Marketing CRM',
    description:
      'AI-powered lead capture, scoring, automated outreach, and proposal generation.',
    href: '/solutions',
    image:
      'https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGFuYWx5dGljcyUyMGRhc2hib2FyZCUyMGRhdGElMjBtZXRyaWNzfGVufDF8fHx8MTc3MTg1MjY5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    title: 'AI MVP Development',
    description:
      'Turn your AI idea into a working product in 4–6 weeks.',
    href: '/booking',
    image:
      'https://images.unsplash.com/photo-1740908901012-bd2608031565?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwTVZQJTIwcHJvZHVjdCUyMGxhdW5jaCUyMGNvZGluZ3xlbnwxfHx8fDE3NzE4NTI2OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    title: 'Custom AI Development',
    description:
      'RAG systems, personalization engines, predictive analytics, decision dashboards.',
    href: '/solutions',
    image:
      'https://images.unsplash.com/photo-1762968286778-60e65336d5ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNoaW5lJTIwbGVhcm5pbmclMjBjb2RlJTIwZGVlcCUyMGxlYXJuaW5nJTIwbmV1cmFsfGVufDF8fHx8MTc3MTg1MjY5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    title: 'Industry Chatbot Packages',
    description:
      'Pre-configured chatbot solutions for Healthcare, Real Estate, Automotive, Tourism, and E-commerce.',
    href: '/chatbots',
    image:
      'https://images.unsplash.com/photo-1709803019040-b3c38ea89ef4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWx0aXBsZSUyMGluZHVzdHJpZXMlMjBoZWFsdGhjYXJlJTIwYXV0b21vdGl2ZSUyMHRvdXJpc218ZW58MXx8fHwxNzcxODUyNjk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    title: 'AI-Powered Web Development',
    description:
      'AI-accelerated websites with smart copy, embedded chatbots, and 90+ Lighthouse scores.',
    href: '/projects',
    image:
      'https://images.unsplash.com/photo-1554306274-f23873d9a26c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGRlc2lnbiUyMG1vZGVybiUyMGxhcHRvcCUyMGNvZGV8ZW58MXx8fHwxNzcxODUyNjk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    title: 'E-commerce AI',
    description:
      'Product recommendations, cart recovery, checkout optimization, and personalized flows.',
    href: '/industries/e-commerce',
    image:
      'https://images.unsplash.com/photo-1726443221401-ddd359c08d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBzaG9wcGluZyUyMGVjb21tZXJjZSUyMGNhcnQlMjBjaGVja291dHxlbnwxfHx8fDE3NzE4NTI2OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

/*  Variant rhythm: teal → cream → teal repeating per row.
    Row 1: teal, cream, teal
    Row 2: cream, teal, cream
    Row 3: teal, cream, teal
    This gives a pleasant checkerboard feel. */
const variantPattern: PremiumCardVariant[] = [
  'teal', 'cream', 'teal',
  'cream', 'teal', 'cream',
  'teal', 'cream', 'teal',
];

export default function PremiumServiceCardsGrid() {
  return (
    <section className="bg-[#0F3D3E] py-24 sm:py-32">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section header */}
        <div className="max-w-2xl mb-16 sm:mb-20">
          <p
            className="text-[#F1EEEA]/50 uppercase tracking-[0.2em] mb-5"
            style={{ fontSize: '0.75rem', fontWeight: 500 }}
          >
            Our Services
          </p>
          <h2
            className="text-[#F1EEEA] tracking-tight mb-5"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.875rem, 4.5vw, 3rem)',
              fontWeight: 600,
              lineHeight: 1.12,
            }}
          >
            AI solutions engineered
            <br />
            <span className="text-[#F1EEEA]/40">for enterprise impact</span>
          </h2>
          <p
            className="text-[#F1EEEA]/45 leading-relaxed max-w-xl"
            style={{ fontSize: '1.05rem' }}
          >
            From autonomous agents to full-stack AI products — we design, build,
            and deploy systems that drive measurable business outcomes.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {SERVICES.map((service, i) => (
            <PremiumServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              image={service.image}
              href={service.href}
              variant={variantPattern[i]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}