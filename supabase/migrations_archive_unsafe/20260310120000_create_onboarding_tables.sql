-- ============================================================================
-- Migration: Create projects, roadmaps, roadmap_phases, activities tables
-- Purpose:   Support the onboarding-agent flow — when a user completes the
--            5-step wizard, the agent creates proper project/roadmap records
--            in the DB instead of only storing raw wizard_answers JSON.
-- Affected:  NEW tables — projects, roadmaps, roadmap_phases, activities
-- Ref:       /imports/onboarding-agent-rewrite.md (task 064)
--            /supabase/functions/server/onboarding-routes.tsx
-- Depends:   clients table from 20260307120200_create_crm_core_tables.sql
-- Safety:    CREATE TABLE IF NOT EXISTS — idempotent. No destructive operations.
-- ============================================================================

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: projects
-- One project per wizard completion. Links client -> roadmap -> phases.
-- Created by the onboarding-agent when user finishes Step 5.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists projects (
  id              uuid        primary key default gen_random_uuid(),

  -- The client this project belongs to (created or upserted by onboarding agent)
  client_id       uuid        null references clients(id) on delete set null,

  -- Auth user who owns this project
  user_id         uuid        null,

  -- Wizard session that generated this project (for traceability)
  wizard_session_id uuid      null,

  -- Project name (from AI roadmap title or derived from company + goal)
  name            text        not null,

  -- Human-readable description / tagline
  description     text        not null default '',

  -- Industry from wizard Step 1
  industry        text        not null default '',

  -- Company size from wizard Step 1
  company_size    text        not null default '',

  -- AI systems selected in wizard Step 3 (stored as JSONB array)
  selected_systems jsonb      not null default '[]'::jsonb,

  -- Project lifecycle: draft -> active -> completed -> archived
  status          text        not null default 'active',

  -- Current phase number (1-indexed)
  current_phase   integer     not null default 1,

  -- Total estimated timeline
  total_weeks     integer     not null default 0,

  -- Total estimated investment string
  total_investment text       not null default '',

  -- Full wizard state snapshot for reference
  wizard_snapshot  jsonb      null,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table projects is
  'Projects created from wizard completions. One project per wizard session completion.';

-- Validate status
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'projects_status_check'
  ) then
    alter table projects
      add constraint projects_status_check
      check (status in ('draft', 'active', 'completed', 'archived'));
  end if;
end $$;

alter table projects enable row level security;

create policy "projects_select_authenticated"
  on projects for select to authenticated using (true);
create policy "projects_insert_authenticated"
  on projects for insert to authenticated with check (true);
create policy "projects_update_authenticated"
  on projects for update to authenticated using (true) with check (true);
create policy "projects_delete_authenticated"
  on projects for delete to authenticated using (true);

create index if not exists idx_projects_user_id
  on projects (user_id) where user_id is not null;
create index if not exists idx_projects_client_id
  on projects (client_id) where client_id is not null;
create index if not exists idx_projects_wizard_session
  on projects (wizard_session_id) where wizard_session_id is not null;
create index if not exists idx_projects_updated_at
  on projects (updated_at desc);


