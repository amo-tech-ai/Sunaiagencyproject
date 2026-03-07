---
id: 049-workflow-lead-qualification
diagram_id: WORKFLOW-01
prd_section: Workflow Automation
title: Lead qualification workflow — from wizard start to qualified deal
skill: backend
phase: HIGH
priority: P1
status: Not Started
owner: Backend
dependencies:
  - 028-crm-pipeline-dashboard
estimated_effort: M
percent_complete: 0
area: agency-dashboard
schema_tables: [wizard_sessions, wizard_answers, crm_deals, crm_contacts, crm_stages, activities]
figma_prompt: prompts/049-workflow-lead-qualification.md
---

# 049 — Lead Qualification Workflow

## Summary Table

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| Workflow ID        | WORKFLOW-01                                                  |
| Name               | Lead Qualification Workflow                                  |
| Type               | Event-driven automation                                      |
| Trigger            | `wizard_sessions.created_at` (new session)                   |
| Scope              | Wizard start through CRM deal creation and scoring           |
| Tables Modified    | `crm_contacts`, `crm_deals`, `crm_stages`, `activities`     |
| AI Dependency      | Uses Step 1 `ai_results` for lead scoring                    |
| Dashboard Impact   | CRM pipeline board, notification bell                        |
| Priority           | P1 HIGH                                                      |

---

## Description

### 1. Purpose

The Lead Qualification Workflow automates the entire journey from a user starting the wizard to becoming a scored, qualified deal in the CRM pipeline. It eliminates manual lead entry, ensures every wizard interaction is captured, and applies AI-powered scoring to prioritize high-value prospects. The workflow creates CRM contacts, generates deals, scores leads based on readiness indicators, and auto-advances deals through pipeline stages based on qualification criteria.

### 2. User Context

From the agency perspective: when a new visitor starts the wizard, the agency team should see a new deal appear on their CRM pipeline dashboard in real-time. High-scoring leads should be flagged immediately so consultants can prioritize outreach. Abandoned wizards should be visible as "stalled leads" for follow-up campaigns. From the visitor perspective: this workflow is invisible — they experience a smooth wizard while the backend silently builds their CRM profile.

### 3. Technical Approach

The workflow is implemented as a series of database triggers and edge function hooks that fire at key wizard events. A Supabase Database Webhook on `wizard_sessions` INSERT triggers the initial contact/deal creation. Subsequent updates to `wizard_answers` trigger scoring updates. The lead score algorithm combines company size indicators, industry value, readiness indicators from Step 1 AI analysis, and wizard completion depth. Scores above thresholds trigger automatic stage transitions.

### 4. Data Flow

```
User starts wizard
    |
    v
wizard_sessions INSERT
    |
    +--> Extract email (from auth or form)
    +--> UPSERT crm_contacts
    +--> CREATE crm_deals (stage: 'New Lead')
    +--> LOG activities ('wizard_started')
    |
    v
User completes Step 1 (AI analysis runs)
    |
    +--> Load ai_results.readinessIndicators
    +--> Calculate lead score (0-100)
    +--> UPDATE crm_deals.metadata.lead_score
    |       |
    |       +--> Score > 70 --> Move to 'Qualified' stage
    |       +--> Score > 85 --> Move to 'Qualified' + flag 'Hot Lead' + notify owner
    |       +--> Score < 40 --> Tag as 'Nurture'
    |
    +--> LOG activities ('lead_scored')
    |
    v
Wizard abandoned (no activity for 30 min)
    |
    +--> UPDATE crm_deals.metadata.wizard_abandoned = true
    +--> Tag deal with last completed step
    +--> LOG activities ('wizard_abandoned')
```

### 5. Design Considerations

The workflow must be idempotent — if a user refreshes or re-enters the wizard, duplicate contacts and deals must not be created. The UPSERT on `crm_contacts` uses email as the unique key. The deal deduplication uses `wizard_sessions.id` as a reference. Lead scoring weights are configurable: company size (25%), industry tier (20%), readiness indicators (30%), wizard completion depth (25%). The "Hot Lead" notification uses the existing notification system and should appear within 10 seconds of threshold crossing.

---

## Workflow Specification

### Step-by-Step Logic

| Step | Event                          | Condition                    | Action                                          |
| ---- | ------------------------------ | ---------------------------- | ----------------------------------------------- |
| 1    | wizard_sessions INSERT         | Always                       | Create contact, create deal in 'New Lead' stage |
| 2    | wizard_answers INSERT (step-1) | ai_results present           | Score lead, update deal metadata                |
| 3    | Lead score calculated          | score > 70                   | Move deal to 'Qualified' stage                  |
| 4    | Lead score calculated          | score > 85                   | Flag 'Hot Lead', notify agency owner            |
| 5    | Lead score calculated          | score < 40                   | Tag deal as 'Nurture'                           |
| 6    | wizard_answers INSERT (step-2) | diagnostics complete         | Update deal with diagnostic context             |
| 7    | wizard_answers INSERT (step-3) | systems selected             | Update deal value estimate from investment tier |
| 8    | No activity for 30 minutes     | Session not completed        | Flag 'wizard_abandoned', log last step          |
| 9    | wizard_sessions.completed_at   | Wizard fully completed       | Move deal to 'Proposal' stage                   |

### Lead Scoring Algorithm

