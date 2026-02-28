import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const cx = {
  dark: '#1E3D36',
  muted: '#6B7370',
  accent: '#2E6F5E',
  deepGreen: '#1E3D36',
  bgLight: '#F5F4F1',
};

const SERVICE_CARDS = [
  {
    title: 'AI Agent Systems',
    desc: 'Autonomous digital workers that handle leads, onboard customers, and manage operations.',
    extended: 'Imagine a teammate that works tirelessly, learns continuously, and adapts to your needs. That\'s the promise of AI agents. With the ability to observe, plan, and act autonomously, AI agents open a new chapter of end-to-end transformation across industries — from lead qualification and customer onboarding to operational task management and intelligent escalation workflows.',
    image: 'https://images.unsplash.com/photo-1615632540593-0e6777a3b99f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwZ3JlZW4lMjBnbG93JTIwZGFyayUyMGFic3RyYWN0fGVufDF8fHx8MTc3MjAxODI3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    to: '/solutions',
  },
  {
    title: 'AI Chatbots',
    desc: 'Production-grade chatbots with RAG, CRM sync, and workflow execution.',
    extended: 'Go beyond basic Q&A with intelligent chatbots that retrieve real-time data from your knowledge base, sync seamlessly with your CRM, and execute multi-step workflows. Built on RAG architecture with enterprise-grade reliability, our chatbots handle complex conversations while maintaining context across sessions.',
    image: 'https://images.unsplash.com/flagged/photo-1590342838614-7bd8bafffed5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBzYW5kJTIwZHVuZXMlMjBydW5uZXIlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzcyMDE4Mjc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    to: '/solutions',
  },
  {
    title: 'WhatsApp AI Automation',
    desc: 'Turn WhatsApp into a sales and support channel with AI agents and CRM sync.',
    extended: 'Transform WhatsApp from a simple messaging app into a powerful revenue engine. Our AI-powered automation handles lead capture, appointment booking, product recommendations, and customer support — all within the WhatsApp interface your customers already use. Fully integrated with your CRM and payment systems.',
    image: 'https://images.unsplash.com/photo-1768695089167-293dd344cc87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodCUyMGhpZ2h3YXklMjBsaWdodCUyMHRyYWlscyUyMG1vdW50YWlufGVufDF8fHx8MTc3MjAxODI3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    to: '/solutions',
  },
  {
    title: 'AI Sales & Marketing CRM',
    desc: 'AI-powered lead capture, scoring, automated outreach, and proposal generation.',
    extended: 'Supercharge your sales pipeline with AI that captures leads from every channel, scores them intelligently, and triggers personalized outreach sequences. From automated proposal generation to predictive deal forecasting, our CRM solutions turn your sales team into a precision revenue machine.',
    image: 'https://images.unsplash.com/photo-1719258063335-1f8729dad57f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBtb3VudGFpbiUyMHNpbGhvdWV0dGUlMjBwdXJwbGUlMjBza3l8ZW58MXx8fHwxNzcyMDE4MjgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    to: '/solutions',
  },
  {
    title: 'AI MVP Development',
    desc: 'Turn your AI idea into a working product in 4–6 weeks.',
    extended: 'Move from concept to a fully functional AI product in record time. Our rapid MVP process combines strategic scoping, AI architecture design, and agile development to deliver a production-ready minimum viable product — complete with user testing, deployment infrastructure, and a clear roadmap for scale.',
    image: 'https://images.unsplash.com/photo-1668243304603-7ecf4eefba6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJpbGl0eSUyMGxhYm9yYXRvcnklMjBzY2llbnRpc3RzJTIwd29ya2luZ3xlbnwxfHx8fDE3NzIwMTgyODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    to: '/solutions',
  },
  {
    title: 'Custom AI Development',
    desc: 'RAG systems, personalization engines, predictive analytics, decision dashboards.',
    extended: 'Get bespoke AI solutions engineered for your exact business requirements. From retrieval-augmented generation systems and recommendation engines to predictive analytics platforms and executive decision dashboards — we build the intelligent infrastructure that gives you a competitive edge.',
    image: 'https://images.unsplash.com/photo-1612539474154-02c9ff07b4a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWxreSUyMHdheSUyMHN0YXJzJTIwbmlnaHQlMjBza3klMjBtb3VudGFpbnN8ZW58MXx8fHwxNzcyMDE4MjgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    to: '/solutions',
  },
  {
    title: 'Industry Chatbot Packages',
    desc: 'Pre-configured chatbot solutions for Healthcare, Real Estate, Automotive, Tourism, and E-commerce.',
    extended: 'Skip the long development cycle with our industry-specific chatbot packages. Each solution comes pre-configured with domain knowledge, compliance frameworks, and integration templates — ready to deploy for Healthcare patient intake, Real Estate lead nurturing, Automotive service booking, Tourism concierge, and E-commerce support.',
    image: 'https://images.unsplash.com/photo-1746468659043-9eeda39bb2ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdyZWVuJTIwY2lyY2xlcyUyMGRhcmslMjBnZW9tZXRyaWMlMjBkZXNpZ258ZW58MXx8fHwxNzcyMDE4MjgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    to: '/solutions',
  },
  {
    title: 'AI-Powered Web Development',
    desc: 'AI-accelerated websites with smart copy, embedded chatbots, and 90+ Lighthouse scores.',
    extended: 'Build blazing-fast websites powered by AI from the ground up. Our web development process uses AI to generate optimized copy, embed intelligent chatbots, and ensure every page scores 90+ on Lighthouse. The result: a high-performance digital presence that converts visitors into customers.',
    image: 'https://images.unsplash.com/photo-1724940434686-c4df656fec53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwc2lsaG91ZXR0ZSUyMGdvbGRlbiUyMHN1bnNldCUyMGZhY3Rvcnl8ZW58MXx8fHwxNzcyMDE4MjgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    to: '/solutions',
    badge: '90+',
  },
  {
    title: 'E-commerce AI',
    desc: 'Product recommendations, cart recovery, checkout optimization, and personalized flows.',
    extended: 'Unlock the full revenue potential of your online store with AI that understands your customers. From intelligent product recommendations and abandoned cart recovery to checkout optimization and hyper-personalized shopping flows — our e-commerce AI solutions drive measurable increases in conversion and average order value.',
    image: 'https://images.unsplash.com/photo-1770321695747-4a15eed89f9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGxhc2VyJTIwbGlnaHQlMjBzdHJlYWtzJTIwc3BlZWQlMjBhYnN0cmFjdHxlbnwxfHx8fDE3NzIwMTgyODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    to: '/solutions',
  },
];

