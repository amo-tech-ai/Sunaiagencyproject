# Supabase Implementation Guide

> Production files created for the Sun AI Agency platform integration
> Last updated: 2026-03-07

## Files Created / Modified

### Backend (Edge Functions)

| File | ID | Purpose |
|------|-----|---------|
| `/supabase/functions/server/index.tsx` | S00 | Main Hono server — mounts all routes |
| `/supabase/functions/server/gemini.tsx` | S01 | Gemini AI client — API calls, caching, run logging |
| `/supabase/functions/server/auth.tsx` | S02 | Auth utilities — signup, token validation |
| `/supabase/functions/server/wizard-routes.tsx` | S03 | Wizard persistence — save/load sessions via KV |
| `/supabase/functions/server/ai-routes.tsx` | S04 | AI analysis routes — 5 Gemini-powered endpoints |

### Frontend

| File | ID | Purpose |
|------|-----|---------|
| `/lib/supabase.ts` | L01 | Supabase client singleton + typed API helpers |
| `/components/wizard/WizardContext.tsx` | C29 | Updated — cloud save to Supabase alongside localStorage |
| `/components/wizard/steps/StepBusinessContext.tsx` | C30 | Updated — real Gemini analysis with mock fallback |
| `/components/wizard/steps/StepSystemRecommendations.tsx` | C32 | Updated — industry-prioritized system ordering |

## API Endpoints

All routes prefixed with `/make-server-283466b6`

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET | `/health` | No | Server health check |
| POST | `/signup` | No | Create user account |
| POST | `/wizard/save` | Anon OK | Save wizard state to KV |
| GET | `/wizard/:sessionId` | Anon OK | Load wizard session |
| GET | `/wizard/list/:userId` | Anon OK | List user sessions |
| POST | `/analyze-business` | Anon OK | Gemini business analysis |
| POST | `/industry-diagnostics` | Anon OK | Industry diagnostic insights |
| POST | `/system-recommendations` | Anon OK | AI system ranking |
| POST | `/readiness-score` | Anon OK | AI readiness assessment |
| POST | `/generate-roadmap` | Anon OK | Phased implementation plan |

## KV Key Patterns

| Key Pattern | Data |
|-------------|------|
| `wizard:session:{id}` | Full wizard state |
| `wizard:answer:{id}:step{n}` | Individual step answers |
| `wizard:analysis:{id}` | Gemini business analysis result |
| `wizard:diagnostics:{id}` | Industry diagnostics result |
| `wizard:recommendations:{id}` | System recommendations |
| `wizard:readiness:{id}` | Readiness score |
| `wizard:roadmap:{id}` | Generated roadmap |
| `ai:cache:{hash}` | Cached AI responses (with TTL) |
| `ai:log:{timestamp}` | AI run audit log |

## Data Flow

```
User fills wizard form
  → localStorage (immediate, 500ms debounce)
  → Supabase KV (cloud, 2s debounce)
  → Session ID assigned on first cloud save
  → Session ID stored in localStorage for reconnection

User triggers URL analysis
  → POST /analyze-business (Gemini)
  → Cache check (ai:cache:{hash})
  → If miss: Gemini API call
  → Store result + log run
  → Fallback to mock if API fails
```

## Gemini Integration

- Model: `gemini-2.0-flash`
- Response format: `application/json` (structured output)
- Caching: SHA-256 input hash → KV store with TTL
  - Business analysis: 24h TTL
  - Industry diagnostics: 7d TTL
- Logging: All runs recorded in `ai:log:*` keys
- Fallback: Mock simulation when Gemini unavailable

## Industry System Priority

`getIndustryPrioritizedSystems()` now drives Step 3 ordering:
- Systems ordered by `INDUSTRY_SYSTEM_PRIORITY` map
- Signal-matching provides secondary boost (2+ signal difference overrides)
- All 12 systems shown (6 original + 6 new)
