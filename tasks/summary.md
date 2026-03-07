# Sun AI Agency — Project Summary

**Date:** 2026-03-07
**Stack:** React 18 + TypeScript + Vite 6 + Supabase + Tailwind CSS v4
**Philosophy:** Structure first. Intelligence second. Automation last.

---

## Product Vision

Sun AI Agency is a premium, wizard-first AI consulting platform that guides businesses through structured discovery into actionable projects. The product behaves like a digital consultant — observant, structured, transparent, and human-controlled.

**Core flow:** Wizard onboarding (5 screens) → Executive brief → Project dashboard → Ongoing delivery

---

## Features

### Completed

| Feature | Status | Notes |
|---------|--------|-------|
| Marketing website | Done | 23 routes, multi-page SPA |
| Wizard design system | Done | Brand, typography, colors, components |
| Wizard screen specs (all 5) | Done | Figma Make prompts, content data, workflows |
| Wizard mermaid diagrams | Done | 10 diagram files, flowcharts/ERDs/sequences |
| Auth & entry screen spec | Done | Login/signup, post-auth routing, welcome |
| Database schema | Done | 58+ tables, RLS policies, 43+ migrations |
| Edge Functions (deployed) | Done | 17+ functions on Supabase |
| Gemini AI skill | Done | Updated to gemini-3.1-pro-preview, gemini-3-flash-preview, gemini-3.1-flash-image-preview |
| Mermaid diagrams skill | Done | Comprehensive reference for all diagram types |
| Design system overview | Done | Colors, typography, spacing, components |

### In Progress

| Feature | Status | Notes |
|---------|--------|-------|
| Wizard frontend implementation | ~50% | Steps 1-2 UI working, Steps 3-5 need completion |
| AI agent connections | ~25% | Edge Functions exist but frontend calls incomplete |
| Client dashboard | ~20% | Basic layout, no real data integration |
| Industry packs | ~75% | 6 of 8 complete |

### Not Started

| Feature | Priority | Notes |
|---------|----------|-------|
| Agency dashboard (CRM, pipeline, projects) | High | Architecture defined, no implementation |
| Chatbot system (widget + Cmd+K) | Medium | Architecture defined |
| Revenue/billing (Stripe) | Medium | Planned |
| RAG/knowledge base | Medium | Vector search architecture defined |
| Mobile optimization | Low | Basic responsive exists |
| Testing infrastructure | Low | No automated tests |

---

## AI Agents (17 Specialized)

### Wizard Agents (Steps 1-5)

| Agent | Model | Function | Screen |
|-------|-------|----------|--------|
| analyze-business | Flash | URL context extraction, company analysis | Step 1 |
| analyst | Flash | Google Search + market research | Step 1 |
| generate-diagnostics | Flash | Dynamic question generation | Step 2 |
| extractor | Flash | Pain point identification from answers | Step 2 |
| recommend-systems | Pro | Solution architecture (Thinking Mode) | Step 3 |
| optimizer | Pro | Cost/effort optimization | Step 3 |
| scorer | Pro | Readiness score calculation | Step 4 |
| summary | Pro | Executive narrative generation | Step 4 |
| generate-roadmap | Pro | Phased project planning | Step 4 |

### Dashboard Agents

| Agent | Model | Function | Screen |
|-------|-------|----------|--------|
| assistant | Flash | Client concierge chat (RAG) | Client Dashboard |
| intelligence-stream | Flash | Real-time streaming updates | All Dashboards |
| task-generator | Flash | Actionable task creation | Client Dashboard |

### Agency Agents

| Agent | Model | Function | Screen |
|-------|-------|----------|--------|
| crm-intelligence | Flash | Lead health & probability scoring | Agency CRM |
| planner | Pro | Strategic agency oversight | Agency Projects |
| orchestrator | Flash | Agent coordination (Function Calling) | System Operations |
| analytics | Pro | Financial BI & forecasting | Agency Analytics |
| monitor | Pro | Predictive velocity tracking | Agency Management |

---

## Screens & Routes

### Public Marketing Site

| Route | Screen | Status |
|-------|--------|--------|
| `/` | Landing page (HomePageV3) | Done |
| `/solutions` | Solutions overview | Done |
| `/industries/*` | Industry vertical pages | Done |
| `/about` | Company info | Done |
| `/process` | Process overview | Done |
| `/projects` | Case studies | Done |
| `/agents` | AI agents showcase | Done |
| `/chatbots` | Chatbot services | Done |
| `/booking` | Consultation scheduling | Done |

### Auth & Entry

| Route | Screen | Status |
|-------|--------|--------|
| `/auth` | Login / Signup (split-screen) | Spec done, needs build |
| `/app` | Post-auth routing | Spec done, needs build |
| `/app/welcome` | First-time welcome | Spec done, needs build |

