-- ============================================================================
-- Migration: Create or fix ai_cache and ai_run_logs tables
-- Purpose:   Gemini response caching with TTL expiry, and audit logging for
--            every AI call (success or failure). These tables support the
--            AI Agent Management dashboard and the callGemini() utility.
-- Affected:  ai_cache, ai_run_logs (CREATE IF NOT EXISTS + ALTER ADD COLUMN)
-- Ref:       /supabase/functions/server/gemini.tsx (getCachedResult, setCachedResult, logAIRun)
--            /supabase/functions/server/ai-routes.tsx (run-logs, cache-stats, aggregate-stats)
--            /lib/supabase.ts (RunLogEntry, CacheStats, AggregateStats interfaces)
-- Safety:    Uses CREATE TABLE IF NOT EXISTS for fresh installs.
--            Uses ALTER TABLE ADD COLUMN IF NOT EXISTS for tables that exist
--            but are missing required columns (e.g. created via Supabase UI
--            with a different schema than the code expects).
--            DESTRUCTIVE: If tables exist with incompatible primary keys,
--            they are DROPPED and recreated. This loses existing data.
--            Both tables are accessed exclusively via adminClient (service-role)
--            which bypasses RLS.
-- ============================================================================

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: ai_cache
-- Gemini response cache with SHA-256 hash key and TTL via expires_at.
-- gemini.tsx checks: input_hash = hash AND expires_at > now()
-- gemini.tsx writes: upsert on input_hash with response, model, tokens_used, expires_at
--
-- EXPECTED PRIMARY KEY: input_hash (text)
-- If the table exists with a different PK (e.g. "id"), the code will fail
-- on every cache operation. In that case we DROP and recreate.
-- ═══════════════════════════════════════════════════════════════════════════

do $$
declare
  _pk_col text;
begin
  -- Check if ai_cache table exists
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'ai_cache') then
    -- Check what the primary key column is
    select a.attname into _pk_col
    from pg_index i
    join pg_attribute a on a.attrelid = i.indrelid and a.attnum = any(i.indkey)
    join pg_class c on c.oid = i.indrelid
    where c.relname = 'ai_cache' and i.indisprimary
    limit 1;

    if _pk_col is distinct from 'input_hash' then
      -- DESTRUCTIVE: Table exists with wrong primary key — must recreate.
      -- Existing cached data will be lost, but cache is ephemeral by nature.
      raise notice 'ai_cache has PK column "%" instead of "input_hash" — dropping and recreating', _pk_col;
      drop table ai_cache cascade;
    else
      -- Table exists with correct PK — add any missing columns
      raise notice 'ai_cache exists with correct PK — adding missing columns if any';
    end if;
  end if;
end $$;

create table if not exists ai_cache (
  input_hash  text        primary key,
  response    jsonb       not null default '{}'::jsonb,
  model       text        not null default 'gemini-2.0-flash',
  tokens_used integer     not null default 0,
  expires_at  timestamptz not null default now(),
  created_at  timestamptz not null default now()
);

-- Add missing columns for tables that existed but were incomplete
alter table ai_cache add column if not exists response    jsonb       not null default '{}'::jsonb;
alter table ai_cache add column if not exists model       text        not null default 'gemini-2.0-flash';
alter table ai_cache add column if not exists tokens_used integer     not null default 0;
alter table ai_cache add column if not exists expires_at  timestamptz not null default now();
alter table ai_cache add column if not exists created_at  timestamptz not null default now();

comment on table ai_cache is
  'Gemini AI response cache. Keyed by SHA-256 hash of function name + input. TTL via expires_at column.';

alter table ai_cache enable row level security;

create index if not exists idx_ai_cache_created_at
  on ai_cache (created_at desc);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE: ai_run_logs
-- Audit trail for every Gemini API call. Logged by gemini.tsx logAIRun().
-- Read by ai-routes.tsx: run-logs (paginated list), aggregate-stats (summaries).
-- Frontend type: RunLogEntry in /lib/supabase.ts
--
-- EXPECTED PRIMARY KEY: id (uuid)
-- If the table exists but is missing critical columns like prompt_type,
-- tokens_used, etc., we add them. If it has a different PK, we recreate.
-- ═══════════════════════════════════════════════════════════════════════════

do $$
declare
  _pk_col text;
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'ai_run_logs') then
    select a.attname into _pk_col
    from pg_index i
    join pg_attribute a on a.attrelid = i.indrelid and a.attnum = any(i.indkey)
    join pg_class c on c.oid = i.indrelid
    where c.relname = 'ai_run_logs' and i.indisprimary
    limit 1;

    if _pk_col is distinct from 'id' then
      -- DESTRUCTIVE: Table exists with wrong primary key — must recreate.
      -- Existing log data will be lost.
      raise notice 'ai_run_logs has PK column "%" instead of "id" — dropping and recreating', _pk_col;
      drop table ai_run_logs cascade;
    else
      raise notice 'ai_run_logs exists with correct PK — adding missing columns if any';
    end if;
  end if;
end $$;

create table if not exists ai_run_logs (
  id            uuid        primary key default gen_random_uuid(),
  session_id    text        null,
  org_id        uuid        null,
  prompt_type   text        not null default 'unknown',
  model         text        not null default 'gemini-2.0-flash',
  tokens_used   integer     not null default 0,
  duration_ms   integer     not null default 0,
  success       boolean     not null default true,
  error_message text        null,
  created_at    timestamptz not null default now()
);

-- Add missing columns for tables that existed but were incomplete
-- Using defaults so ALTER works even if rows already exist
alter table ai_run_logs add column if not exists session_id    text        null;
alter table ai_run_logs add column if not exists org_id        uuid        null;
alter table ai_run_logs add column if not exists prompt_type   text        not null default 'unknown';
alter table ai_run_logs add column if not exists model         text        not null default 'gemini-2.0-flash';
alter table ai_run_logs add column if not exists tokens_used   integer     not null default 0;
alter table ai_run_logs add column if not exists duration_ms   integer     not null default 0;
alter table ai_run_logs add column if not exists success       boolean     not null default true;
alter table ai_run_logs add column if not exists error_message text        null;
alter table ai_run_logs add column if not exists created_at    timestamptz not null default now();

comment on table ai_run_logs is
  'Audit log for every Gemini AI API call. Tracks tokens, latency, success/failure for the Agent Management dashboard.';

alter table ai_run_logs enable row level security;

-- Indexes
create index if not exists idx_ai_run_logs_created_at
  on ai_run_logs (created_at desc);

create index if not exists idx_ai_run_logs_session_id
  on ai_run_logs (session_id)
  where session_id is not null;

create index if not exists idx_ai_run_logs_prompt_type
  on ai_run_logs (prompt_type);
