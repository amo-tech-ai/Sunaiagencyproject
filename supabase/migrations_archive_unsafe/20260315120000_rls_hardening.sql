-- =============================================================================
-- Migration: RLS Policy Hardening — Replace USING(true) with user-scoped policies
-- Task: Prompt 22 (022-SEC)
-- Date: 2026-03-15
-- Applied to production via Supabase MCP in 3 migrations:
--   1. fix_onboarding_table_schema — Add missing columns to onboarding tables
--   2. rls_hardening_remaining_tables — 5 core tables
--   3. rls_hardening_strategy_tables — 8 strategy tables
--
-- Tables SKIPPED (already have proper org-based policies via team_members JOINs):
--   clients, crm_contacts, crm_pipelines, crm_stages, crm_deals,
--   crm_interactions, projects, roadmaps, roadmap_phases, activities
--
-- Tables SKIPPED (already had user_id-scoped policies):
--   dashboard_invoices, lean_canvases, strategy_roles, workflows
--
-- Tables SKIPPED (intentionally shared, read-only):
--   ai_cache (SELECT only), system_services (SELECT only)
-- =============================================================================

SET search_path = '';

-- ─── PART A: Fix onboarding table schemas ────────────────────────────────────
-- Production tables were created by older migration with different column names
-- than what onboarding-routes.tsx expects

ALTER TABLE public.roadmaps ADD COLUMN IF NOT EXISTS project_id uuid;
ALTER TABLE public.roadmaps ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.roadmaps ADD COLUMN IF NOT EXISTS total_weeks integer;
ALTER TABLE public.roadmaps ADD COLUMN IF NOT EXISTS total_investment text;
ALTER TABLE public.roadmaps ADD COLUMN IF NOT EXISTS quick_wins jsonb;
ALTER TABLE public.roadmaps ADD COLUMN IF NOT EXISTS risk_factors jsonb;
ALTER TABLE public.roadmaps ADD COLUMN IF NOT EXISTS success_metrics jsonb;
ALTER TABLE public.roadmaps ADD COLUMN IF NOT EXISTS ai_response jsonb;

ALTER TABLE public.roadmap_phases ADD COLUMN IF NOT EXISTS roadmap_id uuid;
ALTER TABLE public.roadmap_phases ADD COLUMN IF NOT EXISTS phase_number integer;
ALTER TABLE public.roadmap_phases ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.roadmap_phases ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.roadmap_phases ADD COLUMN IF NOT EXISTS duration_weeks integer;
ALTER TABLE public.roadmap_phases ADD COLUMN IF NOT EXISTS systems jsonb;
ALTER TABLE public.roadmap_phases ADD COLUMN IF NOT EXISTS deliverables jsonb;
ALTER TABLE public.roadmap_phases ADD COLUMN IF NOT EXISTS estimated_cost text;
ALTER TABLE public.roadmap_phases ADD COLUMN IF NOT EXISTS dependencies jsonb;

ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS project_id uuid;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS activity_type text;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS metadata jsonb;

-- ─── PART B: Add user_id columns to 13 tables ───────────────────────────────

-- 5 core tables
ALTER TABLE public.dashboard_documents ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.dashboard_payments ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.strategy_events ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.strategy_event_triggers ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.workflow_executions ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- 8 strategy tables
ALTER TABLE public.automation_opportunities ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.lean_canvas_versions ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.strategy_actions ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.strategy_agent_memory ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.strategy_budgets ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.strategy_insights ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.strategy_recommendations ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.strategy_signals ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- ─── PART C: Backfill user_id from parent FKs ───────────────────────────────

