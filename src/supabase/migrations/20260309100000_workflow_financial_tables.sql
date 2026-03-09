-- =============================================================================
-- Migration: workflow + financial dashboard tables (replace KV)
-- Purpose: workflows, workflow_executions, dashboard_invoices, dashboard_payments
--          so workflow-routes and financial-routes use Supabase instead of kv_store.
-- Ref: tasks/prompts/data/070-migrate-kv-workflow-financial-to-supabase-tables.md
-- =============================================================================

-- -----------------------------------------------------------------------------
-- workflows
-- -----------------------------------------------------------------------------
create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  description text not null default '',
  trigger jsonb,
  conditions jsonb not null default '[]'::jsonb,
  actions jsonb not null default '[]'::jsonb,
  status text not null default 'disabled' check (status in ('enabled', 'disabled')),
  last_run_at timestamptz,
  success_count integer not null default 0,
  fail_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id text
);

comment on table public.workflows is 'Workflow automation definitions (migrated from KV).';

alter table public.workflows enable row level security;

create index if not exists idx_workflows_user_updated on public.workflows (user_id, updated_at desc);
create index if not exists idx_workflows_status on public.workflows (status);

-- RLS: service role bypasses; anon/authenticated can use policies if needed later
create policy "workflows_select" on public.workflows for select using (true);
create policy "workflows_insert" on public.workflows for insert with check (true);
create policy "workflows_update" on public.workflows for update using (true);
create policy "workflows_delete" on public.workflows for delete using (true);

-- -----------------------------------------------------------------------------
-- workflow_executions
-- -----------------------------------------------------------------------------
create table if not exists public.workflow_executions (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  workflow_name text,
  status text not null default 'success',
  duration_ms integer not null default 0,
  trigger_data jsonb,
  action_results jsonb,
  error_message text,
  is_dry_run boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.workflow_executions is 'Workflow run history (migrated from KV wf_exec).';

alter table public.workflow_executions enable row level security;

create index if not exists idx_workflow_executions_workflow_id on public.workflow_executions (workflow_id);
create index if not exists idx_workflow_executions_created_at on public.workflow_executions (created_at desc);

create policy "workflow_executions_select" on public.workflow_executions for select using (true);
create policy "workflow_executions_insert" on public.workflow_executions for insert with check (true);

-- -----------------------------------------------------------------------------
-- dashboard_invoices (dashboard financial; distinct from public.invoices)
-- -----------------------------------------------------------------------------
create table if not exists public.dashboard_invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null,
  client_id text default '',
  client_name text not null default 'Unknown Client',
  project_id text default '',
  project_name text not null default 'General',
  amount numeric not null default 0,
  status text not null default 'draft' check (status in ('draft', 'sent', 'paid', 'overdue')),
  issue_date date not null default current_date,
  due_date date not null,
  payment_date date,
  line_items jsonb not null default '[]'::jsonb,
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id text
);

comment on table public.dashboard_invoices is 'Dashboard invoices (migrated from KV); separate from public.invoices.';

alter table public.dashboard_invoices enable row level security;

create unique index if not exists idx_dashboard_invoices_number on public.dashboard_invoices (invoice_number);
create index if not exists idx_dashboard_invoices_user_created on public.dashboard_invoices (user_id, created_at desc);
create index if not exists idx_dashboard_invoices_status on public.dashboard_invoices (status);

create policy "dashboard_invoices_select" on public.dashboard_invoices for select using (true);
create policy "dashboard_invoices_insert" on public.dashboard_invoices for insert with check (true);
create policy "dashboard_invoices_update" on public.dashboard_invoices for update using (true);
create policy "dashboard_invoices_delete" on public.dashboard_invoices for delete using (true);

-- -----------------------------------------------------------------------------
-- dashboard_payments
-- -----------------------------------------------------------------------------
create table if not exists public.dashboard_payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.dashboard_invoices(id) on delete cascade,
  amount numeric not null default 0,
  payment_date date not null default current_date,
  method text default 'bank_transfer',
  notes text,
  recorded_by text,
  created_at timestamptz not null default now()
);

comment on table public.dashboard_payments is 'Dashboard payment records (migrated from KV).';

alter table public.dashboard_payments enable row level security;

create index if not exists idx_dashboard_payments_invoice_id on public.dashboard_payments (invoice_id);
create index if not exists idx_dashboard_payments_created_at on public.dashboard_payments (created_at desc);

create policy "dashboard_payments_select" on public.dashboard_payments for select using (true);
create policy "dashboard_payments_insert" on public.dashboard_payments for insert with check (true);
