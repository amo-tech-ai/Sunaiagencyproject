# AI Agent & Edge Function Flow Diagrams

## Wizard AI Agent Architecture

```mermaid
flowchart TD
    subgraph Wizard["Wizard Frontend"]
        S2[Step 2 Complete]
        S3[Step 3 Load]
        S4[Step 4 Load]
        S5[Step 5 Trigger]
    end

    subgraph EdgeFunctions["Supabase Edge Functions"]
        WA[wizard-analyze]
        WR[wizard-recommend]
        WB[wizard-brief]
        WP[wizard-project]
    end

    subgraph Gemini["Gemini AI"]
        Flash[gemini-3-flash-preview]
        Pro[gemini-3.1-pro-preview]
    end

    subgraph Data["Supabase Tables"]
        Answers[wizard_answers]
        Cache[ai_cache]
        Systems[systems catalog]
        Brief[briefs]
        Project[projects + roadmaps + tasks]
    end

    S2 -->|POST| WA
    WA -->|Read answers| Answers
    WA -->|Analyze with thinkingLevel: high| Flash
    Flash -->|Structured JSON| WA
    WA -->|Cache results| Cache

    S3 -->|Load from cache| Cache

    S4 -->|POST| WB
    WB -->|Read answers + systems| Answers
    WB -->|Read selected| Systems
    WB -->|Generate brief with thinkingLevel: high| Pro
    Pro -->|Executive brief JSON| WB
    WB -->|Save| Brief

    S5 -->|POST| WP
    WP -->|Read brief + systems| Brief
    WP -->|Generate roadmap + tasks| Flash
    Flash -->|Phased plan JSON| WP
    WP -->|Create all records| Project

    style Flash fill:#84CC16,stroke:#0A211F
    style Pro fill:#84CC16,stroke:#0A211F
```

## AI Analysis Edge Function (Step 2 → Step 3)

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant EF as wizard-analyze
    participant DB as Supabase DB
    participant GM as Gemini Flash
    participant AC as ai_cache

    FE->>EF: POST /wizard-analyze (session_id)

    EF->>EF: Validate JWT

    EF->>DB: SELECT wizard_answers WHERE session_id
    DB-->>EF: Step 1 + Step 2 data

    EF->>EF: Build prompt hash
    EF->>AC: CHECK cache by hash

    alt Cache Hit
        AC-->>EF: Cached recommendations
        EF-->>FE: 200 OK (cached)
    else Cache Miss
        EF->>DB: SELECT * FROM systems WHERE is_active
        DB-->>EF: System catalog

        EF->>GM: Analyze business context
        Note right of GM: Model: gemini-3-flash-preview
        Note right of GM: thinkingLevel: high
        Note right of GM: responseJsonSchema: recommendations
        Note right of GM: temperature: 1.0 (default)

        GM-->>EF: Structured JSON recommendations

        EF->>EF: Validate with Zod schema
        EF->>AC: INSERT ai_cache (hash, response, model, tokens)
        EF->>DB: INSERT ai_run_logs
        EF-->>FE: 200 OK (fresh)
    end
```

## Brief Generation Edge Function (Step 4)

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant EF as wizard-brief
    participant DB as Supabase DB
    participant GM as Gemini Pro

    FE->>EF: POST /wizard-brief (session_id)
    EF->>EF: Validate JWT

    EF->>DB: SELECT wizard_answers (all steps)
    DB-->>EF: Business context + diagnostics + selections

    EF->>DB: SELECT project_systems WHERE is_selected
    DB-->>EF: Selected systems with reasoning

    EF->>DB: SELECT documents WHERE wizard_session_id
    DB-->>EF: Uploaded document summaries

    EF->>EF: Compose system prompt + context

    EF->>GM: Generate executive brief
    Note right of GM: Model: gemini-3.1-pro-preview
    Note right of GM: thinkingLevel: high
    Note right of GM: Complex reasoning for quality brief
    Note right of GM: responseJsonSchema: brief_schema

    GM-->>EF: Brief content JSON

    EF->>EF: Validate with Zod
    EF->>DB: INSERT briefs (status=draft, version=1)
    EF->>DB: INSERT brief_versions (version=1)
    EF->>DB: INSERT ai_run_logs
    EF-->>FE: 200 OK (brief_id, content)
```

## Project Creation Edge Function (Step 5)

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant EF as wizard-project
    participant DB as Supabase DB
    participant GM as Gemini Flash

    FE->>EF: POST /wizard-project (session_id, brief_id)
    EF->>EF: Validate JWT

    EF->>DB: SELECT brief content + selected systems
    DB-->>EF: Brief + systems data

    Note over EF: Create project record
    EF->>DB: INSERT projects (status=Active)
    DB-->>EF: project_id

    Note over EF: Create context snapshot
    EF->>DB: INSERT context_snapshots (is_active=true)
    DB-->>EF: snapshot_id

    Note over EF: Generate roadmap with AI
    EF->>GM: Generate phased roadmap + tasks
    Note right of GM: Model: gemini-3-flash-preview
    Note right of GM: thinkingLevel: medium
    Note right of GM: responseJsonSchema: roadmap_schema
    GM-->>EF: Roadmap JSON (phases + tasks)

    EF->>EF: Validate with Zod

    Note over EF: Create roadmap records
    EF->>DB: INSERT roadmaps (snapshot_id)
    DB-->>EF: roadmap_id

    loop For each phase (1-3)
        EF->>DB: INSERT roadmap_phases
        DB-->>EF: phase_id

        loop For each task in phase
            EF->>DB: INSERT tasks (ai_generated=true)
        end

        EF->>DB: INSERT milestones (phase milestone)
    end

    Note over EF: Link services
    EF->>DB: INSERT project_services (from selected systems)

    Note over EF: Mark complete
    EF->>DB: UPDATE wizard_sessions (wizard_completed_at=now)
    EF->>DB: UPDATE projects (dashboard_activated_at=now)
    EF->>DB: INSERT ai_run_logs

    EF-->>FE: 200 OK (project_id, dashboard_url)
```

## AI Model Selection Strategy

```mermaid
flowchart LR
    subgraph Tasks["Wizard AI Tasks"]
        T1[Analyze Business Context]
        T2[Generate Recommendations]
        T3[Generate Brief]
        T4[Generate Roadmap]
        T5[Generate Tasks]
        T6[Document Summarization]
    end

    subgraph Models["Gemini Models"]
        Flash[gemini-3-flash-preview<br/>Fast, cost-effective]
        Pro[gemini-3.1-pro-preview<br/>Complex reasoning]
        Image[gemini-3.1-flash-image-preview<br/>Image generation]
    end

    T1 -->|thinkingLevel: high| Flash
    T2 -->|thinkingLevel: medium| Flash
    T3 -->|thinkingLevel: high| Pro
    T4 -->|thinkingLevel: medium| Flash
    T5 -->|thinkingLevel: low| Flash
    T6 -->|thinkingLevel: low| Flash

    style Flash fill:#84CC16,stroke:#0A211F
    style Pro fill:#0A211F,color:#fff,stroke:#84CC16
    style Image fill:#F59E0B,stroke:#0A211F
```
