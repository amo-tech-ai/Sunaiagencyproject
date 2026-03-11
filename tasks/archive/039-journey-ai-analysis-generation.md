---
id: 039-journey-ai-analysis-generation
diagram_id: JOURNEY-03
prd_section: User Journeys
title: AI analysis generation journey — from user input to AI-generated insights
skill: backend
phase: HIGH
priority: P1
status: Not Started
owner: Backend
dependencies:
  - 038-journey-wizard-discovery
estimated_effort: M
percent_complete: 0
area: ai-agents
wizard_step: null
schema_tables: [wizard_answers, ai_cache, ai_run_logs]
figma_prompt: prompts/039-journey-ai-analysis-generation.md
---

# JOURNEY-03: AI Analysis Generation Journey

## Summary Table

| Field              | Value                                                                        |
| ------------------ | ---------------------------------------------------------------------------- |
| **Journey ID**     | JOURNEY-03                                                                   |
| **Prompt ID**      | 039-journey-ai-analysis-generation                                           |
| **Title**          | AI analysis generation journey — from user input to AI-generated insights    |
| **Phase**          | HIGH                                                                         |
| **Priority**       | P1                                                                           |
| **Owner**          | Backend                                                                      |
| **Effort**         | M                                                                            |
| **Area**           | ai-agents                                                                    |
| **Schema Tables**  | wizard_answers, ai_cache, ai_run_logs                                        |
| **Dependencies**   | 038-journey-wizard-discovery                                                 |
| **Status**         | Not Started                                                                  |

---

## Description

### Situation

Every wizard step (JOURNEY-02) triggers an AI analysis call — the user clicks "Continue" and expects personalized, high-quality insights within seconds. Behind the scenes, this involves constructing prompts from accumulated wizard data, checking caches, calling the Gemini API, parsing structured responses, logging performance, and persisting results. This journey documents the backend pipeline that powers every AI touchpoint in the wizard. No AI infrastructure exists yet; the edge functions, caching layer, prompt templates, and logging are all greenfield.

### Why It Matters

AI quality is the product. If the analysis is slow (>8 seconds), generic ("You should consider AI"), or wrong (recommending irrelevant systems), the entire wizard experience collapses. Users are trusting the platform to understand their business and provide expert-level recommendations. The backend pipeline must be reliable (99.5%+ success rate), fast (median <4 seconds), cost-efficient (cache hits reduce API spend), and observable (every call logged for debugging and optimization). This journey also establishes the pattern for all future AI features beyond the wizard.

### What Exists

The database schema defines three relevant tables: `wizard_answers` (stores per-step user inputs and AI results as JSONB), `ai_cache` (key-value cache with TTL for deduplicating identical analyses), and `ai_run_logs` (detailed per-call logging with agent name, model, token counts, duration, and success flag). Supabase edge functions (Deno runtime) are the deployment target. The Gemini API is the chosen LLM provider.

### The Build

**1. Edge Function Architecture**: Five edge functions, one per wizard step agent:
- `POST /analyze-business` — Step 1 agent
- `POST /industry-diagnostics` — Step 2 agent
- `POST /rank-systems` — Step 3 agent
- `POST /readiness-assessment` — Step 4 agent
- `POST /generate-roadmap` — Step 5 agent

Each function follows the same pipeline:

**2. Request Handling**: Receive JSON body with `session_id` and step-specific inputs. Validate required fields. Authenticate via Supabase JWT (or allow anonymous for guest sessions). Load prior wizard_answers for context accumulation.

**3. Cache Check**: Compute a SHA-256 hash of the normalized input (sorted keys, trimmed strings, lowercased). Query `ai_cache` for matching `cache_key` where `expires_at > now()`. On cache HIT: return cached `response_data`, log as cache hit in `ai_run_logs`, skip API call. On cache MISS: proceed to API call.

**4. Prompt Construction**: Each agent has a system prompt template stored in the edge function code. The system prompt defines the agent's role, output schema (JSON), and constraints. The user prompt is assembled from the current step's inputs plus relevant prior step data. Example for `analyze-business`: system prompt defines "You are an AI business analyst..." with required output fields; user prompt includes company URL, description, industry, size, and goals.

