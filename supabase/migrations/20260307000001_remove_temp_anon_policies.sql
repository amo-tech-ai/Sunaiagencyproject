-- =============================================================================
-- Migration 017: Security Hotfix — Remove temp_anon policies and duplicate org INSERT
-- Applied to production: 2026-03-07
-- Audit ref: /tasks/audit/01-supabase-audit-report.md
--
-- Purpose: Remove 6 dangerous temp_anon policies that granted unrestricted
-- anonymous access to wizard_sessions and wizard_answers tables.
-- Also removes a duplicate INSERT policy on organizations.
-- =============================================================================

begin;

-- remove 6 temp_anon policies that granted unrestricted anonymous access to wizard tables
drop policy if exists temp_anon_select_wizard_sessions on wizard_sessions;
drop policy if exists temp_anon_insert_wizard_sessions on wizard_sessions;
drop policy if exists temp_anon_update_wizard_sessions on wizard_sessions;
drop policy if exists temp_anon_select_wizard_answers on wizard_answers;
drop policy if exists temp_anon_insert_wizard_answers on wizard_answers;
drop policy if exists temp_anon_update_wizard_answers on wizard_answers;

-- remove duplicate INSERT policy on organizations (keep "Anyone can create their own organization")
drop policy if exists "authenticated users can insert organizations" on organizations;

commit;
