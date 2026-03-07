---
id: 045-agent-industry-diagnostics
diagram_id: AGENT-02
prd_section: AI Agents
title: Industry diagnostics agent — pain points, opportunities, and benchmarks
skill: ai-agents
phase: CRITICAL
priority: P0
status: Not Started
owner: Backend
dependencies:
  - 044-agent-business-analysis
estimated_effort: M
percent_complete: 0
area: ai-agents
wizard_step: 2
schema_tables: [wizard_answers, ai_cache, ai_run_logs]
edge_function: industry-diagnostics
figma_prompt: prompts/045-agent-industry-diagnostics.md
---

# 045 — Industry Diagnostics Agent

## Summary Table

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Agent ID           | AGENT-02                                                     |
| Name               | Industry Diagnostics Agent                                   |
| Edge Function      | `POST /industry-diagnostics`                                 |
| Model              | `gemini-3-flash-preview`                                           |
| Wizard Step        | Step 2 — Diagnostic Questions                                |
| Trigger            | User completes Step 2 questions and clicks Continue          |
| Input              | Industry ID, company profile (Step 1), diagnostic answers    |
| Output             | Pain points, opportunities, benchmarks, priority actions     |
| Storage            | `wizard_answers.ai_results` WHERE `screen_id='step-2'`      |
| Cache              | `ai_cache` — 7d TTL                                         |
| Logging            | `ai_run_logs` — `agent_name='industry-diagnostics'`         |
| Downstream Agents  | 046 (system-recommendations), 047 (readiness-score)         |
| Priority           | P0 CRITICAL                                                  |

---

## Description

### 1. Purpose

The Industry Diagnostics Agent generates industry-specific diagnostic insights by combining the company profile from Step 1 with the user's answers to diagnostic questions in Step 2. It identifies pain points with severity ratings, quantified opportunities with projected ROI ranges, industry benchmarks for comparison, and prioritized immediate actions. This analysis shapes the system recommendations in Step 3 by revealing which problems are most urgent.

### 2. User Context

The user has completed Step 1 (company profile) and is now answering 6-8 diagnostic questions about their current operations, technology usage, pain points, and goals. These questions are industry-specific — an e-commerce company sees different questions than a healthcare provider. After answering, the user expects the platform to synthesize their answers into a clear diagnostic that validates their challenges and reveals opportunities they may not have considered.

### 3. Technical Approach

The edge function `industry-diagnostics` loads the Step 1 `ai_results` from `wizard_answers`, combines it with the Step 2 diagnostic answers, and constructs a prompt that asks Gemini to act as an industry consultant. The prompt includes industry-specific context (common pain points, technology trends, regulatory considerations) and instructs the model to produce severity-rated pain points and ROI-projected opportunities. Results are cached with a 7-day TTL since industry insights change less frequently than individual company data.

### 4. Data Flow

```
Step 1 ai_results (company profile)
    +
Step 2 diagnostic answers (Q1-Q8)
    +
Industry context (from prompt engineering)
    |
    v
Edge Function: industry-diagnostics
    |
    +--> Load wizard_answers WHERE screen_id='step-1'
    +--> Merge with Step 2 form data
    +--> Check ai_cache (7d TTL)
    |       |
    |       +--> Cache HIT  --> Return cached result
    |       +--> Cache MISS --> Call callGemini()
    |
    +--> Store in wizard_answers.ai_results (step-2)
    +--> Log to ai_run_logs
    +--> Return to frontend
```

### 5. Design Considerations

The diagnostic questions vary by industry, so the prompt must adapt accordingly. The agent uses `gemini-3-flash-preview` because the analysis is pattern-matching against known industry knowledge rather than novel reasoning. Pain points are rated by severity (high/medium/low) to help the system-recommendations agent prioritize which systems to suggest. The `benchmarks` field provides industry context that appears on the client dashboard as comparison data.

---

## Agent Specification

### System Prompt

```
You are an industry diagnostics specialist for an AI consulting agency. Given a company profile and their answers to diagnostic questions, produce a comprehensive industry analysis.

For the {industry} industry:
1. Identify specific pain points with severity ratings based on their answers
2. Map opportunities with realistic ROI projections
3. Provide industry benchmarks — what average companies do vs. top performers
4. Recommend 3 prioritized immediate actions

Pain points must be specific to their situation, not generic industry challenges.
Opportunities must be grounded in their current capabilities and gaps.
Output MUST be valid JSON matching the provided schema.
```

### Model Configuration

| Parameter        | Value                |
| ---------------- | -------------------- |
| Model            | `gemini-3-flash-preview`   |
| Temperature      | 0.4                  |
| Max Tokens       | 3072                 |
| Response Format  | JSON                 |
| Thinking Mode    | Off                  |

---

## Input Schema

```typescript
interface IndustryDiagnosticsInput {
  sessionId: string;                  // Wizard session ID
  industryId: string;                 // Selected industry from Step 1
  companyProfile: BusinessAnalysisResult; // Step 1 ai_results
  diagnosticAnswers: {
    [questionKey: string]: string | string[] | number; // Q1-Q8 answers
  };
}
```

