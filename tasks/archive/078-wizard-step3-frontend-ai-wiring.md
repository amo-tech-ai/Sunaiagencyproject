---
task_id: 078-WIZ
title: Wire Wizard Step 3 frontend to system-recommendations AI endpoint
phase: CRITICAL
priority: P0
status: Not Started
estimated_effort: 3 hours
area: wizard
wizard_step: 3
skill: [product/api-wiring, product/feature-dev]
subagents: [code-reviewer]
edge_function: system-recommendations
schema_tables: [wizard_answers, ai_cache, ai_run_logs]
depends_on: [077-wizard-step2-frontend-ai-wiring, 046-agent-system-recommendations]
---

# 078 — Wire Wizard Step 3 Frontend to AI Endpoint

## Summary Table

| Aspect | Details |
|--------|---------|
| **Screen** | Wizard Step 3 — System Recommendations |
| **Feature** | Call `aiApi.systemRecommendations()` on step entry to get AI-ranked systems |
| **Edge Function** | `POST /system-recommendations` (already deployed) |
| **Frontend API** | `aiApi.systemRecommendations()` in `src/lib/supabase.ts` (already exists) |
| **Component** | `src/components/wizard/steps/StepSystemRecommendations.tsx` |
| **Real-World** | "User enters Step 3 → AI returns ranked systems with fit scores → cards reorder by AI ranking with personalized 'Why it fits' explanations" |

---

## Description

**The situation:** Step 3 (`StepSystemRecommendations.tsx`) currently ranks systems using local logic: `getIndustryPrioritizedSystems()` combined with signal-based boosting from Step 2. It never calls the backend `POST /system-recommendations` endpoint. The `aiApi.systemRecommendations()` method exists in `supabase.ts` but is never invoked.

**Why it matters:** The system recommendations agent (Gemini Pro, high thinking) performs deep multi-factor reasoning — cross-referencing pain points with system capabilities, calculating fit scores, determining optimal implementation order, and estimating realistic timelines. This is the "shopping cart" moment that determines what the client buys. Without AI, recommendations are generic industry defaults.

**What already exists:**
- `aiApi.systemRecommendations()` in `src/lib/supabase.ts` (line ~247) — accepts `{ sessionId, wizardAnswers, industry, signals }`
- `POST /system-recommendations` edge function — deployed, uses Gemini Pro, reads Steps 1-2
- `StepSystemRecommendations.tsx` — complete UI with system cards, sort controls, selection toggle
- `AI_SYSTEMS` and `getIndustryPrioritizedSystems()` in `wizard/data/wizardData.ts` — local system catalog
- `state.diagnosticSignals` — signals from Step 2 available for AI input
- Step 4 pattern: `StepExecutiveSummary.tsx` calls `aiApi.readinessScore()` on mount — follow this pattern

**The build:**
1. Import `aiApi` in `StepSystemRecommendations.tsx`
2. Call `aiApi.systemRecommendations()` on component mount (like Step 4 does)
3. Pass `sessionId`, `wizardAnswers` (steps 1-2), `industry`, and `signals` (diagnosticSignals)
4. Merge AI ranking with local system catalog — AI provides fit scores and "why it fits" per system
5. Update card rendering to show AI fit scores and personalized explanations
6. Show loading skeleton while AI processes (3-5 seconds for Pro model)
7. Fall back to local ranking on AI failure
8. Store AI recommendations in wizard state for Step 4/5 consumption

**Example:** Acme Retail Group gets to Step 3. Currently, they see systems ranked by generic industry priority: Cart Recovery first, then Recommendation Engine, then Support Engine. **With AI wiring**, Gemini Pro analyzes their specific pain points (68% cart abandonment, manual order processing, no personalization) and returns: Cart Recovery (95% fit — "Directly addresses your 68% cart abandonment, estimated $2.1M recovery"), followed by Sales Automation (88% fit — "Automates your manual order processing bottleneck"), then Recommendation Engine (82% fit — "Closes your personalization gap identified in diagnostics").

---

## Rationale

**Problem:** Step 3 uses static industry defaults instead of personalized AI recommendations, making the "shopping cart" feel generic.
**Solution:** Call `aiApi.systemRecommendations()` on entry, merge AI fit scores and explanations with system cards.
**Impact:** System cards transform from generic descriptions to personalized recommendations with fit scores and business-specific justifications.

---

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Client | see AI-ranked recommendations with fit scores | I select systems proven to match my specific needs |
| Client | read personalized "Why it fits" per system | I can justify selections to my team |
| Agency | have AI-informed selections | our proposals reflect genuine analysis, not templates |

---

## Goals

1. **Primary:** AI-ranked system cards with fit scores and personalized explanations
2. **Quality:** < 8 seconds AI response (Pro model), graceful fallback to local ranking

## Acceptance Criteria

- [ ] `aiApi.systemRecommendations()` called on Step 3 mount with correct params
- [ ] Loading skeleton shown while AI processes
- [ ] System cards display AI fit scores (if available)
- [ ] "Why it fits" text shown per system card from AI response
- [ ] AI ranking used as primary sort in "Recommended" mode
- [ ] Local sort modes (Impact, Effort) still work independently of AI
- [ ] Error handling: on AI failure, local ranking used silently
- [ ] AI results stored in wizard state for downstream steps
- [ ] Previously selected systems preserved when AI ranking arrives

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Component | `src/components/wizard/steps/StepSystemRecommendations.tsx` | Modify — add AI call on mount, merge with local ranking |
| API | `src/lib/supabase.ts` | No change — `aiApi.systemRecommendations()` already exists |
| Context | `src/components/wizard/WizardContext.tsx` | Possibly extend — store AI recommendation results |
| Edge Function | `supabase/functions/server/ai-routes.tsx` | No change — endpoint already deployed |

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| AI endpoint returns error | Fall back to local `getIndustryPrioritizedSystems()` ranking |
| AI response takes > 10s | Show skeleton with "Ranking systems for your business..." |
| User already selected systems before AI loads | Preserve selections, update ranking around them |
| AI returns unknown system IDs | Ignore unknown, show only catalog-matched systems |
| User navigates back to Step 3 | Show cached AI results, don't re-run |
| No Step 2 data available | Call AI with Step 1 data only, skip diagnostics input |

---

## Outcomes

| Before | After |
|--------|-------|
| Systems ranked by generic industry priority | AI-ranked by fit score based on user's specific situation |
| No "Why it fits" explanations | Personalized explanation per system card |
| No fit scores displayed | Numeric fit score (0-100) per system |
| Step 4 gets generic selections | Step 4 gets AI-informed selections with context |