### Wizard (Client Portal)

| Route | Screen | Status |
|-------|--------|--------|
| `/app/wizard/step-1` | Business Context (7 fields) | UI ~95%, AI not connected |
| `/app/wizard/step-2` | Industry Diagnostics (8 questions) | UI ~90%, signal detection partial |
| `/app/wizard/step-3` | System Recommendations (AI cards) | UI ~50%, static data |
| `/app/wizard/step-4` | Executive Brief (document view) | UI ~60%, AI not connected |
| `/app/wizard/step-5` | Launch Project (confirmation) | UI ~40%, project creation not wired |

### Client Dashboard

| Route | Screen | Status |
|-------|--------|--------|
| `/app/dashboard` | Project overview, KPIs | Layout only |
| `/app/dashboard/brief` | Strategy brief viewer/editor | Not started |
| `/app/dashboard/roadmap` | Phase timeline, milestones | Not started |
| `/app/dashboard/tasks` | Task board (client-visible) | Not started |
| `/app/dashboard/documents` | Document management | Not started |
| `/app/dashboard/billing` | Invoices & payments | Not started |

### Agency Dashboard

| Route | Screen | Status |
|-------|--------|--------|
| `/admin` | Executive overview (10-second health check) | Not started |
| `/admin/clients` | Client list + detail view | Not started |
| `/admin/pipeline` | CRM kanban + deal tracking | Not started |
| `/admin/projects` | Project management + delivery | Not started |
| `/admin/tasks` | Team task board (kanban/list) | Not started |
| `/admin/wizards` | Wizard session management | Not started |
| `/admin/roadmaps` | Roadmap manager | Not started |
| `/admin/documents` | Documents & briefs library | Not started |
| `/admin/systems` | Systems catalog admin | Not started |
| `/admin/analytics` | Revenue, conversion, health | Not started |
| `/admin/ai-logs` | AI activity viewer | Not started |
| `/admin/invoices` | Financial management | Not started |
| `/admin/team` | Team members & workload | Not started |
| `/admin/settings` | Org settings, branding, roles | Not started |

---

## Workflows

### 1. Prospect to Client (Wizard Flow)

1. User visits `/auth` — signs up or logs in
2. Post-auth routing checks org, wizard sessions, projects — routes accordingly
3. New user enters wizard Step 1 — provides business context (company, industry, goals)
4. Step 2 — answers 8 industry-specific diagnostic questions, signals detected
5. On Step 2 completion — background Edge Function analyzes diagnostics, caches in ai_cache
6. Step 3 — AI-ranked system recommendations displayed, user selects 1-5 systems
7. Step 4 — AI generates executive brief (summary, analysis, roadmap, outcomes), user reviews, edits, approves
8. Step 5 — project created (project, snapshot, roadmap, phases, tasks, services), user enters dashboard

### 2. Client Dashboard (Post-Wizard)

1. Client views project overview with KPIs
2. Reviews and references approved strategy brief
3. Tracks roadmap phases and milestones
4. Manages tasks (view status, mark complete)
5. Uploads and manages project documents
6. Monitors billing and invoices

### 3. Agency Operations

1. Overview — 10-second business health check
2. Leads — manage incoming prospects via CRM
3. Pipeline — track deals through stages (kanban)
4. Projects — monitor active deliveries by phase
5. Tasks — daily execution board for team
6. Wizard sessions — review client discovery data
7. Analytics — revenue, conversion, AI usage metrics

### 4. AI Processing Pipeline

1. Step 1 — analyze-business on URL blur (URL Context reads website + Google Search discovers market context, cached in ai_cache, right panel shows company analysis)
2. Step 2 completion — analyze_diagnostics (async Edge Function, stores in ai_cache)
3. Step 3 load — recommend_systems (from cache or sync Edge Function)
4. Step 4 load — generate_brief (summary + roadmap + outcomes)
5. Step 5 — generate_tasks (AI creates 12 initial tasks across 3 phases)

### 5. Auto-Save Pattern (All Wizard Steps)

1. User changes a field
2. 500ms debounce timer resets
3. After debounce — UPSERT to wizard_answers.data (JSONB)
4. Left panel context card updates in real-time
5. Save indicator transitions: "Saving..." then "Saved"
6. On return visit: all fields pre-filled from saved data

### 6. Brief Approval Flow

1. AI generates brief (status: draft, version: 1)
2. User reviews each section
3. User can inline-edit any section — creates new version snapshot
4. User clicks "Request Changes" — status: in_review
5. User clicks "Approve Brief" — status: approved, Continue enabled
6. On continue — project creation begins at Step 5

