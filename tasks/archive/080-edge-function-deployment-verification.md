---
task_id: 080-DEPLOY
title: Deploy and verify all edge function routes on Supabase
phase: HIGH
priority: P2
status: Not Started
estimated_effort: 1 hour
area: infrastructure
wizard_step: null
skill: [devops/edge-function-creator, data/supabase-edge-functions]
subagents: [security-auditor]
depends_on: []
---

# 080 — Deploy & Verify Edge Functions

## Summary Table

| Aspect | Details |
|--------|---------|
| **Target** | Supabase project `necxcwhuzylsumlkkmlk` |
| **Feature** | Deploy all 7 edge function route modules, verify each endpoint responds |
| **Route Modules** | wizard, ai, crm, pipeline, documents, workflows, financial |
| **Real-World** | "Deploy edge functions → verify /health returns ok → verify all endpoints respond with correct status codes" |

---

## Description

**The situation:** The Hono server (`src/supabase/functions/server/index.tsx`) mounts 7 route modules: wizard, ai, crm, pipeline, documents, workflows, and financial. The wizard, ai, and crm routes have been deployed and verified. The pipeline, documents, workflows, and financial routes were recently added and need deployment and verification.

**Why it matters:** Dashboard pages (CRM Pipeline, Documents, Workflows, Financial) are now wired to real components that call their respective APIs (`pipelineApi`, `documentApi`, `workflowApi`, `financialApi` in `supabase.ts`). Without deployed edge functions, these pages will show errors.

**What already exists:**
- `src/supabase/functions/server/index.tsx` — main Hono server mounting all routes
- `src/supabase/functions/server/pipeline-routes.tsx` — CRM pipeline CRUD
- `src/supabase/functions/server/document-routes.tsx` — document management
- `src/supabase/functions/server/workflow-routes.tsx` — workflow CRUD + execution
- `src/supabase/functions/server/financial-routes.tsx` — invoice + payment management
- `src/lib/supabase.ts` — frontend API clients (`pipelineApi`, `documentApi`, `workflowApi`, `financialApi`)
- Supabase project: `necxcwhuzylsumlkkmlk`

**The build:**
1. Deploy edge function bundle to Supabase using `supabase functions deploy server`
2. Verify `/health` endpoint returns `{ status: "ok" }`
3. Test each new route module with authenticated requests:
   - `GET /crm/pipelines` — should return pipeline list
   - `GET /documents` — should return document list
   - `GET /workflows` — should return workflow list
   - `GET /financial/invoices` — should return invoice list
4. Verify CORS headers on all endpoints
5. Check edge function logs for any startup errors

**Example:** After deployment, an authenticated user visits `/app/workflows` → the `WorkflowAutomationPage` component calls `workflowApi.list()` → edge function returns workflow data → page renders active workflows, templates, and execution log.

---

## Rationale

**Problem:** 4 dashboard pages are wired to real components but their backend endpoints aren't deployed.
**Solution:** Deploy the unified Hono server bundle with all route modules, verify each endpoint.
**Impact:** CRM Pipeline, Documents, Workflows, and Financial dashboard pages become functional.

---

## Goals

1. **Primary:** All 7 route modules responding on production Supabase
2. **Quality:** Each endpoint returns correct HTTP status and valid JSON

## Acceptance Criteria

- [ ] `supabase functions deploy server` succeeds
- [ ] `GET /health` returns `{ status: "ok" }`
- [ ] Pipeline routes respond (GET /crm/pipelines)
- [ ] Document routes respond (GET /documents)
- [ ] Workflow routes respond (GET /workflows)
- [ ] Financial routes respond (GET /financial/invoices)
- [ ] No errors in edge function logs (`supabase functions logs server`)
- [ ] CORS headers present on all responses
- [ ] Authenticated endpoints reject unauthenticated requests with 401

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Deployment | `supabase/functions/server/` | Deploy via Supabase CLI or MCP |
| Verification | curl / MCP execute_sql | Test each endpoint |
| Monitoring | Supabase Dashboard | Check function logs |

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| DB tables don't exist yet | Routes return empty arrays, not 500 errors |
| Auth token expired | Return 401 with clear error message |
| Rate limit exceeded | Return 429 (if rate limiting configured) |
| Unknown route hit | Return 404 with descriptive message |

---

## Outcomes

| Before | After |
|--------|-------|
| Dashboard pages show loading/error states | Dashboard pages load real data from edge functions |
| Only wizard/ai/crm routes deployed | All 7 route modules live and responding |
| Pipeline/Document/Workflow/Financial features broken | Full CRUD operations working end-to-end |
