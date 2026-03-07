# Sun AI Agency — Improvements, Changes & Errors to Fix

**Source:** Audit 03-prompts-audit.md  
**Purpose:** Actionable list of errors to fix, improvements to make, and changes to apply.

---

## Errors to Fix

### Security

| # | Error | Location | Fix |
|---|--------|----------|-----|
| 1 | Edge Functions callable without JWT | Supabase dashboard / config | Set `verify_jwt: true` for: analyze-business, generate-diagnostics, recommend-systems, generate-roadmap, assess-readiness, onboarding-agent |
| 2 | API calls use anon key when user is logged in | `src/lib/supabase.ts` — `api()` | When calling `api()`, pass `token: session?.access_token` from `authApi.getSession()`; use in `Authorization: Bearer ${token \|\| publicAnonKey}` |
| 3 | Wizard tables allow anonymous read/write | RLS on `wizard_sessions`, `wizard_answers` | Remove or restrict `temp_anon` policies; require auth or scope by session_id + signed token |

### RLS (Database)

| # | Error | Table | Fix |
|---|--------|--------|-----|
| 4 | No INSERT/UPDATE/DELETE for app users | `roadmaps`, `roadmap_phases` | Add RLS policies for authenticated users in same org (via project/org_id) |
| 5 | No INSERT/UPDATE/DELETE for app users | `ai_cache`, `ai_run_logs` | Add policies so service role or authenticated org can write; read for own org |
| 6 | Duplicate or overlapping policies | `profiles` | Consolidate SELECT/INSERT/UPDATE into single clear policy per operation; remove duplicates |
| 7 | brief_versions has no UPDATE | `brief_versions` | Add UPDATE policy for org members who can update briefs |

### Code & Config

| # | Error | Location | Fix |
|---|--------|----------|-----|
| 8 | Gemini client uses single model | `src/supabase/functions/server/gemini.tsx` | Use `gemini-3.1-pro-preview` for reasoning agents (scorer, summary, recommend-systems, generate-roadmap), `gemini-3-flash-preview` for extraction/chat; pass model per call |
| 9 | No retry on transient failures | `gemini.tsx` — `callGemini()` | Add retry with exponential backoff (e.g. 1s, 2s, 4s) on 429, 500, 503, timeout; do not retry 400, 401, 404 |
| 10 | No JSON repair on malformed response | `gemini.tsx` | Implement 5-level repair: parse → trim → close braces → extract from code fence → regex fallback |
| 11 | Deprecated model risk | `gemini.tsx` | Ensure no use of `gemini-3-pro-preview` (shutdown 2026-03-09); use gemini-3.1-pro-preview |

---

## Improvements

### Frontend

| # | Improvement | Where | Action |
|---|-------------|--------|--------|
| 12 | Auth surface | New route + components | Add `/auth` route; build login/signup split-screen per 003; wire to authApi + Supabase OAuth |
| 13 | Route protection | `src/routes.tsx`, new component | Add `ProtectedRoute` that checks session; wrap `/app/*` and `/admin/*` when added |
| 14 | App route groups | `src/routes.tsx` | Add `/app` (wizard, dashboard) and `/admin` route trees with placeholders; optional: move wizard under `/app/wizard` and redirect `/wizard` |
| 15 | Pass JWT to API | All `api()`, `wizardApi`, `aiApi` call sites | Get session before calls; pass `token: session?.access_token` into options |
| 16 | Wizard step in URL | Wizard routes | Optional: add `/wizard/step/:stepNum` or query `?step=2` and sync with WizardContext so refresh/deep link keeps step |
| 17 | Step 3 real data | `StepSystemRecommendations` | Call `aiApi.systemRecommendations({ sessionId, wizardAnswers, industry })` on load; show ranked systems from response |
| 18 | Step 4 brief generation | `StepExecutiveSummary` | Call `aiApi.generateRoadmap()` and `aiApi.readinessScore()`; render result in brief view; wire “Approve” to set brief status |
| 19 | Step 5 project creation | `StepLaunchProject` | On submit: create project, context_snapshot, roadmap, roadmap_phases, tasks via Supabase or Edge Function; then redirect to dashboard |

