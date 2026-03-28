#!/bin/bash
# Verification script: Edge Function Auth Hardening
# Tests that unauthenticated and anon-key requests are rejected
# Run with: bash scripts/verify-auth-hardening.sh

set -euo pipefail

BASE="http://localhost:54321/functions/v1/make-server-283466b6"
ANON_KEY="${SUPABASE_ANON_KEY:-}"
PASS=0
FAIL=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check() {
  local desc="$1"
  local expected_status="$2"
  local actual_status="$3"

  if [[ "$actual_status" == "$expected_status" ]]; then
    echo -e "${GREEN}PASS${NC} $desc (got $actual_status)"
    ((PASS++))
  else
    echo -e "${RED}FAIL${NC} $desc (expected $expected_status, got $actual_status)"
    ((FAIL++))
  fi
}

echo "=== Edge Function Auth Hardening Verification ==="
echo "Base URL: $BASE"
echo ""

# ── Test 1: Unauthenticated requests should return 401 ──
echo -e "${YELLOW}--- Unauthenticated requests (expect 401) ---${NC}"

status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/dashboard/financial/metrics")
check "GET /financial/metrics (no auth)" "401" "$status"

status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/dashboard/financial/invoices")
check "GET /financial/invoices (no auth)" "401" "$status"

status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/dashboard/financial/payments")
check "GET /financial/payments (no auth)" "401" "$status"

status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/dashboard/financial/charts")
check "GET /financial/charts (no auth)" "401" "$status"

status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/dashboard/financial/profitability")
check "GET /financial/profitability (no auth)" "401" "$status"

status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/dashboard/workflows")
check "GET /workflows (no auth)" "401" "$status"

status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/dashboard/workflows/metrics")
check "GET /workflows/metrics (no auth)" "401" "$status"

status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/dashboard/workflows/executions")
check "GET /workflows/executions (no auth)" "401" "$status"

status=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{"workflow_id":"fake"}' "$BASE/dashboard/workflows/run")
check "POST /workflows/run (no auth)" "401" "$status"

status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/crm/clients")
check "GET /crm/clients (no auth)" "401" "$status"

status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/crm/pipelines")
check "GET /crm/pipelines (no auth)" "401" "$status"

status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/documents")
check "GET /documents (no auth)" "401" "$status"

status=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{"url":"test.com"}' "$BASE/analyze-business")
check "POST /analyze-business (no auth)" "401" "$status"

status=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{"slug":"test","task":"test"}' "$BASE/agents/run")
check "POST /agents/run (no auth)" "401" "$status"

status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/ai/run-logs")
check "GET /ai/run-logs (no auth)" "401" "$status"

status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/ai/cache-stats")
check "GET /ai/cache-stats (no auth)" "401" "$status"

status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/ai/aggregate-stats")
check "GET /ai/aggregate-stats (no auth)" "401" "$status"

echo ""

# ── Test 2: Anon key requests should return 401 ──
if [[ -n "$ANON_KEY" ]]; then
  echo -e "${YELLOW}--- Anon key requests (expect 401) ---${NC}"

  status=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $ANON_KEY" "$BASE/dashboard/financial/metrics")
  check "GET /financial/metrics (anon key)" "401" "$status"

  status=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $ANON_KEY" "$BASE/crm/clients")
  check "GET /crm/clients (anon key)" "401" "$status"

  status=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $ANON_KEY" "$BASE/dashboard/workflows")
  check "GET /workflows (anon key)" "401" "$status"

  status=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $ANON_KEY" -X POST -H "Content-Type: application/json" -d '{"url":"test.com"}' "$BASE/analyze-business")
  check "POST /analyze-business (anon key)" "401" "$status"

  echo ""
fi

# ── Test 3: Fake token should return 401 ──
echo -e "${YELLOW}--- Fake token requests (expect 401) ---${NC}"

status=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer faketoken123" "$BASE/dashboard/financial/metrics")
check "GET /financial/metrics (fake token)" "401" "$status"

status=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer faketoken123" -X POST -H "Content-Type: application/json" -d '{"slug":"test","task":"test"}' "$BASE/agents/run")
check "POST /agents/run (fake token)" "401" "$status"

status=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: foobar" -X POST -H "Content-Type: application/json" -d '{}' "$BASE/dashboard-insights")
check "POST /dashboard-insights (fake token)" "401" "$status"

echo ""

# ── Test 4: Health should still work without auth ──
echo -e "${YELLOW}--- Health check (should work without auth) ---${NC}"
status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/health")
check "GET /health (no auth)" "200" "$status"

echo ""
echo "=== Results: ${GREEN}$PASS passed${NC}, ${RED}$FAIL failed${NC} ==="

if [[ $FAIL -gt 0 ]]; then
  exit 1
fi
