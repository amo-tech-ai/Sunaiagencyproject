---
id: 052-workflow-roadmap-generation
diagram_id: WORKFLOW-04
prd_section: Workflow Automation
title: Roadmap generation workflow — AI-powered implementation planning
skill: backend
phase: HIGH
priority: P1
status: Not Started
owner: Backend
dependencies:
  - 046-agent-system-recommendations
estimated_effort: M
percent_complete: 0
area: wizard
wizard_step: 5
schema_tables: [wizard_answers, roadmaps, roadmap_phases, projects, systems]
figma_prompt: prompts/052-workflow-roadmap-generation.md
---

# 052 — Roadmap Generation Workflow

## Summary Table

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Workflow ID        | WORKFLOW-04                                                  |
| Name               | Roadmap Generation Workflow                                  |
| Type               | AI-driven generation with user review                        |
| Trigger            | User reaches wizard Step 5 (selected systems confirmed)      |
| Scope              | System selections through confirmed implementation roadmap   |
| Tables Modified    | `wizard_answers`                                             |
| AI Dependency      | `generate-roadmap` agent (new — part of this spec)           |
| Dashboard Impact   | Roadmap visualization in wizard Step 5                       |
| Downstream         | 050 (client-onboarding) executes on roadmap confirmation     |
| Priority           | P1 HIGH                                                      |

---

## Description

### 1. Purpose

The Roadmap Generation Workflow produces an AI-powered implementation plan that converts the user's selected AI systems into a phased, time-bound roadmap. This is wizard Step 5 — the final step before "Launch." The roadmap considers system dependencies, quick-win prioritization, team capacity constraints, risk factors, and the client's readiness score to produce a realistic, achievable plan. The user reviews the generated roadmap, can make adjustments (reorder phases, adjust timelines, add constraints), and confirms to trigger the client onboarding workflow (050).

### 2. User Context

The user has selected their AI systems in Step 3 and reviewed their readiness score in Step 4. Now they see a visual timeline of how their selected systems will be implemented across phases. Each phase shows its systems, deliverables, duration, and dependencies. The user can drag to reorder phases, extend timelines, or mark phases as "later" to defer them. This interactive review ensures the client feels ownership of the plan. The "Launch" button confirms the roadmap and triggers project creation.

### 3. Technical Approach

The workflow calls a `generate-roadmap` agent that takes all wizard context — selected systems, readiness scores, industry, company size — and produces a phased implementation plan. The agent uses `gemini-3.1-pro-preview` because roadmap planning requires reasoning about dependencies (System A must precede System B), resource constraints (only N systems can be implemented in parallel), and strategic sequencing (quick wins first to build momentum, complex systems later). The generated roadmap is stored in `wizard_answers.ai_results` for Step 5 and rendered as an interactive timeline.

### 4. Data Flow

```
User confirms system selections (Step 3)
User reviews readiness score (Step 4)
    |
    v
User enters Step 5
    |
    v
Edge Function: generate-roadmap
    |
    +--> Load all wizard_answers (steps 1-4)
    +--> Load selected systems from step-3 data
    +--> Load system definitions from systems table
    +--> Check ai_cache
    |       |
    |       +--> Cache HIT  --> Return cached roadmap
    |       +--> Cache MISS --> Call callGemini() [gemini-3.1-pro-preview]
    |
    +--> Store in wizard_answers.ai_results (step-5)
    +--> Log to ai_run_logs
    +--> Return roadmap to frontend
    |
    v
User reviews roadmap visualization
    |
    +--> User adjusts (reorder, timeline changes)
    |       --> Save adjustments in wizard_answers.data (step-5)
    |
    +--> User clicks "Launch"
            --> wizard_sessions.wizard_completed_at = now()
            --> Trigger workflow 050 (client-onboarding)
```

### 5. Design Considerations

The roadmap agent must produce phases that are 2-4 weeks each — neither too granular (overwhelming) nor too coarse (unactionable). Each phase should contain 1-2 AI systems maximum to avoid resource contention. The first phase should always be a quick win (highest `quickWin` score from system recommendations) to deliver visible value within 2 weeks. Dependencies between systems (e.g., data-intelligence should precede recommendation-engine) must be respected in phase ordering. The interactive frontend adjustment capability means the stored result has both `ai_results` (original generation) and `data` (user adjustments) — the onboarding workflow (050) uses the `data` field (adjusted version) if present, falling back to `ai_results`.

