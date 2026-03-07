---
id: PROD-ERR-01
phase: PRODUCTION
prd_section: Error Handling & Recovery
title: Error Handling & Recovery Patterns
type: sequence
---

# Error Handling & Recovery Patterns

Production-hardened error handling across the Sun AI Agency platform: the callGemini retry pipeline, Edge Function error responses, frontend error recovery, and fallback chains.

## callGemini Retry Flow — Production-Hardened AI Pipeline

The core AI invocation pattern with 5 levels of defense: retry with backoff, timeout handling, truncation recovery, JSON repair, and fallback responses.

```mermaid
---
config:
  theme: forest
---
sequenceDiagram
    autonumber
    participant EF as Edge Function
    participant CG as callGemini()
    participant GM as Gemini API
    participant JR as JSON Repair
    participant FB as Fallback Handler
    participant DB as ai_run_logs

    EF->>+CG: Call with prompt + schema

    Note over CG: Attempt 1 of 3

    CG->>+GM: POST /generateContent
    Note over CG,GM: Timeout: 30s (Flash) / 60s (Pro)

    alt Gemini responds successfully
        GM-->>-CG: 200 OK + JSON response

        CG->>CG: Check if response truncated
        alt Response truncated (incomplete JSON)
            Note over CG: Truncation Recovery
            CG->>+GM: Retry with "continue from..." prompt
            GM-->>-CG: Continuation response
            CG->>CG: Merge original + continuation
        end

        CG->>CG: Attempt JSON.parse()

        alt JSON parse fails
            Note over CG,JR: 5-Level JSON Repair
            CG->>+JR: Level 1: Strip markdown fences
            JR-->>CG: Try parse
            alt Still fails
                CG->>JR: Level 2: Fix trailing commas
                JR-->>CG: Try parse
            end
            alt Still fails
                CG->>JR: Level 3: Balance brackets
                JR-->>CG: Try parse
            end
            alt Still fails
                CG->>JR: Level 4: Extract JSON substring
                JR-->>CG: Try parse
            end
            alt Still fails
                CG->>JR: Level 5: Regex key-value extraction
                JR-->>-CG: Build minimal object
            end
        end

        CG->>+DB: Log success + tokens + latency
        DB-->>-CG: Logged

        CG-->>-EF: Return parsed response

    else Gemini timeout
        GM--xCG: Timeout after limit

        Note over CG: Retry with exponential backoff
        CG->>CG: Wait 1s (attempt 1)

        CG->>+GM: Retry attempt 2
        alt Timeout again
            GM--xCG: Timeout
            CG->>CG: Wait 2s (attempt 2)
            CG->>+GM: Retry attempt 3
            alt Timeout again
                GM--xCG: Timeout
                Note over CG,FB: All retries exhausted
                CG->>+FB: Generate fallback response
                FB-->>-CG: Static guidance template
                CG->>+DB: Log failure: timeout, 3 attempts
                DB-->>-CG: Logged
                CG-->>EF: Return fallback response
            else Success
                GM-->>-CG: 200 OK
                CG-->>EF: Return parsed response
            end
        else Success
            GM-->>-CG: 200 OK
            CG-->>EF: Return parsed response
        end

    else Gemini API error (429, 500, 503)
        GM-->>CG: Error response

        Note over CG: Retry with exponential backoff
        loop Up to 3 attempts with 1s, 2s, 4s backoff
            CG->>GM: Retry request
        end

        alt All retries fail
            CG->>+FB: Generate fallback response
            FB-->>-CG: Static guidance template
            CG->>+DB: Log failure: api_error, attempts
            DB-->>-CG: Logged
            CG-->>EF: Return fallback with is_fallback flag
        end
    end
```

## Edge Function Error Response Patterns

Standardized error responses across all 17 Edge Functions with appropriate HTTP status codes and masked internal details.

