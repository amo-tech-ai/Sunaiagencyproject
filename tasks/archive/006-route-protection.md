---
id: 006-route-protection
diagram_id: CORE-AUTH-01
prd_section: Authentication and Entry Flow
title: Protected route guards with JWT and role verification
skill: frontend
phase: CORE
priority: P0
status: Open
owner: Frontend
dependencies:
  - 004-auth-supabase-integration
estimated_effort: S
percent_complete: 0
---

## Objective
Implement route guards that protect `/app/*` and `/admin/*` routes based on authentication state and user role.

## Scope
- `ProtectedRoute` wrapper component:
  - Check for valid JWT session from auth context
  - No session -> redirect to `/auth?returnUrl={current_path}`
  - Expired token -> attempt `supabase.auth.refreshSession()`
  - Refresh fails -> redirect to `/auth`
  - Valid session -> render child routes
- `AdminRoute` wrapper component (extends ProtectedRoute):
  - After auth check, verify role from `team_members` or `profiles` table
  - Role must be `Owner` or `Consultant`
  - Insufficient role -> render 403 access denied page
- 403 page: "You don't have permission to access this page" with link to `/app/dashboard`
- No flash of protected content before redirect (show loading during checks)

## Acceptance Criteria
- Unauthenticated user visiting `/app/dashboard` redirects to `/auth?returnUrl=/app/dashboard`
- After login, user returns to `/app/dashboard` via returnUrl parameter
- Expired token auto-refreshes silently when possible
- Client role user visiting `/admin/*` sees 403 page
- Owner/Consultant visiting `/admin/*` proceeds normally
- No flash of protected content during auth check (loading screen shown)

## Failure Handling
- Token refresh network error redirects to `/auth`
- Role check failure (DB error) defaults to deny access
