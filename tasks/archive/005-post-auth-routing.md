---
id: 005-post-auth-routing
diagram_id: CORE-AUTH-01
prd_section: Authentication and Entry Flow
title: Post-auth routing logic and welcome screen
skill: frontend
phase: CORE
priority: P0
status: Open
owner: Frontend
dependencies:
  - 004-auth-supabase-integration
estimated_effort: M
percent_complete: 0
---

## Objective
Build the `/app` entry point that inspects user state and routes to the correct destination, plus the `/app/welcome` first-time experience.

## Scope
- `/app` route component with routing logic:
  1. Show brief loading transition (1-2s)
  2. Query: `SELECT * FROM organizations WHERE owner_id = user.id`
  3. No organization -> redirect to `/app/welcome`
  4. Has org -> query: `SELECT * FROM wizard_sessions WHERE org_id = ? ORDER BY created_at DESC LIMIT 1`
  5. No wizard session -> redirect to `/app/wizard/step-1`
  6. Wizard status != completed -> redirect to `/app/wizard/step-{current_step}`
  7. Wizard completed -> query: `SELECT * FROM projects WHERE org_id = ? LIMIT 1`
  8. Has projects -> redirect to `/app/dashboard`
  9. No projects -> redirect to `/app/wizard/step-1`
- `/app/welcome` screen:
  - Centered layout, max-width 680px
  - 3 expectation cards explaining the wizard process
  - "Begin Your AI Strategy" CTA button
  - CTA creates: organization record + wizard_session (current_step=1, status=in_progress)
  - After creation: redirect to `/app/wizard/step-1`

## Acceptance Criteria
- New user (no org) routes to `/app/welcome`
- Welcome CTA creates org + wizard_session, redirects to step 1
- User with incomplete wizard resumes at exact `current_step`
- User with completed project routes to `/app/dashboard`
- Loading transition visible during DB queries (no blank flash)
- Handles edge case: user has org but no wizard and no projects

## Failure Handling
- DB query failure shows error with retry button
- Org creation failure shows error toast
- Loading state has timeout (5s) then shows "Something went wrong" with retry
