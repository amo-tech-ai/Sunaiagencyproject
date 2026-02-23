import { motion } from 'motion/react';
import { Handshake, Award, Trophy, CheckCircle } from 'lucide-react';

interface V2HighlightCardsProps {
  onNavigate?: (page: string) => void;
}

interface MetricProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CardData {
  icon: React.ReactNode;
  title: string;
  theme: string;
  metrics: MetricProps[];
  badges?: { image: string; alt: string }[];
}

const Metric = ({ value, label, icon }: MetricProps) => (
  <div className="space-y-2">
    <div className="flex items-start gap-2">
      <span className="font-['Playfair_Display'] text-4xl lg:text-5xl font-bold text-[#1E6F5C] leading-none">
        {value}
      </span>
      {icon && <span className="text-[#84CC16] mt-1">{icon}</span>}
    </div>
    <p className="text-sm text-[#1E6F5C]/70 leading-relaxed font-['Lora']">
      {label}
    </p>
  </div>
);

const HighlightCard = ({ icon, title, theme, metrics, badges }: CardData) => (
  <motion.div
    className="flex flex-col overflow-hidden bg-white"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    style={{ borderRadius: '16px' }}
  >
    {/* Header - Solid Green Background */}
    <div className="bg-[#1E6F5C] px-8 py-8 flex items-center gap-4">
      <div className="text-white/90 flex-shrink-0" aria-hidden="true">
        {icon}
      </div>
      <h3 className="font-['Playfair_Display'] text-2xl lg:text-3xl font-bold text-white leading-tight">
        {title}
      </h3>
    </div>

    {/* Body - Light Background with Metrics Grid */}
    <div className="bg-[#E8F5E9] px-8 py-10 flex-1">
      {!badges ? (
        /* 2×2 Metric Grid */
        <div className="grid grid-cols-2 gap-x-8 gap-y-10">
          {metrics.map((metric, index) => (
            <Metric key={index} {...metric} />
          ))}
        </div>
      ) : (
        /* Badge Layout for Awards Card */
        <div className="space-y-8">
          <div className="flex items-center justify-center gap-4 pb-6 border-b border-[#1E6F5C]/10">
            {badges.map((badge, index) => (
              <motion.div
                key={index}
                className="relative h-24 w-24 flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={badge.image}
                  alt={badge.alt}
                  className="w-full h-full object-contain"
                />
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-base text-[#1E6F5C]/80 leading-relaxed font-['Lora']">
              60+ employer awards recognized BCG in 2024
            </p>
          </div>
        </div>
      )}
    </div>
  </motion.div>
);

export default function V2HighlightCards({ onNavigate }: V2HighlightCardsProps) {
  const cards: CardData[] = [
    {
      icon: <Handshake size={48} strokeWidth={1.5} />,
      title: 'Unlocking Societal Impact',
      theme: 'impact',
      metrics: [
        {
          value: '$600M+',
          label: 'Invested in societal impact in 2024; $2B+ since 2020',
        },
        {
          value: '3K+',
          label: 'Societal impact cases in 2024, up 19% from the previous year',
        },
        {
          value: '400Mt',
          label: 'Annual climate impact unlocked via client work by 2030¹',
        },
        {
          value: '70M',
          label: 'People expected to benefit from better education and jobs by 2030',
        },
      ],
    },
    {
      icon: <Award size={48} strokeWidth={1.5} />,
      title: 'Leading with Integrity',
      theme: 'integrity',
      metrics: [
        {
          value: '$13.5B',
          label: 'In revenue, a year-on-year increase of 10%',
        },
        {
          value: '33K',
          label: 'People form our strong, global team',
        },
        {
          value: '39%',
          label: 'Of Executive Committee members are women',
        },
        {
          value: '',
          label: 'On track for our own internal climate targets',
          icon: <CheckCircle size={40} strokeWidth={2} />,
        },
      ],
    },
    {
      icon: <Trophy size={48} strokeWidth={1.5} />,
      title: 'Walking the Talk',
      theme: 'awards',
      metrics: [],
      badges: [
        {
          image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
          alt: 'EcoVadis Platinum Award',
        },
        {
          image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
          alt: 'Best Places to Work 2024',
        },
        {
          image: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
          alt: 'Best Employer Award',
        },
      ],
    },
  ];

  return (
    <section className="relative bg-[#FDFCFB] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-['Playfair_Display'] text-3xl lg:text-4xl font-bold text-[#1E6F5C] mb-4 uppercase tracking-wide">
            2024 Highlights
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, index) => (
            <HighlightCard key={index} {...card} />
          ))}
        </div>

        {/* Footnote */}
        <motion.div
          className="mt-12 pt-8 border-t border-[#1E6F5C]/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-xs text-[#1E6F5C]/60 leading-relaxed font-['Lora'] max-w-5xl">
            ¹400 million tCO2e of annual climate impact from 2024 alone. Although not directly comparable, 
            400 MtCO2e is roughly equivalent to the annual emissions of the UK. In 2023, net territorial 
            greenhouse gas emissions in the UK were provisionally estimated at 384.2 MtCO2e (UK Department 
            of Energy Security & Net Zero, 2024).
          </p>
        </motion.div>
      </div>
    </section>
  );
}
