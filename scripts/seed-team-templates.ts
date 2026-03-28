#!/usr/bin/env npx tsx
// seed-team-templates.ts — Seed agent_team_templates and agent_team_templates_agents
// Usage: npx tsx scripts/seed-team-templates.ts
// Idempotent: deletes existing templates and re-inserts.

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load .env.local
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY!;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SECRET_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Template definitions ──

interface AgentRole {
  agent_slug: string;
  role: string;
  first_task: string;
  sort_order: number;
}

interface Template {
  name: string;
  industry: string;
  goal: string;
  company_size: string | null;
  description: string;
  agents: AgentRole[];
}

const TEMPLATES: Template[] = [
  // ── Healthcare ──
  {
    name: "Healthcare MVP Team",
    industry: "healthcare",
    goal: "launch-mvp",
    company_size: null,
    description: "Launch a compliant healthcare MVP with rapid prototyping and patient communication",
    agents: [
      { agent_slug: "engineering-rapid-prototyper", role: "Builds the initial booking/communication MVP", first_task: "Scope a WhatsApp booking bot for the clinic", sort_order: 0 },
      { agent_slug: "support-support-responder", role: "Designs patient communication flows", first_task: "Map the top 15 patient FAQ into automated responses", sort_order: 1 },
      { agent_slug: "support-finance-tracker", role: "Projects cost savings and ROI", first_task: "Create baseline cost report for current operations", sort_order: 2 },
      { agent_slug: "project-management-project-shepherd", role: "Manages implementation roadmap", first_task: "Set up 3-phase sprint plan with weekly milestones", sort_order: 3 },
      { agent_slug: "testing-reality-checker", role: "Validates recommendations before delivery", first_task: "Review MVP spec for feasibility and compliance gaps", sort_order: 4 },
    ],
  },
  {
    name: "Healthcare Growth Team",
    industry: "healthcare",
    goal: "grow-marketing",
    company_size: null,
    description: "Grow healthcare practice visibility with compliant marketing strategies",
    agents: [
      { agent_slug: "marketing-growth-hacker", role: "Designs patient acquisition funnels", first_task: "Map top 3 referral channels and design growth experiments", sort_order: 0 },
      { agent_slug: "healthcare-marketing-compliance", role: "Ensures all content meets healthcare regulations", first_task: "Audit current marketing materials for compliance gaps", sort_order: 1 },
      { agent_slug: "marketing-content-creator", role: "Creates patient-friendly educational content", first_task: "Draft 5 patient education articles for the blog", sort_order: 2 },
      { agent_slug: "marketing-seo-specialist", role: "Optimizes for local healthcare searches", first_task: "Run local SEO audit and identify top 20 target keywords", sort_order: 3 },
      { agent_slug: "support-analytics-reporter", role: "Tracks campaign performance and patient metrics", first_task: "Set up analytics dashboard for patient acquisition funnel", sort_order: 4 },
    ],
  },
  {
    name: "Healthcare Operations Team",
    industry: "healthcare",
    goal: "reduce-costs",
    company_size: null,
    description: "Reduce operational costs in healthcare through automation and efficiency",
    agents: [
      { agent_slug: "support-analytics-reporter", role: "Identifies cost reduction opportunities from data", first_task: "Analyze top 5 operational cost centers and waste patterns", sort_order: 0 },
      { agent_slug: "support-finance-tracker", role: "Tracks financial impact of efficiency improvements", first_task: "Build monthly cost-per-patient-visit benchmark report", sort_order: 1 },
      { agent_slug: "support-support-responder", role: "Automates routine patient interactions", first_task: "Identify top 10 automatable patient support requests", sort_order: 2 },
      { agent_slug: "project-management-project-shepherd", role: "Coordinates operational improvement projects", first_task: "Map current workflows and identify automation targets", sort_order: 3 },
    ],
  },

  // ── E-commerce ──
  {
    name: "E-commerce Launch Team",
    industry: "e-commerce",
    goal: "launch-mvp",
    company_size: "1-10",
    description: "Launch an e-commerce store fast with beautiful design and growth built in",
    agents: [
      { agent_slug: "engineering-rapid-prototyper", role: "Builds the storefront MVP", first_task: "Set up Shopify/custom store with core product catalog", sort_order: 0 },
      { agent_slug: "engineering-frontend-developer", role: "Creates conversion-optimized UI components", first_task: "Build product page, cart, and checkout flow", sort_order: 1 },
      { agent_slug: "marketing-growth-hacker", role: "Designs launch strategy and early traction", first_task: "Plan pre-launch email capture and social proof campaign", sort_order: 2 },
      { agent_slug: "design-brand-guardian", role: "Establishes brand identity and visual consistency", first_task: "Create brand style guide with colors, typography, and tone", sort_order: 3 },
    ],
  },
  {
    name: "E-commerce Growth Team",
    industry: "e-commerce",
    goal: "grow-marketing",
    company_size: null,
    description: "Scale e-commerce marketing with SEO, social, and content strategies",
    agents: [
      { agent_slug: "marketing-growth-hacker", role: "Architects multi-channel growth strategy", first_task: "Audit current channels and identify 3 highest-leverage growth levers", sort_order: 0 },
      { agent_slug: "marketing-seo-specialist", role: "Drives organic product discovery", first_task: "Optimize top 20 product pages for transactional keywords", sort_order: 1 },
      { agent_slug: "marketing-instagram-curator", role: "Builds visual brand presence on social", first_task: "Plan 30-day content calendar with shoppable posts", sort_order: 2 },
      { agent_slug: "marketing-content-creator", role: "Creates buying guides and product content", first_task: "Write 5 product comparison guides for top categories", sort_order: 3 },
      { agent_slug: "design-brand-guardian", role: "Maintains brand consistency across channels", first_task: "Review all channel assets for brand alignment", sort_order: 4 },
    ],
  },
  {
    name: "E-commerce Sales Team",
    industry: "e-commerce",
    goal: "scale-sales",
    company_size: null,
    description: "Scale e-commerce revenue through pipeline optimization and outbound",
    agents: [
      { agent_slug: "sales-pipeline-analyst", role: "Analyzes sales funnel and conversion bottlenecks", first_task: "Map full purchase funnel with drop-off rates per stage", sort_order: 0 },
      { agent_slug: "sales-outbound-strategist", role: "Designs B2B/wholesale outreach campaigns", first_task: "Build ICP list and 3-touch outreach sequence for wholesale", sort_order: 1 },
      { agent_slug: "marketing-growth-hacker", role: "Optimizes customer acquisition cost", first_task: "A/B test top 3 ad creatives against CPA benchmarks", sort_order: 2 },
      { agent_slug: "support-finance-tracker", role: "Tracks unit economics and margin health", first_task: "Calculate CAC, LTV, and gross margin per product line", sort_order: 3 },
    ],
  },

  // ── SaaS ──
  {
    name: "SaaS MVP Team",
    industry: "saas",
    goal: "launch-mvp",
    company_size: "1-10",
    description: "Build a SaaS MVP with solid architecture and rapid iteration",
    agents: [
      { agent_slug: "engineering-software-architect", role: "Designs scalable system architecture", first_task: "Create architecture decision record for core stack choices", sort_order: 0 },
      { agent_slug: "engineering-rapid-prototyper", role: "Builds functional prototype fast", first_task: "Ship v0.1 with core feature loop in 5 days", sort_order: 1 },
      { agent_slug: "engineering-frontend-developer", role: "Builds the user-facing application", first_task: "Implement onboarding flow and primary dashboard", sort_order: 2 },
      { agent_slug: "product-sprint-prioritizer", role: "Prioritizes features for maximum validation", first_task: "Stack-rank backlog by learning value, not effort", sort_order: 3 },
    ],
  },
  {
    name: "SaaS Scale Team",
    industry: "saas",
    goal: "scale-sales",
    company_size: "11-50",
    description: "Scale SaaS revenue with data-driven sales and growth processes",
    agents: [
      { agent_slug: "sales-pipeline-analyst", role: "Builds pipeline health diagnostics", first_task: "Implement pipeline velocity dashboard with stage-level win rates", sort_order: 0 },
      { agent_slug: "marketing-growth-hacker", role: "Designs product-led growth loops", first_task: "Map viral loop and identify 3 activation experiments", sort_order: 1 },
      { agent_slug: "product-sprint-prioritizer", role: "Balances growth vs product investment", first_task: "Create dual-track roadmap for growth and core product", sort_order: 2 },
      { agent_slug: "support-analytics-reporter", role: "Tracks cohort metrics and churn signals", first_task: "Build weekly cohort retention report with churn predictors", sort_order: 3 },
      { agent_slug: "support-finance-tracker", role: "Monitors SaaS unit economics", first_task: "Calculate MRR, NDR, CAC payback, and burn rate dashboard", sort_order: 4 },
    ],
  },
  {
    name: "SaaS Enterprise Team",
    industry: "saas",
    goal: "scale-sales",
    company_size: "50+",
    description: "Enterprise SaaS sales with complex deal management and strategic accounts",
    agents: [
      { agent_slug: "engineering-software-architect", role: "Ensures platform handles enterprise scale", first_task: "Audit infrastructure for SOC 2, multi-tenancy, and SLAs", sort_order: 0 },
      { agent_slug: "project-manager-senior", role: "Manages cross-functional enterprise deployments", first_task: "Create enterprise onboarding playbook with 30/60/90 day plan", sort_order: 1 },
      { agent_slug: "sales-pipeline-analyst", role: "Analyzes enterprise pipeline and forecast accuracy", first_task: "Implement MEDDPICC scoring for all enterprise opportunities", sort_order: 2 },
      { agent_slug: "sales-deal-strategist", role: "Builds competitive win strategies for key deals", first_task: "Map decision committee for top 5 open enterprise deals", sort_order: 3 },
      { agent_slug: "support-analytics-reporter", role: "Tracks enterprise KPIs and expansion metrics", first_task: "Build account health dashboard with NPS and usage signals", sort_order: 4 },
    ],
  },

  // ── Real Estate ──
  {
    name: "Real Estate Sales Team",
    industry: "real-estate",
    goal: "scale-sales",
    company_size: null,
    description: "Optimize real estate sales pipeline and client relationship management",
    agents: [
      { agent_slug: "sales-pipeline-analyst", role: "Tracks listing-to-close pipeline health", first_task: "Map lead-to-close funnel with conversion rates by source", sort_order: 0 },
      { agent_slug: "sales-outbound-strategist", role: "Designs prospecting sequences for new listings", first_task: "Build neighborhood farming outreach sequence", sort_order: 1 },
      { agent_slug: "sales-deal-strategist", role: "Strategies for competitive listings and negotiations", first_task: "Create pricing strategy template for different market conditions", sort_order: 2 },
      { agent_slug: "sales-account-strategist", role: "Manages long-term client relationships", first_task: "Set up quarterly check-in cadence for past clients", sort_order: 3 },
    ],
  },
  {
    name: "Real Estate Marketing Team",
    industry: "real-estate",
    goal: "grow-marketing",
    company_size: null,
    description: "Grow real estate brand with local SEO and visual content",
    agents: [
      { agent_slug: "marketing-growth-hacker", role: "Designs local lead generation strategy", first_task: "Set up Google Business Profile optimization and review strategy", sort_order: 0 },
      { agent_slug: "marketing-content-creator", role: "Creates neighborhood and market content", first_task: "Write 5 neighborhood spotlight articles for target areas", sort_order: 1 },
      { agent_slug: "marketing-seo-specialist", role: "Dominates local real estate searches", first_task: "Optimize for '[city] homes for sale' and related long-tail", sort_order: 2 },
      { agent_slug: "design-brand-guardian", role: "Maintains premium brand across all touchpoints", first_task: "Standardize listing photo guidelines and brand templates", sort_order: 3 },
    ],
  },

  // ── Restaurant ──
  {
    name: "Restaurant Launch Team",
    industry: "restaurant",
    goal: "launch-mvp",
    company_size: "1-10",
    description: "Launch restaurant digital presence with online ordering and marketing",
    agents: [
      { agent_slug: "engineering-rapid-prototyper", role: "Sets up online ordering and booking system", first_task: "Deploy ordering system with menu, cart, and payment", sort_order: 0 },
      { agent_slug: "support-support-responder", role: "Automates reservation and inquiry handling", first_task: "Set up automated reservation confirmations and FAQ bot", sort_order: 1 },
      { agent_slug: "marketing-growth-hacker", role: "Drives initial foot traffic and online orders", first_task: "Design opening week promotion with social + local ads", sort_order: 2 },
      { agent_slug: "support-finance-tracker", role: "Tracks food cost ratios and revenue per seat", first_task: "Build weekly P&L template for restaurant operations", sort_order: 3 },
    ],
  },

  // ── Tourism ──
  {
    name: "Tourism Growth Team",
    industry: "tourism",
    goal: "grow-marketing",
    company_size: null,
    description: "Grow tourism business with content-driven marketing and visual storytelling",
    agents: [
      { agent_slug: "marketing-growth-hacker", role: "Designs seasonal marketing campaigns", first_task: "Plan Q3 peak season campaign with 5 channel strategy", sort_order: 0 },
      { agent_slug: "marketing-content-creator", role: "Creates destination and experience content", first_task: "Write 10 destination guides with SEO-optimized copy", sort_order: 1 },
      { agent_slug: "engineering-rapid-prototyper", role: "Builds booking and experience platform", first_task: "Set up booking flow with availability calendar", sort_order: 2 },
      { agent_slug: "design-brand-guardian", role: "Ensures immersive, on-brand visual identity", first_task: "Create photo style guide for destination photography", sort_order: 3 },
    ],
  },

  // ── General (Fallback) ──
  {
    name: "General MVP Team",
    industry: "general",
    goal: "launch-mvp",
    company_size: "1-10",
    description: "A versatile team for launching any MVP quickly with quality guardrails",
    agents: [
      { agent_slug: "engineering-rapid-prototyper", role: "Builds the core MVP fast", first_task: "Deliver working prototype of primary user flow in 5 days", sort_order: 0 },
      { agent_slug: "product-sprint-prioritizer", role: "Ensures only high-value features make the cut", first_task: "Stack-rank feature backlog by validation signal strength", sort_order: 1 },
      { agent_slug: "support-finance-tracker", role: "Keeps budget and runway in check", first_task: "Create burn rate projection for first 90 days", sort_order: 2 },
      { agent_slug: "testing-reality-checker", role: "Validates assumptions and catches blind spots", first_task: "Challenge top 3 assumptions with evidence-based review", sort_order: 3 },
    ],
  },
  {
    name: "General Growth Team",
    industry: "general",
    goal: "grow-marketing",
    company_size: null,
    description: "A growth-focused team for scaling marketing across any industry",
    agents: [
      { agent_slug: "marketing-growth-hacker", role: "Architects the growth strategy", first_task: "Identify top 3 growth channels and design experiments", sort_order: 0 },
      { agent_slug: "marketing-seo-specialist", role: "Drives organic traffic growth", first_task: "Run full SEO audit and build keyword opportunity map", sort_order: 1 },
      { agent_slug: "marketing-content-creator", role: "Creates content that converts", first_task: "Build 30-day content calendar aligned to buyer journey", sort_order: 2 },
      { agent_slug: "support-analytics-reporter", role: "Tracks growth metrics and experiment results", first_task: "Set up growth dashboard with channel attribution", sort_order: 3 },
    ],
  },
  {
    name: "General Sales Team",
    industry: "general",
    goal: "scale-sales",
    company_size: null,
    description: "A data-driven sales team for scaling revenue in any industry",
    agents: [
      { agent_slug: "sales-pipeline-analyst", role: "Diagnoses pipeline health and forecast accuracy", first_task: "Map current pipeline with velocity and stage conversion rates", sort_order: 0 },
      { agent_slug: "sales-outbound-strategist", role: "Designs outbound prospecting sequences", first_task: "Define ICP and build 5-touch outreach sequence", sort_order: 1 },
      { agent_slug: "sales-deal-strategist", role: "Builds win strategies for complex deals", first_task: "Score top 10 open opportunities on MEDDPICC criteria", sort_order: 2 },
      { agent_slug: "support-finance-tracker", role: "Tracks revenue metrics and unit economics", first_task: "Build ACV, CAC, and quota attainment dashboard", sort_order: 3 },
    ],
  },
  {
    name: "General Operations Team",
    industry: "general",
    goal: "reduce-costs",
    company_size: null,
    description: "An operations team for reducing costs through automation and efficiency",
    agents: [
      { agent_slug: "support-analytics-reporter", role: "Identifies waste and efficiency opportunities", first_task: "Analyze operational spend and flag top 5 cost reduction areas", sort_order: 0 },
      { agent_slug: "support-finance-tracker", role: "Tracks cost savings and budget impact", first_task: "Build cost reduction tracking dashboard with monthly targets", sort_order: 1 },
      { agent_slug: "project-management-project-shepherd", role: "Manages optimization projects", first_task: "Prioritize efficiency projects by ROI and implementation speed", sort_order: 2 },
      { agent_slug: "support-support-responder", role: "Automates routine support and internal processes", first_task: "Identify top 10 automatable workflows with time-saved estimates", sort_order: 3 },
    ],
  },
];

