---
id: 047-agent-readiness-scoring
diagram_id: AGENT-04
prd_section: AI Agents
title: Readiness scoring agent — 5-dimension AI readiness assessment
skill: ai-agents
phase: HIGH
priority: P1
status: Not Started
owner: Backend
dependencies:
  - 046-agent-system-recommendations
estimated_effort: M
percent_complete: 0
area: ai-agents
wizard_step: 4
schema_tables: [wizard_answers, ai_cache, ai_run_logs, context_snapshots]
edge_function: readiness-score
figma_prompt: prompts/047-agent-readiness-scoring.md
---

# 047 — Readiness Scoring Agent

## Summary Table

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Agent ID           | AGENT-04                                                     |
| Name               | Readiness Scoring Agent                                      |
| Edge Function      | `POST /readiness-score`                                      |
| Model              | `gemini-3.1-pro-preview` (high thinking)                     |
| Wizard Step        | Step 4 — Readiness Assessment                                |
| Trigger            | User enters Step 4                                           |
| Input              | All wizard data (Steps 1-3 including selected systems)       |
| Output             | 5-dimension score, maturity level, gaps, strengths, actions  |
| Storage            | `wizard_answers.ai_results` WHERE `screen_id='step-4'`      |
| Snapshot           | `context_snapshots` — baseline readiness snapshot            |
| Cache              | `ai_cache` — 6h TTL                                         |
| Logging            | `ai_run_logs` — `agent_name='readiness-score'`              |
| Downstream         | Dashboard overview, AI insights dashboard, reporting agent   |
| Priority           | P1 HIGH                                                      |

---

## Description

### 1. Purpose

The Readiness Scoring Agent calculates a comprehensive AI readiness score across 5 dimensions: Digital Infrastructure, Data & Analytics, Process Automation, Team & Culture, and Strategic Alignment. This produces the client's "AI health check" — a quantified assessment that becomes the baseline measurement on their dashboard. The score is tracked over time via `context_snapshots`, allowing the platform to show improvement as AI systems are implemented.

### 2. User Context

The user has completed Steps 1-3: their company has been profiled, diagnostics run, and AI systems selected. Step 4 presents their readiness assessment as a visual scorecard — a radar chart showing the 5 dimensions, an overall score (0-100), a maturity level label, identified gaps with priorities, and concrete next steps. This is the "mirror moment" where the client sees exactly where they stand and what needs to change. The score must feel fair, actionable, and motivating — not discouraging.

### 3. Technical Approach

This agent uses `gemini-3.1-pro-preview` because readiness scoring requires synthesizing multiple data points into calibrated numeric scores. The model must weigh conflicting signals (e.g., high digital maturity but low data readiness), produce internally consistent scores (dimensions should logically relate), and generate actionable gap analysis. The edge function aggregates all wizard data from Steps 1-3, including the user's system selections from Step 3, and provides them as context. The overall score is a weighted average of the 5 dimensions.

### 4. Data Flow

```
wizard_answers (step-1) --> company profile, readiness indicators
wizard_answers (step-2) --> diagnostics, pain points
wizard_answers (step-3) --> ai_results (recommendations) + data (selected systems)
    |
    v
Edge Function: readiness-score
    |
    +--> Aggregate all session data
    +--> Check ai_cache (6h TTL)
    |       |
    |       +--> Cache HIT  --> Return cached
    |       +--> Cache MISS --> Call callGemini() [gemini-3.1-pro-preview]
    |
    +--> Store in wizard_answers.ai_results (step-4)
    +--> Create context_snapshots entry (baseline)
    +--> Log to ai_run_logs
    +--> Return to frontend (radar chart, score cards)
```

### 5. Design Considerations

Scores must be calibrated against realistic benchmarks — a score of 50 should mean "average for their industry," not "failing." The weighted scoring formula is: Digital Maturity (25%) + Data Readiness (25%) + Process Automation (20%) + Team Capability (15%) + Strategic Alignment (15%). The `context_snapshots` entry created here serves as the baseline for the AI Opportunity Analysis workflow (051), which re-runs this agent periodically to track improvement. The maturity level labels map to score ranges: 0-30 developing, 31-55 emerging, 56-75 established, 76-100 advanced.

---

## Agent Specification

### System Prompt

```
You are an AI readiness assessment specialist. Given comprehensive data about a company — their profile, industry diagnostics, selected AI systems, and operational details — produce a calibrated 5-dimension readiness score.

SCORING DIMENSIONS (each 0-100):
1. Digital Infrastructure (25% weight) — Website quality, tech stack maturity, cloud adoption, API readiness
2. Data & Analytics (25% weight) — Data collection practices, analytics usage, data quality signals
3. Process Automation (20% weight) — Current automation level, workflow digitization, integration maturity
4. Team & Culture (15% weight) — Technical skills, change readiness, innovation culture signals
5. Strategic Alignment (15% weight) — AI strategy clarity, leadership buy-in, investment readiness

CALIBRATION RULES:
- Score of 50 = industry average for their company size
- Scores must be internally consistent (high data readiness with low digital infrastructure is unlikely)
- Overall score = weighted average of dimensions
- Each dimension score must be justified by specific evidence from the input data
- Gaps must be actionable and linked to specific improvement areas
- Maturity levels: 0-30 = developing, 31-55 = emerging, 56-75 = established, 76-100 = advanced

Output MUST be valid JSON matching the provided schema.
```

### Model Configuration

| Parameter        | Value                      |
| ---------------- | -------------------------- |
| Model            | `gemini-3.1-pro-preview`   |
| Temperature      | 0.15                       |
| Max Tokens       | 3072                       |
| Response Format  | JSON                       |
| Thinking Mode    | High                       |

---

## Input Schema

