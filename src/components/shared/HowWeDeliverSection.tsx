import { Link } from 'react-router';
import { Search, Layers, Code, Rocket } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Sun AI Agency — "How We Deliver" Section (4-Phase Version)
   Premium, responsive 8-week delivery process section
   ═══════════════════════════════════════════════════════════════ */

const cx = {
  sage: '#DCE5DD',
  deepGreen: '#1E3D36',
  white: '#FFFFFF',
  accentGreen: '#2E6F5E',
  warmBeige: '#F4F3EE',
  muted: '#6B6B6B',
  border: '#E5E5E5',
};

interface DeliveryPhase {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  duration: string;
  fillPercent: number; // Progress bar fill (0-100)
}

const deliveryPhases: DeliveryPhase[] = [
  {
    icon: <Search className="w-6 h-6" />,
    eyebrow: 'WEEK 1',
    title: 'Discover & Architect',
    description:
      'We map your workflows, data, and bottlenecks — then define the fastest path to ROI.',
    bullets: [
      'Lead flow → scoring rules',
      'Knowledge base → retrieval plan',
      'Integrations → API map',
    ],
    duration: 'Week 1',
    fillPercent: 12.5,
  },
  {
    icon: <Layers className="w-6 h-6" />,
    eyebrow: 'WEEKS 2–3',
    title: 'Design Sprint',
    description:
      'We turn scope into screens and system logic — UX, flows, and technical architecture.',
    bullets: [
      'UX flows + wireframes',
      'Data model + permissions',
      'Implementation plan',
    ],
    duration: 'Weeks 2–3',
    fillPercent: 25,
  },
  {
    icon: <Code className="w-6 h-6" />,
    eyebrow: 'WEEKS 4–7',
    title: 'Build & Integrate',
    description:
      'Production builds in weekly sprints — agents, chatbots, automations, and integrations.',
    bullets: [
      'RAG + tool actions',
      'CRM + WhatsApp sync',
      'Admin + analytics',
    ],
    duration: 'Weeks 4–7',
    fillPercent: 50,
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    eyebrow: 'WEEK 8',
    title: 'Launch & Optimize',
    description:
      'Deploy, train your team, monitor quality, and improve performance with real usage data.',
    bullets: [
      'QA + launch checklist',
      'Monitoring + handoff',
      'Continuous improvements',
    ],
    duration: 'Week 8 + Ongoing',
    fillPercent: 12.5,
  },
];

export default function HowWeDeliverSection() {
  return (
    <section style={{ background: cx.sage }} className="py-24 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className="mb-3"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              fontWeight: 600,
              color: cx.deepGreen,
              lineHeight: 1.2,
            }}
          >
            How We Deliver
          </h2>

          <div
            className="w-20 h-px mx-auto mb-6"
            style={{
              background: cx.deepGreen,
              opacity: 0.2,
            }}
          />

          <p
            className="mb-2"
            style={{
              fontFamily: 'Lora, serif',
              fontSize: '1.25rem',
              color: cx.deepGreen,
              opacity: 0.8,
              fontWeight: 500,
            }}
          >
            Strategy. Systems. Speed.
          </p>

          <p
            style={{
              fontFamily: 'Lora, serif',
              fontSize: '0.9375rem',
              color: cx.deepGreen,
              opacity: 0.6,
              maxWidth: '32rem',
              margin: '0 auto',
            }}
          >
            A focused process designed for speed — not bureaucracy.
          </p>
        </div>

        {/* Optional Mini Timeline */}
        <MiniTimeline />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {deliveryPhases.map((phase, idx) => (
            <PhaseCard key={idx} {...phase} />
          ))}
        </div>

        {/* Section CTA */}
        <div className="text-center">
          <Link
            to="/process"
            className="group inline-flex items-center gap-2 transition-all duration-300"
            style={{
              fontFamily: 'Lora, serif',
              fontSize: '1rem',
              color: cx.accentGreen,
              fontWeight: 500,
            }}
          >
            <span className="border-b border-transparent group-hover:border-current transition-all duration-300">
              See the detailed 8-week process
            </span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function MiniTimeline() {
  const weekLabels = ['Week 1', 'Weeks 2–3', 'Weeks 4–7', 'Week 8'];

  return (
    <div className="relative mb-16 px-8">
      {/* Horizontal Line */}
      <div
        className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2"
        style={{
          background: cx.deepGreen,
          opacity: 0.15,
        }}
      />

      {/* Dots Container */}
      <div className="relative flex justify-between items-center">
        {weekLabels.map((label, idx) => (
          <div key={idx} className="flex flex-col items-center gap-3">
            {/* Label Above */}
            <span
              style={{
                fontFamily: 'Lora, serif',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: cx.deepGreen,
                opacity: 0.6,
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>

            {/* Dot */}
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: cx.accentGreen,
                boxShadow: `0 0 0 3px ${cx.sage}`, // Creates space between dots and line
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PhaseCard({
  icon,
  eyebrow,
  title,
  description,
  bullets,
  duration,
  fillPercent,
}: DeliveryPhase) {
  return (
    <div
      className="group relative flex flex-col transition-all duration-300 hover:-translate-y-1"
      style={{
        background: cx.white,
        border: `1px solid ${cx.border}`,
        borderRadius: '20px',
        padding: '2rem', // 32px for better fit at 4 columns
        boxShadow:
          '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Icon Container */}
      <div
        className="inline-flex items-center justify-center mb-4"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '12px',
          background: `${cx.deepGreen}14`, // 8% opacity
          color: cx.deepGreen,
        }}
      >
        {icon}
      </div>

      {/* Eyebrow Label */}
      <p
        className="mb-2"
        style={{
          fontFamily: 'Lora, serif',
          fontSize: '0.75rem',
          fontWeight: 500,
          color: cx.muted,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {eyebrow}
      </p>

      {/* Card Title */}
      <h3
        className="mb-3"
        style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.5rem',
          fontWeight: 600,
          color: cx.deepGreen,
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>

      {/* Card Description */}
      <p
        className="mb-5"
        style={{
          fontFamily: 'Lora, serif',
          fontSize: '0.9375rem',
          color: cx.deepGreen,
          opacity: 0.8,
          lineHeight: 1.7,
        }}
      >
        {description}
      </p>

      {/* Micro Bullets */}
      <ul className="space-y-2 mb-6">
        {bullets.map((bullet, idx) => (
          <li
            key={idx}
            style={{
              fontFamily: 'Lora, serif',
              fontSize: '0.8125rem',
              color: cx.muted,
              lineHeight: 1.6,
            }}
          >
            • {bullet}
          </li>
        ))}
      </ul>

      {/* Duration Badge */}
      <div
        className="mt-auto pt-5"
        style={{
          borderTop: `1px solid ${cx.deepGreen}1A`, // 10% opacity
        }}
      >
        <p
          className="mb-1"
          style={{
            fontFamily: 'Lora, serif',
            fontSize: '0.6875rem',
            fontWeight: 500,
            color: cx.deepGreen,
            opacity: 0.5,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Duration
        </p>

        <p
          className="mb-3"
          style={{
            fontFamily: 'Lora, serif',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: cx.accentGreen,
          }}
        >
          {duration}
        </p>

        {/* Progress Bar */}
        <div
          className="w-full h-1 rounded-full overflow-hidden"
          style={{
            background: `${cx.deepGreen}1A`, // 10% opacity
          }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${fillPercent}%`,
              background: cx.accentGreen,
            }}
          />
        </div>
      </div>
    </div>
  );
}