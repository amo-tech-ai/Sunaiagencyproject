// S-AGENT-CATALOG — Edge function routes for Agent Catalog feature
// POST /agents/run     — Execute a catalog agent on a task via Gemini
// POST /agents/match   — Match agents to a client profile (industry, goals, size)
// GET  /agents/history — Fetch run history for a specific agent slug

import { Hono } from "npm:hono";
import { adminClient } from "./db.tsx";
import { callGemini, logAIRun } from "./gemini.tsx";
import { ensureAISchema } from "./ensure-schema.tsx";

const agents = new Hono();
const PREFIX = "/make-server-283466b6";

/* ── POST /agents/run ──────────────────────────────────────────────
   Execute a catalog agent on a task.
   Body: { slug, agentName, task, context?, format? }
   Returns: { output, tokens, durationMs }
   ────────────────────────────────────────────────────────────────── */
agents.post(`${PREFIX}/agents/run`, async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "Authorization required to run agents" }, 401);
    }

    const body = await c.req.json();
    const { slug, agentName, task, context, format } = body;

    if (!slug || !task) {
      return c.json(
        { error: "slug and task are required to run an agent" },
        400
      );
    }

    const outputFormat = format || "structured";

    // Build a system prompt that makes Gemini behave as this specific agent
    const systemPrompt = `You are "${agentName || slug}", a specialist AI agent at Sun AI Agency.
Your role is to execute tasks with expert-level quality, providing actionable, specific output.

OUTPUT FORMAT: ${outputFormat === "json" ? "Return valid JSON only." : outputFormat === "freeform" ? "Return natural prose." : "Return a well-structured report with clear headers, bullet points, and sections."}

RULES:
- Be specific and actionable — no vague advice
- Include concrete numbers, timelines, and costs when relevant
- Cite tools, frameworks, or methodologies by name
- Flag assumptions explicitly
- Keep output concise but thorough (aim for 300-800 words for structured, 200-500 for freeform)`;

    const userPrompt = `${context ? `CONTEXT:\n${context}\n\n` : ""}TASK:\n${task}`;

    const startMs = Date.now();

    const result = await callGemini(
      `agent-run:${slug}`,
      systemPrompt,
      userPrompt,
      { slug, task, context: context || "", format: outputFormat },
      undefined // no wizard session
    );

    const durationMs = Date.now() - startMs;

    // Convert result to string for the frontend
    let outputText: string;
    if (typeof result === "string") {
      outputText = result;
    } else if (
      typeof result === "object" &&
      result !== null &&
      "rawText" in (result as Record<string, unknown>)
    ) {
      outputText = (result as Record<string, unknown>).rawText as string;
    } else if (outputFormat === "json") {
      outputText = JSON.stringify(result, null, 2);
    } else {
      // For structured/freeform, try to extract text or stringify
      outputText = JSON.stringify(result, null, 2);
    }

    // Estimate tokens from response length (rough: ~4 chars per token)
    const estimatedTokens = Math.round(
      (systemPrompt.length + userPrompt.length + outputText.length) / 4
    );

    // Also log to ai_run_logs with agent-specific prompt_type
    // (callGemini already logs, but we add a second entry with the slug for catalog filtering)
    await logAgentRun({
      slug,
      agentName: agentName || slug,
      task,
      context: context || "",
      format: outputFormat,
      output: outputText,
      tokens: estimatedTokens,
      durationMs,
      success: true,
    });

    console.log(
      `[Agent] Run complete: ${slug} — ${durationMs}ms, ~${estimatedTokens} tokens`
    );

    return c.json({
      success: true,
      output: outputText,
      tokens: estimatedTokens,
      durationMs,
      model: "gemini-2.0-flash",
      cached: false,
    });
  } catch (error) {
    console.log(`[Agent] Run error: ${error}`);
    return c.json(
      { error: `Agent execution failed: ${error}`, fallback: true },
      500
    );
  }
});

/* ── POST /agents/match ────────────────────────────────────────────
   Match agents to a client profile.
   Body: { industry, goals[], companySize, systemIds[]? }
   Returns: { matches: [{ slug, name, reason, fitScore }] }
   ────────────────────────────────────────────────────────────────── */
