---
id: 046-agent-system-recommendations
diagram_id: AGENT-03
prd_section: AI Agents
title: AI system recommendation agent — ranked system selection with fit scoring
skill: ai-agents
phase: CRITICAL
priority: P0
status: Not Started
owner: Backend
dependencies:
  - 045-agent-industry-diagnostics
estimated_effort: L
percent_complete: 0
area: ai-agents
wizard_step: 3
schema_tables: [wizard_answers, ai_cache, ai_run_logs, systems, services]
edge_function: system-recommendations
figma_prompt: prompts/046-agent-system-recommendations.md
---

# 046 — AI System Recommendation Agent

## Summary Table

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Agent ID           | AGENT-03                                                     |
| Name               | AI System Recommendation Agent                               |
| Edge Function      | `POST /system-recommendations`                               |
| Model              | `gemini-3.1-pro-preview` (high thinking, deep reasoning)     |
| Wizard Step        | Step 3 — System Selection                                    |
| Trigger            | User enters Step 3                                           |
| Input              | All wizard data (Steps 1-2), systems catalog                 |
| Output             | Ranked systems with fit scores, strategy, timeline           |
| Storage            | `wizard_answers.ai_results` WHERE `screen_id='step-3'`      |
| Cache              | `ai_cache` — 12h TTL                                        |
| Logging            | `ai_run_logs` — `agent_name='system-recommendations'`       |
| Downstream         | User selections saved in `wizard_answers.data` (step-3)     |
| Priority           | P0 CRITICAL                                                  |

---

## Description

### 1. Purpose

The System Recommendation Agent is the highest-stakes agent in the wizard. It analyzes all data collected in Steps 1 and 2 — company profile, industry diagnostics, pain points, opportunities — and produces a ranked list of AI systems with personalized fit scores, ROI projections, and implementation strategy. This output directly determines what the client buys. The agent must balance ambition (suggesting transformative systems) with pragmatism (respecting budget, team capacity, and technical readiness).

### 2. User Context

The user has completed company profiling and diagnostic questions. They now see a curated selection of AI systems recommended specifically for their business. Each system card shows a fit score, a personalized explanation of why it matters for their situation, and expected ROI. The user selects which systems they want to implement. This is the "shopping cart" moment — the recommendations must feel personalized, justified, and achievable to convert browsing into commitment.

### 3. Technical Approach

This agent uses `gemini-3.1-pro-preview` (high thinking model) because it needs to perform multi-factor reasoning: cross-referencing pain points with system capabilities, calculating fit scores based on readiness indicators, determining optimal implementation order considering dependencies, and estimating realistic timelines. The edge function loads all previous wizard data, fetches the available systems catalog from the `systems` table, and constructs a comprehensive prompt. The systems catalog includes each system's capabilities, prerequisites, typical timeline, and pricing tier.

### 4. Data Flow

```
wizard_answers (step-1) --> company profile
wizard_answers (step-2) --> diagnostics, pain points, opportunities
systems table           --> available systems catalog
services table          --> services within each system
    |
    v
Edge Function: system-recommendations
    |
    +--> Aggregate all wizard context
    +--> Load systems + services catalog
    +--> Check ai_cache (12h TTL)
    |       |
    |       +--> Cache HIT  --> Return cached
    |       +--> Cache MISS --> Call callGemini() [gemini-3.1-pro-preview]
    |
    +--> Store in wizard_answers.ai_results (step-3)
    +--> Log to ai_run_logs
    +--> Return ranked systems to frontend

User reviews --> selects systems --> selections stored in wizard_answers.data (step-3)
```

### 5. Design Considerations

Using `gemini-3.1-pro-preview` means higher latency (5-10s expected) but significantly better reasoning quality. The frontend should show a loading state with progressive messaging ("Analyzing your business...", "Matching AI systems...", "Calculating fit scores..."). The fit score (0-1) is not a random number — it must be reproducible given the same inputs. The `quickWin` flag identifies systems that can deliver value within 2 weeks, which is critical for client confidence. The `investmentTier` maps to pricing without exposing exact amounts in the wizard.

