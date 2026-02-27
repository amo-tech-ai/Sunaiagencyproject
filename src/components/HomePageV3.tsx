import { Link } from 'react-router';
import { ArrowRight, Sparkles, Bot, Workflow, BrainCircuit, BarChart3, Settings, Layers, Lightbulb, Zap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import HowWeDeliverSection from './shared/HowWeDeliverSection';
import VelocityProcessSection from './home/VelocityProcessSection';
import TechStackSection from './home/TechStackSection';

/* ═══════════════════════════════════════════════════════════════
   Sun AI Agency — HomePageV3 (Spruced-Inspired Luxury)
   ═══════════════════════════════════════════════════════════════ */

const HERO_IMG =
  'https://images.unsplash.com/photo-1764755932155-dabbee87df7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjbGVhbiUyMGRlc2slMjB3b3Jrc3BhY2UlMjBuYXR1cmFsJTIwbGlnaHQlMjBtaW5pbWFsfGVufDF8fHx8MTc3MjAxMzc4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

const STORY_IMG =
  'https://images.unsplash.com/photo-1765371513765-d2b624850162?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwYm9va3NoZWxmJTIwbW9kZXJuJTIwaW50ZXJpb3IlMjBkZXNpZ24lMjB3YXJtfGVufDF8fHx8MTc3MjAxMzc5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

const TESTIMONIAL_IMG =
  'https://images.unsplash.com/photo-1635366898830-b5d48950e4f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGV4ZWN1dGl2ZSUyMHBvcnRyYWl0JTIwbmF0dXJhbCUyMGxpZ2h0fGVufDF8fHx8MTc3MjAxMzc5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

/* ── Shared ── */

const cx = {
  bg: '#F4F3EE',
  bgWhite: '#FFFFFF',
  deepGreen: '#1E3D36',
  sage: '#DCE5DD',
  accent: '#2E6F5E',
  dark: '#1C1C1C',
  muted: '#6B6B6B',
  border: '#E5E5E5',
};

function SectionWrap({
  children,
  bg = cx.bg,
  className = '',
  id,
}: {
  children: React.ReactNode;
  bg?: string;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} style={{ background: bg }} className={className}>
      <div className="max-w-[1200px] mx-auto px-6">{children}</div>
    </section>
  );
}

function BtnPrimary({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white transition-all duration-300 hover:opacity-90"
      style={{ background: cx.deepGreen, fontSize: '0.875rem', fontWeight: 500 }}
    >
      {children}
    </Link>
  );
}

