---
id: 012-gemini-ai-client
diagram_id: CORE-EDGE-01
prd_section: Edge Function Architecture
title: Production-hardened Gemini AI client with retry and JSON repair
skill: backend
phase: CORE
priority: P0
status: Open
owner: Backend
dependencies:
  - 011-edge-function-shared-infra
estimated_effort: L
percent_complete: 0
---

## Objective
Build the `callGemini()` function — the shared AI client used by all edge functions — with retry logic, timeout handling, truncation recovery, and 5-level JSON repair.

## Scope
- **callGemini(config)** function in `src/supabase/functions/server/gemini.tsx`:
  - **Current state:** basic `callGemini()` exists with cache + logging but uses deprecated `gemini-2.0-flash`, raw `fetch()` (acceptable in Deno), no retry, no JSON repair beyond `{ rawText }` fallback
  - Config: `{model, prompt, systemInstruction, tools, responseSchema, thinkingLevel, timeout}`
  - Initialize `@google/genai` SDK (>= 1.33.0) with GEMINI_API_KEY from env
- **Model selection**:
  - `gemini-3.1-pro-preview` — reasoning, scoring, brief generation (Pro)
  - `gemini-3-flash-preview` — extraction, speed, streaming (Flash)
- **Structured output**:
  - `responseMimeType: 'application/json'`
  - `responseJsonSchema` from config
- **Thinking mode**:
  - `thinkingConfig: {thinkingLevel}` — minimal, low, medium, high
- **Tool support**:
  - `{googleSearch: {}}` — Google Search grounding
  - `{urlContext: {}}` — URL Context (read websites)
  - `functionDeclarations: [...]` — Function Calling
- **Retry with exponential backoff**:
  - Delays: 1s, 2s, 4s (max 3 attempts)
  - Retry on: 429 (rate limit), 500/503 (server error), timeout
  - Do not retry on: 400 (bad request), 401 (auth), 404
- **Timeout handling**:
  - Default: 30s, configurable up to 60s for complex operations
  - AbortController with signal
- **Truncation recovery**:
  - Detect incomplete JSON (unclosed braces/brackets)
  - Re-request with "Continue from where you left off" prompt
  - Merge original + continuation
- **5-level JSON repair**:
  1. Direct `JSON.parse()` — try first
  2. Trim trailing characters (whitespace, markdown fences)
  3. Close open braces/brackets
  4. Extract JSON block from markdown code fences
  5. Regex key-value extraction as last resort
- **Logging**:
  - Write to `ai_run_logs`: agent, model, input_tokens, output_tokens, latency_ms, status
  - Log on both success and failure
- **Caching**:
  - Check `ai_cache` by (org_id, operation, context_hash) before calling Gemini
  - On cache hit + not expired: return cached result, skip API call
  - On success: store result in ai_cache with configurable TTL

## Acceptance Criteria
- `callGemini()` returns parsed JSON for structured output calls
- Retry fires on 429/500/503 with correct backoff delays
- Truncated response is detected and recovered via continuation
- Malformed JSON is repaired: all 5 levels attempted in order
- All calls logged to `ai_run_logs` with accurate token counts and latency
- Cache hit returns result without API call
- Cache miss calls API, then stores result
- Timeout fires after configured duration

## Failure Handling
- All retries exhausted: return fallback response `{error: true, fallback: true, message}`
- JSON repair fails at all levels: log raw response, return error
- Cache write failure does not block the response
- Network error vs API error distinguished in logs
