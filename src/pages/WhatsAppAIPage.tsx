// C37 — WhatsApp AI Automation Service Page
// BCG design system: warm off-white, charcoal text, green accents

import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import {
  MessageSquare, Bot, ShoppingCart, Calendar, Users, BarChart3,
  ArrowRight, Check, Zap, Globe, Shield, Clock
} from 'lucide-react';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1642724978500-c13b821afe04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGF0c2FwcCUyMG1lc3NhZ2luZyUyMGJ1c2luZXNzJTIwYXV0b21hdGlvbnxlbnwxfHx8fDE3NzI4Njk2NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

const CAPABILITIES = [
  {
    icon: Bot,
    title: 'AI-Powered Conversations',
    description: 'Natural language chatbot that handles inquiries, qualifies leads, and provides instant responses 24/7 — in the messaging app your customers already use.',
  },
  {
    icon: ShoppingCart,
    title: 'In-Chat Commerce',
    description: 'Let customers browse products, check availability, place orders, and track deliveries without leaving WhatsApp.',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Automated appointment booking, reminders, and rescheduling — all via WhatsApp. Syncs with your existing calendar systems.',
  },
  {
    icon: Users,
    title: 'Lead Qualification',
    description: 'AI-driven lead scoring and routing. Automatically capture, qualify, and assign leads to the right team member based on intent signals.',
  },
  {
    icon: BarChart3,
    title: 'CRM Integration',
    description: 'Every conversation syncs to your CRM in real time. Full context, conversation history, and customer data — no manual entry.',
  },
  {
    icon: Globe,
    title: 'Multi-Language Support',
    description: 'Serve customers in 50+ languages with real-time AI translation. No extra agents needed for international markets.',
  },
];

const RESULTS = [
  { metric: '3x', label: 'Higher open rates vs email' },
  { metric: '60%', label: 'Faster response times' },
  { metric: '40%', label: 'Reduction in support tickets' },
  { metric: '2.5x', label: 'Higher conversion from leads' },
];

const HOW_IT_WORKS = [
  { step: 1, title: 'Connect', description: 'We set up your WhatsApp Business API and connect it to your existing systems — CRM, calendars, e-commerce platforms.' },
  { step: 2, title: 'Train', description: 'Our AI learns your product catalog, FAQs, brand voice, and business rules to handle conversations intelligently.' },
  { step: 3, title: 'Launch', description: 'Go live with automated flows for sales, support, and operations. Your team monitors and refines with our analytics dashboard.' },
  { step: 4, title: 'Scale', description: 'Expand to new use cases — marketing broadcasts, payment collection, loyalty programs — as your confidence grows.' },
];

const INCLUDED = [
  'WhatsApp Business API setup',
  'Custom AI chatbot training',
  'CRM bi-directional sync',
  'Automated booking flows',
  'Product catalog integration',
  'Multi-language support',
  'Analytics dashboard',
  'Human handoff escalation',
  'Broadcast messaging tools',
  'Compliance & opt-in management',
];

