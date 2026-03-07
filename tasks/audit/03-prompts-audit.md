# Sun AI Agency — Progress Task Tracker & Prompts Audit

**Date:** 2026-03-07  
**Role:** Project analyst / systems architect  
**Scope:** Examine → Verify → Validate → Measure → Identify (production-ready plan)

---

## Executive Summary

| Layer | Status | % Complete | Notes |
|-------|--------|------------|--------|
| **Marketing site** | 🟢 Complete | 100% | 28+ routes, Layout, all pages |
| **Foundation & routing** | 🟡 Partial | 50% | No `/app/*`, `/auth`, `/admin/*`; wizard at `/wizard` only |
| **Supabase client & API** | 🟢 Complete | 95% | Client, wizardApi, aiApi, authApi; JWT not passed consistently |
| **Database schema** | 🟢 Complete | 81% | 31 tables deployed; 9 missing (RAG, chat, billing); RLS gaps |
| **Edge Functions (code)** | 🟡 Partial | 55% | Hono server in `src/supabase/functions/server/`; callGemini exists but gemini-2.0-flash only, no retry/repair |
| **Wizard (5 steps)** | 🟡 In Progress | 65% | All steps + WizardLayout (three-panel), auto-save, Step 5 single-column; route `/wizard` not `/app/wizard`; AI partially wired |
| **Auth UI & guards** | 🔴 Not Started | 0% | No `/auth`, no ProtectedRoute, no post-auth routing |
| **Client dashboard** | 🔴 Not Started | 0% | No `/app/dashboard` or child routes |
| **Agency dashboard** | 🔴 Not Started | 0% | No `/admin/*` routes |
| **AI agents (Gemini 3)** | 🟡 Partial | 30% | Edge routes call Gemini; model still 2.0-flash; no Pro/Thinking; 6 functions verify_jwt: false |
| **Workflows & journeys** | 🔴 Not Started | 0% | Prompts exist; no implementation |
| **Prompts (46 files)** | 🟡 Partial | 75% | Structure good; some outdated paths/models; dependencies refs to archived prompts |

**Overall project completion (production-ready):** ~35%

---

## Progress Task Tracker

