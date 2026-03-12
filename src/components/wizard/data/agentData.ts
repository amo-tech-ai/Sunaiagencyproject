// Agent Data Model for Wizard Integration
// Defines specialist AI agents, matching logic, and fit score calculation
// See /docs/agency/02-wizard-wireframes.md for spec

import type { LucideIcon } from 'lucide-react';
import {
  Rocket, Headset, DollarSign, GitBranch, ShieldCheck,
  TrendingUp, Palette, Search, BarChart3, PenTool,
  Cpu, Target, Users, Compass, Lightbulb, Zap,
} from 'lucide-react';

/* ────────────────── TYPES ────────────────── */

export interface Agent {
  id: string;
  name: string;
  role: string;
  icon: LucideIcon;
  color: string; // accent color for avatar circle
  division: string;
  description: string;
  /** Template for generating task descriptions. Use {company} for company name */
  taskTemplates: Record<string, string>;
  /** Default task if no system-specific template matches */
  defaultTask: string;
}

export interface AssignedAgent extends Agent {
  task: string;
  isPrimary: boolean; // primary = card display, support = list display
}

export interface FitScoreResult {
  systemId: string;
  score: number;
  reasoning: string;
}

/* ────────────────── AGENT DEFINITIONS ────────────────── */

export const AGENTS: Agent[] = [
  {
    id: 'rapid-prototyper',
    name: 'Rapid Prototyper',
    role: 'Builds MVPs and proof-of-concepts fast',
    icon: Rocket,
    color: '#6366F1',
    division: 'Engineering',
    description: 'Specializes in turning specs into working prototypes within 2 weeks. Focuses on core functionality and fast iteration.',
    taskTemplates: {
      'booking-engine': 'Build your booking bot MVP in 2 weeks',
      'support-engine': 'Prototype your AI support chatbot',
      'onboarding-system': 'Build your onboarding flow prototype',
      'cart-recovery': 'Set up your cart recovery automation',
    },
    defaultTask: 'Build your first working prototype',
  },
  {
    id: 'support-responder',
    name: 'Support Responder',
    role: 'Designs customer communication flows',
    icon: Headset,
    color: '#10B981',
    division: 'Customer Experience',
    description: 'Maps customer journeys, designs FAQ flows, and creates response templates that handle 80% of inquiries automatically.',
    taskTemplates: {
      'support-engine': 'Design your customer communication flows and FAQ library',
      'booking-engine': 'Map your patient FAQ and booking confirmation flows',
      'onboarding-system': 'Design your welcome sequence and help flows',
    },
    defaultTask: 'Design your automated response flows',
  },
  {
    id: 'finance-tracker',
    name: 'Finance Tracker',
    role: 'Projects cost savings and ROI',
    icon: DollarSign,
    color: '#F59E0B',
    division: 'Finance',
    description: 'Calculates implementation ROI, projects cost savings, and tracks financial impact across all systems.',
    taskTemplates: {
      'support-engine': 'Project your support cost savings and ROI timeline',
      'growth-engine': 'Model your revenue growth projections',
      'operations-autopilot': 'Calculate your operational cost reduction',
      'cart-recovery': 'Estimate your recovered revenue potential',
    },
    defaultTask: 'Baseline cost report and ROI projections',
  },
  {
    id: 'project-shepherd',
    name: 'Project Shepherd',
    role: 'Manages your implementation roadmap',
    icon: GitBranch,
    color: '#8B5CF6',
    division: 'Project Management',
    description: 'Keeps your project on track with sprint planning, milestone tracking, and stakeholder communication.',
    taskTemplates: {},
    defaultTask: 'Set up sprint plan and milestones',
  },
  {
    id: 'reality-checker',
    name: 'Reality Checker',
    role: 'Validates recommendations before delivery',
    icon: ShieldCheck,
    color: '#EF4444',
    division: 'Quality Assurance',
    description: 'Reviews all AI-generated recommendations for feasibility, catches edge cases, and ensures realistic timelines.',
    taskTemplates: {},
    defaultTask: 'Review system specs and validate feasibility',
  },
  {
    id: 'growth-hacker',
    name: 'Growth Hacker',
    role: 'Designs acquisition and conversion funnels',
    icon: TrendingUp,
    color: '#06B6D4',
    division: 'Growth',
    description: 'Identifies growth levers, designs conversion funnels, and optimizes customer acquisition channels.',
    taskTemplates: {
      'growth-engine': 'Design your primary conversion funnel',
      'cart-recovery': 'Build your cart abandonment recovery sequence',
      'content-engine': 'Plan your content-to-conversion pipeline',
      'recommendation-engine': 'Design your personalized recommendation strategy',
    },
    defaultTask: 'Identify your top 3 growth opportunities',
  },
  {
    id: 'brand-guardian',
    name: 'Brand Guardian',
    role: 'Ensures visual and tonal consistency',
    icon: Palette,
    color: '#EC4899',
    division: 'Brand',
    description: 'Maintains brand consistency across all AI-generated content and customer touchpoints.',
    taskTemplates: {
      'content-engine': 'Audit your brand voice and create AI style guidelines',
    },
    defaultTask: 'Review brand consistency across channels',
  },
  {
    id: 'seo-specialist',
    name: 'SEO Specialist',
    role: 'Targets keywords your competitors miss',
    icon: Search,
    color: '#14B8A6',
    division: 'Growth',
    description: 'Finds long-tail keyword opportunities, optimizes content strategy, and tracks search visibility.',
    taskTemplates: {
      'content-engine': 'Identify long-tail keywords your competitors miss',
      'growth-engine': 'Audit your search visibility and organic traffic gaps',
    },
    defaultTask: 'Run keyword gap analysis vs competitors',
  },
  {
    id: 'pipeline-analyst',
    name: 'Pipeline Analyst',
    role: 'Scores leads and prioritizes follow-ups',
    icon: BarChart3,
    color: '#3B82F6',
    division: 'Sales',
    description: 'Analyzes deal pipeline health, scores leads by conversion probability, and surfaces at-risk opportunities.',
    taskTemplates: {
      'growth-engine': 'Score your existing leads and prioritize follow-ups',
      'sales-automation': 'Analyze your pipeline health and conversion rates',
    },
    defaultTask: 'Build lead scoring model for your pipeline',
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    role: 'Plans and generates brand content',
    icon: PenTool,
    color: '#A855F7',
    division: 'Content',
    description: 'Creates content calendars, writes AI-assisted copy, and manages multi-channel publishing.',
    taskTemplates: {
      'content-engine': 'Plan your first month content calendar',
    },
    defaultTask: 'Draft your content strategy roadmap',
  },
  {
    id: 'software-architect',
    name: 'Software Architect',
    role: 'Designs system integrations and data flows',
    icon: Cpu,
    color: '#64748B',
    division: 'Engineering',
    description: 'Plans technical architecture, designs API integrations, and ensures systems work together seamlessly.',
    taskTemplates: {
      'operations-autopilot': 'Map your existing systems and design integration architecture',
      'data-intelligence': 'Design your data pipeline and dashboard architecture',
    },
    defaultTask: 'Design your system integration architecture',
  },
  {
    id: 'outbound-strategist',
    name: 'Outbound Strategist',
    role: 'Designs automated outreach sequences',
    icon: Target,
    color: '#F97316',
    division: 'Sales',
    description: 'Creates multi-channel outreach sequences, A/B tests messaging, and optimizes reply rates.',
    taskTemplates: {
      'sales-automation': 'Design your automated lead nurture sequences',
      'growth-engine': 'Build your outreach cadence for top-of-funnel leads',
    },
    defaultTask: 'Design your automated outreach sequence',
  },
  {
    id: 'deal-strategist',
    name: 'Deal Strategist',
    role: 'Optimizes your close rate',
    icon: Zap,
    color: '#DC2626',
    division: 'Sales',
    description: 'Analyzes deal flow, identifies bottlenecks in the sales process, and recommends closing strategies.',
    taskTemplates: {
      'sales-automation': 'Optimize your listing-to-close conversion',
    },
    defaultTask: 'Analyze your deal conversion bottlenecks',
  },
  {
    id: 'analytics-reporter',
    name: 'Analytics Reporter',
    role: 'Turns data into actionable insights',
    icon: BarChart3,
    color: '#0EA5E9',
    division: 'Analytics',
    description: 'Builds dashboards, creates automated reports, and surfaces data-driven insights for decision making.',
    taskTemplates: {
      'data-intelligence': 'Design your analytics dashboard and KPI tracking',
      'loyalty-system': 'Build your customer health scoring dashboard',
    },
    defaultTask: 'Set up your KPI tracking dashboard',
  },
  {
    id: 'discovery-coach',
    name: 'Discovery Coach',
    role: 'Asks the right questions to uncover opportunities',
    icon: Compass,
    color: '#6366F1',
    division: 'Strategy',
    description: 'Guides the discovery process with industry-specific questioning that surfaces hidden opportunities.',
    taskTemplates: {},
    defaultTask: 'Deep-dive analysis of your business context',
  },
  {
    id: 'proposal-strategist',
    name: 'Proposal Strategist',
    role: 'Crafts compelling strategy proposals',
    icon: Lightbulb,
    color: '#D97706',
    division: 'Strategy',
    description: 'Transforms analysis data into clear, actionable strategy proposals with business impact framing.',
    taskTemplates: {},
    defaultTask: 'Refine your strategy proposal narrative',
  },
];

