// Agent Catalog — Full agent definitions for catalog, detail, and runner screens
// 16 curated agents shown by default, expandable to 120+ in full catalog
// See /docs/agency/05-screen-design-spec.md

import type { LucideIcon } from 'lucide-react';
import {
  Rocket, Headset, GitBranch, ShieldCheck,
  TrendingUp, Palette, Search, BarChart3, PenTool,
  Cpu, Target, Compass, MonitorSmartphone, Database,
} from 'lucide-react';

/* ────────────────── TYPES ────────────────── */

export interface CatalogAgent {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  role: string;
  tagline: string;
  icon: LucideIcon;
  color: string;
  division: Division;
  description: string;
  capabilities: string[];
  mission: string[];
  rules: string[];
  successMetrics: string[];
  industries: string[];
  goals: string[];
  pairsWith: string[];
  useCases: AgentUseCase[];
  assignedTo: string[];
  isCurated: boolean;
}

export interface AgentUseCase {
  title: string;
  input: string;
  output: string;
}

export type Division =
  | 'Engineering'
  | 'Sales'
  | 'Marketing'
  | 'Design'
  | 'Product'
  | 'Project Management'
  | 'Testing'
  | 'Support'
  | 'Paid Media'
  | 'Specialized';

export const DIVISIONS: { id: Division; label: string; count: number }[] = [
  { id: 'Engineering', label: 'Engineering', count: 22 },
  { id: 'Sales', label: 'Sales', count: 8 },
  { id: 'Marketing', label: 'Marketing', count: 26 },
  { id: 'Design', label: 'Design', count: 8 },
  { id: 'Product', label: 'Product', count: 4 },
  { id: 'Project Management', label: 'PM', count: 6 },
  { id: 'Testing', label: 'Testing', count: 8 },
  { id: 'Paid Media', label: 'Paid Media', count: 7 },
  { id: 'Support', label: 'Support', count: 6 },
  { id: 'Specialized', label: 'Specialized', count: 22 },
];

/* ────────────────── DIVISION COLORS ────────────────── */

export const DIVISION_COLORS: Record<Division, string> = {
  Engineering: '#3B82F6',
  Sales: '#F59E0B',
  Marketing: '#8B5CF6',
  Design: '#EC4899',
  Product: '#06B6D4',
  'Project Management': '#6366F1',
  Testing: '#EF4444',
  'Paid Media': '#F97316',
  Support: '#10B981',
  Specialized: '#64748B',
};

/* ────────────────── CURATED CATALOG (16 agents) ────────────────── */