**5. Gemini API Call**: Call `generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent` with structured output mode (response_mime_type: "application/json", response_schema defined per agent). Set temperature=0.7 for creative but consistent output. Timeout=15 seconds. Max output tokens=4096.

**6. Response Parsing**: Parse the JSON response. Validate against the expected schema. If parsing fails, attempt to extract JSON from markdown code blocks. If still invalid, wrap raw text in `{rawText: "...", parseError: true}`.

**7. Logging**: Insert into `ai_run_logs`: agent_name, model, prompt_tokens, completion_tokens, total_tokens, duration_ms, success (boolean), error_message (if failed), session_id, cache_hit (boolean).

**8. Caching**: On successful API call, insert into `ai_cache`: cache_key (hash), agent_name, request_data (input), response_data (output), expires_at (TTL varies by agent: 24h for steps 1-2, 12h for steps 3-4, 6h for step 5).

**9. Persistence**: Upsert `wizard_answers` with `ai_results` field containing the parsed response. Return the response to the frontend.

**10. Error Recovery**: On Gemini timeout (>15s): retry once with reduced max_tokens (2048). On Gemini 429 (rate limit): wait 2 seconds, retry once. On Gemini 500: return fallback generic response from a static template. On cache write failure: log warning, continue (cache is non-critical). On wizard_answers write failure: return response to frontend anyway (frontend has the data, will retry persistence).

### Example

A user in Step 2 answers all 8 diagnostic questions and clicks "Continue." The frontend sends `POST /industry-diagnostics` with `{session_id: "abc123", answers: {Q1: 3, Q2: 4, Q3: "10-30%", ...}}`. The edge function loads Step 1 data from wizard_answers (company context). It hashes the combined input: `sha256("analyze-business:ecommerce:fashion:medium:Q1=3:Q2=4:...")` and checks ai_cache. Cache miss. It constructs a prompt: system prompt defining the diagnostics agent role + user prompt with all business context and answers. Gemini returns structured JSON with 4 pain points, 5 opportunities, and 3 industry benchmarks in 3.2 seconds. The function logs the call (agent="industry-diagnostics", tokens=1847, duration=3200ms, success=true), caches the result (expires in 24h), upserts wizard_answers, and returns the response. The frontend renders the diagnostics panel.

---

## User Stories

| ID       | Story                                                                                                                   | Priority |
| -------- | ----------------------------------------------------------------------------------------------------------------------- | -------- |
| US-039-1 | As a wizard user, I receive AI analysis within 5 seconds of clicking "Continue" on any step.                            | P0       |
| US-039-2 | As the system, I check the cache before calling the Gemini API to avoid redundant processing and reduce costs.           | P0       |
| US-039-3 | As the system, I log every AI call with agent name, model, tokens, duration, and success status for observability.       | P0       |
| US-039-4 | As a wizard user, if the AI call fails, I see a meaningful fallback response rather than an error screen.                | P0       |
| US-039-5 | As the system, I accumulate context from prior wizard steps to provide increasingly personalized analysis.               | P1       |
| US-039-6 | As a developer, I can review ai_run_logs to identify slow or failing agents and optimize prompts.                        | P1       |
| US-039-7 | As the system, I validate AI responses against expected schemas before returning them to the frontend.                   | P1       |
| US-039-8 | As a guest user, I can receive AI analysis without authentication (session tracked by anonymous session_id).             | P1       |

---

## Goals & Acceptance Criteria

