#!/usr/bin/env bash
# Run all migrations in timestamp order. Requires DATABASE_URL (e.g. from .env.local).
# Usage: from repo root, ./supabase/migrations/run-all.sh
set -e
cd "$(dirname "$0")/../.." || exit 1
if [ -f .env.local ]; then set -a; source .env.local 2>/dev/null; set +a; fi
if [ -z "$DATABASE_URL" ]; then echo "DATABASE_URL not set (e.g. add to .env.local)"; exit 1; fi
dir=supabase/migrations
for f in \
  "$dir/20260307120000_enhance_wizard_sessions.sql" \
  "$dir/20260307120100_create_ai_tables.sql" \
  "$dir/20260307120200_create_crm_core_tables.sql" \
  "$dir/20260307120300_create_crm_pipeline_tables.sql" \
  "$dir/20260307120400_seed_default_pipeline_and_verify.sql" \
  "$dir/20260309100000_workflow_financial_tables.sql"; do
  echo "Applying $f ..."
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f" || exit 1
done
echo "Done."
