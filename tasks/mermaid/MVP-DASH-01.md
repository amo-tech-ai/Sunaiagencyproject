---
id: MVP-DASH-01
phase: MVP
prd_section: Client Dashboard
title: Client Dashboard
type: flowchart
---

# Client Dashboard

Two diagrams: (1) routing/layout flowchart showing all dashboard routes and sidebar navigation,
and (2) ERD showing the data sources backing each dashboard view.

## Dashboard Routing and Layout

```mermaid
---
config:
  theme: forest
  themeVariables:
    primaryColor: "#0A211F"
    primaryTextColor: "#F1EEEA"
    primaryBorderColor: "#84CC16"
    lineColor: "#84CC16"
    secondaryColor: "#F1EEEA"
    tertiaryColor: "#84CC16"
---
flowchart TD
    entry([User enters dashboard<br/>/app/dashboard]) --> layout

    subgraph layout["Dashboard Layout (sidebar + main content)"]
        direction LR

        subgraph sidebar["Sidebar Navigation"]
            direction TB
            nav_overview["Overview"]
            nav_brief["Brief"]
            nav_roadmap["Roadmap"]
            nav_tasks["Tasks"]
            nav_docs["Documents"]
            nav_billing["Billing"]

            nav_overview --- nav_brief
            nav_brief --- nav_roadmap
            nav_roadmap --- nav_tasks
            nav_tasks --- nav_docs
            nav_docs --- nav_billing
        end

        subgraph main["Main Content Area"]
            direction TB

            subgraph overview_page["/app/dashboard - Overview"]
                direction TB
                kpis["Project KPIs"]
                phase_prog["Phase Progress Bars"]
                task_pct["Task Completion %"]
                milestones["Upcoming Milestones"]
                ai_insights["AI Insights (intelligence-stream)"]
            end

            subgraph brief_page["/app/dashboard/brief - Brief Viewer"]
                direction TB
                brief_content["Brief Content (inline editable)"]
                version_history["Version History"]
                pdf_export["PDF Export"]
            end

            subgraph roadmap_page["/app/dashboard/roadmap - Roadmap"]
                direction TB
                three_phases["3-Phase Timeline"]
                rm_milestones["Milestones per Phase"]
                deliverables["Deliverables"]
                progress_bars["Progress Bars"]
            end

            subgraph tasks_page["/app/dashboard/tasks - Tasks"]
                direction TB
                view_toggle["Kanban + List Toggle"]
                filters["Filter: phase / status / owner"]
                task_detail["Task Detail Slide-over"]
            end

            subgraph docs_page["/app/dashboard/documents - Documents"]
                direction TB
                file_upload["File Upload (Supabase Storage)"]
                doc_list["Document List"]
                doc_meta["Document Metadata"]
            end

            subgraph billing_page["/app/dashboard/billing - Billing"]
                direction TB
                invoices["Invoice List"]
                payment_status["Payment Status"]
                subscription["Subscription Management (Stripe)"]
            end
        end
    end

    nav_overview -.-> overview_page
    nav_brief -.-> brief_page
    nav_roadmap -.-> roadmap_page
    nav_tasks -.-> tasks_page
    nav_docs -.-> docs_page
    nav_billing -.-> billing_page

    %% Styling
    style layout fill:#FFFFFF,stroke:#0A211F,stroke-width:3px,color:#0A211F
    style sidebar fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    style main fill:#F1EEEA,stroke:#0A211F,stroke-width:2px,color:#0A211F

    style overview_page fill:#FFFFFF,stroke:#84CC16,stroke-width:2px,color:#0A211F
    style brief_page fill:#FFFFFF,stroke:#84CC16,stroke-width:2px,color:#0A211F
    style roadmap_page fill:#FFFFFF,stroke:#84CC16,stroke-width:2px,color:#0A211F
    style tasks_page fill:#FFFFFF,stroke:#84CC16,stroke-width:2px,color:#0A211F
    style docs_page fill:#FFFFFF,stroke:#84CC16,stroke-width:2px,color:#0A211F
    style billing_page fill:#FFFFFF,stroke:#84CC16,stroke-width:2px,color:#0A211F

    classDef navItem fill:#84CC16,stroke:#0A211F,color:#0A211F,stroke-width:1px
    class nav_overview,nav_brief,nav_roadmap,nav_tasks,nav_docs,nav_billing navItem
```

## Dashboard Data Sources (ERD)

