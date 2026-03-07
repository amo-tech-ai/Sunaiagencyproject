---
id: 004-auth-supabase-integration
diagram_id: CORE-AUTH-01
prd_section: Authentication and Entry Flow
title: Supabase auth integration for email and Google OAuth
skill: frontend
phase: CORE
priority: P0
status: Open
owner: Frontend
dependencies:
  - 002-supabase-client-setup
  - 003-auth-ui-layout
estimated_effort: M
percent_complete: 0
---

## Objective
Wire the auth forms to Supabase Auth for email/password sign-in, sign-up, and Google OAuth.

## Scope
- Sign In: `supabase.auth.signInWithPassword({email, password})`
  - Success: session stored in auth context, navigate to `/app`
  - Error: show toast with error message (invalid credentials, user not found)
- Sign Up: `supabase.auth.signUp({email, password, options: {data: {full_name}}})`
  - Success: create profile record `INSERT INTO profiles (id, email, full_name, role)`
  - Error: show toast (email already registered, weak password)
- Google OAuth: `supabase.auth.signInWithOAuth({provider: 'google'})`
  - Configure redirect URL in Supabase dashboard
  - Handle OAuth callback: check if new user, UPSERT profile from Google data (name, email, avatar)
- Auth state change listener updates context
- On successful auth: navigate to `/app` (post-auth routing handles destination)

## Acceptance Criteria
- Email sign-in works with valid credentials, returns JWT session
- Email sign-up creates `auth.users` record + `profiles` row
- Google OAuth redirects to Google, authenticates, returns to app
- Invalid credentials show specific error message
- Email-already-taken shows specific error message
- Session persists after page refresh (cookie/localStorage)
- Signing out clears session and redirects to `/auth`

## Failure Handling
- Network error during auth shows "Connection failed, please try again"
- OAuth popup blocked shows fallback instruction
- Profile creation failure does not block authentication (log error, retry later)
