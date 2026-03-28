#!/usr/bin/env npx tsx
// parse-agents.ts — Scan agency/ dir, parse agent .md files,
// upsert into agent_catalog table, generate agent-index.json.
// Usage: npx tsx scripts/parse-agents.ts
// Requires: VITE_SUPABASE_URL + SUPABASE_SECRET_KEY in .env.local

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load .env.local manually (no dotenv dependency)
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

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const AGENCY_DIR = path.resolve(__dirname, "../agency");
const OUTPUT_PATH = path.resolve(__dirname, "../src/lib/data/agent-index.json");

// ── Curated agent list (broadly applicable, high-quality methodology) ──
const CURATED_SLUGS = new Set([
  "engineering-rapid-prototyper",
  "engineering-software-architect",
  "engineering-frontend-developer",
  "sales-pipeline-analyst",
  "sales-discovery-coach",
  "sales-deal-strategist",
  "marketing-growth-hacker",
  "marketing-content-creator",
  "marketing-seo-specialist",
  "design-brand-guardian",
  "design-ui-designer",
  "product-sprint-prioritizer",
  "project-management-project-shepherd",
  "project-manager-senior",
  "testing-reality-checker",
  "support-analytics-reporter",
  "support-finance-tracker",
  "specialized-security-engineer",
]);

// ── Tag derivation keywords ──
const INDUSTRY_TAGS: Record<string, string[]> = {
  healthcare: ["health", "medical", "clinical", "hipaa", "patient"],
  "e-commerce": ["commerce", "cart", "checkout", "shopify", "retail", "store"],
  saas: ["saas", "subscription", "recurring", "churn", "onboarding"],
  fintech: ["finance", "banking", "payment", "trading", "fintech"],
  restaurant: ["restaurant", "food", "menu", "reservation", "dining"],
  "real-estate": ["real estate", "property", "listing", "mortgage"],
  education: ["education", "learning", "student", "course", "curriculum"],
  gaming: ["game", "gaming", "player", "level", "gameplay"],
};

const GOAL_TAGS: Record<string, string[]> = {
  mvp: ["mvp", "prototype", "proof of concept", "poc", "rapid"],
  growth: ["growth", "scale", "acquisition", "viral", "funnel"],
  sales: ["sales", "pipeline", "deal", "revenue", "forecast", "crm"],
  automation: ["automat", "workflow", "process", "efficiency"],
  compliance: ["compliance", "audit", "regulation", "policy", "security"],
  analytics: ["analytics", "data", "metric", "dashboard", "insight", "report"],
  content: ["content", "copy", "editorial", "blog", "social media"],
  "project-management": ["project", "sprint", "agile", "kanban", "roadmap"],
};

// ── Frontmatter parser ──
function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const fm: Record<string, string> = {};
  const lines = match[1].split("\n");

  for (const line of lines) {
    const kv = line.match(/^(\w[\w-]*):\s*(.+)$/);
    if (kv) {
      fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
    }
  }

  return fm;
}

// ── Section parser ──
function parseSections(content: string): Record<string, string> {
  const sections: Record<string, string> = {};

  // Strip frontmatter
  const fmMatch = content.match(/^---\n[\s\S]*?\n---\n/);
  const body = fmMatch ? content.slice(fmMatch[0].length) : content;

  const lines = body.split("\n");
  let heading = "";
  let buf: string[] = [];

  for (const line of lines) {
    const hMatch = line.match(/^##\s+(.+)/);
    if (hMatch) {
      if (heading) {
        sections[heading] = buf.join("\n").trim();
      }
      // Clean heading: strip emoji and special chars
      heading = hMatch[1]
        .replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FEFF}]|[\u{1F900}-\u{1F9FF}]|[^\w\s&-]/gu, "")
        .trim();
      buf = [];
    } else {
      buf.push(line);
    }
  }

  if (heading) {
    sections[heading] = buf.join("\n").trim();
  }

  return sections;
}

// ── Tag derivation ──
function deriveTags(content: string, division: string): string[] {
  const lower = content.toLowerCase();
  const tags: Set<string> = new Set();

  // Division as tag
  tags.add(division);

  // Industry tags
  for (const [tag, keywords] of Object.entries(INDUSTRY_TAGS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      tags.add(tag);
    }
  }

  // Goal tags
  for (const [tag, keywords] of Object.entries(GOAL_TAGS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      tags.add(tag);
    }
  }

  return [...tags];
}