---

## Agent Specification

### System Prompt

```
You are an AI systems architect for an AI consulting agency. Given comprehensive business data, recommend and rank AI systems from the available catalog.

AVAILABLE SYSTEMS CATALOG:
{systemsCatalog}

EVALUATION CRITERIA (weighted):
1. Pain point alignment (30%) — Does this system directly address identified pain points?
2. ROI potential (25%) — What's the realistic return based on their industry and scale?
3. Readiness match (20%) — Can they actually implement this given their current maturity?
4. Strategic fit (15%) — Does this align with their stated goals and industry trends?
5. Quick win potential (10%) — Can this deliver visible value within 2 weeks?

RULES:
- Rank ALL systems that score above 0.4 fit score
- Maximum 8 systems in recommendations
- At least 1 system must be flagged as quickWin
- implementationOrder must respect system dependencies
- investmentTier is based on total selected systems: 1-2 = starter, 3-4 = growth, 5+ = enterprise
- personalizedWhy must reference specific data from their profile, not generic benefits
- expectedROI must be a realistic range, not inflated

Output MUST be valid JSON matching the provided schema.
```

### Model Configuration

| Parameter        | Value                      |
| ---------------- | -------------------------- |
| Model            | `gemini-3.1-pro-preview`   |
| Temperature      | 0.2                        |
| Max Tokens       | 4096                       |
| Response Format  | JSON                       |
| Thinking Mode    | High (deep reasoning)      |

---

## Input Schema

```typescript
interface SystemRecommendationsInput {
  sessionId: string;
  wizardAnswers: {
    step1: BusinessAnalysisResult;        // Company profile
    step2: IndustryDiagnosticsResult;     // Diagnostics
  };
  industry: string;
  systemsCatalog: SystemDefinition[];     // From systems + services tables
}

interface SystemDefinition {
  id: string;                    // e.g., "support-engine"
  name: string;                  // e.g., "AI Support Engine"
  description: string;
  capabilities: string[];
  prerequisites: string[];
  typicalTimeline: string;       // e.g., "3-4 weeks"
  services: string[];            // Linked service IDs
  dependencies: string[];        // Other system IDs this depends on
}
```

**Validation Rules:**
- `sessionId` must have completed Steps 1 and 2.
- `wizardAnswers.step1` and `wizardAnswers.step2` must both contain valid `ai_results`.
- `systemsCatalog` must contain at least 1 system.

---

## Output Schema

```typescript
interface SystemRecommendationsResult {
  rankedSystems: Array<{
    systemId: string;            // References systems.id
    rank: number;                // 1 = best fit
    fitScore: number;            // 0.0 to 1.0
    personalizedWhy: string;     // 2-3 sentences specific to their business
    expectedROI: string;         // e.g., "15-30% cost reduction in support"
    quickWin: boolean;           // Can deliver value within 2 weeks
    addressesPainPoints: string[]; // IDs from diagnostics pain points
  }>;
  combinedStrategy: string;      // 2-3 sentence strategic overview
  implementationOrder: string[]; // Ordered system IDs respecting dependencies
  estimatedTimeline: string;     // Total weeks for all recommended systems
  investmentTier: 'starter' | 'growth' | 'enterprise';
}
```

### Available System IDs

| System ID                | Name                     | Category           |
| ------------------------ | ------------------------ | ------------------ |
| `support-engine`         | AI Support Engine        | Customer Service   |
| `growth-engine`          | Growth Engine            | Marketing & Sales  |
| `operations-autopilot`   | Operations Autopilot     | Operations         |
| `data-intelligence`      | Data Intelligence        | Analytics          |
| `content-engine`         | Content Engine           | Content & Creative |
| `onboarding-system`      | Onboarding System        | HR & Operations    |
| `cart-recovery`          | Cart Recovery            | E-commerce         |
| `recommendation-engine`  | Recommendation Engine    | Personalization    |
| `sales-automation`       | Sales Automation         | Sales              |
| `loyalty-system`         | Loyalty System           | Retention          |
| `booking-engine`         | Booking Engine           | Scheduling         |
| `compliance-automation`  | Compliance Automation    | Legal & Compliance |

