# Step 5 - Launch Project

Final confirmation screen. Breaks from three-panel layout to centered single-column. Project creation happens in background.

**Behavior:**
- Verifies brief is approved (redirects back to step-4 if not)
- Creates: project, context_snapshots, roadmaps, roadmap_phases (3), tasks (12 AI-generated), project_services
- Updates wizard_sessions.wizard_completed_at
- Shows: project summary card, roadmap preview (3 phases), checklist with staggered animation, dashboard preview cards
- CTA: "Enter Your Dashboard" -> /app/dashboard/{project_id}

---

## 1. Project Creation Flow

Flowchart: verify brief approved -> create project -> create context_snapshot -> create roadmap -> create 3 phases -> AI-generate tasks -> create project_services -> update wizard_sessions -> display confirmation.

```mermaid
%%{init: {'theme': 'forest'}}%%
flowchart TD
    A[Arrive at Step 5] --> B{Brief Approved?}

    B -->|No| C[Redirect to Step 4]
    B -->|Yes| D[Call launch-project Edge Function]

    D --> E[Create projects row<br/>status: active]
    E --> F[Create context_snapshots<br/>from wizard session data]
    F --> G[Create roadmaps row<br/>linked to project]
    G --> H[Create roadmap_phases]

    H --> H1[Phase 1: Foundation<br/>weeks 1-4]
    H --> H2[Phase 2: Expansion<br/>weeks 5-8]
    H --> H3[Phase 3: Optimization<br/>weeks 9-12]

    H1 --> I[AI-generate 12 tasks<br/>distributed across phases]
    H2 --> I
    H3 --> I

    I --> I1[4 tasks -> Phase 1]
    I --> I2[4 tasks -> Phase 2]
    I --> I3[4 tasks -> Phase 3]

    I1 --> J[Create project_services<br/>from selected services]
    I2 --> J
    I3 --> J

    J --> K[UPDATE wizard_sessions<br/>SET wizard_completed_at = now]
    K --> L[Return complete project payload]

    L --> M[Display Confirmation Screen]
    M --> N[Animate checklist items<br/>staggered 200ms delay]
    N --> O[Show project summary card]
    O --> P[Show roadmap preview]
    P --> Q[Show dashboard preview cards]
    Q --> R[Activate CTA:<br/>Enter Your Dashboard]

    R --> S[Navigate to<br/>/app/dashboard/project_id]

    style A fill:#2d6a4f,color:#fff
    style B fill:#40916c,color:#fff
    style C fill:#d32f2f,color:#fff
    style E fill:#52b788,color:#000
    style F fill:#52b788,color:#000
    style G fill:#52b788,color:#000
    style H1 fill:#74c69d,color:#000
    style H2 fill:#74c69d,color:#000
    style H3 fill:#74c69d,color:#000
    style I fill:#40916c,color:#fff
    style K fill:#52b788,color:#000
    style R fill:#84cc16,color:#000
    style S fill:#2d6a4f,color:#fff
```

---

## 2. Project Creation Sequence

Sequence diagram: User arrives -> verify brief -> Edge Function -> create project row -> create snapshot -> create roadmap -> create phases -> generate tasks -> create services -> return confirmation -> animate checklist.

```mermaid
%%{init: {'theme': 'forest'}}%%
sequenceDiagram
    actor User
    participant UI as Step 5 UI
    participant Client as Supabase Client
    participant Edge as launch-project Edge Function
    participant AI as AI Task Generator
    participant DB as Database

    User->>UI: Navigate to Step 5
    UI->>Client: Fetch brief status for session

    Client->>DB: SELECT status FROM briefs<br/>WHERE wizard_session_id = ?
    DB-->>Client: Return brief status

    alt Brief NOT approved
        Client-->>UI: status != approved
        UI-->>User: Redirect to Step 4
    end

    Client-->>UI: status = approved
    UI->>UI: Show loading state<br/>(centered single-column layout)

    UI->>Edge: POST /launch-project<br/>{wizard_session_id, brief_id}

    Note over Edge,DB: Begin transaction

    Edge->>DB: INSERT INTO projects<br/>(name, org_id, status: active)
    DB-->>Edge: Return project {id}

    Edge->>DB: INSERT INTO context_snapshots<br/>(project_id, wizard_data, brief_content)
    DB-->>Edge: Return snapshot {id}

    Edge->>DB: INSERT INTO roadmaps<br/>(project_id, title, total_duration)
    DB-->>Edge: Return roadmap {id}

    par Create 3 phases
        Edge->>DB: INSERT INTO roadmap_phases<br/>(roadmap_id, phase: 1, name: Foundation,<br/>start_week: 1, end_week: 4)
        Edge->>DB: INSERT INTO roadmap_phases<br/>(roadmap_id, phase: 2, name: Expansion,<br/>start_week: 5, end_week: 8)
        Edge->>DB: INSERT INTO roadmap_phases<br/>(roadmap_id, phase: 3, name: Optimization,<br/>start_week: 9, end_week: 12)
    end

    DB-->>Edge: Return phase IDs [p1, p2, p3]

    Edge->>AI: Generate 12 tasks from brief content<br/>+ selected services + goals
    AI-->>Edge: Return 12 structured tasks

    loop For each task (12 total)
        Edge->>DB: INSERT INTO tasks<br/>(project_id, phase_id, title,<br/>description, priority, status: pending)
    end

    DB-->>Edge: Return 12 task IDs

    Edge->>DB: INSERT INTO project_services<br/>(project_id, service_id) for each selected service
    DB-->>Edge: Return project_services rows

    Edge->>DB: UPDATE wizard_sessions<br/>SET wizard_completed_at = now()<br/>WHERE id = ?
    DB-->>Edge: Confirm update

    Note over Edge,DB: Commit transaction

    Edge-->>UI: Return full project payload<br/>{project, roadmap, phases, tasks, services}

    UI->>UI: Render confirmation screen

    loop Staggered animation (200ms delay each)
        UI-->>User: Animate checklist item 1 (Project created)
        UI-->>User: Animate checklist item 2 (Roadmap built)
        UI-->>User: Animate checklist item 3 (Tasks generated)
        UI-->>User: Animate checklist item 4 (Services linked)
        UI-->>User: Animate checklist item 5 (Dashboard ready)
    end

    UI-->>User: Show project summary card
    UI-->>User: Show roadmap preview (3 phases)
    UI-->>User: Show dashboard preview cards
    UI-->>User: Activate "Enter Your Dashboard" CTA

    User->>UI: Click "Enter Your Dashboard"
    UI->>UI: Navigate to /app/dashboard/{project_id}
```

