# Dashboard Transition & Post-Wizard Diagrams

## Wizard to Dashboard Transition

```mermaid
flowchart TD
    subgraph Wizard["Wizard (Discovery Phase)"]
        S1[Step 1: Business Context]
        S2[Step 2: Industry Diagnostics]
        S3[Step 3: System Recommendations]
        S4[Step 4: Executive Brief]
        S5[Step 5: Dashboard Entry]
    end

    subgraph Transition["Transition Layer"]
        CreateAll[Create Project + Roadmap + Tasks]
    end

    subgraph ClientDashboard["Client Portal /app/dashboard"]
        CO[Project Overview]
        CR[Roadmap View]
        CT[My Tasks]
        CB[Brief & Documents]
        CS[Strategy Summary]
    end

    subgraph AgencyDashboard["Agency Dashboard /admin"]
        AO[Overview]
        AC[Clients]
        AP[Pipeline]
        APR[Projects]
        AT[Tasks]
        AW[Wizard Sessions]
    end

    S5 --> CreateAll
    CreateAll --> CO
    CreateAll --> AO

    CO --> CR
    CO --> CT
    CO --> CB
    CO --> CS

    style Wizard fill:#F1EEEA,stroke:#0A211F
    style ClientDashboard fill:#FFFFFF,stroke:#84CC16,stroke-width:2px
    style AgencyDashboard fill:#0A211F,color:#fff
    style Transition fill:#84CC16,stroke:#0A211F
```

## Role-Based Access Flow

```mermaid
flowchart TD
    Login([User Logs In]) --> CheckRole{team_members.role?}

    CheckRole -->|Client| ClientCheck{Has wizard_session?}
    ClientCheck -->|No session| StartWizard[/app/wizard/step-1]
    ClientCheck -->|Incomplete| ResumeWizard[/app/wizard/step-N]
    ClientCheck -->|Complete| ClientDash[/app/dashboard/project_id]

    CheckRole -->|Owner / Consultant| AdminDash[/admin]

    AdminDash --> ViewClients[All Clients]
    AdminDash --> ViewPipeline[Pipeline]
    AdminDash --> ViewProjects[All Projects]
    AdminDash --> ViewWizards[Wizard Sessions]

    ViewWizards --> ReviewSession[Review Client Wizard]
    ViewWizards --> ResumeForClient[Resume on Behalf of Client]

    style AdminDash fill:#0A211F,color:#fff
    style ClientDash fill:#84CC16,stroke:#0A211F
```

## Client Dashboard Layout

```mermaid
flowchart LR
    subgraph Sidebar["Client Sidebar"]
        direction TB
        S_Overview[Overview]
        S_Roadmap[Roadmap]
        S_Tasks[My Tasks]
        S_Brief[Brief]
        S_Strategy[Strategy]
        S_Docs[Documents]
        S_Settings[Settings]
    end

    subgraph Main["Main Content Area"]
        direction TB
        Header[Project Name + Status Bar]
        Content[Page Content]
    end

    S_Overview --> Main
    S_Roadmap --> Main
    S_Tasks --> Main
    S_Brief --> Main
    S_Strategy --> Main
    S_Docs --> Main
    S_Settings --> Main
```

## Agency Dashboard Layout

```mermaid
flowchart LR
    subgraph Sidebar["Agency Sidebar"]
        direction TB
        A_Overview[Overview]
        A_Clients[Clients]
        A_Pipeline[Pipeline]
        A_Projects[Projects]
        A_Tasks[Tasks]
        A_Wizards[Wizards]
        A_Sep1[───]
        A_Roadmaps[Roadmaps]
        A_Docs[Documents]
        A_Systems[Systems]
        A_Invoices[Invoices]
        A_Team[Team]
        A_Analytics[Analytics]
        A_Logs[AI Logs]
        A_Settings[Settings]
    end

    subgraph Main["Main Content"]
        direction TB
        Header[Page Title + Actions]
        Content[Data Tables / Kanban / Cards]
    end

    A_Overview --> Main
    A_Clients --> Main
    A_Pipeline --> Main
    A_Projects --> Main
    A_Tasks --> Main
```

## Project Lifecycle (End to End)

```mermaid
gantt
    title Sun AI Agency — Project Lifecycle
    dateFormat YYYY-MM-DD

    section Discovery
    Wizard Step 1 - Business Context    :s1, 2026-03-07, 1d
    Wizard Step 2 - Industry Analysis   :s2, after s1, 1d
    AI Analysis Processing              :ai1, after s2, 0d
    Wizard Step 3 - System Selection    :s3, after ai1, 1d
    Wizard Step 4 - Executive Brief     :s4, after s3, 2d
    Brief Approval                      :milestone, after s4, 0d
    Wizard Step 5 - Project Created     :s5, after s4, 0d

    section Phase 1 - Foundation
    Infrastructure Setup                :p1t1, after s5, 7d
    Data Integration                    :p1t2, after p1t1, 7d
    Primary System Deployment           :p1t3, after p1t2, 7d
    Phase 1 Review                      :milestone, after p1t3, 0d

    section Phase 2 - Activation
    Secondary System Launch             :p2t1, after p1t3, 7d
    Initial Optimization                :p2t2, after p2t1, 7d
    Performance Benchmarking            :p2t3, after p2t2, 7d
    Phase 2 Review                      :milestone, after p2t3, 0d

    section Phase 3 - Optimization
    A/B Testing & Refinement            :p3t1, after p2t3, 10d
    Advanced Features                   :p3t2, after p3t1, 10d
    ROI Measurement & Report            :p3t3, after p3t2, 10d
    Project Complete                    :milestone, after p3t3, 0d
```

## Kanban — Task Board (Agency View)

```mermaid
---
config:
  kanban:
    ticketBaseUrl: '/admin/tasks/'
---
kanban
    Todo
        Cart Recovery Research @{ ticket: T-001, assigned: "Sarah", priority: "High" }
        API Integration Plan @{ ticket: T-002, assigned: "Mike", priority: "Medium" }
        Client Onboarding Checklist @{ ticket: T-003, priority: "Low" }

    In Progress
        Chatbot Flow Design @{ ticket: T-004, assigned: "Sarah", priority: "High" }
        Data Migration Script @{ ticket: T-005, assigned: "Mike", priority: "Medium" }

    Review
        Landing Page Copy @{ ticket: T-006, assigned: "Alex", priority: "Medium" }

    Done
        Wizard Setup @{ ticket: T-007, assigned: "Sarah", priority: "High" }
        Brief Approved @{ ticket: T-008, assigned: "Client", priority: "High" }
```
