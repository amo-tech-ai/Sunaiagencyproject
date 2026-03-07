---
id: 011-edge-function-shared-infra
diagram_id: CORE-EDGE-01
prd_section: Edge Function Architecture
title: Edge function shared infrastructure — CORS, JWT, rate limit, error handler
skill: backend
phase: CORE
priority: P0
status: Open
owner: Backend
dependencies:
  - 007-database-schema-core
estimated_effort: M
percent_complete: 0
---

## Objective
Build the shared utility layer used by all 18 Supabase Edge Functions: CORS handling, JWT verification, rate limiting, and structured error responses.

## Scope
- `supabase/functions/_shared/` directory with importable modules:
- **cors.ts**:
  - Handle OPTIONS preflight: return 200 with Access-Control-Allow-Origin, Methods, Headers
  - Add CORS headers to all responses
  - Configurable allowed origins (production domain + localhost for dev)
- **auth.ts**:
  - Extract Bearer token from Authorization header
  - Verify JWT via `supabase.auth.getUser(token)`
  - Return user context: `{user_id, org_id, email, role}`
  - Throw 401 if token invalid or missing
- **rate-limit.ts**:
  - Per-user, per-function rate limiting
  - Configurable limits (e.g., 60 req/min for wizard, 10 req/min for AI-heavy functions)
  - Return 429 with retry-after header when exceeded
- **error-handler.ts**:
  - `withErrorHandler(handler)` wrapper for all functions
  - Catches all errors, returns structured JSON: `{error: true, message, code}`
  - Never leaks stack traces, table names, or internal details
  - Maps error types to HTTP status codes (400, 401, 403, 429, 500)
- **response.ts**:
  - `json(data, status)` — JSON response with CORS headers
  - `error(message, status, code)` — error response
- **types.ts**:
  - TypeScript interfaces for request context, error shape, AI config

## Acceptance Criteria
- All shared modules importable from `../_shared/` in any edge function
- CORS preflight returns correct headers for configured origins
- Invalid JWT returns `{error: true, message: "Unauthorized", code: "AUTH_INVALID"}` with 401
- Rate limit exceeded returns 429 with retry-after header
- Errors never leak internal details (no stack traces, no SQL errors)
- TypeScript compiles with no errors

## Failure Handling
- Auth module handles malformed Authorization header gracefully
- Rate limiter falls open on storage failure (allows request, logs error)
- Error handler catches all exception types including Deno-specific errors
