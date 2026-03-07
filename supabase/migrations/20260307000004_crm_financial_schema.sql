-- =============================================================================
-- Migration 018: CRM & Financial schema
-- Applied to production: 2026-03-07
-- Prompt ref: /tasks/prompts/018-database-schema-crm-financial.md
--
-- Purpose: Codify the 12 CRM/financial tables that exist in production but
-- had no migration file. Tables: clients, crm_contacts, crm_deals,
-- crm_interactions, crm_pipelines, crm_stages, invoices, payments,
-- milestones, deliverables, documents, activities.
-- Also creates custom enum types used by crm_interactions.
--
-- Note: uses "if not exists" throughout since tables already exist in production.
-- =============================================================================

begin;

-- ============================================================
-- enum types
-- ============================================================
do $$ begin
  create type crm_interaction_type as enum ('email','call','meeting','note','linkedin','system');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type crm_sentiment as enum ('positive','neutral','negative','churn_risk');
exception when duplicate_object then null;
end $$;

-- ============================================================
-- clients
-- ============================================================
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  name text not null,
  industry text,
  website_url text,
  pipeline_stage text default 'new',
  status text default 'lead',
  assigned_to uuid,
  value numeric,
  last_activity_at timestamptz,
  contact_name text,
  contact_email text,
  contact_phone text,
  company_size text,
  notes text,
  lifecycle_stage text default 'lead',
  health_score integer default 50,
  next_action_date timestamptz,
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.clients enable row level security;

