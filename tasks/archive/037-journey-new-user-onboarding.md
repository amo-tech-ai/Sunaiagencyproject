---
id: 037-journey-new-user-onboarding
diagram_id: JOURNEY-01
prd_section: User Journeys
title: New user onboarding journey — from landing page to first wizard step
skill: frontend
phase: CRITICAL
priority: P0
status: Not Started
owner: Frontend
dependencies: []
estimated_effort: L
percent_complete: 0
area: auth
wizard_step: null
schema_tables: [profiles, organizations, team_members, wizard_sessions]
figma_prompt: prompts/037-journey-new-user-onboarding.md
---

# JOURNEY-01: New User Onboarding Journey

## Summary Table

| Field              | Value                                                                 |
| ------------------ | --------------------------------------------------------------------- |
| **Journey ID**     | JOURNEY-01                                                            |
| **Prompt ID**      | 037-journey-new-user-onboarding                                       |
| **Title**          | New user onboarding journey — from landing page to first wizard step  |
| **Phase**          | CRITICAL                                                              |
| **Priority**       | P0                                                                    |
| **Owner**          | Frontend                                                              |
| **Effort**         | L                                                                     |
| **Area**           | auth                                                                  |
| **Schema Tables**  | profiles, organizations, team_members, wizard_sessions                |
| **Dependencies**   | None                                                                  |
| **Status**         | Not Started                                                           |

---

## Description

### Situation

A prospective client visits the Sun AI Agency marketing site for the first time. They have heard about AI transformation but do not know where to start. The landing page (HomePageV3) presents a clear call-to-action — "Discover Your AI Potential" — that funnels them into the platform. Today, there is no authenticated user flow; visitors browse static marketing pages and eventually book a call. The platform needs a seamless path from anonymous visitor to authenticated user ready to begin the wizard.

### Why It Matters

First impressions determine conversion. If the onboarding path has friction — slow sign-up, confusing steps, unclear value — prospective clients abandon before reaching the wizard. Every drop-off here is a lost deal. The onboarding journey must feel effortless: three clicks from landing page to wizard Step 1. This is the top of the entire funnel and gates every downstream journey (wizard, dashboard, project execution).

### What Exists

