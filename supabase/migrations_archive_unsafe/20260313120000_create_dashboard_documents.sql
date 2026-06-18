-- =============================================================================
-- Migration: dashboard_documents — document metadata (files in Storage bucket)
-- Purpose:   Replace KV store doc:* keys with a proper typed table
-- Safety:    CREATE TABLE IF NOT EXISTS — idempotent.
-- =============================================================================

create table if not exists public.dashboard_documents (
  id              uuid        primary key default gen_random_uuid(),
  name            text        not null default 'Untitled',
  category        text        not null default 'deliverables',
  file_type       text        not null default 'other',
  storage_path    text        not null,
  project_id      uuid,
  project_name    text,
  uploaded_by     uuid,
  uploaded_by_name text,
  version         integer     not null default 1,
  file_size       bigint      not null default 0,
  mime_type       text        not null default 'application/octet-stream',
  ai_summary      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.dashboard_documents is 'Document metadata — files stored in Supabase Storage bucket make-283466b6-documents.';

alter table public.dashboard_documents enable row level security;

create index if not exists idx_dashboard_documents_category
  on public.dashboard_documents (category);
create index if not exists idx_dashboard_documents_uploaded_by
  on public.dashboard_documents (uploaded_by, created_at desc);
create index if not exists idx_dashboard_documents_project_id
  on public.dashboard_documents (project_id);

create policy "dashboard_documents_select_authenticated"
  on public.dashboard_documents for select to authenticated using (true);
create policy "dashboard_documents_insert_authenticated"
  on public.dashboard_documents for insert to authenticated with check (true);
create policy "dashboard_documents_update_authenticated"
  on public.dashboard_documents for update to authenticated using (true) with check (true);
create policy "dashboard_documents_delete_authenticated"
  on public.dashboard_documents for delete to authenticated using (true);

-- Allow service_role full access (edge functions use adminClient)
create policy "dashboard_documents_service_role"
  on public.dashboard_documents for all to service_role using (true) with check (true);

drop trigger if exists trg_dashboard_documents_updated_at on public.dashboard_documents;
create trigger trg_dashboard_documents_updated_at
  before update on public.dashboard_documents
  for each row execute function public.handle_updated_at();
