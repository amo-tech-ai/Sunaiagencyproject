-- =============================================================================
-- Migration 019: Data Integrity Constraints
-- Applied to production: 2026-03-07
-- Audit ref: /tasks/audit/01-supabase-audit-report.md
-- Prompt ref: /tasks/prompts/019-data-integrity-constraints.md
--
-- Purpose: Replace narrow CHECK constraints with wider ones that include all
-- existing production data values plus reasonable future values. Covers status,
-- role, lifecycle_stage, and pipeline_stage columns across 11 tables.
-- =============================================================================

begin;

-- ============================================================
-- part 1: remove old narrow check constraints (replaced by wider ones)
-- ============================================================

alter table briefs drop constraint if exists briefs_status_check;
alter table clients drop constraint if exists clients_status_check;
alter table clients drop constraint if exists clients_lifecycle_stage_check;
alter table clients drop constraint if exists clients_pipeline_stage_check;
alter table crm_deals drop constraint if exists crm_deals_status_check;
alter table deliverables drop constraint if exists deliverables_status_check;
alter table invoices drop constraint if exists invoices_status_check;
alter table milestones drop constraint if exists milestones_status_check;
alter table payments drop constraint if exists payments_status_check;
alter table projects drop constraint if exists projects_status_check;
alter table tasks drop constraint if exists tasks_status_check;
alter table tasks drop constraint if exists tasks_priority_check;
alter table team_members drop constraint if exists team_members_role_check;

-- ============================================================
-- part 2: add wider check constraints covering all existing data + future values
-- ============================================================

-- clients
alter table clients add constraint chk_clients_status
  check (status in ('active','inactive','prospect','churned','client','lead'));
alter table clients add constraint chk_clients_lifecycle_stage
  check (lifecycle_stage in ('lead','marketing_qualified','sales_qualified','prospect','onboarding','customer','active','at_risk','churned'));
alter table clients add constraint chk_clients_pipeline_stage
  check (pipeline_stage in ('new','qualified','proposal','negotiation','won','lost','closed_won','closed_lost'));

-- projects
alter table projects add constraint chk_projects_status
  check (status in ('draft','planning','active','on_hold','completed','cancelled','Active','Discovery','discovery'));

-- tasks
alter table tasks add constraint chk_tasks_status
  check (status in ('todo','in_progress','review','done','blocked'));
alter table tasks add constraint chk_tasks_priority
  check (priority in ('low','medium','high','urgent'));

-- briefs
alter table briefs add constraint chk_briefs_status
  check (status in ('draft','in_review','approved'));

-- invoices
alter table invoices add constraint chk_invoices_status
  check (status in ('draft','sent','paid','overdue','cancelled','void'));

-- payments
alter table payments add constraint chk_payments_status
  check (status in ('pending','completed','failed','refunded'));

-- milestones
alter table milestones add constraint chk_milestones_status
  check (status in ('pending','in_progress','completed','upcoming','delayed','overdue'));

-- deliverables
alter table deliverables add constraint chk_deliverables_status
  check (status in ('pending','in_progress','completed','delivered','in_review','approved','rejected'));

-- crm_deals
alter table crm_deals add constraint chk_crm_deals_status
  check (status in ('open','won','lost','stale','archived'));

-- team_members
alter table team_members add constraint chk_team_members_role
  check (role in ('Owner','Consultant','Client','Admin','Member'));

commit;

-- =============================================================================
-- Notes:
-- - Vector dimensions already enforced at column type level:
--   crm_interactions.embedding = vector(1536), documents.embedding = vector(768)
-- - All updated_at triggers already exist on all tables with updated_at columns
-- - client_crm_status is a view (no trigger needed)
-- - Existing pre-built constraints retained: activities_activity_type_check,
--   clients_company_size_check, clients_health_score_check, crm_deals_amount_check,
--   crm_deals_win_probability_check, crm_interactions_direction_check,
--   crm_stages_probability_check, documents_category_check, documents_wizard_or_project,
--   project_services_status_check, projects_current_phase_check, projects_progress_check,
--   services_category_check, tasks_effort_check, tasks_owner_check,
--   wizard_answers_screen_id_check, wizard_sessions_current_step_check
-- =============================================================================
