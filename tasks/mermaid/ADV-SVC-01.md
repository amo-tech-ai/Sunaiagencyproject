---
id: ADV-SVC-01
phase: ADVANCED
prd_section: Services Catalog & Industry Packs
title: Services Catalog & Industry Packs
type: classDiagram
---

# Services Catalog & Industry Packs

98 services across 15 families, mapped to AI systems and scored for industry relevance. Industry packs provide a 7-layer configuration structure per vertical, feeding context into the wizard and agent system.

## Service / System / Industry Relationships

```mermaid
---
config:
  theme: forest
---
classDiagram
    class Service {
        <<entity>>
        +uuid id
        +String name
        +String description
        +String family
        +String complexity
        +int base_hours
        +decimal base_price
        +boolean is_active
    }

    class ServiceFamily {
        <<enumeration>>
        Strategy
        CRM
        WhatsApp
        Social_Media
        Content
        Onboarding
        Operations
        Compliance
        Booking
        Data
        Loyalty
        Sales
        Support
        Recommendations
        Growth
    }

    class System {
        <<entity>>
        +uuid id
        +String name
        +String description
        +String category
        +jsonb capabilities
        +boolean is_active
    }

    class SystemService {
        <<junction>>
        +uuid system_id FK
        +uuid service_id FK
        +int priority
        +String role
    }

    class Industry {
        <<entity>>
        +uuid id
        +String slug
        +String name
        +String description
        +jsonb characteristics
        +jsonb market_data
    }

    class IndustryServiceRelevance {
        <<junction>>
        +uuid industry_id FK
        +uuid service_id FK
        +int relevance_score
        +String rationale
    }

    class Project {
        <<entity>>
        +uuid id
        +uuid client_id FK
        +String name
        +String phase
        +String status
    }

    class ProjectService {
        <<junction>>
        +uuid project_id FK
        +uuid service_id FK
        +String status
        +int hours_estimated
        +int hours_actual
    }

    class WizardSession {
        <<entity>>
        +uuid id
        +uuid user_id FK
        +uuid industry_id FK
        +int current_step
        +jsonb responses
    }

    Service "1" --> "1" ServiceFamily : belongs to
    System "1" --> "*" SystemService : maps via
    Service "1" --> "*" SystemService : maps via
    Industry "1" --> "*" IndustryServiceRelevance : scores via
    Service "1" --> "*" IndustryServiceRelevance : scored in
    Project "1" --> "*" ProjectService : tracks via
    Service "1" --> "*" ProjectService : assigned to
    WizardSession "1" --> "1" Industry : selects
    WizardSession ..> IndustryServiceRelevance : "Step 3: recommends services by relevance"
```

## Industry Packs — 7-Layer Structure

```mermaid
---
config:
  theme: forest
---
classDiagram
    class IndustryPack {
        <<aggregate root>>
        +String slug
        +String name
        +String version
    }

    class Layer1_CoreIdentity {
        <<value object>>
        +String name
        +String description
        +String[] characteristics
        +String[] pain_points
        +String[] opportunities
    }

    class Layer2_Diagnostics {
        <<value object>>
        +DiagnosticQuestion[] questions
        +int question_count = 8
        +String scoring_rubric
        +String[] maturity_dimensions
    }

    class DiagnosticQuestion {
        <<value object>>
        +String question_text
        +String[] options
        +int[] scores
        +String dimension
    }

    class Layer3_SystemMappings {
        <<value object>>
        +SystemMapping[] mappings
        +String[] primary_systems
        +String[] secondary_systems
    }

    class Layer4_AgentBriefs {
        <<value object>>
        +Map agent_contexts
        +String industry_prompt_prefix
        +String[] terminology_injections
    }

    class Layer5_Metadata {
        <<value object>>
        +String market_size
        +String[] trends
        +String competition_level
        +String avg_deal_size
        +String sales_cycle_length
    }

    class Layer6_Terminology {
        <<value object>>
        +Map term_definitions
        +String[] jargon
        +String[] acronyms
    }

    class Layer7_MaturityLevels {
        <<value object>>
        +MaturityLevel[] levels
        +String[] assessment_criteria
    }

    class MaturityLevel {
        <<value object>>
        +int level
        +String name
        +String description
        +String[] capabilities
        +String[] recommended_services
    }

    IndustryPack *-- Layer1_CoreIdentity : contains
    IndustryPack *-- Layer2_Diagnostics : contains
    IndustryPack *-- Layer3_SystemMappings : contains
    IndustryPack *-- Layer4_AgentBriefs : contains
    IndustryPack *-- Layer5_Metadata : contains
    IndustryPack *-- Layer6_Terminology : contains
    IndustryPack *-- Layer7_MaturityLevels : contains
    Layer2_Diagnostics *-- DiagnosticQuestion : has 8
    Layer7_MaturityLevels *-- MaturityLevel : has 5
```