export default function OurServicesGrid() {
  return (
    <section style={{ background: '#F5F4F1' }}>
      <div className="max-w-[1200px] mx-auto px-6" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
        {/* Section header */}
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <h2
            className="tracking-tight mb-4"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 600,
              lineHeight: 1.15,
              color: cx.dark,
            }}
          >
            Our Services in Digital, Technology, and Data
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.6, color: cx.muted }}>
            Strategic execution across AI, data, and digital transformation.
          </p>
        </div>

        {/* 3-column image card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_CARDS.map((card) => (
            <div
              key={card.title}
              className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-[250ms]"
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.06)',
                position: 'relative',
              }}
            >
              {/* ── Default state: image + short info ── */}
              <div className="transition-opacity duration-300 group-hover:opacity-0">
                {/* Image area */}
                <div className="relative overflow-hidden" style={{ height: '220px' }}>
                  <ImageWithFallback
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  {'badge' in card && card.badge && (
                    <div
                      className="absolute top-3 right-3 rounded-lg px-2.5 py-1 flex items-center justify-center"
                      style={{
                        background: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: cx.accent }}>
                        {card.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content area */}
                <div style={{ padding: '24px' }}>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      lineHeight: 1.3,
                      color: cx.dark,
                      marginBottom: '6px',
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.825rem',
                      lineHeight: 1.5,
                      color: cx.muted,
                      marginBottom: '16px',
                    }}
                  >
                    {card.desc}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5"
                    style={{ fontSize: '0.8rem', fontWeight: 500, color: cx.accent }}
                  >
                    Learn More
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* ── Hover state: expanded info overlay ── */}
              <div
                className="absolute inset-0 flex flex-col justify-between translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  background: '#F4F3EE',
                  padding: '28px 24px',
                }}
              >
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100 ease-[cubic-bezier(0.22,1,0.36,1)]">
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      lineHeight: 1.3,
                      color: cx.dark,
                      marginBottom: '14px',
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.8rem',
                      lineHeight: 1.65,
                      color: cx.muted,
                    }}
                  >
                    {card.extended}
                  </p>
                </div>

                <Link
                  to={card.to}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full self-start translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:opacity-85"
                  style={{
                    background: cx.deepGreen,
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase' as const,
                    marginTop: '20px',
                  }}
                >
                  LEARN MORE
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
