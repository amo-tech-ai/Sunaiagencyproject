// C29-DATA — Wizard Static Data
// All industries, questions, systems, goals, sizes, signals

import type { LucideIcon } from 'lucide-react';
import {
  ShoppingCart, Building, HeartPulse, BarChart3, Globe, Gem,
  UtensilsCrossed, Briefcase, GraduationCap, Monitor, Cog, LayoutGrid,
  TrendingUp, Zap, Smile, RefreshCw, MoreHorizontal,
  MessageSquare, ShieldCheck, Sparkles, Target, Users, Brain,
  Clock, DollarSign, CheckSquare, FileText, FolderOpen
} from 'lucide-react';

/* ────────────────── INDUSTRIES ────────────────── */

export interface Industry {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const INDUSTRIES: Industry[] = [
  { id: 'e-commerce', label: 'E-commerce / Retail', icon: ShoppingCart },
  { id: 'real-estate', label: 'Real Estate', icon: Building },
  { id: 'healthcare', label: 'Healthcare / Medical', icon: HeartPulse },
  { id: 'financial', label: 'Financial Services', icon: BarChart3 },
  { id: 'travel', label: 'Travel / Hospitality', icon: Globe },
  { id: 'fashion', label: 'Fashion / Beauty', icon: Gem },
  { id: 'food', label: 'Food & Beverage', icon: UtensilsCrossed },
  { id: 'professional', label: 'Professional Services', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'saas', label: 'Technology / SaaS', icon: Monitor },
  { id: 'manufacturing', label: 'Manufacturing', icon: Cog },
  { id: 'other', label: 'Other', icon: LayoutGrid },
];

/* ────────────────── COMPANY SIZES ────────────────── */

export interface CompanySize {
  id: string;
  label: string;
  range: string;
  subtext: string;
}

export const COMPANY_SIZES: CompanySize[] = [
  { id: 'small', label: 'Small', range: '1–10', subtext: 'Startup / Solo' },
  { id: 'medium', label: 'Medium', range: '11–50', subtext: 'Growing team' },
  { id: 'large', label: 'Large', range: '51–200', subtext: 'Established' },
  { id: 'enterprise', label: 'Enterprise', range: '200+', subtext: 'Scale operations' },
];

/* ────────────────── GOALS ────────────────── */

export interface Goal {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const GOALS: Goal[] = [
  { id: 'growth', label: 'Growth', icon: TrendingUp, description: 'Increase revenue, expand market reach' },
  { id: 'efficiency', label: 'Efficiency', icon: Zap, description: 'Reduce costs, automate processes' },
  { id: 'customer-experience', label: 'Customer Experience', icon: Smile, description: 'Improve satisfaction, reduce churn' },
  { id: 'digital-transformation', label: 'Digital Transformation', icon: RefreshCw, description: 'Modernize operations, adopt new tech' },
  { id: 'other', label: 'Other', icon: MoreHorizontal, description: 'Custom goal' },
];

/* ────────────────── DIAGNOSTIC QUESTIONS ────────────────── */

export type QuestionType = 'multi-select' | 'single-select-cards' | 'single-select-radio' | 'three-button' | 'slider';

export interface DiagnosticQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options: { id: string; label: string; description?: string }[];
  whyItMatters: string;
}

export const UNIVERSAL_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'Q1',
    question: 'How do customers currently find you?',
    type: 'multi-select',
    options: [
      { id: 'google', label: 'Google Search' },
      { id: 'social', label: 'Social Media' },
      { id: 'referrals', label: 'Referrals' },
      { id: 'paid-ads', label: 'Paid Ads' },
      { id: 'walk-in', label: 'Walk-in / Physical' },
      { id: 'email', label: 'Email Marketing' },
      { id: 'marketplaces', label: 'Marketplaces' },
      { id: 'other', label: 'Other' },
    ],
    whyItMatters: 'Understanding your acquisition channels reveals which ones could benefit from AI automation. Companies relying on 1-2 channels have the highest growth potential.',
  },
  {
    id: 'Q2',
    question: 'What does your sales process look like today?',
    type: 'single-select-cards',
    options: [
      { id: 'manual', label: 'Fully Manual', description: 'Everything done by hand' },
      { id: 'partial', label: 'Partially Automated', description: 'Some tools, some manual' },
      { id: 'mostly', label: 'Mostly Automated', description: 'Tools handle most of it' },
      { id: 'full', label: 'Fully Automated', description: 'End-to-end automated' },
    ],
    whyItMatters: 'Your automation maturity level determines whether we recommend foundational tools or advanced AI systems. We meet you where you are.',
  },
  {
    id: 'Q3',
    question: 'How do you handle customer support inquiries?',
    type: 'single-select-radio',
    options: [
      { id: 'email-only', label: 'Email only', description: 'Customers email, team responds' },
      { id: 'phone', label: 'Phone', description: 'Phone-based with queue' },
      { id: 'live-chat', label: 'Live chat', description: 'Real-time with human agents' },
      { id: 'chatbot', label: 'Chatbot', description: 'Automated first-line' },
      { id: 'no-process', label: 'No formal process', description: 'Ad hoc responses' },
    ],
    whyItMatters: 'Support inquiries are one of the highest-ROI areas for AI. Companies with manual support typically see 60% cost reduction with AI-first approach.',
  },
  {
    id: 'Q4',
    question: 'What tools/software do you currently use?',
    type: 'multi-select',
    options: [
      { id: 'crm', label: 'CRM' },
      { id: 'email-mktg', label: 'Email Marketing' },
      { id: 'analytics', label: 'Analytics' },
      { id: 'social-mgmt', label: 'Social Media Mgmt' },
      { id: 'accounting', label: 'Accounting' },
      { id: 'pm', label: 'Project Management' },
      { id: 'ecommerce', label: 'E-commerce Platform' },
      { id: 'none', label: 'None' },
    ],
    whyItMatters: 'Your existing tools define what we integrate with versus replace. We never recommend rebuilding what already works.',
  },
];

