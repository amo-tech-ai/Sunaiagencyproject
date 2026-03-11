---
id: 007-database-schema-core
diagram_id: CORE-DATA-01
prd_section: Database Schema
title: Core database schema — organizations, profiles, team members, wizard tables
skill: backend
phase: CORE
priority: P0
status: Done (schema exists, no migration)
owner: Backend
dependencies: []
estimated_effort: L
percent_complete: 80
---

## Objective
Create Supabase SQL migration for the foundational tables: organizations, profiles, team members, wizard sessions, wizard answers, and context snapshots.

## Scope
- `organizations` table:
  - uuid id PK (gen_random_uuid)
  - text name NOT NULL
  - text slug UNIQUE
  - text industry, text website_url, text description
  - jsonb settings DEFAULT '{}'
  - uuid owner_id FK references auth.users
  - timestamptz created_at DEFAULT now(), updated_at
- `profiles` table:
  - uuid id PK references auth.users
  - uuid org_id FK references organizations
  - text full_name, text email NOT NULL, text avatar_url
  - text role DEFAULT 'client'
  - jsonb preferences DEFAULT '{}'
  - timestamptz created_at, updated_at
- `team_members` table:
  - uuid id PK, uuid org_id FK NOT NULL, uuid profile_id FK NOT NULL
  - text role NOT NULL (Owner, Consultant, Client)
  - text status DEFAULT 'active'
  - jsonb permissions, timestamptz invited_at, joined_at, created_at
  - UNIQUE(org_id, profile_id)
- `wizard_sessions` table:
  - uuid id PK, uuid org_id FK NOT NULL, uuid created_by FK
  - int current_step DEFAULT 1 CHECK (1-5)
  - text status DEFAULT 'in_progress'
  - jsonb metadata, timestamptz started_at, completed_at, updated_at, created_at
- `wizard_answers` table:
  - uuid id PK, uuid session_id FK NOT NULL
  - int step_number NOT NULL CHECK (1-5)
  - jsonb data NOT NULL
  - text status DEFAULT 'draft'
  - timestamptz created_at, updated_at
  - UNIQUE(session_id, step_number)
- `context_snapshots` table:
  - uuid id PK, uuid session_id FK NOT NULL
  - int version NOT NULL
  - jsonb snapshot_data NOT NULL, text trigger
  - timestamptz created_at
- Indexes on all FK columns and org_id columns

## Acceptance Criteria
- Migration runs clean via `supabase db push`
- All 6 tables created with correct types, constraints, and defaults
- FK constraints enforce referential integrity
- wizard_answers has unique constraint on (session_id, step_number)
- Default values work: timestamps auto-set, status fields have defaults
- CHECK constraints enforce step_number and current_step range

## Failure Handling
- Migration rollback script provided (DROP TABLE IF EXISTS)
- Duplicate migration execution is idempotent (CREATE TABLE IF NOT EXISTS)
