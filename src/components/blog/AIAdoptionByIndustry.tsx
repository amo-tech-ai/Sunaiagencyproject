// Blog: "AI Adoption by Industry (2025–2026)"
// Premium consulting-grade infographic: hero stat, horizontal bar ranking,
// insight cards, maturity map, strategic insight, source footer
// Design: Stanford AI Index / McKinsey / Stripe dashboard aesthetic

import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import {
  ArrowLeft, Zap, Lightbulb, TrendingUp,
  Cpu, Landmark, Briefcase, HeartPulse, ShoppingBag,
  Factory, Truck, Megaphone, Bolt, GraduationCap,
} from 'lucide-react';

/* ── Data ── */

interface IndustryData {
  label: string;
  pct: number;
  icon: typeof Cpu;
  tier: 'high' | 'medium' | 'early';
}

const TIER_COLORS = {
  high:   { bar: '#1E40AF', bg: '#DBEAFE', text: '#1E3A8A', label: 'High Adoption' },
  medium: { bar: '#0D9488', bg: '#CCFBF1', text: '#115E59', label: 'Medium Adoption' },
  early:  { bar: '#D97706', bg: '#FEF3C7', text: '#92400E', label: 'Early Stage' },
} as const;

const INDUSTRIES: IndustryData[] = [
  { label: 'Technology / SaaS',      pct: 92, icon: Cpu,            tier: 'high' },
  { label: 'Financial Services',     pct: 80, icon: Landmark,       tier: 'high' },
  { label: 'Professional Services',  pct: 60, icon: Briefcase,      tier: 'high' },
  { label: 'Healthcare',             pct: 50, icon: HeartPulse,     tier: 'medium' },
  { label: 'Retail / E-commerce',    pct: 50, icon: ShoppingBag,    tier: 'medium' },
  { label: 'Manufacturing',          pct: 45, icon: Factory,        tier: 'medium' },
  { label: 'Logistics',              pct: 35, icon: Truck,          tier: 'early' },
  { label: 'Marketing / Media',      pct: 30, icon: Megaphone,      tier: 'early' },
  { label: 'Energy / Climate',       pct: 20, icon: Bolt,           tier: 'early' },
  { label: 'Education',              pct: 12, icon: GraduationCap,  tier: 'early' },
];

interface InsightCard {
  title: string;
  text: string;
  accent: string;
}

const INSIGHTS: InsightCard[] = [
  {
    title: 'Tech industry nearly saturated',
    text: 'Technology companies report over 90% AI adoption across large enterprises.',
    accent: '#1E40AF',
  },
  {
    title: 'Financial services scaling fastest',
    text: 'Banks are among the largest investors in AI for fraud detection, trading, and risk modeling.',
    accent: '#0D9488',
  },
  {
    title: 'Manufacturing catching up',
    text: 'AI-powered robotics and predictive maintenance are accelerating adoption across factories.',
    accent: '#D97706',
  },
  {
    title: 'Healthcare accelerating',
    text: 'AI is transforming diagnostics, drug discovery, and hospital workflow automation.',
    accent: '#7C3AED',
  },
];

const SOURCES = [
  'McKinsey — State of AI 2025',
  'Stanford — AI Index Report 2025',
  'Deloitte — State of AI in Enterprise 2026',
  'OECD — AI adoption by firms 2025',
  'PwC — Global AI Survey 2025',
];

/* ── Component ── */

