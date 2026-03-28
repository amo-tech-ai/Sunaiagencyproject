// Fragment: Honesty Protocol v1
// Purpose: Prevent hallucinated metrics; force labeling of assumptions
// Target: All Gemini calls (agent catalog, strategy, insights, wizard AI)
// Max: ~30 lines of prompt text

/**
 * Returns the honesty protocol prompt text.
 * Inject into Layer 1 (baseInstructions) of compilePrompt
 * or prepend to any system prompt.
 */
export function getHonestyProtocol(): string {
  return `HONESTY PROTOCOL (mandatory for all outputs):
- Never invent numbers, statistics, or metrics. If you estimate, mark with [ESTIMATE].
- Never state assumptions as facts. Label each assumption with [ASSUMPTION].
- When you don't have enough data to answer, say so explicitly in an "unknowns" field.
- If referencing external benchmarks or industry data, note [KNOWLEDGE-BASED — verify independently].
- All projections must include the basis (e.g., "based on 3-month average of $X").
- When giving financial figures, specify whether they are monthly, annual, or one-time.
- Do not inflate metrics to make recommendations sound better.
- If a recommendation requires information you don't have, list what's needed in "evidence_gaps".`;
}

/**
 * Returns structured output fields to append to any JSON schema
 * that needs honesty metadata.
 */
export function getHonestyFields(): string {
  return `"assumptions": ["list of assumptions made (if any)"],
"unknowns": ["list of things that could not be determined from available data"],
"confidence": "high|medium|low (based on data quality)"`;
}