| Task Name | Description | Status | % Complete | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next Action |
|-----------|-------------|--------|------------|--------------|---------------------|----------------|
| **001** Project foundation | Vite/React/TS, routing, Layout | 🟡 In Progress | 50% | Marketing routes, build works | `/app/*`, `/auth`, `/admin/*` missing | Add app/auth/admin route groups to `routes.tsx` |
| **002** Supabase client | createClient, auth, API helpers | 🟢 Completed | 95% | `src/lib/supabase.ts`, wizardApi, aiApi, authApi | API calls use anon key; JWT not forwarded | Pass `token` from session in all api() calls |
| **003** Auth UI layout | Login/signup split-screen | 🔴 Not Started | 0% | — | No `/auth` route or components | Build auth page per 003 prompt |
| **004** Auth Supabase integration | Email + Google OAuth | 🔴 Not Started | 0% | signIn/signOut in lib | No UI, no OAuth config | Implement 004 + 003 together |
| **005** Post-auth routing | Welcome, org check, redirect | 🔴 Not Started | 0% | — | No `/app/welcome` | Add after auth |
| **006** Route protection | JWT + role guards | 🔴 Not Started | 0% | — | No ProtectedRoute | Add guard component, wrap app routes |
| **007–009** Database schema | Core, project, AI tables | 🟢 Completed | 100% | 31 tables in Supabase | 9 ADV tables missing (knowledge_*, chat_*, etc.) | Add migrations when building RAG/chat |
| **010** RLS policy foundation | org_id isolation | 🟡 In Progress | 70% | RLS enabled on all 31 | roadmaps, ai_cache, ai_run_logs INSERT/UPDATE missing; temp_anon on wizard | Fix policies per index-progress P0 |
| **011** Edge shared infra | CORS, JWT, errors | 🟡 In Progress | 60% | Hono server, routes mount | 6 functions verify_jwt: false; shared CORS/error shape unverified | Enable verify_jwt; standardize responses |
| **012** Gemini AI client | callGemini, retry, repair | 🟡 In Progress | 45% | callGemini(), cache, log | Model gemini-2.0-flash only; no retry/backoff; no 5-level JSON repair; no Thinking | Upgrade to gemini-3.*; add retry/repair per prompt |
| **013** Edge function stubs | 18 agents deployed | 🟢 Completed | 100% | 19 functions (incl. 2 extra) | Stubs return real logic in repo (ai-routes); deployed count matches | None |
| **014** Wizard shell layout | Three-panel, responsive | 🟢 Completed | 90% | WizardLayout, WizardSidebar, footer, Step 5 single-column | Route is `/wizard` not `/app/wizard`; mobile breakpoints not verified | Align route with PRD or document intentional public wizard |
| **015** Wizard navigation state | Stepper, session, step state | 🟢 Completed | 95% | WizardContext, currentStep, completedSteps, goNext/goBack | URL does not reflect step (e.g. /wizard/step-2) | Optional: sync step to URL |
| **016** Wizard auto-save | 500ms debounce, cloud save | 🟢 Completed | 90% | 500ms local + 2s cloud, wizardApi.save, save indicator | Prompt says 500ms for cloud; impl uses 2s for cloud | Document or reduce cloud debounce |
| **Wizard Step 1** | Business context, AI analysis | 🟡 In Progress | 85% | StepBusinessContext, aiApi.analyzeBusiness, mock fallback | Real analyze-business wired but may use stub backend | Verify Edge Function returns real Gemini |
| **Wizard Step 2** | Industry diagnostics | 🟡 In Progress | 80% | StepIndustryDiagnostics, 8 questions, signals | industryDiagnostics API exists; signal detection partial | Wire to generate-diagnostics / extractor |
| **Wizard Step 3** | System recommendations | 🟡 In Progress | 50% | StepSystemRecommendations UI | Static/mock data; recommend-systems not wired to UI | Call systemRecommendations(); show ranked cards |
| **Wizard Step 4** | Executive brief | 🟡 In Progress | 55% | StepExecutiveSummary, brief view | generateRoadmap/readinessScore not wired; approval flow partial | Wire brief generation + approval |
| **Wizard Step 5** | Launch project | 🟡 In Progress | 40% | StepLaunchProject single-column | Project creation not implemented | Create project/roadmap/tasks on submit |
| **Dashboard overview** | Client dashboard home | 🔴 Not Started | 0% | — | No `/app/dashboard` | Build per 025 after auth + wizard |
| **Dashboard tabs** | Brief, roadmap, tasks, docs, billing | 🔴 Not Started | 0% | — | No client dashboard routes | After 025 |
| **Agency dashboards** | Admin overview, CRM, pipeline, projects | 🔴 Not Started | 0% | — | No `/admin/*` | After client dashboard |
| **AI agents (17)** | Gemini 3 Pro/Flash, tools | 🟡 In Progress | 30% | Edge routes call callGemini; ai-routes have prompts | Single model 2.0-flash; no Thinking; 6 no JWT | Per-agent model + verify_jwt; add Thinking where specified |
| **Workflows** | Lead qual, onboarding, roadmap, tasks, reporting | 🔴 Not Started | 0% | Prompts 049–054 exist | No automation implementation | Implement when dashboard + CRM exist |
| **User journeys** | Onboarding, wizard, execution, monitoring | 🔴 Not Started | 0% | Prompts 037–043 exist | No journey-specific code | Follow journey prompts when building flows |
| **Chatbot / Cmd+K** | Widget + dashboard chat | 🔴 Not Started | 0% | — | No chat UI or sessions | After RAG/assistant agent |
| **RAG / knowledge base** | Vector search, chunks | 🔴 Not Started | 0% | — | knowledge_* tables missing | Add schema + Edge + UI |
| **Revenue / Stripe** | Billing, subscriptions | 🔴 Not Started | 0% | — | subscriptions/invoices tables missing | Per ADV phase |
| **Production readiness** | Security, performance, errors | 🔴 Not Started | 0% | — | No PROD audit run | Run PROD-SEC-01, PROD-PERF-01, PROD-ERR-01 |

---

## Status Legend

- 🟢 **Completed** — Fully functional & verified
- 🟡 **In Progress** — Partially working
- 🔴 **Not Started** — Planned but not implemented
- 🟥 **Blocked** — Missing dependency or critical failure

