---
task_id: 005-WIZ
title: Wizard Step 5 — Project Creation & Dashboard Entry
phase: CRITICAL
priority: P0
status: Not Started
estimated_effort: 3 days
area: wizard
wizard_step: 5
skill: [design/frontend-design, product/feature-dev, product/api-wiring, data/database-migration]
subagents: [supabase-expert]
edge_function: task-generator
schema_tables: [projects, context_snapshots, roadmaps, roadmap_phases, tasks, project_services, wizard_sessions]
depends_on: [004-WIZ]
figma_prompt: prompts/05-dashboard-entry.md
mermaid_diagram: mermaid-wizard/06-launch-project.md
---

# Wizard Step 5 — Project Creation & Dashboard Entry

## Figma Make Prompt

> Design Step 5 of a 5-step premium wizard for "Sun AI Agency." This is the final screen — "Launch Project" — a celebration and transition moment where the wizard results become a live project with a dashboard. This is NOT a form screen. It's a confirmation and launch screen.
>
> **Layout:** This screen breaks from the three-panel layout. Use a focused, centered single-column layout with a full-width background. The three-panel served its purpose — now we're transitioning to the dashboard world.
>
> **Full-width layout (1440px max, centered):**
>
> - **Top Section — Completion Header (full-width, subtle gradient from beige to white):**
>   - Horizontal step indicator showing all 5 steps completed (all green checkmarks)
>   - Large heading: "Your project is ready" — 40px Playfair Display, dark teal, centered
>   - Subtitle: "Everything from your discovery session has been turned into an actionable project." — 18px Lora, medium gray, centered
>   - Subtle decorative element: a thin horizontal lime green line (80px wide, centered) below the subtitle
>
> - **Middle Section — Project Summary Card (centered, max-width 800px):**
>   - Large white card, 16px radius, generous padding (40px)
>   - Card has a very subtle lime green left border (4px)
>
>   - **Project header row:**
>     - Left: "PROJECT" label (12px, uppercase, lime green) above the project name
>     - Project name: "Acme Retail Group — AI Transformation" — 24px Playfair Display
>     - Right: Status badge "Active" in lime green pill
>
>   - **Project details grid (2 columns, 4 rows):**
>     - Client: Acme Retail Group
>     - Industry: E-commerce / Retail
>     - Phase: Phase 1 — Foundation
>     - Timeline: 12 weeks
>     - Systems: 3 selected (with small system icons)
>     - Tasks: 12 initial tasks generated
>     - Brief: Approved
>     - Dashboard: Ready
>
>   - **Divider**
>
>   - **Roadmap Preview (compact, horizontal):**
>     - Three connected phase cards in a horizontal row:
>       - Phase 1: "Foundation" — Weeks 1-4 — "Current" badge (lime green)
>       - Phase 2: "Implementation" — Weeks 5-8
>       - Phase 3: "Optimization" — Weeks 9-12
>     - Cards connected by a thin horizontal line with arrow
>     - Phase 1 has a subtle glow/highlight to show it's the starting point
>
>   - **Divider**
>
>   - **What's been created (checklist):**
>     - Project created with all wizard data — green check
>     - Roadmap with 3 phases set — green check
>     - 12 initial tasks generated — green check
>     - Strategy brief attached — green check
>     - Dashboard ready for you — green check
>     - Each item: green checkmark icon + text, subtle left padding
>     - Animation: checks appear one by one with staggered fade-in (100ms delay each) when screen loads
>
> - **Bottom Section — Call to Action (centered):**
>   - Primary CTA button: "Enter Your Dashboard ->"
>     - Large button: min-width 280px, 52px height
>     - Dark teal background, white text, 8px radius
>     - On hover: lime green background, dark teal text
>     - Subtle shadow on hover (only place shadows are used)
>   - Below button: "You can return to this wizard anytime from your dashboard settings"
>   - 14px Lora, medium gray
>
> - **Quick Tour Preview (optional section below CTA, max-width 1000px):**
>   - Heading: "What you'll find in your dashboard" — 20px Playfair Display, centered
>   - 4 preview cards in a horizontal row:
>     - **Roadmap** — icon: timeline/gantt — "Track phases, milestones, and deliverables"
>     - **Tasks** — icon: checklist — "Manage your action items by phase and priority"
>     - **Strategy Brief** — icon: document — "Reference your approved brief anytime"
>     - **Documents** — icon: folder — "Upload and manage all project files"
>   - Each card: white background, 12px radius, icon at top (40px, lime green), title (16px bold), description (14px gray)
>   - Cards have hover: slight y-translate up (2px) with transition
>
> **Design Direction:**
> - This screen should feel like a moment of accomplishment — calm, confident, satisfying
> - The staggered checklist animation creates a sense of "things being built for you"
> - The project summary card should feel substantial — like a signed contract or a finalized plan
> - The CTA button should be the obvious focal point — no competing elements
> - No left or right panels — this is a focused, centered experience
> - The transition from wizard (three-panel) to this screen (centered) should feel like stepping into a new chapter
> - Motion is used intentionally here: checklist stagger, button hover, preview card hover
> - But never flashy — everything is subtle, professional, premium
> - This is the "handshake moment" — the wizard has done its job, now it's time to work
>
> **Responsive:**
> - Mobile (375px): everything stacks vertically. Project details become single column. Roadmap phases stack vertically with connecting vertical line. Preview cards become 2x2 grid, then 1-column on very small screens
> - Tablet (768px): same layout, slightly tighter padding. Preview cards 2x2 grid
> - Desktop (1440px): full layout as described
>
> **Background:**
> - Very subtle pattern or texture on the beige background (optional) — like a fine linen texture at 2% opacity
> - Or: clean flat beige (#F1EEEA) — either works, keep it minimal

---

## Screen Purpose
Confirm that the wizard is complete, show what was created, and transition the user into their project dashboard. This is a moment of accomplishment — the user has gone from "unclear idea" to "structured project." The design should feel like arriving, not like another step.

---

## Layout Specification

### Left Panel — All Complete

The left panel is divided into two vertical sections.

**Upper section — Discovery Wizard stepper:**
The heading "DISCOVERY WIZARD" appears at the top. Below it, all five steps are listed vertically, each with a green checkmark indicating completion:

- Step 1: Business Context (green check)
- Step 2: Industry Analysis (green check)
- Step 3: System Recs (green check)
- Step 4: Executive Brief (green check)
- Step 5: Dashboard Entry (green check, completed)

**Lower section — Completion summary:**
A horizontal divider separates the stepper from a small metadata block. The label "COMPLETED" appears, followed by the date "March 7, 2026." Below that, the label "Duration" appears with the value "12 minutes."

### Center Panel — Confirmation

The center panel presents a vertically stacked confirmation layout.

**Heading area:**
Centered at the top, a large heading in Playfair Display at 36px reads: "Your project is ready." Below it, a subheading in Lora at 18px in a muted tone reads: "Everything you shared has been turned into a structured plan." Generous vertical spacing separates this from the content below.

**Project created card:**
A bordered card displays the project summary. At the top of the card, a small uppercase label (12px caps) in green reads "PROJECT CREATED." Below it, the project title "Acme Corp — AI Strategy & Implementation" is set in Playfair Display at 24px. Four metadata lines follow:

- Status: Active
- Phase: Phase 1 — Foundation
- Timeline: 90 days
- Systems: 2 selected

**Primary CTA button:**
Below the project card, a full-width button (56px height) with a lime green (#84CC16) background and white text reads "Enter Your Dashboard" followed by a right arrow. This is the primary call to action for the entire screen.

**"What We Created For You" section:**
A labeled divider reads "WHAT WE CREATED FOR YOU." Below it, three preview cards are arranged in a horizontal row, evenly spaced:

- **Roadmap card** — Heading: "ROADMAP." Details: "3 phases, 90 days." A "View" link with a right arrow at the bottom.
- **Tasks card** — Heading: "TASKS." Details: "8 tasks ready." A "View" link with a right arrow at the bottom.
- **Brief card** — Heading: "BRIEF." Details: "Draft v1.0, Ready to review." A "View" link with a right arrow at the bottom.

**"Selected Systems" section:**
A labeled divider reads "SELECTED SYSTEMS." Below it, a bordered container lists the chosen systems, each on its own row with a green checkmark:

- AI Cart Recovery System — Phase 1
- AI Customer Support Engine — Phase 2

### Right Panel — What's Next Guide

The right panel is divided into three vertical sections, each separated by horizontal dividers.

**What's Next section:**
The heading "WHAT'S NEXT" appears in 12px uppercase. Below it, a card contains introductory text: "Your dashboard is your command center from here on. Here's what you can do:" followed by a list of capabilities, each prefixed with an arrow:

- Track your roadmap progress
- Manage and update your tasks
- Review and approve your strategy brief
- Upload additional documents
- Communicate with your Sun AI team

**Your Team section:**
The heading "YOUR TEAM" appears. Below it, a card reads: "A Sun AI consultant will review your project and reach out within 24 hours."

**Need Help section:**
The heading "NEED HELP?" appears. Below it, a card reads: "support@sunai.agency or use the chat in your dashboard."

---

## Content Data

### Project Summary Fields
| Field | Source | Value (Example) |
|-------|--------|-----------------|
| Project name | Auto-generated | "{client_name} — AI Transformation" |
| Client | clients.name | "Acme Retail Group" |
| Industry | wizard_answers step-1 | "E-commerce / Retail" |
| Phase | projects.current_phase | "Phase 1 — Foundation" |
| Timeline | roadmaps.total_duration | "12 weeks" |
| Systems | project_systems count | "3 selected" |
| Tasks | tasks count | "12 initial tasks generated" |
| Brief | briefs.status | "Approved" |
| Dashboard | projects.dashboard_activated_at | "Ready" |

### Roadmap Phases (from Step 4)
| Phase | Title | Timeline | Status |
|-------|-------|----------|--------|
| Phase 1 | Foundation | Weeks 1-4 | Current |
| Phase 2 | Implementation | Weeks 5-8 | Upcoming |
| Phase 3 | Optimization | Weeks 9-12 | Upcoming |

### Dashboard Preview Cards
| Card | Icon | Title | Description |
|------|------|-------|-------------|
| 1 | Timeline | Roadmap | Track phases, milestones, and deliverables |
| 2 | Checklist | Tasks | Manage your action items by phase and priority |
| 3 | Document | Strategy Brief | Reference your approved brief anytime |
| 4 | Folder | Documents | Upload and manage all project files |

### Checklist Items (staggered animation)
| # | Item | Delay |
|---|------|-------|
| 1 | Project created with all wizard data | 0ms |
| 2 | Roadmap with 3 phases set | 100ms |
| 3 | 12 initial tasks generated | 200ms |
| 4 | Strategy brief attached | 300ms |
| 5 | Dashboard ready for you | 400ms |

---

## What Happens in the Background

When user reaches Step 5, these operations run automatically:

| # | Operation | Table | Details |
|---|-----------|-------|---------|
| 1 | Create project | `projects` | status: Active, linked to client |
| 2 | Create context snapshot | `context_snapshots` | From wizard data, is_active: true |
| 3 | Create roadmap | `roadmaps` | Linked to snapshot, 90 days total |
| 4 | Create phases | `roadmap_phases` | 3 phases, order_index 1-3 |
| 5 | Seed tasks | `tasks` | AI-generated initial tasks per phase |
| 6 | Link systems | `project_services` | Selected systems -> service mapping |
| 7 | Mark wizard complete | `wizard_sessions` | wizard_completed_at = now() |
| 8 | Activate dashboard | `projects` | dashboard_activated_at = now() |
| 9 | Log AI run | `ai_run_logs` | Track tokens used for generation |

---

## Preview Cards Behavior

The 3 preview cards at the bottom are clickable:
- "View ->" on Roadmap -> navigates to `/app/dashboard/{id}/roadmap`
- "View ->" on Tasks -> navigates to `/app/dashboard/{id}/tasks`
- "View ->" on Brief -> navigates to `/app/dashboard/{id}/brief`

The main CTA "Enter Your Dashboard" -> navigates to `/app/dashboard/{id}`

---

## Responsive Behavior

### Tablet
- Left panel: collapses to completion banner at top
- Center: full width, cards in 3-column grid
- Right panel: content moves below the CTA

### Mobile
- Single column
- Completion banner: simple "Discovery Complete" with a checkmark as a top bar
- CTA: full-width sticky bottom button
- Preview cards: vertical stack (full width each)
- Right panel content: collapsible section below cards
- Systems list: simplified to badges

---

## Animation (Subtle)

- On load: brief fade-in of confirmation card (200ms)
- Green checkmarks in left panel: sequential fade-in (50ms stagger)
- CTA button: subtle pulse on first appearance (once)
- No confetti, no celebration animation — calm confidence

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| Brief not approved | Show "Brief: Draft v1.0 — You can approve it from your dashboard" |
| AI generation slow | Show skeleton loading for tasks/roadmap counts with "Setting up your project..." |
| Generation fails | Show cards with "—" counts and "Your team will set this up within 24 hours" |
| User navigates back | Allow — wizard_completed_at stays set, dashboard stays created |
| User revisits Step 5 | Show same confirmation, CTA still works |

---

## Workflow

1. **User arrives at /app/wizard/step-5**
   - Verify the brief is approved (briefs.status equals 'approved')
   - If not approved: redirect back to step-4 with a message

2. **Trigger project creation** (if not already created):
   1. Create a projects row:
      - name: "{client_name} — AI Transformation"
      - status: 'Active'
      - client_id: from wizard context
      - current_phase: 'phase_1'
      - progress: 0
      - dashboard_activated_at: now()
   2. Create a context_snapshots row:
      - project_id: the new project
      - summary: from the brief executive summary
      - metrics: compiled from wizard answers
      - is_active: true
   3. Create a roadmaps row:
      - snapshot_id: the new snapshot
      - total_duration: "12 weeks" (from AI analysis)
      - roi_projection: from brief outcomes
   4. Create roadmap_phases rows (3 phases):
      - Phase 1: Foundation (order_index: 1)
      - Phase 2: Implementation (order_index: 2)
      - Phase 3: Optimization (order_index: 3)
   5. Create initial tasks rows:
      - AI-generated tasks per phase (3-5 per phase)
      - owner: mix of 'Client', 'Sun AI', 'Automated'
      - status: 'todo'
      - ai_generated: true
   6. Create project_services rows:
      - For each selected system, map to services
      - status: 'planned'
   7. Update wizard_sessions:
      - current_step: 5
      - wizard_completed_at: now()

3. **Display confirmation screen**
   - Show the confirmation screen populated with project data
   - Animate checklist items with staggered timing

4. **User clicks "Enter Your Dashboard"**
   - Navigate to /app/dashboard/{project_id}
   - On first-time visit: show subtle onboarding tooltips on key areas

---

## Agent Behavior
- **AI generates initial tasks** during project creation
  - 3-5 tasks per phase, contextually relevant to selected systems
  - Tasks include ai_suggestion field with guidance
  - Logged in ai_run_logs
- **No interactive AI on this screen** — it's purely confirmational
- All heavy processing happens in the background Edge Function
- If Edge Function fails: show error state with "Retry" button, never leave user stuck
- Project creation is idempotent — if user refreshes, don't create duplicates (check if project exists for this wizard_session)