-- Strategy tables: backfill from lean_canvases.user_id via canvas_id
UPDATE public.strategy_events se SET user_id = lc.user_id FROM public.lean_canvases lc WHERE se.canvas_id = lc.id AND se.user_id IS NULL;
UPDATE public.automation_opportunities ao SET user_id = lc.user_id FROM public.lean_canvases lc WHERE ao.canvas_id = lc.id AND ao.user_id IS NULL;
UPDATE public.lean_canvas_versions lcv SET user_id = lc.user_id FROM public.lean_canvases lc WHERE lcv.canvas_id = lc.id AND lcv.user_id IS NULL;
UPDATE public.strategy_actions sa SET user_id = lc.user_id FROM public.lean_canvases lc WHERE sa.canvas_id = lc.id AND sa.user_id IS NULL;
UPDATE public.strategy_agent_memory sam SET user_id = lc.user_id FROM public.lean_canvases lc WHERE sam.canvas_id = lc.id AND sam.user_id IS NULL;
UPDATE public.strategy_budgets sb SET user_id = lc.user_id FROM public.lean_canvases lc WHERE sb.canvas_id = lc.id AND sb.user_id IS NULL;
UPDATE public.strategy_insights si SET user_id = lc.user_id FROM public.lean_canvases lc WHERE si.canvas_id = lc.id AND si.user_id IS NULL;
UPDATE public.strategy_recommendations sr SET user_id = lc.user_id FROM public.lean_canvases lc WHERE sr.canvas_id = lc.id AND sr.user_id IS NULL;
UPDATE public.strategy_signals ss SET user_id = lc.user_id FROM public.lean_canvases lc WHERE ss.canvas_id = lc.id AND ss.user_id IS NULL;
-- strategy_event_triggers has no FK column to backfill from (only event_type text)

-- ─── PART D: Drop USING(true) policies and create user-scoped ones ──────────
-- Convention: {tablename}_{operation}_authenticated
-- Pattern: user_id = (SELECT auth.uid()) — initPlan caching for performance

-- ── dashboard_documents ──
DROP POLICY IF EXISTS "dashboard_documents_select_authenticated" ON public.dashboard_documents;
DROP POLICY IF EXISTS "dashboard_documents_insert_authenticated" ON public.dashboard_documents;
DROP POLICY IF EXISTS "dashboard_documents_update_authenticated" ON public.dashboard_documents;
DROP POLICY IF EXISTS "dashboard_documents_delete_authenticated" ON public.dashboard_documents;
-- Keep dashboard_documents_service_role (edge function uses adminClient)

CREATE POLICY dashboard_documents_select_authenticated ON public.dashboard_documents FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY dashboard_documents_insert_authenticated ON public.dashboard_documents FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY dashboard_documents_update_authenticated ON public.dashboard_documents FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY dashboard_documents_delete_authenticated ON public.dashboard_documents FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

-- ── dashboard_payments ──
DROP POLICY IF EXISTS "dashboard_payments_select_authenticated" ON public.dashboard_payments;
DROP POLICY IF EXISTS "dashboard_payments_insert_authenticated" ON public.dashboard_payments;

CREATE POLICY dashboard_payments_select_authenticated ON public.dashboard_payments FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY dashboard_payments_insert_authenticated ON public.dashboard_payments FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY dashboard_payments_update_authenticated ON public.dashboard_payments FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY dashboard_payments_delete_authenticated ON public.dashboard_payments FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

-- ── strategy_events ──
DROP POLICY IF EXISTS "strategy_events_select_authenticated" ON public.strategy_events;
DROP POLICY IF EXISTS "strategy_events_insert_authenticated" ON public.strategy_events;
DROP POLICY IF EXISTS "strategy_events_update_authenticated" ON public.strategy_events;
DROP POLICY IF EXISTS "strategy_events_delete_authenticated" ON public.strategy_events;

CREATE POLICY strategy_events_select_authenticated ON public.strategy_events FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_events_insert_authenticated ON public.strategy_events FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_events_update_authenticated ON public.strategy_events FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_events_delete_authenticated ON public.strategy_events FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