---

## 3. Project Data ERD

ERD showing all tables created during project launch: projects, context_snapshots, roadmaps, roadmap_phases, tasks, project_services, briefs -- and their relationships.

```mermaid
%%{init: {'theme': 'forest'}}%%
erDiagram
    wizard_sessions {
        uuid id PK
        uuid user_id FK
        string current_step
        jsonb session_data
        timestamp wizard_completed_at
        timestamp created_at
    }

    briefs {
        uuid id PK
        uuid wizard_session_id FK
        jsonb content
        string status "draft | in_review | approved"
        int version
        timestamp created_at
        timestamp updated_at
    }

    brief_versions {
        uuid id PK
        uuid brief_id FK
        int version
        jsonb content_snapshot
        string edited_section
        timestamp created_at
    }

    projects {
        uuid id PK
        uuid org_id FK
        string name
        string status "active | paused | completed"
        uuid brief_id FK
        timestamp created_at
        timestamp updated_at
    }

    context_snapshots {
        uuid id PK
        uuid project_id FK
        jsonb wizard_data
        jsonb brief_content
        jsonb goals
        jsonb selected_services
        timestamp created_at
    }

    roadmaps {
        uuid id PK
        uuid project_id FK
        string title
        string total_duration
        timestamp created_at
    }

    roadmap_phases {
        uuid id PK
        uuid roadmap_id FK
        int phase_number
        string name "Foundation | Expansion | Optimization"
        int start_week
        int end_week
        string status
    }

    tasks {
        uuid id PK
        uuid project_id FK
        uuid phase_id FK
        string title
        text description
        string priority "high | medium | low"
        string status "pending | in_progress | done"
        int sort_order
        timestamp created_at
    }

    project_services {
        uuid id PK
        uuid project_id FK
        uuid service_id FK
        timestamp created_at
    }

    services {
        uuid id PK
        string name
        string category
        text description
    }

    wizard_sessions ||--o| briefs : "generates"
    briefs ||--o{ brief_versions : "has versions"
    briefs ||--o| projects : "launches"
    projects ||--|| context_snapshots : "has snapshot"
    projects ||--|| roadmaps : "has roadmap"
    roadmaps ||--|{ roadmap_phases : "contains phases"
    roadmap_phases ||--o{ tasks : "contains tasks"
    projects ||--o{ tasks : "has tasks"
    projects ||--o{ project_services : "uses services"
    project_services }o--|| services : "references"
```

---

## 4. Dashboard Transition

Flowchart: wizard complete -> "Enter Dashboard" click -> navigate to /app/dashboard/{id} -> first-time onboarding tooltips.

```mermaid
%%{init: {'theme': 'forest'}}%%
flowchart TD
    A[Wizard Complete<br/>Step 5 Confirmation] --> B[User clicks<br/>Enter Your Dashboard]

    B --> C[Navigate to<br/>/app/dashboard/project_id]
    C --> D{First-time user?}

    D -->|Yes| E[Initialize onboarding state<br/>onboarding_step = 1]
    D -->|No| F[Load dashboard normally]

    E --> G[Load dashboard with<br/>onboarding overlay]

    G --> T1[Tooltip 1: Project Overview<br/>Your project summary lives here]
    T1 -->|Next| T2[Tooltip 2: Roadmap<br/>Track your 3-phase roadmap]
    T2 -->|Next| T3[Tooltip 3: Tasks<br/>12 tasks ready for your team]
    T3 -->|Next| T4[Tooltip 4: Services<br/>Your active AI services]
    T4 -->|Next| T5[Tooltip 5: Brief<br/>Access your approved brief anytime]
    T5 -->|Done| H[Mark onboarding complete<br/>UPDATE user_preferences]

    H --> F

    F --> I[Dashboard Loaded]

    I --> I1[Project Summary Card]
    I --> I2[Roadmap Timeline View]
    I --> I3[Task Board<br/>Kanban or List]
    I --> I4[Active Services Panel]
    I --> I5[Brief Quick Access]
    I --> I6[Team Activity Feed]

    style A fill:#2d6a4f,color:#fff
    style B fill:#84cc16,color:#000
    style C fill:#40916c,color:#fff
    style E fill:#52b788,color:#000
    style G fill:#74c69d,color:#000
    style T1 fill:#95d5b2,color:#000
    style T2 fill:#95d5b2,color:#000
    style T3 fill:#95d5b2,color:#000
    style T4 fill:#95d5b2,color:#000
    style T5 fill:#95d5b2,color:#000
    style H fill:#52b788,color:#000
    style F fill:#2d6a4f,color:#fff
    style I fill:#1b4332,color:#fff
```
