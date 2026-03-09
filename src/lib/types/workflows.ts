// T-WORKFLOWS — TypeScript interfaces for Phase 11: Workflow Automation
// Triggers, conditions, actions, executions, metrics, templates

export type TriggerType =
  | 'wizard_completed'
  | 'deal_stage_changed'
  | 'milestone_approaching'
  | 'cron_schedule'
  | 'manual_trigger';

export type ActionType =
  | 'create_project'
  | 'create_deal'
  | 'send_notification'
  | 'log_activity'
  | 'generate_document'
  | 'update_record';

export type ConditionOperator = 'equals' | 'contains' | 'greater_than' | 'is_not_null';
export type WorkflowStatus = 'enabled' | 'disabled' | 'error';

export interface WorkflowTrigger {
  type: TriggerType;
  source: string;
  field: string;
  cron_expression?: string; // for cron_schedule type
}

export interface WorkflowCondition {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: string;
}

export interface WorkflowAction {
  id: string;
  type: ActionType;
  target: string;
  field_mappings: Record<string, string>;
  order: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  status: WorkflowStatus;
  last_run_at: string | null;
  success_count: number;
  fail_count: number;
  created_at: string;
  updated_at: string;
}

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  workflow_name: string;
  status: 'success' | 'failed' | 'skipped';
  duration_ms: number;
  trigger_data: Record<string, unknown>;
  action_results: { action_type: string; success: boolean; detail: string }[];
  error_message: string | null;
  is_dry_run: boolean;
  created_at: string;
}

export interface WorkflowMetrics {
  runs_today: number;
  runs_today_trend: number;
  success_rate: number;
  success_rate_trend: number;
  avg_execution_ms: number;
  active_count: number;
  total_count: number;
}

export interface WorkflowCreateInput {
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
}

// Pre-built templates
export const WORKFLOW_TEMPLATES: Omit<Workflow, 'id' | 'last_run_at' | 'success_count' | 'fail_count' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'Wizard Complete \u2192 Project Setup',
    description: 'When a wizard session completes, automatically create a project, generate roadmap phases, and insert a CRM deal.',
    trigger: { type: 'wizard_completed', source: 'wizard_sessions', field: 'completed_at' },
    conditions: [{ id: 'c1', field: 'status', operator: 'equals', value: 'complete' }],
    actions: [
      { id: 'a1', type: 'create_project', target: 'projects', field_mappings: { name: 'wizard_answers.company_name' }, order: 1 },
      { id: 'a2', type: 'create_deal', target: 'crm_deals', field_mappings: { value: 'investment_tier' }, order: 2 },
      { id: 'a3', type: 'log_activity', target: 'activities', field_mappings: { action: 'project_created' }, order: 3 },
    ],
    status: 'disabled',
  },
  {
    name: 'Deal Stage Change \u2192 Notify',
    description: 'When a deal moves to a new stage, send a notification to the deal owner and log an interaction.',
    trigger: { type: 'deal_stage_changed', source: 'crm_deals', field: 'stage_id' },
    conditions: [],
    actions: [
      { id: 'a1', type: 'send_notification', target: 'notifications', field_mappings: { message: 'Deal moved to {{stage_name}}' }, order: 1 },
      { id: 'a2', type: 'log_activity', target: 'crm_interactions', field_mappings: { type: 'note', notes: 'Stage changed' }, order: 2 },
    ],
    status: 'disabled',
  },
  {
    name: 'Milestone Due \u2192 Alert',
    description: 'Daily check at 9am for milestones due within 3 days. Sends email alert to project owner.',
    trigger: { type: 'cron_schedule', source: 'milestones', field: 'due_date', cron_expression: '0 9 * * *' },
    conditions: [{ id: 'c1', field: 'days_until_due', operator: 'greater_than', value: '0' }],
    actions: [
      { id: 'a1', type: 'send_notification', target: 'notifications', field_mappings: { message: 'Milestone {{name}} due in {{days}} days' }, order: 1 },
    ],
    status: 'disabled',
  },
  {
    name: 'Weekly Report',
    description: 'Every Sunday at 9am, aggregate activities, AI logs, wizard sessions, and payments into a summary report.',
    trigger: { type: 'cron_schedule', source: 'system', field: 'weekly', cron_expression: '0 9 * * 0' },
    conditions: [],
    actions: [
      { id: 'a1', type: 'generate_document', target: 'documents', field_mappings: { template: 'weekly_report' }, order: 1 },
      { id: 'a2', type: 'send_notification', target: 'notifications', field_mappings: { message: 'Weekly report generated' }, order: 2 },
    ],
    status: 'disabled',
  },
  {
    name: 'Lead Qualification',
    description: 'When a new wizard session is created, score the lead based on Step 1 answers and route high-value leads to a senior consultant.',
    trigger: { type: 'wizard_completed', source: 'wizard_sessions', field: 'created_at' },
    conditions: [{ id: 'c1', field: 'investment_tier', operator: 'greater_than', value: '25000' }],
    actions: [
      { id: 'a1', type: 'update_record', target: 'crm_deals', field_mappings: { priority: 'high', assigned_to: 'senior_consultant' }, order: 1 },
      { id: 'a2', type: 'send_notification', target: 'notifications', field_mappings: { message: 'High-value lead qualified' }, order: 2 },
    ],
    status: 'disabled',
  },
];

// Trigger type labels
export const TRIGGER_LABELS: Record<TriggerType, string> = {
  wizard_completed: 'Wizard Completed',
  deal_stage_changed: 'Deal Stage Changed',
  milestone_approaching: 'Milestone Approaching',
  cron_schedule: 'Scheduled (Cron)',
  manual_trigger: 'Manual Trigger',
};

// Action type labels
export const ACTION_LABELS: Record<ActionType, string> = {
  create_project: 'Create Project',
  create_deal: 'Create Deal',
  send_notification: 'Send Notification',
  log_activity: 'Log Activity',
  generate_document: 'Generate Document',
  update_record: 'Update Record',
};
