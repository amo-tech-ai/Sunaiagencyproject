# Step 1: Business Context

## Overview

A form with 7 fields collecting foundational business information. Features auto-save with 500ms debounce, a left panel with progress and a real-time context card, and a right panel with field-specific guidance that changes on focus.

### Fields

| # | Field | Type | Required |
|---|-------|------|----------|
| 1 | Company Name | Text input | Yes |
| 2 | Website URL | Text input | No |
| 3 | Industry | Select / Dropdown | Yes |
| 4 | Company Size | Select / Dropdown | Yes |
| 5 | Primary Goal | Select / Textarea | Yes |
| 6 | Biggest Challenge | Select / Textarea | Yes |
| 7 | Document Upload | File upload | No |

**Continue requires:** company_name, industry, company_size, primary_goal, biggest_challenge

**AI features on this step:**
- URL Context: When user enters website URL, Gemini reads the full page content (HTML, PDFs, images up to 34MB, max 20 URLs)
- Google Search: Gemini searches for company context, competitors, industry data, and market positioning
- Both tools fire together in a single analyze-business Edge Function call (gemini-3-flash-preview)
- Results cached in ai_cache, displayed in right panel, and can auto-fill industry + company size fields

---

## 1. Form Field Flow

```mermaid
%%{init: {'theme': 'forest'}}%%
flowchart TD
    START[Step 1: Business Context] --> F1

    F1[1. Company Name<br/>Text Input<br/>REQUIRED] --> F2
    F2[2. Website URL<br/>Text Input<br/>Optional] --> F3
    F3[3. Industry<br/>Select / Dropdown<br/>REQUIRED] --> F4
    F4[4. Company Size<br/>Select / Dropdown<br/>REQUIRED] --> F5
    F5[5. Primary Goal<br/>Select / Textarea<br/>REQUIRED] --> F6
    F6[6. Biggest Challenge<br/>Select / Textarea<br/>REQUIRED] --> F7
    F7[7. Document Upload<br/>File Upload<br/>Optional] --> VALIDATE

    VALIDATE{All required fields<br/>filled?}

    VALIDATE -- No --> DISABLED[Continue button disabled<br/>Show missing field indicators]
    DISABLED --> HIGHLIGHT[Highlight first<br/>empty required field]
    HIGHLIGHT --> F1

    VALIDATE -- Yes --> ENABLED[Continue button enabled]
    ENABLED --> CLICK[User clicks Continue]
    CLICK --> FINAL_SAVE[Final save all answers]
    FINAL_SAVE --> NEXT[Navigate to Step 2:<br/>Current Tech & Pain Points]

    style F1 fill:#2d6a4f,color:#fff
    style F3 fill:#2d6a4f,color:#fff
    style F4 fill:#2d6a4f,color:#fff
    style F5 fill:#2d6a4f,color:#fff
    style F6 fill:#2d6a4f,color:#fff
    style F2 fill:#52796f,color:#fff
    style F7 fill:#52796f,color:#fff
```

---

## 2. Auto-Save Sequence

```mermaid
%%{init: {'theme': 'forest'}}%%
sequenceDiagram
    actor User
    participant Form as Form Field
    participant Debounce as Debounce Timer<br/>500ms
    participant API as Save Handler
    participant DB as wizard_answers<br/>table
    participant LeftPanel as Left Panel<br/>Context Card
    participant Indicator as Save Indicator

    User->>Form: Types / selects value
    Form->>Debounce: Start 500ms timer
    Indicator->>Indicator: Show "Unsaved changes"

    User->>Form: Types again (within 500ms)
    Form->>Debounce: Reset 500ms timer

    Note over Debounce: 500ms elapses with no input

    Debounce->>API: Trigger save
    Indicator->>Indicator: Show "Saving..."

    API->>DB: UPSERT wizard_answers<br/>SET answer_data = {field: value}<br/>WHERE session_id AND step = 1 AND field_key

    DB-->>API: Confirm saved

    API->>LeftPanel: Update context card<br/>with new field value
    LeftPanel->>LeftPanel: Re-render context card<br/>with filled data

    API->>Indicator: Update status
    Indicator->>Indicator: Show "All changes saved" checkmark

    Note over Indicator: After 3 seconds
    Indicator->>Indicator: Fade to idle state
```

---

## 3. URL Analysis Flow (URL Context + Google Search)