---

## Prompts Audit (Correctness & Gaps)

### Prompt File Summary

| Category | Count | Location | % Structurally Correct | Issues |
|----------|-------|----------|------------------------|--------|
| CORE (001–016) | 16 | `tasks/prompts/` | 95% | 001/014 reference `/app/wizard`; 012 references `supabase/functions/_shared/gemini.ts` (actual: `src/supabase/functions/server/gemini.tsx`) |
| Agents (044–048) | 5 | `tasks/prompts/` | 90% | Model names gemini-3.1-pro-preview correct; Edge paths assume Supabase deploy structure |
| Workflows (049–054) | 6 | `tasks/prompts/` | 85% | Dependencies on refactored schema (021 archived) |
| Journeys (037–043) | 7 | `tasks/prompts/` | 85% | High-level; no code blocks; good for planning |
| Dashboard (025–036) | 12 | `tasks/prompts/dashboard/` | 90% | 025 dependency 021-edge-function-kv-to-tables-refactor is archived; table lists accurate |
| Wizard (wizard/prompts) | 12 | `tasks/wizard/prompts/` | 90% | Figma-focused; no code; consistent with mermaid |
| Mermaid diagrams | 18 | `tasks/mermaid/` | 95% | Aligned with PRD; CORE-ARCH-01, CORE-WIZARD-01 match implementation intent |

### Prompt Correctness (Sample)

| Prompt ID | File | % Correct | ✅ Correct | ⚠️ Wrong / Missing | Suggestion |
|-----------|------|-----------|------------|---------------------|------------|
| 001 | 001-project-foundation.md | 85% | Route tree, Vite, acceptance | Route tree says `/app/*` — not in code | Add note: "Current impl uses `/wizard` for unauthenticated wizard; migrate to `/app/wizard` when auth exists" |
| 012 | 012-gemini-ai-client.md | 70% | callGemini, cache, log | Path `supabase/functions/_shared/gemini.ts`; model list (3.1-pro, 3-flash); retry/repair/Thinking not in code | Update path to `src/supabase/functions/server/gemini.tsx`; add checklist for retry/repair/Thinking |
| 014 | 014-wizard-shell-layout.md | 88% | Three-panel, Step 5 single-column, footer | Route `/app/wizard/*` vs actual `/wizard`; 240/320 px — verify in WizardLayout | Add "Current route: /wizard (public); post-auth may move to /app/wizard" |
| 016 | 016-wizard-auto-save.md | 90% | Debounce, save indicator, persistence | Prompt 500ms; impl 500ms local + 2s cloud | Document cloud 2s in prompt or change to 500ms |
| 025 | dashboard/025-dashboard-overview.md | 95% | Screens, tables, agents, real-world example | dependency 021 archived | Replace dependency with "010 RLS, 013 Edge stubs, wizard_answers + projects" |
| 046 | 046-agent-system-recommendations.md | 95% | Model, storage, cache, flow | Edge Function name: prompt says `system-recommendations`; code uses `/system-recommendations` in ai-routes | None |

### Aggregate Prompt Quality

| Metric | Value |
|--------|--------|
| **Total prompt files** | 46 (prompts) + 12 (wizard) + 18 (mermaid) = 76 |
| **With frontmatter (id, phase, dependencies)** | ~95% |
| **With correct schema/table references** | ~90% |
| **With correct Edge Function names** | ~90% |
| **With correct Gemini model names** | ~95% (gemini-3.1-pro-preview, gemini-3-flash-preview) |
| **Dependencies pointing to archived prompts** | 025 (021), some workflows (021) — suggest update |
| **Path/location mismatches** | 001 (routes), 012 (gemini path), 014 (wizard path) |

---

## Gaps, Blockers, Failure Points

### Critical (P0)

