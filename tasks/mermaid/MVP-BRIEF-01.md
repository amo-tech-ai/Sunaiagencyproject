---
id: MVP-BRIEF-01
phase: MVP
prd_section: Brief Approval Workflow
title: Brief Approval Workflow
type: stateDiagram
---

# Brief Approval Workflow

Two diagrams: (1) state machine for brief status transitions with versioning,
and (2) the brief generation sequence showing 3 parallel AI agents.

## Brief Status State Machine

```mermaid
---
config:
  theme: forest
  themeVariables:
    primaryColor: "#0A211F"
    primaryTextColor: "#F1EEEA"
    primaryBorderColor: "#84CC16"
    lineColor: "#84CC16"
---
stateDiagram-v2
    direction LR

    [*] --> draft : AI generates brief (3 agents)

    state draft {
        direction TB
        [*] --> v1 : Initial generation
        v1 --> v2 : User inline edit (snapshot saved)
        v2 --> v3 : User inline edit (snapshot saved)
        v3 --> vN : Additional edits...

        note right of v1
            Each version stored in
            brief_versions table.
            brief_versions.version_number++
            brief_versions.content = section snapshot
        end note
    }

    draft --> in_review : User clicks Request Changes
    in_review --> draft : Changes addressed / further edits

    draft --> approved : User clicks Approve Brief
    in_review --> approved : User clicks Approve Brief

    approved --> ProjectCreation : User clicks Continue (Step 5)

    state ProjectCreation {
        direction TB
        [*] --> CreateProject
        CreateProject --> SaveSnapshot
        SaveSnapshot --> BuildRoadmap
        BuildRoadmap --> GenerateTasks
        GenerateTasks --> SetupServices
        SetupServices --> [*]
    }

    ProjectCreation --> [*] : Dashboard ready

    note right of draft
        Status: draft
        User can edit any section inline.
        Each edit creates a new version.
        Brief content stored in briefs.content (JSONB).
    end note

    note right of in_review
        Status: in_review
        Brief is flagged for review.
        Can return to draft for edits
        or be approved directly.
    end note

    note right of approved
        Status: approved
        No further edits allowed.
        Continue button enabled.
        Triggers project creation at Step 5.
    end note
```

## Brief Generation Sequence (3 Parallel AI Agents)