export default function WhatsAppAIPage() {
  return (
    <div style={{ backgroundColor: '#F5F5F0' }}>
      {/* ═══ HERO ═══ */}
      <section className="border-b" style={{ borderColor: '#E8E8E4' }}>
        <div className="max-w-[1120px] mx-auto px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
                WhatsApp AI Automation
              </p>
              <h1 className="text-3xl md:text-4xl mb-5" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A', fontWeight: 400, lineHeight: 1.2 }}>
                Turn WhatsApp into your most powerful sales and support channel
              </h1>
              <p className="text-base mb-8" style={{ color: '#6B6B63', lineHeight: 1.7 }}>
                AI-powered automation for lead capture, customer support, appointment booking, and in-chat commerce — all within the messaging platform 2 billion people already use.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/wizard?s=whatsapp"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm transition-colors"
                  style={{ backgroundColor: '#00875A', color: '#FFFFFF', borderRadius: '4px' }}
                >
                  Start Your WhatsApp Project
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm border transition-colors"
                  style={{ borderColor: '#1A1A1A', color: '#1A1A1A', borderRadius: '4px' }}
                >
                  Book a Demo
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <div className="border rounded overflow-hidden" style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}>
                <ImageWithFallback src={HERO_IMAGE} alt="WhatsApp AI automation interface" className="w-full h-auto" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ RESULTS ═══ */}
      <section className="border-b" style={{ borderColor: '#E8E8E4', backgroundColor: '#FFFFFF' }}>
        <div className="max-w-[1120px] mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {RESULTS.map((item, idx) => (
              <motion.div
                key={item.label}
                className="text-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.1 }}
              >
                <p className="text-3xl md:text-4xl mb-2" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00875A' }}>
                  {item.metric}
                </p>
                <p className="text-sm" style={{ color: '#6B6B63' }}>{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CAPABILITIES ═══ */}
      <section className="border-b" style={{ borderColor: '#E8E8E4' }}>
        <div className="max-w-[1120px] mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
              Capabilities
            </p>
            <h2 className="text-2xl md:text-3xl mb-3" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A', fontWeight: 400 }}>
              Everything your business needs on WhatsApp
            </h2>
            <p className="text-sm max-w-xl mx-auto" style={{ color: '#6B6B63' }}>
              From first contact to post-purchase support, automate your entire customer journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPABILITIES.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <motion.div
                  key={cap.title}
                  className="border rounded p-6 transition-all hover:shadow-sm"
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E8E4', borderRadius: '4px' }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.08 }}
                >
                  <Icon className="w-6 h-6 mb-4" style={{ color: '#00875A' }} />
                  <h3 className="text-base mb-2" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
                    {cap.title}
                  </h3>
                  <p className="text-sm" style={{ color: '#6B6B63', lineHeight: 1.6 }}>
                    {cap.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="border-b" style={{ borderColor: '#E8E8E4', backgroundColor: '#FFFFFF' }}>
        <div className="max-w-[1120px] mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
              How It Works
            </p>
            <h2 className="text-2xl md:text-3xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A', fontWeight: 400 }}>
              From setup to scale in 4 steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item, idx) => (
              <motion.div
                key={item.step}
                className="relative"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
              >
                <div className="border rounded p-6" style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}>
                  <span className="text-xs px-2 py-0.5 rounded mb-3 inline-block" style={{ backgroundColor: '#E6F4ED', color: '#00875A', borderRadius: '2px' }}>
                    Step {item.step}
                  </span>
                  <h3 className="text-base mb-2" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm" style={{ color: '#6B6B63', lineHeight: 1.6 }}>
                    {item.description}
                  </p>
                </div>
                {idx < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-4 h-4" style={{ color: '#E8E8E4' }} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHAT'S INCLUDED ═══ */}
      <section className="border-b" style={{ borderColor: '#E8E8E4' }}>
        <div className="max-w-[1120px] mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
                What's Included
              </p>
              <h2 className="text-2xl md:text-3xl mb-4" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A', fontWeight: 400 }}>
                A complete WhatsApp AI solution
              </h2>
              <p className="text-sm mb-6" style={{ color: '#6B6B63', lineHeight: 1.7 }}>
                Every engagement includes setup, training, integration, and ongoing optimization. No hidden costs, no surprises.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <div className="flex items-center gap-2 px-3 py-1.5 border rounded text-xs" style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}>
                  <Shield className="w-3.5 h-3.5" style={{ color: '#00875A' }} />
                  <span style={{ color: '#6B6B63' }}>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 border rounded text-xs" style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}>
                  <Clock className="w-3.5 h-3.5" style={{ color: '#00875A' }} />
                  <span style={{ color: '#6B6B63' }}>2-4 Week Delivery</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 border rounded text-xs" style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}>
                  <Zap className="w-3.5 h-3.5" style={{ color: '#00875A' }} />
                  <span style={{ color: '#6B6B63' }}>24/7 Availability</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INCLUDED.map(item => (
                <div key={item} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 shrink-0" style={{ color: '#00875A' }} />
                  <span className="text-sm" style={{ color: '#1A1A1A' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section>
        <div className="max-w-[1120px] mx-auto px-6 py-20">
          <div className="border rounded p-10 md:p-16 text-center" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E8E4', borderRadius: '4px' }}>
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
              Ready to get started?
            </p>
            <h2 className="text-2xl md:text-3xl mb-4" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A', fontWeight: 400 }}>
              Transform your WhatsApp channel today
            </h2>
            <p className="text-sm max-w-lg mx-auto mb-8" style={{ color: '#6B6B63' }}>
              Join businesses seeing 3x higher engagement and 40% lower support costs with WhatsApp AI automation.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/wizard?s=whatsapp"
                className="inline-flex items-center gap-2 px-8 py-3 text-sm transition-colors"
                style={{ backgroundColor: '#00875A', color: '#FFFFFF', borderRadius: '4px' }}
              >
                Start Your Project
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-8 py-3 text-sm border transition-colors"
                style={{ borderColor: '#1A1A1A', color: '#1A1A1A', borderRadius: '4px' }}
              >
                Book a Strategy Call
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