```typescript
function calculateLeadScore(profile: BusinessAnalysisResult, sessionData: WizardSessionData): number {
  let score = 0;

  // Company size (25%)
  const sizeMap = { '1-10': 10, '10-50': 15, '50-200': 20, '200+': 25 };
  score += sizeMap[profile.teamSizeEstimate] || 10;

  // Industry tier (20%)
  const highValueIndustries = ['healthcare', 'finance', 'ecommerce', 'saas'];
  score += highValueIndustries.includes(profile.detectedIndustry) ? 20 : 12;

  // Readiness indicators (30%)
  const readiness = profile.readinessIndicators;
  const readinessMap = { 'low': 5, 'medium': 15, 'high': 25, 'none': 0, 'basic': 5, 'moderate': 15, 'advanced': 25 };
  const readinessScore = (
    (readinessMap[readiness.digital_maturity] || 0) +
    (readinessMap[readiness.automation_level] || 0) +
    (readinessMap[readiness.data_readiness] || 0)
  ) / 3;
  score += Math.min(readinessScore, 30);

  // Wizard depth (25%)
  const depthMap = { 1: 5, 2: 10, 3: 18, 4: 22, 5: 25 };
  score += depthMap[sessionData.lastCompletedStep] || 0;

  return Math.min(Math.round(score), 100);
}
```

---

## Input Schema

```typescript
interface LeadQualificationInput {
  sessionId: string;          // wizard_sessions.id
  userId?: string;            // If authenticated
  email?: string;             // From form or auth
  wizardStep: number;         // Current step that triggered
  aiResults?: BusinessAnalysisResult; // Step 1 results (when available)
}
```

---

## Output Schema

```typescript
interface LeadQualificationResult {
  contactId: string;          // crm_contacts.id (created or existing)
  dealId: string;             // crm_deals.id
  leadScore: number;          // 0-100
  stage: string;              // Current CRM stage name
  tags: string[];             // Applied tags ('hot_lead', 'nurture', 'wizard_abandoned')
  notifications: Array<{
    type: string;
    recipient: string;
    message: string;
  }>;
}
```

---

## Data Sources

| Source               | Table                   | Usage                                       |
| -------------------- | ----------------------- | ------------------------------------------- |
| Wizard session       | `wizard_sessions`       | Session metadata, user reference             |
| Step 1 AI analysis   | `wizard_answers`        | Business profile for scoring                 |
| CRM pipeline         | `crm_pipelines`         | Default pipeline ID                          |
| CRM stages           | `crm_stages`            | Stage IDs for 'New Lead', 'Qualified', etc.  |
| Existing contacts    | `crm_contacts`          | Deduplication check                          |
| Team members         | `team_members`          | Agency owner for hot lead notifications      |

---

## Trigger Events

| Trigger                          | Source                          | Timing                       |
| -------------------------------- | ------------------------------- | ---------------------------- |
| New wizard session               | `wizard_sessions` INSERT        | Immediate                    |
| Step 1 complete                  | `wizard_answers` INSERT (step-1)| After AI analysis completes  |
| Step 2-4 complete                | `wizard_answers` INSERT         | After each step              |
| Wizard completed                 | `wizard_sessions` UPDATE        | When `completed_at` set      |
| Wizard abandoned                 | Cron job (every 30 min)         | Check for stale sessions     |

---

## Edge Cases

| Scenario                              | Handling                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------- |
| User has no email (anonymous)         | Create deal with session_id reference; update contact when email provided |
| Duplicate email in crm_contacts       | UPSERT — update existing contact, link new session                        |
| Multiple wizard sessions same user    | Each session creates a new deal; contacts are deduplicated                 |
| Lead score changes between steps      | Always update to latest score; log score history in deal metadata         |
| CRM pipeline not configured           | Use default pipeline; create one if none exists                          |
| Hot lead notification fails           | Log failure; retry once; do not block deal creation                      |
| Wizard session with no steps complete | Deal stays in 'New Lead' with minimal metadata                           |
| User completes wizard in < 2 minutes  | Flag for review — possible bot or test submission                        |
| Agency has no team members            | Skip notification; log warning                                           |

---

## Database Operations

### UPSERT: crm_contacts

```sql
INSERT INTO crm_contacts (email, name, company, source, metadata, created_at)
VALUES ($email, $name, $company, 'wizard', $metadata, now())
ON CONFLICT (email)
DO UPDATE SET
  company = COALESCE($company, crm_contacts.company),
  metadata = crm_contacts.metadata || $metadata,
  updated_at = now()
RETURNING id;
```

### INSERT: crm_deals

```sql
INSERT INTO crm_deals (contact_id, pipeline_id, stage_id, title, value, metadata, created_at)
VALUES ($contactId, $pipelineId, $newLeadStageId, $dealTitle, null, $metadata, now())
RETURNING id;
```

### UPDATE: crm_deals (stage transition)

```sql
UPDATE crm_deals
SET stage_id = $newStageId, metadata = metadata || $scoreData, updated_at = now()
WHERE id = $dealId;
```

### INSERT: activities

```sql
INSERT INTO activities (entity_type, entity_id, action, data, created_at)
VALUES ('deal', $dealId, $action, $eventData, now());
```

---

## Outcomes

| Outcome                          | Metric                                | Target                 |
| -------------------------------- | ------------------------------------- | ---------------------- |
| Lead capture rate                | Wizard sessions with CRM deals        | 100%                   |
| Scoring accuracy                 | Qualified leads that convert          | > 50%                  |
| Hot lead response time           | Time from flag to consultant contact  | < 2 hours              |
| Abandoned wizard follow-up       | Abandoned leads with follow-up action | > 80%                  |
| Deal deduplication               | Duplicate deals per contact           | 0 (per session)        |
| Stage transition accuracy        | Deals in correct stage                | > 95%                  |
| Notification delivery            | Hot lead notifications delivered      | > 99%                  |