```mermaid
---
config:
  theme: forest
---
flowchart TD
    Request([Incoming Request]) --> Validate

    subgraph Validation["Request Validation"]
        direction TB
        Validate{Valid request<br/>structure?}
        Validate -->|No| E400["400 Bad Request<br/>Validation errors listed<br/>No internal details"]
        Validate -->|Yes| AuthCheck
    end

    subgraph Authentication["Authentication"]
        direction TB
        AuthCheck{JWT present<br/>and valid?}
        AuthCheck -->|No| E401["401 Unauthorized<br/>Invalid or missing token"]
        AuthCheck -->|Yes| RateCheck
    end

    subgraph RateLimiting["Rate Limiting"]
        direction TB
        RateCheck{Under rate<br/>limit?}
        RateCheck -->|No| E429["429 Too Many Requests<br/>Retry-After header set"]
        RateCheck -->|Yes| Process
    end

    subgraph Processing["Business Logic"]
        direction TB
        Process["Process Request"]
        Process --> AICall{AI call<br/>needed?}

        AICall -->|Yes| GeminiCall["callGemini()"]
        GeminiCall --> GeminiResult{Success?}
        GeminiResult -->|Timeout after retries| GeminiFallback["Use fallback response<br/>Set is_fallback: true"]
        GeminiResult -->|Success| BuildResponse

        AICall -->|No| DBCall["Database Operation"]
        DBCall --> DBResult{Success?}
        DBResult -->|Error| E500Internal["500 Internal Error<br/>Masked: Something went wrong<br/>Logged: Full stack trace"]
        DBResult -->|Success| BuildResponse

        GeminiFallback --> BuildResponse["Build Success Response"]
    end

    BuildResponse --> E200(["200 OK<br/>+ response body"])

    subgraph ErrorCodes["Error Response Standards"]
        direction LR
        E400
        E401
        E429
        E500Internal
        E500["Standard Error Shape:<br/>status, message, code<br/>Never: stack traces,<br/>table names, query text"]
    end

    E400 -.-> E500
    E401 -.-> E500
    E429 -.-> E500
    E500Internal -.-> E500

    classDef requestNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef successNode fill:#1a5c3a,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef errorNode fill:#991b1b,stroke:#ef4444,stroke-width:2px,color:#F1EEEA
    classDef processNode fill:#F1EEEA,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef decisionNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#84CC16
    classDef warningNode fill:#92400e,stroke:#f59e0b,stroke-width:2px,color:#F1EEEA
    classDef standardNode fill:#0A211F,stroke:#F1EEEA,stroke-width:1px,color:#F1EEEA

    class Request requestNode
    class E200 successNode
    class E400,E401,E429,E500Internal errorNode
    class E500 standardNode
    class Process,GeminiCall,DBCall,BuildResponse processNode
    class Validate,AuthCheck,RateCheck,AICall,GeminiResult,DBResult decisionNode
    class GeminiFallback warningNode
```

## Frontend Error Handling Decision Tree

Client-side error recovery strategy with skeleton screens, retry mechanisms, and graceful degradation.