---

## Workflow Specification

### Step-by-Step Logic

| Step | Action                              | Condition                    | Details                                          |
| ---- | ----------------------------------- | ---------------------------- | ------------------------------------------------ |
| 1    | Collect inputs                      | Step 5 entered               | Selected systems, industry, company size         |
| 2    | Load system definitions             | Always                       | From `systems` table with dependencies           |
| 3    | Load readiness context              | Always                       | From step-4 ai_results                           |
| 4    | Call generate-roadmap agent         | Always                       | gemini-3.1-pro-preview with full context         |
| 5    | Validate roadmap structure          | Always                       | Ensure phases are ordered, deps respected         |
| 6    | Store AI-generated roadmap          | Always                       | wizard_answers.ai_results (step-5)               |
| 7    | Render roadmap visualization        | Frontend                     | Interactive timeline with phases                 |
| 8    | User adjustments                    | Optional                     | Reorder phases, extend timelines                 |
| 9    | Store adjusted roadmap              | If user made changes         | wizard_answers.data (step-5)                     |
| 10   | User clicks "Launch"               | User confirms                | Set wizard_completed_at, trigger 050             |

### System Dependency Map

```
Independent (can start first):
  support-engine
  content-engine
  booking-engine
  compliance-automation

Depends on data-intelligence:
  recommendation-engine
  sales-automation

Depends on support-engine:
  onboarding-system
  loyalty-system

Depends on growth-engine:
  cart-recovery

No dependencies:
  operations-autopilot
  data-intelligence
  growth-engine
```

---

## Agent Specification (generate-roadmap)

### System Prompt

```
You are an AI implementation strategist. Given a client's selected AI systems, readiness profile, and business context, produce a phased implementation roadmap.

SELECTED SYSTEMS: {selectedSystems}
SYSTEM DEPENDENCIES: {dependencyMap}
CLIENT READINESS SCORE: {overallScore} ({maturityLevel})
INDUSTRY: {industry}
COMPANY SIZE: {teamSizeEstimate}

RULES:
1. First phase MUST contain 1 quick-win system (deliverable in 2 weeks)
2. Each phase is 2-4 weeks long
3. Maximum 2 systems per phase
4. Respect system dependencies — dependent systems go in later phases
5. Total timeline should be realistic for company size (small = longer phases)
6. Each phase has 3-5 deliverables
7. Include risk factors and mitigation strategies per phase
8. For readiness score < 50, add a "Foundation" phase first (infra setup)

Output MUST be valid JSON matching the provided schema.
```

### Model Configuration

| Parameter        | Value                      |
| ---------------- | -------------------------- |
| Model            | `gemini-3.1-pro-preview`   |
| Temperature      | 0.25                       |
| Max Tokens       | 4096                       |
| Response Format  | JSON                       |
| Thinking Mode    | High                       |

---

## Input Schema

```typescript
interface RoadmapGenerationInput {
  sessionId: string;
  selectedSystems: string[];        // System IDs from step-3 user selection
  systemDefinitions: SystemDefinition[];  // Full system catalog with dependencies
  wizardContext: {
    companyProfile: BusinessAnalysisResult;     // Step 1
    diagnostics: IndustryDiagnosticsResult;     // Step 2
    recommendations: SystemRecommendationsResult; // Step 3 AI
    readinessScore: ReadinessScoreResult;       // Step 4
  };
}
```

---

## Output Schema

```typescript
interface RoadmapResult {
  title: string;                    // e.g., "AI Transformation Roadmap for Acme Corp"
  totalPhases: number;
  estimatedWeeks: number;
  phases: Array<{
    sequence: number;               // 1-based order
    title: string;                  // e.g., "Phase 1: Quick Win — AI Support"
    description: string;            // 2-3 sentences
    durationWeeks: number;          // 2-4
    systems: string[];              // System IDs in this phase
    deliverables: Array<{
      title: string;
      description: string;
      type: 'setup' | 'integration' | 'testing' | 'launch' | 'training';
    }>;
    risks: Array<{
      description: string;
      likelihood: 'high' | 'medium' | 'low';
      mitigation: string;
    }>;
    dependencies: string[];         // Phase sequences this depends on (e.g., [1])
    milestones: Array<{
      title: string;
      weekOffset: number;           // Weeks from phase start
    }>;
  }>;
  investmentSummary: {
    tier: 'starter' | 'growth' | 'enterprise';
    totalSystems: number;
    estimatedWeeks: number;
  };
  successMetrics: Array<{
    metric: string;
    baseline: string;
    target: string;
    measuredAt: string;             // "Phase 1 complete", "Week 8", etc.
  }>;
}
```

