---
task_id: 077-WIZ
title: Wire Wizard Step 2 frontend to industry-diagnostics AI endpoint
phase: CRITICAL
priority: P0
status: Not Started
estimated_effort: 3 hours
area: wizard
wizard_step: 2
skill: [product/api-wiring, product/feature-dev]
subagents: [code-reviewer]
edge_function: industry-diagnostics
schema_tables: [wizard_answers, ai_cache, ai_run_logs]
depends_on: [045-agent-industry-diagnostics]
---

# 077 — Wire Wizard Step 2 Frontend to AI Endpoint

## Summary Table

| Aspect | Details |
|--------|---------|
| **Screen** | Wizard Step 2 — Industry Diagnostics |
| **Feature** | Call `aiApi.industryDiagnostics()` after user completes diagnostic questions |
| **Edge Function** | `POST /industry-diagnostics` (already deployed) |
| **Frontend API** | `aiApi.industryDiagnostics()` in `src/lib/supabase.ts` (already exists) |
| **Component** | `src/components/wizard/steps/StepIndustryDiagnostics.tsx` |
| **Real-World** | "User answers 8 diagnostic questions → AI returns pain points, opportunities, benchmarks → right panel shows AI insights" |

---

## Description

**The situation:** Step 2 (`StepIndustryDiagnostics.tsx`) currently uses local-only signal detection via `UNIVERSAL_SIGNAL_RULES` and `getIndustrySignalRules()`. It never calls the backend `POST /industry-diagnostics` endpoint. The AI endpoint exists, the `aiApi.industryDiagnostics()` method exists in `supabase.ts`, but the frontend ignores them entirely.

**Why it matters:** The industry diagnostics agent (Gemini Flash) provides deep analysis — severity-rated pain points, ROI-projected opportunities, industry benchmarks, and priority actions. Without this, Step 2 only detects basic signal patterns client-side, and Step 3's recommendation engine gets weaker input. This is 1 of 2 wizard steps that skip AI entirely.

**What already exists:**
- `aiApi.industryDiagnostics()` in `src/lib/supabase.ts` (line ~237) — accepts `{ industryId, companyProfile, sessionId }`
- `POST /industry-diagnostics` edge function — deployed, uses Gemini Flash, reads Step 1 data, returns AI analysis
- `StepIndustryDiagnostics.tsx` — complete UI with questions, answers, local signal detection
- `WizardContext.tsx` — has `state.step1` (company profile), `state.step2.answers`, `setSignals()`
- Step 1 pattern: `StepBusinessContext.tsx` successfully calls `aiApi.analyzeBusiness()` — follow this pattern

**The build:**
1. Import `aiApi` in `StepIndustryDiagnostics.tsx`
2. Add AI call trigger — either on Continue click (like Step 1) or on entering Step 3
3. Pass `industryId`, `companyProfile` (from `state.step1`), and `sessionId` to the endpoint
4. Store AI results in wizard state (alongside local signals)
5. Show loading state while AI processes
6. Handle errors gracefully — fall back to local signal detection on failure
7. Display AI insights in the right panel (pain points, opportunities, benchmarks)

**Example:** Acme Retail Group, an e-commerce company with 50 employees, answers all 8 diagnostic questions about cart abandonment, manual order processing, and lack of personalization. Currently, the local signal detector flags "high cart abandonment" and "manual processes." **With AI wiring**, Gemini analyzes their answers against industry benchmarks and returns: "Cart abandonment rate likely 68-72% vs industry average 55% — critical gap. Estimated $2.1M annual revenue recovery from AI-powered cart recovery. Top priority: automated abandoned cart sequences within 14 days."

---

## Rationale

**Problem:** Step 2 produces shallow signal-based analysis when a full AI diagnostic endpoint is ready and waiting.
**Solution:** Call `aiApi.industryDiagnostics()` with the user's answers, then merge AI results with local signals.
**Impact:** Right panel transforms from basic signal badges into a comprehensive industry diagnostic with ROI projections.

---

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Client | see AI-powered diagnostic insights after answering questions | I understand my pain points relative to industry benchmarks |
| Client | see ROI projections for my specific challenges | I can justify AI investment to stakeholders |

---

## Goals

1. **Primary:** AI diagnostic results appear in the right panel after Step 2 completion
2. **Quality:** < 5 seconds AI response, graceful fallback to local signals on failure

## Acceptance Criteria

- [ ] `aiApi.industryDiagnostics()` called with correct params (industryId, companyProfile, sessionId)
- [ ] Loading skeleton shown while AI processes
- [ ] AI results stored in wizard state for Step 3 consumption
- [ ] Right panel shows AI insights: pain points, opportunities, benchmarks
- [ ] Local signal detection still runs as baseline (AI augments, doesn't replace)
- [ ] Error handling: on AI failure, local signals used and no error shown to user
- [ ] Auto-save captures AI results alongside answers
- [ ] Step 1 company profile data passed to AI for context

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Component | `src/components/wizard/steps/StepIndustryDiagnostics.tsx` | Modify — add `aiApi.industryDiagnostics()` call |
| API | `src/lib/supabase.ts` | No change — `aiApi.industryDiagnostics()` already exists |
| Context | `src/components/wizard/WizardContext.tsx` | Possibly extend — store AI diagnostic results |
| Edge Function | `supabase/functions/server/ai-routes.tsx` | No change — endpoint already deployed |

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| AI endpoint returns error | Fall back to local signal detection, no error shown |
| AI response takes > 10s | Show loading skeleton with "Analyzing your industry..." |
| User navigates back to Step 2 after AI ran | Show cached AI results, don't re-run |
| AI returns empty results | Show local signals only |
| No Step 1 data available | Skip AI call, use local signals |

---

## Outcomes

| Before | After |
|--------|-------|
| Step 2 uses local signal detection only | AI produces severity-rated pain points with industry benchmarks |
| Right panel shows basic signal badges | Right panel shows AI diagnostic: pain points, opportunities, ROI |
| Step 3 gets shallow signal data | Step 3 gets rich AI diagnostic data for better recommendations |
