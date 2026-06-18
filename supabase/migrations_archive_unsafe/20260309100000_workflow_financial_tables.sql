-- =============================================================================
-- Migration: Workflow + financial dashboard tables
-- Purpose:   workflows, workflow_executions, dashboard_invoices, dashboard_payments
-- Safety:    CREATE TABLE IF NOT EXISTS — idempotent.
-- =============================================================================

-- =============================================================================
-- workflows — automation definitions
-- =============================================================================

create table if not exists public.workflows (
  id            uuid        primary key default gen_random_uuid(),
  name          text        not null default '',
  description   text        not null default '',
  trigger       jsonb,
  conditions    jsonb       not null default '[]'::jsonb,
  actions       jsonb       not null default '[]'::jsonb,
  status        text        not null default 'disabled'
                check (status in ('enabled', 'disabled')),
  last_run_at   timestamptz,
  success_count integer     not null default 0,
  fail_count    integer     not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  user_id       uuid
);

comment on table public.workflows is 'Workflow automation definitions.';

alter table public.workflows enable row level security;

create index if not exists idx_workflows_user_updated
  on public.workflows (user_id, updated_at desc);
create index if not exists idx_workflows_status
  on public.workflows (status);

-- separate policies per role (best practice)
create policy "workflows_select_authenticated"
  on public.workflows for select to authenticated using (true);
create policy "workflows_insert_authenticated"
  on public.workflows for insert to authenticated with check (true);
create policy "workflows_update_authenticated"
  on public.workflows for update to authenticated using (true) with check (true);
create policy "workflows_delete_authenticated"
  on public.workflows for delete to authenticated using (true);

drop trigger if exists trg_workflows_updated_at on public.workflows;
create trigger trg_workflows_updated_at
  before update on public.workflows
  for each row execute function public.handle_updated_at();

-- =============================================================================
-- workflow_executions — run history (append-only audit log)
-- No update/delete policies by design.
-- =============================================================================

create table if not exists public.workflow_executions (
  id            uuid        primary key default gen_random_uuid(),
  workflow_id   uuid        not null references public.workflows (id) on delete cascade,
  workflow_name text,
  status        text        not null default 'success',
  duration_ms   integer     not null default 0,
  trigger_data  jsonb,
  action_results jsonb,
  error_message text,
  is_dry_run    boolean     not null default false,
  created_at    timestamptz not null default now()
);

comment on table public.workflow_executions is 'Workflow run history (append-only). No update/delete policies by design.';

alter table public.workflow_executions enable row level security;

create index if not exists idx_workflow_executions_workflow_id
  on public.workflow_executions (workflow_id);
create index if not exists idx_workflow_executions_created_at
  on public.workflow_executions (created_at desc);

create policy "workflow_executions_select_authenticated"
  on public.workflow_executions for select to authenticated using (true);
create policy "workflow_executions_insert_authenticated"
  on public.workflow_executions for insert to authenticated with check (true);

-- =============================================================================
-- dashboard_invoices — financial invoices (distinct from public.invoices)
-- =============================================================================

create table if not exists public.dashboard_invoices (
  id              uuid        primary key default gen_random_uuid(),
  invoice_number  text        not null,
  client_id       uuid,
  client_name     text        not null default 'Unknown Client',
  project_id      uuid,
  project_name    text        not null default 'General',
  amount          numeric     not null default 0,
  status          text        not null default 'draft'
                  check (status in ('draft', 'sent', 'paid', 'overdue')),
  issue_date      date        not null default current_date,
  due_date        date        not null,
  payment_date    date,
  line_items      jsonb       not null default '[]'::jsonb,
  notes           text        default '',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  user_id         uuid
);

comment on table public.dashboard_invoices is 'Dashboard invoices — separate from public.invoices.';

alter table public.dashboard_invoices enable row level security;

create unique index if not exists idx_dashboard_invoices_number
  on public.dashboard_invoices (invoice_number);
create index if not exists idx_dashboard_invoices_user_created
  on public.dashboard_invoices (user_id, created_at desc);
create index if not exists idx_dashboard_invoices_status
  on public.dashboard_invoices (status);

create policy "dashboard_invoices_select_authenticated"
  on public.dashboard_invoices for select to authenticated using (true);
create policy "dashboard_invoices_insert_authenticated"
  on public.dashboard_invoices for insert to authenticated with check (true);
create policy "dashboard_invoices_update_authenticated"
  on public.dashboard_invoices for update to authenticated using (true) with check (true);
create policy "dashboard_invoices_delete_authenticated"
  on public.dashboard_invoices for delete to authenticated using (true);

drop trigger if exists trg_dashboard_invoices_updated_at on public.dashboard_invoices;
create trigger trg_dashboard_invoices_updated_at
  before update on public.dashboard_invoices
  for each row execute function public.handle_updated_at();

-- =============================================================================
-- dashboard_payments — payment records (append-only audit trail)
-- No update/delete policies by design.
-- =============================================================================

create table if not exists public.dashboard_payments (
  id            uuid        primary key default gen_random_uuid(),
  invoice_id    uuid        not null references public.dashboard_invoices (id) on delete cascade,
  amount        numeric     not null default 0,
  payment_date  date        not null default current_date,
  method        text        default 'bank_transfer',
  notes         text,
  recorded_by   uuid,
  created_at    timestamptz not null default now()
);

comment on table public.dashboard_payments is 'Dashboard payment records (append-only). No update/delete policies by design.';

alter table public.dashboard_payments enable row level security;

create index if not exists idx_dashboard_payments_invoice_id
  on public.dashboard_payments (invoice_id);
create index if not exists idx_dashboard_payments_created_at
  on public.dashboard_payments (created_at desc);

create policy "dashboard_payments_select_authenticated"
  on public.dashboard_payments for select to authenticated using (true);
create policy "dashboard_payments_insert_authenticated"
  on public.dashboard_payments for insert to authenticated with check (true);