export const INDUSTRY_QUESTIONS: Record<string, DiagnosticQuestion[]> = {
  'e-commerce': [
    {
      id: 'Q5', question: 'Average cart abandonment rate?', type: 'single-select-cards',
      options: [
        { id: '<30%', label: 'Under 30%' }, { id: '30-50%', label: '30–50%' },
        { id: '50-70%', label: '50–70%' }, { id: '>70%', label: 'Over 70%' },
        { id: 'dont-know', label: "Don't know" },
      ],
      whyItMatters: 'Cart abandonment above 50% signals a high-value recovery opportunity. Automated follow-up typically recovers 10-15% of abandoned carts.',
    },
    {
      id: 'Q6', question: 'Post-purchase follow-up?', type: 'single-select-cards',
      options: [
        { id: 'automated', label: 'Automated emails' },
        { id: 'manual', label: 'Manual follow-up' },
        { id: 'nothing', label: 'Nothing' },
      ],
      whyItMatters: 'Post-purchase engagement drives repeat revenue. Companies with automated follow-up see 25-40% higher customer lifetime value.',
    },
    {
      id: 'Q7', question: 'Do you use personalized product recommendations?', type: 'three-button',
      options: [
        { id: 'yes', label: 'Yes' }, { id: 'partially', label: 'Partially' }, { id: 'no', label: 'No' },
      ],
      whyItMatters: 'Personalized recommendations increase average order value by 10-30%. One of the quickest AI wins in e-commerce.',
    },
    {
      id: 'Q8', question: 'What percentage of revenue comes from repeat customers?', type: 'single-select-cards',
      options: [
        { id: '<20%', label: 'Under 20%' }, { id: '20-40%', label: '20–40%' },
        { id: '40-60%', label: '40–60%' }, { id: '>60%', label: 'Over 60%' },
        { id: 'dont-know', label: "Don't know" },
      ],
      whyItMatters: 'High repeat revenue means strong product-market fit — we focus on scaling. Low repeat means we prioritize retention systems.',
    },
  ],
  'real-estate': [
    {
      id: 'Q5', question: 'How do you qualify incoming leads?', type: 'single-select-cards',
      options: [
        { id: 'manual-calls', label: 'Manual calls/emails' },
        { id: 'form-only', label: 'Web forms only' },
        { id: 'crm-scoring', label: 'CRM lead scoring' },
        { id: 'no-process', label: 'No formal process' },
      ],
      whyItMatters: 'Real estate leads go cold within 5 minutes. AI qualification can respond instantly and route hot leads to agents in seconds.',
    },
    {
      id: 'Q6', question: 'Average response time to new inquiries?', type: 'single-select-cards',
      options: [
        { id: '<5min', label: 'Under 5 minutes' },
        { id: '5-30min', label: '5–30 minutes' },
        { id: '1-24hr', label: '1–24 hours' },
        { id: '>24hr', label: 'Over 24 hours' },
      ],
      whyItMatters: 'Studies show leads contacted within 5 minutes are 21x more likely to convert. Most agencies respond in hours, creating a massive competitive advantage.',
    },
    {
      id: 'Q7', question: 'Do you offer virtual tours or digital viewing experiences?', type: 'three-button',
      options: [
        { id: 'yes', label: 'Yes' }, { id: 'partially', label: 'Some listings' }, { id: 'no', label: 'No' },
      ],
      whyItMatters: 'Virtual tours reduce in-person viewings by 40% while increasing qualified buyer engagement. AI can automate tour scheduling and follow-up.',
    },
    {
      id: 'Q8', question: 'How do you manage listings across platforms?', type: 'single-select-cards',
      options: [
        { id: 'manual', label: 'Manual on each platform' },
        { id: 'one-tool', label: 'Single management tool' },
        { id: 'automated', label: 'Fully automated sync' },
      ],
      whyItMatters: 'Manual listing management wastes 5-10 hours per week. AI-powered syndication ensures consistency and maximizes exposure.',
    },
  ],
  'healthcare': [
    {
      id: 'Q5', question: 'How do patients book appointments?', type: 'single-select-cards',
      options: [
        { id: 'phone-only', label: 'Phone calls only' },
        { id: 'online-basic', label: 'Basic online form' },
        { id: 'self-serve', label: 'Self-serve portal' },
        { id: 'mixed', label: 'Mixed — phone + online' },
      ],
      whyItMatters: '67% of patients prefer online scheduling. AI chatbots can handle bookings 24/7, reducing no-shows by 30% with automated reminders.',
    },
    {
      id: 'Q6', question: 'What is your average no-show rate?', type: 'single-select-cards',
      options: [
        { id: '<10%', label: 'Under 10%' }, { id: '10-20%', label: '10–20%' },
        { id: '20-30%', label: '20–30%' }, { id: '>30%', label: 'Over 30%' },
        { id: 'dont-know', label: "Don't know" },
      ],
      whyItMatters: 'Each no-show costs $150-$200 on average. AI-powered reminder sequences with smart rescheduling can cut no-shows by 50%.',
    },
    {
      id: 'Q7', question: 'How do you handle patient intake forms?', type: 'single-select-cards',
      options: [
        { id: 'paper', label: 'Paper forms' },
        { id: 'pdf', label: 'PDF / email' },
        { id: 'digital', label: 'Digital portal' },
        { id: 'automated', label: 'Automated pre-visit' },
      ],
      whyItMatters: 'Digital intake saves 15 minutes per patient and reduces data entry errors by 80%. AI can pre-populate from previous visits.',
    },
    {
      id: 'Q8', question: 'Do you have automated follow-up care communications?', type: 'three-button',
      options: [
        { id: 'yes', label: 'Yes' }, { id: 'partially', label: 'Partially' }, { id: 'no', label: 'No' },
      ],
      whyItMatters: 'Automated follow-up improves patient outcomes and satisfaction. AI can personalize care instructions and check-in schedules.',
    },
  ],
  'financial': [
    {
      id: 'Q5', question: 'How long is your client onboarding process?', type: 'single-select-cards',
      options: [
        { id: '<1day', label: 'Under 1 day' }, { id: '1-3days', label: '1–3 days' },
        { id: '1-2weeks', label: '1–2 weeks' }, { id: '>2weeks', label: 'Over 2 weeks' },
      ],
      whyItMatters: 'Long onboarding kills conversion. AI can automate KYC/AML checks, document collection, and welcome sequences to cut onboarding time by 70%.',
    },
    {
      id: 'Q6', question: 'How do you handle compliance and regulatory reporting?', type: 'single-select-cards',
      options: [
        { id: 'manual', label: 'Manual spreadsheets' },
        { id: 'semi-auto', label: 'Semi-automated tools' },
        { id: 'automated', label: 'Fully automated' },
      ],
      whyItMatters: 'Manual compliance is error-prone and expensive. AI monitoring can flag issues in real-time and auto-generate regulatory reports.',
    },
    {
      id: 'Q7', question: 'Do you provide personalized financial insights to clients?', type: 'three-button',
      options: [
        { id: 'yes', label: 'Yes' }, { id: 'partially', label: 'Partially' }, { id: 'no', label: 'No' },
      ],
      whyItMatters: 'Personalized insights increase client retention by 35%. AI can analyze portfolios and generate tailored recommendations at scale.',
    },
    {
      id: 'Q8', question: 'How do clients access their portfolio or account information?', type: 'single-select-cards',
      options: [
        { id: 'email-reports', label: 'Email reports' },
        { id: 'basic-portal', label: 'Basic online portal' },
        { id: 'mobile-app', label: 'Mobile app' },
        { id: 'advisor-only', label: 'Through advisor only' },
      ],
      whyItMatters: 'Self-serve access reduces advisor workload by 40% while improving client satisfaction. AI chatbots can answer portfolio questions 24/7.',
    },
  ],
  'travel': [
    {
      id: 'Q5', question: 'How do you handle booking modifications and cancellations?', type: 'single-select-cards',
      options: [
        { id: 'manual', label: 'Manual by staff' },
        { id: 'self-serve', label: 'Self-serve portal' },
        { id: 'mixed', label: 'Mixed approach' },
        { id: 'no-policy', label: 'No clear process' },
      ],
      whyItMatters: 'Booking changes are the #1 support ticket in travel. AI can handle 80% of modifications automatically, freeing staff for complex requests.',
    },
    {
      id: 'Q6', question: 'Do you offer personalized travel recommendations?', type: 'three-button',
      options: [
        { id: 'yes', label: 'Yes' }, { id: 'partially', label: 'Partially' }, { id: 'no', label: 'No' },
      ],
      whyItMatters: 'Personalized recommendations increase booking value by 15-25%. AI can analyze past preferences and seasonal trends to suggest perfect trips.',
    },
    {
      id: 'Q7', question: 'How do you collect and use guest reviews?', type: 'single-select-cards',
      options: [
        { id: 'automated', label: 'Automated collection + response' },
        { id: 'collect-only', label: 'Collect but rarely respond' },
        { id: 'manual', label: 'Manually request' },
        { id: 'none', label: 'No system in place' },
      ],
      whyItMatters: 'Properties responding to reviews see 12% more bookings. AI can auto-generate personalized responses and analyze sentiment trends.',
    },
    {
      id: 'Q8', question: 'What percentage of bookings come through direct channels vs OTAs?', type: 'single-select-cards',
      options: [
        { id: 'mostly-direct', label: 'Mostly direct (>60%)' },
        { id: 'balanced', label: 'Balanced (40-60%)' },
        { id: 'mostly-ota', label: 'Mostly OTAs (>60%)' },
        { id: 'dont-know', label: "Don't know" },
      ],
      whyItMatters: 'OTA commissions eat 15-25% of revenue. AI-powered direct booking engines with smart pricing can shift the balance and save thousands monthly.',
    },
  ],
  'fashion': [
    {
      id: 'Q5', question: 'How do you leverage social media for sales?', type: 'single-select-cards',
      options: [
        { id: 'social-commerce', label: 'Direct social selling' },
        { id: 'content-only', label: 'Content marketing only' },
        { id: 'influencer', label: 'Influencer partnerships' },
        { id: 'minimal', label: 'Minimal social presence' },
      ],
      whyItMatters: 'Social commerce is growing 3x faster than traditional e-commerce in fashion. AI can automate content creation and optimize posting schedules.',
    },
    {
      id: 'Q6', question: 'How do you manage inventory across channels?', type: 'single-select-cards',
      options: [
        { id: 'unified', label: 'Unified system' },
        { id: 'separate', label: 'Separate per channel' },
        { id: 'manual', label: 'Manual tracking' },
      ],
      whyItMatters: 'Inventory mismanagement causes 4% of fashion revenue loss. AI demand forecasting reduces overstock by 30% and stockouts by 50%.',
    },
    {
      id: 'Q7', question: 'Do you offer virtual try-on or size recommendation?', type: 'three-button',
      options: [
        { id: 'yes', label: 'Yes' }, { id: 'partially', label: 'Partially' }, { id: 'no', label: 'No' },
      ],
      whyItMatters: 'Virtual try-on reduces returns by 25-35%. AI size recommendations alone can cut return rates in half.',
    },
    {
      id: 'Q8', question: 'How do you work with influencers or brand ambassadors?', type: 'single-select-cards',
      options: [
        { id: 'structured', label: 'Structured program' },
        { id: 'ad-hoc', label: 'Ad hoc collaborations' },
        { id: 'none', label: 'No influencer strategy' },
      ],
      whyItMatters: 'AI can identify micro-influencers with the best ROI and automate campaign tracking, reducing management overhead by 60%.',
    },
  ],
  'saas': [
    {
      id: 'Q5', question: 'What is your user onboarding completion rate?', type: 'single-select-cards',
      options: [
        { id: '>80%', label: 'Over 80%' }, { id: '60-80%', label: '60–80%' },
        { id: '40-60%', label: '40–60%' }, { id: '<40%', label: 'Under 40%' },
        { id: 'dont-know', label: "Don't know" },
      ],
      whyItMatters: 'Low onboarding completion is the #1 predictor of churn. AI-guided onboarding can improve completion by 40% with personalized flows.',
    },
    {
      id: 'Q6', question: 'What is your monthly churn rate?', type: 'single-select-cards',
      options: [
        { id: '<2%', label: 'Under 2%' }, { id: '2-5%', label: '2–5%' },
        { id: '5-10%', label: '5–10%' }, { id: '>10%', label: 'Over 10%' },
        { id: 'dont-know', label: "Don't know" },
      ],
      whyItMatters: 'Every 1% reduction in churn can increase company value by 12%. AI churn prediction can identify at-risk users 30 days before they leave.',
    },
    {
      id: 'Q7', question: 'Do you offer in-app guidance or contextual help?', type: 'three-button',
      options: [
        { id: 'yes', label: 'Yes' }, { id: 'partially', label: 'Partially' }, { id: 'no', label: 'No' },
      ],
      whyItMatters: 'In-app AI assistants reduce support tickets by 45% and increase feature adoption by 30%. Context-aware help beats documentation every time.',
    },
    {
      id: 'Q8', question: 'How do you monitor customer health scores?', type: 'single-select-cards',
      options: [
        { id: 'automated', label: 'Automated health scoring' },
        { id: 'manual', label: 'Manual CSM tracking' },
        { id: 'basic', label: 'Basic usage metrics' },
        { id: 'none', label: 'No health scoring' },
      ],
      whyItMatters: 'AI health scoring combines 50+ signals (usage, support, billing) to predict churn and expansion opportunities with 85% accuracy.',
    },
  ],
  // Default questions for industries without specific banks
  _default: [
    {
      id: 'Q5', question: 'How do you track client/customer lifecycle?', type: 'single-select-radio',
      options: [
        { id: 'crm', label: 'CRM system' }, { id: 'spreadsheet', label: 'Spreadsheet' },
        { id: 'memory', label: 'Memory' }, { id: 'none', label: 'None' },
      ],
      whyItMatters: 'Lifecycle tracking is the foundation of retention. Without it, growth depends entirely on new acquisition.',
    },
    {
      id: 'Q6', question: 'What is your repeat business rate?', type: 'single-select-cards',
      options: [
        { id: '<20%', label: 'Under 20%' }, { id: '20-40%', label: '20–40%' },
        { id: '40-60%', label: '40–60%' }, { id: '>60%', label: 'Over 60%' },
        { id: 'dont-know', label: "Don't know" },
      ],
      whyItMatters: 'Repeat business below 40% signals a retention opportunity. AI can help identify and re-engage lapsed customers.',
    },
    {
      id: 'Q7', question: 'How do you generate proposals or quotes?', type: 'single-select-cards',
      options: [
        { id: 'automated', label: 'Automated' }, { id: 'template', label: 'Template-based' },
        { id: 'manual', label: 'Manual from scratch' },
      ],
      whyItMatters: 'Manual proposal generation is a major time sink. AI-assisted proposals are 5x faster with higher consistency.',
    },
    {
      id: 'Q8', question: 'Do you collect customer feedback systematically?', type: 'three-button',
      options: [
        { id: 'yes', label: 'Yes' }, { id: 'partially', label: 'Partially' }, { id: 'no', label: 'No' },
      ],
      whyItMatters: 'Voice of customer data is essential for product-market fit. AI can analyze feedback at scale to surface insights.',
    },
  ],
  // Manufacturing-specific question bank
  manufacturing: [
    {
      id: 'Q5', question: 'How do you track production quality?', type: 'single-select-cards',
      options: [
        { id: 'automated-sensors', label: 'Automated sensors' },
        { id: 'checklist', label: 'Checklist / manual inspection' },
        { id: 'spot-check', label: 'Spot checks only' },
        { id: 'none', label: 'No formal QC process' },
      ],
      whyItMatters: 'Manufacturers with manual QC miss 15-25% of defects. AI vision inspection catches defects in real-time with 99%+ accuracy, reducing waste and rework costs.',
    },
    {
      id: 'Q6', question: 'What is your average equipment downtime?', type: 'single-select-cards',
      options: [
        { id: '<5%', label: 'Under 5%' },
        { id: '5-15%', label: '5–15%' },
        { id: '15-30%', label: '15–30%' },
        { id: '>30%', label: 'Over 30%' },
        { id: 'dont-know', label: "Don't know" },
      ],
      whyItMatters: 'Unplanned downtime costs manufacturers $50B/year globally. AI predictive maintenance can reduce downtime by 30-50% and extend equipment life by 20%.',
    },
    {
      id: 'Q7', question: 'Do you use predictive maintenance for key equipment?', type: 'three-button',
      options: [
        { id: 'yes', label: 'Yes' }, { id: 'partially', label: 'Partially' }, { id: 'no', label: 'No' },
      ],
      whyItMatters: 'Reactive maintenance costs 3-9x more than predictive approaches. AI monitors vibration, temperature, and usage patterns to predict failures before they happen.',
    },
    {
      id: 'Q8', question: 'How do you manage supply chain visibility?', type: 'single-select-cards',
      options: [
        { id: 'real-time', label: 'Real-time tracking' },
        { id: 'delayed', label: 'Delayed reports' },
        { id: 'manual', label: 'Manual tracking' },
        { id: 'none', label: 'No visibility' },
      ],
      whyItMatters: 'Poor supply chain visibility causes 20-30% excess inventory costs. AI demand forecasting and real-time tracking can reduce stockouts by 65% and cut carrying costs.',
    },
  ],
};