export default function AIAdoptionByIndustry() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* ─── SECTION 1: HERO ─── */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-6 sm:py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#1E293B] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#4F46E5]">
              Research &amp; Insights
            </span>
            <span className="text-xs text-[#94A3B8]">&middot;</span>
            <span className="text-xs text-[#94A3B8]">March 2026</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-[42px] leading-tight tracking-tight text-[#0F172A] mb-3"
            style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
          >
            AI Adoption by Industry (2025–2026)
          </h1>
          <p className="text-base sm:text-lg text-[#475569] max-w-2xl leading-relaxed mb-8">
            AI adoption across industries — from near-universal in technology to early-stage in education.
          </p>

          {/* Hero stat */}
          <motion.div
            className="flex items-end gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#0F172A]" style={{ lineHeight: 1 }}>
              78%
            </span>
            <div className="pb-2">
              <p className="text-sm sm:text-base font-medium text-[#334155]">
                Companies using AI in at least one function
              </p>
              <p className="text-xs text-[#94A3B8] mt-0.5">Enterprise AI adoption rate</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">

        {/* ─── SECTION 2: INDUSTRY ADOPTION RANKING ─── */}
        <section>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-2.5 mb-1">
              <TrendingUp className="w-5 h-5 text-[#4F46E5]" />
              <h2 className="text-lg sm:text-xl font-semibold text-[#0F172A]">
                Organization-wide AI Adoption Rate
              </h2>
            </div>
            <p className="text-sm text-[#94A3B8] mb-8">
              Percentage of organizations reporting AI adoption, by industry
            </p>

            <div className="space-y-5">
              {INDUSTRIES.map((ind, idx) => (
                <BarRow key={ind.label} ind={ind} index={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── SECTION 3: INDUSTRY INSIGHTS (4 cards) ─── */}
        <section className="mt-10 sm:mt-14">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-4">
            Key Insights
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {INSIGHTS.map((card, idx) => (
              <InsightCardComponent key={card.title} card={card} index={idx} />
            ))}
          </div>
        </section>

        {/* ─── SECTION 4: ADOPTION MATURITY MAP ─── */}
        <section className="mt-10 sm:mt-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-4">
              Adoption Maturity Map
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {(['high', 'medium', 'early'] as const).map((tier) => {
                const tc = TIER_COLORS[tier];
                const items = INDUSTRIES.filter((i) => i.tier === tier);
                return (
                  <div
                    key={tier}
                    className="bg-white rounded-2xl border border-[#E2E8F0] p-6 relative overflow-hidden"
                  >
                    {/* Top colored strip */}
                    <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: tc.bar }} />
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-4"
                      style={{ backgroundColor: tc.bg, color: tc.text }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tc.bar }} />
                      {tc.label}
                    </div>
                    <ul className="space-y-3">
                      {items.map((ind) => {
                        const Icon = ind.icon;
                        return (
                          <li key={ind.label} className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{ backgroundColor: `${tc.bar}12` }}
                            >
                              <Icon className="w-4 h-4" style={{ color: tc.bar }} />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-[#1E293B]">{ind.label}</span>
                              <span className="text-xs text-[#94A3B8] ml-2">{ind.pct}%</span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* ─── SECTION 5: STRATEGIC INSIGHT ─── */}
        <motion.div
          className="mt-10 sm:mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-2xl p-8 sm:p-10 text-white relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />
            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">
                  The AI Productivity Gap
                </h3>
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-white/90">
                The real divide in AI adoption is not industry interest but digital maturity
                and data readiness. Early-adopting sectors are accelerating while late adopters
                fall further behind.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ─── CTA ─── */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-sm text-[#64748B] mb-4">
            Ready to see where AI fits in your organization?
          </p>
          <Link
            to="/wizard"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0F172A] text-white text-sm font-medium rounded-lg hover:bg-[#1E293B] transition-colors shadow-sm"
          >
            <Zap className="w-4 h-4" />
            Start Your AI Assessment
          </Link>
        </div>

        {/* ─── SECTION 6: SOURCES ─── */}
        <footer className="mt-12 sm:mt-16 pt-6 border-t border-[#E2E8F0]">
          <p className="text-xs text-[#94A3B8] mb-2 font-medium uppercase tracking-wider">Sources</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {SOURCES.map((s) => (
              <span key={s} className="text-xs text-[#B0B8C4]">{s}</span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ── Bar Row ── */

function BarRow({ ind, index }: { ind: IndustryData; index: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = ind.icon;
  const tc = TIER_COLORS[ind.tier];
  const maxPct = 92; // scale bars relative to highest

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Label row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200"
            style={{
              backgroundColor: `${tc.bar}14`,
              transform: hovered ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <Icon className="w-4 h-4" style={{ color: tc.bar }} />
          </div>
          <span className="text-sm font-medium text-[#1E293B]">
            {ind.label}
          </span>
        </div>
        <span
          className="text-sm font-semibold tabular-nums transition-colors duration-200"
          style={{ color: hovered ? tc.bar : '#475569' }}
        >
          {ind.pct}%
        </span>
      </div>

      {/* Bar */}
      <div className="h-3 rounded-full bg-[#F1F5F9] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundColor: tc.bar,
            boxShadow: hovered ? `0 0 12px ${tc.bar}40` : 'none',
            transition: 'box-shadow 0.2s ease',
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${(ind.pct / maxPct) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.06 + 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
}

/* ── Insight Card ── */

function InsightCardComponent({ card, index }: { card: InsightCard; index: number }) {
  return (
    <motion.div
      className="bg-white rounded-xl border border-[#E2E8F0] p-5 transition-all duration-200 hover:shadow-md hover:border-[#CBD5E1] hover:-translate-y-0.5 cursor-default"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
    >
      <div
        className="w-1 h-8 rounded-full mb-3"
        style={{ backgroundColor: card.accent }}
      />
      <h4 className="text-sm font-semibold text-[#0F172A] mb-1.5">
        {card.title}
      </h4>
      <p className="text-[13px] leading-relaxed text-[#64748B]">
        {card.text}
      </p>
    </motion.div>
  );
}