**Validation Rules:**
- `sessionId` must reference an existing `wizard_sessions` row.
- `industryId` must be a recognized industry identifier.
- `companyProfile` must contain at minimum `companySummary` and `detectedIndustry`.
- `diagnosticAnswers` must have at least 4 answered questions.

---

## Output Schema

```typescript
interface IndustryDiagnosticsResult {
  painPoints: Array<{
    id: string;                        // Unique identifier, e.g., "pp-manual-inventory"
    label: string;                     // Human-readable name
    severity: 'high' | 'medium' | 'low';
    description: string;               // 1-2 sentence explanation
    affectedArea: string;              // Business area affected
  }>;
  opportunities: Array<{
    id: string;                        // Unique identifier, e.g., "opp-ai-forecasting"
    label: string;                     // Human-readable name
    potentialROI: string;              // Percentage range, e.g., "15-25%"
    timeToValue: string;               // e.g., "2-4 weeks"
    description: string;               // 1-2 sentence explanation
    requiredCapability: string;        // What AI system addresses this
  }>;
  benchmarks: {
    industryAverage: string;           // Key metrics for average companies
    topPerformers: string;             // What leaders do differently
    clientPosition: string;            // Where this company sits relative to benchmarks
  };
  priorityActions: string[];           // Top 3 immediate actions (ordered)
}
```

---

## Data Sources

| Source              | Table / Origin          | Usage                                       |
| ------------------- | ----------------------- | ------------------------------------------- |
| Step 1 AI results   | `wizard_answers`        | Company profile for context                  |
| Step 2 form data    | Wizard Step 2 form      | Diagnostic question answers                  |
| Industry knowledge  | System prompt           | Industry-specific benchmarks and patterns    |
| Cache               | `ai_cache`              | 7-day TTL for industry-level insights        |

---

## Trigger Events

| Trigger                     | Condition                                   | Action                        |
| --------------------------- | ------------------------------------------- | ----------------------------- |
| Step 2 form submit          | User clicks "Continue" on Step 2            | Full diagnostics run          |
| Re-analysis                 | User goes back to Step 2 and re-submits     | Invalidate cache, re-run      |
| Step 1 data changed         | User edits Step 1 after completing Step 2   | Flag Step 2 results as stale  |

---

## Edge Cases

| Scenario                              | Handling                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------ |
| Step 1 ai_results missing             | Return HTTP 400 — "Complete Step 1 first"                                |
| Fewer than 4 questions answered       | Proceed with available data; note reduced confidence in output           |
| Unknown industry ID                   | Use "general business" diagnostic template                               |
| Gemini returns fewer than 2 pain pts  | Supplement with industry defaults from prompt engineering                 |
| Company profile contradicts answers   | Trust user answers over automated analysis; note discrepancy             |
| Gemini timeout                        | Retry once; if still fails, return basic industry template               |
| JSON parse error                      | Attempt to extract partial JSON; fall back to template with raw insights |
| Very niche industry                   | Map to closest standard industry; note in `benchmarks.clientPosition`    |

---

## Database Operations

### Read: wizard_answers (Step 1 data)

```sql
SELECT ai_results FROM wizard_answers
WHERE session_id = $sessionId AND screen_id = 'step-1'
LIMIT 1;
```

### Write: wizard_answers (Step 2 results)

```sql
INSERT INTO wizard_answers (session_id, screen_id, question_key, data, ai_results)
VALUES ($sessionId, 'step-2', 'industry-diagnostics', $diagnosticAnswers, $aiResult)
ON CONFLICT (session_id, screen_id, question_key)
DO UPDATE SET data = $diagnosticAnswers, ai_results = $aiResult, updated_at = now();
```

### Write: ai_cache

```sql
INSERT INTO ai_cache (cache_key, function_name, result, expires_at)
VALUES (sha256($inputHash), 'industry-diagnostics', $aiResult, now() + interval '7 days')
ON CONFLICT (cache_key) DO UPDATE SET result = $aiResult, expires_at = now() + interval '7 days';
```

### Write: ai_run_logs

```sql
INSERT INTO ai_run_logs (agent_name, session_id, model, input_tokens, output_tokens, latency_ms, status, created_at)
VALUES ('industry-diagnostics', $sessionId, 'gemini-3-flash-preview', $inputTokens, $outputTokens, $latencyMs, $status, now());
```

---

## Outcomes

| Outcome                        | Metric                          | Target                |
| ------------------------------ | ------------------------------- | --------------------- |
| Diagnostic relevance           | User agreement rate             | > 75%                 |
| Pain point accuracy            | Pain points user confirms       | >= 3 of 5             |
| Response latency               | P95 latency                     | < 4 seconds           |
| Cache hit rate                 | Cache hits / total requests     | > 40%                 |
| Opportunity actionability      | Opportunities linked to systems | 100%                  |
| Step 2 to Step 3 conversion   | Users proceeding                | > 75%                 |
