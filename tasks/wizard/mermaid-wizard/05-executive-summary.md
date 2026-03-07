# Step 4 - Executive Summary

AI generates a full strategy brief rendered as a premium document.

**Sections:** Executive Summary, Company Profile, Industry Analysis, Recommended Systems, Proposed Roadmap (3 phases), Expected Outcomes, Next Steps.

**Features:**
- Inline editing on each section (pencil icon -> edit mode -> auto-save)
- Versioning: each edit creates a new `brief_versions` snapshot
- Right panel: table of contents, document actions (PDF/Print/Share), version history
- Approval flow: user can "Request Changes" (status -> in_review) or "Approve Brief" (status -> approved)
- Continue only active after approval

---

## 1. Brief Generation Flow

Flowchart: arrive at step-4 -> load wizard data -> check for existing brief -> if exists: display -> if not: trigger Edge Function -> generate structured JSONB -> create briefs row -> create brief_versions -> display.

```mermaid
%%{init: {'theme': 'forest'}}%%
flowchart TD
    A[Arrive at Step 4] --> B[Load Wizard Session Data]
    B --> C{Existing Brief?}

    C -->|Yes| D[Load Brief from DB]
    C -->|No| E[Trigger generate-brief Edge Function]

    E --> F[Gather wizard_sessions + goals + services + industry data]
    F --> G[AI generates structured JSONB content]
    G --> H[Create briefs row<br/>status: draft]
    H --> I[Create initial brief_versions snapshot<br/>version: 1]
    I --> J[Return brief to client]

    D --> K[Load latest brief_versions]
    J --> K

    K --> L[Render premium document layout]
    L --> M[Populate right panel:<br/>TOC / Actions / Version History]
    M --> N[Display Executive Summary]

    N --> O{Brief Status?}
    O -->|draft| P[Show Edit + Approval Controls]
    O -->|in_review| Q[Show Edit + Approval Controls]
    O -->|approved| R[Enable Continue Button]

    style A fill:#2d6a4f,color:#fff
    style E fill:#40916c,color:#fff
    style G fill:#40916c,color:#fff
    style H fill:#52b788,color:#000
    style I fill:#52b788,color:#000
    style N fill:#2d6a4f,color:#fff
    style R fill:#84cc16,color:#000
```

---

## 2. Brief Approval State Machine

State diagram: draft -> [edit] -> draft (new version) -> [request changes] -> in_review -> [edit] -> draft -> [approve] -> approved -> continue enabled.

```mermaid
%%{init: {'theme': 'forest'}}%%
stateDiagram-v2
    [*] --> draft : Brief generated

    draft --> draft : Edit section\n(new version created)
    draft --> in_review : Request Changes
    draft --> approved : Approve Brief

    in_review --> draft : Edit section\n(new version created)
    in_review --> approved : Approve Brief

    approved --> continue_enabled : Continue button activated
    continue_enabled --> [*] : Navigate to Step 5

    note right of draft
        User can freely edit sections.
        Each edit increments version
        and creates brief_versions snapshot.
    end note

    note right of in_review
        Signals brief needs revisions.
        User or team can still edit,
        which moves status back to draft.
    end note

    note right of approved
        Brief is locked for editing.
        Continue button becomes active.
        Version history preserved.
    end note
```

---

## 3. Inline Editing Sequence

Sequence diagram: User clicks edit -> section enters edit mode -> user types -> debounce 500ms -> update briefs.content -> increment version -> create brief_versions snapshot -> update version history panel.

```mermaid
%%{init: {'theme': 'forest'}}%%
sequenceDiagram
    actor User
    participant UI as Brief Document UI
    participant State as Local State
    participant Debounce as Debounce Timer (500ms)
    participant API as Supabase Client
    participant DB as Database

    User->>UI: Click pencil icon on section
    UI->>State: Set sectionEditMode = true
    UI-->>User: Show editable textarea with current content

    loop User typing
        User->>UI: Type changes
        UI->>State: Update local content buffer
        State->>Debounce: Reset 500ms timer
    end

    Note over Debounce: 500ms elapsed since last keystroke

    Debounce->>API: PATCH briefs.content (JSONB merge)
    API->>DB: UPDATE briefs SET content = jsonb_set(...),<br/>version = version + 1,<br/>updated_at = now()

    DB-->>API: Return updated brief (new version number)

    API->>DB: INSERT INTO brief_versions<br/>(brief_id, version, content_snapshot, edited_section)
    DB-->>API: Return brief_versions row

    API-->>State: Update local brief state
    State-->>UI: Re-render version badge
    UI-->>User: Show save confirmation (checkmark)

    UI->>UI: Update right panel version history
    UI-->>User: New version entry appears in history

    Note over User,DB: If brief status was "approved",<br/>status reverts to "draft" on edit
```

---

## 4. Brief Document Structure

Class diagram showing the brief sections and their data sources (which wizard step feeds each section).

```mermaid
%%{init: {'theme': 'forest'}}%%
classDiagram
    class Brief {
        +UUID id
        +UUID wizard_session_id
        +JSONB content
        +String status
        +Int version
        +Timestamp created_at
        +Timestamp updated_at
    }

    class ExecutiveSummary {
        +String overview
        +String[] key_recommendations
        +String vision_statement
        <<from: All Steps>>
    }

    class CompanyProfile {
        +String company_name
        +String industry
        +String company_size
        +String current_tech_stack
        +String[] pain_points
        <<from: Step 1 - Tell Us About You>>
    }

    class IndustryAnalysis {
        +String industry_overview
        +String[] market_trends
        +String[] competitor_insights
        +String[] ai_adoption_benchmarks
        <<from: Step 1 + AI Enhancement>>
    }

    class RecommendedSystems {
        +SystemRecommendation[] systems
        +String[] integration_notes
        +String[] tech_requirements
        <<from: Step 2 - Choose Your Goals>>
    }

    class ProposedRoadmap {
        +Phase phase_1_foundation
        +Phase phase_2_expansion
        +Phase phase_3_optimization
        +String total_timeline
        <<from: Step 2 + Step 3>>
    }

    class ExpectedOutcomes {
        +Metric[] projected_metrics
        +String[] efficiency_gains
        +String roi_estimate
        +String[] risk_factors
        <<from: Step 3 - Select Services>>
    }

    class NextSteps {
        +String[] immediate_actions
        +String[] resource_requirements
        +String kickoff_timeline
        +String[] stakeholder_actions
        <<from: All Steps + AI>>
    }

    class Phase {
        +String name
        +String duration
        +String[] deliverables
        +String[] milestones
    }

    class SystemRecommendation {
        +String system_name
        +String category
        +String description
        +String[] benefits
        +String priority
    }

    class Metric {
        +String metric_name
        +String current_value
        +String projected_value
        +String timeframe
    }

    Brief --> ExecutiveSummary : content.executive_summary
    Brief --> CompanyProfile : content.company_profile
    Brief --> IndustryAnalysis : content.industry_analysis
    Brief --> RecommendedSystems : content.recommended_systems
    Brief --> ProposedRoadmap : content.proposed_roadmap
    Brief --> ExpectedOutcomes : content.expected_outcomes
    Brief --> NextSteps : content.next_steps

    ProposedRoadmap --> Phase : phases
    RecommendedSystems --> SystemRecommendation : systems
    ExpectedOutcomes --> Metric : metrics
```