---

## Data Sources

| Source              | Table / Origin          | Usage                                       |
| ------------------- | ----------------------- | ------------------------------------------- |
| Step 1 AI results   | `wizard_answers`        | Company profile, readiness indicators        |
| Step 2 AI results   | `wizard_answers`        | Pain points, opportunities, benchmarks       |
| Systems catalog     | `systems`               | Available system definitions                 |
| Services catalog    | `services`              | Capabilities within each system              |
| System-service map  | `system_services`       | Which services belong to which system        |
| Cache               | `ai_cache`              | 12h TTL                                     |

---

## Trigger Events

| Trigger                     | Condition                                   | Action                             |
| --------------------------- | ------------------------------------------- | ---------------------------------- |
| Enter Step 3                | User navigates to Step 3                    | Auto-run recommendations           |
| Re-analysis                 | User goes back, changes Step 1 or 2 data    | Invalidate cache, re-run           |
| System catalog update       | Admin modifies systems table                | Invalidate all recommendation cache |

---

## Edge Cases

| Scenario                              | Handling                                                                   |
| ------------------------------------- | -------------------------------------------------------------------------- |
| No systems score above 0.4            | Lower threshold to 0.3; if still none, return top 3 with explanation       |
| All systems flagged as quickWin       | Limit quickWin to top 2 only                                               |
| Step 1 or Step 2 data missing         | Return HTTP 400 — "Complete previous steps first"                          |
| Systems table empty or unreachable    | Return HTTP 503 — "System catalog unavailable"                             |
| Gemini timeout (>15s)                 | Retry once; if still fails, return rule-based recommendations as fallback  |
| User has niche industry not in catalog| Map to closest standard industry; note in `combinedStrategy`               |
| Conflicting pain points               | Prioritize high-severity pain points; note trade-offs in strategy          |
| JSON parse error                      | Attempt partial extraction; fall back to top-3 systems by industry match   |
| Very small company (1-5 people)       | Cap at 3 recommended systems; set tier to 'starter'                        |
| Enterprise company (500+)             | Include all relevant systems; set tier to 'enterprise'                     |

---

## Database Operations

### Read: wizard_answers (Steps 1 and 2)

```sql
SELECT screen_id, ai_results FROM wizard_answers
WHERE session_id = $sessionId AND screen_id IN ('step-1', 'step-2');
```

### Read: systems + services catalog

```sql
SELECT s.*, json_agg(sv.*) as services
FROM systems s
LEFT JOIN system_services ss ON ss.system_id = s.id
LEFT JOIN services sv ON sv.id = ss.service_id
GROUP BY s.id;
```

### Write: wizard_answers (Step 3 AI results)

```sql
INSERT INTO wizard_answers (session_id, screen_id, question_key, ai_results)
VALUES ($sessionId, 'step-3', 'system-recommendations', $aiResult)
ON CONFLICT (session_id, screen_id, question_key)
DO UPDATE SET ai_results = $aiResult, updated_at = now();
```

### Write: wizard_answers (User selections — after user picks systems)

```sql
UPDATE wizard_answers
SET data = $selectedSystems
WHERE session_id = $sessionId AND screen_id = 'step-3' AND question_key = 'system-recommendations';
```

---

## Outcomes

| Outcome                          | Metric                            | Target                 |
| -------------------------------- | --------------------------------- | ---------------------- |
| Recommendation relevance         | Systems user selects vs. top-3    | >= 2 of top-3 selected |
| Fit score calibration            | Fit scores correlate with success | r > 0.6                |
| Response latency                 | P95 latency                       | < 10 seconds           |
| Conversion rate                  | Step 3 → Step 4 progression       | > 70%                  |
| Average systems selected         | Systems per session               | 2-4 systems            |
| Revenue correlation              | Higher fit score → higher LTV     | Positive correlation   |
| Quick win accuracy               | Quick wins delivered on time       | > 80%                  |
