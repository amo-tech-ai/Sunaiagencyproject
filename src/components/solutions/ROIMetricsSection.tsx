// C26 — ROI Metrics Section (Solutions Page)
// BCG design system dark variant: charcoal bg, green accents, Georgia serif

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from 'recharts';

/* ── Data ── */

const revenueData = [
  { month: 'M1', before: 42, after: 48 },
  { month: 'M2', before: 44, after: 58 },
  { month: 'M3', before: 45, after: 72 },
  { month: 'M4', before: 46, after: 85 },
  { month: 'M5', before: 47, after: 96 },
  { month: 'M6', before: 48, after: 112 },
];

const savingsData = [
  { month: 'Jan', savings: 12 },
  { month: 'Feb', savings: 19 },
  { month: 'Mar', savings: 28 },
  { month: 'Apr', savings: 38 },
  { month: 'May', savings: 52 },
  { month: 'Jun', savings: 64 },
  { month: 'Jul', savings: 74 },
  { month: 'Aug', savings: 82 },
];

/* ── Readiness Score Ring ── */

function ReadinessRing({ score, label }: { score: number; label: string }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[140px] h-[140px]">
        <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
          <circle
            cx="70" cy="70" r={r}
            fill="none"
            stroke="rgba(245,245,240,0.06)"
            strokeWidth="8"
          />
          <motion.circle
            cx="70" cy="70" r={r}
            fill="none"
            stroke="#00875A"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{ fontSize: '1.75rem', color: '#00875A', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
            {score}%
          </span>
        </div>
      </div>
      <span
        className="mt-3 text-center text-xs tracking-widest uppercase"
        style={{ color: 'rgba(245,245,240,0.4)', letterSpacing: '0.06em' }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Chart Card Wrapper ── */

function ChartCard({
  children, title, subtitle, delay,
}: {
  children: React.ReactNode; title: string; subtitle: string; delay: number;
}) {
  return (
    <motion.div
      className="rounded p-6"
      style={{
        backgroundColor: 'rgba(245,245,240,0.03)',
        border: '1px solid rgba(245,245,240,0.08)',
        borderRadius: '4px',
        minHeight: '340px',
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay }}
    >
      <div className="mb-5">
        <h3 className="text-base mb-1" style={{ fontFamily: 'Georgia, serif', color: '#F5F5F0' }}>
          {title}
        </h3>
        <p className="text-xs" style={{ color: 'rgba(245,245,240,0.35)' }}>
          {subtitle}
        </p>
      </div>
      {children}
    </motion.div>
  );
}

/* ── Custom Tooltip ── */

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded px-3 py-2"
      style={{
        backgroundColor: '#1A1A1A',
        border: '1px solid rgba(0,135,90,0.3)',
        borderRadius: '4px',
      }}
    >
      <p className="text-xs" style={{ color: 'rgba(245,245,240,0.5)' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-sm" style={{ color: p.color }}>
          {p.name}: {p.value}{p.name.includes('Savings') ? ' hrs' : 'K'}
        </p>
      ))}
    </div>
  );
}

/* ── Main Section ── */

export default function ROIMetricsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="border-t" style={{ backgroundColor: '#1A1A1A', borderColor: 'rgba(245,245,240,0.08)' }}>
      <div className="max-w-[1120px] mx-auto px-6 py-20 md:py-28">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-xs tracking-widest uppercase mb-3"
            style={{ color: '#00875A', letterSpacing: '0.08em' }}
          >
            Measurable Impact
          </p>
          <h2
            className="text-2xl md:text-3xl mb-3"
            style={{ fontFamily: 'Georgia, serif', fontWeight: 400, color: '#F5F5F0', lineHeight: 1.15 }}
          >
            ROI that compounds
          </h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(245,245,240,0.45)', lineHeight: 1.6 }}>
            Real performance data from deployed AI systems across our client portfolio.
          </p>
          <div className="mt-4 mx-auto h-0.5 w-12" style={{ backgroundColor: '#00875A' }} />
        </motion.div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Revenue Growth */}
          <ChartCard title="Revenue Impact" subtitle="Before vs. After AI deployment ($K)" delay={0.1}>
            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revenueData} barGap={3}>
                  <CartesianGrid strokeDasharray="3 6" stroke="rgba(245,245,240,0.04)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(245,245,240,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(245,245,240,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="before" name="Before" fill="rgba(245,245,240,0.1)" radius={[2, 2, 0, 0]} barSize={14} />
                  <Bar dataKey="after" name="After" fill="#00875A" radius={[2, 2, 0, 0]} barSize={14} fillOpacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Automation Savings */}
          <ChartCard title="Automation Savings" subtitle="Hours saved per week, cumulative" delay={0.2}>
            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={savingsData}>
                  <defs>
                    <linearGradient id="roiSavingsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00875A" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#00875A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 6" stroke="rgba(245,245,240,0.04)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(245,245,240,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(245,245,240,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="savings" name="Savings" stroke="#00875A" strokeWidth={2} fill="url(#roiSavingsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Readiness Scores */}
          <ChartCard title="AI Readiness Scores" subtitle="Client averages post-engagement" delay={0.3}>
            <div className="h-[220px] flex items-center justify-center gap-8">
              <ReadinessRing score={87} label="Data Readiness" />
              <ReadinessRing score={94} label="System Uptime" />
            </div>
          </ChartCard>
        </div>

        {/* Summary stat row */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            { val: '3.2x', lbl: 'Avg. Revenue Lift' },
            { val: '68%', lbl: 'Cost Reduction' },
            { val: '82 hrs', lbl: 'Weekly Time Saved' },
            { val: '< 6 wk', lbl: 'Time to Value' },
          ].map((stat) => (
            <div
              key={stat.lbl}
              className="rounded py-5 px-4 text-center"
              style={{
                backgroundColor: 'rgba(245,245,240,0.03)',
                border: '1px solid rgba(245,245,240,0.06)',
                borderRadius: '4px',
              }}
            >
              <span
                className="block"
                style={{ fontSize: '1.25rem', color: '#00875A', fontFamily: 'JetBrains Mono, monospace' }}
              >
                {stat.val}
              </span>
              <span
                className="block mt-1 text-xs tracking-widest uppercase"
                style={{ color: 'rgba(245,245,240,0.35)', letterSpacing: '0.04em' }}
              >
                {stat.lbl}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