/* ────────────────── SYSTEM → AGENT MAPPING ────────────────── */

/** Maps each AI system to its primary specialist agent(s) */
const SYSTEM_AGENT_MAP: Record<string, string[]> = {
  'support-engine':        ['support-responder', 'rapid-prototyper'],
  'growth-engine':         ['growth-hacker', 'pipeline-analyst'],
  'operations-autopilot':  ['software-architect'],
  'data-intelligence':     ['analytics-reporter', 'software-architect'],
  'content-engine':        ['content-creator', 'seo-specialist'],
  'onboarding-system':     ['rapid-prototyper', 'support-responder'],
  'cart-recovery':         ['growth-hacker'],
  'recommendation-engine': ['growth-hacker'],
  'sales-automation':      ['outbound-strategist', 'deal-strategist', 'pipeline-analyst'],
  'loyalty-system':        ['analytics-reporter'],
  'booking-engine':        ['rapid-prototyper', 'support-responder'],
  'compliance-automation': ['reality-checker', 'software-architect'],
};

/** Industry-specific agent overrides (add extra agents for certain industries) */
const INDUSTRY_AGENT_EXTRAS: Record<string, string[]> = {
  'e-commerce': ['brand-guardian'],
  'fashion':    ['brand-guardian', 'seo-specialist'],
  'real-estate': ['outbound-strategist', 'deal-strategist'],
  'saas':       ['analytics-reporter'],
};