---

## Data Sources

| Source               | Table                   | Usage                                         |
| -------------------- | ----------------------- | --------------------------------------------- |
| Selected systems     | `wizard_answers` (step-3) | User's system choices                        |
| System catalog       | `systems`               | System definitions, dependencies, timelines   |
| Readiness score      | `wizard_answers` (step-4) | Readiness level affects timeline             |
| Company profile      | `wizard_answers` (step-1) | Company size, industry for calibration       |
| Diagnostics          | `wizard_answers` (step-2) | Pain points for deliverable prioritization   |

---

## Trigger Events

| Trigger                          | Source                              | Timing                       |
| -------------------------------- | ----------------------------------- | ---------------------------- |
| Enter Step 5                     | User navigates to Step 5            | Immediate — auto-generate    |
| Re-generate                      | User clicks "Regenerate" button     | On-demand                    |
| System selections changed        | User goes back to Step 3            | Invalidate cache on return   |

---

## Edge Cases

| Scenario                              | Handling                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------- |
| Only 1 system selected                | Single-phase roadmap with extended deliverables                          |
| 6+ systems selected                   | 4-5 phases; group related systems; extend timeline                       |
| All systems are independent           | Prioritize by fit score; parallelize where possible                      |
| Circular dependency detected          | Break cycle; log warning; place in same phase                            |
| Readiness score < 30                  | Prepend "Foundation" phase for infrastructure setup                      |
| Gemini timeout                        | Retry once; fall back to template-based roadmap using system dependencies |
| User removes all phases (edge case)   | Prevent — require minimum 1 phase to proceed                            |
| User extends timeline beyond 26 weeks | Allow but show warning about extended engagements                        |
| JSON parse error                      | Fall back to rule-based phase generation using dependency map            |
| Systems table has new entries          | Agent sees current catalog; no special handling needed                   |

---

## Database Operations

### Read: wizard_answers (all steps)

```sql
SELECT screen_id, question_key, data, ai_results FROM wizard_answers
WHERE session_id = $sessionId
ORDER BY screen_id;
```

### Read: systems catalog

```sql
SELECT s.*, json_agg(dep.depends_on_id) as dependencies
FROM systems s
LEFT JOIN system_dependencies dep ON dep.system_id = s.id
WHERE s.id = ANY($selectedSystemIds)
GROUP BY s.id;
```

### Write: wizard_answers (step-5 AI results)

```sql
INSERT INTO wizard_answers (session_id, screen_id, question_key, ai_results)
VALUES ($sessionId, 'step-5', 'roadmap', $aiResult)
ON CONFLICT (session_id, screen_id, question_key)
DO UPDATE SET ai_results = $aiResult, updated_at = now();
```

### Write: wizard_answers (step-5 user adjustments)

```sql
UPDATE wizard_answers
SET data = $adjustedRoadmap
WHERE session_id = $sessionId AND screen_id = 'step-5' AND question_key = 'roadmap';
```

### Write: wizard_sessions (completion)

```sql
UPDATE wizard_sessions
SET wizard_completed_at = now(), updated_at = now()
WHERE id = $sessionId;
```

---

## Outcomes

| Outcome                          | Metric                                | Target                 |
| -------------------------------- | ------------------------------------- | ---------------------- |
| Roadmap generation success       | Roadmaps generated without error      | > 98%                  |
| Response latency                 | P95 latency                           | < 12 seconds           |
| User adjustment rate             | Users who modify the roadmap          | 30-60% (healthy range) |
| Launch conversion                | Step 5 → "Launch" click              | > 60%                  |
| Phase count                      | Average phases per roadmap            | 3-5                    |
| Timeline realism                 | Actual delivery within 120% estimate  | > 70%                  |
| Dependency correctness           | Dependencies respected in ordering    | 100%                   |
| Quick win in Phase 1             | Phase 1 contains a quick-win system   | 100%                   |
