---
id: 023-gemini-fetch-timeout
diagram_id: CORE-AI-02
prd_section: Backend Architecture
title: Add Promise.race timeout to Gemini API fetch calls
skill: backend
phase: CORE
priority: P2
status: Todo
owner: Backend
dependencies:
  - 012-gemini-ai-client
estimated_effort: S
percent_complete: 0
---

## Objective

Add a hard timeout to the Gemini API `fetch()` call in `gemini.tsx` using `Promise.race` with `AbortController`. This follows the Supabase edge function best practice: "Use `Promise.race` with hard deadline" to prevent edge functions from hanging indefinitely on slow or unresponsive upstream APIs.

## Context

The `callGemini()` function currently calls `fetch()` with no timeout:

```typescript
const response = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ... }),
});
```

Supabase edge functions have a default execution timeout (typically 60s). If Gemini takes longer than expected, the edge function will hang until the platform kills it, returning a generic timeout error to the client with no cleanup or logging.

## Scope

### File: `supabase/functions/server/gemini.tsx`

Add a timeout wrapper around the fetch call:

```typescript
const GEMINI_TIMEOUT_MS = 30_000; // 30 seconds

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}
```

Then in `callGemini()`:

```typescript
const response = await fetchWithTimeout(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-goog-api-key": apiKey,
  },
  body: JSON.stringify({ ... }),
}, GEMINI_TIMEOUT_MS);
```

The existing `catch` block in `callGemini()` already logs errors and records failed runs to `ai_run_logs`, so abort errors will be captured automatically.

## Acceptance Criteria

- [ ] Gemini fetch calls have a 30-second timeout via `AbortController`
- [ ] Timeout errors are logged to `ai_run_logs` with `success: false` and the abort error message
- [ ] Normal Gemini calls (< 30s) are unaffected
- [ ] Edge function deploys successfully

## File Change Summary

| File | Action | Description |
|---|---|---|
| `server/gemini.tsx` | **Edit** | Add `fetchWithTimeout()` helper, wrap Gemini fetch call |