- [ ] Five edge functions deployed: analyze-business, industry-diagnostics, rank-systems, readiness-assessment, generate-roadmap
- [ ] Each edge function accepts POST with JSON body containing session_id and step-specific inputs
- [ ] Each edge function authenticates via Supabase JWT; guest sessions accepted with anonymous session_id
- [ ] Cache check runs before every API call using SHA-256 hash of normalized inputs
- [ ] Cache HIT returns cached response within 100ms and logs cache_hit=true in ai_run_logs
- [ ] Cache MISS triggers Gemini API call with structured output mode
- [ ] Gemini call uses temperature=0.7, max_output_tokens=4096, timeout=15s
- [ ] Each agent has a defined system prompt with required JSON output schema
- [ ] AI response is validated against expected schema; malformed responses wrapped in {rawText, parseError}
- [ ] Every AI call (hit or miss) creates a row in ai_run_logs with: agent_name, model, prompt_tokens, completion_tokens, duration_ms, success, cache_hit, session_id
- [ ] Successful API responses cached in ai_cache with agent-specific TTL (24h/12h/6h)
- [ ] AI results upserted into wizard_answers.ai_results for the corresponding step
- [ ] On Gemini timeout: retry once with reduced tokens; on second failure, return static fallback
- [ ] On Gemini rate limit (429): wait 2s, retry once
- [ ] On parse error: log error, return {rawText} to frontend
- [ ] Median response time for cache MISS calls < 5 seconds
- [ ] AI call success rate > 99% (including retries and fallbacks)

---

## Screen Flow

This journey is primarily a backend flow. The "screens" are the API interactions observed from the frontend perspective.

### Interaction 1: Frontend Triggers Analysis

- **Trigger**: User clicks "Continue" on any wizard step
- **Frontend Action**: Disable "Continue" button, show loading skeleton in right panel with pulsing animation
- **API Call**: `POST /[agent-name]` with session_id and step inputs
- **Loading UX**: Animated progress bar with contextual message (e.g., "Analyzing your business..." / "Generating diagnostics..." / "Ranking systems..." / "Assessing readiness..." / "Building your roadmap...")

### Interaction 2: Waiting for Response

- **Duration**: 2-8 seconds typical
- **Frontend**: Shows phased loading messages that rotate every 2 seconds to maintain engagement
- **Timeout Behavior**: If >10 seconds, show "This is taking longer than usual..." message; if >15 seconds, show "Retrying..." message

### Interaction 3: Response Received — Success

