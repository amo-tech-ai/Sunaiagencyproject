import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  BarChart, Bar, LineChart, Line,
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
            stroke="rgba(241,238,234,0.06)"
            strokeWidth="8"
          />
          <motion.circle
            cx="70" cy="70" r={r}
            fill="none"
            stroke="#84CC16"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
            style={{ filter: 'drop-shadow(0 0 8px rgba(132,204,22,0.3))' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-[#84CC16]"
            style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1 }}
          >
            {score}%
          </span>
        </div>
      </div>
      <span
        className="text-[#F1EEEA]/40 mt-3 text-center"
        style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Chart Card Wrapper ── */

function ChartCard({
  children,
  title,
  subtitle,
  delay,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  delay: number;
}) {
  return (
    <motion.div
      className="rounded-2xl p-6 sm:p-7"
      style={{
        background: 'rgba(241,238,234,0.025)',
        border: '1px solid rgba(241,238,234,0.06)',
        minHeight: '340px',
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay }}
    >
      <div className="mb-5">
        <h3
          className="text-[#F1EEEA]/85 mb-1"
          style={{ fontSize: '0.95rem', fontWeight: 600 }}
        >
          {title}
        </h3>
        <p
          className="text-[#F1EEEA]/30"
          style={{ fontSize: '0.72rem', fontWeight: 500 }}
        >
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
      className="rounded-lg px-3 py-2"
      style={{
        background: 'rgba(10,33,31,0.95)',
        border: '1px solid rgba(132,204,22,0.2)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}
    >
      <p className="text-[#F1EEEA]/50" style={{ fontSize: '0.65rem', fontWeight: 500 }}>
        {label}
      </p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontSize: '0.75rem', fontWeight: 600, color: p.color }}>
          {p.name}: {p.value}
          {p.name.includes('Savings') ? ' hrs' : 'K'}
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
    <section ref={ref} className="relative bg-[#0A211F] py-24 sm:py-32 overflow-hidden">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(241,238,234,0.06)] to-transparent" />

      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-[#84CC16]/60 uppercase tracking-[0.25em] mb-4"
            style={{ fontSize: '0.65rem', fontWeight: 600 }}
          >
            Measurable Impact
          </p>
          <h2
            className="text-[#F1EEEA] tracking-tight mb-4"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 600,
              lineHeight: 1.12,
            }}
          >
            ROI that{' '}
            <span style={{ fontStyle: 'italic' }}>compounds</span>
          </h2>
          <p
            className="text-[#F1EEEA]/35 max-w-md mx-auto"
            style={{ fontSize: '0.95rem', lineHeight: 1.6 }}
          >
            Real performance data from deployed AI systems across our client portfolio.
          </p>
        </motion.div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Growth – Bar Chart */}
          <ChartCard
            title="Revenue Impact"
            subtitle="Before vs. After AI deployment ($K)"
            delay={0.1}
          >
            <div style={{ width: '100%', height: '220px', minHeight: '220px' }}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revenueData} barGap={3}>
                  <CartesianGrid
                    strokeDasharray="3 6"
                    stroke="rgba(241,238,234,0.04)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'rgba(241,238,234,0.3)', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'rgba(241,238,234,0.2)', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="before"
                    name="Before"
                    fill="rgba(241,238,234,0.1)"
                    radius={[4, 4, 0, 0]}
                    barSize={14}
                  />
                  <Bar
                    dataKey="after"
                    name="After"
                    fill="#84CC16"
                    radius={[4, 4, 0, 0]}
                    barSize={14}
                    fillOpacity={0.85}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Automation Savings – Area/Line Chart */}
          <ChartCard
            title="Automation Savings"
            subtitle="Hours saved per week, cumulative"
            delay={0.2}
          >
            <div style={{ width: '100%', height: '220px', minHeight: '220px' }}>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={savingsData}>
                  <defs>
                    <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#84CC16" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#84CC16" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 6"
                    stroke="rgba(241,238,234,0.04)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'rgba(241,238,234,0.3)', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'rgba(241,238,234,0.2)', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="savings"
                    name="Savings"
                    stroke="#84CC16"
                    strokeWidth={2}
                    fill="url(#savingsGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Readiness Scores */}
          <ChartCard
            title="AI Readiness Scores"
            subtitle="Client averages post-engagement"
            delay={0.3}
          >
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
            { val: '3.2×', lbl: 'Avg. Revenue Lift' },
            { val: '68%', lbl: 'Cost Reduction' },
            { val: '82 hrs', lbl: 'Weekly Time Saved' },
            { val: '< 6 wk', lbl: 'Time to Value' },
          ].map((stat) => (
            <div
              key={stat.lbl}
              className="rounded-xl py-5 px-4 text-center"
              style={{
                background: 'rgba(241,238,234,0.02)',
                border: '1px solid rgba(241,238,234,0.05)',
              }}
            >
              <span
                className="block text-[#84CC16]"
                style={{ fontSize: '1.25rem', fontWeight: 700 }}
              >
                {stat.val}
              </span>
              <span
                className="block text-[#F1EEEA]/30 mt-1"
                style={{ fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}
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