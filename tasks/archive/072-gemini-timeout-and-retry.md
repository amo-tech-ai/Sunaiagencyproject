---
task_id: 072-EDGE
title: Add 30s timeout and 3-retry exponential backoff for Gemini API calls
phase: CRITICAL
priority: P0
status: Not Started
estimated_effort: 3 hours
area: ai-agents
skill: [data/supabase-edge-functions, ai/gemini]
subagents: [code-reviewer, security-auditor]
edge_function: make-server-283466b6
schema_tables: [ai_run_logs, ai_cache]
depends_on: []
---

# 072 — Gemini Timeout and Retry

## Summary Table

| Aspect | Details |
|--------|---------|
| **File** | `src/supabase/functions/server/gemini.tsx` |
| **Current Model** | `gemini-2.0-flash` |
| **Problem** | No timeout — Gemini can hang indefinitely. No retry — 429/5xx causes immediate failure. |
| **Edge Function** | `make-server-283466b6` (single Hono server) |
| **Tables** | `ai_run_logs` (log retries), `ai_cache` (cache hits skip retry) |
| **Real-World** | "User clicks 'Run Analysis' on strategy canvas → Gemini returns 503 → entire 5-agent pipeline fails with no recovery" |

---

## Description

**The situation:** `gemini.tsx` calls the Gemini API with no timeout and no retry logic. If Gemini is slow or returns a transient error (429 rate limit, 503 service unavailable), the call fails immediately and the error propagates to the user.

**Why it matters:** All 5 wizard steps, the strategy 5-agent analysis, and per-block synthesis depend on `callGemini()`. A single transient failure breaks the entire flow. Gemini rate-limits (429) are common under load.

**What already exists:** `callGemini()` in `gemini.tsx` (~217 LOC) with SHA-256 cache, ai_run_logs logging, and JSON response parsing. Cache-first pattern already avoids retries for cached results.

**The build:**
1. Add `AbortController` with 30s timeout to the `fetch()` call
2. Wrap the fetch in a retry loop: 3 attempts with exponential backoff (1s, 2s, 4s)
3. Retry only on: 429 (rate limit), 500/502/503/504 (server errors), timeout (AbortError)
4. Do NOT retry on: 400 (bad request), 401/403 (auth), 404 (not found)
5. Log retry attempts to `ai_run_logs` with `retry_count` in metadata

**Example:** Acme Retail triggers "Run Analysis" on strategy canvas. Gemini returns 429 on first call. System waits 1s, retries, gets 200. User sees seamless result. Without retry: user sees error modal and has to manually retry.

---

## Rationale

**Problem:** Zero resilience to Gemini transient failures breaks user-facing AI features.
**Solution:** Standard timeout + exponential backoff pattern used by all production API clients.
**Impact:** AI features become reliable under load; users never see transient 429/503 errors.

---

## Acceptance Criteria

- [ ] `fetch()` call has 30s `AbortController` timeout
- [ ] Retry loop: max 3 attempts, exponential backoff (1s, 2s, 4s delays)
- [ ] Retries ONLY on 429, 500, 502, 503, 504, and timeout (AbortError)
- [ ] Does NOT retry on 400, 401, 403, 404
- [ ] `ai_run_logs` entry includes retry count when retries occurred
- [ ] Cache hits bypass retry entirely (existing behavior preserved)
- [ ] All existing callers (`callGemini()` signature) unchanged — no breaking changes
- [ ] `npm run build` passes

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Gemini client | `src/supabase/functions/server/gemini.tsx` | Add timeout + retry wrapper |

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| All 3 retries fail | Throw final error to caller (existing error handling) |
| Timeout on retry 2, success on retry 3 | Return successful result, log 2 retries |
| Cache hit | No fetch, no retry — return cached result immediately |
| 400 Bad Request | Fail immediately, no retry (prompt error, not transient) |
| Network completely down | All 3 retries timeout, throw after ~39s total (30+1+2+4+30...) |

---

## Outcomes

| Before | After |
|--------|-------|
| Gemini 429 → immediate failure, user sees error | 429 → 1s wait → retry → success (transparent) |
| No timeout → fetch can hang indefinitely | 30s timeout → predictable failure path |
| No visibility into retry behavior | `ai_run_logs.metadata.retry_count` tracks retries |
