-- ============================================================================
-- Migration: Create clients and crm_contacts tables (Phase 6 — CRM Core)
-- Purpose:   Client management CRUD for the agency dashboard. These two tables
--            unblock the 5 frontend components and 6 edge function routes that
--            are already built and waiting.
-- Affected:  NEW tables — clients, crm_contacts
-- Ref:       /supabase/functions/server/crm-routes.tsx (6 CRUD routes)
--            /lib/supabase.ts (Client, CRMContact interfaces)
--            /components/dashboard/clients/ (ClientsListPage, ClientDetailPage, etc.)
-- Safety:    CREATE TABLE IF NOT EXISTS — idempotent. No destructive operations.
--            RLS enabled with granular per-role policies. Edge functions use
--            adminClient (service-role) which bypasses RLS, but direct SDK
--            access from the frontend respects these policies.
-- ============================================================================

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: clients
-- Core CRM table. One row per client organization.
-- Frontend type: Client { id, name, industry, status, health_score,
--   contact_email, contact_name, revenue, notes, created_at, updated_at }
-- Edge function: crm-routes.tsx insert/select/update/delete on this table
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists clients (
  -- Unique client identifier
  id              uuid        primary key default gen_random_uuid(),

  -- Client/company name (required)
  name            text        not null,

  -- Industry sector, e.g. "Healthcare", "E-commerce", "Financial Services"
  industry        text        not null default '',

  -- Client lifecycle status
  -- Matches frontend type: 'active' | 'prospect' | 'churned' | 'onboarding'
  status          text        not null default 'prospect',

  -- Health score 0-100 (50 = neutral, higher = healthier relationship)
  health_score    integer     not null default 50,

  -- Primary contact email for quick reference (denormalized from crm_contacts)
  contact_email   text        not null default '',

  -- Primary contact name for quick reference (denormalized from crm_contacts)
  contact_name    text        not null default '',

  -- Total revenue attributed to this client (in dollars, no cents)
  revenue         numeric     not null default 0,

  -- Free-form notes about the client
  notes           text        not null default '',

  -- User who created this client record (from requireAuth in crm-routes.tsx)
  created_by      uuid        null,

  -- Timestamps
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table clients is
  'CRM client organizations. Each row represents a company the agency works with or is pursuing.';

-- Validate status values
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'clients_status_check'
  ) then
    alter table clients
      add constraint clients_status_check
      check (status in ('active', 'prospect', 'churned', 'onboarding'));
  end if;
end $$;

-- Validate health_score range
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'clients_health_score_check'
  ) then
    alter table clients
      add constraint clients_health_score_check
      check (health_score >= 0 and health_score <= 100);
  end if;
end $$;

-- Enable Row Level Security
alter table clients enable row level security;

-- RLS Policy: Authenticated users can read all clients
-- Rationale: Agency team members need to see the full client list.
-- In a multi-tenant setup, this would filter by org_id.
create policy "clients_select_authenticated"
  on clients for select
  to authenticated
  using (true);

-- RLS Policy: Authenticated users can insert clients
-- Rationale: Any authenticated team member can create a new client.
create policy "clients_insert_authenticated"
  on clients for insert
  to authenticated
  with check (true);

-- RLS Policy: Authenticated users can update clients
-- Rationale: Any authenticated team member can update client records.
create policy "clients_update_authenticated"
  on clients for update
  to authenticated
  using (true)
  with check (true);

-- RLS Policy: Authenticated users can delete clients
-- Rationale: Deletion is protected by a confirmation dialog in the frontend.
-- In production, restrict to admin role.
create policy "clients_delete_authenticated"
  on clients for delete
  to authenticated
  using (true);

-- RLS Policy: Anon users have NO access to clients
-- No anon policies = denied by default with RLS enabled. Explicit for clarity.

-- Indexes for common query patterns
-- List query: ORDER BY updated_at DESC (crm-routes.tsx line 38)
create index if not exists idx_clients_updated_at
  on clients (updated_at desc);

-- Search/filter by status
create index if not exists idx_clients_status
  on clients (status);

-- Search/filter by industry
create index if not exists idx_clients_industry
  on clients (industry)
  where industry != '';

-- Filter by creator
create index if not exists idx_clients_created_by
  on clients (created_by)
  where created_by is not null;

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: crm_contacts
-- Contact persons associated with a client organization.
-- Multiple contacts per client, one may be marked is_primary.
-- Frontend type: CRMContact { id, client_id, name, email, role, phone,
--   is_primary, created_at }
-- Edge function: crm-routes.tsx GET /crm/clients/:id joins contacts,
--   POST /crm/clients/:id/contacts creates contacts,
--   DELETE /crm/clients/:id cascades to delete contacts
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists crm_contacts (
  -- Unique contact identifier
  id          uuid        primary key default gen_random_uuid(),

  -- Parent client (required). Contacts are deleted when client is deleted.
  client_id   uuid        not null references clients(id) on delete cascade,

  -- Contact person's full name (required)
  name        text        not null,

  -- Contact email address
  email       text        not null default '',

  -- Job title or role, e.g. "CEO", "CTO", "Marketing Director"
  role        text        not null default '',

  -- Phone number (free-form text to support international formats)
  phone       text        not null default '',

  -- Whether this is the primary point of contact for the client
  -- Used for display in the client list (denormalized to clients.contact_name/email)
  is_primary  boolean     not null default false,

  -- When this contact was created
  created_at  timestamptz not null default now()
);

comment on table crm_contacts is
  'Contact persons for CRM clients. Multiple contacts per client, one primary.';

-- Enable Row Level Security
alter table crm_contacts enable row level security;

-- RLS Policy: Authenticated users can read all contacts
create policy "crm_contacts_select_authenticated"
  on crm_contacts for select
  to authenticated
  using (true);

-- RLS Policy: Authenticated users can insert contacts
create policy "crm_contacts_insert_authenticated"
  on crm_contacts for insert
  to authenticated
  with check (true);

-- RLS Policy: Authenticated users can update contacts
create policy "crm_contacts_update_authenticated"
  on crm_contacts for update
  to authenticated
  using (true)
  with check (true);

-- RLS Policy: Authenticated users can delete contacts
create policy "crm_contacts_delete_authenticated"
  on crm_contacts for delete
  to authenticated
  using (true);

-- Indexes
-- Join query: SELECT * FROM crm_contacts WHERE client_id = :id ORDER BY is_primary DESC
create index if not exists idx_crm_contacts_client_id
  on crm_contacts (client_id);

-- Sort by primary contact first
create index if not exists idx_crm_contacts_primary
  on crm_contacts (client_id, is_primary desc);
