-- ============================================================================
-- Migration: Create CRM pipeline tables (Phase 7 — CRM Pipeline Kanban)
-- Purpose:   Sales pipeline management with kanban board. Tracks leads from
--            wizard engagement through signed contracts. Deals flow through
--            customizable stages. Interaction logging for calls/emails/meetings.
-- Affected:  NEW tables — crm_pipelines, crm_stages, crm_deals, crm_interactions
-- Ref:       /docs/dashboard/07-crm-pipeline.md (wireframes + content data table)
--            /components/dashboard/DashboardSidebar.tsx (route: /app/crm/pipelines)
-- Depends:   clients, crm_contacts (from migration 20260307120200)
-- Safety:    CREATE TABLE IF NOT EXISTS — idempotent. No destructive operations.
-- ============================================================================

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: crm_pipelines
-- Named pipeline groupings, e.g. "New Business", "Upsell", "Renewal".
-- Each pipeline contains an ordered set of stages.
-- One pipeline may be marked is_default for auto-deal creation from wizard.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists crm_pipelines (
  -- Unique pipeline identifier
  id            uuid        primary key default gen_random_uuid(),

  -- Pipeline display name, e.g. "New Business"
  name          text        not null,

  -- Optional description
  description   text        not null default '',

  -- Whether this is the default pipeline for auto-created deals from wizard
  -- Only one pipeline should be default at a time (enforced by application logic)
  is_default    boolean     not null default false,

  -- User who created this pipeline
  created_by    uuid        null,

  -- Timestamps
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table crm_pipelines is
  'Named sales pipelines. Each contains ordered stages for deal progression (e.g. New Business, Upsell, Renewal).';

alter table crm_pipelines enable row level security;

-- RLS: Authenticated users can perform all operations on pipelines
create policy "crm_pipelines_select_authenticated"
  on crm_pipelines for select to authenticated using (true);
create policy "crm_pipelines_insert_authenticated"
  on crm_pipelines for insert to authenticated with check (true);
create policy "crm_pipelines_update_authenticated"
  on crm_pipelines for update to authenticated using (true) with check (true);
create policy "crm_pipelines_delete_authenticated"
  on crm_pipelines for delete to authenticated using (true);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: crm_stages
-- Ordered stages within a pipeline. Deals progress left-to-right on the
-- kanban board in ascending position order.
-- Default stages for "New Business": Lead → Qualified → Proposal Sent →
--   Negotiation → Closed Won → Closed Lost
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists crm_stages (
  -- Unique stage identifier
  id              uuid        primary key default gen_random_uuid(),

  -- Parent pipeline (required). Stages are deleted when pipeline is deleted.
  pipeline_id     uuid        not null references crm_pipelines(id) on delete cascade,

  -- Stage display name, e.g. "Lead", "Qualified", "Proposal Sent"
  name            text        not null,

  -- Display order within the pipeline (1-based, ascending = left to right)
  position        integer     not null,

  -- Badge/column color as CSS hex value, e.g. "#9CA39B", "#3B82F6"
  -- From doc: Lead=#9CA39B, Qualified=#3B82F6, Proposal=#D97706,
  --   Negotiation=#00875A, Won=#1A1A1A, Lost=#DC2626
  color           text        not null default '#9CA39B',

  -- Terminal stage flags — a deal in a terminal stage is no longer active
  -- These drive forecast exclusions and conversion rate calculations
  is_closed_won   boolean     not null default false,
  is_closed_lost  boolean     not null default false,

  -- When this stage was created
  created_at      timestamptz not null default now()
);

comment on table crm_stages is
  'Ordered stages within a pipeline. Position determines kanban column order. Terminal stages end the deal lifecycle.';

alter table crm_stages enable row level security;

create policy "crm_stages_select_authenticated"
  on crm_stages for select to authenticated using (true);
create policy "crm_stages_insert_authenticated"
  on crm_stages for insert to authenticated with check (true);
create policy "crm_stages_update_authenticated"
  on crm_stages for update to authenticated using (true) with check (true);
create policy "crm_stages_delete_authenticated"
  on crm_stages for delete to authenticated using (true);

-- Unique constraint: no two stages in the same pipeline can share a position
create unique index if not exists idx_crm_stages_pipeline_position
  on crm_stages (pipeline_id, position);

-- Index for ordered stage listing within a pipeline
create index if not exists idx_crm_stages_pipeline_id
  on crm_stages (pipeline_id, position asc);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: crm_deals
-- Individual deals (opportunities) that flow through pipeline stages.
-- Linked to clients, contacts, and optionally to wizard sessions.
-- The kanban board groups deals by stage_id within a pipeline.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists crm_deals (
  -- Unique deal identifier
  id                    uuid        primary key default gen_random_uuid(),

  -- Which pipeline this deal belongs to
  pipeline_id           uuid        not null references crm_pipelines(id) on delete cascade,

  -- Current stage within the pipeline
  stage_id              uuid        not null references crm_stages(id) on delete restrict,

  -- Deal title, e.g. "Acme Retail — AI Patient Scheduling"
  title                 text        not null,

  -- Monetary value of the deal in dollars
  value                 numeric     not null default 0,

  -- Probability of closing (0-100%). Used for weighted pipeline forecasting.
  -- Forecast = sum(value * probability/100) grouped by expected_close month
  probability           integer     not null default 0,

  -- Optional link to a CRM contact (the main point of contact for this deal)
  contact_id            uuid        null references crm_contacts(id) on delete set null,

  -- Optional link to a CRM client (the company this deal is for)
  client_id             uuid        null references clients(id) on delete set null,

  -- Optional link to a wizard session (for deals auto-created from wizard)
  -- This enables the "Wizard Data" tab in deal detail to show readiness scores
  session_id            text        null,

  -- Expected close date for forecasting (nullable = unknown)
  expected_close_date   date        null,

  -- When the deal was last moved to a different stage.
  -- Used to calculate "days in stage" for stale deal detection:
  --   <7 days = normal (gray), 7-14 days = amber warning, >14 days = red alert
  stage_changed_at      timestamptz not null default now(),

  -- Deal owner (the team member responsible for progressing this deal)
  owner_id              uuid        null,

  -- Free-form notes
  notes                 text        not null default '',

  -- Timestamps
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

comment on table crm_deals is
  'Sales opportunities that flow through pipeline stages on the kanban board. Linked to clients, contacts, and wizard sessions.';

-- Validate probability range
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'crm_deals_probability_check'
  ) then
    alter table crm_deals
      add constraint crm_deals_probability_check
      check (probability >= 0 and probability <= 100);
  end if;
end $$;

alter table crm_deals enable row level security;

create policy "crm_deals_select_authenticated"
  on crm_deals for select to authenticated using (true);
create policy "crm_deals_insert_authenticated"
  on crm_deals for insert to authenticated with check (true);
create policy "crm_deals_update_authenticated"
  on crm_deals for update to authenticated using (true) with check (true);
create policy "crm_deals_delete_authenticated"
  on crm_deals for delete to authenticated using (true);

-- Index: kanban board groups deals by stage within a pipeline
create index if not exists idx_crm_deals_pipeline_stage
  on crm_deals (pipeline_id, stage_id);

-- Index: deal list sorted by updated_at
create index if not exists idx_crm_deals_updated_at
  on crm_deals (updated_at desc);

-- Index: deals linked to a client (for client detail page)
create index if not exists idx_crm_deals_client_id
  on crm_deals (client_id)
  where client_id is not null;

-- Index: deals linked to a contact
create index if not exists idx_crm_deals_contact_id
  on crm_deals (contact_id)
  where contact_id is not null;

-- Index: deals linked to a wizard session (for wizard-to-deal queries)
create index if not exists idx_crm_deals_session_id
  on crm_deals (session_id)
  where session_id is not null;

-- Index: forecast query groups by expected_close_date month
create index if not exists idx_crm_deals_expected_close
  on crm_deals (expected_close_date)
  where expected_close_date is not null;

-- Index: stale deal detection needs stage_changed_at
create index if not exists idx_crm_deals_stage_changed
  on crm_deals (stage_changed_at);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: crm_interactions
-- Activity log for deals — calls, emails, meetings, notes.
-- Displayed in the deal detail panel "Interactions" tab, ordered by
-- created_at DESC (most recent first).
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists crm_interactions (
  -- Unique interaction identifier
  id          uuid        primary key default gen_random_uuid(),

  -- Parent deal (required). Interactions are deleted when deal is deleted.
  deal_id     uuid        not null references crm_deals(id) on delete cascade,

  -- Interaction type: call, email, meeting, note
  type        text        not null,

  -- Summary or body text of the interaction
  summary     text        not null,

  -- Team member who logged this interaction
  created_by  uuid        null,

  -- When this interaction was logged
  created_at  timestamptz not null default now()
);

comment on table crm_interactions is
  'Activity log for CRM deals — calls, emails, meetings, notes. Ordered by created_at DESC in the deal detail panel.';

-- Validate interaction type
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'crm_interactions_type_check'
  ) then
    alter table crm_interactions
      add constraint crm_interactions_type_check
      check (type in ('call', 'email', 'meeting', 'note'));
  end if;
end $$;

alter table crm_interactions enable row level security;

create policy "crm_interactions_select_authenticated"
  on crm_interactions for select to authenticated using (true);
create policy "crm_interactions_insert_authenticated"
  on crm_interactions for insert to authenticated with check (true);
create policy "crm_interactions_update_authenticated"
  on crm_interactions for update to authenticated using (true) with check (true);
create policy "crm_interactions_delete_authenticated"
  on crm_interactions for delete to authenticated using (true);

-- Index: list interactions for a deal ordered by date
create index if not exists idx_crm_interactions_deal_id
  on crm_interactions (deal_id, created_at desc);
