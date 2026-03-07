---
id: ADV-AGENCY-01
phase: ADVANCED
prd_section: Agency Dashboard & CRM
title: Agency Dashboard & CRM Pipeline
type: flowchart
---

# Agency Dashboard & CRM Pipeline

The agency-facing dashboard provides executive KPIs, client management, deal pipeline, project tracking, task execution, wizard session management, and analytics. Role-based access separates Owner (full) from Consultant (assigned clients only).

## Dashboard Route Structure

```mermaid
---
config:
  theme: forest
---
flowchart TB
    subgraph Admin["/admin — Agency Dashboard"]
        direction TB
        Overview["Overview<br/>Executive KPIs: clients, projects,<br/>revenue, pipeline value, velocity"]

        subgraph Routes["Dashboard Routes"]
            direction TB
            Clients["/admin/clients<br/>Client list, health scores 0-100,<br/>detail view, activity timeline"]
            Pipeline["/admin/pipeline<br/>Deal kanban board,<br/>5-stage pipeline"]
            Projects["/admin/projects<br/>Project list by phase,<br/>delivery tracking, team task board"]
            Tasks["/admin/tasks<br/>Daily execution board,<br/>workload view per consultant"]
            Wizards["/admin/wizards<br/>Wizard session management,<br/>review client discovery data"]
            Analytics["/admin/analytics<br/>Revenue trends via Recharts,<br/>conversion funnel, AI usage"]
            Settings["/admin/settings<br/>Org profile, team members,<br/>roles, service catalog config"]
        end
    end

    subgraph RBAC["Role-Based Access Control"]
        direction LR
        Owner["Owner Role<br/>Full access to all routes,<br/>all clients, settings, billing"]
        Consultant["Consultant Role<br/>Assigned clients only,<br/>own tasks, limited analytics"]
    end

    Owner -->|full access| Admin
    Consultant -->|filtered access| Clients
    Consultant -->|filtered access| Tasks
    Consultant -->|filtered access| Projects

    Overview --> Clients
    Overview --> Pipeline
    Overview --> Projects
    Overview --> Tasks
    Overview --> Wizards
    Overview --> Analytics
    Overview --> Settings

    classDef adminNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef routeNode fill:#F1EEEA,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef roleNode fill:#1a5c3a,stroke:#84CC16,stroke-width:2px,color:#F1EEEA

    class Admin,Overview adminNode
    class Clients,Pipeline,Projects,Tasks,Wizards,Analytics,Settings routeNode
    class Owner,Consultant roleNode
```

## CRM Pipeline — Deal Flow & AI Agents

```mermaid
---
config:
  theme: forest
---
flowchart LR
    subgraph Pipeline["CRM Pipeline Stages"]
        direction LR
        Lead["Lead<br/>New inbound contact,<br/>form submission,<br/>referral"]
        MQL["MQL<br/>Marketing Qualified Lead,<br/>meets ICP criteria,<br/>engagement threshold"]
        Discovery["Discovery<br/>Wizard completed,<br/>diagnostics scored,<br/>brief generated"]
        Negotiating["Negotiating<br/>Proposal sent,<br/>pricing discussed,<br/>contract review"]
        Won["Won<br/>Contract signed,<br/>project created,<br/>onboarding starts"]
        Lost["Lost<br/>Deal closed-lost,<br/>reason captured,<br/>nurture sequence"]
    end

    Lead -->|"qualify"| MQL
    MQL -->|"wizard invite"| Discovery
    Discovery -->|"proposal"| Negotiating
    Negotiating -->|"sign"| Won
    Negotiating -->|"decline"| Lost

    subgraph AIAgents["AI Agent Layer"]
        direction TB
        CRMAgent["crm-intelligence Agent<br/>Lead health scoring 0-100,<br/>deal probability %,<br/>risk alerts"]
        AnalyticsAgent["analytics Agent<br/>Revenue forecasting,<br/>conversion analysis,<br/>pipeline velocity"]
        MonitorAgent["monitor Agent<br/>Deadline alerts,<br/>velocity tracking,<br/>stale deal detection"]
    end

    CRMAgent -.->|"score"| Lead
    CRMAgent -.->|"probability"| Negotiating
    CRMAgent -.->|"risk alert"| MQL
    AnalyticsAgent -.->|"forecast"| Won
    AnalyticsAgent -.->|"conversion rate"| Pipeline
    MonitorAgent -.->|"deadline alert"| Discovery
    MonitorAgent -.->|"stale deal"| Negotiating

    classDef stageNode fill:#F1EEEA,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef wonNode fill:#84CC16,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef lostNode fill:#dc2626,stroke:#0A211F,stroke-width:2px,color:#F1EEEA
    classDef agentNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#84CC16

    class Lead,MQL,Discovery,Negotiating stageNode
    class Won wonNode
    class Lost lostNode
    class CRMAgent,AnalyticsAgent,MonitorAgent agentNode
```

## CRM Data Model

```mermaid
---
config:
  theme: forest
---
erDiagram
    CONTACT ||--o{ DEAL : "associated with"
    CONTACT ||--o{ COMMUNICATION : "has"
    CONTACT ||--o{ LEAD : "sourced as"
    DEAL ||--o{ COMMUNICATION : "tracked in"
    DEAL }o--|| CONTACT : "primary contact"

    CONTACT {
        uuid id PK
        uuid org_id FK
        varchar full_name
        varchar email UK
        varchar phone
        varchar company
        varchar job_title
        int health_score "0-100"
        varchar source "referral, form, organic"
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }

    DEAL {
        uuid id PK
        uuid contact_id FK
        uuid assigned_to FK "consultant user_id"
        varchar title
        varchar stage "lead, mql, discovery, negotiating, won, lost"
        decimal value
        int probability "0-100, AI-scored"
        varchar lost_reason "nullable"
        date expected_close
        jsonb ai_analysis "crm-intelligence output"
        timestamp stage_changed_at
        timestamp created_at
        timestamp updated_at
    }

    COMMUNICATION {
        uuid id PK
        uuid contact_id FK
        uuid deal_id FK
        varchar channel "email, call, meeting, chat"
        varchar direction "inbound, outbound"
        text subject
        text body
        timestamp occurred_at
        timestamp created_at
    }

    LEAD {
        uuid id PK
        uuid contact_id FK
        varchar source_channel "website, referral, ads, social"
        varchar campaign
        varchar utm_source
        varchar utm_medium
        int engagement_score "0-100"
        boolean is_qualified
        timestamp qualified_at
        timestamp created_at
    }
```