-- ── strategy_event_triggers ──
DROP POLICY IF EXISTS "strategy_event_triggers_select_authenticated" ON public.strategy_event_triggers;
DROP POLICY IF EXISTS "strategy_event_triggers_insert_authenticated" ON public.strategy_event_triggers;
DROP POLICY IF EXISTS "strategy_event_triggers_update_authenticated" ON public.strategy_event_triggers;
DROP POLICY IF EXISTS "strategy_event_triggers_delete_authenticated" ON public.strategy_event_triggers;

CREATE POLICY strategy_event_triggers_select_authenticated ON public.strategy_event_triggers FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_event_triggers_insert_authenticated ON public.strategy_event_triggers FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_event_triggers_update_authenticated ON public.strategy_event_triggers FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_event_triggers_delete_authenticated ON public.strategy_event_triggers FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

-- ── workflow_executions ──
DROP POLICY IF EXISTS "workflow_executions_select_authenticated" ON public.workflow_executions;
DROP POLICY IF EXISTS "workflow_executions_insert_authenticated" ON public.workflow_executions;

CREATE POLICY workflow_executions_select_authenticated ON public.workflow_executions FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY workflow_executions_insert_authenticated ON public.workflow_executions FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY workflow_executions_update_authenticated ON public.workflow_executions FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY workflow_executions_delete_authenticated ON public.workflow_executions FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

-- ── automation_opportunities ──
DROP POLICY IF EXISTS "automation_opportunities_select_authenticated" ON public.automation_opportunities;
DROP POLICY IF EXISTS "automation_opportunities_insert_authenticated" ON public.automation_opportunities;
DROP POLICY IF EXISTS "automation_opportunities_update_authenticated" ON public.automation_opportunities;
DROP POLICY IF EXISTS "automation_opportunities_delete_authenticated" ON public.automation_opportunities;

CREATE POLICY automation_opportunities_select_authenticated ON public.automation_opportunities FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY automation_opportunities_insert_authenticated ON public.automation_opportunities FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY automation_opportunities_update_authenticated ON public.automation_opportunities FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY automation_opportunities_delete_authenticated ON public.automation_opportunities FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

-- ── lean_canvas_versions ──
DROP POLICY IF EXISTS "lean_canvas_versions_select_authenticated" ON public.lean_canvas_versions;
DROP POLICY IF EXISTS "lean_canvas_versions_insert_authenticated" ON public.lean_canvas_versions;
DROP POLICY IF EXISTS "lean_canvas_versions_update_authenticated" ON public.lean_canvas_versions;
DROP POLICY IF EXISTS "lean_canvas_versions_delete_authenticated" ON public.lean_canvas_versions;

CREATE POLICY lean_canvas_versions_select_authenticated ON public.lean_canvas_versions FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY lean_canvas_versions_insert_authenticated ON public.lean_canvas_versions FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY lean_canvas_versions_update_authenticated ON public.lean_canvas_versions FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY lean_canvas_versions_delete_authenticated ON public.lean_canvas_versions FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

-- ── strategy_actions ──
DROP POLICY IF EXISTS "strategy_actions_select_authenticated" ON public.strategy_actions;
DROP POLICY IF EXISTS "strategy_actions_insert_authenticated" ON public.strategy_actions;

CREATE POLICY strategy_actions_select_authenticated ON public.strategy_actions FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_actions_insert_authenticated ON public.strategy_actions FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_actions_update_authenticated ON public.strategy_actions FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_actions_delete_authenticated ON public.strategy_actions FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

-- ── strategy_agent_memory ──
DROP POLICY IF EXISTS "strategy_agent_memory_select_authenticated" ON public.strategy_agent_memory;
DROP POLICY IF EXISTS "strategy_agent_memory_insert_authenticated" ON public.strategy_agent_memory;
DROP POLICY IF EXISTS "strategy_agent_memory_update_authenticated" ON public.strategy_agent_memory;
DROP POLICY IF EXISTS "strategy_agent_memory_delete_authenticated" ON public.strategy_agent_memory;

