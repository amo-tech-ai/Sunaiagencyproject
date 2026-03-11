---
id: 002-supabase-client-setup
diagram_id: CORE-ARCH-01
prd_section: System Architecture
title: Supabase client initialization and service layer
skill: frontend
phase: CORE
priority: P0
status: Open
owner: Frontend
dependencies:
  - 001-project-foundation
estimated_effort: S
percent_complete: 0
---

## Objective
Initialize the Supabase client with auth, database, and edge function access, and configure Vercel deployment.

## Scope
- Install `@supabase/supabase-js`
- Create `src/lib/supabase.ts` — client initialization with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Auth context provider (`SupabaseAuthProvider`) wrapping the app:
  - Listens to `onAuthStateChange`
  - Exposes `session`, `user`, `loading` state
  - Handles token refresh automatically
- Typed Supabase client using generated database types
- Edge function invocation helper: `invokeFunction(name, body)` with JWT from session
- Vercel config: `vercel.json` SPA rewrite rules (all routes -> `index.html`)
- `.env.local` template with required variables

## Acceptance Criteria
- Supabase client connects to project (no connection errors in console)
- Auth state persists across page refreshes
- `supabase.functions.invoke()` sends JWT in Authorization header
- Vercel deployment serves SPA correctly (deep links work)
- TypeScript types available for all database tables

## Failure Handling
- Missing env vars show clear error message on app start
- Auth state loading shows spinner, not flash of unauthenticated content