agents.post(`${PREFIX}/agents/match`, async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json(
        { error: "Authorization required for agent matching" },
        401
      );
    }

    const body = await c.req.json();
    const { industry, goals, companySize, systemIds } = body;

    if (!industry) {
      return c.json({ error: "industry is required for agent matching" }, 400);
    }

    const systemPrompt = `You are the Agent Matching Engine at Sun AI Agency. Given a client profile, recommend the best AI agents from the catalog.

Available agents (slug | name | division):
- software-architect | Software Architect | Engineering
- rapid-prototyper | Rapid Prototyper | Engineering
- frontend-developer | Frontend Developer | Engineering
- backend-architect | Backend Architect | Engineering
- ai-engineer | AI Engineer | Engineering
- devops-automator | DevOps Automator | Engineering
- pipeline-analyst | Pipeline Analyst | Sales
- outbound-strategist | Outbound Strategist | Sales
- growth-hacker | Growth Hacker | Marketing
- content-creator | Content Creator | Marketing
- seo-specialist | SEO Specialist | Marketing
- brand-guardian | Brand Guardian | Design
- project-shepherd | Project Shepherd | PM
- reality-checker | Reality Checker | Testing
- support-responder | Support Responder | Support
- deal-strategist | Deal Strategist | Sales

Return a JSON array of 4-8 recommended agents, ordered by fit:
[
  {
    "slug": "agent-slug",
    "name": "Agent Name",
    "fitScore": 0.95,
    "reason": "One-sentence explanation of why this agent fits"
  }
]`;

    const userPrompt = `Client profile:
Industry: ${industry}
Goals: ${Array.isArray(goals) ? goals.join(", ") : goals || "Not specified"}
Company size: ${companySize || "Not specified"}
Selected systems: ${Array.isArray(systemIds) ? systemIds.join(", ") : "None selected"}

Recommend the best agents for this client.`;

    const result = await callGemini(
      "agents-match",
      systemPrompt,
      userPrompt,
      { industry, goals, companySize, systemIds },
      undefined
    );

    // Ensure result is an array
    let matches: unknown[];
    if (Array.isArray(result)) {
      matches = result;
    } else if (
      typeof result === "object" &&
      result !== null &&
      "matches" in (result as Record<string, unknown>)
    ) {
      matches = (result as Record<string, unknown>).matches as unknown[];
    } else {
      matches = [];
    }

    console.log(
      `[Agent] Match complete: ${matches.length} agents matched for ${industry}`
    );

    return c.json({ success: true, matches });
  } catch (error) {
    console.log(`[Agent] Match error: ${error}`);
    return c.json(
      { error: `Agent matching failed: ${error}`, fallback: true },
      500
    );
  }
});

/* ── GET /agents/history/:slug ─────────────────────────────────────
   Fetch run history for a specific agent from agent_catalog_runs
   stored in the kv_store.
   ────────────────────────────────────────────────────────────────── */
agents.get(`${PREFIX}/agents/history/:slug`, async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json(
        { error: "Authorization required for agent history" },
        401
      );
    }

    const slug = c.req.param("slug");
    const limit = parseInt(c.req.query("limit") || "20");

    await ensureAISchema();
    const db = adminClient();

    // Query ai_run_logs for this agent's runs (prompt_type = "agent-run:<slug>")
    const { data: runs, error } = await db
      .from("ai_run_logs")
      .select("*")
      .eq("prompt_type", `agent-run:${slug}`)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.log(`[Agent] History query error: ${error.message}`);
      return c.json(
        { error: `Failed to fetch agent history: ${error.message}` },
        500
      );
    }

    console.log(
      `[Agent] History for ${slug}: ${runs?.length || 0} runs found`
    );

    return c.json({ runs: runs || [] });
  } catch (error) {
    console.log(`[Agent] History error: ${error}`);
    return c.json({ error: `Agent history query failed: ${error}` }, 500);
  }
});

/* ── Helper: Log agent catalog run ──────────────────────────────── */
async function logAgentRun(params: {
  slug: string;
  agentName: string;
  task: string;
  context: string;
  format: string;
  output: string;
  tokens: number;
  durationMs: number;
  success: boolean;
  errorMessage?: string;
}): Promise<void> {
  try {
    await ensureAISchema();
    const db = adminClient();

    // Store in ai_run_logs with a catalog-specific prompt_type
    await db.from("ai_run_logs").insert({
      prompt_type: `agent-run:${params.slug}`,
      model: "gemini-2.0-flash",
      tokens_used: params.tokens,
      duration_ms: params.durationMs,
      success: params.success,
      error_message: params.errorMessage || null,
      // Store task + output in the session_id/org_id fields is not ideal,
      // but ai_run_logs doesn't have custom columns — we use the generic fields
      session_id: null,
      org_id: null,
    });
  } catch (e) {
    console.log(`[Agent] logAgentRun exception: ${e}`);
  }
}

export { agents };
