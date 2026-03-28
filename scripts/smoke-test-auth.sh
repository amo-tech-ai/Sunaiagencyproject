#!/bin/bash
# Smoke test: Edge Function Auth — runs against local OR production
# Usage:
#   LOCAL:  bash scripts/smoke-test-auth.sh
#   PROD:   bash scripts/smoke-test-auth.sh prod
# Exit code: 0 = all pass, 1 = failures detected

set -euo pipefail

MODE="${1:-local}"

if [[ "$MODE" == "prod" ]]; then
  BASE="https://necxcwhuzylsumlkkmlk.supabase.co/functions/v1/make-server-283466b6"
else
  BASE="http://localhost:54321/functions/v1/make-server-283466b6"
fi

PASS=0
FAIL=0

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check() {
  local desc="$1" expected="$2" actual="$3"
  if [[ "$actual" == "$expected" ]]; then
    echo -e "  ${GREEN}PASS${NC} $desc"
    ((PASS++))
  else
    echo -e "  ${RED}FAIL${NC} $desc (expected $expected, got $actual)"
    ((FAIL++))
  fi
}

echo "=== Edge Function Auth Smoke Test ==="
echo "Mode: $MODE | Base: $BASE"
echo ""

# ── Health: should always work ──
echo -e "${YELLOW}[1] Health check (expect 200)${NC}"
status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$BASE/health" 2>/dev/null || echo "000")
check "GET /health" "200" "$status"
echo ""

# ── Unauthenticated: all must return 401 ──
echo -e "${YELLOW}[2] Unauthenticated requests (expect 401)${NC}"

UNAUTH_ENDPOINTS=(
  "GET:$BASE/dashboard/financial/metrics"
  "GET:$BASE/dashboard/financial/invoices"
  "GET:$BASE/dashboard/financial/payments"
  "GET:$BASE/dashboard/financial/charts"
  "GET:$BASE/dashboard/financial/profitability"
  "GET:$BASE/dashboard/workflows"
  "GET:$BASE/dashboard/workflows/metrics"
  "GET:$BASE/dashboard/workflows/executions"
  "GET:$BASE/crm/clients"
  "GET:$BASE/crm/pipelines"
  "GET:$BASE/crm/contacts"
  "GET:$BASE/documents"
  "GET:$BASE/documents/stats"
  "GET:$BASE/ai/run-logs"
  "GET:$BASE/ai/cache-stats"
  "GET:$BASE/ai/aggregate-stats"
  "GET:$BASE/strategy/canvas"
  "GET:$BASE/strategy/insights"
  "GET:$BASE/strategy/opportunities"
  "GET:$BASE/strategy/recommendations"
  "GET:$BASE/strategy/actions"
  "GET:$BASE/strategy/metrics"
)

for entry in "${UNAUTH_ENDPOINTS[@]}"; do
  method="${entry%%:*}"
  url="${entry#*:}"
  path="${url#$BASE}"
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$url" 2>/dev/null || echo "000")
  check "$method $path (no auth)" "401" "$status"
done
echo ""

# ── POST endpoints without auth ──
echo -e "${YELLOW}[3] POST endpoints without auth (expect 401)${NC}"

POST_ENDPOINTS=(
  "$BASE/analyze-business:{\"url\":\"test.com\"}"
  "$BASE/industry-diagnostics:{\"industryId\":\"tech\"}"
  "$BASE/system-recommendations:{\"sessionId\":\"x\"}"
  "$BASE/readiness-score:{\"sessionId\":\"x\"}"
  "$BASE/generate-roadmap:{\"selectedSystems\":[\"x\"]}"
  "$BASE/dashboard/workflows/run:{\"workflow_id\":\"x\"}"
  "$BASE/dashboard/workflows/toggle:{\"id\":\"x\",\"status\":\"enabled\"}"
  "$BASE/agents/run:{\"slug\":\"x\",\"task\":\"x\"}"
  "$BASE/agents/match:{\"industry\":\"tech\"}"
  "$BASE/dashboard-insights:{\"sessionId\":\"x\"}"
  "$BASE/onboarding/complete:{\"sessionId\":\"x\"}"
  "$BASE/strategy/analyze:{\"canvas_id\":\"x\"}"
)

for entry in "${POST_ENDPOINTS[@]}"; do
  url="${entry%%:*}"
  body="${entry#*:}"
  path="${url#$BASE}"
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 -X POST -H "Content-Type: application/json" -d "$body" "$url" 2>/dev/null || echo "000")
  check "POST $path (no auth)" "401" "$status"
done
echo ""

# ── Fake token: must also return 401 ──
echo -e "${YELLOW}[4] Fake token requests (expect 401)${NC}"

FAKE_TOKEN="Bearer faketoken_abc123_invalid"
FAKE_ENDPOINTS=(
  "GET:$BASE/dashboard/financial/metrics"
  "GET:$BASE/crm/clients"
  "GET:$BASE/dashboard/workflows"
  "GET:$BASE/documents"
  "GET:$BASE/strategy/canvas"
  "GET:$BASE/ai/run-logs"
)

for entry in "${FAKE_ENDPOINTS[@]}"; do
  method="${entry%%:*}"
  url="${entry#*:}"
  path="${url#$BASE}"
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 -H "Authorization: $FAKE_TOKEN" "$url" 2>/dev/null || echo "000")
  check "$method $path (fake token)" "401" "$status"
done
echo ""

# ── Wizard list requires auth ──
echo -e "${YELLOW}[5] Wizard endpoints (expect 401 without auth)${NC}"
status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$BASE/wizard/list/00000000-0000-0000-0000-000000000000" 2>/dev/null || echo "000")
check "GET /wizard/list/:userId (no auth)" "401" "$status"

status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$BASE/wizard/00000000-0000-0000-0000-000000000000" 2>/dev/null || echo "000")
check "GET /wizard/:sessionId (no auth)" "401" "$status"

# Wizard save should still work without auth (intentional for guest wizard)
status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 -X POST -H "Content-Type: application/json" -d '{"fullState":{"currentStep":1}}' "$BASE/wizard/save" 2>/dev/null || echo "000")
check "POST /wizard/save (no auth, should work)" "200" "$status"

# Onboarding status requires auth
status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$BASE/onboarding/status/00000000-0000-0000-0000-000000000000" 2>/dev/null || echo "000")
check "GET /onboarding/status (no auth)" "401" "$status"
echo ""

# ── Summary ──
echo "=========================================="
echo -e "Results: ${GREEN}$PASS passed${NC}, ${RED}$FAIL failed${NC} out of $((PASS + FAIL)) tests"
echo "=========================================="

if [[ $FAIL -gt 0 ]]; then
  echo -e "${RED}AUTH HARDENING VERIFICATION FAILED${NC}"
  exit 1
else
  echo -e "${GREEN}ALL AUTH CHECKS PASSED${NC}"
  exit 0
fi
