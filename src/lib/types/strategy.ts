// T14-STRATEGY — TypeScript interfaces for Lean Strategy Engine
// Matches lean_canvases, lean_canvas_versions, strategy_insights,
// automation_opportunities, strategy_recommendations, strategy_actions,
// strategy_budgets, strategy_roles, strategy_signals tables
// Pattern: follows /lib/types/crm-pipeline.ts

// ── Canvas Block Item ──
export interface CanvasBlockItem {
  id: string;
  text: string;
  source: 'manual' | 'ai';
  confidence?: number;       // 0-1
  updatedAt: string;
}

export type CanvasBlockKey =
  | 'problem' | 'customer_segments' | 'value_proposition' | 'solution'
  | 'channels' | 'revenue_streams' | 'cost_structure' | 'key_metrics'
  | 'unfair_advantage';

export const CANVAS_BLOCK_LABELS: Record<CanvasBlockKey, string> = {
  problem: 'Problem',
  customer_segments: 'Customer Segments',
  value_proposition: 'Unique Value Proposition',
  solution: 'Solution',
  channels: 'Channels',
  revenue_streams: 'Revenue Streams',
  cost_structure: 'Cost Structure',
  key_metrics: 'Key Metrics',
  unfair_advantage: 'Unfair Advantage',
};

export const CANVAS_BLOCK_DESCRIPTIONS: Record<CanvasBlockKey, string> = {
  problem: 'Top problems worth solving',
  customer_segments: 'Target customers and users',
  value_proposition: 'Clear message that states why you are different',
  solution: 'Top features or capabilities',
  channels: 'Path to reach customers',
  revenue_streams: 'Revenue model and pricing',
  cost_structure: 'Customer acquisition, distribution, hosting costs',
  key_metrics: 'Key activities you measure',
  unfair_advantage: 'Something that cannot easily be copied',
};

// ── Lean Canvas ──
export interface LeanCanvas {
  id: string;
  session_id: string | null;
  project_id: string | null;
  user_id: string | null;
  version: number;
  is_current: boolean;
  problem: CanvasBlockItem[];
  customer_segments: CanvasBlockItem[];
  value_proposition: CanvasBlockItem[];
  solution: CanvasBlockItem[];
  channels: CanvasBlockItem[];
  revenue_streams: CanvasBlockItem[];
  cost_structure: CanvasBlockItem[];
  key_metrics: CanvasBlockItem[];
  unfair_advantage: CanvasBlockItem[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CanvasVersion {
  id: string;
  canvas_id: string;
  version: number;
  snapshot: Record<string, unknown>;
  change_summary: string | null;
  changed_by: string | null;
  created_at: string;
}

// ── Insights ──
export type InsightType = 'opportunity' | 'risk' | 'recommendation' | 'trend';
export type InsightStatus = 'draft' | 'approved' | 'dismissed' | 'acted_on';

export interface StrategyInsight {
  id: string;
  canvas_id: string | null;
  session_id: string | null;
  agent_name: string;
  insight_type: InsightType;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact_score: number | null;
  confidence: number | null;
  data_sources: string[];
  status: InsightStatus;
  action_taken: string | null;
  created_at: string;
  expires_at: string | null;
}

// ── Automation Opportunities ──
export type OpportunityStatus = 'detected' | 'evaluating' | 'approved' | 'in_progress' | 'completed' | 'dismissed';

export interface AutomationOpportunity {
  id: string;
  canvas_id: string | null;
  session_id: string | null;
  title: string;
  description: string;
  process_area: string | null;
  current_state: string | null;
  proposed_state: string | null;
  impact_score: number;
  roi_estimate: string | null;
  complexity: 'low' | 'medium' | 'high';
  estimated_weeks: number | null;
  estimated_cost: string | null;
  recommended_system: string | null;
  status: OpportunityStatus;
  created_at: string;
  updated_at: string;
}

// ── Recommendations ──
export type RecommendationType = 'canvas_update' | 'roadmap_change' | 'new_system' | 'task_creation' | 'metric_alert';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'auto_approved' | 'archived';

export interface StrategyRecommendation {
  id: string;
  canvas_id: string | null;
  session_id: string | null;
  agent_name: string;
  recommendation_type: RecommendationType;
  title: string;
  rationale: string;
  proposed_changes: Record<string, unknown>;
  approval_status: ApprovalStatus;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
}

// ── Actions (Audit Log) ──
export interface StrategyAction {
  id: string;
  canvas_id: string | null;
  session_id: string | null;
  agent_name: string;
  action_type: string;
  input_summary: string | null;
  output_summary: string | null;
  tokens_used: number;
  duration_ms: number;
  success: boolean;
  error_message: string | null;
  created_at: string;
}

// ── Signals ──
export interface StrategySignal {
  id: string;
  canvas_id: string | null;
  signal_category: string;
  signal_name: string;
  value: number;
  previous_value: number | null;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  source: string | null;
  collected_at: string;
}

// ── Budget ──
export interface StrategyBudget {
  id: string;
  canvas_id: string;
  monthly_token_limit: number;
  tokens_used_this_month: number;
  analysis_count_this_month: number;
  max_analyses_per_day: number;
  analyses_today: number;
  last_analysis_at: string | null;
  min_analysis_interval_minutes: number;
  budget_month: string | null;
  created_at: string;
  updated_at: string;
}

// ── Aggregate Metrics ──
export interface StrategyMetrics {
  healthScore: number;
  healthBreakdown: {
    strategyClarity: number;
    aiReadiness: number;
    pipelineHealth: number;
    automationProgress: number;
    revenueTrajectory: number;
    operationalEfficiency: number;
    engagementQuality: number;
    strategyFreshness: number;
  };
  automationCoverage: number;
  insightCount: number;
  pendingApprovals: number;
  pendingSignals: number;
  opportunitiesDetected: number;
  totalROIEstimate: string;
  canvasCompleteness: number;
  tokenBudgetUsed: number;
  tokenBudgetRemaining: number;
}

// ── Dashboard Aggregate ──
export interface StrategyDashboardData {
  canvas: LeanCanvas | null;
  insights: StrategyInsight[];
  opportunities: AutomationOpportunity[];
  recommendations: StrategyRecommendation[];
  recentActions: StrategyAction[];
  metrics: StrategyMetrics;
}

// ── AI Response Types ──
export interface StrategyAnalysisResponse {
  insights: StrategyInsight[];
  opportunities: AutomationOpportunity[];
  recommendations: StrategyRecommendation[];
  metrics: StrategyMetrics;
  agentResults: {
    agent: string;
    duration_ms: number;
    tokens_used: number;
    success: boolean;
    summary: string;
    error?: string;
  }[];
}

export interface BlockSynthesisResponse {
  suggestions: CanvasBlockItem[];
  rationale: string;
}
