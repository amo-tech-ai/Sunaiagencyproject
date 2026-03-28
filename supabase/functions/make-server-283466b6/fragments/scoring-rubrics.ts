// Fragment: Scoring Rubrics v1
// Purpose: Deterministic scoring frameworks for validators + strategy engine
// Source: validation-scoring, idea-validator, ai-startup-strategist skills
// Target: strategy-routes /analyze, insight generation

/**
 * PCV (Perceived Created Value) scoring rubric.
 * 0-24 scale across 3 dimensions, each 0-8.
 * LLM extracts factor scores; CODE computes totals.
 */
export function getPCVScoringPrompt(): string {
  return `SCORING FRAMEWORK — PCV (Perceived Created Value):
Score each dimension 0-8:

PROBLEM (0-8):
  0-2: Nice-to-have, vague pain
  3-5: Real pain but workarounds exist
  6-8: Hair-on-fire problem, no good alternatives

CUSTOMER (0-8):
  0-2: Unclear who, hard to reach
  3-5: Identifiable but broad segment
  6-8: Specific, reachable, budget-holding ICP

VALUE (0-8):
  0-2: Marginal improvement, unclear ROI
  3-5: Measurable benefit, competitive pricing
  6-8: 10x improvement, obvious payback

Return scores as: { problem: N, customer: N, value: N }
Do NOT compute the total — the system will calculate it.`;
}

/** Compute PCV verdict from extracted scores (deterministic) */
export function computePCVVerdict(scores: { problem: number; customer: number; value: number }): {
  total: number;
  verdict: "kill" | "refine" | "pursue" | "build";
} {
  const total = scores.problem + scores.customer + scores.value;
  if (total <= 8) return { total, verdict: "kill" };
  if (total <= 14) return { total, verdict: "refine" };
  if (total <= 19) return { total, verdict: "pursue" };
  return { total, verdict: "build" };
}

/**
 * Opportunity Matrix scoring (/30).
 * 6 dimensions, each 1-5.
 */
export function getOpportunityMatrixPrompt(): string {
  return `SCORING FRAMEWORK — Opportunity Matrix (1-5 each, /30 total):

1. MARKET SIZE: How large is the addressable market?
2. URGENCY: How urgently do customers need this solved?
3. WILLINGNESS TO PAY: Evidence of budget/spend in this area?
4. COMPETITION: How crowded is the space? (5 = wide open)
5. FOUNDER FIT: Does the team have relevant expertise?
6. AI ADVANTAGE: Can AI provide a defensible edge?

Return scores as: { market: N, urgency: N, wtp: N, competition: N, fit: N, ai: N }
Do NOT compute the total.`;
}

/** Compute opportunity rank from extracted scores (deterministic) */
export function computeOpportunityRank(scores: Record<string, number>): {
  total: number;
  rank: "pass" | "consider" | "strong" | "exceptional";
} {
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  if (total <= 12) return { total, rank: "pass" };
  if (total <= 18) return { total, rank: "consider" };
  if (total <= 24) return { total, rank: "strong" };
  return { total, rank: "exceptional" };
}
