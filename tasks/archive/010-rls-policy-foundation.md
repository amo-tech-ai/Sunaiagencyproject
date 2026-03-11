---
id: 010-rls-policy-foundation
diagram_id: CORE-DATA-01
prd_section: Database Schema
title: Row Level Security policies for org_id tenant isolation
skill: backend
phase: CORE
priority: P0
status: Partial (policies exist, temp_anon issues — see 017)
owner: Backend
dependencies:
  - 007-database-schema-core
  - 008-database-schema-project
  - 009-database-schema-ai
estimated_effort: L
percent_complete: 70
---

## Objective
Enable Row Level Security on all tables and create org_id-scoped policies that enforce multi-tenant data isolation.

## Scope
- Enable RLS: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` on every table
- Helper function: `auth.org_id()` — extracts org_id from the current JWT claim or looks up from profiles table
- Standard org-scoped policies (applied to all org_id tables):
  - SELECT: `USING (org_id = auth.org_id())`
  - INSERT: `WITH CHECK (org_id = auth.org_id())`
  - UPDATE: `USING (org_id = auth.org_id()) WITH CHECK (org_id = auth.org_id())`
  - DELETE: `USING (org_id = auth.org_id())`
- Special policies:
  - `profiles`: users can SELECT/UPDATE own profile (`id = auth.uid()`)
  - `organizations`: owner can UPDATE, all members can SELECT
  - `brief_versions`: SELECT through brief -> org_id chain
  - `roadmap_phases`: SELECT through roadmap -> org_id chain
- Service role bypass: edge functions using `service_role` key bypass RLS
- Fix known issue: ensure all UPDATE policies have both USING and WITH CHECK clauses (9 tables were missing WITH CHECK)

## Acceptance Criteria
- RLS enabled on all tables (verify: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public'`)
- User in org A cannot SELECT, INSERT, UPDATE, or DELETE data from org B
- INSERT enforces org_id matches authenticated user's org
- UPDATE policies have both USING and WITH CHECK on all tables
- Edge functions with service_role key can access all data
- `auth.org_id()` function returns correct org_id for authenticated user
- Profiles: user can only read/update their own profile

## Failure Handling
- Policy violation returns Postgres permission error (not internal table details)
- Missing org_id on INSERT is caught by WITH CHECK (not silently dropped)
- Service role fallback: if edge function JWT verification fails, operation is denied