/* ────────────────── SUPPORT AGENTS (always included) ────────────────── */

const SUPPORT_AGENT_IDS = ['project-shepherd', 'reality-checker'];

/* ────────────────── MATCHING ALGORITHM ────────────────── */

/**
 * Match agents to a project based on selected systems and industry.
 * Returns primary agents (from system selections) + support agents (always included).
 * Each agent gets a personalized task description.
 */
export function matchAgents(
  selectedSystemIds: string[],
  industry: string,
  companyName: string,
): AssignedAgent[] {
  const seenIds = new Set<string>();
  const primaryAgents: AssignedAgent[] = [];

  // 1. Collect primary agents from selected systems
  for (const systemId of selectedSystemIds) {
    const agentIds = SYSTEM_AGENT_MAP[systemId] || [];
    for (const agentId of agentIds) {
      if (seenIds.has(agentId) || SUPPORT_AGENT_IDS.includes(agentId)) continue;
      seenIds.add(agentId);

      const agent = AGENTS.find(a => a.id === agentId);
      if (!agent) continue;

      const task = agent.taskTemplates[systemId] || agent.defaultTask;
      primaryAgents.push({
        ...agent,
        task: task.replace('{company}', companyName || 'your company'),
        isPrimary: true,
      });
    }
  }

  // 2. Add industry-specific extras (if not already included)
  const extras = INDUSTRY_AGENT_EXTRAS[industry] || [];
  for (const agentId of extras) {
    if (seenIds.has(agentId)) continue;
    seenIds.add(agentId);

    const agent = AGENTS.find(a => a.id === agentId);
    if (!agent) continue;

    primaryAgents.push({
      ...agent,
      task: agent.defaultTask.replace('{company}', companyName || 'your company'),
      isPrimary: true,
    });
  }

  // Cap primary agents at 5 for clean display
  const cappedPrimary = primaryAgents.slice(0, 5);

  // 3. Always include support agents
  const supportAgents: AssignedAgent[] = SUPPORT_AGENT_IDS
    .filter(id => !seenIds.has(id))
    .map(id => {
      const agent = AGENTS.find(a => a.id === id)!;
      return {
        ...agent,
        task: agent.defaultTask,
        isPrimary: false,
      };
    });

  return [...cappedPrimary, ...supportAgents];
}

