# Sun AI Agency — Task Index & Progress Tracker

> **Purpose:** Master index of all implementation tasks — verified against live codebase
> **Updated:** 2026-03-07 | **Version:** 4.0 (Full codebase audit)
> **Supabase Project:** `sunai` (`necxcwhuzylsumlkkmlk`) | PostgreSQL 17 | us-west-2
> **Rule:** Infrastructure → Auth → Wizard → Dashboard → Agents → Workflows → Polish

---

## Executive Summary

| Layer | Expected | Actual | Status | % |
|-------|----------|--------|--------|---|
| Marketing Site | 28+ routes | 28 routes, fully built | 🟢 Complete | 100% |
| Auth Components | Login/Signup/OAuth/Callback | 6 components created | 🟡 Built, NOT routed | 70% |
| Auth Routing | `/auth/*`, `/app/*` in routes.tsx | ❌ Missing from routes.tsx | 🔴 Not wired | 0% |
| AuthProvider | Wraps App.tsx | ❌ Not wrapping App.tsx | 🔴 Not wired | 0% |
| Wizard UI | 5-step flow | 5 steps built, public at `/wizard` | 🟡 UI done, AI partial | 65% |
| Wizard AI Wiring | 5 steps → 5 Gemini agents | Only Step 1 calls Gemini | 🔴 4/5 not wired | 20% |
| Edge Functions | 15+ routes | 15 routes deployed (5 AI + 3 wizard + 6 CRM + health) | 🟢 All implemented | 95% |
| Gemini Client | Retry/repair/cache/log | Full production `callGemini()` with 5-level repair | 🟢 Complete | 100% |
| Dashboard | 13 phases, 34 components | 34 components built, NOT routable | 🟡 Built, unreachable | 80% |
| Database | 40+ tables (PRD) | 31 deployed, 8 referenced by code | 🟡 Schema exists | 78% |
| RLS Policies | All tables | Enabled but gaps on ~8 tables | 🟡 Incomplete | 60% |
| CRM | CRUD endpoints + UI | 6 routes + 5 components | 🟢 Complete | 90% |
| Claude Code Setup | Hooks/Rules/Agents | 5 hooks, 7 rules, 3 agents, .gitignore | 🟢 Complete | 78% |

**Overall: ~57%** — Marketing 100%, backend 95%, wizard UI 65%, auth routing 0%, dashboard unreachable

---

## 🚨 Critical Blockers (Must Fix First)

| # | Blocker | Impact | Fix | Est |
|---|---------|--------|-----|-----|
| B1 | **No `/auth/*` or `/app/*` routes in `routes.tsx`** | Auth pages unreachable, dashboard unreachable | Add route groups to routes.tsx | 30 min |
| B2 | **AuthProvider not wrapping App.tsx** | `useAuth()` returns undefined everywhere | Wrap `<RouterProvider>` with `<AuthProvider>` | 15 min |
| B3 | **Two competing auth systems** | `AuthContext.tsx` vs `auth/AuthProvider.tsx` — different APIs | Pick one, remove other | 30 min |
| B4 | **Wizard Steps 2-5 don't call AI** | AI endpoints ready but frontend skips them | Wire `aiApi.*` calls in step components | 2-3 hrs |

---

## Progress by Phase

### Phase 0: Claude Code Setup

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next |
|------|-------------|--------|---|-------------|------------|---------|
| Hooks | 5 hooks: protect-files, typecheck, notify, stop, session-start | 🟢 Complete | 100% | All 5 executable, valid JSON, portable paths | — | — |
| Rules | 7 path-scoped rules for components, API, wizard, dashboard, edge fns | 🟢 Complete | 100% | All have `paths:` frontmatter, verified | — | — |
| Agents | 3 agents: code-reviewer, debugger, security-auditor | 🟢 Complete | 100% | All have name/desc/tools/model/memory | — | — |
| CLAUDE.md | Project docs with @imports, compaction, data layer | 🟢 Complete | 100% | Reflects actual architecture | — | — |
| .gitignore | Blocks .env*, CLAUDE.local.md, settings.local.json | 🟢 Complete | 100% | `git check-ignore` confirms all blocked | — | — |
| Permissions | Consolidated wildcards, no hardcoded credentials | 🟢 Complete | 100% | No passwords in settings.local.json | Rotate exposed creds | Change DB password |

