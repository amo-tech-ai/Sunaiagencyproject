---
id: 064-onboarding-agent-rewrite
diagram_id: EDGE-02
prd_section: Edge Functions
title: Rewrite onboarding-agent edge function for sunai schema
skill: backend
phase: HIGH
priority: P1
status: Not Started
owner: Backend
dependencies:
  - 050-workflow-client-onboarding
  - 055-complete-data-model
estimated_effort: L
percent_complete: 0
area: agency-dashboard
schema_tables: [wizard_sessions, wizard_answers, clients, projects, roadmaps, roadmap_phases, team_members, organizations, profiles]
figma_prompt: prompts/064-onboarding-agent-rewrite.md
---

# 064 — Onboarding Agent Rewrite (sunai)

## Summary Table

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Function Slug      | `onboarding-agent`                                           |
| Current State      | v3 stub returning 503 with `verify_jwt: true`                |
| Problem            | Function was built for startupai schema — references `ai_runs`, `startups`, `user_roles` which don't exist in sunai |
| Goal               | Rewrite to use sunai tables: `wizard_sessions`, `clients`, `projects`, `roadmaps`, `team_members` |
| JWT                | `verify_jwt: true` (post-auth only)                          |

---

## Description

### 1. Current State

The onboarding-agent edge function is deployed as a 503 stub. The original function (from startupai project `yvyesmiczbjqwbqtlidy`) hardcoded a different Supabase URL and referenced 3 tables that don't exist in sunai:

- `ai_runs` — doesn't exist (sunai uses `ai_run_logs`)
- `startups` — doesn't exist (sunai uses `clients`)
- `user_roles` — doesn't exist (sunai uses `team_members` with `role` column)

### 2. Target Behavior

When a user completes the wizard (Step 5), the onboarding-agent should:

1. Read all wizard data from `wizard_sessions` + `wizard_answers`
2. Create or update a `clients` record
3. Create a `projects` record linked to the client
4. Create a `roadmaps` record from Step 5 AI results
5. Create `roadmap_phases` from the roadmap data
6. Link wizard session to user via `wizard_sessions.user_id`
7. Log the onboarding event to `activities`

### 3. Technical Approach

- Deno edge function using Hono router (matches existing pattern in `make-server-283466b6`)
- Uses `adminClient()` from shared `db.tsx` for DB writes
- Uses `getUserFromToken()` from shared `auth.tsx` for JWT validation
- Accepts POST with `{ sessionId }` body
- Returns created entity IDs on success

### 4. Schema Mapping (startupai -> sunai)

| startupai Table | sunai Table | Notes |
|-----------------|-------------|-------|
| `startups` | `clients` | Company info |
| `user_roles` | `team_members` | Role + org association |
| `ai_runs` | `ai_run_logs` | AI execution tracking |

---

## Implementation Steps

1. Read wizard data: `wizard_sessions` + all `wizard_answers` for the session
2. Extract business profile from Step 1 `data` field
3. Extract roadmap from Step 5 `ai_results` field
4. UPSERT `clients` (on `user_id` conflict)
5. INSERT `projects` linked to client
6. INSERT `roadmaps` linked to project
7. INSERT `roadmap_phases` from roadmap phases array
8. UPDATE `wizard_sessions.user_id` if not already set
9. INSERT `activities` event
10. Return summary with all created IDs

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Wizard incomplete (missing steps) | Return 400 with which steps are missing |
| User already has a project from this session | Return existing project (idempotent) |
| Roadmap AI results malformed | Use fallback template |
| No auth token | Return 401 (verify_jwt handles this) |
| Client record already exists for user | UPSERT — update metadata, don't duplicate |

---

## Verification

- Deploy with `supabase functions deploy onboarding-agent`
- Test: `curl -X POST .../onboarding-agent -H "Authorization: Bearer <jwt>" -d '{"sessionId": "..."}'`
- Verify records created in `clients`, `projects`, `roadmaps`, `roadmap_phases`
- Verify `wizard_sessions.user_id` updated
- Verify `activities` event logged