The marketing site already has HomePageV3 with styled CTA buttons, a design system (dark teal #0A211F, lime #84CC16, beige #F1EEEA, Playfair Display headings, Lora body), and React Router client-side routing. Supabase is configured as the backend with auth support. The database schema includes profiles, organizations, and team_members tables. No auth UI, onboarding form, or session-creation logic exists yet.

### The Build

1. **Auth page** (`/auth`) — Sign-up form with email/password fields and Google OAuth button. Minimal design: centered card on beige background, dark teal heading, lime accent on primary button. On successful sign-up, Supabase creates the auth.users record and triggers profile creation.

2. **Onboarding form** (`/onboard`) — Three fields: company name (text input), your role (dropdown: CEO, CTO, VP Operations, Marketing Director, Other), industry hint (dropdown matching wizard industries). This is a single-screen form, not a multi-step flow. Submit creates the organization, links the profile, and creates the team_member record with role='owner'.

3. **Auto-redirect logic** — After onboarding form submission, the system creates a new wizard_session (org_id from the new organization, status='in_progress') and redirects to `/wizard`. The wizard picks up the industry hint from the onboarding form to pre-fill Step 1.

4. **Guest path** — A secondary "Try without signing up" link on the auth page skips authentication entirely. The guest enters the wizard with an anonymous session (org_id=null, stored only in localStorage). At Step 5 (Launch Project), the guest is prompted to sign up. On sign-up, the anonymous session is migrated: organization created, wizard_session updated with org_id, all wizard_answers linked.

5. **Session recovery** — If a user signs in and already has an incomplete wizard_session, they are redirected to the wizard at their last completed step instead of the onboarding form.

### Example

Maria, a boutique hotel owner, visits sunai.agency. She reads about AI-powered guest experiences and clicks "Discover Your AI Potential." She signs up with Google OAuth (one click), fills in "Seaside Boutique Hotel" as company name, selects "CEO" as role, and picks "Hospitality" as industry. The system creates her organization and profile, then redirects her to the wizard where Step 1 already shows "Hospitality" pre-selected. Total time from CTA click to wizard: under 90 seconds.

---

## User Stories

| ID       | Story                                                                                                          | Priority |
| -------- | -------------------------------------------------------------------------------------------------------------- | -------- |
| US-037-1 | As a new visitor, I can click the CTA on the landing page and be taken to the sign-up page.                    | P0       |
| US-037-2 | As a new user, I can sign up with email/password or Google OAuth.                                              | P0       |
| US-037-3 | As a newly signed-up user, I am shown an onboarding form to enter my company name, role, and industry hint.    | P0       |
| US-037-4 | As a user completing onboarding, my organization and team membership are created automatically.                 | P0       |
| US-037-5 | As a user completing onboarding, I am redirected to the wizard with a new session pre-filled from my inputs.   | P0       |
| US-037-6 | As a guest, I can skip sign-up and start the wizard anonymously with data stored in localStorage.              | P1       |
| US-037-7 | As a guest reaching Step 5, I am prompted to sign up and my anonymous session is migrated to my new account.   | P1       |
| US-037-8 | As a returning user with an incomplete wizard, I am redirected to my last step instead of the onboarding form. | P1       |

---

## Goals & Acceptance Criteria

- [ ] Landing page CTA navigates to `/auth` without full page reload
- [ ] Auth page renders sign-up form with email, password, and confirm-password fields
- [ ] Auth page renders Google OAuth button that initiates Supabase OAuth flow
- [ ] Successful sign-up creates a row in `profiles` linked to `auth.users.id`
- [ ] Onboarding form (`/onboard`) collects company name (required), role (required), industry hint (optional)
- [ ] Onboarding submit creates `organizations` row with company name
- [ ] Onboarding submit creates `team_members` row with `role='owner'` linking profile to organization
- [ ] Onboarding submit creates `wizard_sessions` row with `org_id` and `status='in_progress'`
- [ ] After onboarding, user is redirected to `/wizard` and Step 1 industry field is pre-filled if industry hint was provided
- [ ] Guest path: "Try without signing up" link bypasses auth and loads wizard with localStorage-only session
- [ ] Guest path: At wizard Step 5, a sign-up modal appears; on completion, anonymous session is migrated to the new account
- [ ] Returning user with existing incomplete wizard_session is redirected to `/wizard` at last completed step
- [ ] All form validations display inline error messages styled in the design system
- [ ] Auth errors (duplicate email, weak password, OAuth failure) show user-friendly messages
- [ ] Entire flow from CTA to wizard Step 1 completes in under 4 user interactions

---

## Screen Flow

### Screen 1: Landing Page (HomePageV3 — existing)

- **Route**: `/`
- **Key Element**: Hero section CTA button labeled "Discover Your AI Potential"
- **Action**: Click CTA
- **Transition**: Client-side navigate to `/auth`

### Screen 2: Auth Page

- **Route**: `/auth`
- **Layout**: Centered card (max-w-md) on beige (#F1EEEA) background
- **Elements**:
  - Playfair Display heading: "Start Your AI Journey"
  - Email input field
  - Password input field
  - Confirm password field
  - "Sign Up" button (dark teal bg, white text)
  - Divider with "or"
  - "Continue with Google" OAuth button (outline style)
  - Link: "Try without signing up" (muted text, routes to `/wizard` as guest)
  - Link: "Already have an account? Sign in" (toggles form to sign-in mode)
- **Action**: Submit sign-up form or complete OAuth
- **Transition**: On success, navigate to `/onboard`

### Screen 3: Onboarding Form

- **Route**: `/onboard`
- **Layout**: Centered card (max-w-lg) on beige background
- **Elements**:
  - Playfair Display heading: "Tell Us About Your Business"
  - Subtext (Lora): "This helps us personalize your AI discovery experience"
  - Company name text input (required)
  - Role dropdown: CEO, CTO, VP Operations, Marketing Director, Other (required)
  - Industry hint dropdown: matching wizard industry list (optional, labeled "Primary Industry")
  - "Continue to AI Discovery" button (lime #84CC16 bg, dark text)
- **Action**: Submit form
- **Transition**: Create org + team_member + wizard_session, then navigate to `/wizard`

### Screen 4: Wizard Step 1 (handoff)

- **Route**: `/wizard`
- **State**: New wizard_session loaded, industry pre-filled from onboarding
- **Note**: This screen is defined in JOURNEY-02 (prompt 038)

---

## Data Flow

| Step                  | Action                          | Table(s) Written                              | Table(s) Read                  | Notes                                             |
| --------------------- | ------------------------------- | --------------------------------------------- | ------------------------------ | ------------------------------------------------- |
| Sign up               | Create account                  | auth.users, profiles                          | —                              | Profile row created via Supabase trigger or API    |
| Onboarding submit     | Create organization             | organizations                                 | profiles                       | org name from form, created_by from profile id     |
| Onboarding submit     | Link user to org                | team_members                                  | profiles, organizations        | role='owner', profile_id, org_id                   |
| Onboarding submit     | Create wizard session           | wizard_sessions                               | organizations                  | org_id, status='in_progress', created_at=now()     |
| Wizard entry          | Pre-fill industry               | —                                             | wizard_sessions, organizations | Read industry hint stored during onboarding        |
| Guest entry           | Local session                   | — (localStorage only)                         | —                              | No DB writes until sign-up at Step 5               |
| Guest sign-up (St. 5) | Migrate session                 | profiles, organizations, team_members, wizard_sessions, wizard_answers | localStorage | Bulk insert/update from local data     |
| Return visit          | Check existing session          | —                                             | wizard_sessions                | Query for incomplete session by profile_id         |

---

## AI Touchpoints

This journey does not invoke any AI agents directly. The AI interaction begins at wizard Step 1 (JOURNEY-02). However, the onboarding form industry hint is passed downstream to the `analyze-business` agent as a pre-fill signal, reducing the amount of input required in Step 1.

---

## Edge Cases

| # | Scenario                                      | Handling                                                                                   |
|---|-----------------------------------------------|--------------------------------------------------------------------------------------------|
| 1 | User signs up with email that already exists   | Show inline error: "An account with this email already exists. Sign in instead?" with link |
| 2 | OAuth popup blocked by browser                 | Detect blocked popup, show fallback: "Please allow popups or use email sign-up"            |
| 3 | User refreshes during onboarding form          | Form state persisted in sessionStorage; restored on reload                                 |
| 4 | User navigates directly to /wizard without auth | Treated as guest path; wizard loads with anonymous localStorage session                   |
| 5 | User signs up but closes tab before onboarding | On next sign-in, detect profile without organization, redirect to /onboard                 |
| 6 | Guest accumulates data then signs up with existing account | Merge: if existing account has no wizard session, adopt guest data; if conflict, prompt user to choose |
| 7 | Multiple browser tabs open during sign-up      | Supabase auth state synced via onAuthStateChange listener; all tabs update                 |
| 8 | Onboarding form submitted with empty company name | Client-side validation prevents submit; inline error shown                              |
| 9 | Network failure during organization creation   | Retry with exponential backoff (3 attempts); on failure, show error with "Try again" button |
| 10 | User has multiple organizations (future)      | V1: one org per user; future: org switcher in header                                       |

---

## Outcomes

| Outcome                          | Metric                                   | Target                |
| -------------------------------- | ---------------------------------------- | --------------------- |
| Conversion from landing to auth  | CTA click-through rate                   | > 15% of visitors     |
| Sign-up completion rate          | % of auth page visitors who complete     | > 60%                 |
| Onboarding completion rate       | % of signed-up users completing onboard  | > 90%                 |
| Time to wizard                   | Median seconds from CTA to wizard Step 1 | < 90 seconds          |
| Guest conversion rate            | % of guests who sign up at Step 5        | > 40%                 |
| Session recovery rate            | % of returning users resuming wizard     | > 80%                 |