### Phase 1: Foundation & Architecture

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next |
|------|-------------|--------|---|-------------|------------|---------|
| 001 Project Foundation | Vite/React/TS, routing, build | 🟡 Partial | 70% | 28 marketing routes, build works | No `/auth/*` or `/app/*` route groups | Add auth + app routes to routes.tsx |
| 002 Supabase Client | supabase-js, api() helper, auth context | 🟡 Partial | 60% | `src/lib/supabase.ts` has full api() helper, typed APIs | AuthProvider not in App.tsx, two conflicting auth systems | Pick AuthContext.tsx, wire into App.tsx |

### Phase 2: Auth & Route Protection

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next |
|------|-------------|--------|---|-------------|------------|---------|
| 003 Auth UI Layout | Split-screen auth layout | 🟡 Built, not routed | 80% | `AuthLayout.tsx` exists (split-screen) | Not in routes.tsx | Add `/auth` route group |
| 004 Auth Integration | Email + Google OAuth login/signup | 🟡 Built, not routed | 80% | `LoginPage.tsx`, `SignupPage.tsx`, `AuthPage.tsx` exist | Not reachable via routes | Wire `/auth/login`, `/auth/signup` |
| 005 Post-Auth Routing | `/app/*` route group with AppLayout | 🔴 Not started | 0% | `AppLayout.tsx` exists | routes.tsx has no `/app/*` group | Add protected `/app/*` routes |
| 006 Route Protection | JWT guard on protected routes | 🟡 Built, not active | 50% | `ProtectedRoute.tsx` exists | Not wrapping any routes | Wrap `/app/*` routes |
| — Auth Callback | Google OAuth callback handler | 🟡 Built, not routed | 80% | `AuthCallbackPage.tsx` exists | `/auth/callback` not in routes.tsx | Add route |
| — Edge: Signup | Server-side user creation | 🟢 Complete | 100% | `POST /signup` → `createUser()` auto-confirms email | — | — |

### Phase 3: Database & Schema

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next |
|------|-------------|--------|---|-------------|------------|---------|
| 007 Core Schema | orgs, profiles, wizard tables | 🟢 Done | 100% | Tables exist with data | — | Archived |
| 008 Project Schema | projects, briefs, roadmaps | 🟢 Done | 100% | Tables exist with data | — | Archived |
| 009 AI Schema | ai_cache, ai_run_logs | 🟢 Done | 100% | Tables exist, used by callGemini() | — | Archived |
| 010 RLS Policies | Row-level security on all tables | 🟡 Partial | 60% | RLS enabled on all 31 tables | `temp_anon` gaps, missing CRUD on ~8 | Audit & fix policies |

### Phase 4: Edge Functions & Gemini

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next |
|------|-------------|--------|---|-------------|------------|---------|
| 011 Edge Infra | Hono server, CORS, JWT middleware | 🟢 Complete | 95% | Single Hono server, CORS `origin: "*"`, JSR imports | Route-level auth varies (some skip) | — |
| 012 Gemini Client | callGemini() with retry/repair | 🟢 Complete | 100% | 313-line production client: 3x retry, 30s timeout, 5-level JSON repair, cache, logging | — | — |
| 013 Edge Stubs | Deploy all route handlers | 🟢 Complete | 100% | 15 routes: 5 AI + 3 wizard + 6 CRM + health | — | — |
| 022 API Key Header | Gemini key in header not URL | 🟢 Done | 100% | `x-goog-api-key` header confirmed | — | Archived |
| 023 Fetch Timeout | AbortController 30s | 🟢 Done | 100% | In `fetchWithRetry()` | — | Archived |
| 024 Hono JSR Imports | npm:hono → jsr:@hono/hono@4 | 🟢 Done | 100% | All 3 server files use JSR | — | Archived |

### Phase 5: Wizard

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next |
|------|-------------|--------|---|-------------|------------|---------|
| 014 Wizard Layout | Three-panel layout, step navigation | 🟢 Complete | 90% | `WizardPage.tsx`, `WizardLayout.tsx`, `WizardSidebar.tsx`, `WizardFooter.tsx` | At `/wizard` (public), needs `/app/wizard` | Move to protected route |
| 015 Wizard Navigation | Step state, validation, progress | 🟢 Complete | 90% | `WizardContext.tsx` (425 lines) — state, validation, navigation | — | — |
| 016 Auto-Save | localStorage + cloud persistence | 🟢 Complete | 85% | localStorage 500ms, cloud 2s debounce via `wizardApi.save()` | No `useAutoSave` hook (inline in context) | Fine as-is |

#### Wizard Step AI Wiring