function BtnOutline({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full transition-all duration-300 hover:bg-[#1E3D36]/5"
      style={{ border: `1px solid ${cx.border}`, fontSize: '0.875rem', fontWeight: 500, color: cx.dark }}
    >
      {children}
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════
   1 — HERO
   ═══════════════════════════════════════════════════════════════ */

function HeroSection() {
  return (
    <SectionWrap>
      <div className="pt-28 pb-24 sm:pt-36 sm:pb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
        {/* Left */}
        <div className="max-w-lg">
          <h1
            className="tracking-tight mb-6"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
              fontWeight: 600,
              lineHeight: 1.08,
              color: cx.dark,
            }}
          >
            Build intelligent AI products, agents, and automation.
          </h1>
          <p
            className="mb-10"
            style={{ fontSize: '1.05rem', lineHeight: 1.7, color: cx.muted }}
          >
            We design and deploy AI systems that turn ideas into scalable
            products, operational workflows, and measurable business growth.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <BtnPrimary to="/booking">Start a Project</BtnPrimary>
            <BtnOutline to="#capabilities">View Capabilities</BtnOutline>
          </div>
        </div>

        {/* Right — image */}
        <div className="relative">
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <ImageWithFallback
              src={HERO_IMG}
              alt="Modern workspace"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Subtle decorative dot */}
          <div
            className="absolute -top-4 -left-4 w-8 h-8 rounded-full hidden lg:block"
            style={{ background: cx.sage }}
          />
        </div>
      </div>
    </SectionWrap>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2 — AI CAPABILITIES
   ══════════════════════════════════════════════════════════════ */

const CAPABILITIES = [
  {
    title: 'AI Strategy & Architecture',
    desc: 'We audit your workflows and data to design a custom AI roadmap — from LLM selection to deployment infrastructure.',
    Icon: BrainCircuit,
  },
  {
    title: 'Generative AI Products',
    desc: 'Production-grade chatbots, content engines, and RAG systems built on enterprise-ready architecture.',
    Icon: Sparkles,
  },
  {
    title: 'Autonomous AI Agents',
    desc: 'Multi-step agents that handle sales, support, and operations — integrated with your CRM and workflows.',
    Icon: Bot,
  },
];

function CapabilitiesSection() {
  return (
    <SectionWrap id="capabilities">
      <div className="py-24 sm:py-32">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="tracking-tight mb-4"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              fontWeight: 600,
              lineHeight: 1.15,
              color: cx.dark,
            }}
          >
            Our AI Solutions and Capabilities
          </h2>
          <p style={{ fontSize: '1rem', color: cx.muted, lineHeight: 1.6 }}>
            Strategic design. Intelligent automation. Production-ready systems.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.title}
              className="rounded-xl p-8 transition-all duration-300 hover:-translate-y-1"
              style={{ background: cx.sage, border: 'none' }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                style={{ background: 'rgba(46,111,94,0.12)' }}
              >
                <cap.Icon className="w-5 h-5" style={{ color: cx.accent }} />
              </div>
              <h3
                className="mb-3"
                style={{ fontSize: '1.125rem', fontWeight: 600, color: cx.dark }}
              >
                {cap.title}
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: cx.muted }}>
                {cap.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrap>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3 — CREDIBILITY BAND
   ══════════════════════════════════════════════════════════════ */

function CredibilityBand() {
  return (
    <section style={{ background: cx.deepGreen }} className="py-20 sm:py-24">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <p
          className="text-white/40 uppercase tracking-[0.25em] mb-5"
          style={{ fontSize: '0.65rem', fontWeight: 600 }}
        >
          Trusted by teams scaling with AI
        </p>
        <h2
          className="text-white tracking-tight mb-6"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          Built for teams scaling with AI.
        </h2>
        <p className="text-white/50" style={{ fontSize: '1.35rem', fontWeight: 500 }}>
          <span className="text-white" style={{ fontWeight: 700 }}>94%</span>{' '}
          client satisfaction
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4 — STORY SECTION
   ═══════════════════════════════════════════════════════════════ */

function StorySection() {
  return (
    <SectionWrap bg={cx.bgWhite}>
      <div className="py-24 sm:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — image */}
        <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
          <ImageWithFallback
            src={STORY_IMG}
            alt="Modern workspace"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right — text */}
        <div className="max-w-md">
          <h2
            className="tracking-tight mb-5"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 600,
              lineHeight: 1.15,
              color: cx.dark,
            }}
          >
            AI systems built for long-term performance.
          </h2>
          <p
            className="mb-8"
            style={{ fontSize: '0.95rem', lineHeight: 1.7, color: cx.muted }}
          >
            We combine product design, AI architecture, and operational
            automation to build intelligent systems that scale. Every engagement
            starts with understanding your business — not selling a template.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 transition-colors duration-300 hover:opacity-70"
            style={{ fontSize: '0.875rem', fontWeight: 500, color: cx.accent }}
          >
            Learn More
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </SectionWrap>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5 — SPECIALIZED SERVICES SECTION (Spruced-style 3-card)
   ═══════════════════════════════════════════════════════════════ */

const SPECIALIZED_SERVICES = [
  {
    title: 'AI Product Development',
    desc: 'Get strategy-aligned AI products from concept to launch — MVPs, SaaS tools, and internal platforms built to scale.',
    image:
      'https://images.unsplash.com/photo-1764258057610-be7ca21a0978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMHRlY2hub2xvZ3klMjBkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGRhcmt8ZW58MXx8fHwxNzcyMDE0ODM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    overlay: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.35) 100%)',
    to: '/solutions',
  },
  {
    title: 'Automation Design',
    desc: 'Get on-brand workflow automation designed to enhance your operations, customer experience, and revenue pipelines.',
    image:
      'https://images.unsplash.com/photo-1761063198799-9d2a44cca2da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG9yYW5nZSUyMGdyYWRpZW50JTIwY3JlYXRpdmUlMjBkZXNpZ258ZW58MXx8fHwxNzcyMDE0ODM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    overlay: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.25) 100%)',
    to: '/solutions',
  },
  {
    title: 'AI Agent Systems',
    desc: 'Push your operational boundaries into a new dimension with autonomous AI agents that handle complex multi-step tasks.',
    image:
      'https://images.unsplash.com/photo-1740637977676-c8040b41dc7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXB0b3AlMjB3b3Jrc3BhY2UlMjBwbGFudHMlMjBtaW5pbWFsJTIwbGlnaHR8ZW58MXx8fHwxNzcyMDE0ODM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    overlay: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.3) 100%)',
    to: '/agents',
  },
];

function SpecializedServicesSection() {
  return (
    <section style={{ background: cx.deepGreen }} className="py-24 sm:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2
            className="text-white tracking-tight"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 600,
              lineHeight: 1.12,
            }}
          >
            <span style={{ fontStyle: 'italic' }}>Specialized</span> production
            <br />
            services
          </h2>
        </div>

        {/* 3-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SPECIALIZED_SERVICES.map((service) => (
            <div
              key={service.title}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{ aspectRatio: '3 / 3.2' }}
            >
              {/* Background image */}
              <ImageWithFallback
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{ background: service.overlay }}
              />

              {/* Card content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-7">
                {/* Top — title + description */}
                <div>
                  <h3
                    className="text-white mb-2.5"
                    style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.25 }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-white/65 max-w-[280px]"
                    style={{ fontSize: '0.8rem', lineHeight: 1.55 }}
                  >
                    {service.desc}
                  </p>
                </div>

                {/* Bottom — learn more */}
                <Link
                  to={service.to}
                  className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors duration-300"
                  style={{ fontSize: '0.8rem', fontWeight: 500 }}
                >
                  Learn more
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6 — SERVICES GRID (BCG-inspired minimal image cards)
   ═══════════════════════════════════════════════════════════════ */

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

