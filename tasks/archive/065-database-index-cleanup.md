---
id: 065-database-index-cleanup
diagram_id: PERF-01
prd_section: Performance
title: Audit and drop unused/duplicate database indexes
skill: backend
phase: LOW
priority: P3
status: Not Started
owner: Backend
dependencies: []
estimated_effort: S
percent_complete: 0
area: infrastructure
schema_tables: []
figma_prompt: prompts/065-database-index-cleanup.md
---

# 065 — Database Index Cleanup

## Summary Table

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Problem            | Supabase performance advisor flags 168 unused indexes + 1 duplicate |
| Impact             | Unused indexes waste storage and slow INSERT/UPDATE/DELETE    |
| Risk               | LOW — unused indexes are safe to drop; duplicate is redundant |
| Approach           | Query `pg_stat_user_indexes` for zero-scan indexes, review, drop |

---

## Steps

### 1. Identify Unused Indexes

```sql
SELECT schemaname, relname AS table, indexrelname AS index,
       idx_scan, pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;
```

### 2. Identify Duplicate Indexes

```sql
SELECT array_agg(indexname) AS duplicate_indexes, tablename, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
GROUP BY tablename, indexdef
HAVING count(*) > 1;
```

### 3. Review Before Dropping

- Cross-reference with RLS policies that may use indexes for join performance
- Check if any index supports a UNIQUE constraint
- Preserve primary key indexes and foreign key indexes
- Keep indexes referenced by `pg_constraint`

### 4. Drop in Migration

```sql
-- Only drop indexes confirmed unused and not supporting constraints
DROP INDEX IF EXISTS public.idx_name;
```

### 5. Monitor After Dropping

Wait 1 week, re-check `pg_stat_user_indexes` to confirm no regressions.

---

## Verification

- Run performance advisor query before and after
- Confirm 0 unused indexes (or only intentionally kept ones)
- Confirm no query performance regression via `pg_stat_statements`