-- ============================================================
-- crm_pipelines
-- ============================================================
create table if not exists public.crm_pipelines (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  name text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.crm_pipelines enable row level security;

-- ============================================================
-- crm_stages
-- ============================================================
create table if not exists public.crm_stages (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null,
  name text not null,
  probability integer not null default 0,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.crm_stages enable row level security;

-- ============================================================
-- crm_contacts
-- ============================================================
create table if not exists public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  client_id uuid,
  first_name text not null,
  last_name text,
  email text,
  phone text,
  linkedin_url text,
  job_title text,
  is_primary boolean not null default false,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.crm_contacts enable row level security;

-- ============================================================
-- crm_deals
-- ============================================================
create table if not exists public.crm_deals (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  client_id uuid not null,
  stage_id uuid,
  title text not null,
  amount numeric not null default 0,
  currency text not null default 'USD',
  expected_close_date date,
  owner_id uuid,
  win_probability integer,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.crm_deals enable row level security;

-- ============================================================
-- crm_interactions
-- ============================================================
create table if not exists public.crm_interactions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  client_id uuid,
  deal_id uuid,
  contact_id uuid,
  type crm_interaction_type not null,
  direction text,
  subject text,
  content text,
  summary text,
  embedding vector(1536),
  sentiment crm_sentiment default 'neutral',
  created_by uuid,
  created_at timestamptz not null default now()
);

alter table public.crm_interactions enable row level security;

-- ============================================================
-- invoices
-- ============================================================
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  project_id uuid,
  invoice_number text not null,
  amount_cents integer not null,
  currency text not null default 'USD',
  status text not null default 'draft',
  due_date date,
  paid_date date,
  line_items jsonb,
  pdf_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.invoices enable row level security;

-- ============================================================
-- payments
-- ============================================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  invoice_id uuid not null,
  amount_cents integer not null,
  payment_method text,
  stripe_id text,
  transaction_id text,
  status text not null default 'pending',
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payments enable row level security;

-- ============================================================
-- milestones
-- ============================================================
create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  project_id uuid not null,
  phase_id uuid,
  title text not null,
  description text,
  due_date date not null,
  completed_at timestamptz,
  status text not null default 'upcoming',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.milestones enable row level security;

-- ============================================================
-- deliverables
-- ============================================================
create table if not exists public.deliverables (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  phase_id uuid not null,
  title text not null,
  description text,
  status text not null default 'pending',
  due_date date,
  delivered_at timestamptz,
  assigned_to uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.deliverables enable row level security;

-- ============================================================
-- documents
-- ============================================================
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  wizard_session_id uuid,
  project_id uuid,
  name text not null,
  storage_path text not null,
  file_size integer not null,
  mime_type text not null,
  content_text text,
  embedding vector(768),
  summary text,
  category text not null,
  uploaded_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.documents enable row level security;

-- ============================================================
-- activities
-- ============================================================
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  client_id uuid,
  project_id uuid,
  activity_type text not null,
  title text not null,
  description text,
  metadata jsonb,
  sentiment text,
  created_by uuid,
  created_at timestamptz not null default now()
);

alter table public.activities enable row level security;

-- ============================================================
-- foreign keys (idempotent via if not exists pattern)
-- ============================================================

-- clients
alter table public.clients add constraint clients_org_id_fkey
  foreign key (org_id) references public.organizations(id) on delete cascade;
alter table public.clients add constraint clients_assigned_to_fkey
  foreign key (assigned_to) references public.profiles(id) on delete set null;

-- crm_pipelines
alter table public.crm_pipelines add constraint crm_pipelines_org_id_fkey
  foreign key (org_id) references public.organizations(id) on delete cascade;

-- crm_stages
alter table public.crm_stages add constraint crm_stages_pipeline_id_fkey
  foreign key (pipeline_id) references public.crm_pipelines(id) on delete cascade;

-- crm_contacts
alter table public.crm_contacts add constraint crm_contacts_org_id_fkey
  foreign key (org_id) references public.organizations(id) on delete cascade;
alter table public.crm_contacts add constraint crm_contacts_client_id_fkey
  foreign key (client_id) references public.clients(id) on delete set null;

-- crm_deals
alter table public.crm_deals add constraint crm_deals_org_id_fkey
  foreign key (org_id) references public.organizations(id) on delete cascade;
alter table public.crm_deals add constraint crm_deals_client_id_fkey
  foreign key (client_id) references public.clients(id) on delete cascade;
alter table public.crm_deals add constraint crm_deals_stage_id_fkey
  foreign key (stage_id) references public.crm_stages(id) on delete set null;
alter table public.crm_deals add constraint crm_deals_owner_id_fkey
  foreign key (owner_id) references public.profiles(id) on delete set null;

-- crm_interactions
alter table public.crm_interactions add constraint crm_interactions_org_id_fkey
  foreign key (org_id) references public.organizations(id) on delete cascade;
alter table public.crm_interactions add constraint crm_interactions_client_id_fkey
  foreign key (client_id) references public.clients(id) on delete cascade;
alter table public.crm_interactions add constraint crm_interactions_deal_id_fkey
  foreign key (deal_id) references public.crm_deals(id) on delete set null;
alter table public.crm_interactions add constraint crm_interactions_contact_id_fkey
  foreign key (contact_id) references public.crm_contacts(id) on delete set null;
alter table public.crm_interactions add constraint crm_interactions_created_by_fkey
  foreign key (created_by) references public.profiles(id) on delete set null;

-- invoices
alter table public.invoices add constraint invoices_org_id_fkey
  foreign key (org_id) references public.organizations(id) on delete cascade;
alter table public.invoices add constraint invoices_project_id_fkey
  foreign key (project_id) references public.projects(id) on delete set null;

-- payments
alter table public.payments add constraint payments_org_id_fkey
  foreign key (org_id) references public.organizations(id) on delete cascade;
alter table public.payments add constraint payments_invoice_id_fkey
  foreign key (invoice_id) references public.invoices(id) on delete cascade;

-- milestones
alter table public.milestones add constraint milestones_org_id_fkey
  foreign key (org_id) references public.organizations(id) on delete cascade;
alter table public.milestones add constraint milestones_project_id_fkey
  foreign key (project_id) references public.projects(id) on delete cascade;
alter table public.milestones add constraint milestones_phase_id_fkey
  foreign key (phase_id) references public.roadmap_phases(id) on delete set null;

-- deliverables
alter table public.deliverables add constraint deliverables_org_id_fkey
  foreign key (org_id) references public.organizations(id) on delete cascade;
alter table public.deliverables add constraint deliverables_phase_id_fkey
  foreign key (phase_id) references public.roadmap_phases(id) on delete cascade;
alter table public.deliverables add constraint deliverables_assigned_to_fkey
  foreign key (assigned_to) references public.profiles(id) on delete set null;

-- documents
alter table public.documents add constraint documents_org_id_fkey
  foreign key (org_id) references public.organizations(id) on delete cascade;
alter table public.documents add constraint documents_wizard_session_id_fkey
  foreign key (wizard_session_id) references public.wizard_sessions(id) on delete cascade;
alter table public.documents add constraint documents_project_id_fkey
  foreign key (project_id) references public.projects(id) on delete cascade;
alter table public.documents add constraint documents_uploaded_by_fkey
  foreign key (uploaded_by) references public.profiles(id) on delete set null;

-- activities
alter table public.activities add constraint activities_org_id_fkey
  foreign key (org_id) references public.organizations(id) on delete cascade;
alter table public.activities add constraint activities_client_id_fkey
  foreign key (client_id) references public.clients(id) on delete set null;
alter table public.activities add constraint activities_project_id_fkey
  foreign key (project_id) references public.projects(id) on delete set null;
alter table public.activities add constraint activities_created_by_fkey
  foreign key (created_by) references public.profiles(id) on delete set null;

-- ============================================================
-- indexes on fk and commonly queried columns
-- ============================================================
create index if not exists idx_clients_org_id on public.clients(org_id);
create index if not exists idx_crm_pipelines_org_id on public.crm_pipelines(org_id);
create index if not exists idx_crm_stages_pipeline_id on public.crm_stages(pipeline_id);
create index if not exists idx_crm_contacts_org_id on public.crm_contacts(org_id);
create index if not exists idx_crm_contacts_client_id on public.crm_contacts(client_id);
create index if not exists idx_crm_deals_org_id on public.crm_deals(org_id);
create index if not exists idx_crm_deals_client_id on public.crm_deals(client_id);
create index if not exists idx_crm_deals_stage_id on public.crm_deals(stage_id);
create index if not exists idx_crm_interactions_org_id on public.crm_interactions(org_id);
create index if not exists idx_crm_interactions_client_id on public.crm_interactions(client_id);
create index if not exists idx_invoices_org_id on public.invoices(org_id);
create index if not exists idx_invoices_project_id on public.invoices(project_id);
create index if not exists idx_payments_org_id on public.payments(org_id);
create index if not exists idx_payments_invoice_id on public.payments(invoice_id);
create index if not exists idx_milestones_org_id on public.milestones(org_id);
create index if not exists idx_milestones_project_id on public.milestones(project_id);
create index if not exists idx_deliverables_org_id on public.deliverables(org_id);
create index if not exists idx_deliverables_phase_id on public.deliverables(phase_id);
create index if not exists idx_documents_org_id on public.documents(org_id);
create index if not exists idx_activities_org_id on public.activities(org_id);
create index if not exists idx_activities_client_id on public.activities(client_id);

commit;
