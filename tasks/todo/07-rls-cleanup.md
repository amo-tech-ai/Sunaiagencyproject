# P6: RLS Cleanup & Hardening

> **Priority:** MEDIUM -- Audit findings show minor gaps; no critical vulnerabilities
> **Depends on:** P0 (auth), P2 (initial RLS audit)
> **Est:** ~1 hour

---

## Audit Findings (2026-03-07)

### Verified Good

All 31 tables have RLS enabled. Most tables have comprehensive CRUD policies scoped by `auth.uid()` or org membership via `team_members`.

| Category | Tables | Status |
|----------|--------|--------|
| Full CRUD policies | `activities`, `clients`, `crm_contacts`, `crm_deals`, `crm_interactions`, `crm_pipelines`, `crm_stages`, `deliverables`, `documents`, `invoices`, `milestones`, `payments`, `projects`, `tasks` | Good |
| SELECT-only (server-writes) | `ai_cache` (2), `ai_run_logs` (2), `systems` (2), `system_services` (2) | Good |
| Anon-allowed (wizard) | `wizard_sessions`, `wizard_answers` | Good (by design) |

### Issues Found

| # | Issue | Table(s) | Severity | Fix |
|---|-------|----------|----------|-----|
| 1 | Missing INSERT/UPDATE/DELETE policies | `roadmaps`, `roadmap_phases` | Medium | Add CRUD policies |
| 2 | Redundant policies (9 total) | `profiles` | Low | Consolidate to 3-4 |
| 3 | No `temp_anon` policies found | -- | -- | Previous concern resolved |

---

## Implementation Steps

### Step 1: Add CRUD policies to roadmaps

```sql
-- roadmaps: currently SELECT-only, needs full CRUD for dashboard
CREATE POLICY "Users insert own roadmaps" ON roadmaps
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM team_members
      WHERE org_id = roadmaps.org_id
    )
  );

CREATE POLICY "Users update own roadmaps" ON roadmaps
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM team_members
      WHERE org_id = roadmaps.org_id
    )
  );

CREATE POLICY "Users delete own roadmaps" ON roadmaps
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM team_members
      WHERE org_id = roadmaps.org_id
    )
  );
```

### Step 2: Add CRUD policies to roadmap_phases

```sql
CREATE POLICY "Users insert own phases" ON roadmap_phases
  FOR INSERT WITH CHECK (
    roadmap_id IN (
      SELECT id FROM roadmaps WHERE org_id IN (
        SELECT org_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users update own phases" ON roadmap_phases
  FOR UPDATE USING (
    roadmap_id IN (
      SELECT id FROM roadmaps WHERE org_id IN (
        SELECT org_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users delete own phases" ON roadmap_phases
  FOR DELETE USING (
    roadmap_id IN (
      SELECT id FROM roadmaps WHERE org_id IN (
        SELECT org_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );
```

### Step 3: Consolidate profiles policies

Current: 9 policies on `profiles` (likely from iterative development). Audit and consolidate to:

```sql
-- Drop redundant policies first (list exact names after audit)
-- Keep/create these 3:
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

---

## Verification

```sql
-- Verify roadmaps now has CRUD
SELECT cmd, policyname FROM pg_policies
WHERE tablename = 'roadmaps' ORDER BY cmd;
-- Expected: DELETE, INSERT, SELECT, UPDATE

-- Verify profiles is consolidated
SELECT cmd, policyname FROM pg_policies
WHERE tablename = 'profiles' ORDER BY cmd;
-- Expected: 3-4 policies (not 9)
```
