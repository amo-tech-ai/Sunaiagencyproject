import { Link } from 'react-router';
import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import {
  ArrowRight,
  BarChart3,
  Layers,
  GitBranch,
  TrendingUp,
  X,
  Check,
  Workflow,
  MapPin,
  ShoppingCart,
  Plane,
  Briefcase,
  Sparkles,
  Search,
  Palette,
  Package,
  Activity,
  Database,
  MessageSquare,
  Settings,
  LineChart,
  Users,
  Zap,
  Bot,
  Phone,
  Target,
  Calendar,
  Star,
  Clock,
  Shield,
  Eye
} from 'lucide-react';

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1600;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── FadeSection ─── */
function FadeSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S1 — HERO
   ═══════════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative pt-[180px] pb-[120px] px-6 md:px-16 overflow-hidden bg-[#0F3D3E]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F3D3E] via-[#1E3D36] to-[#0F3D3E]" />
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="inline-block text-[#84CC16] text-sm tracking-[0.2em] uppercase font-['Lora'] font-medium mb-6">
            Visual Intelligence
          </span>
          <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-white mb-6 max-w-4xl mx-auto">
            AI, Explained <em>Visually</em>
          </h1>
          <p className="font-['Lora'] text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto">
            Infographics, system maps, and animated visuals that turn complex AI into clear business decisions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#infographic-1" className="inline-flex items-center gap-2 px-8 py-4 bg-[#84CC16] text-gray-900 font-['Lora'] font-semibold rounded-full hover:bg-[#73b512] hover:shadow-lg hover:shadow-[#84CC16]/30 transition-all">
              View Examples <ArrowRight className="w-4 h-4" />
            </a>
            <Link to="/ai-readiness" className="px-8 py-4 border border-white text-white font-['Lora'] rounded-full hover:bg-white hover:text-gray-900 transition-all">
              Run AI Diagnostic
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S2 — INFOGRAPHIC 1: Process Flow — How AI Transforms a Business
   ═══════════════════════════════════════════════════════════════ */
function Infographic1() {
  const beforeItems = [
    { icon: Clock, label: 'Manual tasks', color: 'text-red-400' },
    { icon: X, label: 'Slow responses', color: 'text-red-400' },
    { icon: Users, label: 'Lost leads', color: 'text-red-400' },
  ];
  const afterItems = [
    { icon: Zap, label: 'Automated workflows', color: 'text-[#84CC16]' },
    { icon: MessageSquare, label: 'Instant replies', color: 'text-[#84CC16]' },
    { icon: TrendingUp, label: 'Optimized funnel', color: 'text-[#84CC16]' },
  ];
  const flowSteps = ['Traffic', 'Leads', 'Qualification', 'Conversion', 'Retention'];

  return (
    <FadeSection id="infographic-1" className="bg-[#1E3D36] py-24 lg:py-32 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#84CC16] text-xs tracking-[0.2em] uppercase font-['Lora'] font-medium">Infographic 01</span>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl lg:text-5xl text-white mt-4">
            How AI Transforms a Business
          </h2>
        </div>

        {/* Before → After split */}
        <div className="grid md:grid-cols-2 gap-0 mb-12">
          <div className="bg-white/[0.04] border border-white/8 p-10 md:p-12">
            <span className="text-red-400/80 text-xs tracking-[0.15em] uppercase font-['Lora'] font-medium">Before</span>
            <div className="space-y-6 mt-8">
              {beforeItems.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-red-400/10 border border-red-400/20 flex items-center justify-center">
                    <item.icon className={`w-5 h-5 ${item.color}`} strokeWidth={1.5} />
                  </div>
                  <span className="text-white/70 font-['Lora'] text-base">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/[0.08] border border-white/8 p-10 md:p-12">
            <span className="text-[#84CC16] text-xs tracking-[0.15em] uppercase font-['Lora'] font-medium">After AI</span>
            <div className="space-y-6 mt-8">
              {afterItems.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#84CC16]/10 border border-[#84CC16]/20 flex items-center justify-center">
                    <item.icon className={`w-5 h-5 ${item.color}`} strokeWidth={1.5} />
                  </div>
                  <span className="text-white/90 font-['Lora'] text-base">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Flow line */}
        <div className="bg-white/[0.04] border border-white/8 rounded-xl p-8 md:p-10">
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-3">
            {flowSteps.map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-[#84CC16]/10 border-2 border-[#84CC16]/30 flex items-center justify-center">
                    <span className="text-[#84CC16] font-['Lora'] font-semibold text-sm">{step.slice(0, 3)}</span>
                  </div>
                  <span className="text-white/60 text-xs font-['Lora'] mt-2">{step}</span>
                </div>
                {i < flowSteps.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-[#84CC16]/30 mx-2 hidden md:block" />
                )}
              </div>
            ))}
          </div>
          <p className="text-white/40 text-sm font-['Lora'] text-center mt-8 italic">
            See where time and revenue are lost — and how AI fixes it.
          </p>
        </div>
      </div>
    </FadeSection>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S3 — INFOGRAPHIC 2: AI System Map
   ═══════════════════════════════════════════════════════════════ */
function Infographic2() {
  const clusters = [
    { label: 'Lead Generation', icon: Target, pos: 'md:col-start-1 md:row-start-1' },
    { label: 'CRM', icon: Database, pos: 'md:col-start-3 md:row-start-1' },
    { label: 'Marketing', icon: Sparkles, pos: 'md:col-start-5 md:row-start-1' },
    { label: 'Support', icon: MessageSquare, pos: 'md:col-start-1 md:row-start-3' },
    { label: 'Analytics', icon: BarChart3, pos: 'md:col-start-3 md:row-start-3' },
    { label: 'Operations', icon: Settings, pos: 'md:col-start-5 md:row-start-3' },
  ];

  return (
    <FadeSection className="bg-[#F4F3EE] py-24 lg:py-32 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#2E6F5E] text-xs tracking-[0.2em] uppercase font-['Lora'] font-medium">Infographic 02</span>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl lg:text-5xl text-gray-900 mt-4">
            Inside an AI Operating System
          </h2>
        </div>

        {/* Node-based system map */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-12 relative">
          {/* Center core */}
          <div className="flex justify-center mb-12">
            <div className="w-28 h-28 rounded-full bg-[#0F3D3E] flex items-center justify-center shadow-lg shadow-[#0F3D3E]/20">
              <div className="text-center">
                <Bot className="w-8 h-8 text-[#84CC16] mx-auto mb-1" />
                <span className="text-white text-[10px] font-['Lora'] font-semibold">AI CORE</span>
              </div>
            </div>
          </div>

          {/* Surrounding clusters */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {clusters.map((c) => (
              <div key={c.label} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-xl bg-[#DCE5DD] border border-[#2E6F5E]/15 flex items-center justify-center mb-3 group-hover:bg-[#2E6F5E] group-hover:border-[#2E6F5E] transition-colors">
                  <c.icon className="w-7 h-7 text-[#1E3D36] group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                <span className="text-gray-900 text-sm font-['Lora'] font-medium">{c.label}</span>
                {/* Connection line */}
                <div className="w-px h-6 bg-[#2E6F5E]/20 -mt-[4.5rem] -mb-2 hidden md:block" />
              </div>
            ))}
          </div>

          <p className="text-gray-500 text-sm font-['Lora'] text-center mt-10 italic">
            Not one tool — a connected system of intelligent workflows.
          </p>
        </div>
      </div>
    </FadeSection>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S4 — INFOGRAPHIC 3: ROI & Metrics
   ═════════════════════════════════════════════════════════��═════ */
function Infographic3() {
  const barData = [
    { label: 'Q1', height: 30 },
    { label: 'Q2', height: 50 },
    { label: 'Q3', height: 72 },
    { label: 'Q4', height: 95 },
  ];

  const funnelSteps = [
    { label: 'Leads', width: '100%', count: '10,000' },
    { label: 'Qualified', width: '65%', count: '6,500' },
    { label: 'Closed', width: '30%', count: '3,000' },
  ];

  const kpis = [
    { value: 293, suffix: '%', label: 'ROI', icon: TrendingUp },
    { value: 80, suffix: '%', label: 'Automation', icon: Zap },
    { value: 3, suffix: 'x', label: 'Faster Response', icon: Clock },
  ];

  return (
    <FadeSection className="bg-[#0F3D3E] py-24 lg:py-32 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#84CC16] text-xs tracking-[0.2em] uppercase font-['Lora'] font-medium">Infographic 03</span>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl lg:text-5xl text-white mt-4">
            What AI Actually Changes
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Bar chart */}
          <div className="bg-white/[0.05] border border-white/10 rounded-xl p-8">
            <span className="text-white/40 text-xs font-['Lora'] uppercase tracking-wider">Revenue Growth</span>
            <div className="flex items-end justify-between gap-3 mt-6 h-40">
              {barData.map((bar) => (
                <div key={bar.label} className="flex flex-col items-center flex-1">
                  <motion.div
                    className="w-full bg-gradient-to-t from-[#84CC16] to-[#84CC16]/60 rounded-t"
                    initial={{ height: 0 }}
                    whileInView={{ height: `${bar.height}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                  <span className="text-white/50 text-xs font-['Lora'] mt-2">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Funnel */}
          <div className="bg-white/[0.05] border border-white/10 rounded-xl p-8">
            <span className="text-white/40 text-xs font-['Lora'] uppercase tracking-wider">Conversion Funnel</span>
            <div className="space-y-4 mt-6">
              {funnelSteps.map((step) => (
                <div key={step.label} className="flex flex-col items-center">
                  <div
                    className="h-12 bg-[#84CC16]/20 border border-[#84CC16]/30 rounded-lg flex items-center justify-center transition-all"
                    style={{ width: step.width }}
                  >
                    <span className="text-white text-sm font-['Lora'] font-medium">{step.count}</span>
                  </div>
                  <span className="text-white/40 text-xs font-['Lora'] mt-1">{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* KPI cards */}
          <div className="space-y-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-white/[0.05] border border-white/10 rounded-xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#84CC16]/10 border border-[#84CC16]/20 flex items-center justify-center shrink-0">
                  <kpi.icon className="w-5 h-5 text-[#84CC16]" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-white text-2xl font-semibold">
                    +<AnimatedCounter target={kpi.value} suffix={kpi.suffix} />
                  </div>
                  <div className="text-white/40 text-sm font-['Lora']">{kpi.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-sm font-['Lora'] text-center mt-10 italic">
          AI is not a feature — it's a performance multiplier.
        </p>
      </div>
    </FadeSection>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S5 — INFOGRAPHIC 4: 4-Step Process
   ═══════════════════════════════════════════════════════════════ */
function Infographic4() {
  const steps = [
    { num: '01', title: 'Analyze', desc: 'Audit current systems and opportunities', icon: Search, preview: 'Data Collection & Review' },
    { num: '02', title: 'Diagnose', desc: 'Identify automation gaps and AI fit', icon: Activity, preview: 'Gap Analysis Report' },
    { num: '03', title: 'Recommend', desc: 'Build a visual AI roadmap', icon: Palette, preview: 'Strategy Blueprint' },
    { num: '04', title: 'Deploy', desc: 'Launch and measure outcomes', icon: Package, preview: 'Live Dashboard' },
  ];

  return (
    <FadeSection className="bg-white py-24 lg:py-32 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#2E6F5E] text-xs tracking-[0.2em] uppercase font-['Lora'] font-medium">Infographic 04</span>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl lg:text-5xl text-gray-900 mt-4">
            From Idea to AI System
          </h2>
        </div>

        {/* Horizontal 4-step diagram */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-14 left-[12.5%] right-[12.5%] h-px bg-[#DCE5DD]" />

          <div className="grid md:grid-cols-4 gap-8 md:gap-0">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center px-4"
              >
                <div className="w-28 h-28 rounded-full bg-[#F4F3EE] border-2 border-[#DCE5DD] flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:border-[#84CC16] transition-colors">
                  <s.icon className="w-10 h-10 text-[#1E3D36]" strokeWidth={1.5} />
                </div>
                <div className="text-[#84CC16] text-xs font-['Lora'] font-semibold tracking-wider mb-2">{s.num}</div>
                <h3 className="font-['Playfair_Display'] text-xl text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm font-['Lora'] leading-relaxed mb-4">{s.desc}</p>
                {/* Small UI preview */}
                <div className="bg-[#F4F3EE] border border-[#DCE5DD] rounded-lg px-4 py-3 mx-auto max-w-[160px]">
                  <div className="w-full h-1 bg-[#84CC16]/30 rounded mb-2" />
                  <span className="text-gray-500 text-[10px] font-['Lora']">{s.preview}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-gray-400 text-sm font-['Lora'] text-center mt-12 italic">
          A structured path from confusion to clarity.
        </p>
      </div>
    </FadeSection>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S6 — INFOGRAPHIC 5: Industry Example — Real Estate
   ═══════════════════════════════════════════════════════════════ */
function Infographic5() {
  const flow = [
    { icon: Eye, label: 'Ad Impression', sub: 'Meta / Google' },
    { icon: Phone, label: 'WhatsApp', sub: 'Auto-reply' },
    { icon: Bot, label: 'Qualification', sub: 'AI Agent' },
    { icon: Calendar, label: 'Site Visit', sub: 'Scheduled' },
    { icon: Star, label: 'Deal Closed', sub: 'CRM Updated' },
  ];

  const automations = [
    { label: 'Response Automation', desc: 'AI replies within 30 seconds' },
    { label: 'CRM Auto-Update', desc: 'Lead status tracked in real-time' },
    { label: 'Smart Follow-ups', desc: 'Personalized sequences triggered' },
  ];

  return (
    <FadeSection className="bg-[#1E3D36] py-24 lg:py-32 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#84CC16] text-xs tracking-[0.2em] uppercase font-['Lora'] font-medium">Infographic 05</span>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl lg:text-5xl text-white mt-4">
            AI in Real Estate
          </h2>
        </div>

        {/* Flow diagram */}
        <div className="bg-white/[0.04] border border-white/8 rounded-xl p-8 md:p-12 mb-8">
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
            {flow.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center min-w-[80px]">
                  <div className="w-16 h-16 rounded-xl bg-[#84CC16]/10 border border-[#84CC16]/20 flex items-center justify-center mb-2">
                    <step.icon className="w-7 h-7 text-[#84CC16]" strokeWidth={1.5} />
                  </div>
                  <span className="text-white text-xs font-['Lora'] font-medium">{step.label}</span>
                  <span className="text-white/40 text-[10px] font-['Lora']">{step.sub}</span>
                </div>
                {i < flow.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-[#84CC16]/30 mx-3 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Automations row */}
        <div className="grid md:grid-cols-3 gap-4">
          {automations.map((a) => (
            <div key={a.label} className="bg-white/[0.04] border border-white/8 rounded-xl p-6 flex items-start gap-4">
              <Zap className="w-5 h-5 text-[#84CC16] shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <div className="text-white text-sm font-['Lora'] font-medium">{a.label}</div>
                <div className="text-white/40 text-xs font-['Lora'] mt-1">{a.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-white/40 text-sm font-['Lora'] text-center mt-10 italic">
          From first message to closed deal — automated.
        </p>
      </div>
    </FadeSection>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S7 — INFOGRAPHIC 6: Before vs After AI
   ═══════════════════════════════════════════════════════════════ */
function Infographic6() {
  const beforeItems = [
    { icon: X, label: 'Disconnected tools' },
    { icon: X, label: 'Scattered workflows' },
    { icon: X, label: 'Manual repetition' },
    { icon: X, label: 'Unclear outcomes' },
    { icon: X, label: 'Slow decision-making' },
  ];
  const afterItems = [
    { icon: Check, label: 'Unified AI system' },
    { icon: Check, label: 'Structured data flows' },
    { icon: Check, label: 'Full automation' },
    { icon: Check, label: 'Measurable KPIs' },
    { icon: Check, label: 'Real-time intelligence' },
  ];

  return (
    <FadeSection className="bg-[#F4F3EE] py-24 lg:py-32 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#2E6F5E] text-xs tracking-[0.2em] uppercase font-['Lora'] font-medium">Infographic 06</span>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl lg:text-5xl text-gray-900 mt-4">
            Before vs After AI
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-0 overflow-hidden rounded-xl border border-gray-200">
          {/* Before — dark/chaotic */}
          <div className="bg-[#1E3D36] p-10 md:p-14 relative">
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)',
            }} />
            <span className="text-red-400/80 text-xs tracking-[0.15em] uppercase font-['Lora'] font-medium relative z-10">Before</span>
            <div className="space-y-6 mt-8 relative z-10">
              {beforeItems.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded bg-red-400/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-red-400/70" strokeWidth={2} />
                  </div>
                  <span className="text-white/60 font-['Lora'] text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* After — clean/structured */}
          <div className="bg-white p-10 md:p-14">
            <span className="text-[#84CC16] text-xs tracking-[0.15em] uppercase font-['Lora'] font-medium">After</span>
            <div className="space-y-6 mt-8">
              {afterItems.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded bg-[#84CC16]/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-[#84CC16]" strokeWidth={2} />
                  </div>
                  <span className="text-gray-900 font-['Lora'] text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-gray-400 text-sm font-['Lora'] text-center mt-10 italic">
          Clarity is the real advantage.
        </p>
      </div>
    </FadeSection>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S8 — INFOGRAPHIC 7: Dashboard Intelligence
   ═══════════════════════════════════════════════════════════════ */
function Infographic7() {
  const kpiCards = [
    { label: 'Active Users', value: '12,847', change: '+18%', up: true },
    { label: 'Revenue', value: '$284K', change: '+32%', up: true },
    { label: 'Churn Rate', value: '2.1%', change: '-0.8%', up: false },
    { label: 'NPS Score', value: '72', change: '+5', up: true },
  ];

  const insights = [
    'Lead quality improved 40% after AI scoring deployment',
    'Automated follow-ups reduced response time from 4h to 30s',
    'Predictive churn model saved $42K in Q3 alone',
  ];

  return (
    <FadeSection className="bg-[#0F3D3E] py-24 lg:py-32 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#84CC16] text-xs tracking-[0.2em] uppercase font-['Lora'] font-medium">Infographic 07</span>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl lg:text-5xl text-white mt-4">
            AI Dashboard Intelligence
          </h2>
        </div>

        {/* Dashboard mockup */}
        <div className="bg-[#0a2a2b] border border-white/10 rounded-xl overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center gap-2 px-6 py-3 border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-red-400/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
            <div className="w-3 h-3 rounded-full bg-green-400/60" />
            <span className="text-white/30 text-xs font-['Lora'] ml-3">Sun AI — Performance Dashboard</span>
          </div>

          <div className="p-6 md:p-8">
            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {kpiCards.map((kpi) => (
                <div key={kpi.label} className="bg-white/[0.04] border border-white/8 rounded-lg p-5">
                  <div className="text-white/40 text-xs font-['Lora'] mb-2">{kpi.label}</div>
                  <div className="text-white text-2xl font-semibold">{kpi.value}</div>
                  <div className={`text-xs font-['Lora'] mt-1 ${kpi.up ? 'text-[#84CC16]' : 'text-red-400'}`}>
                    {kpi.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Charts area */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Main chart placeholder */}
              <div className="md:col-span-2 bg-white/[0.03] border border-white/5 rounded-lg p-6 h-48 flex flex-col justify-end">
                <div className="flex items-end gap-2 h-full">
                  {[30, 45, 35, 60, 50, 75, 65, 90, 80, 95, 88, 100].map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-[#84CC16]/40 rounded-t"
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                    />
                  ))}
                </div>
                <div className="text-white/30 text-[10px] font-['Lora'] mt-3">Monthly Performance Trend</div>
              </div>

              {/* AI Insights panel */}
              <div className="bg-white/[0.03] border border-white/5 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-[#84CC16]" />
                  <span className="text-white/60 text-xs font-['Lora'] uppercase tracking-wider">AI Insights</span>
                </div>
                <div className="space-y-4">
                  {insights.map((insight) => (
                    <div key={insight} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#84CC16] mt-2 shrink-0" />
                      <p className="text-white/50 text-xs font-['Lora'] leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-white/40 text-sm font-['Lora'] text-center mt-10 italic">
          Everything measurable. Everything visible.
        </p>
      </div>
    </FadeSection>
  );
}

/* ═══════════════════════════════════════════════════════════════
   S9 — FINAL CTA
   ═══════════════════════════════════════════════════════════════ */
function FinalCTA() {
  return (
    <section className="relative bg-[#1E3D36] py-[120px] px-6 md:px-16 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="max-w-[720px] mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-6">
            See Your Business Like This
          </h2>
          <p className="font-['Lora'] text-white/60 text-lg leading-relaxed mb-10 max-w-[560px] mx-auto">
            Run the AI diagnostic and get your own visual roadmap.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link to="/ai-readiness" className="inline-flex items-center gap-2 px-8 py-4 bg-[#84CC16] text-gray-900 font-['Lora'] font-semibold rounded-full hover:bg-[#73b512] hover:shadow-lg hover:shadow-[#84CC16]/30 transition-all">
              Run AI Diagnostic <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/booking" className="px-8 py-4 border border-white text-white font-['Lora'] rounded-full hover:bg-white hover:text-gray-900 transition-all">
              Book Strategy Call
            </Link>
          </div>
          <p className="text-white/30 text-sm font-['Lora'] tracking-wide">
            Clear visuals · Stronger presentations · Faster understanding
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function InfographicsPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Infographic1 />
      <Infographic2 />
      <Infographic3 />
      <Infographic4 />
      <Infographic5 />
      <Infographic6 />
      <Infographic7 />
      <FinalCTA />
    </div>
  );
}
