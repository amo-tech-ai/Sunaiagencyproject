---
id: 018-database-schema-crm-financial
diagram_id: CORE-DATA-01
prd_section: Database Schema
title: CRM and financial schema migration — clients, CRM, invoices, payments, deliverables
skill: backend
phase: CORE
priority: P0
status: Done
owner: Backend
dependencies:
  - 007-database-schema-core
  - 008-database-schema-project
estimated_effort: L
percent_complete: 100
---

## Objective
Create Supabase SQL migration codifying the 12 tables that exist in production but have no migration file: clients, CRM module (5 tables), financial module (invoices, payments), and project delivery (milestones, deliverables, documents, activities).

## Context (from audit 2026-03-07)
All 12 tables already exist in production with correct columns, types, FKs, indexes, and RLS policies. This prompt creates the migration artifact for reproducibility, CI/CD, and version control. The schema is 80% complete — tables exist but lack CHECK constraints and migration files.

## Scope

### CRM Tables (6 tables)
- `clients` (16 indexes, 6 RLS policies):
  - uuid id PK, uuid org_id FK NOT NULL, text name NOT NULL
  - text email, text phone, text industry, text company_size
  - text status, text lifecycle_stage, text pipeline_stage
  - integer health_score, uuid assigned_to FK -> profiles
  - text website_url, text notes, jsonb metadata
  - timestamptz onboarded_at, last_activity_at, next_action_date, created_at, updated_at
- `crm_contacts`:
  - uuid id PK, uuid org_id FK NOT NULL, uuid client_id FK
  - text name NOT NULL, text email, text phone, text title, text role
  - boolean is_primary DEFAULT false, jsonb tags DEFAULT '[]'
  - timestamptz created_at, updated_at
- `crm_pipelines`:
  - uuid id PK, uuid org_id FK NOT NULL
  - text name NOT NULL, boolean is_default DEFAULT false
  - timestamptz created_at, updated_at
- `crm_stages`:
  - uuid id PK, uuid pipeline_id FK NOT NULL
  - text name NOT NULL, integer display_order NOT NULL
  - text color, boolean is_closed DEFAULT false
  - timestamptz created_at, updated_at
- `crm_deals`:
  - uuid id PK, uuid org_id FK NOT NULL, uuid client_id FK NOT NULL
  - uuid stage_id FK -> crm_stages, uuid owner_id FK -> profiles
  - text name NOT NULL, text status DEFAULT 'open'
  - numeric amount, text currency DEFAULT 'USD'
  - date expected_close_date, jsonb metadata
  - timestamptz closed_at, created_at, updated_at
- `crm_interactions`:
  - uuid id PK, uuid org_id FK NOT NULL
  - uuid client_id FK, uuid contact_id FK -> crm_contacts
  - uuid deal_id FK -> crm_deals, uuid created_by FK -> profiles
  - crm_interaction_type type NOT NULL (enum)
  - text subject, text content, crm_sentiment sentiment
  - vector embedding, jsonb metadata
  - timestamptz created_at, updated_at

### Financial Tables (2 tables)
- `invoices`:
  - uuid id PK, uuid org_id FK NOT NULL, uuid project_id FK
  - text invoice_number UNIQUE NOT NULL
  - text status DEFAULT 'draft', numeric amount NOT NULL, text currency DEFAULT 'USD'
  - date issue_date, date due_date, date paid_at
  - jsonb line_items DEFAULT '[]'
  - timestamptz created_at, updated_at
- `payments`:
  - uuid id PK, uuid org_id FK NOT NULL, uuid invoice_id FK NOT NULL
  - numeric amount NOT NULL, text currency DEFAULT 'USD'
  - text status DEFAULT 'pending', text method
  - text stripe_id, text transaction_id
  - jsonb metadata
  - timestamptz paid_at, created_at, updated_at

### Project Delivery Tables (4 tables)
- `milestones`:
  - uuid id PK, uuid org_id FK NOT NULL, uuid project_id FK NOT NULL
  - uuid phase_id FK -> roadmap_phases
  - text title NOT NULL, text description, text status DEFAULT 'pending'
  - date due_date, date completed_at
  - timestamptz created_at, updated_at
- `deliverables`:
  - uuid id PK, uuid org_id FK NOT NULL, uuid phase_id FK -> roadmap_phases
  - uuid assigned_to FK -> profiles
  - text title NOT NULL, text description, text status DEFAULT 'pending'
  - text type, date due_date
  - timestamptz created_at, updated_at
- `documents`:
  - uuid id PK, uuid org_id FK NOT NULL, uuid project_id FK
  - uuid wizard_session_id FK, uuid uploaded_by FK -> profiles
  - text name NOT NULL, text file_path, text category
  - text mime_type, integer file_size
  - vector embedding, jsonb metadata
  - timestamptz created_at, updated_at
- `activities`:
  - uuid id PK, uuid org_id FK NOT NULL
  - uuid client_id FK, uuid project_id FK, uuid created_by FK -> profiles
  - text activity_type NOT NULL, text title NOT NULL, text description
  - jsonb metadata
  - timestamptz created_at

### Custom Enum Types (include in migration)
```sql
CREATE TYPE crm_interaction_type AS ENUM ('email','call','meeting','note','linkedin','system');
CREATE TYPE crm_sentiment AS ENUM ('positive','neutral','negative','churn_risk');
```

### Indexes (all exist in production, codify in migration)
- All FK columns indexed
- Composite indexes: (org_id, status), (org_id, lifecycle_stage), (org_id, pipeline_stage) on clients
- IVFFlat on crm_interactions.embedding and documents.embedding
- GIN on all JSONB columns (metadata, tags, line_items)
- Partial indexes on conditional columns

## Acceptance Criteria
- Migration file creates all 12 tables with correct schema matching production
- Enum types created before tables that reference them
- All FK constraints match production (65 total across full schema)
- All indexes created matching production (audit counted 194 total)
- Migration is idempotent (IF NOT EXISTS where possible)
- Running migration against current production is a no-op (tables already exist)

## Failure Handling
- Use `CREATE TABLE IF NOT EXISTS` to be safe against existing tables
- Use `CREATE TYPE IF NOT EXISTS` for enums
- Use `CREATE INDEX IF NOT EXISTS` for all indexes