- **Frontend Action**: Parse response JSON, animate right panel content reveal (fade-in + slide-up)
- **Data Persistence**: Frontend confirms wizard_answers was updated (or saves locally if not)
- **Transition**: Auto-advance to next step after 500ms delay (user can read the results on the next step's right panel)

### Interaction 4: Response Received — Fallback

- **Frontend Action**: Show partial results with notice: "Some analysis features are temporarily limited. Your results may be less detailed than usual."
- **Data Persistence**: Save fallback data to wizard_answers with `fallback: true` flag
- **Transition**: User can proceed; no blocking on partial results

---

## Data Flow

| Step                     | Action                          | Table(s) Written                      | Table(s) Read                          | Notes                                                     |
| ------------------------ | ------------------------------- | ------------------------------------- | -------------------------------------- | --------------------------------------------------------- |
| Request received         | Validate + load context         | —                                     | wizard_answers (prior steps)           | Load all prior step data for context accumulation         |
| Cache check              | Hash lookup                     | —                                     | ai_cache                               | WHERE cache_key = hash AND expires_at > now()             |
| Cache HIT                | Return cached + log             | ai_run_logs (cache_hit=true)          | ai_cache                               | No API call; response_data returned directly              |
| Cache MISS — API call    | Call Gemini                     | —                                     | —                                      | External API call; 2-8s latency                           |
| API success              | Parse + validate                | —                                     | —                                      | Validate against agent-specific schema                    |
| Log call                 | Insert run log                  | ai_run_logs                           | —                                      | agent_name, model, tokens, duration, success, session_id  |
| Cache result             | Insert cache entry              | ai_cache                              | —                                      | cache_key, response_data, expires_at with TTL             |
| Persist results          | Upsert wizard_answers           | wizard_answers (ai_results column)    | —                                      | JSONB upsert for the step's ai_results                    |
| API failure — retry      | Retry with reduced params       | ai_run_logs (success=false, then retry log) | —                                | Log both the failure and the retry attempt                |
| API failure — fallback   | Return static template          | ai_run_logs (success=false), wizard_answers | —                                | Fallback data saved with fallback=true flag               |

### Context Accumulation Map

```
Step 1: inputs = {url, description, industry, size, goals}
Step 2: inputs = {Q1-Q8} + context from Step 1
Step 3: inputs = {} + context from Steps 1-2 + systems table
Step 4: inputs = {selectedSystems} + context from Steps 1-3
Step 5: inputs = {editedBrief?} + context from Steps 1-4
```

Each subsequent agent receives a richer context, enabling increasingly specific and personalized output.

---

## AI Touchpoints

| Agent                 | System Prompt Summary                                                        | Output Schema Key Fields                                                  | Fallback Template                                                    |
| --------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| analyze-business      | "You are an AI business analyst. Analyze the company and identify AI opportunities." | companySummary, detectedIndustry, keyOpportunities[], competitiveLandscape | Generic industry summary with 3 standard opportunities               |
| industry-diagnostics  | "You are an industry diagnostics specialist. Identify pain points and opportunities." | painPoints[], opportunities[], benchmarks{}, maturityAssessment           | Industry-standard pain points and generic benchmarks                 |
| rank-systems          | "You are an AI systems architect. Rank and recommend AI systems by fit."     | rankedSystems[{id, fitScore, whyFits, roi, complexity}], combinedStrategy | All systems with default fit score of 70, generic descriptions       |
| readiness-assessment  | "You are an AI readiness assessor. Score the organization across 5 dimensions." | overallScore, scoreBreakdown{}, gaps[], strengths[], nextSteps[]          | Score of 60/100 with balanced dimension scores, generic gaps         |
| generate-roadmap      | "You are an AI implementation strategist. Create a phased roadmap."          | title, totalWeeks, phases[], quickWins[], riskFactors[], successMetrics[] | 3-phase generic roadmap with standard timelines and deliverables     |

---

## Edge Cases

| #  | Scenario                                            | Handling                                                                                     |
| -- | --------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 1  | Gemini API key expired or invalid                   | Return 503 with message; alert ops team via log; use fallback template                       |
| 2  | Gemini returns empty response                       | Treat as parse error; retry once; if still empty, use fallback                               |
| 3  | Gemini returns valid JSON but wrong schema           | Attempt to map known fields; fill missing fields with defaults; flag as partial in logs      |
| 4  | Cache entry exists but is corrupted                  | Delete corrupted entry, proceed with fresh API call, log cache corruption event              |
| 5  | Two concurrent requests for same inputs              | Both check cache (both miss), both call API, both cache (last write wins); harmless duplication |
| 6  | wizard_answers row missing for prior step            | Return 400 with "Please complete step N first"; frontend should prevent this via step validation |
| 7  | Guest session_id not found in wizard_sessions        | Create an anonymous wizard_session on-the-fly; continue processing                          |
| 8  | Gemini returns response with profanity or harmful content | Content filter check on output; redact and flag; log for human review                   |
| 9  | Token count exceeds Gemini input limit               | Truncate oldest context (Step 1 summary instead of full data); log truncation               |
| 10 | Database connection pool exhausted                   | Queue with 5s timeout; if still unavailable, return response without persisting; log         |
| 11 | Edge function cold start adds 2-3s latency           | Pre-warm functions on deploy; accept first-call latency; show extended loading message       |
| 12 | User triggers same step analysis twice rapidly       | Debounce on frontend (500ms); backend returns cached result from first call                  |

---

## Outcomes

| Outcome                        | Metric                                          | Target              |
| ------------------------------ | ----------------------------------------------- | ------------------- |
| API reliability                | % of AI calls returning valid response           | > 99.5%             |
| Median response time           | Median duration_ms across all agents (cache miss) | < 4,000ms          |
| P95 response time              | 95th percentile duration_ms                      | < 8,000ms          |
| Cache hit rate                 | % of calls served from cache                     | > 20% after 30 days |
| Fallback trigger rate          | % of calls that return fallback template          | < 2%               |
| Token efficiency               | Average total_tokens per call                     | < 3,000 tokens     |
| Cost per wizard completion     | Total API cost for all 5 agent calls              | < $0.15            |
| Parse error rate               | % of calls with parseError flag                   | < 1%               |
| Log completeness               | % of AI calls with corresponding ai_run_logs row  | 100%               |
| Context accumulation accuracy  | % of Step 5 calls that include all prior context   | 100%               |