| Step | Component | Edge Endpoint | AI Status | % | ⚠️ Issue | 💡 Fix |
|------|-----------|---------------|-----------|---|---------|--------|
| 1 Business Context | `StepBusinessContext.tsx` | `POST /analyze-business` | 🟢 Wired | 100% | Falls back to mock on failure | Acceptable |
| 2 Industry Diagnostics | `StepIndustryDiagnostics.tsx` | `POST /industry-diagnostics` | 🔴 Not wired | 10% | Step uses local signal detection, ignores endpoint | Call `aiApi.industryDiagnostics()` |
| 3 System Recommendations | `StepSystemRecommendations.tsx` | `POST /system-recommendations` | 🔴 Not wired | 10% | Static system rankings, no AI | Call `aiApi.systemRecommendations()` |
| 4 Executive Summary | `StepExecutiveSummary.tsx` | `POST /readiness-score` | 🔴 Not wired | 10% | Mock template strings, comment says "TODO Gemini 3" | Call `aiApi.readinessScore()` |
| 5 Launch Project | `StepLaunchProject.tsx` | `POST /generate-roadmap` | 🔴 Not wired | 10% | Displays static summary only | Call `aiApi.generateRoadmap()` |

### Phase 6: Dashboard

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing | 💡 Next |
|------|-------------|--------|---|-------------|------------|---------|
| 025 Dashboard Shell | DashboardLayout + sidebar + header | 🟢 Built | 95% | `DashboardLayout.tsx` with auth guard, sidebar, header | No `/app/*` routes → unreachable | Wire routes |
| 026 Client CRM | Client CRUD + list/detail | 🟢 Built | 90% | 5 components + 6 edge routes (full CRUD) | Unreachable without routes | Wire routes |
| 027 Project Delivery | Projects list + detail + roadmap | 🟢 Built | 90% | `ProjectsList.tsx`, `ProjectDetail.tsx`, `RoadmapPage.tsx`, `RoadmapTimeline.tsx` | Unreachable | Wire routes |
| 028 CRM Pipeline | Pipeline view | 🔴 Stub | 5% | `PlaceholderPage` | No component | Build component |
| 029 AI Insights | Readiness radar, snapshot history | 🟢 Built | 90% | `InsightsPage.tsx`, `ReadinessRadar.tsx`, `ReadinessBreakdown.tsx`, `SnapshotHistory.tsx` | Unreachable | Wire routes |
| 030 AI Agent Mgmt | Agent runs, tokens, cache stats | 🟢 Built | 90% | `AgentsPage.tsx`, `RunHistoryTable.tsx`, `TokenUsagePanel.tsx`, `CacheStatsPanel.tsx` | Unreachable | Wire routes |
| 031 Workflow Automation | Automation dashboard | 🔴 Stub | 5% | `PlaceholderPage` | No component | Build |
| 032 Document Mgmt | Document management | 🔴 Stub | 5% | `PlaceholderPage` | No component | Build |
| 033 Financial | Financial dashboard | 🔴 Stub | 5% | `PlaceholderPage` | No component | Build |
| 034 Activity Analytics | Activity & analytics | 🔴 Stub | 5% | Part of `ActivityFeed.tsx` | Dedicated page missing | Build |
| 035 AI Roadmap | AI roadmap dashboard | 🟢 Built | 90% | `RoadmapPage.tsx` + `RoadmapTimeline.tsx` | Unreachable | Wire routes |
| 036 Services Catalog | Services & systems | 🔴 Stub | 5% | `PlaceholderPage` | No component | Build |

### Phase 7: AI Agent Prompts (Gemini Edge Functions)

| # | Agent | Model | Endpoint | Backend | Frontend Wiring |
|---|-------|-------|----------|---------|----------------|
| 044 | Business Analysis | Flash | `/analyze-business` | 🟢 Full prompt + callGemini | 🟢 Step 1 calls it |
| 045 | Industry Diagnostics | Flash | `/industry-diagnostics` | 🟢 Full prompt + callGemini | 🔴 Step 2 ignores it |
| 046 | System Recommendations | Pro | `/system-recommendations` | 🟢 Full prompt + callGemini | 🔴 Step 3 ignores it |
| 047 | Readiness Scoring | Pro | `/readiness-score` | 🟢 Full prompt + callGemini | 🔴 Step 4 ignores it |
| 048 | Roadmap Generation | Pro | `/generate-roadmap` | 🟢 Full prompt + callGemini | 🔴 Step 5 ignores it |
| — | Dashboard Insights | Flash | `/dashboard-insights` | 🟢 Full prompt + callGemini | 🟢 DashboardHome calls it |

### Phase 8: User Journeys (Reference Docs)

