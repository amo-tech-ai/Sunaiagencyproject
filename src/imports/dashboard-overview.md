---
id: 025-dashboard-overview
diagram_id: DASH-01
prd_section: Dashboard
title: Dashboard overview — unified command center post-wizard
skill: frontend
phase: HIGH
priority: P1
status: Not Started
owner: Frontend
dependencies:
  - 021-edge-function-kv-to-tables-refactor
estimated_effort: L
percent_complete: 0
area: client-dashboard
wizard_step: null
schema_tables: [organizations, projects, tasks, wizard_sessions, wizard_answers, ai_run_logs, clients, activities]
figma_prompt: prompts/025-dashboard-overview.md
---

## Summary Table

| Aspect | Details |
|--------|---------|
| **Screens** | Dashboard Home (`/app/dashboard`) |
| **Features** | Readiness score, project summary, roadmap timeline, activity feed, AI insights, quick actions |
| **Edge Functions** | assistant (dashboard insights) |
| **Tables** | organizations, projects, tasks, wizard_sessions, wizard_answers, ai_run_logs, activities, milestones, roadmaps, roadmap_phases |
| **Agents** | assistant (gemini-3-flash-preview, low thinking) |
| **Real-World** | "Acme Retail logs in after completing the wizard — sees readiness score 72, 3 selected systems, Phase 1 starting next week" |

---

## Description

**The situation:** After a client completes the 5-step wizard, there is no post-wizard experience. The wizard generates rich AI analysis (business profile, diagnostics, system recommendations, readiness score, roadmap) but all of that data sits in `wizard_answers.ai_results` with no way to view, track, or act on it. Users complete the wizard and hit a dead end.

**Why it matters:** The wizard is the entry point, but the dashboard is the retention surface. Without a command center, clients have no reason to return after the initial analysis. Agency consultants have no single view to monitor project progress across clients. The AI-generated roadmap from Step 5 becomes shelfware instead of an actionable project plan.

**What already exists:** The `wizard_answers` table stores AI results for all 5 steps (ai_results jsonb). The `projects`, `roadmaps`, `roadmap_phases`, `tasks`, and `milestones` tables exist in the schema. The `activities` table is ready for event logging. The marketing site has a sidebar layout pattern in the existing navigation. shadcn/ui provides Card, Progress, Badge, Avatar, and ScrollArea components. The `cn()` utility and design system tokens (colors, fonts) are established.

**The build:** Create a `DashboardOverview` page component at `/app/dashboard` with a sidebar + main content layout. The main area contains: (1) a welcome banner with org name and readiness score from wizard Step 4 ai_results, (2) a metrics row with 4 stat cards, (3) a two-column grid with project summary cards and AI insights panel on top, roadmap timeline and activity feed on the bottom. Data is fetched via custom hooks (`useDashboardData`, `useActivities`) that query Supabase tables with RLS. The sidebar provides navigation to all dashboard sections (Projects, CRM, AI Insights, Documents, Financial, Settings).

**Example:** Acme Retail Group (e-commerce, 50 employees) completed the wizard yesterday. They log in and see: Welcome banner "Acme Retail Group" with AI Readiness Score 72/100 displayed as a circular progress ring. Below, four metric cards show: "72 Readiness Score", "3 AI Systems Selected", "Phase 1 of 3 Active", "$48K Est. Annual ROI". The project summary card shows "AI Transformation — Phase 1: Customer Support Engine" at 15% progress. The activity feed shows "Wizard completed", "Project created", "Roadmap generated". An AI insight card reads: "Your cart abandonment rate (68%) is above industry average. The Cart Recovery Engine in Phase 2 is projected to recover $12K/month."

---

## Rationale

**Problem:** Wizard outputs (readiness score, system recommendations, roadmap) are locked in jsonb with no user-facing view. Clients and consultants cannot track progress or act on AI insights.

**Solution:** A unified dashboard that reads wizard_answers ai_results and project/roadmap tables to present an actionable command center. Standard sidebar + main content layout (not three-panel wizard layout).

**Impact:** Clients return to track progress. Consultants manage engagements from one screen. AI insights drive upsells and re-engagement.

---

## Screen Purpose

The main dashboard is the first screen users see after completing the wizard or logging in. It surfaces a high-level snapshot of their AI transformation journey: active projects, readiness score from wizard Step 4, recommended next actions, recent activity, and key metrics. This is the "command center" that connects wizard outputs to ongoing project delivery.

---

## Target User

- Business owners who completed the wizard and now have an active project
- Agency consultants managing multiple client engagements
- Returning users checking project progress

---

## Core Features

1. Welcome banner with company name (from organizations table, linked via wizard Step 1 analysis) and AI readiness score (from wizard_answers step-4 ai_results)
2. Active projects summary cards (from projects table, linked to wizard_sessions)
3. Roadmap progress timeline (from roadmaps + roadmap_phases, generated at Step 5)
4. Quick actions: "View Roadmap", "Schedule Call", "View Systems", "Re-run Analysis"
5. Recent activity feed (from activities table)
6. AI insights widget — surfacing opportunities from wizard analysis
7. Key metrics row: readiness score, selected systems count, project phase, estimated ROI

