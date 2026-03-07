---
id: 044-agent-business-analysis
diagram_id: AGENT-01
prd_section: AI Agents
title: Business analysis agent — company profiling from URL and description
skill: ai-agents
phase: CRITICAL
priority: P0
status: Not Started
owner: Backend
dependencies:
  - 012-gemini-ai-client
estimated_effort: M
percent_complete: 0
area: ai-agents
wizard_step: 1
schema_tables: [wizard_answers, ai_cache, ai_run_logs]
edge_function: analyze-business
figma_prompt: prompts/044-agent-business-analysis.md
---

# 044 — Business Analysis Agent

## Summary Table

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Agent ID           | AGENT-01                                                     |
| Name               | Business Analysis Agent                                      |
| Edge Function      | `POST /analyze-business`                                     |
| Model              | `gemini-3-flash-preview` (fast, low thinking)                      |
| Wizard Step        | Step 1 — Company Information                                 |
| Trigger            | User completes Step 1 form and clicks Continue               |
| Input              | URL, description, industry hint                              |
| Output             | Structured company profile JSON                              |
| Storage            | `wizard_answers.ai_results` WHERE `screen_id='step-1'`      |
| Cache              | `ai_cache` — 24h TTL, SHA-256 key                           |
| Logging            | `ai_run_logs` — `agent_name='analyze-business'`             |
| Downstream Agents  | 045 (industry-diagnostics), 046 (system-recommendations), 047 (readiness-score) |
| Priority           | P0 CRITICAL                                                  |

---

## Description

### 1. Purpose

The Business Analysis Agent is the FIRST AI interaction in the wizard flow. It analyzes a company from its website URL and/or free-text description to produce a structured business profile. This foundational data propagates through every subsequent wizard step — industry diagnostics, system recommendations, readiness scoring, and roadmap generation all depend on the quality and completeness of this initial analysis.

### 2. User Context

The user has just landed on the wizard and is providing basic company information: their website URL, a description of what they do, and optionally selecting an industry. They expect immediate, intelligent analysis that demonstrates the platform understands their business. This is the first "wow moment" — the agent must return results that feel insightful, not generic.

### 3. Technical Approach

The edge function `analyze-business` receives the user's input, checks `ai_cache` for a matching entry (keyed by SHA-256 hash of `{fn, url, description, industry}`), and either returns the cached result or calls `callGemini()` with a carefully crafted system prompt. The prompt instructs Gemini to analyze the company holistically — products, technology stack, team size signals, competitive positioning, and AI readiness indicators. The response is validated against the output schema, stored in `wizard_answers.ai_results`, and logged to `ai_run_logs`.

### 4. Data Flow

```
User Input (URL, description, industry)
    |
    v
Edge Function: analyze-business
    |
    +--> Check ai_cache (SHA-256 key)
    |       |
    |       +--> Cache HIT  --> Return cached result
    |       +--> Cache MISS --> Call callGemini()
    |                              |
    |                              v
    |                      Parse & validate JSON
    |                              |
    |                              v
    |                      Store in ai_cache (24h TTL)
    |
    +--> Store in wizard_answers.ai_results (step-1)
    +--> Log to ai_run_logs
    +--> Return to frontend
```

### 5. Design Considerations

The agent uses `gemini-3-flash-preview` for speed — Step 1 analysis must return in under 3 seconds to maintain user engagement. The URL analysis is best-effort: if the site is unreachable, the agent falls back to description-only analysis. The output schema includes `readinessIndicators` which are coarse assessments used downstream by the readiness-score agent for initial calibration.

---

## Agent Specification

### System Prompt

```
You are a business analyst AI for an AI consulting agency. Given a company's website URL and/or description, produce a comprehensive but concise business profile.

Focus on:
1. What the company does (products, services, market)
2. Technology signals (tech stack, digital presence maturity)
3. Team size and organizational signals
4. AI and automation opportunities specific to their business
5. Competitive positioning within their industry

Be specific, not generic. If analyzing a URL, reference actual content you find.
Output MUST be valid JSON matching the provided schema.
```

### Model Configuration

| Parameter        | Value                |
| ---------------- | -------------------- |
| Model            | `gemini-3-flash-preview`   |
| Temperature      | 0.3                  |
| Max Tokens       | 2048                 |
| Response Format  | JSON                 |
| Thinking Mode    | Off (low latency)    |

---

## Input Schema