1. **No auth surface** — Cannot protect `/app` or `/admin`; wizard is public at `/wizard`.
2. **JWT not sent to Edge** — `api()` uses `publicAnonKey` when token not passed; authenticated wizard/dashboard calls must pass session token.
3. **6 Edge Functions with verify_jwt: false** — analyze-business, generate-diagnostics, recommend-systems, generate-roadmap, assess-readiness, onboarding-agent exposed.
4. **RLS gaps** — roadmaps, roadmap_phases, ai_cache, ai_run_logs missing INSERT/UPDATE/DELETE for app users; temp_anon on wizard_answers/wizard_sessions.
5. **Gemini client** — Single model (2.0-flash); no retry, no JSON repair, no Thinking; prompts specify 3.1-pro for reasoning agents.

### High (P1)

6. **Route structure** — `/app/*` and `/admin/*` absent; wizard at `/wizard` only.
7. **Step 3/4/5 wiring** — System recommendations, brief generation, project creation not connected end-to-end.
8. **Dashboard** — No client or agency dashboard screens.

### Medium (P2)

9. **Prompt dependency drift** — 021 (kv-to-tables refactor) archived; 025 and others still reference it.
10. **URL vs step state** — Wizard step not in URL; deep link / refresh loses step.
11. **Missing tables** — knowledge_*, chat_*, subscriptions, leads, agent_configs, etc. when advancing to ADV phase.

---

## Next Actions (Prioritized)

| # | Action | Owner | Blocker? |
|---|--------|-------|----------|
| 1 | Fix RLS: add INSERT/UPDATE for roadmaps, roadmap_phases, ai_cache, ai_run_logs; remove temp_anon | Backend | P0 |
| 2 | Set verify_jwt: true for all wizard/agent Edge Functions | Backend | P0 |
| 3 | Pass JWT from auth session in all frontend api() calls | Frontend | P0 |
| 4 | Implement auth UI (003) + Supabase integration (004) + post-auth (005) + guards (006) | Frontend | P0 |
| 5 | Add route groups: /auth, /app (wizard, dashboard), /admin | Frontend | P1 |
| 6 | Upgrade callGemini: gemini-3.1-pro / gemini-3-flash per agent; add retry + JSON repair | Backend | P1 |
| 7 | Wire Step 3 → systemRecommendations(), Step 4 → generateRoadmap/readinessScore, Step 5 → project create | Frontend | P1 |
| 8 | Update prompts: 001, 012, 014 path/route notes; 025 dependency to non-archived refs | Docs | P2 |
| 9 | Build DashboardOverview (025) after auth + wizard complete | Frontend | P1 |

---

## Production Readiness Status

| Area | Ready? | Notes |
|------|--------|--------|
| **Marketing site** | ✅ Yes | Deployable as-is |
| **Wizard (public)** | 🟡 Partial | Works; no auth; data in localStorage + optional cloud save |
| **Wizard (authenticated)** | ❌ No | No auth; no `/app/wizard` |
| **Client dashboard** | ❌ No | Not built |
| **Agency dashboard** | ❌ No | Not built |
| **AI agents** | 🟡 Partial | Backend logic exists; model and security need hardening |
| **Data layer** | 🟡 Partial | Schema and RLS need fixes above |
| **Security** | ❌ No | JWT + RLS + verify_jwt gaps |
| **Testing** | ❌ No | No automated tests |

---

## Appendix: Prompt Improvement Suggestions

1. **001-project-foundation.md** — Add "Current state: marketing + public wizard at /wizard; /app and /admin to be added with auth."
2. **012-gemini-ai-client.md** — Set "Implementation path: `src/supabase/functions/server/gemini.tsx`"; add verification checklist for retry, timeout, 5-level repair, Thinking.
3. **014-wizard-shell-layout.md** — Add "Route: currently /wizard (public); post-auth target /app/wizard."
4. **016-wizard-auto-save.md** — Document "Cloud save debounce: 2s (local 500ms)."
5. **025-dashboard-overview.md** — Replace dependency 021 with "010 (RLS), 013 (Edge stubs), wizard_answers + projects + roadmaps."
6. **Dashboard prompts (026–036)** — Ensure schema_tables and edge_function names match current Supabase schema and `src/supabase/functions/server` route names.
7. **Agent prompts (044–048)** — Confirm Edge Function URLs match Hono PREFIX and route paths in ai-routes.tsx.
8. **Workflow prompts (049–054)** — Replace any dependency on 021 with concrete table/function names.

---

*End of audit. Verify correctness at each stage before production.*
