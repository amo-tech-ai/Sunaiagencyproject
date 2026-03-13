# Data Model — Supabase Tables

> Figma Make: Create an entity-relationship diagram showing 5 database tables as cards with columns listed inside. Show relationships with connecting lines (one-to-many arrows). Tables: agent_catalog, agent_assignments, agent_runs, agent_outputs, insight_cards. Use a clean technical documentation style with monospace font for column names. White cards on light background.

---

## New Tables

### agent_catalog

Stores metadata parsed from agent .md files. Populated at build time or via admin script.

```
TABLE: agent_catalog
PURPOSE: Index of all available agents with parsed metadata

+-------------------+-------------+---------------------------------------+
| Column            | Type        | Description                           |
+-------------------+-------------+---------------------------------------+
| id                | uuid (PK)   | Auto-generated                        |
| slug              | text UNIQUE | Filename without .md                  |
|                   |             | e.g. "engineering-rapid-prototyper"   |
| name              | text        | From frontmatter: "Rapid Prototyper"  |
| description       | text        | From frontmatter: one-liner           |
| division          | text        | Parent folder: "engineering"          |
| emoji             | text        | From frontmatter: emoji character     |
| color             | text        | From frontmatter: hex or name         |
| vibe              | text (null) | From frontmatter: tagline             |
| file_path         | text        | Relative path in repo                 |
| line_count        | int         | Proxy for depth/quality               |
| tags              | text[]      | Derived: industries, goals, use cases |
| is_active         | boolean     | Can be disabled without deleting      |
| created_at        | timestamptz | When parsed/imported                  |
| updated_at        | timestamptz | Last re-parse                         |
+-------------------+-------------+---------------------------------------+

INDEXES:
- agent_catalog_slug_key (unique on slug)
- agent_catalog_division_idx (for filtering by tab)
- agent_catalog_tags_idx (GIN index for tag search)
```

---

### agent_assignments

Links agents to projects. Created when wizard completes (Step 5) or manually by agency.

```
TABLE: agent_assignments
PURPOSE: Which agents are assigned to which project, with role context

+-------------------+-------------+---------------------------------------+
| Column            | Type        | Description                           |
+-------------------+-------------+---------------------------------------+
| id                | uuid (PK)   | Auto-generated                        |
| project_id        | uuid (FK)   | References projects.id                |
| agent_slug        | text (FK)   | References agent_catalog.slug         |
| role_description  | text        | e.g. "Builds your booking bot MVP"    |
| assigned_by       | text        | "wizard" or "manual" or user_id       |
| status            | text        | "active", "paused", "completed"       |
| first_task        | text (null) | e.g. "Build booking bot spec"         |
| created_at        | timestamptz | When assigned                         |
| updated_at        | timestamptz | Last status change                    |
+-------------------+-------------+---------------------------------------+

INDEXES:
- agent_assignments_project_idx (for dashboard: "show my team")
- agent_assignments_agent_idx (for catalog: "assigned to N projects")

CONSTRAINTS:
- UNIQUE(project_id, agent_slug) — one agent per project, no duplicates
```

---

### agent_runs

Logs every time an agent is executed. Used for Agent Runner history and monitoring.

```
TABLE: agent_runs
PURPOSE: Audit log of all agent executions

+-------------------+-------------+---------------------------------------+
| Column            | Type        | Description                           |
+-------------------+-------------+---------------------------------------+
| id                | uuid (PK)   | Auto-generated                        |
| agent_slug        | text (FK)   | Which agent ran                       |
| project_id        | uuid (FK)   | Which project context (nullable)      |
| user_id           | uuid (FK)   | Who initiated the run                 |
| route             | text        | Which product area triggered it       |
|                   |             | e.g. "wizard-recommendations",       |
|                   |             | "agent-runner", "crm-scoring"         |
| input_summary     | text        | Truncated input (first 500 chars)     |
| output_summary    | text        | Truncated output (first 500 chars)    |
| full_output       | jsonb       | Complete agent output                 |
| tokens_input      | int         | Input token count                     |
| tokens_output     | int         | Output token count                    |
| duration_ms       | int         | How long the call took                |
| model             | text        | e.g. "gemini-2.0-flash"              |
| success           | boolean     | Did it complete without error         |
| error_message     | text (null) | Error details if failed               |
| created_at        | timestamptz | When run started                      |
+-------------------+-------------+---------------------------------------+

INDEXES:
- agent_runs_agent_idx (for agent detail: "run history")
- agent_runs_project_idx (for project: "all agent activity")
- agent_runs_user_idx (for user: "my runs")
- agent_runs_created_idx (for monitoring: recent runs)
```

---

### insight_cards

Stores agent-generated insights for the dashboard. Cached and refreshed periodically.