```typescript
interface AnalyzeBusinessInput {
  url?: string;           // Company website URL (optional)
  description?: string;   // Free-text company description (optional)
  industry?: string;      // Industry hint from user selection (optional)
  sessionId: string;      // Wizard session ID (required)
}
```

**Validation Rules:**
- At least one of `url` or `description` MUST be provided; return HTTP 400 if both are empty.
- `url` must be a valid URL format if provided (starts with `http://` or `https://`).
- `sessionId` must reference an existing `wizard_sessions` row.

---

## Output Schema

```typescript
interface BusinessAnalysisResult {
  companySummary: string;          // 2-3 sentence overview
  detectedIndustry: string;        // Industry sector
  productsServices: string[];      // Key products and services (max 8)
  teamSizeEstimate: string;        // Estimated range, e.g., "10-50"
  technologySignals: string[];     // Detected technologies (max 10)
  aiOpportunities: string[];       // Top 4 AI opportunities
  competitivePosition: string;     // Brief competitive analysis
  readinessIndicators: {
    digital_maturity: 'low' | 'medium' | 'high';
    automation_level: 'none' | 'basic' | 'moderate' | 'advanced';
    data_readiness: 'low' | 'medium' | 'high';
  };
}
```

---

## Data Sources

| Source              | Table / Origin          | Usage                                      |
| ------------------- | ----------------------- | ------------------------------------------ |
| User input          | Wizard Step 1 form      | URL, description, industry selection        |
| External website    | Company URL (fetched)   | Content analysis for profiling              |
| Cache               | `ai_cache`              | Avoid redundant Gemini calls                |
| Session             | `wizard_sessions`       | Session context and ownership               |

---

## Trigger Events

| Trigger                     | Condition                                   | Action                        |
| --------------------------- | ------------------------------------------- | ----------------------------- |
| Step 1 form submit          | User clicks "Continue" on Step 1            | Full analysis run             |
| URL blur (optional preview) | User tabs away from URL field               | Lightweight pre-analysis      |
| Re-analysis                 | User edits Step 1 data and re-submits       | Invalidate cache, re-run      |

---

## Edge Cases

| Scenario                        | Handling                                                                 |
| ------------------------------- | ------------------------------------------------------------------------ |
| URL unreachable (404, timeout)  | Analyze from description only; set `technologySignals` to empty array    |
| Both URL and description empty  | Return HTTP 400 with message "Please provide a URL or description"       |
| Gemini timeout (>10s)           | Retry once with reduced prompt; if still fails, return partial analysis  |
| JSON parse error from Gemini    | Wrap raw text in `{ "companySummary": rawText, ...defaults }`           |
| URL is a social media page      | Extract what's available; note limited data in `companySummary`          |
| Very long description (>5000ch) | Truncate to 5000 chars with notice                                       |
| Duplicate session submission    | Return cached result from `wizard_answers` if already exists             |
| Non-English website             | Attempt analysis; note language in summary; rely more on description     |

---

## Database Operations

### Write: wizard_answers

```sql
INSERT INTO wizard_answers (session_id, screen_id, question_key, data, ai_results)
VALUES ($sessionId, 'step-1', 'business-analysis', $userInput, $aiResult)
ON CONFLICT (session_id, screen_id, question_key)
DO UPDATE SET data = $userInput, ai_results = $aiResult, updated_at = now();
```

### Write: ai_cache

```sql
INSERT INTO ai_cache (cache_key, function_name, result, expires_at)
VALUES (sha256($inputHash), 'analyze-business', $aiResult, now() + interval '24 hours')
ON CONFLICT (cache_key) DO UPDATE SET result = $aiResult, expires_at = now() + interval '24 hours';
```

### Write: ai_run_logs

```sql
INSERT INTO ai_run_logs (agent_name, session_id, model, input_tokens, output_tokens, latency_ms, status, created_at)
VALUES ('analyze-business', $sessionId, 'gemini-3-flash-preview', $inputTokens, $outputTokens, $latencyMs, $status, now());
```

---

## Outcomes

| Outcome                        | Metric                          | Target                |
| ------------------------------ | ------------------------------- | --------------------- |
| Analysis accuracy              | User edits after analysis       | < 20% edit rate       |
| Response latency               | P95 latency                     | < 3 seconds           |
| Cache hit rate                 | Cache hits / total requests     | > 30%                 |
| Downstream data completeness   | All output fields populated     | > 95%                 |
| Error rate                     | Failed analyses / total         | < 2%                  |
| User engagement                | Step 1 → Step 2 conversion      | > 80%                 |