## Industry Packs Flow Through the Wizard

```mermaid
---
config:
  theme: forest
---
flowchart TB
    subgraph Verticals["8 Industry Verticals"]
        direction LR
        Fashion["Fashion<br/>and Retail"]
        RealEstate["Real<br/>Estate"]
        SaaS["SaaS<br/>Companies"]
        Events["Events and<br/>Hospitality"]
        Ecommerce["E-commerce"]
        Agencies["Agencies<br/>Marketing,<br/>Creative"]
        Professional["Professional<br/>Services"]
        Generic["Generic<br/>Fallback"]
    end

    subgraph WizardFlow["Wizard Steps"]
        direction TB

        Step1["Step 1: Business Profile<br/>Client selects industry vertical,<br/>enters company details,<br/>uploads documents"]

        Step2["Step 2: AI Diagnostics<br/>Layer 2 questions loaded,<br/>8 diagnostic questions,<br/>maturity scoring"]

        Step3["Step 3: Service Recommendations<br/>Services filtered by industry relevance,<br/>scored and ranked,<br/>recommendation cards displayed"]

        Step4["Step 4: System Design<br/>Selected services mapped to systems<br/>via system_services junction,<br/>architecture preview"]

        Step5["Step 5: Brief Generation<br/>All layers injected into<br/>agent prompts,<br/>AI generates implementation brief"]
    end

    Fashion & RealEstate & SaaS & Events & Ecommerce & Agencies & Professional & Generic --> Step1

    Step1 -->|"industry_id selected"| Step2

    subgraph Layer2Load["Layer 2: Diagnostics Loaded"]
        direction LR
        Questions["8 Industry-Specific<br/>Diagnostic Questions"]
        Scoring["Maturity Scoring<br/>Rubric Applied"]
    end

    Step2 --> Layer2Load
    Layer2Load --> Step3

    subgraph Layer3Load["Layer 3: System Mappings + Relevance Scores"]
        direction LR
        Filter["Filter 98 services<br/>by industry relevance"]
        Rank["Rank by<br/>relevance_score"]
        Cards["Display<br/>recommendation cards"]
    end

    Step3 --> Layer3Load
    Layer3Load --> Step4

    subgraph SystemMapping["System Design"]
        direction LR
        Selected["Selected Services"]
        Junction["system_services<br/>junction lookup"]
        Arch["Architecture<br/>Preview"]
    end

    Step4 --> SystemMapping
    SystemMapping --> Step5

    subgraph BriefGen["Brief Generation — All Layers Active"]
        direction LR
        L1["L1: Core Identity"]
        L4["L4: Agent Briefs"]
        L5["L5: Metadata"]
        L6["L6: Terminology"]
        L7["L7: Maturity Level"]
        Prompt["Injected into<br/>agent system prompt"]
    end

    Step5 --> BriefGen
    L1 & L4 & L5 & L6 & L7 --> Prompt

    classDef verticalNode fill:#F1EEEA,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef stepNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#84CC16
    classDef layerNode fill:#1a5c3a,stroke:#84CC16,stroke-width:1px,color:#F1EEEA
    classDef briefNode fill:#84CC16,stroke:#0A211F,stroke-width:2px,color:#0A211F

    class Fashion,RealEstate,SaaS,Events,Ecommerce,Agencies,Professional,Generic verticalNode
    class Step1,Step2,Step3,Step4,Step5 stepNode
    class Questions,Scoring,Filter,Rank,Cards,Selected,Junction,Arch layerNode
    class L1,L4,L5,L6,L7,Prompt briefNode
```
