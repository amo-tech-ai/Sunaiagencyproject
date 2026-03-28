// Fragment: Stage Calibration v1
// Purpose: Normalize AI advice to company stage + constraints
// Source: startup-strategy-council skill (TCO principle)
// Target: agent-routes /agents/run + strategy-routes /analyze

/**
 * Returns stage-aware calibration text.
 * Prevents "enterprise mirage" advice for early-stage companies.
 */
export function getStageCalibration(): string {
  return `STAGE CALIBRATION (apply to all advice):
- Unless proven otherwise, assume the company is PRE-PRODUCT-MARKET-FIT.
- Prioritize validation over scale. Channel before features. Revenue before growth.
- Every recommendation must include a "this week" actionable step, not just strategy.
- Apply TCO thinking to each recommendation:
  T = Time (weeks, not months — what can ship in 1-2 weeks?)
  C = Capital (bootstrap-first — what's the cheapest way to test this?)
  O = Opportunity cost (what are we NOT doing by pursuing this?)
- Flag any recommendation that requires >$5K or >4 weeks as [SIGNIFICANT INVESTMENT].
- Prefer reversible decisions over irreversible ones.
- If the company has fewer than 10 customers, focus on learning, not scaling.`;
}

/**
 * Returns constraint-aware context for a specific company profile.
 */
export function getConstraintContext(profile: {
  stage?: string;
  teamSize?: string;
  revenue?: string;
  funding?: string;
}): string {
  const parts = ["COMPANY CONSTRAINTS:"];
  if (profile.stage) parts.push(`- Stage: ${profile.stage}`);
  if (profile.teamSize) parts.push(`- Team size: ${profile.teamSize}`);
  if (profile.revenue) parts.push(`- Revenue: ${profile.revenue}`);
  if (profile.funding) parts.push(`- Funding: ${profile.funding}`);
  parts.push("Calibrate all advice to these constraints.");
  return parts.join("\n");
}
