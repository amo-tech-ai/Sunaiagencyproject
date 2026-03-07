---
id: ADV-CHAT-01
phase: ADVANCED
prd_section: Chatbot System & Command Bar
title: Chatbot System & Command Bar
type: sequence
---

# Chatbot System & Command Bar

Three interactive AI interfaces: a website chatbot widget for marketing visitors, a Cmd+K command bar for dashboard power users, and an intent orchestrator that routes queries to specialized sub-agents.

## Website Chatbot Widget — Chat Flow

```mermaid
---
config:
  theme: forest
---
sequenceDiagram
    autonumber
    actor User as Website Visitor
    participant Widget as Chat Widget<br/>Floating Button
    participant Panel as Chat Panel<br/>Messages + Input
    participant Edge as assistant<br/>Edge Function
    participant Orch as Orchestrator<br/>Intent Detection
    participant DB as Supabase<br/>chat_sessions + chat_messages

    User->>Widget: Click floating button (bottom-right)
    Widget->>Panel: Open chat panel

    Panel->>DB: Load or create chat_session
    DB-->>Panel: session_id + message history

    User->>Panel: Type message
    Panel->>Edge: POST /assistant with session_id + message

    Edge->>Orch: Classify intent
    Note over Orch: Intent types:<br/>question, action, navigation

    alt Intent: Question
        Orch->>Edge: Route to RAG retrieval
        Edge->>DB: Semantic search knowledge_chunks
        DB-->>Edge: Top-K relevant chunks
        Edge-->>Panel: AI response with context
    else Intent: Action
        Orch->>Edge: Route to action handler
        Edge->>Edge: Execute action (book call, start wizard)
        Edge-->>Panel: Action confirmation + link
    else Intent: Navigation
        Orch->>Edge: Route to navigation handler
        Edge-->>Panel: Suggested page + deep link
    end

    Panel->>DB: Save message + response to chat_messages
    Panel-->>User: Display response

    Note over Panel: Multi-tab UI:<br/>Explore, Projects, Items,<br/>Timeline, Insights
```

## Dashboard Cmd+K Command Bar — Interaction Flow

```mermaid
---
config:
  theme: forest
---
sequenceDiagram
    autonumber
    actor User as Dashboard User
    participant CmdK as Cmd+K Overlay
    participant Ctx as Context Resolver
    participant Edge as Orchestrator<br/>Edge Function
    participant Agent as Sub-Agent<br/>Function Calling
    participant DB as Supabase

    User->>CmdK: Press Cmd+K
    CmdK->>Ctx: Gather current context

    Note over Ctx: Context includes:<br/>current_project_id,<br/>current_page, user_role,<br/>recent_actions

    Ctx-->>CmdK: Context object

    User->>CmdK: Type natural language query
    CmdK->>Edge: POST /orchestrator with query + context

    Edge->>Edge: Parse intent from query + context

    alt Data Query
        Edge->>Agent: Route to analytics agent
        Agent->>DB: Execute analysis query
        DB-->>Agent: Result set
        Agent-->>Edge: Formatted data response
        Edge-->>CmdK: Display data card
    else Action Request
        Edge->>Agent: Route to appropriate agent
        Agent-->>Edge: Proposed action + parameters
        Edge-->>CmdK: Show action preview

        Note over CmdK: Human-in-the-loop:<br/>AI proposes, user confirms

        User->>CmdK: Confirm or reject action
        alt Confirmed
            CmdK->>Edge: Execute confirmed action
            Edge->>Agent: Perform action
            Agent->>DB: Write changes
            DB-->>Agent: Success
            Agent-->>Edge: Completion status
            Edge-->>CmdK: Action completed notification
        else Rejected
            CmdK-->>User: Action cancelled
        end
    else Navigation
        Edge-->>CmdK: Suggested route
        CmdK-->>User: Navigate to page
    end
```

## Intent Orchestrator — Agent Routing

```mermaid
---
config:
  theme: forest
---
flowchart TB
    subgraph Input["Input Sources"]
        direction LR
        ChatWidget["Website Chat Widget<br/>Marketing visitors"]
        CmdK["Cmd+K Command Bar<br/>Dashboard users"]
        DashboardChat["Dashboard Chat<br/>Project context"]
    end

    Orch["Orchestrator Agent<br/>gemini-3.1-pro-preview<br/>Function Calling<br/>Thought Signatures"]

    ChatWidget -->|"query + visitor context"| Orch
    CmdK -->|"query + dashboard context"| Orch
    DashboardChat -->|"query + project context"| Orch

    subgraph IntentClassification["Intent Classification"]
        direction TB
        Parse["Parse Query<br/>Extract intent + entities"]
        Classify{"Route Decision"}
    end

    Orch --> Parse
    Parse --> Classify

    subgraph Agents["Specialized Sub-Agents"]
        direction TB
        Assistant["assistant<br/>RAG-powered chat,<br/>knowledge retrieval,<br/>general Q&A"]
        Intelligence["intelligence-stream<br/>Dashboard updates,<br/>project insights,<br/>status summaries"]
        CRMIntel["crm-intelligence<br/>Lead scoring,<br/>deal analysis,<br/>client health"]
        AnalyticsAg["analytics<br/>Revenue data,<br/>conversion metrics,<br/>usage stats"]
        Planner["planner<br/>Strategy generation,<br/>roadmap creation,<br/>timeline planning"]
    end

    Classify -->|"question / knowledge"| Assistant
    Classify -->|"project update / insight"| Intelligence
    Classify -->|"lead / deal / client"| CRMIntel
    Classify -->|"data / metrics / report"| AnalyticsAg
    Classify -->|"strategy / plan / roadmap"| Planner

    subgraph Continuity["Multi-Turn Continuity"]
        direction LR
        ThoughtSig["Thought Signatures<br/>Persisted across turns"]
        FuncCall["Function Calling<br/>Tool use chains"]
        SessionMem["Session Memory<br/>chat_sessions table"]
    end

    Assistant --> ThoughtSig
    Intelligence --> ThoughtSig
    CRMIntel --> FuncCall
    AnalyticsAg --> FuncCall
    Planner --> SessionMem

    subgraph Response["Response Delivery"]
        direction LR
        TextResp["Text Response<br/>Markdown formatted"]
        ActionResp["Action Proposal<br/>Human-in-the-loop"]
        DataResp["Data Card<br/>Charts, tables, metrics"]
        NavResp["Navigation<br/>Deep link to page"]
    end

    Assistant --> TextResp
    Intelligence --> DataResp
    CRMIntel --> ActionResp
    AnalyticsAg --> DataResp
    Planner --> ActionResp

    classDef inputNode fill:#F1EEEA,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef orchNode fill:#0A211F,stroke:#84CC16,stroke-width:3px,color:#84CC16
    classDef agentNode fill:#1a5c3a,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef classifyNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef contNode fill:#F1EEEA,stroke:#84CC16,stroke-width:1px,color:#0A211F
    classDef respNode fill:#84CC16,stroke:#0A211F,stroke-width:2px,color:#0A211F

    class ChatWidget,CmdK,DashboardChat inputNode
    class Orch orchNode
    class Assistant,Intelligence,CRMIntel,AnalyticsAg,Planner agentNode
    class Parse,Classify classifyNode
    class ThoughtSig,FuncCall,SessionMem contNode
    class TextResp,ActionResp,DataResp,NavResp respNode
```
