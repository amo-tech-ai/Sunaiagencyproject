# Prompt: Supabase Table Creation & Constraints

> Target: Ensure the four active tables and all constraints exist in Supabase so edge functions stop returning errors.

---

## Current State

The edge functions reference four tables: wizard_sessions, wizard_answers, ai_cache, and ai_run_logs. The db.tsx factory creates two Supabase clients (adminClient with service-role, userClient with JWT). All upserts and selects assume these tables exist with specific column names and types. If any table or column is missing, the edge function returns a 500 error with a Postgres error message.

The legacy kv_store_283466b6 table still exists but is no longer referenced by any edge function code.

## Tables to Create

### wizard_sessions

Primary table for wizard state. One row per wizard session.

Columns: id (text, primary key, the session ID like wz-1741234567890-abc12345), org_id (uuid, nullable, foreign key to organizations if that table exists), user_id (uuid, nullable, null for guest sessions), current_step (integer, default 1), status (text, default in_progress, one of in_progress completed abandoned), context_snapshot (jsonb, nullable, stores the full wizard state snapshot), created_at (timestamptz, default now), updated_at (timestamptz, default now).

No unique constraints beyond the primary key. The user_id column should be indexed for the list-by-user query.

### wizard_answers

Per-step answers and AI results. One row per session per step.

Columns: id (uuid, primary key, default gen_random_uuid), session_id (text, not null, foreign key to wizard_sessions id on delete cascade), step_number (integer, not null, range 1 to 5), answers (jsonb, nullable, user-entered form data), ai_results (jsonb, nullable, AI-generated results for this step), created_at (timestamptz, default now), updated_at (timestamptz, default now).

Unique constraint on (session_id, step_number) to enable upserts with onConflict. This is critical because wizard-routes.tsx and ai-routes.tsx both upsert on this pair.

### ai_cache

Gemini response cache with TTL expiry.

Columns: input_hash (text, primary key, SHA-256 hash of the function name plus input), response (jsonb, not null, the cached Gemini response), model (text, not null, the model identifier like gemini-2.0-flash), tokens_used (integer, default 0), expires_at (timestamptz, not null, the TTL expiry timestamp), created_at (timestamptz, default now).

The gemini.tsx cache check queries with input_hash equals and expires_at greater than now. Expired rows are ignored but not deleted automatically. Consider adding a partial index on expires_at for efficient cache lookups.

### ai_run_logs

Audit log for every AI call, successful or failed.

Columns: id (uuid, primary key, default gen_random_uuid), session_id (text, nullable, foreign key to wizard_sessions id on delete set null), org_id (uuid, nullable), prompt_type (text, not null, the function name like analyze-business or readiness-score), model (text, not null), tokens_used (integer, default 0), duration_ms (integer, default 0), success (boolean, not null, default true), error_message (text, nullable), created_at (timestamptz, default now).

Index on session_id for filtering logs by session. Index on created_at for chronological queries.

## Column That Might Be Missing

The wizard_answers table must have an ai_results column of type jsonb. If the table was created before the KV-to-tables refactor, this column may not exist. The edge functions upsert ai_results via saveAIResult in ai-routes.tsx. If the column is missing, every AI endpoint will fail silently (the upsert error gets logged but the endpoint still returns the AI result to the frontend).

## RLS Policies

For wizard_sessions: allow select, insert, update where user_id equals auth.uid or user_id is null (guest sessions). This lets authenticated users see only their own sessions while allowing anonymous inserts.

For wizard_answers: allow select, insert, update where session_id is in (select id from wizard_sessions where user_id equals auth.uid or user_id is null). This cascades the session-level access policy to answers.

For ai_cache and ai_run_logs: these are accessed only via adminClient (service-role) which bypasses RLS. No RLS policies needed, but enable RLS on the tables anyway with no policies to block direct anon access.

## Realtime Publication

If implementing realtime subscriptions later (see 04-prompt-realtime-subscriptions.md), the wizard_sessions, wizard_answers, and ai_run_logs tables need to be added to the supabase_realtime publication. This is done in the Supabase dashboard under Database, Publications, or via SQL alter publication.

## Verification Steps

After creating the tables, verify by: hitting GET /health to confirm the server is running, calling POST /wizard/save with a test payload and checking for a 200 response with a sessionId, calling GET /wizard/sessionId to load it back, calling POST /analyze-business with a test description and checking that the ai_results column in wizard_answers gets populated, and checking the ai_cache and ai_run_logs tables for new rows.

## Important Note

These tables must be created through the Supabase dashboard SQL editor or migrations tool. The Figma Make environment cannot run DDL statements from edge function code. Do not attempt to create tables programmatically in the server startup.