CREATE POLICY strategy_agent_memory_select_authenticated ON public.strategy_agent_memory FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_agent_memory_insert_authenticated ON public.strategy_agent_memory FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_agent_memory_update_authenticated ON public.strategy_agent_memory FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_agent_memory_delete_authenticated ON public.strategy_agent_memory FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

-- ── strategy_budgets ──
DROP POLICY IF EXISTS "strategy_budgets_select_authenticated" ON public.strategy_budgets;
DROP POLICY IF EXISTS "strategy_budgets_insert_authenticated" ON public.strategy_budgets;
DROP POLICY IF EXISTS "strategy_budgets_update_authenticated" ON public.strategy_budgets;
DROP POLICY IF EXISTS "strategy_budgets_delete_authenticated" ON public.strategy_budgets;

CREATE POLICY strategy_budgets_select_authenticated ON public.strategy_budgets FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_budgets_insert_authenticated ON public.strategy_budgets FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_budgets_update_authenticated ON public.strategy_budgets FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_budgets_delete_authenticated ON public.strategy_budgets FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

-- ── strategy_insights ──
DROP POLICY IF EXISTS "strategy_insights_select_authenticated" ON public.strategy_insights;
DROP POLICY IF EXISTS "strategy_insights_insert_authenticated" ON public.strategy_insights;
DROP POLICY IF EXISTS "strategy_insights_update_authenticated" ON public.strategy_insights;
DROP POLICY IF EXISTS "strategy_insights_delete_authenticated" ON public.strategy_insights;

CREATE POLICY strategy_insights_select_authenticated ON public.strategy_insights FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_insights_insert_authenticated ON public.strategy_insights FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_insights_update_authenticated ON public.strategy_insights FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_insights_delete_authenticated ON public.strategy_insights FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

-- ── strategy_recommendations ──
DROP POLICY IF EXISTS "strategy_recommendations_select_authenticated" ON public.strategy_recommendations;
DROP POLICY IF EXISTS "strategy_recommendations_insert_authenticated" ON public.strategy_recommendations;
DROP POLICY IF EXISTS "strategy_recommendations_update_authenticated" ON public.strategy_recommendations;
DROP POLICY IF EXISTS "strategy_recommendations_delete_authenticated" ON public.strategy_recommendations;

CREATE POLICY strategy_recommendations_select_authenticated ON public.strategy_recommendations FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_recommendations_insert_authenticated ON public.strategy_recommendations FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_recommendations_update_authenticated ON public.strategy_recommendations FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_recommendations_delete_authenticated ON public.strategy_recommendations FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

-- ── strategy_signals ──
DROP POLICY IF EXISTS "strategy_signals_select_authenticated" ON public.strategy_signals;
DROP POLICY IF EXISTS "strategy_signals_insert_authenticated" ON public.strategy_signals;

CREATE POLICY strategy_signals_select_authenticated ON public.strategy_signals FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_signals_insert_authenticated ON public.strategy_signals FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_signals_update_authenticated ON public.strategy_signals FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY strategy_signals_delete_authenticated ON public.strategy_signals FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

-- ─── PART E: Indexes for RLS performance ─────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_dashboard_documents_user_id ON public.dashboard_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_payments_user_id ON public.dashboard_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_strategy_events_user_id ON public.strategy_events(user_id);
CREATE INDEX IF NOT EXISTS idx_strategy_event_triggers_user_id ON public.strategy_event_triggers(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_user_id ON public.workflow_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_automation_opportunities_user_id ON public.automation_opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_lean_canvas_versions_user_id ON public.lean_canvas_versions(user_id);
CREATE INDEX IF NOT EXISTS idx_strategy_actions_user_id ON public.strategy_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_strategy_agent_memory_user_id ON public.strategy_agent_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_strategy_budgets_user_id ON public.strategy_budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_strategy_insights_user_id ON public.strategy_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_strategy_recommendations_user_id ON public.strategy_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_strategy_signals_user_id ON public.strategy_signals(user_id);
