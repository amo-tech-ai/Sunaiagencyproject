// DEAL-SCORING — Deterministic deal health scoring utility
// Scores deals 0-100 based on pipeline signals. Assigns Pipeline Analyst
// or Deal Strategist as the scoring agent based on deal characteristics.
//
// Scoring formula:
//   Base score starts at 70
//   - Probability alignment: ±15 (does probability match stage position?)
//   - Recency: -5 to -25 (deals stale in early stages lose more)
//   - Value weight: +5 for high-value deals (they get more attention)
//   - Contact coverage: +5 if contact assigned, -10 if missing
//   - Notes coverage: +3 if notes present
//
// Scoring agent selection:
//   - Pipeline Analyst: default, focuses on pipeline velocity + lead quality
//   - Deal Strategist: assigned to deals in negotiation/proposal stages (late-pipeline)

import type { Deal, Stage } from './types/crm-pipeline';

interface ScoredDeal extends Deal {
  healthScore: number;
  healthLabel: 'HIGH' | 'MEDIUM' | 'LOW';
  healthInsight: string;
  scoringAgent: string;
}

/** Stage position as a fraction 0-1 (0 = first stage, 1 = last) */
function stageProgress(deal: Deal, stages: Stage[]): number {
  const sorted = [...stages].sort((a, b) => a.position - b.position);
  const idx = sorted.findIndex(s => s.id === deal.stage_id);
  if (idx < 0 || sorted.length <= 1) return 0;
  return idx / (sorted.length - 1);
}

/** Is this a late-pipeline stage (>60% through)? */
function isLatePipeline(deal: Deal, stages: Stage[]): boolean {
  return stageProgress(deal, stages) > 0.6;
}

/** Generate a contextual insight based on the scoring signals */
function generateInsight(deal: Deal, stages: Stage[], score: number): string {
  const progress = stageProgress(deal, stages);

  if (deal.isVeryStale && progress < 0.4) {
    return `Stale for ${deal.daysInStage}d in early pipeline — consider re-engaging or disqualifying.`;
  }
  if (deal.isVeryStale) {
    return `No activity for ${deal.daysInStage}d — high risk of going cold. Immediate follow-up recommended.`;
  }
  if (deal.isStale && progress > 0.5) {
    return `Deal stalled in late pipeline (${deal.daysInStage}d). Schedule decision-maker meeting.`;
  }
  if (deal.isStale) {
    return `${deal.daysInStage}d without movement. Send value-add touchpoint to re-engage.`;
  }
  if (!deal.contact_name && !deal.contact_email) {
    return 'No contact assigned — pipeline velocity drops 40% without a named champion.';
  }
  if (deal.probability >= 80 && progress < 0.5) {
    return 'High probability but early stage — validate: is the probability based on data or optimism?';
  }
  if (deal.probability <= 30 && progress > 0.6) {
    return 'Low probability in late pipeline — either commit to winning or free up capacity.';
  }
  if (score >= 80) {
    return 'Strong deal health. Maintain momentum with regular touchpoints.';
  }
  if (score >= 60) {
    return 'Moderate health — identify and address the top blocker this week.';
  }
  return 'Below-average health — review deal qualification and next steps urgently.';
}

/**
 * Score all deals in a pipeline using deterministic rules.
 * Returns deals with healthScore, healthLabel, healthInsight, and scoringAgent populated.
 */
export function scoreDeals(deals: Deal[], stages: Stage[]): ScoredDeal[] {
  return deals.map(deal => {
    let score = 70; // Base

    const progress = stageProgress(deal, stages);

    // 1. Probability alignment (±15)
    // Expected probability should roughly match stage progress
    const expectedProbability = Math.round(progress * 80 + 10); // 10% at start, 90% at end
    const probDelta = Math.abs(deal.probability - expectedProbability);
    if (probDelta <= 10) score += 10;
    else if (probDelta <= 25) score += 0;
    else score -= Math.min(15, Math.round(probDelta / 3));

    // 2. Recency penalty
    if (deal.isVeryStale) {
      score -= progress < 0.4 ? 25 : 20; // Worse in early stages
    } else if (deal.isStale) {
      score -= progress < 0.4 ? 15 : 10;
    } else if (deal.daysInStage <= 2) {
      score += 5; // Fresh movement bonus
    }

    // 3. Value weight
    if (deal.value >= 10000) score += 5;
    if (deal.value >= 50000) score += 3;

    // 4. Contact coverage
    if (deal.contact_name || deal.contact_email) {
      score += 5;
    } else {
      score -= 10;
    }

    // 5. Notes coverage
    if (deal.notes && deal.notes.length > 10) {
      score += 3;
    }

    // Clamp to 0-100
    score = Math.max(0, Math.min(100, score));

    // Determine health label
    const healthLabel: 'HIGH' | 'MEDIUM' | 'LOW' =
      score >= 70 ? 'HIGH' : score >= 45 ? 'MEDIUM' : 'LOW';

    // Assign scoring agent
    const scoringAgent = isLatePipeline(deal, stages)
      ? 'Deal Strategist'
      : 'Pipeline Analyst';

    // Generate insight
    const healthInsight = generateInsight(deal, stages, score);

    return {
      ...deal,
      healthScore: score,
      healthLabel,
      healthInsight,
      scoringAgent,
    };
  });
}

/**
 * Get aggregate pipeline health metrics
 */
export function getPipelineHealthSummary(scoredDeals: ScoredDeal[]) {
  if (scoredDeals.length === 0) {
    return { averageHealth: 0, atRiskCount: 0, healthyCount: 0, staleCount: 0, totalValue: 0 };
  }

  const totalHealth = scoredDeals.reduce((sum, d) => sum + d.healthScore, 0);
  return {
    averageHealth: Math.round(totalHealth / scoredDeals.length),
    atRiskCount: scoredDeals.filter(d => d.healthLabel === 'LOW').length,
    healthyCount: scoredDeals.filter(d => d.healthLabel === 'HIGH').length,
    staleCount: scoredDeals.filter(d => d.isStale || d.isVeryStale).length,
    totalValue: scoredDeals.reduce((sum, d) => sum + d.value, 0),
  };
}