| # | Journey | Status | Notes |
|---|---------|--------|-------|
| 037 | New User Onboarding | 🔴 Not validated | Auth not wired → can't test |
| 038 | Wizard Discovery | 🟡 Partial | Wizard works at `/wizard` (public) |
| 039 | AI Analysis Generation | 🟡 Partial | Only Step 1 calls AI |
| 040 | Roadmap Creation | 🔴 Not functional | Step 5 doesn't call AI |
| 041 | Implementation Planning | 🔴 Not functional | Dashboard unreachable |
| 042 | Project Execution | 🔴 Not functional | Dashboard unreachable |
| 043 | Performance Monitoring | 🔴 Not functional | Dashboard unreachable |

### Phase 9: Workflow Automations

| # | Workflow | Status | Notes |
|---|----------|--------|-------|
| 049 | Lead Qualification | 🔴 Not started | Requires CRM pipeline |
| 050 | Client Onboarding | 🔴 Not started | Requires auth + wizard |
| 051 | AI Opportunity Analysis | 🔴 Not started | Backend ready (agents exist) |
| 052 | Roadmap Generation | 🔴 Not started | Backend ready |
| 053 | Project Task Automation | 🔴 Not started | Requires project tracking |
| 054 | Client Reporting | 🔴 Not started | Requires dashboard data |

---

## Scorecards

### Overall Score by Area

| Area | Tasks | 🟢 Done | 🟡 Partial | 🔴 Open | Score |
|------|-------|---------|-----------|---------|-------|
| Claude Code Setup | 6 | 6 | 0 | 0 | **100%** |
| Marketing Site | 1 | 1 | 0 | 0 | **100%** |
| Foundation | 2 | 0 | 2 | 0 | **65%** |
| Auth | 6 | 1 | 4 | 1 | **50%** |
| Database | 4 | 3 | 1 | 0 | **85%** |
| Edge Functions | 6 | 6 | 0 | 0 | **100%** |
| Wizard UI | 3 | 3 | 0 | 0 | **90%** |
| Wizard AI | 5 | 1 | 0 | 4 | **20%** |
| Dashboard | 12 | 6 | 0 | 6 | **50%** |
| AI Agents (Backend) | 6 | 6 | 0 | 0 | **100%** |
| Journeys | 7 | 0 | 2 | 5 | **10%** |
| Workflows | 6 | 0 | 0 | 6 | **0%** |
| **TOTAL** | **64** | **32** | **9** | **22** | **57%** |

---

## Critical Path — Exact Build Sequence

```
P0 — AUTH WIRING (unblocks everything) ................... 🔴 ~2 hours
  [B3] Pick AuthContext.tsx, remove auth/AuthProvider.tsx
  [B2] Wrap App.tsx <RouterProvider> with <AuthProvider>
  [B1] Add /auth/* + /app/* route groups to routes.tsx
  [---] npm run build verification
  [---] Manual test: signup → login → /app/dashboard

P1 — WIZARD AI WIRING (all endpoints ready) ............. 🔴 ~3 hours
  [B4] Wire Step 2: call aiApi.industryDiagnostics()
  [B4] Wire Step 3: call aiApi.systemRecommendations()
  [B4] Wire Step 4: call aiApi.readinessScore()
  [B4] Wire Step 5: call aiApi.generateRoadmap()
  [---] End-to-end test: wizard 5-step with live Gemini

P2 — RLS & SECURITY ..................................... 🟡 ~2 hours
  [010] Audit & fix RLS policy gaps
  [---] Remove temp_anon policies
  [---] Verify CRUD coverage on all referenced tables

P3 — DASHBOARD STUBS .................................... 🟡 ~1 week
  [028] CRM Pipeline component
  [031] Workflow Automation component
  [032] Document Management component
  [033] Financial Dashboard component
  [034] Activity Analytics page
  [036] Services Catalog component
```

---

## Edge Function Route Map

| Route | Method | Category | Auth | Model | Status |
|-------|--------|----------|------|-------|--------|
| `/health` | GET | Infra | None | — | 🟢 |
| `/signup` | POST | Auth | None | — | 🟢 |
| `/wizard/save` | POST | Wizard | Optional | — | 🟢 |
| `/wizard/:sessionId` | GET | Wizard | Optional | — | 🟢 |
| `/wizard/list/:userId` | GET | Wizard | Optional | — | 🟢 |
| `/analyze-business` | POST | AI | Optional | Flash | 🟢 |
| `/industry-diagnostics` | POST | AI | Optional | Flash | 🟢 |
| `/system-recommendations` | POST | AI | Optional | Pro | 🟢 |
| `/readiness-score` | POST | AI | Optional | Pro | 🟢 |
| `/generate-roadmap` | POST | AI | Optional | Pro | 🟢 |
| `/dashboard-insights` | POST | AI | Required | Flash | 🟢 |
| `/crm/clients` | GET | CRM | Required | — | 🟢 |
| `/crm/clients` | POST | CRM | Required | — | 🟢 |
| `/crm/clients/:id` | GET/PUT/DELETE | CRM | Required | — | 🟢 |
| `/crm/clients/:id/contacts` | POST | CRM | Required | — | 🟢 |

