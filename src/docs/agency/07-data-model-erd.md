# 07 — Agent Data Model (Entity-Relationship Diagram)

> Version 1.0 | March 13, 2026
> Interactive diagram at `/app/agents/er-diagram`

---

## Overview

Five Supabase tables power the agent system. The interactive ER diagram at `/app/agents/er-diagram` shows each table as a white card with monospace column names, PK/FK badges, and one-to-many relationship arrows between them.

---

## Tables

### 1. agent_catalog
**Purpose:** Index of all available agents with parsed metadata from `.md` files.

| Column | Type | Key | Notes |
|---|---|---|---|
| id | uuid | PK | Auto-generated |
| slug | text UNIQUE | | e.g. "engineering-rapid-prototyper" |
| name | text | | From frontmatter |
| description | text | | One-liner |
| division | text | | Parent folder |
| emoji | text | | Emoji character |
| color | text | | Hex or name |
| vibe | text? | | Tagline |
| file_path | text | | Relative path in repo |
| line_count | int | | Proxy for depth/quality |
| tags | text[] | | Derived: industries, goals |
| is_active | boolean | | Can be disabled |
| created_at | timestamptz | | When parsed |
| updated_at | timestamptz | | Last re-parse |

### 2. agent_assignments
**Purpose:** Links agents to projects. Created when wizard completes or manually by agency.

| Column | Type | Key | Notes |
|---|---|---|---|
| id | uuid | PK | |
| project_id | uuid | FK | References projects.id |
| agent_slug | text | FK | References agent_catalog.slug |
| role_description | text | | e.g. "Builds your booking bot MVP" |
| assigned_by | text | | "wizard", "manual", or user_id |
| status | text | | "active", "paused", "completed" |
| first_task | text? | | Initial task description |
| created_at | timestamptz | | |
| updated_at | timestamptz | | |

### 3. agent_runs
**Purpose:** Audit log of all agent executions.

| Column | Type | Key | Notes |
|---|---|---|---|
| id | uuid | PK | |
| agent_slug | text | FK | Which agent ran |
| project_id | uuid | FK | Which project (nullable) |
| user_id | uuid | FK | Who initiated |
| route | text | | e.g. "wizard-recommendations", "agent-runner" |
| input_summary | text | | Truncated input (500 chars) |
| tokens_input | int | | Input token count |
| tokens_output | int | | Output token count |
| duration_ms | int | | Call duration |
| model | text | | e.g. "gemini-2.0-flash" |
| success | boolean | | |
| error_message | text? | | Error details if failed |
| created_at | timestamptz | | |

### 4. agent_outputs
**Purpose:** Full output storage for agent runs (separated for query performance).

| Column | Type | Key | Notes |
|---|---|---|---|
| id | uuid | PK | |
| run_id | uuid | FK | References agent_runs.id |
| agent_slug | text | FK | References agent_catalog.slug |
| output_type | text | | e.g. "report", "json", "freeform" |
| output_text | text | | Full text output |
| output_json | jsonb? | | Structured output if applicable |
| format | text | | "structured", "freeform", "json" |
| word_count | int | | For analytics |
| created_at | timestamptz | | |

### 5. insight_cards
**Purpose:** AI-generated business insights shown on dashboard.

| Column | Type | Key | Notes |
|---|---|---|---|
| id | uuid | PK | |
| project_id | uuid | FK | Which project |
| agent_slug | text | FK | Which agent generated it |
| priority | text | | "high", "medium", "low" |
| title | text | | Short headline |
| body | text | | Full insight text |
| impact_label | text? | | e.g. "+35% bookings" |
| action_label | text? | | e.g. "Take Action" |
| status | text | | "new", "viewed", "acted", "dismissed" |
| expires_at | timestamptz | | Auto-dismiss date |
| created_at | timestamptz | | |

---

## Relationships

```
agent_catalog (1) ──< (N) agent_assignments   "assigned to"
agent_catalog (1) ──< (N) agent_runs          "executed as"
agent_catalog (1) ──< (N) agent_outputs       "produces"
agent_catalog (1) ──< (N) insight_cards       "generates"
agent_runs    (1) ──< (N) agent_outputs       "produces"
```

All foreign keys reference `agent_catalog.slug` (not `id`) for human-readable joins.

---

## Implementation Notes

- **Current state:** The prototype uses `kv_store` + `ai_run_logs` tables. These 5 dedicated tables are the target production schema.
- **Migration path:** Tables will be created via Supabase dashboard (not DDL in code, per Make environment constraints).
- **Indexes:** Each FK column gets an index. `agent_catalog.tags` gets a GIN index for array search.
- **RLS:** All tables will have row-level security policies scoped to the project's organization.

---

## Files

| File | Purpose |
|---|---|
| `/components/dashboard/agents/AgentERDiagram.tsx` | Interactive SVG ER diagram component |
| `/routes.tsx` | Route at `agents/er-diagram` |
| `/components/dashboard/DashboardSidebar.tsx` | "Data Model" sub-item under AI Agents |
| `/docs/agency/07-data-model-erd.md` | This documentation |