```mermaid
---
config:
  theme: forest
  themeVariables:
    actorBkg: "#0A211F"
    actorTextColor: "#F1EEEA"
    actorBorder: "#84CC16"
    signalColor: "#0A211F"
    noteBkgColor: "#F1EEEA"
    noteTextColor: "#0A211F"
    noteBorderColor: "#84CC16"
    activationBkgColor: "#84CC16"
    activationBorderColor: "#0A211F"
---
sequenceDiagram
    autonumber

    participant UI as WizardUI (Step 4)
    participant Cache as ai_cache
    participant Scorer as scorer Agent<br/>(Pro, Thinking high)
    participant Summary as summary Agent<br/>(Pro, Thinking high)
    participant Roadmap as generate-roadmap Agent<br/>(Pro, Thinking high)
    participant DB as Supabase DB

    %% ============================================================
    %% DATA LOADING
    %% ============================================================
    Note over UI,DB: Step 4 loads - Brief Generation begins

    UI->>+Cache: Fetch wizard context (Steps 1-3 data)
    Cache-->>-UI: Business analysis, diagnostics, recommendations

    %% ============================================================
    %% PARALLEL AGENT EXECUTION
    %% ============================================================
    par Scorer Agent
        UI->>+Scorer: Generate readiness score
        Note right of Scorer: Input: all wizard data + ai_cache<br/>Model: Gemini Pro<br/>Thinking: high
        Scorer->>Scorer: Evaluate business readiness
        Scorer->>Scorer: Score 8 dimensions (0-100 each)
        Scorer->>Scorer: Calculate overall score (weighted avg)
        Scorer-->>-UI: Readiness Score 0-100 + dimension breakdown
    and Summary Agent
        UI->>+Summary: Generate executive narrative
        Note right of Summary: Input: all wizard data + ai_cache<br/>Model: Gemini Pro<br/>Thinking: high
        Summary->>Summary: Synthesize business context
        Summary->>Summary: Write executive summary
        Summary->>Summary: Write business analysis section
        Summary->>Summary: Write diagnostic findings
        Summary->>Summary: Write expected outcomes
        Summary-->>-UI: Executive narrative sections
    and Roadmap Agent
        UI->>+Roadmap: Generate implementation roadmap
        Note right of Roadmap: Input: selected systems + ai_cache<br/>Model: Gemini Pro<br/>Thinking: high
        Roadmap->>Roadmap: Design 3-phase plan
        Roadmap->>Roadmap: Define milestones per phase
        Roadmap->>Roadmap: Break down tasks per milestone
        Roadmap->>Roadmap: Set KPIs per phase
        Roadmap-->>-UI: 3-phase plan (milestones, tasks, KPIs)
    end

    %% ============================================================
    %% BRIEF ASSEMBLY
    %% ============================================================
    Note over UI,DB: Assemble Brief Document

    UI->>UI: Assemble sections into brief document

    Note right of UI: Document Sections:<br/>1. Executive Summary (from summary)<br/>2. Business Analysis (from summary)<br/>3. Diagnostic Findings (from summary)<br/>4. Recommended Systems (from Step 3 selections)<br/>5. Implementation Roadmap (from roadmap)<br/>6. Expected Outcomes (from summary)<br/>7. Readiness Score (from scorer)

    UI->>+DB: INSERT INTO briefs (content JSONB, status=draft, version=1)
    DB-->>-UI: Brief created

    UI->>+DB: INSERT INTO brief_versions (brief_id, version=1, content snapshot)
    DB-->>-UI: Version 1 saved

    UI-->>UI: Render brief with inline-editable sections

    %% ============================================================
    %% INLINE EDITING CYCLE
    %% ============================================================
    Note over UI,DB: User Inline Editing

    loop Each section edit
        UI->>UI: User modifies section text inline
        UI->>+DB: INSERT INTO brief_versions (version=N+1, content snapshot)
        DB-->>-UI: Version N+1 saved
        UI->>+DB: UPDATE briefs SET content = updated JSONB
        DB-->>-UI: Brief updated (stays in draft)
    end

    %% ============================================================
    %% APPROVAL
    %% ============================================================
    Note over UI,DB: Approval Flow

    alt User approves directly
        UI->>+DB: UPDATE briefs SET status = approved
        DB-->>-UI: Brief approved
    else User requests changes first
        UI->>+DB: UPDATE briefs SET status = in_review
        DB-->>-UI: Status: in_review
        Note over UI: Further edits happen...
        UI->>+DB: UPDATE briefs SET status = approved
        DB-->>-UI: Brief approved
    end

    UI-->>UI: Enable Continue button
    Note over UI: User clicks Continue -> Step 5 (Project Launch)
```

## Readiness Score Dimensions

```mermaid
---
config:
  theme: forest
---
flowchart LR
    subgraph scorer["Scorer Agent Output"]
        direction TB
        overall["Overall Readiness Score<br/>(0-100, weighted average)"]

        subgraph dimensions["8 Scored Dimensions"]
            direction TB
            d1["Strategic Alignment"]
            d2["Technical Readiness"]
            d3["Organizational Capacity"]
            d4["Budget Feasibility"]
            d5["Timeline Realism"]
            d6["Data Maturity"]
            d7["Change Management"]
            d8["ROI Potential"]
        end

        overall --- dimensions
    end

    subgraph output["Brief Section"]
        direction TB
        score_display["Readiness Score: 78/100"]
        breakdown["Dimension Breakdown<br/>(radar chart data)"]
        recs["Score-based Recommendations"]
    end

    scorer --> output

    style scorer fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    style dimensions fill:#F1EEEA,stroke:#0A211F,stroke-width:1px,color:#0A211F
    style output fill:#F1EEEA,stroke:#84CC16,stroke-width:2px,color:#0A211F

    classDef dim fill:#84CC16,stroke:#0A211F,color:#0A211F,stroke-width:1px
    class d1,d2,d3,d4,d5,d6,d7,d8 dim
```
