---
task_id: 079-AUTH
title: Add /auth/login and /auth/signup routes with split-screen AuthLayout
phase: HIGH
priority: P1
status: Not Started
estimated_effort: 30 minutes
area: auth
wizard_step: null
skill: [product/feature-dev]
subagents: [code-reviewer]
depends_on: []
---

# 079 — Add Auth Split-Screen Routes

## Summary Table

| Aspect | Details |
|--------|---------|
| **Screen** | `/auth/login`, `/auth/signup` |
| **Feature** | Wire existing AuthLayout + LoginPage + SignupPage into routes.tsx |
| **Components** | All exist: `AuthLayout.tsx`, `LoginPage.tsx`, `SignupPage.tsx` |
| **Real-World** | "User visits /auth/login → sees split-screen layout with brand panel + login form" |

---

## Description

**The situation:** Three auth components exist and are fully built:
- `src/components/auth/AuthLayout.tsx` — split-screen layout (brand panel + form area)
- `src/components/auth/LoginPage.tsx` — email/password + OAuth login form
- `src/components/auth/SignupPage.tsx` — registration form with validation

These are NOT routed in `routes.tsx`. The only auth route is `/login` which uses the standalone `AuthPage.tsx` (different component, simpler layout).

**Why it matters:** The split-screen auth layout (`AuthLayout`) provides a polished branded experience with Sun AI branding on the left and auth forms on the right. Currently only the basic `/login` page is accessible. Users cannot navigate to a proper signup flow.

**What already exists:**
- `src/components/auth/AuthLayout.tsx` — split-screen shell with Outlet
- `src/components/auth/LoginPage.tsx` — login form component
- `src/components/auth/SignupPage.tsx` — signup form component
- `src/components/auth/ProtectedRoute.tsx` — JWT guard (not currently used in routes)
- `src/components/AuthContext.tsx` — auth provider wrapping App.tsx
- `src/components/AuthCallbackPage.tsx` — OAuth callback (routed at `/auth/callback`)

**The build:**
1. Add imports to `routes.tsx`: `AuthLayout`, `LoginPage`, `SignupPage`
2. Add `/auth` route group with `AuthLayout` as parent and `login`/`signup` as children
3. Verify `/auth/callback` still works (already routed)
4. Verify `DashboardLayout` auth guard redirects to `/auth/login` (or keep `/login`)
5. Build and test

**Example:** User clicks "Sign Up" from the marketing site → navigates to `/auth/signup` → sees Sun AI branding on left, signup form on right → creates account → redirected to `/app/dashboard`.

---

## Rationale

**Problem:** Split-screen auth components are built but unreachable — users only see the basic `/login` page.
**Solution:** Add 3 lines to routes.tsx to wire the existing components.
**Impact:** Professional branded auth experience accessible at `/auth/login` and `/auth/signup`.

---

## Goals

1. **Primary:** `/auth/login` and `/auth/signup` render their respective components inside AuthLayout

## Acceptance Criteria

- [ ] `/auth/login` renders LoginPage inside AuthLayout
- [ ] `/auth/signup` renders SignupPage inside AuthLayout
- [ ] `/auth/callback` still handles OAuth redirects
- [ ] `npm run build` passes
- [ ] Navigation between login and signup works

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Routes | `src/routes.tsx` | Modify — add `/auth` route group with children |
| Components | `src/components/auth/*.tsx` | No change — all exist |

---

## Outcomes

| Before | After |
|--------|-------|
| Only `/login` (basic AuthPage) accessible | `/auth/login` and `/auth/signup` with branded split-screen |
| No signup route | `/auth/signup` with registration form |
| Auth components unreachable | All auth components routed and functional |