```typescript
interface ReadinessScoreInput {
  sessionId: string;
  wizardData: {
    step1: BusinessAnalysisResult;
    step2: IndustryDiagnosticsResult;
    step3: {
      aiResults: SystemRecommendationsResult;
      selectedSystems: string[];         // User-selected system IDs
    };
  };
}
```

**Validation Rules:**
- `sessionId` must have completed Steps 1-3.
- All three steps' `ai_results` must be present.
- `selectedSystems` array must have at least 1 system.

---

## Output Schema

```typescript
interface ReadinessScoreResult {
  overallScore: number;                  // 0-100, weighted average
  scoreBreakdown: {
    digitalMaturity: {
      score: number;                     // 0-100
      label: string;                     // "Digital Infrastructure"
      evidence: string;                  // What data supports this score
    };
    dataReadiness: {
      score: number;
      label: string;                     // "Data & Analytics"
      evidence: string;
    };
    processAutomation: {
      score: number;
      label: string;                     // "Process Automation"
      evidence: string;
    };
    teamCapability: {
      score: number;
      label: string;                     // "Team & Culture"
      evidence: string;
    };
    strategicAlignment: {
      score: number;
      label: string;                     // "Strategic Alignment"
      evidence: string;
    };
  };
  maturityLevel: 'developing' | 'emerging' | 'established' | 'advanced';
  gaps: Array<{
    area: string;                        // Which dimension or sub-area
    description: string;                 // What's missing
    priority: 'high' | 'medium' | 'low';
    suggestedAction: string;             // How to close the gap
  }>;
  strengths: string[];                   // 2-4 identified strengths
  nextSteps: string[];                   // 3-5 ordered next steps
  comparisonToIndustry: string;          // 1-2 sentences comparing to industry average
}
```

---

## Data Sources

| Source                | Table / Origin          | Usage                                       |
| --------------------- | ----------------------- | ------------------------------------------- |
| Step 1 AI results     | `wizard_answers`        | Company profile, readiness indicators        |
| Step 2 AI results     | `wizard_answers`        | Diagnostics, pain points, benchmarks         |
| Step 3 AI results     | `wizard_answers`        | Recommended systems, fit scores              |
| Step 3 user data      | `wizard_answers.data`   | Selected systems (user choices)              |
| Cache                 | `ai_cache`              | 6h TTL                                      |
| Historical snapshots  | `context_snapshots`     | Previous scores for comparison (if exists)   |

---

## Trigger Events

| Trigger                     | Condition                                    | Action                             |
| --------------------------- | -------------------------------------------- | ---------------------------------- |
| Enter Step 4                | User navigates to Step 4                     | Auto-run readiness assessment      |
| Re-assessment               | Triggered by workflow 051                    | Re-run with current project data   |
| Step 3 selections changed   | User goes back and changes system selections | Invalidate cache, re-run           |

---

## Edge Cases

| Scenario                              | Handling                                                                   |
| ------------------------------------- | -------------------------------------------------------------------------- |
| Steps 1-3 incomplete                  | Return HTTP 400 — "Complete previous steps"                                |
| No systems selected in Step 3         | Score without system context; note in `comparisonToIndustry`               |
| Previous snapshot exists              | Include delta comparison in `comparisonToIndustry`                         |
| All dimensions score very low (<20)   | Ensure messaging is encouraging: "Early stage — high growth potential"     |
| All dimensions score very high (>85)  | Verify against input data; add note about maintaining excellence           |
| Gemini timeout                        | Retry once; if fails, return rule-based scoring from readiness indicators  |
| Scores not internally consistent      | Post-process: if digital maturity < 30 but data readiness > 80, flag      |
| JSON parse error                      | Fall back to heuristic scoring from Step 1 readiness indicators            |

---

## Database Operations

### Read: All wizard answers

```sql
SELECT screen_id, question_key, data, ai_results FROM wizard_answers
WHERE session_id = $sessionId
ORDER BY screen_id;
```

### Write: wizard_answers (Step 4)

```sql
INSERT INTO wizard_answers (session_id, screen_id, question_key, ai_results)
VALUES ($sessionId, 'step-4', 'readiness-score', $aiResult)
ON CONFLICT (session_id, screen_id, question_key)
DO UPDATE SET ai_results = $aiResult, updated_at = now();
```

### Write: context_snapshots (baseline)

```sql
INSERT INTO context_snapshots (session_id, snapshot_type, data, created_at)
VALUES ($sessionId, 'readiness-baseline', $aiResult, now());
```

### Write: ai_cache

```sql
INSERT INTO ai_cache (cache_key, function_name, result, expires_at)
VALUES (sha256($inputHash), 'readiness-score', $aiResult, now() + interval '6 hours')
ON CONFLICT (cache_key) DO UPDATE SET result = $aiResult, expires_at = now() + interval '6 hours';
```

### Write: ai_run_logs

```sql
INSERT INTO ai_run_logs (agent_name, session_id, model, input_tokens, output_tokens, latency_ms, status, created_at)
VALUES ('readiness-score', $sessionId, 'gemini-3.1-pro-preview', $inputTokens, $outputTokens, $latencyMs, $status, now());
```

---

## Outcomes

| Outcome                        | Metric                              | Target                |
| ------------------------------ | ----------------------------------- | --------------------- |
| Score calibration              | Scores within 10pts of expert eval  | > 80% of cases        |
| Internal consistency           | Dimension scores logically coherent | > 95%                 |
| Response latency               | P95 latency                         | < 12 seconds          |
| Gap actionability              | Gaps have clear actions             | 100%                  |
| Step 4 to Step 5 conversion   | Users proceeding to launch          | > 65%                 |
| Score tracking adoption        | Clients who check score again       | > 40% within 30 days  |
| Improvement correlation        | Score increase after implementation | Average +15 points    |