// ── Scan and parse all agent files ──
function scanAgents(): Array<{
  slug: string;
  name: string;
  description: string;
  division: string;
  emoji: string;
  color: string;
  vibe: string;
  file_path: string;
  line_count: number;
  tags: string[];
  sections: Record<string, string>;
  is_curated: boolean;
  is_active: boolean;
}> {
  const agents: ReturnType<typeof scanAgents> = [];
  const SKIP_DIRS = new Set([".github", "scripts", "examples"]);
  const divisions = fs
    .readdirSync(AGENCY_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !SKIP_DIRS.has(d.name))
    .map((d) => d.name);

  for (const division of divisions) {
    const divDir = path.join(AGENCY_DIR, division);
    const files = fs
      .readdirSync(divDir)
      .filter((f) => f.endsWith(".md") && f !== "README.md");

    for (const file of files) {
      const filePath = path.join(divDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const fm = parseFrontmatter(content);
      const slug = file.replace(/\.md$/, "");
      const sections = parseSections(content);
      const tags = deriveTags(content, division);

      agents.push({
        slug,
        name: fm.name || slug,
        description: fm.description || "",
        division,
        emoji: fm.emoji || "",
        color: fm.color || "#6B7280",
        vibe: fm.vibe || "",
        file_path: `agency/${division}/${file}`,
        line_count: content.split("\n").length,
        tags,
        sections,
        is_curated: CURATED_SLUGS.has(slug),
        is_active: true,
      });
    }
  }

  return agents;
}

// ── Generate agent-index.json ──
function generateIndex(
  agents: ReturnType<typeof scanAgents>
): void {
  const index = agents.map((a) => ({
    slug: a.slug,
    name: a.name,
    description: a.description,
    division: a.division,
    emoji: a.emoji,
    color: a.color,
    vibe: a.vibe,
    lineCount: a.line_count,
    isCurated: a.is_curated,
    tags: a.tags,
  }));

  // Ensure output directory exists
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2));
  console.log(`[parse-agents] Generated ${OUTPUT_PATH} (${index.length} agents)`);
}

// ── Upsert to agent_catalog ──
async function upsertCatalog(
  agents: ReturnType<typeof scanAgents>
): Promise<void> {
  // Upsert in batches of 20
  const BATCH_SIZE = 20;
  let upserted = 0;

  for (let i = 0; i < agents.length; i += BATCH_SIZE) {
    const batch = agents.slice(i, i + BATCH_SIZE);

    const { error } = await supabase.from("agent_catalog").upsert(
      batch.map((a) => ({
        slug: a.slug,
        name: a.name,
        description: a.description,
        division: a.division,
        emoji: a.emoji,
        color: a.color,
        vibe: a.vibe,
        file_path: a.file_path,
        line_count: a.line_count,
        tags: a.tags,
        sections: a.sections,
        is_curated: a.is_curated,
        is_active: a.is_active,
      })),
      { onConflict: "slug" }
    );

    if (error) {
      console.error(`[parse-agents] Upsert batch error: ${error.message}`);
    } else {
      upserted += batch.length;
    }
  }

  console.log(`[parse-agents] Upserted ${upserted}/${agents.length} agents into agent_catalog`);
}

// ── Main ──
async function main() {
  console.log("[parse-agents] Scanning agency/ directory...");
  const agents = scanAgents();
  console.log(`[parse-agents] Found ${agents.length} agents across ${new Set(agents.map((a) => a.division)).size} divisions`);

  const curated = agents.filter((a) => a.is_curated);
  console.log(`[parse-agents] ${curated.length} agents marked as curated`);

  // Generate static index
  generateIndex(agents);

  // Upsert to database
  await upsertCatalog(agents);

  // Summary
  const divCounts: Record<string, number> = {};
  for (const a of agents) {
    divCounts[a.division] = (divCounts[a.division] || 0) + 1;
  }
  console.log("\n[parse-agents] Division breakdown:");
  for (const [div, count] of Object.entries(divCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${div}: ${count} agents`);
  }

  console.log("\n[parse-agents] Done!");
}

main().catch((e) => {
  console.error("[parse-agents] Fatal error:", e);
  process.exit(1);
});