```mermaid
%%{init: {'theme': 'forest'}}%%
sequenceDiagram
    actor User
    participant Form as Website URL Field
    participant Hook as useUrlAnalysis Hook
    participant EF as analyze-business<br/>Edge Function
    participant Gemini as Gemini API<br/>gemini-3-flash-preview
    participant Web as Target Website
    participant Search as Google Search
    participant Cache as ai_cache table
    participant Panel as Right Panel

    User->>Form: Enters URL and moves to next field (blur)
    Form->>Hook: onBlur with valid URL

    Hook->>Hook: Validate URL format<br/>(starts with http/https)
    Hook->>Hook: Cancel any previous<br/>analysis request
    Hook->>Panel: Show loading skeleton<br/>"Analyzing your website..."

    Hook->>EF: POST /analyze-business<br/>{url, session_id}
    EF->>EF: Verify JWT token

    Note over EF,Gemini: Single Gemini call with both tools enabled

    EF->>Gemini: generateContent()<br/>tools: [url_context, google_search]<br/>prompt: "Analyze this company website:<br/>{url}"

    par URL Context (deep page analysis)
        Gemini->>Web: Fetch full page content<br/>(HTML, images, PDFs)
        Web-->>Gemini: Page content (up to 34MB)
        Note over Gemini: Reads page like a human:<br/>products, pricing, team,<br/>brand, technology stack
    and Google Search (broad market context)
        Gemini->>Search: Auto-generated queries:<br/>"[company] industry"<br/>"[company] competitors"<br/>"[company] size employees"
        Search-->>Gemini: Search results with<br/>groundingChunks + citations
        Note over Gemini: Market positioning,<br/>competitor landscape,<br/>recent news, industry data
    end

    Gemini-->>EF: Structured JSON response<br/>{company_description,<br/>detected_industry,<br/>products_services,<br/>team_size_estimate,<br/>tech_signals,<br/>ai_opportunities,<br/>grounding_sources}

    EF->>Cache: UPSERT ai_cache<br/>key: "url-analysis:{session_id}"<br/>result: structured analysis
    EF->>EF: Log to ai_run_logs<br/>(tokens, model, duration)

    EF-->>Hook: Return analysis result

    Hook->>Panel: Display "Company Analysis" card<br/>- Description<br/>- Industry (detected)<br/>- Products/Services<br/>- Team size estimate<br/>- Tech signals<br/>- AI opportunities

    Hook->>Form: Offer auto-fill suggestions<br/>(industry, company size)

    alt URL Context fails (private page, timeout)
        Gemini-->>EF: url_retrieval_status: FAILED
        Note over EF: Falls back to Google Search results only
        EF-->>Hook: Partial analysis (search only)
        Hook->>Panel: Show available insights<br/>with "Limited analysis" note
    end

    alt Both fail (no data available)
        EF-->>Hook: Error / empty result
        Hook->>Panel: Show static guidance<br/>(no error shown to user)
    end
```

---

## 4. Right Panel State

```mermaid
%%{init: {'theme': 'forest'}}%%
stateDiagram-v2
    [*] --> Default

    Default: Default State
    Default: "Tell us about your business"
    Default: General overview of Step 1 purpose

    CompanyName: Company Name Focused
    CompanyName: "What's your company called?"
    CompanyName: Tips for brand consistency

    Website: Website URL Focused
    Website: "Share your online presence"
    Website: We'll analyze your site for AI opportunities

    Industry: Industry Focused
    Industry: "What industry are you in?"
    Industry: Industry-specific AI use cases + examples

    Size: Company Size Focused
    Size: "How large is your team?"
    Size: Scale-appropriate recommendations

    Goal: Primary Goal Focused
    Goal: "What do you want to achieve?"
    Goal: Goal-aligned AI solution previews

    Challenge: Biggest Challenge Focused
    Challenge: "What's holding you back?"
    Challenge: How AI addresses common challenges

    Upload: Document Upload Focused
    Upload: "Share relevant documents"
    Upload: Accepted formats, size limits, examples

    Default --> CompanyName: Focus company_name
    Default --> Website: Focus website
    Default --> Industry: Focus industry
    Default --> Size: Focus company_size
    Default --> Goal: Focus primary_goal
    Default --> Challenge: Focus biggest_challenge
    Default --> Upload: Focus document_upload

    CompanyName --> Default: Blur (no other focus)
    Website --> Default: Blur (no other focus)
    Industry --> Default: Blur (no other focus)
    Size --> Default: Blur (no other focus)
    Goal --> Default: Blur (no other focus)
    Challenge --> Default: Blur (no other focus)
    Upload --> Default: Blur (no other focus)

    CompanyName --> Website: Focus website
    CompanyName --> Industry: Focus industry
    Website --> Industry: Focus industry
    Industry --> Size: Focus company_size
    Size --> Goal: Focus primary_goal
    Goal --> Challenge: Focus biggest_challenge
    Challenge --> Upload: Focus document_upload
    Upload --> CompanyName: Focus company_name
```

---

## 5. Step 1 Data Model

```mermaid
%%{init: {'theme': 'forest'}}%%
erDiagram
    wizard_sessions {
        uuid id PK
        uuid org_id FK
        uuid created_by FK
        varchar status "in_progress | completed | abandoned"
        integer current_step "1-6"
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }

    wizard_answers {
        uuid id PK
        uuid session_id FK
        integer step_number "1 for Business Context"
        varchar field_key "company_name | website | industry | company_size | primary_goal | biggest_challenge | document_upload"
        jsonb answer_data "Stored field value"
        boolean is_required
        timestamp created_at
        timestamp updated_at
    }

    documents {
        uuid id PK
        uuid session_id FK
        uuid uploaded_by FK
        varchar file_name
        varchar file_type "pdf | docx | xlsx | csv | txt"
        bigint file_size "bytes"
        varchar storage_path "Supabase Storage path"
        varchar status "uploading | uploaded | processing | processed | error"
        jsonb extracted_data "Parsed content after processing"
        jsonb metadata "original_name, mime_type, etc."
        timestamp created_at
    }

    organizations {
        uuid id PK
        varchar name
        varchar website
        varchar industry
        varchar company_size
        timestamp created_at
    }

    profiles {
        uuid id PK
        uuid user_id FK "Supabase auth.users"
        varchar name
        varchar email
        uuid org_id FK
        timestamp created_at
    }

    organizations ||--o{ wizard_sessions : "has many"
    wizard_sessions ||--o{ wizard_answers : "has many"
    wizard_sessions ||--o{ documents : "has many"
    organizations ||--o{ profiles : "has members"
    profiles ||--o{ wizard_sessions : "created_by"
    profiles ||--o{ documents : "uploaded_by"
```