```mermaid
---
config:
  theme: forest
  themeVariables:
    primaryColor: "#0A211F"
    primaryTextColor: "#F1EEEA"
    primaryBorderColor: "#84CC16"
---
erDiagram
    PROJECT ||--|| CONTEXT_SNAPSHOT : has
    PROJECT ||--|| ROADMAP : has
    PROJECT ||--|| BRIEF : has
    PROJECT ||--o{ TASK : contains
    PROJECT ||--o{ PROJECT_SYSTEM : includes
    PROJECT ||--o{ PROJECT_SERVICE : includes
    PROJECT ||--o{ DOCUMENT : stores
    PROJECT ||--o{ INVOICE : billed_via
    PROJECT |o--o| SUBSCRIPTION : managed_by

    ROADMAP ||--|{ ROADMAP_PHASE : divided_into
    BRIEF ||--o{ BRIEF_VERSION : versioned_as

    %% ============================================================
    %% CORE: Overview page
    %% ============================================================
    PROJECT {
        uuid id PK
        uuid user_id FK
        varchar name
        varchar status
        int readiness_score "0-100"
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }

    CONTEXT_SNAPSHOT {
        uuid id PK
        uuid project_id FK
        jsonb wizard_data "All wizard answers"
        jsonb ai_analysis "Cached AI results"
        timestamp created_at
    }

    %% ============================================================
    %% BRIEF: Brief page
    %% ============================================================
    BRIEF {
        uuid id PK
        uuid project_id FK
        jsonb content "All sections as JSONB"
        varchar status "draft | in_review | approved"
        int current_version
        timestamp created_at
        timestamp updated_at
    }

    BRIEF_VERSION {
        uuid id PK
        uuid brief_id FK
        int version_number
        jsonb content "Section snapshot"
        uuid edited_by FK
        timestamp created_at
    }

    %% ============================================================
    %% ROADMAP: Roadmap page
    %% ============================================================
    ROADMAP {
        uuid id PK
        uuid project_id FK
        varchar title
        jsonb summary
        timestamp created_at
        timestamp updated_at
    }

    ROADMAP_PHASE {
        uuid id PK
        uuid roadmap_id FK
        int phase_number "1, 2, or 3"
        varchar name
        text description
        jsonb milestones "Array of milestones"
        jsonb deliverables "Array of deliverables"
        jsonb kpis "Array of KPIs"
        int progress_pct "0-100"
        date start_date
        date end_date
    }

    %% ============================================================
    %% TASKS: Tasks page
    %% ============================================================
    TASK {
        uuid id PK
        uuid project_id FK
        uuid roadmap_phase_id FK
        varchar title
        text description
        varchar status "todo | in_progress | done"
        varchar priority "low | medium | high"
        varchar owner
        int sort_order
        date due_date
        timestamp created_at
        timestamp updated_at
    }

    %% ============================================================
    %% SYSTEMS & SERVICES: Project config
    %% ============================================================
    PROJECT_SYSTEM {
        uuid id PK
        uuid project_id FK
        varchar system_name
        varchar priority_rank
        varchar investment_tier
        jsonb config
    }

    PROJECT_SERVICE {
        uuid id PK
        uuid project_id FK
        varchar service_name
        varchar status
        jsonb config
    }

    %% ============================================================
    %% DOCUMENTS: Documents page
    %% ============================================================
    DOCUMENT {
        uuid id PK
        uuid project_id FK
        varchar name
        varchar file_path "Supabase Storage path"
        varchar mime_type
        bigint file_size
        jsonb metadata
        uuid uploaded_by FK
        timestamp created_at
    }

    %% ============================================================
    %% BILLING: Billing page
    %% ============================================================
    INVOICE {
        uuid id PK
        uuid project_id FK
        varchar stripe_invoice_id UK
        decimal amount
        varchar currency
        varchar status "draft | open | paid | void"
        date due_date
        date paid_date
        timestamp created_at
    }

    SUBSCRIPTION {
        uuid id PK
        uuid project_id FK
        varchar stripe_subscription_id UK
        varchar plan_name
        varchar status "active | past_due | canceled"
        decimal amount
        varchar interval "monthly | annual"
        date current_period_start
        date current_period_end
        timestamp created_at
    }
```

## Data Flow per Dashboard View

```mermaid
---
config:
  theme: forest
---
flowchart LR
    subgraph views["Dashboard Views"]
        direction TB
        V_overview["Overview"]
        V_brief["Brief"]
        V_roadmap["Roadmap"]
        V_tasks["Tasks"]
        V_docs["Documents"]
        V_billing["Billing"]
    end

    subgraph tables["Data Sources"]
        direction TB
        T_projects[("projects")]
        T_tasks[("tasks")]
        T_roadmap_phases[("roadmap_phases")]
        T_briefs[("briefs")]
        T_brief_versions[("brief_versions")]
        T_roadmaps[("roadmaps")]
        T_documents[("documents<br/>(Supabase Storage)")]
        T_invoices[("invoices")]
        T_subscriptions[("subscriptions<br/>(Stripe)")]
    end

    V_overview --> T_projects
    V_overview --> T_tasks
    V_overview --> T_roadmap_phases

    V_brief --> T_briefs
    V_brief --> T_brief_versions

    V_roadmap --> T_roadmaps
    V_roadmap --> T_roadmap_phases

    V_tasks --> T_tasks

    V_docs --> T_documents

    V_billing --> T_invoices
    V_billing --> T_subscriptions

    style views fill:#F1EEEA,stroke:#0A211F,stroke-width:2px,color:#0A211F
    style tables fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#F1EEEA

    classDef view fill:#84CC16,stroke:#0A211F,color:#0A211F,stroke-width:2px
    classDef table fill:#0A211F,stroke:#84CC16,color:#F1EEEA,stroke-width:1px

    class V_overview,V_brief,V_roadmap,V_tasks,V_docs,V_billing view
    class T_projects,T_tasks,T_roadmap_phases,T_briefs,T_brief_versions,T_roadmaps,T_documents,T_invoices,T_subscriptions table
```