export function getIndustryQuestions(industryId: string): DiagnosticQuestion[] {
  return INDUSTRY_QUESTIONS[industryId] || INDUSTRY_QUESTIONS._default;
}

/* ────────────────── SIGNAL RULES ────────────────── */

export interface Signal {
  id: string;
  label: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
}

export interface SignalRule {
  question: string;
  condition: (answer: any) => boolean;
  signal: Signal;
}

export const ECOMMERCE_SIGNAL_RULES: SignalRule[] = [
  {
    question: 'Q5',
    condition: (a) => typeof a === 'string' && ['50-70%', '>70%'].includes(a),
    signal: { id: 'high-abandonment', label: 'High cart abandonment rate', severity: 'high', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q6',
    condition: (a) => a === 'nothing',
    signal: { id: 'no-follow-up', label: 'No post-purchase follow-up', severity: 'medium', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q7',
    condition: (a) => a === 'no',
    signal: { id: 'no-recommendations', label: 'No personalized product recommendations', severity: 'medium', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q8',
    condition: (a) => typeof a === 'string' && ['<20%', '20-40%'].includes(a),
    signal: { id: 'low-repeat-revenue', label: 'Low repeat revenue', severity: 'high', recommendation: 'AI Customer Support Engine' },
  },
];

export const REAL_ESTATE_SIGNAL_RULES: SignalRule[] = [
  {
    question: 'Q5',
    condition: (a) => a === 'manual-calls',
    signal: { id: 'manual-qualification', label: 'Manual lead qualification', severity: 'high', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q6',
    condition: (a) => typeof a === 'string' && ['5-30min', '1-24hr', '>24hr'].includes(a),
    signal: { id: 'slow-response', label: 'Slow response to inquiries', severity: 'high', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q7',
    condition: (a) => a === 'no',
    signal: { id: 'no-virtual-tours', label: 'No virtual tours', severity: 'medium', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q8',
    condition: (a) => a === 'manual',
    signal: { id: 'manual-listing-management', label: 'Manual listing management', severity: 'high', recommendation: 'AI Customer Support Engine' },
  },
];

export const HEALTHCARE_SIGNAL_RULES: SignalRule[] = [
  {
    question: 'Q5',
    condition: (a) => a === 'phone-only',
    signal: { id: 'phone-only-bookings', label: 'Phone-only bookings', severity: 'high', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q6',
    condition: (a) => typeof a === 'string' && ['20-30%', '>30%'].includes(a),
    signal: { id: 'high-no-shows', label: 'High no-show rate', severity: 'high', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q7',
    condition: (a) => a === 'paper',
    signal: { id: 'paper-forms', label: 'Paper intake forms', severity: 'medium', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q8',
    condition: (a) => a === 'no',
    signal: { id: 'no-follow-up-care', label: 'No automated follow-up care', severity: 'high', recommendation: 'AI Customer Support Engine' },
  },
];

export const FINANCIAL_SIGNAL_RULES: SignalRule[] = [
  {
    question: 'Q5',
    condition: (a) => typeof a === 'string' && ['1-3days', '1-2weeks', '>2weeks'].includes(a),
    signal: { id: 'long-onboarding', label: 'Long client onboarding process', severity: 'high', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q6',
    condition: (a) => a === 'manual',
    signal: { id: 'manual-compliance', label: 'Manual compliance and reporting', severity: 'high', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q7',
    condition: (a) => a === 'no',
    signal: { id: 'no-personalized-insights', label: 'No personalized financial insights', severity: 'medium', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q8',
    condition: (a) => a === 'advisor-only',
    signal: { id: 'advisor-only-access', label: 'Advisor-only access to portfolios', severity: 'high', recommendation: 'AI Customer Support Engine' },
  },
];

export const TRAVEL_SIGNAL_RULES: SignalRule[] = [
  {
    question: 'Q5',
    condition: (a) => a === 'manual',
    signal: { id: 'manual-modifications', label: 'Manual booking modifications and cancellations', severity: 'high', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q6',
    condition: (a) => a === 'no',
    signal: { id: 'no-personalized-recommendations', label: 'No personalized travel recommendations', severity: 'medium', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q7',
    condition: (a) => a === 'none',
    signal: { id: 'no-review-system', label: 'No review collection or response system', severity: 'high', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q8',
    condition: (a) => a === 'mostly-ota',
    signal: { id: 'high-ota-dependence', label: 'High dependence on OTAs', severity: 'high', recommendation: 'AI Customer Support Engine' },
  },
];

export const FASHION_SIGNAL_RULES: SignalRule[] = [
  {
    question: 'Q5',
    condition: (a) => a === 'minimal',
    signal: { id: 'minimal-social-presence', label: 'Minimal social presence', severity: 'medium', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q6',
    condition: (a) => a === 'manual',
    signal: { id: 'manual-inventory-management', label: 'Manual inventory management', severity: 'high', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q7',
    condition: (a) => a === 'no',
    signal: { id: 'no-virtual-try-on', label: 'No virtual try-on or size recommendation', severity: 'medium', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q8',
    condition: (a) => a === 'none',
    signal: { id: 'no-influencer-strategy', label: 'No influencer strategy', severity: 'medium', recommendation: 'AI Customer Support Engine' },
  },
];

export const SAAS_SIGNAL_RULES: SignalRule[] = [
  {
    question: 'Q5',
    condition: (a) => typeof a === 'string' && ['40-60%', '<40%'].includes(a),
    signal: { id: 'low-onboarding-completion', label: 'Low user onboarding completion rate', severity: 'high', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q6',
    condition: (a) => typeof a === 'string' && ['5-10%', '>10%'].includes(a),
    signal: { id: 'high-churn-rate', label: 'High monthly churn rate', severity: 'high', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q7',
    condition: (a) => a === 'no',
    signal: { id: 'no-in-app-guidance', label: 'No in-app guidance or contextual help', severity: 'medium', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q8',
    condition: (a) => a === 'none',
    signal: { id: 'no-health-scoring', label: 'No customer health scoring', severity: 'high', recommendation: 'AI Customer Support Engine' },
  },
];

export const MANUFACTURING_SIGNAL_RULES: SignalRule[] = [
  {
    question: 'Q5',
    condition: (a) => typeof a === 'string' && ['checklist', 'spot-check', 'none'].includes(a),
    signal: { id: 'manual-qc', label: 'Manual quality control process', severity: 'high', recommendation: 'Business Intelligence Brain' },
  },
  {
    question: 'Q6',
    condition: (a) => typeof a === 'string' && ['15-30%', '>30%'].includes(a),
    signal: { id: 'high-downtime', label: 'High equipment downtime', severity: 'high', recommendation: 'AI Customer Support Engine + Predictive Maintenance' },
  },
  {
    question: 'Q7',
    condition: (a) => a === 'no',
    signal: { id: 'no-predictive-maintenance', label: 'No predictive maintenance', severity: 'medium', recommendation: 'Business Intelligence Brain' },
  },
  {
    question: 'Q8',
    condition: (a) => typeof a === 'string' && ['manual', 'none'].includes(a),
    signal: { id: 'no-supply-chain-visibility', label: 'Poor supply chain visibility', severity: 'high', recommendation: 'Business Intelligence Brain' },
  },
];

/** Get signal rules for a given industry */
export function getIndustrySignalRules(industryId: string): SignalRule[] {
  const map: Record<string, SignalRule[]> = {
    'e-commerce': ECOMMERCE_SIGNAL_RULES,
    'real-estate': REAL_ESTATE_SIGNAL_RULES,
    'healthcare': HEALTHCARE_SIGNAL_RULES,
    'financial': FINANCIAL_SIGNAL_RULES,
    'travel': TRAVEL_SIGNAL_RULES,
    'fashion': FASHION_SIGNAL_RULES,
    'saas': SAAS_SIGNAL_RULES,
    'manufacturing': MANUFACTURING_SIGNAL_RULES,
  };
  return map[industryId] || [];
}

/* ────────────────── UNIVERSAL SIGNAL RULES ────────────────── */

export const UNIVERSAL_SIGNAL_RULES: SignalRule[] = [
  {
    question: 'Q2',
    condition: (a) => a === 'manual',
    signal: { id: 'manual-sales', label: 'Fully manual sales process', severity: 'high', recommendation: 'AI Sales Automation' },
  },
  {
    question: 'Q3',
    condition: (a) => typeof a === 'string' && ['email-only', 'no-process'].includes(a),
    signal: { id: 'no-support-automation', label: 'No support automation', severity: 'high', recommendation: 'AI Customer Support Engine' },
  },
  {
    question: 'Q4',
    condition: (a) => Array.isArray(a) && a.includes('none'),
    signal: { id: 'no-tools', label: 'No business tools in use', severity: 'high', recommendation: 'Operations Autopilot' },
  },
  {
    question: 'Q1',
    condition: (a) => Array.isArray(a) && a.length <= 2 && !a.includes('other'),
    signal: { id: 'limited-channels', label: 'Limited acquisition channels', severity: 'medium', recommendation: 'Growth Engine' },
  },
];

/* ────────────────── STEP 1 CONTEXT ────────────────── */

export const STEP1_CONTEXT: Record<string, { heading: string; body: string }> = {
  default: {
    heading: 'Let\'s get started',
    body: 'Fill in your business details so we can tailor the analysis to your specific context.',
  },
  companyName: {
    heading: 'Why we need your company name',
    body: 'Your company name is used throughout the strategy brief and proposal. We\'ll reference it in all recommendations.',
  },
  websiteUrl: {
    heading: 'Website analysis',
    body: 'If you provide your website, our AI can pre-analyze your digital presence, tech stack, and customer experience to give better recommendations.',
  },
  industry: {
    heading: 'Industry-specific insights',
    body: 'Your industry determines which diagnostic questions we ask and which AI systems are most relevant. We have specialized question banks for each sector.',
  },
  companySize: {
    heading: 'Right-sized recommendations',
    body: 'Company size affects implementation complexity, budget ranges, and which systems deliver the fastest ROI. A 10-person team needs different solutions than a 200-person org.',
  },
  goal: {
    heading: 'Goal-aligned strategy',
    body: 'Your primary goal shapes the entire recommendation. Growth-focused companies get different systems than efficiency-focused ones.',
  },
  challenge: {
    heading: 'Challenge-driven analysis',
    body: 'Your biggest challenge helps us prioritize. We\'ll look for AI systems that directly address this pain point first.',
  },
};

/* ────────────────── STEPS ────────────────── */

export interface StepMeta {
  number: number;
  shortLabel: string;
  label: string;
}

export const STEPS: StepMeta[] = [
  { number: 1, shortLabel: 'Business Context', label: 'Tell us about your business' },
  { number: 2, shortLabel: 'Diagnostics', label: 'Industry diagnostic questions' },
  { number: 3, shortLabel: 'Recommendations', label: 'AI system recommendations' },
  { number: 4, shortLabel: 'Strategy Brief', label: 'Executive summary & brief' },
  { number: 5, shortLabel: 'Launch', label: 'Launch your project' },
];

/* ────────────────── AI SYSTEMS ────────────────── */

export interface AISystem {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  whyItFits: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'Small' | 'Medium' | 'Large';
  timeline: string;
  triggerSignals: string[];
  detailDescription: string;
  tradeoffs: string[];
  relatedServices: { label: string; path: string }[];
}

export const AI_SYSTEMS: AISystem[] = [
  {
    id: 'support-engine',
    name: 'AI Customer Support Engine',
    icon: MessageSquare,
    description: 'Intelligent chatbot + ticket routing that handles 80% of inquiries automatically with human handoff for complex cases.',
    whyItFits: 'Reduces response time from hours to seconds while cutting support costs by 60%.',
    impact: 'High',
    effort: 'Small',
    timeline: '2–4 weeks',
    triggerSignals: ['no-support-automation', 'high-abandonment', 'slow-response', 'phone-only-bookings', 'manual-modifications'],
    detailDescription: 'The AI Customer Support Engine uses natural language understanding to handle customer queries across chat, email, and WhatsApp. It learns from your existing support data, resolves common issues instantly, and seamlessly escalates complex cases to human agents with full context. Includes sentiment analysis, multilingual support, and 24/7 availability.',
    tradeoffs: [
      'Initial training requires 2–4 weeks of historical support data',
      'Complex edge cases still need human agents',
      'Customers may prefer human interaction for sensitive issues',
    ],
    relatedServices: [
      { label: 'AI Chatbots', path: '/services/chatbot' },
      { label: 'WhatsApp AI', path: '/whatsapp-ai' },
    ],
  },
  {
    id: 'growth-engine',
    name: 'AI Growth Engine',
    icon: Target,
    description: 'Automated lead generation, scoring, and nurturing system that identifies and converts your best prospects.',
    whyItFits: 'Increases qualified leads by 3x while reducing cost per acquisition by 40%.',
    impact: 'High',
    effort: 'Medium',
    timeline: '4–6 weeks',
    triggerSignals: ['limited-channels', 'manual-sales', 'manual-qualification'],
    detailDescription: 'The AI Growth Engine combines predictive lead scoring with automated outreach sequences. It analyzes your best customers to find lookalike prospects, personalizes messaging at scale, and optimizes conversion funnels using real-time data. Integrates with your CRM and marketing tools.',
    tradeoffs: [
      'Requires integration with existing CRM for best results',
      'Lead quality models need 30–60 days to optimize',
      'Higher upfront investment than simpler automation tools',
    ],
    relatedServices: [
      { label: 'AI Agent Systems', path: '/services/ai-agent-systems' },
      { label: 'Sales Automation', path: '/services/sales-automation' },
    ],
  },
  {
    id: 'operations-autopilot',
    name: 'Operations Autopilot',
    icon: Zap,
    description: 'End-to-end workflow automation that eliminates repetitive tasks and streamlines internal operations.',
    whyItFits: 'Saves 20+ hours per week on manual processes and reduces human error by 90%.',
    impact: 'Medium',
    effort: 'Medium',
    timeline: '4–8 weeks',
    triggerSignals: ['no-tools', 'manual-sales', 'manual-compliance', 'manual-inventory-management', 'manual-listing-management'],
    detailDescription: 'Operations Autopilot maps your existing workflows, identifies bottlenecks, and automates repetitive tasks using AI-powered decision trees. Handles document processing, data entry, reporting, scheduling, and cross-system synchronization. Includes a visual workflow builder for ongoing customization.',
    tradeoffs: [
      'Process mapping phase takes 1–2 weeks before automation begins',
      'Team adoption requires change management and training',
      'Complex multi-system integrations may extend timeline',
    ],
    relatedServices: [
      { label: 'Workflow Automation', path: '/services/workflow-automation' },
      { label: 'Process Optimization', path: '/services/process-optimization' },
    ],
  },
  {
    id: 'data-intelligence',
    name: 'Business Intelligence Brain',
    icon: Brain,
    description: 'AI-powered analytics dashboard that turns raw data into actionable insights and predictions.',
    whyItFits: 'Enables data-driven decisions with real-time dashboards and predictive analytics.',
    impact: 'High',
    effort: 'Large',
    timeline: '6–10 weeks',
    triggerSignals: ['no-tools', 'no-health-scoring', 'manual-qc', 'no-predictive-maintenance', 'no-supply-chain-visibility'],
    detailDescription: 'The Business Intelligence Brain connects to all your data sources, creates unified dashboards, and uses machine learning to forecast trends, detect anomalies, and surface opportunities. Includes natural language querying so anyone on your team can ask questions in plain English.',
    tradeoffs: [
      'Requires clean, structured data sources for best accuracy',
      'Initial setup and data pipeline creation takes 4–6 weeks',
      'Ongoing data governance needed to maintain quality',
    ],
    relatedServices: [
      { label: 'Data & Analytics', path: '/services/data-analytics' },
      { label: 'AI Consulting', path: '/services/ai-consulting' },
    ],
  },
  {
    id: 'content-engine',
    name: 'AI Content Engine',
    icon: FileText,
    description: 'Automated content creation system for blog posts, social media, emails, and ad copy tailored to your brand voice.',
    whyItFits: 'Produces 10x more content at 1/5th the cost while maintaining brand consistency.',
    impact: 'Medium',
    effort: 'Small',
    timeline: '2–3 weeks',
    triggerSignals: ['limited-channels', 'minimal-social-presence', 'no-influencer-strategy'],
    detailDescription: 'The AI Content Engine learns your brand voice, tone, and style guidelines, then generates platform-optimized content across all channels. Includes SEO optimization, A/B testing recommendations, content calendar management, and performance tracking. Supports blog, social media, email, and paid ad formats.',
    tradeoffs: [
      'AI-generated content needs human review for accuracy and tone',
      'Brand voice training requires 50+ examples of existing content',
      'May not suit highly technical or regulated industries without extra oversight',
    ],
    relatedServices: [
      { label: 'Content Strategy', path: '/services/content-strategy' },
      { label: 'Social Media AI', path: '/services/social-media-ai' },
    ],
  },
  {
    id: 'onboarding-system',
    name: 'Smart Onboarding System',
    icon: Users,
    description: 'AI-guided customer or employee onboarding that personalizes the experience and reduces time-to-value.',
    whyItFits: 'Cuts onboarding time by 50% and improves completion rates by 40%.',
    impact: 'Medium',
    effort: 'Medium',
    timeline: '3–5 weeks',
    triggerSignals: ['long-onboarding', 'low-onboarding-completion', 'paper-forms', 'no-follow-up-care', 'high-no-shows'],
    detailDescription: 'The Smart Onboarding System creates personalized onboarding journeys based on user profile, behavior, and goals. Uses AI to adapt the flow in real-time, surface relevant resources, send proactive nudges, and identify users who are struggling. Works for both customer onboarding and employee training.',
    tradeoffs: [
      'Requires clear definition of "onboarding success" metrics',
      'Personalization improves with volume — small user bases see less benefit initially',
      'Integration with existing auth and user management systems required',
    ],
    relatedServices: [
      { label: 'Customer Experience', path: '/services/customer-experience' },
      { label: 'AI Agent Systems', path: '/services/ai-agent-systems' },
    ],
  },
];

/* ────────────────── ROADMAP PHASES ────────────────── */

export interface RoadmapPhase {
  number: number;
  title: string;
  weeks: string;
  outcomes: string[];
}

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    number: 1,
    title: 'Foundation',
    weeks: 'Weeks 1–4',
    outcomes: ['Data audit & integration', 'Core system deployment', 'Team training'],
  },
  {
    number: 2,
    title: 'Expansion',
    weeks: 'Weeks 5–8',
    outcomes: ['Advanced features enabled', 'Performance optimization', 'Workflow refinement'],
  },
  {
    number: 3,
    title: 'Scale',
    weeks: 'Weeks 9–12',
    outcomes: ['Full automation live', 'ROI measurement', 'Growth planning'],
  },
];

/* ────────────────── DASHBOARD PREVIEW CARDS ────────────────── */

export interface DashboardCard {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const DASHBOARD_PREVIEW_CARDS: DashboardCard[] = [
  { title: 'Project Overview', description: 'Status, timeline & team', icon: FolderOpen },
  { title: 'Task Board', description: '12 tasks auto-generated', icon: CheckSquare },
  { title: 'Strategy Brief', description: 'Your approved brief', icon: FileText },
  { title: 'ROI Tracker', description: 'Live performance metrics', icon: DollarSign },
];