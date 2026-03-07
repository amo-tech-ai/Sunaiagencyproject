# Supabase Architecture Overview

> Sun AI Agency — Developer System Blueprint
> Visual reference at: `/docs/supabase` route

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React + TypeScript + Vite         |
| Backend    | Supabase Edge Functions (Deno)    |
| Database   | Postgres + pgvector (RAG)         |
| AI Engine  | Google Gemini                     |
| Infra      | Auth + Realtime + Storage         |

## Three-Tier Architecture

```
Frontend (React App)
       ↓
Supabase Client SDK
       ↓
┌──────────────────────────────────┐
│       Supabase Platform          │
│                                  │
│  Auth │ Database │ Edge Functions │
│  Realtime │ Storage              │
└──────────────────────────────────┘
       ↓
┌──────────────────────────────────┐
│       External Services          │
│                                  │
│  Gemini AI │ Stripe │ Email      │
│  WhatsApp                        │
└──────────────────────────────────┘
```

## Database Tables (21 tables)

### Identity & Access
- `organizations` — Multi-tenant root (id, name, slug, plan)
- `profiles` — User profiles (FK → organizations)
- `team_members` — Org membership (FK → organizations)

### Projects
- `clients` — Client records (FK → organizations)
- `projects` — Project records (FK → organizations, clients)
- `tasks` — Project tasks (FK → projects)
- `milestones` — Project milestones (FK → projects)
- `deliverables` — Milestone deliverables (FK → milestones)

### Wizard
- `wizard_sessions` — 5-step wizard state (FK → organizations)
- `wizard_answers` — Step-level answer storage (FK → wizard_sessions)

### Roadmap
- `context_snapshots` — Business context snapshots (FK → organizations)
- `roadmaps` — Generated roadmaps (FK → organizations)
- `roadmap_phases` — Roadmap phases (FK → roadmaps)

### Services
- `services` — Service catalog
- `systems` — AI system definitions
- `system_services` — System ↔ service mapping
- `project_services` — Project ↔ service assignments

### AI
- `ai_run_logs` — Audit log for all AI calls (FK → organizations)
- `ai_cache` — Response cache with TTL

### Billing
- `invoices` — Invoice records (FK → organizations)
- `payments` — Payment records (FK → invoices)

## Multi-Tenant Pattern

All org-scoped tables include `org_id` with RLS policies:
```sql
-- Example: projects table
CREATE POLICY "org_isolation" ON projects
  USING (org_id IN (
    SELECT org_id FROM team_members
    WHERE user_id = auth.uid()
  ));
```

## Edge Functions

| Function                | Purpose                          | AI Step                     | DB Writes                            |
|------------------------|----------------------------------|-----------------------------|--------------------------------------|
| analyze-business       | Company URL analysis             | Industry classification     | wizard_sessions, wizard_answers      |
| industry-diagnostics   | Diagnostic question generation   | Pain-point analysis         | wizard_answers                       |
| system-recommendations | AI system matching               | Priority scoring            | wizard_answers, ai_run_logs          |
| readiness-score        | AI readiness assessment          | Maturity assessment         | context_snapshots, ai_run_logs       |
| generate-roadmap       | Phased implementation plan       | Phase planning + costing    | roadmaps, roadmap_phases, ai_cache   |

## Data Flows

### Wizard Flow
```
Wizard UI → Edge Function → Gemini AI → Database → Dashboard
```

### Dashboard Flow
```
Dashboard UI → Supabase Query → Realtime Subscription → UI Update
```

### AI Pipeline
```
User Input → Cache Check → Gemini AI → Store Results → Log Run → Dashboard
```

## Authentication

```
User Login → Supabase Auth → JWT Token → RLS Policies → Database Access
```

JWT contains: user_id, org_id, role claims
RLS enforces: org_id isolation at database level

## Realtime Channels

| Channel          | Table            | Events              | UI Effect                    |
|-----------------|------------------|----------------------|------------------------------|
| project-tasks   | tasks            | INSERT, UPDATE, DELETE| Dashboard task board refresh  |
| wizard-progress | wizard_sessions  | UPDATE               | Processing page live progress |
| team-activity   | team_members     | INSERT, DELETE        | Team list live updates        |
| milestones      | milestones       | UPDATE               | Timeline markers update       |
| ai-runs         | ai_run_logs      | INSERT               | AI activity feed updates      |

## API Base URL

```
https://{projectId}.supabase.co/functions/v1/make-server-283466b6/{route}
```

Auth header: `Authorization: Bearer {access_token}`

## Component Reference

| Component File                              | ID        |
|--------------------------------------------|-----------|
| ArchDiagramBlock.tsx                       | C80-ARCH  |
| SystemArchitectureDiagram.tsx              | C81-SYS   |
| DatabaseStructure.tsx                      | C82-DB    |
| FrontendDataFlow.tsx                       | C83-FE    |
| EdgeFunctionArch.tsx                       | C84-EDGE  |
| AuthFlow.tsx                               | C85-AUTH  |
| RealtimeSystem.tsx                         | C86-RT    |
| AIPipeline.tsx                             | C87-AI    |
| APIReference.tsx                           | C88-API   |
| FrontendHooks.tsx                          | C89-HOOK  |
| SupabaseArchitecturePage.tsx               | C80-PAGE  |