/* ────────────────── FIT SCORE CALCULATION ────────────────── */

const BASE_SCORES = [85, 78, 72, 65, 58, 55, 52, 50, 48, 46, 44, 42];

/**
 * Calculate fit scores for all systems based on industry priority ranking,
 * diagnostic signal matches, and company size alignment.
 */
export function calculateFitScores(
  industryPrioritizedIds: string[],
  diagnosticSignalIds: string[],
  companySize: string,
  allSystems: { id: string; effort: string; triggerSignals: string[] }[],
): FitScoreResult[] {
  return allSystems.map(system => {
    // Base score from industry priority ranking
    const priorityIdx = industryPrioritizedIds.indexOf(system.id);
    const baseScore = priorityIdx >= 0 && priorityIdx < BASE_SCORES.length
      ? BASE_SCORES[priorityIdx]
      : 40;

    // Signal boost: +5 per matching signal, max +15
    const matchingSignals = system.triggerSignals.filter(s => diagnosticSignalIds.includes(s));
    const signalBoost = Math.min(matchingSignals.length * 5, 15);

    // Size adjustment
    let sizeAdj = 0;
    if (companySize === 'small' && system.effort === 'Small') sizeAdj = 5;
    else if (companySize === 'enterprise' && system.effort === 'Large') sizeAdj = 3;
    else if (companySize === 'small' && system.effort === 'Large') sizeAdj = -5;

    const score = Math.min(baseScore + signalBoost + sizeAdj, 99);

    // Generate reasoning based on score components
    let reasoning = '';
    if (matchingSignals.length > 0) {
      reasoning = 'Strongly aligned with your diagnostic results and industry needs.';
    } else if (priorityIdx <= 2) {
      reasoning = 'Top priority for your industry based on proven results.';
    } else {
      reasoning = 'Complementary system that adds value to your stack.';
    }

    return { systemId: system.id, score, reasoning };
  });
}

/* ────────────────── QUICK WIN CHECK ────────────────── */

const QUICK_WIN_SYSTEMS = new Set([
  'support-engine', 'cart-recovery', 'booking-engine',
  'content-engine', 'onboarding-system',
]);

export function isQuickWin(systemId: string, effort: string): boolean {
  return QUICK_WIN_SYSTEMS.has(systemId) || effort === 'Small';
}
