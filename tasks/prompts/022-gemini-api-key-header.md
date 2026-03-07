---
id: 022-gemini-api-key-header
diagram_id: CORE-AI-01
prd_section: Backend Architecture
title: Move Gemini API key from query parameter to request header
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

Move the Gemini API key from the URL query parameter (`?key=${apiKey}`) to the `x-goog-api-key` request header in `gemini.tsx`. This follows the Supabase edge function security best practice: "API key: pass in header (never query param)".

## Context

The `callGemini()` function in `supabase/functions/server/gemini.tsx` currently passes the API key as a URL query parameter:

```typescript
const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
```

This is a security concern because:
- Query parameters appear in server access logs, proxy logs, and browser history
- URL strings may be cached or logged by intermediate infrastructure
- The Supabase edge function writing guide explicitly says to use headers for API keys

## Scope

### File: `supabase/functions/server/gemini.tsx`

**Before:**
```typescript
const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

const response = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ... }),
});
```

**After:**
```typescript
const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const response = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-goog-api-key": apiKey,
  },
  body: JSON.stringify({ ... }),
});
```

## Acceptance Criteria

- [ ] API key is passed via `x-goog-api-key` header, not URL query parameter
- [ ] No `?key=` appears in any URL string in the codebase
- [ ] Gemini API calls still succeed (test with `/analyze-business` endpoint)
- [ ] Edge function deploys successfully

## File Change Summary

| File | Action | Description |
|---|---|---|
| `server/gemini.tsx` | **Edit** | Move API key from URL param to `x-goog-api-key` header |
