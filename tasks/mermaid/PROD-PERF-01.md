---
id: PROD-PERF-01
phase: PRODUCTION
prd_section: Performance & Monitoring
title: Performance & Monitoring
type: flowchart
---

# Performance & Monitoring

Production performance targets, optimization pipeline, scalability goals, and monitoring architecture for the Sun AI Agency platform.

## Performance Targets

```mermaid
---
config:
  theme: forest
---
flowchart LR
    subgraph ResponseTimes["Response Time Targets (95th Percentile)"]
        direction TB
        WizardLoad["Wizard Step Load<br/>TARGET: < 2s"]
        FlashAgent["Flash Agent Response<br/>TARGET: < 3s"]
        ProAgent["Pro Agent + Thinking<br/>TARGET: < 15s"]
        DashLoad["Dashboard Load<br/>TARGET: < 2s"]
        EdgeFn["Edge Function p95<br/>TARGET: < 3s"]
        DBQuery["Database Query p95<br/>TARGET: < 500ms"]
        AutoSave["Auto-save Round-trip<br/>TARGET: < 1s"]
    end

    subgraph ScaleTargets["Scalability Targets"]
        direction TB
        Concurrent["1,000+ concurrent users"]
        WizardSessions["10,000+ wizard sessions/month"]
        AIRequests["100,000+ AI requests/month"]
        Orgs["100+ organizations"]
        Uptime["99.9% uptime<br/>43 min downtime/month max"]
    end

    ResponseTimes ~~~ ScaleTargets

    classDef fastNode fill:#1a5c3a,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef scaleNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#84CC16

    class WizardLoad,FlashAgent,DashLoad,EdgeFn,DBQuery,AutoSave fastNode
    class ProAgent fastNode
    class Concurrent,WizardSessions,AIRequests,Orgs,Uptime scaleNode
```

## Optimization Pipeline

End-to-end optimization strategy from client request through CDN, code splitting, caching, and database tuning.

```mermaid
---
config:
  theme: forest
---
flowchart TD
    User([User Request]) --> CDN

    subgraph CDN_Layer["Layer 1: CDN & Static Assets"]
        direction LR
        CDN["Vercel Edge CDN<br/>Global edge network"]
        StaticCache["Static Asset Caching<br/>Immutable hashes, long TTL"]
        Compression["Brotli / Gzip<br/>Compression"]
        CDN --> StaticCache --> Compression
    end

    Compression --> CodeSplit

    subgraph Frontend_Opt["Layer 2: Frontend Optimization"]
        direction LR
        CodeSplit["Code Splitting<br/>React.lazy() per route"]
        LazyLoad["Lazy Loading<br/>Recharts, carousels,<br/>heavy components"]
        TreeShake["Tree Shaking<br/>Vite 6 + SWC"]
        Prefetch["Route Prefetching<br/>Likely next routes"]
        CodeSplit --> LazyLoad --> TreeShake --> Prefetch
    end

    Prefetch --> EdgeOpt

    subgraph Edge_Opt["Layer 3: Edge Function Optimization"]
        direction LR
        EdgeOpt["Edge Function<br/>Keep-alive / Warming"]
        RequestValidation["Early Request<br/>Validation"]
        Streaming["Response Streaming<br/>for long AI calls"]
        EdgeOpt --> RequestValidation --> Streaming
    end

    Streaming --> AICache

    subgraph AI_Opt["Layer 4: AI Response Optimization"]
        direction LR
        AICache["ai_cache Table<br/>Cache AI responses<br/>by input hash"]
        CacheHit{Cache Hit?}
        CachedResponse["Return Cached<br/>Response Instantly"]
        FreshCall["Gemini API Call<br/>+ Cache Result"]
        AICache --> CacheHit
        CacheHit -->|Yes| CachedResponse
        CacheHit -->|No| FreshCall
    end

    FreshCall --> DBOpt

    subgraph DB_Opt["Layer 5: Database Optimization"]
        direction LR
        Indexes["Strategic Indexes<br/>org_id, user_id, created_at,<br/>composite indexes"]
        QueryOpt["Query Optimization<br/>Selective columns,<br/>pagination, limits"]
        ConnPool["Connection Pooling<br/>Supabase PgBouncer"]
        Indexes --> QueryOpt --> ConnPool
    end

    ConnPool --> Response([Optimized Response])

    classDef userNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef cdnNode fill:#1a5c3a,stroke:#84CC16,stroke-width:1px,color:#F1EEEA
    classDef feNode fill:#F1EEEA,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef edgeNode fill:#1a5c3a,stroke:#84CC16,stroke-width:1px,color:#F1EEEA
    classDef aiNode fill:#0A211F,stroke:#84CC16,stroke-width:1px,color:#84CC16
    classDef dbNode fill:#1a5c3a,stroke:#84CC16,stroke-width:1px,color:#F1EEEA
    classDef decisionNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#84CC16

    class User,Response userNode
    class CDN,StaticCache,Compression cdnNode
    class CodeSplit,LazyLoad,TreeShake,Prefetch feNode
    class EdgeOpt,RequestValidation,Streaming edgeNode
    class AICache,CachedResponse,FreshCall aiNode
    class Indexes,QueryOpt,ConnPool dbNode
    class CacheHit decisionNode
```