// ── Main ──
async function main() {
  console.log(`[seed-templates] Seeding ${TEMPLATES.length} team templates...`);

  // Clear existing templates (cascade deletes junction rows)
  const { error: delErr } = await supabase
    .from("agent_team_templates")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all
  if (delErr) console.log(`[seed-templates] Clear warning: ${delErr.message}`);

  let templatesCreated = 0;
  let agentsLinked = 0;

  for (const tmpl of TEMPLATES) {
    // Insert template
    const { data: inserted, error: tmplErr } = await supabase
      .from("agent_team_templates")
      .insert({
        name: tmpl.name,
        industry: tmpl.industry,
        goal: tmpl.goal,
        company_size: tmpl.company_size,
        description: tmpl.description,
        is_active: true,
      })
      .select("id")
      .single();

    if (tmplErr || !inserted) {
      console.error(`[seed-templates] Failed to insert ${tmpl.name}: ${tmplErr?.message}`);
      continue;
    }

    templatesCreated++;

    // Insert junction rows
    const junctionRows = tmpl.agents.map((a) => ({
      template_id: inserted.id,
      agent_slug: a.agent_slug,
      role: a.role,
      first_task: a.first_task,
      sort_order: a.sort_order,
    }));

    const { error: jErr } = await supabase
      .from("agent_team_templates_agents")
      .insert(junctionRows);

    if (jErr) {
      console.error(`[seed-templates] Failed to link agents for ${tmpl.name}: ${jErr.message}`);
    } else {
      agentsLinked += junctionRows.length;
    }
  }

  console.log(`[seed-templates] Created ${templatesCreated} templates, linked ${agentsLinked} agent roles`);

  // Verify
  const { data: verify } = await supabase
    .from("agent_team_templates")
    .select("name, industry, goal, company_size");

  console.log("\n[seed-templates] Templates in database:");
  for (const t of verify || []) {
    console.log(`  ${t.name} (${t.industry}/${t.goal}${t.company_size ? `/${t.company_size}` : ""})`);
  }

  console.log("\n[seed-templates] Done!");
}

main().catch((e) => {
  console.error("[seed-templates] Fatal error:", e);
  process.exit(1);
});
