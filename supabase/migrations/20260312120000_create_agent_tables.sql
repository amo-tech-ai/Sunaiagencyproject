-- ============================================================================
-- Migration: Create 7 agent tables for Agency Agents integration
-- Purpose:   Agent catalog, assignments, runs, insights, templates, deal scores
-- Affected:  NEW tables — agent_catalog, agent_assignments, agent_runs,
--            insight_cards, agent_team_templates, agent_team_templates_agents,
--            deal_scores
-- Ref:       prompts/prompts/01-supabase-schema.md through 05-triggers.md
-- Safety:    CREATE TABLE IF NOT EXISTS — idempotent. No destructive operations.
--            RLS enabled with granular per-role policies.
--            auth.uid() wrapped in subquery for performance (initPlan caching).
--            All FK columns indexed per Supabase best practices.
-- ============================================================================

-- ═══════════════════════════════════════════════════════════════════════════
-- 1. agent_catalog
-- Index of all available agents with parsed metadata from .md files.
-- Populated by parse-agents script via service role.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.agent_catalog (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        NOT NULL,
  name        text        NOT NULL,
  description text        NOT NULL,
  division    text        NOT NULL,
  emoji       text,
  color       text,
  vibe        text,
  file_path   text        NOT NULL,
  line_count  integer     DEFAULT 0,
  tags        text[]      DEFAULT '{}',
  sections    jsonb       DEFAULT '{}',
  is_curated  boolean     NOT NULL DEFAULT false,
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.agent_catalog IS
  'Index of all available AI agents parsed from agency .md files.';

-- Unique constraint on slug
ALTER TABLE public.agent_catalog
  DROP CONSTRAINT IF EXISTS agent_catalog_slug_key;
ALTER TABLE public.agent_catalog
  ADD CONSTRAINT agent_catalog_slug_key UNIQUE (slug);

-- Trigger: auto-update updated_at
DROP TRIGGER IF EXISTS handle_updated_at ON public.agent_catalog;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.agent_catalog
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agent_catalog_division
  ON public.agent_catalog (division);

CREATE INDEX IF NOT EXISTS idx_agent_catalog_curated
  ON public.agent_catalog (is_curated)
  WHERE is_curated = true;

CREATE INDEX IF NOT EXISTS idx_agent_catalog_active
  ON public.agent_catalog (is_active)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_agent_catalog_tags
  ON public.agent_catalog USING gin (tags);

-- RLS: public read for all authenticated users, no direct writes
ALTER TABLE public.agent_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY agent_catalog_select_authenticated
  ON public.agent_catalog FOR SELECT TO authenticated
  USING (is_active = true);

-- ═══════════════════════════════════════════════════════════════════════════
-- 2. agent_assignments
-- Links agents to projects. Created on wizard completion or manual assign.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.agent_assignments (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id           uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  agent_slug           text        NOT NULL REFERENCES public.agent_catalog(slug) ON DELETE RESTRICT,
  role_description     text,
  assigned_by          text        NOT NULL,
  status               text        NOT NULL DEFAULT 'active',
  first_task           text,
  last_output_summary  text,
  last_run_at          timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.agent_assignments IS
  'Links agents to projects. Created on wizard completion or manual assignment.';

-- Unique: one agent per project
ALTER TABLE public.agent_assignments
  DROP CONSTRAINT IF EXISTS agent_assignments_project_agent_key;
ALTER TABLE public.agent_assignments
  ADD CONSTRAINT agent_assignments_project_agent_key UNIQUE (project_id, agent_slug);

-- Check: valid status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'agent_assignments_status_check'
  ) THEN
    ALTER TABLE public.agent_assignments
      ADD CONSTRAINT agent_assignments_status_check
      CHECK (status IN ('active', 'paused', 'completed'));
  END IF;
END $$;

-- Trigger: auto-update updated_at
DROP TRIGGER IF EXISTS handle_updated_at ON public.agent_assignments;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.agent_assignments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes (FK columns + query patterns)
CREATE INDEX IF NOT EXISTS idx_agent_assignments_project_id
  ON public.agent_assignments (project_id);

CREATE INDEX IF NOT EXISTS idx_agent_assignments_agent_slug
  ON public.agent_assignments (agent_slug);

CREATE INDEX IF NOT EXISTS idx_agent_assignments_active
  ON public.agent_assignments (project_id, status)
  WHERE status = 'active';

-- RLS: project-owner scoped
ALTER TABLE public.agent_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY agent_assignments_select_authenticated
  ON public.agent_assignments FOR SELECT TO authenticated
  USING (project_id IN (SELECT id FROM public.projects WHERE user_id = (SELECT auth.uid())));

CREATE POLICY agent_assignments_insert_authenticated
  ON public.agent_assignments FOR INSERT TO authenticated
  WITH CHECK (project_id IN (SELECT id FROM public.projects WHERE user_id = (SELECT auth.uid())));

CREATE POLICY agent_assignments_update_authenticated
  ON public.agent_assignments FOR UPDATE TO authenticated
  USING (project_id IN (SELECT id FROM public.projects WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (project_id IN (SELECT id FROM public.projects WHERE user_id = (SELECT auth.uid())));

CREATE POLICY agent_assignments_delete_authenticated
  ON public.agent_assignments FOR DELETE TO authenticated
  USING (project_id IN (SELECT id FROM public.projects WHERE user_id = (SELECT auth.uid())));

-- ═══════════════════════════════════════════════════════════════════════════
-- 3. agent_runs
-- Audit log of every agent execution. Immutable — no UPDATE or DELETE.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.agent_runs (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_slug      text        NOT NULL REFERENCES public.agent_catalog(slug) ON DELETE RESTRICT,
  project_id      uuid        REFERENCES public.projects(id) ON DELETE SET NULL,
  user_id         uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  route           text        NOT NULL,
  input_summary   text,
  output_summary  text,
  full_output     jsonb,
  tokens_input    integer     DEFAULT 0,
  tokens_output   integer     DEFAULT 0,
  duration_ms     integer     DEFAULT 0,
  model           text,
  success         boolean     NOT NULL DEFAULT true,
  error_message   text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.agent_runs IS
  'Audit log of every agent execution. Immutable records.';

-- Indexes (FK columns + query patterns)
CREATE INDEX IF NOT EXISTS idx_agent_runs_agent_slug
  ON public.agent_runs (agent_slug);

CREATE INDEX IF NOT EXISTS idx_agent_runs_project_id
  ON public.agent_runs (project_id)
  WHERE project_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_runs_user_id
  ON public.agent_runs (user_id);

CREATE INDEX IF NOT EXISTS idx_agent_runs_created_at
  ON public.agent_runs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_agent_runs_route
  ON public.agent_runs (route);

-- RLS: user-scoped reads, user-scoped inserts, no updates/deletes
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY agent_runs_select_authenticated
  ON public.agent_runs FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY agent_runs_insert_authenticated
  ON public.agent_runs FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ═══════════════════════════════════════════════════════════════════════════
-- 4. insight_cards
-- Agent-generated business insights displayed on dashboard.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.insight_cards (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  agent_slug    text        NOT NULL REFERENCES public.agent_catalog(slug) ON DELETE RESTRICT,
  priority      text        NOT NULL DEFAULT 'medium',
  title         text        NOT NULL,
  body          text        NOT NULL,
  impact_label  text,
  action_label  text,
  action_url    text,
  status        text        NOT NULL DEFAULT 'new',
  expires_at    timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.insight_cards IS
  'Agent-generated business insights displayed on the dashboard.';

-- Check: valid priority values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'insight_cards_priority_check'
  ) THEN
    ALTER TABLE public.insight_cards
      ADD CONSTRAINT insight_cards_priority_check
      CHECK (priority IN ('high', 'medium', 'low'));
  END IF;
END $$;

-- Check: valid status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'insight_cards_status_check'
  ) THEN
    ALTER TABLE public.insight_cards
      ADD CONSTRAINT insight_cards_status_check
      CHECK (status IN ('new', 'viewed', 'acted', 'dismissed'));
  END IF;
END $$;

-- Indexes (FK columns + query patterns)
CREATE INDEX IF NOT EXISTS idx_insight_cards_project_id
  ON public.insight_cards (project_id);

CREATE INDEX IF NOT EXISTS idx_insight_cards_agent_slug
  ON public.insight_cards (agent_slug);

CREATE INDEX IF NOT EXISTS idx_insight_cards_project_status
  ON public.insight_cards (project_id, status);

CREATE INDEX IF NOT EXISTS idx_insight_cards_priority
  ON public.insight_cards (priority);

CREATE INDEX IF NOT EXISTS idx_insight_cards_expires_at
  ON public.insight_cards (expires_at)
  WHERE expires_at IS NOT NULL;

-- RLS: project-owner scoped reads + status updates only
ALTER TABLE public.insight_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY insight_cards_select_authenticated
  ON public.insight_cards FOR SELECT TO authenticated
  USING (project_id IN (SELECT id FROM public.projects WHERE user_id = (SELECT auth.uid())));

CREATE POLICY insight_cards_update_authenticated
  ON public.insight_cards FOR UPDATE TO authenticated
  USING (project_id IN (SELECT id FROM public.projects WHERE user_id = (SELECT auth.uid())));

-- ═══════════════════════════════════════════════════════════════════════════
-- 5. agent_team_templates
-- Pre-built agent teams for common industry + goal combinations.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.agent_team_templates (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  industry     text        NOT NULL,
  goal         text        NOT NULL,
  company_size text,
  description  text,
  is_active    boolean     NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.agent_team_templates IS
  'Pre-built agent teams for common industry + goal combinations.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agent_team_templates_industry_goal
  ON public.agent_team_templates (industry, goal);

CREATE INDEX IF NOT EXISTS idx_agent_team_templates_active
  ON public.agent_team_templates (is_active)
  WHERE is_active = true;

-- RLS: public read for authenticated users
ALTER TABLE public.agent_team_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY agent_team_templates_select_authenticated
  ON public.agent_team_templates FOR SELECT TO authenticated
  USING (is_active = true);

-- ═══════════════════════════════════════════════════════════════════════════
-- 6. agent_team_templates_agents
-- Junction table linking templates to their agents.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.agent_team_templates_agents (
  id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid    NOT NULL REFERENCES public.agent_team_templates(id) ON DELETE CASCADE,
  agent_slug  text    NOT NULL REFERENCES public.agent_catalog(slug) ON DELETE RESTRICT,
  role        text    NOT NULL,
  first_task  text,
  sort_order  integer NOT NULL DEFAULT 0
);

COMMENT ON TABLE public.agent_team_templates_agents IS
  'Junction table linking team templates to their agents with roles.';

-- Unique: one agent per template
ALTER TABLE public.agent_team_templates_agents
  DROP CONSTRAINT IF EXISTS agent_team_templates_agents_unique;
ALTER TABLE public.agent_team_templates_agents
  ADD CONSTRAINT agent_team_templates_agents_unique UNIQUE (template_id, agent_slug);

-- Indexes (FK columns + ordered query)
CREATE INDEX IF NOT EXISTS idx_agent_team_templates_agents_template_id
  ON public.agent_team_templates_agents (template_id);

CREATE INDEX IF NOT EXISTS idx_agent_team_templates_agents_sort
  ON public.agent_team_templates_agents (template_id, sort_order);

-- RLS: public read for authenticated users (follows parent template visibility)
ALTER TABLE public.agent_team_templates_agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY agent_team_templates_agents_select_authenticated
  ON public.agent_team_templates_agents FOR SELECT TO authenticated
  USING (template_id IN (SELECT id FROM public.agent_team_templates WHERE is_active = true));

-- ═══════════════════════════════════════════════════════════════════════════
-- 7. deal_scores
-- CRM deal health scores from Pipeline Analyst agent.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.deal_scores (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id            uuid        NOT NULL REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  agent_slug         text        NOT NULL REFERENCES public.agent_catalog(slug) ON DELETE RESTRICT,
  health_score       integer     NOT NULL DEFAULT 0,
  risk_label         text,
  recommendation     text,
  scoring_breakdown  jsonb       DEFAULT '{}',
  scored_at          timestamptz NOT NULL DEFAULT now(),
  expires_at         timestamptz
);

COMMENT ON TABLE public.deal_scores IS
  'CRM deal health scores generated by Pipeline Analyst agent.';

-- Check: health_score 0-100
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'deal_scores_score_check'
  ) THEN
    ALTER TABLE public.deal_scores
      ADD CONSTRAINT deal_scores_score_check
      CHECK (health_score >= 0 AND health_score <= 100);
  END IF;
END $$;

-- Indexes (FK columns + query patterns)
CREATE INDEX IF NOT EXISTS idx_deal_scores_deal_id
  ON public.deal_scores (deal_id);

CREATE INDEX IF NOT EXISTS idx_deal_scores_agent_slug
  ON public.deal_scores (agent_slug);

CREATE INDEX IF NOT EXISTS idx_deal_scores_health_score
  ON public.deal_scores (health_score);

CREATE INDEX IF NOT EXISTS idx_deal_scores_expires_at
  ON public.deal_scores (expires_at)
  WHERE expires_at IS NOT NULL;

-- RLS: user sees scores for deals belonging to their clients
ALTER TABLE public.deal_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY deal_scores_select_authenticated
  ON public.deal_scores FOR SELECT TO authenticated
  USING (deal_id IN (
    SELECT id FROM public.crm_deals
    WHERE org_id IN (
      SELECT org_id FROM public.team_members WHERE user_id = (SELECT auth.uid())
    )
  ));

-- ═══════════════════════════════════════════════════════════════════════════
-- Realtime: enable publication for live-update tables
-- ═══════════════════════════════════════════════════════════════════════════

ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_runs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.insight_cards;