## Monitoring Architecture

Observability stack tracking AI usage, performance metrics, errors, and system health.

```mermaid
---
config:
  theme: forest
---
flowchart TB
    subgraph DataSources["Data Sources"]
        direction LR
        EdgeFunctions["Edge Functions<br/>17 functions"]
        ReactApp["React SPA<br/>Client-side"]
        SupabaseDB[("PostgreSQL<br/>58+ tables")]
        AuthService["Supabase Auth"]
    end

    subgraph Collection["Metrics Collection Layer"]
        direction TB

        subgraph AIMetrics["AI Run Logging"]
            direction LR
            AILog[("ai_run_logs Table")]
            AIFields["Fields:<br/>agent_name, model,<br/>tokens_in, tokens_out,<br/>latency_ms, result_status,<br/>cache_hit, error_type,<br/>org_id, created_at"]
            AILog --- AIFields
        end

        subgraph PerfMetrics["Performance Metrics"]
            direction LR
            EdgeLatency["Edge Function Latency<br/>p50, p95, p99"]
            DBLatency["DB Query Latency<br/>p50, p95, p99"]
            FrontendPerf["Frontend Metrics<br/>LCP, FID, CLS"]
            EdgeLatency --- DBLatency --- FrontendPerf
        end

        subgraph ErrorMetrics["Error Tracking"]
            direction LR
            APIErrors["API Error Rates<br/>4xx, 5xx by endpoint"]
            AIErrors["AI Failure Rates<br/>timeouts, malformed,<br/>truncated"]
            ClientErrors["Client-side Errors<br/>uncaught exceptions,<br/>network failures"]
            APIErrors --- AIErrors --- ClientErrors
        end
    end

    subgraph Alerts["Alerting & Response"]
        direction LR
        ErrorSpike["Error Rate Spike<br/>5xx > 1% threshold"]
        LatencySpike["Latency Spike<br/>p95 > 2x baseline"]
        AIFailure["AI Failure Rate<br/>> 5% threshold"]
        UptimeAlert["Uptime Monitor<br/>< 99.9% threshold"]
        ErrorSpike --- LatencySpike --- AIFailure --- UptimeAlert
    end

    EdgeFunctions --> AIMetrics
    EdgeFunctions --> PerfMetrics
    EdgeFunctions --> ErrorMetrics
    ReactApp --> PerfMetrics
    ReactApp --> ErrorMetrics
    SupabaseDB --> PerfMetrics
    AuthService --> ErrorMetrics

    AIMetrics --> Alerts
    PerfMetrics --> Alerts
    ErrorMetrics --> Alerts

    classDef sourceNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef collectionNode fill:#F1EEEA,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef alertNode fill:#991b1b,stroke:#ef4444,stroke-width:2px,color:#F1EEEA
    classDef dbNode fill:#1a5c3a,stroke:#84CC16,stroke-width:2px,color:#F1EEEA

    class EdgeFunctions,ReactApp,AuthService sourceNode
    class SupabaseDB dbNode
    class AILog,AIFields dbNode
    class EdgeLatency,DBLatency,FrontendPerf collectionNode
    class APIErrors,AIErrors,ClientErrors collectionNode
    class ErrorSpike,LatencySpike,AIFailure,UptimeAlert alertNode
```

## AI Token Usage & Cost Monitoring

```mermaid
---
config:
  theme: forest
---
flowchart LR
    subgraph AgentTypes["AI Agent Calls"]
        direction TB
        Flash["Gemini Flash<br/>Fast extraction<br/>Low token cost"]
        Pro["Gemini Pro<br/>Deep reasoning<br/>Higher token cost"]
    end

    subgraph Tracking["Per-Request Tracking"]
        direction TB
        TokensIn["tokens_in<br/>Input token count"]
        TokensOut["tokens_out<br/>Output token count"]
        Latency["latency_ms<br/>Total round-trip"]
        CacheHit["cache_hit<br/>boolean"]
        Model["model<br/>flash vs pro"]
    end

    subgraph Aggregation["Aggregated Metrics"]
        direction TB
        Daily["Daily token usage<br/>by model"]
        PerOrg["Per-org token usage<br/>for billing"]
        CacheRate["Cache hit rate<br/>target > 30%"]
        CostEstimate["Estimated cost<br/>per request"]
    end

    Flash --> Tracking
    Pro --> Tracking
    Tracking --> Aggregation

    classDef agentNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#84CC16
    classDef trackNode fill:#F1EEEA,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef aggNode fill:#1a5c3a,stroke:#84CC16,stroke-width:2px,color:#F1EEEA

    class Flash,Pro agentNode
    class TokensIn,TokensOut,Latency,CacheHit,Model trackNode
    class Daily,PerOrg,CacheRate,CostEstimate aggNode
```