function ServicesGrid() {
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

/* ═══════════════════════════════════════════════════════════════
   7 — PROCESS VISUALIZATION
   ═══════════════════════════════════════════════════════════════ */

const PROCESS_STEPS = ['Discover', 'Design', 'Build', 'Deploy', 'Optimize'];

function ProcessSection() {
  return (
    <SectionWrap bg={cx.bgWhite}>
      <div className="py-24 sm:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — text */}
        <div className="max-w-md">
          <h2
            className="tracking-tight mb-5"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 600,
              lineHeight: 1.15,
              color: cx.dark,
            }}
          >
            A proven process for enterprise AI transformation.
          </h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: cx.muted }}>
            Every project follows a rigorous, repeatable framework — ensuring
            quality, speed, and measurable outcomes.
          </p>
        </div>

        {/* Right — progress bars */}
        <div className="space-y-5">
          {PROCESS_STEPS.map((step, i) => {
            const pct = 40 + i * 15; // visual progress width
            return (
              <div key={step}>
                <div className="flex justify-between mb-2">
                  <span
                    style={{ fontSize: '0.825rem', fontWeight: 500, color: cx.dark }}
                  >
                    {String(i + 1).padStart(2, '0')}. {step}
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: cx.sage }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: i === PROCESS_STEPS.length - 1 ? cx.accent : cx.deepGreen,
                      opacity: 0.7 + i * 0.06,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrap>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8 — PLAYBOOK / RESOURCES
   ═══════════════════════════════════════════════════════════════ */

const PLAYBOOK_ITEMS = [
  {
    title: 'Data Readiness Assessment',
    desc: 'Evaluate your data infrastructure for AI integration — identify gaps, quality issues, and pipeline requirements.',
    active: true,
  },
  {
    title: 'AI Use Case Prioritization',
    desc: 'Score potential AI applications by impact, feasibility, and time-to-value to build a focused implementation roadmap.',
    active: false,
  },
  {
    title: 'Model Selection & Architecture',
    desc: 'Choose the right LLM, embedding strategy, and deployment infrastructure for your specific business needs.',
    active: false,
  },
  {
    title: 'Operationalization & Scale',
    desc: 'Move from pilot to production with monitoring, governance, and continuous optimization frameworks.',
    active: false,
  },
];

function PlaybookSection() {
  return (
    <SectionWrap>
      <div className="py-24 sm:py-32">
        <div className="text-center mb-14">
          <h2
            className="tracking-tight mb-3"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.35rem, 3vw, 2rem)',
              fontWeight: 600,
              lineHeight: 1.2,
              color: cx.dark,
            }}
          >
            The Future-Ready Playbook for Climbing the AI Maturity Curve
          </h2>
          <p style={{ fontSize: '0.9rem', color: cx.muted }}>
            A structured approach to enterprise AI adoption.
          </p>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {PLAYBOOK_ITEMS.map((item, i) => (
            <div
              key={item.title}
              className="rounded-xl p-6 transition-all duration-300"
              style={{
                background: item.active ? cx.sage : cx.bgWhite,
                border: `1px solid ${item.active ? 'transparent' : cx.border}`,
              }}
            >
              <div className="flex items-start gap-4">
                <span
                  className="shrink-0 mt-0.5"
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: item.active ? cx.accent : cx.muted,
                    letterSpacing: '0.06em',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3
                    className="mb-1.5"
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: cx.dark,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.835rem', lineHeight: 1.6, color: cx.muted }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrap>
  );
}

/* ═══════════════════════════════════════════════════════════════
   9 — TESTIMONIAL
   ═══════════════════════════════════════════════════════════════ */

function TestimonialSection() {
  return (
    <SectionWrap bg={cx.bgWhite}>
      <div className="py-24 sm:py-32 flex justify-center">
        <div
          className="max-w-2xl text-center rounded-2xl px-10 py-12 sm:px-14 sm:py-14"
          style={{
            background: cx.bgWhite,
            boxShadow: '0 2px 24px -4px rgba(0,0,0,0.06)',
            border: `1px solid ${cx.border}`,
          }}
        >
          {/* Avatar */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <ImageWithFallback
                src={TESTIMONIAL_IMG}
                alt="Client"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <blockquote
            className="mb-6"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              lineHeight: 1.55,
              color: cx.dark,
              fontStyle: 'italic',
            }}
          >
            "Sun AI didn't just build us an AI system — they transformed how our
            entire team thinks about operations. The ROI was visible within the
            first month."
          </blockquote>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: cx.dark }}>
            Sarah Mitchell
          </p>
          <p style={{ fontSize: '0.8rem', color: cx.muted }}>
            VP of Operations, Meridian Group
          </p>
        </div>
      </div>
    </SectionWrap>
  );
}