```
TABLE: insight_cards
PURPOSE: AI-generated business insights attributed to specific agents

+-------------------+-------------+---------------------------------------+
| Column            | Type        | Description                           |
+-------------------+-------------+---------------------------------------+
| id                | uuid (PK)   | Auto-generated                        |
| project_id        | uuid (FK)   | Which project this insight is for     |
| agent_slug        | text (FK)   | Which agent generated it              |
| priority          | text        | "high", "medium", "low"               |
| title             | text        | Short headline                        |
| body              | text        | Full insight text (2-4 sentences)     |
| impact_label      | text (null) | e.g. "+35% bookings", "$14.9K/yr"     |
| action_label      | text (null) | e.g. "Take Action", "Review"          |
| status            | text        | "new", "viewed", "acted", "dismissed" |
| expires_at        | timestamptz | Auto-dismiss after this date          |
| created_at        | timestamptz | When generated                        |
+-------------------+-------------+---------------------------------------+

INDEXES:
- insight_cards_project_status_idx (for dashboard: active insights)
- insight_cards_priority_idx (for sorting)
```

---

### agent_team_templates

Pre-built agent team combinations for common client types. Used by wizard to auto-assign.

```
TABLE: agent_team_templates
PURPOSE: Predefined agent teams matched to industry + goal combinations

+-------------------+-------------+---------------------------------------+
| Column            | Type        | Description                           |
+-------------------+-------------+---------------------------------------+
| id                | uuid (PK)   | Auto-generated                        |
| name              | text        | e.g. "E-Commerce Growth Team"         |
| industry          | text        | e.g. "e-commerce", "healthcare"       |
| goal              | text        | e.g. "scale-revenue", "launch-mvp"    |
| company_size      | text        | e.g. "1-10", "11-50", "50+"           |
| agents            | jsonb       | Array of agent assignments:           |
|                   |             | [{"slug": "...",                      |
|                   |             |   "role": "...",                      |
|                   |             |   "first_task": "..."}]               |
| is_active         | boolean     | Can be disabled                       |
| created_at        | timestamptz | When created                          |
+-------------------+-------------+---------------------------------------+
```

---

## Relationships

```
projects (existing)
    |
    +----< agent_assignments >----+ agent_catalog
    |                              |
    +----< agent_runs              |
    |                              |
    +----< insight_cards >---------+

users (existing)
    |
    +----< agent_runs

agent_team_templates (standalone, used by wizard logic)
```

---

## Sample Data

### agent_catalog (3 rows)

```
slug:        "engineering-rapid-prototyper"
name:        "Rapid Prototyper"
description: "Ultra-fast MVP development and proof-of-concept"
division:    "engineering"
emoji:       "⚡"
color:       "green"
vibe:        "Turns an idea into a working prototype before the meeting's over."
file_path:   "engineering/engineering-rapid-prototyper.md"
line_count:  193
tags:        ["mvp", "prototype", "fast", "validation", "startup"]
is_active:   true
```

### agent_assignments (for Dr. Patel's project)

```
project_id:       "proj-abc-123"
agent_slug:       "engineering-rapid-prototyper"
role_description: "Builds your WhatsApp booking bot MVP in 2 weeks"
assigned_by:      "wizard"
status:           "active"
first_task:       "Scope WhatsApp booking bot MVP"
```

### insight_cards (for Dr. Patel's project)

```
project_id:   "proj-abc-123"
agent_slug:   "marketing-growth-hacker"
priority:     "high"
title:        "Your Google reviews are below competitors"
body:         "Your clinic has 3.8 stars. Your top 3 competitors average 4.5.
              Patients check reviews before booking. Quick win: send an automated
              review request SMS 2 hours after each appointment."
impact_label: "+35% new patient bookings"
action_label: "Set Up Review Requests"
status:       "new"
```

### agent_team_templates (for healthcare + launch-mvp)

```
name:         "Healthcare MVP Team"
industry:     "healthcare"
goal:         "launch-mvp"
company_size: "1-10"
agents: [
  {"slug": "engineering-rapid-prototyper",
   "role": "Builds your booking system MVP",
   "first_task": "Scope booking bot"},
  {"slug": "support-support-responder",
   "role": "Designs patient communication flows",
   "first_task": "Map patient FAQ"},
  {"slug": "support-finance-tracker",
   "role": "Projects cost savings and ROI",
   "first_task": "Baseline cost report"},
  {"slug": "project-management-project-shepherd",
   "role": "Manages implementation roadmap",
   "first_task": "Set up sprint plan"},
  {"slug": "testing-reality-checker",
   "role": "Validates recommendations before delivery",
   "first_task": "Review bot spec"}
]
```
