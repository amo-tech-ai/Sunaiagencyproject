---
id: 013-edge-function-scaffold
diagram_id: CORE-EDGE-01
prd_section: Edge Function Architecture
title: Deploy 18 edge function stubs with shared infrastructure
skill: backend
phase: CORE
priority: P0
status: Open
owner: Backend
dependencies:
  - 011-edge-function-shared-infra
  - 012-gemini-ai-client
estimated_effort: M
percent_complete: 0
---

## Objective
Create and deploy all 18 edge function stubs, each wired to shared infrastructure (CORS, JWT, error handling) and returning placeholder responses.

## Scope
- **10 Wizard functions** (`supabase/functions/`):
  - `analyze-business` — deep business analysis from URL + search
  - `analyst` — industry and market analysis
  - `generate-diagnostics` — gap analysis and opportunity mapping
  - `extractor` — structured data extraction from text
  - `recommend-systems` — match systems to business needs
  - `optimizer` — optimize recommendations for constraints
  - `scorer` — score and rank with readiness breakdown
  - `summary` — generate executive narrative
  - `generate-roadmap` — create phased implementation plan
  - `task-generator` — break phases into actionable tasks
- **3 Dashboard functions**:
  - `assistant` — AI chat for project questions
  - `intelligence-stream` — real-time insights and alerts
  - `dashboard-task-generator` — generate tasks from brief updates
- **5 Agency functions**:
  - `crm-intelligence` — client scoring and risk alerts
  - `planner` — resource and timeline planning
  - `orchestrator` — multi-agent workflow coordination
  - `analytics` — agency-wide metrics and trends
  - `monitor` — health checks and performance tracking
- Each function `index.ts`:
  - Import shared CORS, auth, error handler
  - `Deno.serve()` entry point
  - Handle OPTIONS (CORS preflight)
  - Verify JWT via shared auth module
  - Parse request body
  - Return placeholder JSON: `{status: "ok", agent: "{name}", message: "Not yet implemented"}`
- Directory structure: `supabase/functions/{name}/index.ts`

## Acceptance Criteria
- All 18 functions deploy via `supabase functions deploy`
- Each function responds to POST with valid JWT: returns 200 with placeholder JSON
- Each function responds to POST without JWT: returns 401
- Each function responds to OPTIONS: returns CORS headers
- No function crashes on invocation
- Shared imports resolve correctly from `../_shared/`
- `supabase functions list` shows all 18 functions

## Failure Handling
- Deploy failure for one function does not block others
- Function invocation error returns structured error JSON (not stack trace)
- Missing environment variable (GEMINI_API_KEY) returns clear error message