---

## Data Displayed

- Organization name, logo placeholder
- AI readiness score (wizard_answers step-4 ai_results -> overallScore)
- Score breakdown (5 dimensions from readiness assessment)
- Active project count, current phase name
- Roadmap phases with completion percentage
- Selected AI systems (from wizard_answers step-3)
- Recent activities (last 10 from activities table)
- Next milestone (from milestones table, nearest upcoming)

---

## UI Components

- `DashboardHeader` — org name, user avatar, notifications bell
- `ReadinessScoreCard` — circular progress with 5-dimension breakdown
- `ProjectSummaryCard` — project name, phase, progress bar, status badge
- `RoadmapTimeline` — horizontal phase blocks with current marker
- `QuickActionsGrid` — 4 action cards with icons
- `ActivityFeed` — chronological list with avatar, action, timestamp
- `AIInsightsPanel` — expandable cards with AI-generated recommendations
- `MetricsRow` — 4 stat cards (score, systems, phase, ROI)
- `DashboardSidebar` — navigation links with active state indicator

---

## Layout Structure

```
+-----------------------------------------------------+
| Sidebar (240px)  |  Main Content (flex-1)            |
|                  |                                    |
| * Dashboard  <-- |  Welcome Banner + Readiness Score  |
| * Projects       |  +------+------+------+------+    |
| * CRM            |  |Metric|Metric|Metric|Metric|    |
| * AI Insights    |  +------+------+------+------+    |
| * Documents      |                                    |
| * Financial      |  +-------------+-------------+    |
| * Settings       |  | Projects    | AI Insights  |    |
|                  |  | Summary     | Panel        |    |
|                  |  +-------------+-------------+    |
|                  |  | Roadmap     | Activity     |    |
|                  |  | Timeline    | Feed         |    |
|                  |  +-------------+-------------+    |
+-----------------------------------------------------+
```

- Sidebar: 240px fixed, `#0A211F` background, `#F1EEEA` text, `#84CC16` active indicator
- Main content: `#F1EEEA` background, `max-w-[1200px] mx-auto`, 24px padding
- Cards: `#FFFFFF` background, `#D4CFC8` border, 8px radius
- Responsive: sidebar collapses to hamburger on mobile (<768px)

---

## Interaction Patterns

- Click project card -> navigate to project detail (`/app/projects/:id`)
- Click roadmap phase -> expand phase details inline with task list
- Click quick action -> navigate to respective screen
- Activity feed auto-refreshes every 60 seconds (or Supabase Realtime subscription)
- Score card click -> expand to full readiness breakdown with radar chart
- AI insight dismiss/snooze -> mark as read in activities table
- Sidebar nav items highlight active route

---

## Example User Workflows

**Workflow 1 — First login after wizard:** Acme Retail (e-commerce, 50 employees) completed the wizard yesterday. They log in and see: Readiness Score 72 displayed prominently with a circular progress ring. Below, 3 selected systems (Support Engine, Cart Recovery, Recommendation Engine) are listed. The roadmap shows Phase 1 of 3 starting next week. Four AI-generated quick wins from their Step 2 diagnostics appear in the insights panel: "Automate ticket routing to reduce 40-hour/week manual triage."

**Workflow 2 — Weekly check-in:** Agency consultant Maria opens the dashboard for client GreenLeaf Healthcare. She sees 2 of 5 milestones completed for Phase 1. The readiness score improved from 65 to 78 after Phase 1 delivery. An AI insight suggests adding a patient scheduling system based on the original Step 2 diagnostic finding that "appointment no-shows cost $8K/month." Maria clicks "Schedule Call" to discuss the upsell.

**Workflow 3 — Returning after inactivity:** Client TechNova Solutions hasn't logged in for 3 weeks. The dashboard shows a notification badge on the activity feed: "3 milestones overdue." The AI insights panel prominently displays: "Your project timeline is at risk — 2 tasks in Phase 2 are blocked. Consider scheduling a review call." The quick action "Schedule Call" is highlighted with a `#84CC16` border.

---

## AI Features

- AI-generated "next best action" recommendations based on project state + readiness gaps
- Proactive insights: "Your cart abandonment rate suggests upgrading to the premium recommendation engine"
- Readiness score auto-recalculation when new project data arrives (via assistant agent)
- Activity summarization: "This week: 3 milestones completed, 2 new tasks created"
- Dashboard greeting personalized with business context from Step 1 analysis

---

## Data Sources (tables)

