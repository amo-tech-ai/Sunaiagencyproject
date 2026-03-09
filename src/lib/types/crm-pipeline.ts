// T07-CRM-PIPELINE — TypeScript interfaces for CRM Pipeline Kanban
// Matches crm_pipelines, crm_stages, crm_deals, crm_interactions tables

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  is_default: boolean;
  created_at: string;
}

export interface Stage {
  id: string;
  pipeline_id: string;
  name: string;
  position: number;
  color: string;
  is_closed_won: boolean;
  is_closed_lost: boolean;
  // Computed on frontend
  dealCount: number;
  totalValue: number;
}

export interface Deal {
  id: string;
  pipeline_id: string;
  stage_id: string;
  title: string;
  value: number;
  probability: number;
  contact_id: string | null;
  client_id: string | null;
  session_id: string | null;
  expected_close_date: string | null;
  stage_changed_at: string;
  owner_id: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  contact_name?: string | null;
  contact_email?: string | null;
  client_name?: string | null;
  // Computed
  daysInStage: number;
  isStale: boolean;       // > 7 days
  isVeryStale: boolean;   // > 14 days
}

export interface DealDetail extends Deal {
  interactions: Interaction[];
  contact?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  } | null;
}

export interface Interaction {
  id: string;
  deal_id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  summary: string;
  created_by: string | null;
  created_at: string;
}

export interface ForecastDataPoint {
  month: string;
  weightedValue: number;
  dealCount: number;
}

export interface PipelineData {
  pipeline: Pipeline;
  stages: Stage[];
  deals: Deal[];
  forecast: ForecastDataPoint[];
}

export interface DealCreateInput {
  pipeline_id: string;
  stage_id: string;
  title: string;
  value: number;
  probability?: number;
  contact_id?: string;
  client_id?: string;
  expected_close_date?: string;
  notes?: string;
}

export interface InteractionCreateInput {
  deal_id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  summary: string;
}
