// C-V2-11 — V2 Highlight Cards
// BCG design system: off-white bg, charcoal text, Georgia serif, green accents, 4px radius

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
  <div className="space-y-1.5">
    <div className="flex items-start gap-2">
      <span className="text-3xl lg:text-4xl leading-none" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
        {value}
      </span>
      {icon && <span className="mt-1" style={{ color: '#00875A' }}>{icon}</span>}
    </div>
    <p className="text-sm leading-relaxed" style={{ color: '#6B6B63' }}>{label}</p>
  </div>
);

const HighlightCard = ({ icon, title, theme, metrics, badges }: CardData) => (
  <motion.div
    className="flex flex-col overflow-hidden bg-white border"
    style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
  >
    <div className="px-7 py-7 flex items-center gap-4" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="text-white/90 flex-shrink-0">{icon}</div>
      <h3 className="text-xl lg:text-2xl text-white leading-tight" style={{ fontFamily: 'Georgia, serif' }}>{title}</h3>
    </div>
    <div className="px-7 py-8 flex-1" style={{ backgroundColor: '#F5F5F0' }}>
      {!badges ? (
        <div className="grid grid-cols-2 gap-x-6 gap-y-8">
          {metrics.map((metric, index) => (<Metric key={index} {...metric} />))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4 pb-5 border-b" style={{ borderColor: '#E8E8E4' }}>
            {badges.map((badge, index) => (
              <motion.div key={index} className="relative h-20 w-20 flex-shrink-0" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <img src={badge.image} alt={badge.alt} className="w-full h-full object-contain" />
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm leading-relaxed" style={{ color: '#6B6B63' }}>60+ employer awards recognized BCG in 2024</p>
          </div>
        </div>
      )}
    </div>
  </motion.div>
);

export default function V2HighlightCards({ onNavigate }: V2HighlightCardsProps) {
  const cards: CardData[] = [
    {
      icon: <Handshake size={44} strokeWidth={1.5} />, title: 'Unlocking Societal Impact', theme: 'impact',
      metrics: [
        { value: '$600M+', label: 'Invested in societal impact in 2024; $2B+ since 2020' },
        { value: '3K+', label: 'Societal impact cases in 2024, up 19% from the previous year' },
        { value: '400Mt', label: 'Annual climate impact unlocked via client work by 2030¹' },
        { value: '70M', label: 'People expected to benefit from better education and jobs by 2030' },
      ],
    },
    {
      icon: <Award size={44} strokeWidth={1.5} />, title: 'Leading with Integrity', theme: 'integrity',
      metrics: [
        { value: '$13.5B', label: 'In revenue, a year-on-year increase of 10%' },
        { value: '33K', label: 'People form our strong, global team' },
        { value: '39%', label: 'Of Executive Committee members are women' },
        { value: '', label: 'On track for our own internal climate targets', icon: <CheckCircle size={36} strokeWidth={2} /> },
      ],
    },
    {
      icon: <Trophy size={44} strokeWidth={1.5} />, title: 'Walking the Talk', theme: 'awards', metrics: [],
      badges: [
        { image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200', alt: 'EcoVadis Platinum Award' },
        { image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200', alt: 'Best Places to Work 2024' },
        { image: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200', alt: 'Best Employer Award' },
      ],
    },
  ];

  return (
    <section className="relative py-20 lg:py-28" style={{ backgroundColor: '#F5F5F0' }}>
      <div className="max-w-[1120px] mx-auto px-6">
        <motion.div className="mb-14" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl lg:text-4xl mb-3 tracking-wide uppercase" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
            2024 Highlights
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {cards.map((card, index) => (<HighlightCard key={index} {...card} />))}
        </div>

        <motion.div className="mt-10 pt-7 border-t" style={{ borderColor: '#E8E8E4' }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}>
          <p className="text-xs leading-relaxed max-w-5xl" style={{ color: '#6B6B63' }}>
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