| Data | Table | Column/Query |
|------|-------|-------------|
| Org name | organizations | name |
| Readiness score | wizard_answers | ai_results where step_number = 4 |
| Score dimensions | wizard_answers | ai_results -> dimensions where step_number = 4 |
| Selected systems | wizard_answers | ai_results where step_number = 3 |
| Business profile | wizard_answers | ai_results where step_number = 1 |
| Diagnostics | wizard_answers | ai_results where step_number = 2 |
| Projects | projects | where org_id = current org |
| Roadmap phases | roadmap_phases | via roadmaps.project_id |
| Tasks | tasks | where project_id, grouped by status |
| Activities | activities | where org_id, order by created_at desc limit 10 |
| Milestones | milestones | where project_id, status != 'completed', order by due_date |
| AI run history | ai_run_logs | count, last run timestamp per org_id |

---

## Automation Opportunities

- Auto-create project from wizard completion (wizard Step 5 -> projects insert + roadmap_phases insert)
- Auto-populate roadmap phases from AI-generated roadmap (Step 5 ai_results -> roadmap_phases rows)
- Trigger re-analysis when project enters new phase (update readiness score)
- Weekly summary email generated from dashboard data (activities + milestones)
- Slack/email notification when milestone due date is approaching (< 3 days)
- Auto-log activity when wizard completes, project status changes, or milestone completes

---

## Visual Hierarchy

1. **Primary focus**: Readiness score + welcome banner (top, largest, full width)
2. **Secondary**: Metrics row + project summary cards (data-dense, medium prominence)
3. **Tertiary**: Roadmap timeline (horizontal, scannable, color-coded phases)
4. **Supporting**: Activity feed + AI insights (right column, scrollable, lower contrast)

---

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Client | see my readiness score and project status on one screen | I understand where my AI transformation stands |
| Client | see AI-generated next actions | I know what to focus on without reading the full analysis |
| Agency consultant | view a client's dashboard | I can prepare for status calls with current data |
| Agency owner | see project phase progress across clients | I can identify at-risk engagements early |
| Returning user | see recent activity and changes | I can catch up quickly after being away |

---

## Goals & Acceptance Criteria

### Goals
1. **Primary:** User sees a complete snapshot of their AI transformation status within 3 seconds of login
2. **Quality:** Dashboard loads in < 2 seconds, all data from Supabase with RLS enforcement

### Acceptance Criteria
- [ ] Dashboard renders at `/app/dashboard` with sidebar + main content layout
- [ ] Welcome banner shows organization name from `organizations` table
- [ ] Readiness score displays from `wizard_answers` step-4 `ai_results.overallScore`
- [ ] Metrics row shows 4 cards: readiness score, systems count, current phase, estimated ROI
- [ ] Project summary cards display active projects with name, phase, progress bar, status badge
- [ ] Roadmap timeline shows phases from `roadmap_phases` with current phase highlighted
- [ ] Activity feed shows last 10 activities ordered by `created_at` desc
- [ ] AI insights panel shows at least 2 actionable recommendations derived from wizard data
- [ ] Quick actions (View Roadmap, Schedule Call, View Systems, Re-run Analysis) navigate correctly
- [ ] Sidebar navigation highlights current route and links to all dashboard sections
- [ ] Responsive: sidebar collapses to hamburger on mobile (< 768px)
- [ ] Loading state shows skeleton screens, not blank content
- [ ] Error state shows friendly message with retry button
- [ ] Empty state (no projects yet) shows "Complete the wizard to get started" CTA

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Page | `src/components/dashboard/DashboardOverview.tsx` | Create |
| Component | `src/components/dashboard/DashboardSidebar.tsx` | Create |
| Component | `src/components/dashboard/DashboardHeader.tsx` | Create |
| Component | `src/components/dashboard/ReadinessScoreCard.tsx` | Create |
| Component | `src/components/dashboard/ProjectSummaryCard.tsx` | Create |
| Component | `src/components/dashboard/RoadmapTimeline.tsx` | Create |
| Component | `src/components/dashboard/QuickActionsGrid.tsx` | Create |
| Component | `src/components/dashboard/ActivityFeed.tsx` | Create |
| Component | `src/components/dashboard/AIInsightsPanel.tsx` | Create |
| Component | `src/components/dashboard/MetricsRow.tsx` | Create |
| Hook | `src/lib/hooks/useDashboardData.ts` | Create |
| Hook | `src/lib/hooks/useActivities.ts` | Create |
| Types | `src/lib/types/dashboard.ts` | Create |
| Route | `src/routes.tsx` | Modify — add `/app/dashboard` route |
| Layout | `src/components/dashboard/DashboardLayout.tsx` | Create — sidebar + outlet wrapper |

---

## Outcomes

| Before | After |
|--------|-------|
| Wizard completes and user sees nothing — dead end | User lands on a command center with score, projects, roadmap, and next actions |
| Readiness score locked in wizard_answers jsonb | Score displayed as circular progress ring with 5-dimension breakdown |
| AI roadmap exists only as Step 5 output | Roadmap rendered as interactive timeline with phase progress |
| No activity history visible | Chronological feed shows wizard completion, project creation, milestone events |
| No post-wizard engagement surface | AI insights panel drives return visits with proactive recommendations |
