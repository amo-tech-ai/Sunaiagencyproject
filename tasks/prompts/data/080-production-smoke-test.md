---
task_id: 080-QA
title: Production smoke test — verify all dashboard pages and edge function endpoints
phase: MEDIUM
priority: P2
status: Not Started
estimated_effort: 2 hours
area: agency-dashboard
skill: [features/feature-spec]
subagents: []
depends_on: [070-migrate-kv-workflow-financial-to-supabase-tables, 074-cors-origin-restrict-production]
---

# 080 — Production Smoke Test

## Summary Table

| Aspect | Details |
|--------|---------|
| **Scope** | All 14 dashboard pages + wizard + auth + 68+ edge function routes |
| **Method** | Browser testing (pages) + curl (endpoints) |
| **Goal** | Verify no 404s, 500s, blank pages, or broken integrations |
| **Real-World** | "Deploy v35 → strategy page loads blank because route mount order changed" |

---

## Description

**The situation:** The project has 14 dashboard phases, a 5-step wizard, auth flows, and 68+ edge function routes. No automated tests exist. No smoke test has been run against production.

**Why it matters:** Silent regressions can exist for weeks. A broken page discovered by a client demo is catastrophic.

**The build:** Systematic manual test of every page and critical endpoint. Document results with pass/fail per item.

---

## Dashboard Pages Checklist

| # | Page | URL | Check |
|---|------|-----|-------|
| 1 | Dashboard Home | `/app/dashboard` | Loads, shows metrics cards |
| 2 | Projects & Tasks | `/app/projects` | Project list renders |
| 3 | AI Insights | `/app/insights` | Insights cards render |
| 4 | AI Agents | `/app/agents` | Agent stats render, cache panel works |
| 5 | Settings | `/app/settings` | Settings form renders |
| 6 | CRM Clients | `/app/clients` | Client list loads without 401 |
| 7 | CRM Pipeline | `/app/crm/pipelines` | Kanban board renders with stages |
| 8 | Documents | `/app/documents` | Document list or empty state |
| 9 | Workflows | `/app/workflows` | Workflow list or templates |
| 10 | Financial | `/app/financial` | Invoice list, metrics bar |
| 11 | Strategy | `/app/strategy` | 3-column layout or mobile tabs |
| 12 | Client Detail | `/app/clients/:id` | Detail page loads |
| 13 | Project Detail | `/app/projects/:id` | Detail page loads |
| 14 | Roadmap | `/app/roadmap` | Timeline renders |

## Wizard Flow Checklist

| # | Step | URL | Check |
|---|------|-----|-------|
| 1 | Business Context | `/wizard` (step 1) | Form renders, validation works |
| 2 | Industry Diagnostics | `/wizard` (step 2) | Questions load, AI triggers |
| 3 | System Recommendations | `/wizard` (step 3) | Cards render, selection works |
| 4 | Launch Project | `/wizard` (step 4) | Readiness score, brief generation |
| 5 | Executive Summary | `/wizard` (step 5) | Summary renders, onboarding fires |

## Auth Flow Checklist

| # | Flow | Check |
|---|------|-------|
| 1 | Email signup | Account created, auto-confirmed |
| 2 | Email login | Session established, redirect to dashboard |
| 3 | Google OAuth | OAuth redirect works |
| 4 | Logout | Session cleared, redirect to home |
| 5 | Guest/Anonymous | Can access wizard without auth |

## Edge Function Endpoints (curl)

```bash
BASE="https://necxcwhuzylsumlkkmlk.supabase.co/functions/v1/make-server-283466b6"

# Health
curl -s "$BASE/health" | jq .status

# Wizard (no auth)
curl -s "$BASE/wizard/save" -X POST -H "Content-Type: application/json" -d '{}' | head -1

# Strategy (no auth)
curl -s "$BASE/strategy/metrics" | jq .

# CRM (requires auth)
curl -s "$BASE/crm/clients" -H "Authorization: Bearer $TOKEN" | jq length

# Financial (no auth)
curl -s "$BASE/dashboard/financial/metrics" | jq .

# Workflows (no auth)
curl -s "$BASE/dashboard/workflows" | jq .
```

---

## Acceptance Criteria

- [ ] All 14 dashboard pages load without errors
- [ ] Wizard steps 1-5 render correctly
- [ ] Auth login/signup cycle works
- [ ] Edge function `/health` returns 200
- [ ] No console errors on any page
- [ ] No blank/white pages
- [ ] Mobile responsive layout works on all dashboard pages
- [ ] Document results: pass/fail per item with notes

---

## Outcomes

| Before | After |
|--------|-------|
| No testing — regressions silently accumulate | Every page verified working |
| Unknown edge function health | All 68+ routes confirmed |
| Deploy with hope | Deploy with confidence |