All routes prefixed with `/make-server-283466b6`.

---

## Gemini Model Reference

| Model | ID | Status | Used By |
|-------|-----|--------|---------|
| Flash | `gemini-3-flash-preview` | ✅ Active | analyze-business, industry-diagnostics, dashboard-insights |
| Pro | `gemini-3.1-pro-preview` | ✅ Active | system-recommendations, readiness-score, generate-roadmap |
| Image | `gemini-3.1-flash-image-preview` | ✅ Active | Image generation (not in wizard) |
| ~~gemini-3-pro-preview~~ | — | ⛔ DEPRECATED | Shutdown March 9, 2026 — DO NOT USE |

---

## Dependency Graph

```
FOUNDATION                                    ✅ = done  🟡 = partial  ❌ = missing

  007-009 [✅] ──┐
                  ├──> 010 RLS [🟡] ──> Dashboard auth
  001 Routes [🟡] ──> 002 Supabase [🟡]
                              │
          ┌───────────────────┼───────────────────────┐
          │                   │                       │
    003 Auth UI [🟡]    011 Edge Infra [✅]       CRM Routes [✅]
    004 Auth Supa [🟡]  012 Gemini [✅]
          │              013 Stubs [✅]
    005 Post-Auth [❌] ← CRITICAL BLOCKER: wire routes.tsx
          │
    006 Route Guards [🟡]
          │
    ┌─────┴──────────────────────────────────────────────────┐
    │                                                         │
    014 Wizard Layout [✅]                              025 Dashboard [✅ built, ❌ routed]
    015 Navigation [✅]                                   ├── 026 Clients [✅]
    016 Auto-Save [✅]                                    ├── 027 Projects [✅]
    │                                                      ├── 029 Insights [✅]
    ├── 044 Biz Analysis [✅ backend, ✅ frontend]         ├── 030 Agents [✅]
    ├── 045 Diagnostics [✅ backend, ❌ frontend]          ├── 035 Roadmap [✅]
    ├── 046 Recommendations [✅ backend, ❌ frontend]      ├── 028 Pipeline [❌]
    ├── 047 Readiness [✅ backend, ❌ frontend]             ├── 031 Workflows [❌]
    └── 048 Roadmap Gen [✅ backend, ❌ frontend]           ├── 032 Documents [❌]
                                                            ├── 033 Financial [❌]
                                                            ├── 034 Analytics [❌]
                                                            └── 036 Catalog [❌]
```

---

## File Inventory

| Area | Files | Lines | Key Files |
|------|-------|-------|-----------|
| Marketing Site | 28 pages | ~8,000 | `src/components/*.tsx`, `src/pages/*.tsx` |
| Auth | 6 components | ~600 | `AuthContext.tsx`, `auth/LoginPage.tsx`, `auth/SignupPage.tsx` |
| Wizard | 10 components | ~2,900 | `wizard/WizardContext.tsx` (425), `steps/*.tsx` (2,479) |
| Dashboard | 34 components | ~4,900 | `dashboard/*.tsx`, `dashboard/insights/`, `agents/`, `clients/` |
| Edge Functions | 6 server files | ~1,300 | `server/index.tsx`, `ai-routes.tsx`, `wizard-routes.tsx`, `crm-routes.tsx`, `gemini.tsx`, `db.tsx`, `auth.tsx` |
| API Layer | 1 file | 224 | `src/lib/supabase.ts` |
| Claude Code | 16 files | ~400 | `.claude/hooks/`, `.claude/rules/`, `.claude/agents/` |

---

## Archived Tasks (13)

| # | Task | Status | Reason |
|---|------|--------|--------|
| 01-05 | Wizard screen prompts | Done | Superseded by agent prompts 044-048 |
| 007-009 | Database schemas | Done | Deployed to Supabase |
| 017-021 | Security/backend fixes | Done | Applied & superseded |
| 022-024 | Gemini fixes | Done | Included in 012 rewrite |
