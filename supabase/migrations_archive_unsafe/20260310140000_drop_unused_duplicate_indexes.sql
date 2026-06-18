-- ============================================================================
-- Migration: Drop unused/redundant indexes
-- Date: 2026-03-10
-- Prompt: 065-database-index-cleanup
--
-- Analysis:
--   168 indexes with idx_scan = 0 found across public schema
--   35 of 48 tables have 0 rows (most B-tree indexes unused because tables
--   are empty, not because the indexes are bad)
--   142 regular B-tree indexes KEPT (FK indexes per Postgres best practice,
--   cheap at 16KB each, needed as data grows)
--   27 indexes dropped (redundant, wrong type, or truly wasteful)
--
-- Savings: ~3.6 MB (mostly from 2 IVFFlat embedding indexes at 1.6MB each)
-- Risk: LOW — all dropped indexes are either:
--   - Exact duplicates of constraint indexes on the same columns
--   - Specialized indexes (GIN/IVFFlat) with no matching query patterns
--   - Single-column indexes covered by a composite unique index
-- ============================================================================

BEGIN;

-- -------------------------------------------------------
-- Group 1: Near-duplicates redundant with UNIQUE constraints (5)
-- These B-tree indexes duplicate columns already covered
-- by a UNIQUE constraint index on the same table.
-- The UNIQUE index serves both uniqueness enforcement AND lookups.
-- -------------------------------------------------------
DROP INDEX IF EXISTS public.idx_brief_versions_version;      -- covered by brief_versions_brief_id_version_key (UNIQUE)
DROP INDEX IF EXISTS public.idx_briefs_version;              -- covered by briefs_project_id_version_key (UNIQUE)
DROP INDEX IF EXISTS public.idx_invoices_invoice_number;     -- covered by invoices_invoice_number_key (UNIQUE)
DROP INDEX IF EXISTS public.idx_roadmaps_snapshot_id;        -- covered by roadmaps_snapshot_id_key (UNIQUE)
DROP INDEX IF EXISTS public.idx_services_slug;               -- covered by services_slug_key (UNIQUE)

-- -------------------------------------------------------
-- Group 2: KV store duplicate indexes (6)
-- Table kv_store_283466b6 has a PK on (key) plus 6 extra
-- non-unique indexes all on the same (key) column.
-- The PK index already handles all equality lookups.
-- -------------------------------------------------------
DROP INDEX IF EXISTS public.kv_store_283466b6_key_idx;
DROP INDEX IF EXISTS public.kv_store_283466b6_key_idx1;
DROP INDEX IF EXISTS public.kv_store_283466b6_key_idx2;
DROP INDEX IF EXISTS public.kv_store_283466b6_key_idx3;
DROP INDEX IF EXISTS public.kv_store_283466b6_key_idx4;
DROP INDEX IF EXISTS public.kv_store_283466b6_key_idx5;

-- -------------------------------------------------------
-- Group 3: IVFFlat embedding indexes (2) — largest savings
-- Vector similarity search is not used in the application.
-- These are 1.6 MB each and slow INSERT/UPDATE on every row.
-- Recreate if vector search is added later:
--   CREATE INDEX ON crm_interactions USING ivfflat (embedding vector_cosine_ops);
--   CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops);
-- -------------------------------------------------------
DROP INDEX IF EXISTS public.crm_interactions_embedding_idx;  -- 1608 KB, 0 scans
DROP INDEX IF EXISTS public.documents_embedding_idx;         -- 1608 KB, 0 scans

-- -------------------------------------------------------
-- Group 4: GIN JSONB indexes (13)
-- These support @>, ?, ?&, ?| operators on JSONB columns.
-- No queries in the codebase use JSONB containment operators.
-- All queries access JSONB via ->> (text extraction) which
-- does NOT use GIN indexes. Expensive to maintain on writes.
-- -------------------------------------------------------
DROP INDEX IF EXISTS public.idx_brief_versions_content;      -- GIN on jsonb, 0 scans
DROP INDEX IF EXISTS public.idx_brief_versions_diff;         -- GIN on jsonb, 0 scans
DROP INDEX IF EXISTS public.idx_services_features;           -- GIN on jsonb, 0 scans
DROP INDEX IF EXISTS public.idx_services_benefits;           -- GIN on jsonb, 0 scans
DROP INDEX IF EXISTS public.idx_activities_metadata;         -- GIN on jsonb, 0 scans
DROP INDEX IF EXISTS public.idx_invoices_line_items;         -- GIN on jsonb, 0 scans
DROP INDEX IF EXISTS public.idx_briefs_content;              -- GIN on jsonb, 0 scans
DROP INDEX IF EXISTS public.idx_roadmap_phases_outcomes;     -- GIN on jsonb, 0 scans
DROP INDEX IF EXISTS public.idx_tasks_tags;                  -- GIN on jsonb, 0 scans
DROP INDEX IF EXISTS public.idx_context_snapshots_metrics;   -- GIN on jsonb, 0 scans
DROP INDEX IF EXISTS public.idx_crm_contacts_tags;           -- GIN on jsonb, 0 scans
DROP INDEX IF EXISTS public.idx_wizard_answers_data;         -- GIN on jsonb, 0 scans
DROP INDEX IF EXISTS public.idx_project_systems_metadata;    -- GIN on jsonb, 0 scans

-- -------------------------------------------------------
-- Group 5: Single-column index redundant with composite (1)
-- idx_wizard_answers_session_id (session_id) is covered by
-- wizard_answers_session_screen_unique (session_id, screen_id).
-- Per leftmost prefix rule, composite serves single-col queries.
-- -------------------------------------------------------
DROP INDEX IF EXISTS public.idx_wizard_answers_session_id;   -- covered by composite unique

COMMIT;