### Backend (Edge)

| # | Improvement | Where | Action |
|---|-------------|--------|--------|
| 20 | Per-agent model | `ai-routes.tsx` / gemini | Pass model name into `callGemini` per route (e.g. recommend-systems → gemini-3.1-pro-preview) |
| 21 | Thinking config | `gemini.tsx` | For Pro agents, add `thinkingConfig` (e.g. thinkingLevel: "high") when calling Gemini API if supported |
| 22 | Timeout handling | `gemini.tsx` | Use AbortController with configurable timeout (default 30s, max 60s); retry on timeout per #9 |

### Docs & Prompts

| # | Improvement | File(s) | Action |
|---|-------------|--------|--------|
| 23 | Route reality note | `tasks/prompts/001-project-foundation.md` | Add: “Current impl: wizard at `/wizard` (public). Post-auth: add `/app/wizard`, `/app/dashboard`, `/admin/*`.” |
| 24 | Gemini implementation path | `tasks/prompts/012-gemini-ai-client.md` | Set implementation path to `src/supabase/functions/server/gemini.tsx`; add verification checklist (retry, timeout, JSON repair, Thinking) |
| 25 | Wizard route note | `tasks/prompts/014-wizard-shell-layout.md` | Add: “Current route: `/wizard` (public). Post-auth may use `/app/wizard`.” |
| 26 | Cloud debounce | `tasks/prompts/016-wizard-auto-save.md` | Document: “Cloud save debounce: 2s (local 500ms).” |
| 27 | Dashboard dependency | `tasks/prompts/dashboard/025-dashboard-overview.md` | Replace dependency `021-edge-function-kv-to-tables-refactor` with “010 RLS, 013 Edge stubs, wizard_answers + projects + roadmaps” |
| 28 | Workflow dependencies | Prompts 049–054 | Replace any reference to archived 021 with concrete table/function names |

---

## Changes (Intentional / Design)

| # | Change | Decision | Notes |
|---|--------|----------|--------|
| 29 | Wizard URL | Keep `/wizard` public until auth exists | Once auth is in place, either (a) keep `/wizard` for guest and add `/app/wizard` for logged-in, or (b) move all wizard under `/app/wizard` and redirect |
| 30 | Cloud save debounce | Keep 2s for cloud, 500ms for local | Reduces API load; document in 016 so prompt matches implementation |
| 31 | Edge code location | Code in `src/supabase/functions/server/` | Deploy pipeline should build from here; prompts should reference this path, not `supabase/functions/_shared` |
| 32 | Dashboard dependency | Stop referencing archived 021 | All dashboard/workflow prompts should depend on current schema and Edge routes, not refactor tasks |

---

## Priority Order

| Priority | Items | Rationale |
|----------|--------|-----------|
| **P0** | 1, 2, 3, 4, 5, 8 | Security and data integrity before feature work |
| **P1** | 6, 7, 12, 13, 14, 15, 17, 18, 19, 20 | Auth, routes, JWT, and wizard completion |
| **P2** | 9, 10, 11, 21, 22, 16 | Robustness and model/config correctness |
| **P3** | 23–28, 29–32 | Docs and intentional design alignment |

---

## Quick Checks After Fixes

- [ ] All Edge calls from frontend send `Authorization: Bearer <jwt>` when user is logged in.
- [ ] No Edge Function that touches user/org data has `verify_jwt: false`.
- [ ] RLS: authenticated user can INSERT/UPDATE roadmaps, roadmap_phases, ai_cache, ai_run_logs for their org.
- [ ] Wizard tables: no anonymous write unless product decision is “guest wizard”; then scope by session only.
- [ ] Gemini: no use of deprecated model; Pro agents use gemini-3.1-pro-preview, Flash use gemini-3-flash-preview.
- [ ] Prompts 001, 012, 014, 016, 025 have no stale path or dependency on archived 021.