---

## User Journeys

### Client (Business User)

**Goal:** Turn unclear business idea into structured AI strategy and project

1. Discovery — marketing site, booking page, or direct signup
2. Onboarding — 5-step wizard (~10 minutes)
3. Strategy — review and approve executive brief
4. Execution — track project via dashboard (roadmap, tasks, docs)
5. Communication — chat with AI assistant or agency team
6. Billing — view invoices, manage payments

**Key moments:**
- First impression: Step 1 form feels like talking to a consultant
- Trust building: Step 2 right panel explains WHY each question matters
- Value demonstration: Step 3 shows personalized, data-backed recommendations
- Commitment: Step 4 brief approval is the "handshake moment"
- Transition: Step 5 transforms wizard data into a live project

### Agency User (Consultant/Owner)

**Goal:** Manage client relationships, deliver projects, grow revenue

1. Morning check — overview dashboard, KPIs in 10 seconds
2. Sales — pipeline, follow up on deals, qualify leads
3. Delivery — projects, check phase progress, assign tasks
4. Execution — tasks, complete today's work items
5. Review — analytics, revenue trends, completion rates
6. Admin — settings, team management, integrations

### Guest User (Anonymous)

**Goal:** Explore the wizard without commitment

1. Visit landing page, click "Begin Diagnostics"
2. Complete wizard in guest mode (data in localStorage)
3. Sign up to persist data and access dashboard
4. If they return, data is restored from saved session

---

## Database Schema (Key Tables)

### Authentication & Organization
- `organizations` — root tenant
- `profiles` — user profiles (linked to auth.users)
- `team_members` — org membership with roles (Owner, Consultant, Client)

### Wizard Data
- `wizard_sessions` — session tracking (current_step, timestamps)
- `wizard_answers` — JSONB data per step
- `documents` — uploaded files (wizard + project)

### Projects & Delivery
- `projects` — client projects (status, phase, progress)
- `context_snapshots` — versioned project context from wizard
- `roadmaps` — project roadmaps (duration, ROI projection)
- `roadmap_phases` — phased deliverables (3 phases typical)
- `tasks` — project tasks (status, owner, priority, ai_generated)
- `project_systems` — selected systems per project
- `project_services` — system-to-service mappings

### Briefs
- `briefs` — executive summaries (content JSONB, status, version)
- `brief_versions` — version snapshots for audit trail

### AI & Intelligence
- `ai_cache` — cached AI outputs (expensive operations)
- `ai_run_logs` — audit trail (agent, model, tokens, result)
- `agent_configs` — agent configuration

### Systems & Services
- `systems` — available AI systems catalog
- `services` — granular services within systems
- `system_services` — system-to-service junction

### CRM (Agency)
- `contacts` — client contacts
- `deals` — sales pipeline deals
- `communications` — interaction history
- `leads` — prospect records

### Advanced
- `knowledge_chunks` / `knowledge_documents` — RAG/vector store
- `industry_playbooks` / `prompt_packs` — domain knowledge
- `chat_sessions` / `chat_messages` — conversational history
- `subscriptions` / `invoices` — billing

---

## Additional Tasks Needed

### P0 — Critical (Blocks Core Product)

| # | Task | Effort | Depends On |
|---|------|--------|------------|
| 1 | Wire wizard Step 3 to recommend-systems Edge Function | 2-3 days | ai_cache from Step 2 |
| 2 | Wire wizard Step 4 to summary + generate-roadmap Edge Functions | 3-4 days | Step 3 selections |
| 3 | Implement Step 5 project creation flow | 2-3 days | Steps 1-4 data |
| 4 | Build auth screens (login, signup, Google OAuth, routing) | 3-4 days | None |
| 5 | Data persistence verification — confirm saves to Supabase | 1-2 days | None |
| 6 | Add JWT Authorization headers to all Edge Function calls | 1-2 days | Auth working |
| 7 | Fix RLS UPDATE policies — 9 tables missing WITH CHECK | 0.5 day | None |
| 8 | Complete remaining 2 industry packs | 1-2 days | None |

### P1 — High (Blocks Key Features)

| # | Task | Effort | Depends On |
|---|------|--------|------------|
| 9 | Client dashboard — project overview with real data | 3-4 days | Step 5 creates project |
| 10 | Client dashboard — brief tab with viewer/editor | 2-3 days | Briefs populated |
| 11 | Client dashboard — roadmap tab with timeline | 2-3 days | Roadmap data exists |
| 12 | Client dashboard — tasks tab (kanban/list) | 2-3 days | Tasks from Step 5 |
| 13 | Agency dashboard — overview screen (KPIs) | 2-3 days | Client data exists |
| 14 | Agency dashboard — clients list + detail | 3-4 days | CRM tables |
| 15 | Agency dashboard — pipeline kanban | 3-4 days | Deals table |
| 16 | Agency dashboard — projects + tasks | 3-4 days | Projects exist |