```mermaid
---
config:
  theme: forest
---
flowchart TD
    Action([User Action]) --> APICall["Make API Call"]
    APICall --> Result{Response?}

    %% Network Failure Branch
    Result -->|Network Error| NetFail["Show: Connection lost banner"]
    NetFail --> NetRetry{Auto-retry<br/>available?}
    NetRetry -->|Yes, attempt < 3| AutoRetry["Auto-retry with<br/>exponential backoff"]
    AutoRetry --> APICall
    NetRetry -->|No, max reached| ManualRetry["Show: Retry button<br/>+ offline indicator"]
    ManualRetry -->|User clicks Retry| APICall

    %% Timeout Branch
    Result -->|Timeout| TimeoutCheck{Which operation<br/>timed out?}
    TimeoutCheck -->|AI Agent Call| AISkeleton["Show: Skeleton screen<br/>+ Generating with AI message"]
    AISkeleton --> AIRetry["Auto-retry once<br/>with extended timeout"]
    AIRetry --> AIResult{Success?}
    AIResult -->|Yes| RenderAI["Render AI response"]
    AIResult -->|No| AIFallback["Show: Partial results<br/>+ Manual retry button"]

    TimeoutCheck -->|Data Load| DataSkeleton["Show: Skeleton screen"]
    DataSkeleton --> DataRetry["Auto-retry once"]
    DataRetry --> DataResult{Success?}
    DataResult -->|Yes| RenderData["Render data"]
    DataResult -->|No| DataError["Show: Error state<br/>+ Retry button"]

    %% Auto-save Failure
    Result -->|Auto-save Failed| SaveQueue["Queue failed save"]
    SaveQueue --> SaveRetry["Retry in 5 seconds"]
    SaveRetry --> SaveResult{Success?}
    SaveResult -->|Yes| SaveConfirm["Show: Saved indicator"]
    SaveResult -->|No, attempt < 5| SaveRetry
    SaveResult -->|No, max reached| SaveWarning["Show: Unsaved changes warning<br/>+ Manual save button"]

    %% Malformed Response
    Result -->|Malformed Data| ParseError["Log parse error"]
    ParseError --> HasFallback{Fallback UI<br/>available?}
    HasFallback -->|Yes| FallbackUI["Render fallback component<br/>with partial data"]
    HasFallback -->|No| GenericError["Show: Something went wrong<br/>+ Retry button"]

    %% HTTP Errors
    Result -->|401| AuthRedirect["Redirect to login<br/>Clear stale session"]
    Result -->|429| RateMsg["Show: Please wait message<br/>Auto-retry after Retry-After"]
    Result -->|500| ServerError["Show: Service unavailable<br/>+ Retry button"]

    %% Success
    Result -->|200 OK| SuccessCheck{is_fallback<br/>flag set?}
    SuccessCheck -->|Yes| PartialSuccess["Render with fallback banner<br/>AI results may be limited"]
    SuccessCheck -->|No| FullSuccess(["Render full response"])

    %% Empty State
    Result -->|200 OK, empty data| EmptyState["Show: Empty state<br/>with helpful CTA<br/>e.g. Start your first project"]

    classDef actionNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef successNode fill:#1a5c3a,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef errorNode fill:#991b1b,stroke:#ef4444,stroke-width:2px,color:#F1EEEA
    classDef warningNode fill:#92400e,stroke:#f59e0b,stroke-width:2px,color:#F1EEEA
    classDef processNode fill:#F1EEEA,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef decisionNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#84CC16
    classDef skeletonNode fill:#374151,stroke:#9ca3af,stroke-width:2px,color:#F1EEEA
    classDef retryNode fill:#1e3a5f,stroke:#3b82f6,stroke-width:2px,color:#F1EEEA

    class Action,FullSuccess actionNode
    class RenderAI,RenderData,SaveConfirm,PartialSuccess successNode
    class NetFail,GenericError,ServerError,AuthRedirect errorNode
    class SaveWarning,AIFallback,DataError,RateMsg warningNode
    class APICall,ParseError,SaveQueue processNode
    class Result,NetRetry,TimeoutCheck,AIResult,DataResult,SaveResult,HasFallback,SuccessCheck decisionNode
    class AISkeleton,DataSkeleton skeletonNode
    class AutoRetry,AIRetry,DataRetry,SaveRetry,ManualRetry retryNode
    class FallbackUI,EmptyState processNode
```

## Fallback Chains

When primary services fail, the system degrades gracefully through ordered fallback chains.

```mermaid
---
config:
  theme: forest
---
flowchart LR
    subgraph URLContext["URL Context Fallback Chain"]
        direction TB
        UC1["1. URL Context API<br/>Full competitor analysis<br/>from page content"] -->|Fails / Timeout| UC2["2. Google Search API<br/>Search-based insights<br/>from snippets only"]
        UC2 -->|Fails / Timeout| UC3["3. Static Guidance<br/>Generic industry<br/>recommendations"]
    end

    subgraph AICache["AI Cache Fallback Chain"]
        direction TB
        AC1["1. ai_cache Table Lookup<br/>Instant cached response<br/>by input hash"] -->|Cache Miss| AC2["2. Synchronous Gemini Call<br/>Fresh AI generation<br/>with retry logic"]
        AC2 -->|Timeout / Failure| AC3["3. Generic Response<br/>Template-based output<br/>is_fallback: true"]
    end

    subgraph Stripe["Stripe Webhook Fallback Chain"]
        direction TB
        SW1["1. Process Webhook<br/>Immediately on receipt"] -->|Processing Fails| SW2["2. Retry Queue<br/>Exponential backoff<br/>up to 5 attempts"]
        SW2 -->|All Retries Fail| SW3["3. Manual Review Flag<br/>Alert + admin dashboard<br/>entry for manual resolution"]
    end

    subgraph AutoSave["Auto-save Fallback Chain"]
        direction TB
        AS1["1. Immediate Persist<br/>Save to Supabase<br/>on each change"] -->|Network Failure| AS2["2. Local Queue<br/>Store in memory<br/>retry in 5s"]
        AS2 -->|Persistent Failure| AS3["3. localStorage Backup<br/>Prevent data loss<br/>+ unsaved warning"]
    end

    classDef primaryNode fill:#1a5c3a,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef secondaryNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#84CC16
    classDef fallbackNode fill:#92400e,stroke:#f59e0b,stroke-width:2px,color:#F1EEEA

    class UC1,AC1,SW1,AS1 primaryNode
    class UC2,AC2,SW2,AS2 secondaryNode
    class UC3,AC3,SW3,AS3 fallbackNode
```
