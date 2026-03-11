---
id: 008-database-schema-project
diagram_id: CORE-DATA-01
prd_section: Database Schema
title: Project database schema — projects, briefs, roadmaps, tasks
skill: backend
phase: CORE
priority: P0
status: Done (schema exists, no migration)
owner: Backend
dependencies:
  - 007-database-schema-core
estimated_effort: L
percent_complete: 80
---

## Objective
Create Supabase SQL migration for project delivery tables: projects, briefs, brief versions, roadmaps, roadmap phases, tasks, project systems, and project services.

## Scope
- `projects` table:
  - uuid id PK, uuid org_id FK NOT NULL, uuid wizard_session_id FK, uuid brief_id FK
  - text name NOT NULL, text status DEFAULT 'draft', text phase DEFAULT 'discovery'
  - int progress DEFAULT 0 CHECK (0-100), jsonb config
  - timestamptz started_at, target_date, created_at, updated_at
- `briefs` table:
  - uuid id PK, uuid org_id FK NOT NULL, uuid project_id FK, uuid wizard_session_id FK
  - jsonb content NOT NULL, text status DEFAULT 'draft' (draft, in_review, approved)
  - int version DEFAULT 1, text generated_by (ai, manual)
  - timestamptz approved_at, created_at, updated_at
- `brief_versions` table:
  - uuid id PK, uuid brief_id FK NOT NULL
  - int version_number NOT NULL, jsonb content NOT NULL, jsonb diff
  - uuid changed_by FK references auth.users, text change_reason
  - timestamptz created_at
- `roadmaps` table:
  - uuid id PK, uuid project_id FK NOT NULL, uuid org_id FK NOT NULL
  - text title NOT NULL, text status DEFAULT 'draft', int total_weeks
  - jsonb metadata, timestamptz created_at, updated_at
- `roadmap_phases` table:
  - uuid id PK, uuid roadmap_id FK NOT NULL
  - text name NOT NULL, text description, int phase_order NOT NULL
  - int duration_weeks, text status DEFAULT 'pending'
  - jsonb deliverables, timestamptz start_date, end_date, created_at
- `tasks` table:
  - uuid id PK, uuid project_id FK NOT NULL, uuid org_id FK NOT NULL
  - uuid roadmap_phase_id FK, uuid assigned_to FK references auth.users
  - text title NOT NULL, text description
  - text status DEFAULT 'todo' (todo, in_progress, done, blocked)
  - text priority DEFAULT 'medium' (low, medium, high, urgent)
  - boolean ai_generated DEFAULT false, jsonb metadata
  - timestamptz due_date, completed_at, created_at, updated_at
- `project_systems` table:
  - uuid id PK, uuid project_id FK NOT NULL, uuid system_id FK NOT NULL
  - text priority, jsonb config, timestamptz created_at
  - UNIQUE(project_id, system_id)
- `project_services` table:
  - uuid id PK, uuid project_id FK NOT NULL, uuid service_id FK NOT NULL
  - text scope, jsonb config, timestamptz created_at
  - UNIQUE(project_id, service_id)
- Indexes on all FK columns and org_id columns

## Acceptance Criteria
- Migration runs clean after 007-database-schema-core
- All 8 tables created with correct types and constraints
- FK references to tables from migration 007 resolve correctly
- Unique constraints on project_systems and project_services prevent duplicates
- Brief status enum allows only: draft, in_review, approved
- Task status enum allows only: todo, in_progress, done, blocked

## Failure Handling
- Migration rollback drops tables in reverse dependency order
- Constraint violations return clear Postgres error codes
