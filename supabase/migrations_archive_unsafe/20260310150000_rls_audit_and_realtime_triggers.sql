-- =============================================================================
-- Migration: RLS policy audit fixes + Realtime broadcast triggers
-- Applied: 2026-03-10 via Supabase MCP execute_sql
-- This file records the changes for git traceability.
-- =============================================================================

-- ─── Fix overly permissive RLS on user-scoped tables ────────────────────────

-- workflows: scope to user_id
DROP POLICY IF EXISTS workflows_select_authenticated ON workflows;
DROP POLICY IF EXISTS workflows_insert_authenticated ON workflows;
DROP POLICY IF EXISTS workflows_update_authenticated ON workflows;
DROP POLICY IF EXISTS workflows_delete_authenticated ON workflows;

CREATE POLICY workflows_select_authenticated ON workflows
  FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
CREATE POLICY workflows_insert_authenticated ON workflows
  FOR INSERT TO authenticated WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY workflows_update_authenticated ON workflows
  FOR UPDATE TO authenticated USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY workflows_delete_authenticated ON workflows
  FOR DELETE TO authenticated USING (user_id = (select auth.uid()));

-- dashboard_invoices: scope to user_id
DROP POLICY IF EXISTS dashboard_invoices_select_authenticated ON dashboard_invoices;
DROP POLICY IF EXISTS dashboard_invoices_insert_authenticated ON dashboard_invoices;
DROP POLICY IF EXISTS dashboard_invoices_update_authenticated ON dashboard_invoices;
DROP POLICY IF EXISTS dashboard_invoices_delete_authenticated ON dashboard_invoices;

CREATE POLICY dashboard_invoices_select_authenticated ON dashboard_invoices
  FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
CREATE POLICY dashboard_invoices_insert_authenticated ON dashboard_invoices
  FOR INSERT TO authenticated WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY dashboard_invoices_update_authenticated ON dashboard_invoices
  FOR UPDATE TO authenticated USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY dashboard_invoices_delete_authenticated ON dashboard_invoices
  FOR DELETE TO authenticated USING (user_id = (select auth.uid()));

-- lean_canvases: scope to user_id
DROP POLICY IF EXISTS lean_canvases_select_authenticated ON lean_canvases;
DROP POLICY IF EXISTS lean_canvases_insert_authenticated ON lean_canvases;
DROP POLICY IF EXISTS lean_canvases_update_authenticated ON lean_canvases;
DROP POLICY IF EXISTS lean_canvases_delete_authenticated ON lean_canvases;

CREATE POLICY lean_canvases_select_authenticated ON lean_canvases
  FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
CREATE POLICY lean_canvases_insert_authenticated ON lean_canvases
  FOR INSERT TO authenticated WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY lean_canvases_update_authenticated ON lean_canvases
  FOR UPDATE TO authenticated USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY lean_canvases_delete_authenticated ON lean_canvases
  FOR DELETE TO authenticated USING (user_id = (select auth.uid()));

-- strategy_roles: scope to user_id
DROP POLICY IF EXISTS strategy_roles_select_authenticated ON strategy_roles;
DROP POLICY IF EXISTS strategy_roles_insert_authenticated ON strategy_roles;
DROP POLICY IF EXISTS strategy_roles_update_authenticated ON strategy_roles;
DROP POLICY IF EXISTS strategy_roles_delete_authenticated ON strategy_roles;

CREATE POLICY strategy_roles_select_authenticated ON strategy_roles
  FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
CREATE POLICY strategy_roles_insert_authenticated ON strategy_roles
  FOR INSERT TO authenticated WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY strategy_roles_update_authenticated ON strategy_roles
  FOR UPDATE TO authenticated USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY strategy_roles_delete_authenticated ON strategy_roles
  FOR DELETE TO authenticated USING (user_id = (select auth.uid()));

-- Remove overly permissive realtime.messages policy
DROP POLICY IF EXISTS "Authenticated users can receive broadcasts" ON realtime.messages;

-- ─── Realtime broadcast triggers (5 triggers + 4 RLS policies) ──────────────
-- These were applied from src/imports/*.sql files.
-- Triggers: ai_run_logs, wizard_sessions, crm_deals, lean_canvases, lean_canvas_versions
-- RLS policies on realtime.messages: ai_runs_read, wizard_sessions_read, pipeline_deals_read, canvas_blocks_read
-- See src/imports/ for full trigger function definitions.
