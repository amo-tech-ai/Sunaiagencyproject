---
id: 009-database-schema-ai
diagram_id: CORE-DATA-01
prd_section: Database Schema
title: AI and catalog schema — systems, services, ai_cache, ai_run_logs
skill: backend
phase: CORE
priority: P0
status: Done (schema exists, no migration)
owner: Backend
dependencies:
  - 007-database-schema-core
estimated_effort: M
percent_complete: 80
---

## Objective
Create Supabase SQL migration for the AI infrastructure tables (cache, logs) and the systems/services catalog.

## Scope
- `systems` table:
  - uuid id PK, text name UNIQUE NOT NULL, text category NOT NULL
  - text description, jsonb capabilities, boolean is_active DEFAULT true
  - timestamptz created_at DEFAULT now()
- `services` table:
  - uuid id PK, text name UNIQUE NOT NULL, text category NOT NULL
  - text description, jsonb pricing, boolean is_active DEFAULT true
  - timestamptz created_at DEFAULT now()
- `system_services` junction table:
  - uuid id PK, uuid system_id FK NOT NULL, uuid service_id FK NOT NULL
  - text relationship_type, timestamptz created_at
  - UNIQUE(system_id, service_id)
- `ai_cache` table:
  - uuid id PK, uuid org_id FK NOT NULL
  - text operation NOT NULL, text context_hash NOT NULL
  - jsonb result NOT NULL, int token_count
  - timestamptz expires_at, created_at DEFAULT now()
  - UNIQUE(org_id, operation, context_hash)
  - INDEX on (operation, context_hash) for fast lookups
- `ai_run_logs` table:
  - uuid id PK, uuid org_id FK
  - text agent NOT NULL, text model NOT NULL
  - int input_tokens, int output_tokens, int latency_ms
  - text status (success, error), text error_message
  - jsonb metadata, timestamptz created_at DEFAULT now()
  - INDEX on (agent, created_at) for time-range queries
  - INDEX on (org_id, created_at) for per-org analytics

## Acceptance Criteria
- Migration runs clean after 007-database-schema-core
- systems and services have UNIQUE name constraints
- ai_cache lookup by (org_id, operation, context_hash) uses index
- ai_run_logs supports efficient time-range queries by agent
- system_services prevents duplicate mappings
- All JSONB columns accept valid JSON objects

## Failure Handling
- Duplicate insert into ai_cache with same (org_id, operation, context_hash) uses ON CONFLICT UPDATE
- ai_run_logs INSERT never fails (error logging should not block the request)