/* ═══════════════════════════════════════════════════════════════
   10 — METRICS BAND
   ═══════════════════════════════════════════════════════════════ */

const METRICS = [
  { val: '42K+', lbl: 'AI Interactions Processed' },
  { val: '1,200+', lbl: 'Workflows Automated' },
  { val: '98%', lbl: 'System Uptime' },
  { val: '35%', lbl: 'Average Cost Reduction' },
];

function MetricsBand() {
  return (
    <section style={{ background: cx.sage }} className="py-20 sm:py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {METRICS.map((m) => (
            <div key={m.lbl} className="text-center">
              <span
                className="block"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                  fontWeight: 700,
                  color: cx.deepGreen,
                  lineHeight: 1.1,
                }}
              >
                {m.val}
              </span>
              <span
                className="block mt-2"
                style={{ fontSize: '0.8rem', color: cx.muted, fontWeight: 500 }}
              >
                {m.lbl}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   11 — FINAL CTA
   ═══════════════════════════════════════════════════════════════ */

function FinalCTA() {
  return (
    <section style={{ background: cx.deepGreen }} className="py-24 sm:py-32">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <h2
          className="text-white tracking-tight mb-5"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            fontWeight: 600,
            lineHeight: 1.15,
          }}
        >
          Ready to build a real AI system?
        </h2>
        <p
          className="text-white/45 max-w-md mx-auto mb-10"
          style={{ fontSize: '1rem', lineHeight: 1.6 }}
        >
          Let's scope your project and deliver a solution within weeks — not
          months.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-[#1E3D36] transition-all duration-300 hover:opacity-90"
            style={{ background: '#F4F3EE', fontSize: '0.875rem', fontWeight: 600 }}
          >
            Start a Project
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white/80 hover:text-white transition-all duration-300"
            style={{ border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.875rem', fontWeight: 500 }}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   12 — FOOTER (in-page variant to maintain V3 palette)
   ═══════════════════════════════════════════════════════════════ */

/* We reuse the global Layout footer, so nothing extra needed here. */

/* ═══════════════════════════════════════════════════════════════
   PAGE EXPORT
   ═══════════════════════════════════════════════════════════════ */

export default function HomePageV3() {
  return (
    <div>
      <HeroSection />
      <ServicesGrid />
      <VelocityProcessSection />
      <TechStackSection />
      <CapabilitiesSection />
      <CredibilityBand />
      <StorySection />
      <SpecializedServicesSection />
      <HowWeDeliverSection />
      <PlaybookSection />
      <TestimonialSection />
      <MetricsBand />
      <FinalCTA />
    </div>
  );
}