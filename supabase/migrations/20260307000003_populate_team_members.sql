-- =============================================================================
-- Migration 020: Populate team_members to fix RLS authorization chain
-- Applied to production: 2026-03-07
-- Audit ref: /tasks/audit/01-supabase-audit-report.md
-- Prompt ref: /tasks/prompts/020-migration-baseline-seed.md
--
-- Purpose: The team_members table had 0 rows despite 8 profiles and 3 orgs.
-- The get_user_org_ids() function queries team_members, so all RLS policies
-- that check org membership were denying access to all users.
-- This migration assigns existing profiles to organizations.
-- =============================================================================

begin;

-- assign profiles to organizations (idempotent via on conflict)
-- acme digital agency: 3 members (owner, consultant, client)
insert into team_members (id, org_id, user_id, role, created_at, updated_at)
values
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '7a4be6b6-e9a1-4b84-be23-1ac2a27efc92', 'Owner', now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '2c87792d-bc6e-4e85-8eb5-13dce5db34cc', 'Consultant', now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '48168673-94ec-4283-be01-4e07e9dae2cf', 'Client', now(), now()),
  -- techstart solutions: 3 members
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', 'f0c8623f-f76b-40cb-a045-4375ed04d1ef', 'Owner', now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', '8b383bad-2e15-41e6-bb93-73628a9e3b04', 'Consultant', now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', '66d8f5d1-267c-4ed6-8668-e03ad21f1afd', 'Client', now(), now()),
  -- innovation labs: 2 members
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', '918b123c-6d3e-41ac-8d45-afbef75bee94', 'Owner', now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', 'b84ce80b-b9ed-4b73-a2d8-81478c03c6c6', 'Consultant', now(), now())
on conflict do nothing;

commit;