export const CATALOG_AGENTS: CatalogAgent[] = [
  {
    id: 'software-architect',
    slug: 'software-architect',
    name: 'Software Architect',
    emoji: '🏗️',
    role: 'Designs system architecture and technical strategy',
    tagline: 'Blueprints that scale from 10 users to 10 million.',
    icon: Cpu,
    color: '#3B82F6',
    division: 'Engineering',
    description: 'Plans technical architecture, designs API integrations, and ensures systems work together seamlessly. Expert in choosing the right stack for the right problem.',
    capabilities: [
      'System architecture design and documentation',
      'Technology stack evaluation and selection',
      'API design and integration strategy',
      'Database modeling and optimization',
      'Scalability and performance planning',
      'Security architecture review',
    ],
    mission: [
      'Design scalable, maintainable architectures',
      'Select optimal technology stacks',
      'Create integration strategies that minimize coupling',
    ],
    rules: [
      'Start with the simplest architecture that could work',
      'Document every integration point',
      'Plan for 10x scale from day one',
      'Security is not optional',
    ],
    successMetrics: [
      'System uptime > 99.9%',
      'New feature integration time < 2 days',
      'Zero data loss incidents',
    ],
    industries: ['SaaS', 'Fintech', 'Healthcare', 'Enterprise'],
    goals: ['Scale infrastructure', 'Modernize stack', 'Build platform'],
    pairsWith: ['Backend Architect', 'DevOps Automator', 'Security Auditor'],
    useCases: [
      {
        title: 'Multi-tenant SaaS Platform',
        input: 'B2B SaaS needs tenant isolation, SSO, and usage-based billing.',
        output: 'PostgreSQL RLS + Supabase Auth + Stripe metering. Architecture diagram + migration plan.',
      },
      {
        title: 'Microservices Migration',
        input: 'Monolithic Node.js app with 200K LOC causing deploy bottlenecks.',
        output: 'Strangler fig pattern: extract auth, billing, notifications as services. 6-month phased plan.',
      },
    ],
    assignedTo: ['Acme Corp', 'TechFlow Inc', 'DataVault'],
    isCurated: true,
  },
  {
    id: 'rapid-prototyper',
    slug: 'rapid-prototyper',
    name: 'Rapid Prototyper',
    emoji: '🚀',
    role: 'Ultra-fast MVP development and proof-of-concept validation',
    tagline: 'Turns an idea into a working prototype before the meeting\'s over.',
    icon: Rocket,
    color: '#3B82F6',
    division: 'Engineering',
    description: 'Specialist in ultra-fast proof-of-concept development and MVP creation. Excels at quickly validating ideas, building functional prototypes, and creating minimal viable products using the most efficient tools.',
    capabilities: [
      'Rapid MVP scoping and development',
      'Technology selection for speed-to-market',
      'Proof-of-concept validation',
      'Low-code/no-code tool integration',
      'User feedback loop design',
      'Iterative prototype refinement',
    ],
    mission: [
      'Build functional prototypes in under 3 days',
      'Validate ideas through working software',
      'Optimize for learning and iteration',
    ],
    rules: [
      'Choose tools that minimize setup time',
      'Use pre-built components whenever possible',
      'Core functionality first, polish later',
      'Always include a feedback mechanism',
    ],
    successMetrics: [
      'Prototypes delivered in under 3 days',
      'User feedback collected within 1 week',
      '80% of core features validated',
    ],
    industries: ['E-commerce', 'SaaS', 'Healthcare', 'Restaurant'],
    goals: ['Launch MVP', 'Validate idea', 'Build prototype'],
    pairsWith: ['Frontend Developer', 'Sprint Prioritizer', 'Reality Checker'],
    useCases: [
      {
        title: 'WhatsApp Booking Bot MVP',
        input: 'Dental clinic needs online booking via WhatsApp. Budget: $5K. Timeline: 2 weeks.',
        output: 'Week 1: WhatsApp Business API setup, booking flow, calendar sync. Week 2: Confirmations, reminders, testing.',
      },
      {
        title: 'E-commerce Landing Page',
        input: 'Fashion brand launching new collection. Need shoppable page in 48 hours.',
        output: 'Shopify theme + 12 product cards + Instagram embed + checkout flow. Live in 36 hours.',
      },
    ],
    assignedTo: ["Dr. Patel's Clinic", 'FreshBox Meals'],
    isCurated: true,
  },
  {
    id: 'frontend-developer',
    slug: 'frontend-developer',
    name: 'Frontend Developer',
    emoji: '🖥️',
    role: 'Responsive, accessible web apps with pixel-perfect UI',
    tagline: 'Every pixel has a purpose.',
    icon: MonitorSmartphone,
    color: '#3B82F6',
    division: 'Engineering',
    description: 'Builds responsive, accessible web applications with React, Tailwind, and modern frameworks. Focuses on performance and user experience.',
    capabilities: [
      'React/Next.js application development',
      'Responsive design implementation',
      'WCAG 2.1 accessibility compliance',
      'Performance optimization and monitoring',
      'Design system implementation',
      'Cross-browser compatibility testing',
    ],
    mission: [
      'Lighthouse score > 95 on every deploy',
      'Zero accessibility violations',
      'Sub-3-second load time on mobile',
    ],
    rules: [
      'Mobile-first, always',
      'Semantic HTML before ARIA hacks',
      'Performance budgets are not negotiable',
    ],
    successMetrics: [
      'Lighthouse Performance > 95',
      'Zero WCAG 2.1 AA violations',
      'First Contentful Paint < 1.5s',
    ],
    industries: ['SaaS', 'E-commerce', 'Media', 'Enterprise'],
    goals: ['Build UI', 'Redesign', 'Performance optimization'],
    pairsWith: ['Software Architect', 'Brand Guardian', 'Rapid Prototyper'],
    useCases: [
      {
        title: 'Dashboard Redesign',
        input: 'SaaS dashboard with 4.2s load time, failing accessibility audit.',
        output: 'Redesigned: 1.8s load time, 98 Lighthouse score, WCAG AA compliant. 15% engagement increase.',
      },
    ],
    assignedTo: ['CloudSync', 'Acme Corp', 'StyleHub', 'MedConnect', 'FreshBox Meals'],
    isCurated: true,
  },
  {
    id: 'backend-architect',
    slug: 'backend-architect',
    name: 'Backend Architect',
    emoji: '🗄️',
    role: 'API design, data modeling, system scalability',
    tagline: 'The engine room that never sleeps.',
    icon: Database,
    color: '#3B82F6',
    division: 'Engineering',
    description: 'Designs robust backend systems, APIs, and data models. Specializes in building scalable, secure server-side infrastructure.',
    capabilities: [
      'RESTful and GraphQL API design',
      'Database schema design and migration',
      'Authentication and authorization systems',
      'Caching strategies and CDN optimization',
      'Background job processing',
      'Real-time data streaming',
    ],
    mission: [
      'API response times < 200ms at p95',
      'Zero unplanned downtime',
      'Data integrity guaranteed across all operations',
    ],
    rules: [
      'API contracts are immutable once published',
      'Every mutation must be idempotent',
      'Log everything, alert on anomalies',
    ],
    successMetrics: [
      'API latency p95 < 200ms',
      'Zero data corruption incidents',
      'System handles 10x traffic spikes gracefully',
    ],
    industries: ['SaaS', 'Fintech', 'E-commerce', 'Healthcare'],
    goals: ['Build API', 'Scale backend', 'Data architecture'],
    pairsWith: ['Software Architect', 'Frontend Developer', 'DevOps Automator'],
    useCases: [
      {
        title: 'Payment Processing API',
        input: 'Marketplace needs multi-vendor payment splits, refunds, and payouts.',
        output: 'Stripe Connect integration with escrow flow. API: 12 endpoints, webhook handlers, idempotency keys.',
      },
    ],
    assignedTo: ['Acme Corp', 'PayFlow'],
    isCurated: true,
  },
  {
    id: 'ai-engineer',
    slug: 'ai-engineer',
    name: 'AI Engineer',
    emoji: '🤖',
    role: 'ML model development and production AI integration',
    tagline: 'Making machines think, responsibly.',
    icon: Cpu,
    color: '#3B82F6',
    division: 'Engineering',
    description: 'Develops ML models, fine-tunes LLMs, and integrates AI capabilities into production systems with proper guardrails.',
    capabilities: [
      'LLM integration and prompt engineering',
      'Custom model fine-tuning',
      'RAG pipeline development',
      'AI safety and guardrails implementation',
      'Model evaluation and A/B testing',
      'Cost optimization for AI inference',
    ],
    mission: [
      'Ship AI features with human-level quality',
      'Keep inference costs under $0.01 per request',
      'Zero hallucination-related incidents in production',
    ],
    rules: [
      'Every AI output gets a confidence score',
      'Human review for high-stakes decisions',
      'Cache aggressively, call APIs sparingly',
    ],
    successMetrics: [
      'AI accuracy > 95% on core tasks',
      'Average inference cost < $0.005',
      'User trust score > 4.5/5',
    ],
    industries: ['SaaS', 'Healthcare', 'Legal', 'Finance'],
    goals: ['Add AI features', 'Reduce costs', 'Improve accuracy'],
    pairsWith: ['Software Architect', 'Backend Architect', 'Reality Checker'],
    useCases: [
      {
        title: 'Customer Support AI',
        input: 'SaaS company wants to automate 60% of support tickets using AI.',
        output: 'RAG pipeline with 500 help articles. Gemini-powered classifier + response generator. 72% automation rate achieved.',
      },
    ],
    assignedTo: ['TechFlow Inc', 'MedConnect'],
    isCurated: true,
  },
  {
    id: 'devops-automator',
    slug: 'devops-automator',
    name: 'DevOps Automator',
    emoji: '⚙️',
    role: 'CI/CD pipelines and infrastructure automation',
    tagline: 'Deploy on Friday. Sleep on Saturday.',
    icon: GitBranch,
    color: '#3B82F6',
    division: 'Engineering',
    description: 'Automates deployment pipelines, manages infrastructure as code, and ensures reliable, repeatable deployments.',
    capabilities: [
      'CI/CD pipeline design and optimization',
      'Infrastructure as Code (Terraform/Pulumi)',
      'Container orchestration (Docker/K8s)',
      'Monitoring and alerting setup',
      'Automated testing integration',
      'Zero-downtime deployment strategies',
    ],
    mission: [
      'Deploy to production in under 10 minutes',
      'Zero manual deployment steps',
      'Rollback capability in under 60 seconds',
    ],
    rules: [
      'Everything is code, nothing is manual',
      'Green builds before any deploy',
      'Canary deploys for all production changes',
    ],
    successMetrics: [
      'Deployment frequency: daily or better',
      'Lead time: commit to production < 1 hour',
      'MTTR < 30 minutes',
    ],
    industries: ['SaaS', 'Enterprise', 'Fintech', 'E-commerce'],
    goals: ['Automate deployments', 'Improve reliability', 'Scale infrastructure'],
    pairsWith: ['Software Architect', 'Backend Architect', 'AI Engineer'],
    useCases: [
      {
        title: 'Supabase Edge Function Pipeline',
        input: 'Team deploying edge functions manually via CLI. No staging environment.',
        output: 'GitHub Actions pipeline: lint → test → deploy to staging → smoke test → promote to production. Branch previews included.',
      },
    ],
    assignedTo: ['Acme Corp'],
    isCurated: true,
  },
  {
    id: 'pipeline-analyst',
    slug: 'pipeline-analyst',
    name: 'Pipeline Analyst',
    emoji: '📊',
    role: 'Scores leads and prioritizes follow-ups',
    tagline: 'Knows which deals will close before you do.',
    icon: BarChart3,
    color: '#F59E0B',
    division: 'Sales',
    description: 'Analyzes deal pipeline health, scores leads by conversion probability, and surfaces at-risk opportunities.',
    capabilities: [
      'Lead scoring and qualification',
      'Pipeline velocity analysis',
      'Deal risk assessment',
      'Revenue forecasting',
      'Win/loss pattern analysis',
      'CRM data hygiene auditing',
    ],
    mission: [
      'Score every lead within 24 hours of creation',
      'Identify at-risk deals before they go cold',
      'Optimize pipeline velocity',
    ],
    rules: [
      'Score based on engagement + fit, not just company size',
      'Flag any deal with no activity in 7+ days',
      'Update scoring model monthly with close/loss data',
    ],
    successMetrics: [
      'Lead scoring accuracy > 75%',
      'Pipeline velocity improved by 20%',
      'At-risk deals flagged 2 weeks before loss',
    ],
    industries: ['SaaS', 'Real Estate', 'B2B Services', 'Consulting'],
    goals: ['Improve close rate', 'Prioritize pipeline', 'Reduce churn'],
    pairsWith: ['Outbound Strategist', 'Deal Strategist', 'CRM Automator'],
    useCases: [
      {
        title: 'Real Estate Lead Scoring',
        input: '42 leads in pipeline, 3% close rate. Industry average: 8%.',
        output: 'Scoring model: engagement recency (30%), budget confirmed (25%), timeline (20%), champion (25%). Top 8 deals prioritized.',
      },
    ],
    assignedTo: ['Realty Plus'],
    isCurated: true,
  },
  {
    id: 'outbound-strategist',
    slug: 'outbound-strategist',
    name: 'Outbound Strategist',
    emoji: '🎯',
    role: 'Designs automated outreach sequences',
    tagline: 'Cold outreach that feels warm.',
    icon: Target,
    color: '#F59E0B',
    division: 'Sales',
    description: 'Creates multi-channel outreach sequences, A/B tests messaging, and optimizes reply rates.',
    capabilities: [
      'Multi-channel sequence design (email, LinkedIn, phone)',
      'Personalization at scale',
      'A/B testing frameworks for messaging',
      'Reply rate optimization',
      'Ideal Customer Profile refinement',
      'Follow-up cadence design',
    ],
    mission: [
      'Design sequences with > 30% open rate',
      'Personalize at scale without losing authenticity',
      'Optimize for replies, not just opens',
    ],
    rules: [
      'Never send generic templates',
      'Follow up exactly 3 times, then pause',
      'Every touchpoint adds value, never just "checking in"',
    ],
    successMetrics: [
      'Email open rate > 30%',
      'Reply rate > 5%',
      'Meeting booking rate > 2%',
    ],
    industries: ['SaaS', 'B2B Services', 'Real Estate', 'Consulting'],
    goals: ['Lead generation', 'Outbound sales', 'Partnership outreach'],
    pairsWith: ['Pipeline Analyst', 'Deal Strategist', 'Content Creator'],
    useCases: [
      {
        title: 'Real Estate Lead Nurture',
        input: 'Brokerage has 200 cold leads from open houses. No follow-up system.',
        output: '5-email sequence over 14 days. Personalized with property interest + neighborhood data. Expected: 8% reply rate.',
      },
    ],
    assignedTo: ['Realty Plus', 'GrowthCo'],
    isCurated: true,
  },
  {
    id: 'growth-hacker',
    slug: 'growth-hacker',
    name: 'Growth Hacker',
    emoji: '📈',
    role: 'Designs acquisition and conversion funnels',
    tagline: 'Finds the growth lever hiding in plain sight.',
    icon: TrendingUp,
    color: '#8B5CF6',
    division: 'Marketing',
    description: 'Identifies growth levers, designs conversion funnels, and optimizes customer acquisition channels. Data-driven approach to scaling.',
    capabilities: [
      'Conversion funnel design and optimization',
      'Growth experiment framework',
      'Viral loop and referral program design',
      'Channel saturation analysis',
      'CAC/LTV modeling',
      'Retention strategy development',
    ],
    mission: [
      'Identify highest-ROI growth opportunities',
      'Design conversion-optimized funnels',
      'Build referral and viral loops',
    ],
    rules: [
      'Test before you scale',
      'Measure everything, optimize the top lever',
      'Speed of iteration beats perfection',
      'Focus on one channel until it saturates',
    ],
    successMetrics: [
      'Customer acquisition cost reduced by 30%',
      'Conversion rate improved by 25%+',
      'At least one viral loop identified per client',
    ],
    industries: ['E-commerce', 'SaaS', 'D2C', 'Mobile Apps'],
    goals: ['Increase revenue', 'Scale acquisition', 'Improve conversion'],
    pairsWith: ['SEO Specialist', 'Content Creator', 'Pipeline Analyst'],
    useCases: [
      {
        title: 'Instagram-to-Purchase Funnel',
        input: 'Fashion brand has 2K followers but zero conversion path.',
        output: 'Link-in-bio strategy + shoppable grid + retargeting funnel. Expected: 3% CTR, 15% conversion.',
      },
    ],
    assignedTo: ['StyleHub', 'FreshBox Meals', 'TravelNow', 'PetBox', 'FitLife'],
    isCurated: true,
  },
  {
    id: 'content-creator',
    slug: 'content-creator',
    name: 'Content Creator',
    emoji: '✍️',
    role: 'Plans and generates brand content at scale',
    tagline: 'A month of content in an afternoon.',
    icon: PenTool,
    color: '#8B5CF6',
    division: 'Marketing',
    description: 'Creates content calendars, writes AI-assisted copy, and manages multi-channel publishing.',
    capabilities: [
      'Content calendar planning and management',
      'AI-assisted copywriting and editing',
      'Multi-channel content adaptation',
      'Content repurposing strategies',
      'Brand voice consistency enforcement',
      'Performance-driven content optimization',
    ],
    mission: [
      'Maintain consistent publishing cadence',
      'Create content that drives measurable engagement',
      'Repurpose one piece of content across 5 channels',
    ],
    rules: [
      'Brand voice first, virality second',
      'Every piece needs a clear CTA',
      'Repurpose before creating new',
    ],
    successMetrics: [
      'Publishing consistency > 90%',
      'Engagement rate > industry benchmark',
      'Content-to-lead conversion > 2%',
    ],
    industries: ['E-commerce', 'SaaS', 'Tourism', 'Fashion'],
    goals: ['Build audience', 'Drive engagement', 'Content strategy'],
    pairsWith: ['SEO Specialist', 'Brand Guardian', 'Growth Hacker'],
    useCases: [
      {
        title: 'Monthly Content Calendar',
        input: 'Boutique fashion brand. Instagram + blog. Target: daily posts.',
        output: '30 posts planned: 10 product, 8 UGC, 6 behind-scenes, 4 educational, 2 promotion. Captions + hashtags included.',
      },
    ],
    assignedTo: ['StyleHub', 'TravelNow', 'FreshBox Meals', "Dr. Patel's Clinic"],
    isCurated: true,
  },
  {
    id: 'seo-specialist',
    slug: 'seo-specialist',
    name: 'SEO Specialist',
    emoji: '🔍',
    role: 'Targets keywords your competitors miss',
    tagline: 'Page one isn\'t luck — it\'s strategy.',
    icon: Search,
    color: '#8B5CF6',
    division: 'Marketing',
    description: 'Finds long-tail keyword opportunities, optimizes content strategy, and tracks search visibility.',
    capabilities: [
      'Keyword research and gap analysis',
      'On-page SEO optimization',
      'Technical SEO auditing',
      'Backlink strategy development',
      'Content-SEO alignment',
      'Local SEO optimization',
    ],
    mission: [
      'Identify 50+ long-tail keywords per client',
      'Achieve page-one ranking for 3+ primary keywords in 90 days',
      'Technical SEO audit within first week',
    ],
    rules: [
      'Content quality > keyword stuffing',
      'Target keywords with high intent, not just volume',
      'Fix technical issues before creating content',
    ],
    successMetrics: [
      'Organic traffic increase > 40% in 6 months',
      '3+ page-one rankings in 90 days',
      'Technical SEO score > 90',
    ],
    industries: ['E-commerce', 'SaaS', 'Local Business', 'Content'],
    goals: ['Increase organic traffic', 'Improve rankings', 'Content SEO'],
    pairsWith: ['Content Creator', 'Growth Hacker', 'Frontend Developer'],
    useCases: [
      {
        title: 'E-commerce Keyword Gap Analysis',
        input: 'Jewelry brand ranking for 0 keywords. Competitors rank for 200+.',
        output: 'Target: "custom birthstone necklace" (8K searches, low competition). 15 long-tail keywords mapped to product pages.',
      },
    ],
    assignedTo: ['StyleHub', 'GemCraft', 'FreshBox Meals'],
    isCurated: true,
  },
  {
    id: 'brand-guardian',
    slug: 'brand-guardian',
    name: 'Brand Guardian',
    emoji: '🎨',
    role: 'Ensures visual and tonal consistency',
    tagline: 'Your brand, everywhere, perfectly.',
    icon: Palette,
    color: '#EC4899',
    division: 'Design',
    description: 'Maintains brand consistency across all AI-generated content and customer touchpoints.',
    capabilities: [
      'Brand audit and consistency scoring',
      'AI-safe brand guideline creation',
      'Cross-channel brand monitoring',
      'Tone of voice documentation',
      'Visual identity enforcement',
      'Brand asset management',
    ],
    mission: [
      'Audit all brand touchpoints quarterly',
      'Create AI-safe brand guidelines',
      'Catch inconsistencies before they reach customers',
    ],
    rules: [
      'Every output must pass brand voice check',
      'Color palette violations are critical bugs',
      'Tone adapts to channel but core message stays consistent',
    ],
    successMetrics: [
      'Brand consistency score > 95%',
      'Zero off-brand content published',
      'Brand recall improved by 20%',
    ],
    industries: ['Fashion', 'E-commerce', 'Luxury', 'D2C'],
    goals: ['Brand consistency', 'Visual identity', 'Multi-channel presence'],
    pairsWith: ['Content Creator', 'Frontend Developer', 'Growth Hacker'],
    useCases: [
      {
        title: 'Brand Audit Report',
        input: 'E-commerce brand with 4 different product photo backgrounds.',
        output: 'Audit: 12 inconsistencies found. Priority fix: standardize backgrounds (23% perceived value increase).',
      },
    ],
    assignedTo: ['StyleHub', 'LuxBrand'],
    isCurated: true,
  },
  {
    id: 'project-shepherd',
    slug: 'project-shepherd',
    name: 'Project Shepherd',
    emoji: '📋',
    role: 'Manages implementation roadmaps',
    tagline: 'No project falls through the cracks.',
    icon: GitBranch,
    color: '#6366F1',
    division: 'Project Management',
    description: 'Keeps projects on track with sprint planning, milestone tracking, and stakeholder communication.',
    capabilities: [
      'Sprint planning and backlog grooming',
      'Milestone tracking and reporting',
      'Risk identification and mitigation',
      'Stakeholder communication management',
      'Resource allocation optimization',
      'Retrospective facilitation',
    ],
    mission: [
      'Every project has a clear roadmap within 24 hours',
      'Weekly progress reports to all stakeholders',
      'Bottlenecks identified and resolved within 48 hours',
    ],
    rules: [
      'Never let a milestone pass without review',
      'Communicate blockers immediately, not at standup',
      'Under-promise, over-deliver on timelines',
    ],
    successMetrics: [
      '90% of milestones hit on time',
      'Stakeholder satisfaction > 4.5/5',
      'Scope creep < 10%',
    ],
    industries: ['All industries'],
    goals: ['Project delivery', 'Sprint planning', 'Stakeholder alignment'],
    pairsWith: ['Reality Checker', 'Sprint Prioritizer', 'Software Architect'],
    useCases: [
      {
        title: 'Sprint Plan Generation',
        input: 'Booking bot project. 3 developers. 2-week sprint.',
        output: 'Sprint 1: 14 tasks, 3 milestones. Day 1-3: API setup. Day 4-7: Core flow. Day 8-10: Testing. Day 11-14: Deploy + iterate.',
      },
    ],
    assignedTo: ['Acme Corp', "Dr. Patel's Clinic", 'FreshBox Meals', 'StyleHub', 'CloudSync', 'TechFlow Inc', 'MedConnect', 'GemCraft'],
    isCurated: true,
  },
  {
    id: 'reality-checker',
    slug: 'reality-checker',
    name: 'Reality Checker',
    emoji: '🛡️',
    role: 'Validates recommendations before delivery',
    tagline: 'The voice of reason your project needs.',
    icon: ShieldCheck,
    color: '#EF4444',
    division: 'Testing',
    description: 'Reviews all AI-generated recommendations for feasibility, catches edge cases, and ensures realistic timelines.',
    capabilities: [
      'Deliverable feasibility review',
      'Timeline and cost estimate validation',
      'Edge case identification',
      'Technical risk assessment',
      'Client expectation alignment',
      'Quality gate enforcement',
    ],
    mission: [
      'Review every deliverable before client delivery',
      'Catch unrealistic timelines or cost estimates',
      'Ensure technical feasibility of all recommendations',
    ],
    rules: [
      'If it sounds too good to be true, it probably is',
      'Always check assumptions against real data',
      'Better to flag a false positive than miss a real issue',
    ],
    successMetrics: [
      'Zero unrealistic deliverables shipped',
      'Client expectation alignment > 90%',
      'Estimation accuracy within 20%',
    ],
    industries: ['All industries'],
    goals: ['Quality assurance', 'Risk mitigation', 'Feasibility validation'],
    pairsWith: ['Software Architect', 'Project Shepherd', 'Finance Tracker'],
    useCases: [
      {
        title: 'Proposal Feasibility Review',
        input: 'Proposal promises 70% cost reduction in 2 weeks for a complex ERP integration.',
        output: 'Flag: Timeline unrealistic. Revised estimate: 6-8 weeks. Cost reduction: 40-50% is achievable.',
      },
    ],
    assignedTo: ['Acme Corp', "Dr. Patel's Clinic", 'FreshBox Meals', 'TechFlow Inc', 'CloudSync', 'StyleHub', 'GemCraft'],
    isCurated: true,
  },
  {
    id: 'support-responder',
    slug: 'support-responder',
    name: 'Support Responder',
    emoji: '🎧',
    role: 'Designs customer communication flows',
    tagline: 'Makes your customers feel heard at scale.',
    icon: Headset,
    color: '#10B981',
    division: 'Support',
    description: 'Maps customer journeys, designs FAQ flows, and creates response templates that handle 80% of inquiries automatically.',
    capabilities: [
      'Customer journey mapping',
      'FAQ and knowledge base design',
      'Response template creation',
      'Escalation flow design',
      'Multi-channel support strategy',
      'Customer satisfaction measurement',
    ],
    mission: [
      'Reduce response time to under 60 seconds',
      'Automate 80% of routine inquiries',
      'Maintain human-like empathy in automated responses',
    ],
    rules: [
      'Always offer escalation to a human',
      'Tone matches brand voice',
      'Never say "I don\'t know" — always redirect',
    ],
    successMetrics: [
      'Average response time < 60 seconds',
      '80% inquiry automation rate',
      'Customer satisfaction > 4.5/5',
    ],
    industries: ['Healthcare', 'E-commerce', 'SaaS', 'Hospitality'],
    goals: ['Reduce support costs', 'Improve response time', 'Scale support'],
    pairsWith: ['Rapid Prototyper', 'Brand Guardian', 'Content Creator'],
    useCases: [
      {
        title: 'Patient FAQ Automation',
        input: 'Dental clinic gets 40+ calls/day with repetitive questions.',
        output: 'WhatsApp FAQ bot covering top 15 questions. Expected: 70% deflection rate.',
      },
    ],
    assignedTo: ["Dr. Patel's Clinic", 'MedConnect', 'FreshBox Meals'],
    isCurated: true,
  },
  {
    id: 'discovery-coach',
    slug: 'discovery-coach',
    name: 'Discovery Coach',
    emoji: '🧭',
    role: 'Asks the right questions to uncover opportunities',
    tagline: 'The question you didn\'t know you needed to answer.',
    icon: Compass,
    color: '#64748B',
    division: 'Specialized',
    description: 'Guides the discovery process with industry-specific questioning that surfaces hidden opportunities and uncovers the real problem behind the stated problem.',
    capabilities: [
      'Stakeholder interview facilitation',
      'Problem reframing and root cause analysis',
      'Opportunity mapping and prioritization',
      'Industry-specific discovery templates',
      'Competitive landscape analysis',
      'Jobs-to-be-done framework application',
    ],
    mission: [
      'Uncover 3+ hidden opportunities per discovery session',
      'Reframe the problem statement in under 15 minutes',
      'Identify the highest-impact lever within the first session',
    ],
    rules: [
      'Ask why 5 times before proposing a solution',
      'Listen for what they don\'t say',
      'Challenge assumptions gently but persistently',
    ],
    successMetrics: [
      'Discovery-to-proposal time < 48 hours',
      'Client says "I hadn\'t thought of that" at least twice',
      'Problem reframing leads to 2x impact vs original ask',
    ],
    industries: ['All industries'],
    goals: ['Strategic planning', 'Problem definition', 'Opportunity mapping'],
    pairsWith: ['Proposal Strategist', 'Reality Checker', 'Pipeline Analyst'],
    useCases: [
      {
        title: 'Restaurant Chain Discovery',
        input: 'Chain wants "a better website." Revenue flat for 2 years.',
        output: 'Reframed: Problem isn\'t the website — it\'s zero online ordering (competitors do 35% online). Discovery: 3 hidden revenue levers identified.',
      },
    ],
    assignedTo: ['FreshBox Meals', "Dr. Patel's Clinic", 'Acme Corp', 'StyleHub'],
    isCurated: true,
  },
];

/* ────────────────── SEARCH & FILTER ────────────────── */

import { EXPANDED_AGENTS } from './agentCatalogExpanded';

/** Full catalog: 16 curated + 104 expanded = 120 agents */
export const ALL_CATALOG_AGENTS: CatalogAgent[] = [
  ...CATALOG_AGENTS,
  ...EXPANDED_AGENTS,
];

export function searchAgents(agents: CatalogAgent[], query: string): CatalogAgent[] {
  if (!query.trim()) return agents;
  const lower = query.toLowerCase();
  return agents.filter(a =>
    a.name.toLowerCase().includes(lower) ||
    a.role.toLowerCase().includes(lower) ||
    a.division.toLowerCase().includes(lower) ||
    a.description.toLowerCase().includes(lower) ||
    a.industries.some(i => i.toLowerCase().includes(lower))
  );
}

export function filterByDivision(agents: CatalogAgent[], division: Division | 'All'): CatalogAgent[] {
  if (division === 'All') return agents;
  return agents.filter(a => a.division === division);
}

export function getAgentBySlug(slug: string): CatalogAgent | undefined {
  return ALL_CATALOG_AGENTS.find(a => a.slug === slug);
}