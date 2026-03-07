---
task_id: 006-AUTH
title: Auth & Routing Screen
phase: CRITICAL
priority: P0
status: Not Started
estimated_effort: 3 days
area: auth
wizard_step: null
skill: [design/frontend-design, product/feature-dev, devops/security-hardening]
subagents: [supabase-expert]
edge_function: null
schema_tables: [profiles, organizations, team_members, wizard_sessions]
depends_on: []
figma_prompt: prompts/06-auth-entry.md
mermaid_diagram: mermaid-wizard/01-auth-entry.md
---

# Wizard Entry — Auth & Routing Screen

## Figma Make Prompt

> Design the authentication and entry point screens for "Sun AI Agency" — a premium AI consulting platform. These screens appear before the wizard and handle login, signup, and routing to the appropriate experience.
>
> **Screen A — Login / Signup (Route: /auth)**
>
> **Layout:** Split-screen on desktop (1440px). Left half is branding, right half is the form.
>
> **Left Half (50%, dark teal #0A211F background):**
> - Sun AI Agency logo (white, top left, generous padding)
> - Center vertically:
>   - Large quote or value proposition:
>     - "Turn unclear ideas into structured, executable systems."
>     - 36px Playfair Display, white, max-width 400px
>   - Below: subtle tagline: "AI-powered business consulting" — 16px Lora, white at 60% opacity
> - Bottom: subtle abstract geometric pattern or line art (very minimal, white at 10% opacity)
> - No images, no stock photos — pure typography and space
>
> **Right Half (50%, white background):**
> - Centered form container (max-width 380px)
> - Top: "Welcome" — 28px Playfair Display, dark teal
> - Subtitle: "Sign in to continue to your dashboard" — 14px Lora, gray
>
> **Tab toggle:** "Sign In" | "Create Account" — horizontal pills, active has dark teal background
>
> **Sign In Form:**
> - Email input — label "Email address", full width
> - Password input — label "Password", with show/hide toggle icon
> - "Forgot password?" text link — right-aligned, small, gray
> - "Sign In" button — full width, dark teal background, white text
> - Divider: "or continue with" — line-text-line pattern
> - Google OAuth button — outlined, with Google icon, full width
> - (Optional) GitHub OAuth button — outlined, full width
>
> **Create Account Form:**
> - Full name input
> - Email input
> - Password input — with strength indicator below (bar: weak/medium/strong)
> - Company name input
> - "Create Account" button — full width, lime green background, dark teal text
> - Below: "By creating an account, you agree to our Terms of Service and Privacy Policy" — 12px, gray, with links
>
> **Design Direction:**
> - The left panel creates gravitas — dark, typographic, premium
> - The right panel is clean, functional, fast — no friction
> - No illustrations, no stock photos — the brand speaks through typography
> - Forms use shadcn/ui-style inputs: clean borders, clear labels, obvious focus states
> - Error states: red border on input, error message below in red text
> - Loading state on button: text changes to "Signing in..." with subtle spinner
>
> **Responsive:**
> - Mobile: left panel becomes a small header (dark teal, 120px tall, logo + one-line tagline), form below on white
> - Tablet: left panel becomes 40% width
> - Desktop: 50/50 split
>
> ---
>
> **Screen B — Post-Auth Routing (Route: /app)**
>
> This is a brief routing screen that appears after login. It determines where to send the user.
>
> **Layout:** Centered, white background, minimal.
>
> **Content (centered vertically and horizontally):**
> - Sun AI Agency logo (small, centered)
> - "Setting up your workspace..." — 20px Playfair Display, dark teal
> - Below: subtle loading indicator — three dots pulsing, or a thin lime green progress bar
> - This screen shows for 1-2 seconds while the system checks:
>   - Does the user have an organization? If not → create one
>   - Does the user have an active wizard session? If yes → resume wizard at current_step
>   - Does the user have completed projects? If yes → go to dashboard
>   - Default: → start wizard at step 1
>
> **Design Direction:**
> - Ultra-minimal — just logo, text, and a loading indicator
> - Fast — this screen should be visible for 1-2 seconds max
> - If routing takes longer, show a skeleton of the destination screen instead
>
> ---
>
> **Screen C — Welcome / First-Time Experience (Route: /app/welcome — optional)**
>
> If the user is brand new (no wizard session, no projects), show a brief welcome before starting the wizard.
>
> **Layout:** Centered, max-width 680px, white background.
>
> - Heading: "Welcome to Sun AI Agency" — 32px Playfair Display, centered
> - Subtitle: "Let's build your AI strategy together. This wizard takes about 10 minutes and creates a personalized plan for your business." — 16px Lora, gray, centered
>
> - **What to expect — 3 cards (horizontal row):**
>   1. "Tell us about you" — "5 minutes" — icon: clipboard — "Share your business context and goals"
>   2. "We analyze & recommend" — "3 minutes" — icon: brain/chart — "AI-powered industry diagnostics and system matching"
>   3. "Get your strategy" — "2 minutes" — icon: document/rocket — "Review your executive brief and launch your dashboard"
>
> - CTA: "Start Discovery →" — large button, dark teal, centered
> - Below: "Already have a project? Go to dashboard" — text link, gray
>
> **Design Direction:**
> - Warm, inviting, not overwhelming
> - The 3 cards set expectations and reduce anxiety
> - Time estimates ("10 minutes") reduce abandonment
> - Premium feel but approachable — a senior consultant greeting you, not a corporation

## Workflow

1. **User visits /auth**
   - Display the login/signup form
   - On successful auth: redirect to /app

2. **/app route handler**
   - Get the user session (Supabase auth)
   - Get the user profile (profiles table)
   - Check team_members for org_id and role

3. **If no organization exists:**
   - Create an organization (name from the signup company name)
   - Create a team_member record (role: 'Owner')
   - Create a profile
   - Redirect to /app/welcome (or /app/wizard/step-1)

4. **If role is 'Client':**
   - Check wizard_sessions:
     - If there is an incomplete wizard: redirect to /app/wizard/step-{current_step}
     - If the wizard is completed and there is an active project: redirect to /app/dashboard/{project_id}
     - If there is no wizard session: redirect to /app/wizard/step-1

5. **If role is 'Owner' or 'Consultant':**
   - Redirect to /admin (agency dashboard)

## Agent Behavior
- No AI on auth screens
- Organization and profile creation happen via Supabase client (RLS-protected)
- First-time setup (org + profile + team_member) should be a single transaction
- Auth errors (wrong password, email taken) shown inline, never as alerts/modals