### P2 — Medium (Enhances Product)

| # | Task | Effort | Depends On |
|---|------|--------|------------|
| 17 | Chatbot — global website widget | 5-7 days | Agent infrastructure |
| 18 | Chatbot — dashboard Cmd+K | 3-4 days | Dashboard working |
| 19 | Stripe integration (subscriptions, invoices) | 5-7 days | Auth + dashboard |
| 20 | RAG system (document embedding, vector search) | 3-5 days | Knowledge tables |
| 21 | PDF export for executive briefs | 1-2 days | Brief generation |
| 22 | Real-time updates via Supabase Realtime | 2-3 days | Dashboard working |
| 23 | Analytics dashboard (revenue, conversion, AI usage) | 3-4 days | Data flowing |

### P3 — Low (Polish & Scale)

| # | Task | Effort | Depends On |
|---|------|--------|------------|
| 24 | Testing infrastructure (Vitest + Playwright) | 5-7 days | Features stable |
| 25 | Mobile optimization (touch, nav) | 3-4 days | Features complete |
| 26 | AI logs viewer | 2-3 days | Agents running |
| 27 | Team workspace (workload, assignments) | 2-3 days | Agency dashboard |
| 28 | WhatsApp/email integrations | 5-7 days | Agent + billing |
| 29 | Performance optimization | 2-3 days | All features |

---

## Architecture Notes

### Three-Panel Layout (Wizard Only)
- Left Panel (240px) — progress stepper, context signals, saved selections (read-only)
- Center Panel (flex-1) — forms, questions, selections, decisions (human-first)
- Right Panel (320px) — AI reasoning, explanations, trade-offs, previews (read-only)

### Dashboard Layout (Post-Wizard)
- Standard sidebar + main content area
- No three-panel — dashboards should feel familiar, not novel

### AI Behavior Rules
- Never surprise the user
- Never auto-commit changes
- Always explain reasoning
- Always show previews
- Always allow the user to decide
- AI proposes, human decides

### Gemini Models
- gemini-3.1-pro-preview — complex reasoning, analysis, scoring
- gemini-3-flash-preview — fast responses, extraction, chat
- gemini-3.1-flash-lite-preview — cost-efficient, high-frequency tasks
- gemini-3.1-flash-image-preview — image generation (Nano Banana 2)
- gemini-3-pro-image-preview — professional image generation (Nano Banana Pro)

### Gemini CLI
- Version: 0.32.1 (Homebrew/Linuxbrew)
- Binary: `/home/linuxbrew/.linuxbrew/bin/gemini`
- Auth: `gemini-api-key` mode
- Skills: `gemini-api-dev`, `gemini-interactions-api`, `find-skills`
- Extensions: None installed
- MCP Servers: Not configured

### Gemini Feature Coverage (12/18)
- **Active:** Text generation, structured output, system instructions, function calling, Google Search, URL Context, thinking/reasoning, multi-turn chat, image generation, streaming, embeddings, safety settings
- **Not yet planned:** Context caching, code execution, document processing, thought signatures, file search, remote MCP

### Interactions API
- Recommended for: assistant (stateful chat), intelligence-stream (SSE), orchestrator (auto function calling)
- SDK: `@google/genai >= 1.33.0`
- Key feature: `previous_interaction_id` for server-side conversation state

---

## File References

| Path | Contents |
|------|----------|
| `tasks/wizard/prompts/` | 12 Figma Make prompt files (no code blocks) |
| `tasks/wizard/mermaid-wizard/` | 10 mermaid diagram files |
| `plan/10-sunai-plan.md` | Master implementation plan (current) |
| `plan/03-prd.md` | Product requirements / system prompt |
| `plan/04-supabase.md` | Database schema + Edge Function audit |
| `plan/05-dashboard.md` | Dashboard screen definitions |
| `plan/plan/` | Previous draft docs (overview, audits, trackers) |
| `plan/prompts/` | Previous draft prompts (wizard, dashboards, agents) |
| `.agents/ai/gemini/SKILL.md` | Gemini AI integration skill |
| `.agents/mermaid-diagrams/SKILL.md` | Mermaid diagramming skill |
| `.claude/skills/gemini-api-dev/SKILL.md` | Gemini API skill (updated models) |
| `.claude/skills/gemini-interactions-api/SKILL.md` | Gemini Interactions API skill |
| `/home/sk/startupai16L/tasks/audit/gemeni-audit.md` | Gemini CLI & API audit (Sun AI) |