-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: roadmaps
-- One roadmap per project. Contains top-level AI-generated roadmap data.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists roadmaps (
  id              uuid        primary key default gen_random_uuid(),

  -- Parent project
  project_id      uuid        not null references projects(id) on delete cascade,

  -- Roadmap title from AI generation
  title           text        not null default '',

  -- Total timeline
  total_weeks     integer     not null default 0,

  -- Estimated investment
  total_investment text       not null default '',

  -- Quick wins (JSONB array of strings)
  quick_wins      jsonb       not null default '[]'::jsonb,

  -- Risk factors (JSONB array of { risk, mitigation })
  risk_factors    jsonb       not null default '[]'::jsonb,

  -- Success metrics (JSONB array of { metric, target, timeframe })
  success_metrics jsonb       not null default '[]'::jsonb,

  -- Full AI response snapshot for reference
  ai_response     jsonb       null,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table roadmaps is
  'AI-generated implementation roadmaps. One per project, contains quick wins, risks, metrics.';

alter table roadmaps enable row level security;

create policy "roadmaps_select_authenticated"
  on roadmaps for select to authenticated using (true);
create policy "roadmaps_insert_authenticated"
  on roadmaps for insert to authenticated with check (true);
create policy "roadmaps_update_authenticated"
  on roadmaps for update to authenticated using (true) with check (true);

create index if not exists idx_roadmaps_project_id
  on roadmaps (project_id);


-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: roadmap_phases
-- Individual phases within a roadmap. One row per phase.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists roadmap_phases (
  id              uuid        primary key default gen_random_uuid(),

  -- Parent roadmap
  roadmap_id      uuid        not null references roadmaps(id) on delete cascade,

  -- Phase ordering (1-indexed)
  phase_number    integer     not null,

  -- Phase title from AI
  title           text        not null default '',

  -- Week range string, e.g. "Weeks 1-4"
  week_range      text        not null default '',

  -- AI systems involved in this phase (JSONB array of strings)
  systems         jsonb       not null default '[]'::jsonb,

  -- Deliverables (JSONB array of strings)
  deliverables    jsonb       not null default '[]'::jsonb,

  -- Milestones (JSONB array of strings)
  milestones      jsonb       not null default '[]'::jsonb,

  -- Estimated cost for this phase
  estimated_cost  text        not null default '',

  -- Phase status: upcoming -> active -> completed
  status          text        not null default 'upcoming',

  -- Progress percentage 0-100
  progress        integer     not null default 0,

  created_at      timestamptz not null default now()
);

comment on table roadmap_phases is
  'Individual phases within a roadmap. Contains deliverables, milestones, cost per phase.';

-- Validate status
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'roadmap_phases_status_check'
  ) then
    alter table roadmap_phases
      add constraint roadmap_phases_status_check
      check (status in ('upcoming', 'active', 'completed'));
  end if;
end $$;

alter table roadmap_phases enable row level security;

create policy "roadmap_phases_select_authenticated"
  on roadmap_phases for select to authenticated using (true);
create policy "roadmap_phases_insert_authenticated"
  on roadmap_phases for insert to authenticated with check (true);
create policy "roadmap_phases_update_authenticated"
  on roadmap_phases for update to authenticated using (true) with check (true);

create index if not exists idx_roadmap_phases_roadmap_id
  on roadmap_phases (roadmap_id);

-- Ensure unique phase ordering within a roadmap
create unique index if not exists idx_roadmap_phases_unique_number
  on roadmap_phases (roadmap_id, phase_number);


-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: activities
-- Audit log for user/system events. Supports the dashboard activity feed.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists activities (
  id              uuid        primary key default gen_random_uuid(),

  -- Auth user associated with this activity
  user_id         uuid        null,

  -- Related project (optional)
  project_id      uuid        null references projects(id) on delete set null,

  -- Related wizard session (optional)
  session_id      text        null,

  -- Activity type for filtering
  type            text        not null default 'system',

  -- Human-readable action description
  action          text        not null,

  -- Additional detail text
  detail          text        not null default '',

  -- Arbitrary metadata (JSONB)
  metadata        jsonb       not null default '{}'::jsonb,

  created_at      timestamptz not null default now()
);

comment on table activities is
  'Audit log for user and system events. Powers the dashboard activity feed.';

alter table activities enable row level security;

create policy "activities_select_authenticated"
  on activities for select to authenticated using (true);
create policy "activities_insert_authenticated"
  on activities for insert to authenticated with check (true);

create index if not exists idx_activities_user_id
  on activities (user_id) where user_id is not null;
create index if not exists idx_activities_project_id
  on activities (project_id) where project_id is not null;
create index if not exists idx_activities_created_at
  on activities (created_at desc);
create index if not exists idx_activities_type
  on activities (type);
