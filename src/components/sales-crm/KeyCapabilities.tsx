import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Inbox, Target, Send, FileText, TrendingUp, BarChart3 } from 'lucide-react';

export default function KeyCapabilities() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const capabilities = [
    {
      icon: Inbox,
      title: 'Intelligent Lead Capture',
      description: 'Unified inbox from web forms, emails, calls, referrals, and 10+ channels — automatically parsed and enriched.',
      emphasized: false
    },
    {
      icon: Target,
      title: 'AI Lead Scoring',
      description: 'Confidence-weighted ICP match scoring. High scores trigger instant engagement. Low scores route to nurture.',
      emphasized: true
    },
    {
      icon: Send,
      title: 'Automated Outreach',
      description: 'Personalized email sequences, follow-up reminders, and meeting booking — all triggered by lead behavior and score.',
      emphasized: false
    },
    {
      icon: FileText,
      title: 'Proposal Generation',
      description: 'AI drafts tailored proposals from templates, past wins, and deal context. Review, edit, send in minutes.',
      emphasized: false
    },
    {
      icon: TrendingUp,
      title: 'Revenue Forecasting',
      description: 'Real-time pipeline visibility with confidence-weighted projections. Know what\'s closing this quarter.',
      emphasized: false
    },
    {
      icon: BarChart3,
      title: 'Sales Analytics Dashboard',
      description: 'Track velocity, conversion rates, rep performance, and deal health. Identify bottlenecks instantly.',
      emphasized: false
    }
  ];

  return (
    <section ref={ref} className="py-24 lg:py-32" style={{ backgroundColor: '#FAF9F5' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          {/* Eyebrow */}
          <div className="mb-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#7EF473] font-semibold" style={{ fontFamily: 'system-ui, -apple-system' }}>
              CAPABILITIES
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl lg:text-6xl mb-6 text-[#0E3E1B]"
              style={{ fontFamily: 'Georgia, serif' }}>
            Built for Revenue, Not Record-Keeping
          </h2>

          {/* Body */}
          <p className="text-lg text-[#0E3E1B]/70 leading-relaxed max-w-2xl mx-auto"
             style={{ fontFamily: 'system-ui, -apple-system' }}>
            Traditional CRMs store data. This one acts on it — automatically.
          </p>
        </motion.div>

        {/* Capabilities Grid - 3x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              className={`bg-white/60 backdrop-blur-sm rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 shadow-sm ${
                capability.emphasized 
                  ? 'border-l-4 border-l-[#7EF473] border-t border-r border-b border-[#0E3E1B]/10' 
                  : 'border border-[#0E3E1B]/10 hover:border-[#7EF473]/50'
              }`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                capability.emphasized 
                  ? 'bg-[#7EF473]' 
                  : 'bg-[#7EF473]/10'
              }`}>
                <capability.icon className="w-6 h-6 text-[#0E3E1B]" strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3 className="text-2xl text-[#0E3E1B] mb-3"
                  style={{ fontFamily: 'Georgia, serif' }}>
                {capability.title}
              </h3>

              {/* Description */}
              <p className="text-[#0E3E1B]/70 leading-relaxed"
                 style={{ fontFamily: 'system-ui, -apple-system' }}>
                {capability.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}