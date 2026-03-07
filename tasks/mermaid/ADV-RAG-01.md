---
id: ADV-RAG-01
phase: ADVANCED
prd_section: RAG Pipeline & Knowledge Base
title: RAG Pipeline & Knowledge Base
type: sequence
---

# RAG Pipeline & Knowledge Base

Document processing pipeline ingests uploads, chunks text, generates embeddings via `gemini-embedding-001`, and stores vectors in pgvector. The RAG retrieval flow enables agents to answer questions grounded in domain-specific knowledge.

## Document Processing Pipeline

```mermaid
---
config:
  theme: forest
---
sequenceDiagram
    autonumber
    actor User as Client / Admin
    participant Upload as Upload Handler<br/>Wizard Step 1 or Dashboard
    participant Storage as Supabase Storage<br/>File bucket
    participant Edge as document-processor<br/>Edge Function
    participant Chunker as Text Chunker<br/>Splitting logic
    participant Embed as Gemini Embedding<br/>gemini-embedding-001
    participant DB as Supabase PostgreSQL<br/>pgvector enabled

    User->>Upload: Upload document (PDF, DOCX, TXT)
    Upload->>Storage: Store original file
    Storage-->>Upload: File URL + metadata

    Upload->>Edge: Trigger processing (file_url, org_id, source)

    Edge->>Storage: Fetch file content
    Storage-->>Edge: Raw document bytes

    Edge->>Edge: Extract text from document

    Note over Edge: Supported formats:<br/>PDF, DOCX, TXT, MD, CSV

    Edge->>DB: INSERT into knowledge_documents<br/>(title, source, org_id, file_url, status: processing)

    Edge->>Chunker: Split text into chunks
    Note over Chunker: Chunking strategy:<br/>- Max 512 tokens per chunk<br/>- 50 token overlap<br/>- Respect paragraph boundaries<br/>- Preserve headers as metadata

    Chunker-->>Edge: Array of text chunks + metadata

    loop For each chunk
        Edge->>Embed: POST /embedding<br/>text chunk content
        Embed-->>Edge: 768-dim or 1536-dim vector

        Edge->>DB: INSERT into knowledge_chunks<br/>(document_id, content, embedding,<br/>chunk_index, metadata)
    end

    Edge->>DB: UPDATE knowledge_documents<br/>status: ready, chunk_count: N

    Edge-->>Upload: Processing complete
    Upload-->>User: Document indexed successfully
```

## Content Seeding — Industry Playbooks

```mermaid
---
config:
  theme: forest
---
flowchart TB
    subgraph Sources["Knowledge Content Sources"]
        direction TB
        Playbooks["Industry Playbooks<br/>10 per industry x 8 verticals<br/>= 80 playbooks total"]
        SOPs["Service SOPs<br/>Standard operating procedures<br/>per service family"]
        Custom["Client Uploads<br/>Wizard Step 1 documents,<br/>dashboard uploads"]
    end

    subgraph Processing["Document Processing"]
        direction TB
        Extract["Text Extraction<br/>Parse PDF, DOCX, TXT"]
        Chunk["Chunking<br/>512 tokens, 50 overlap"]
        EmbedGen["Embedding Generation<br/>gemini-embedding-001"]
    end

    subgraph Storage["Vector Storage"]
        direction TB
        KnowledgeDocs[("knowledge_documents<br/>id, title, source_type,<br/>org_id, industry_id,<br/>status, chunk_count")]
        KnowledgeChunks[("knowledge_chunks<br/>id, document_id, content,<br/>embedding vector(768/1536),<br/>chunk_index, metadata")]
    end

    Playbooks --> Extract
    SOPs --> Extract
    Custom --> Extract
    Extract --> Chunk --> EmbedGen
    EmbedGen --> KnowledgeDocs
    EmbedGen --> KnowledgeChunks

    subgraph Consumers["Agent Consumers"]
        direction LR
        Assistant["assistant Agent<br/>Client chat, general Q&A,<br/>RAG-powered responses"]
        IntelStream["intelligence-stream Agent<br/>Dashboard updates,<br/>context-aware insights"]
        AnyAgent["Any Agent<br/>Domain knowledge<br/>injection on demand"]
    end

    KnowledgeChunks --> Assistant
    KnowledgeChunks --> IntelStream
    KnowledgeChunks --> AnyAgent

    classDef sourceNode fill:#F1EEEA,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef processNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#84CC16
    classDef dbNode fill:#1a5c3a,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef agentNode fill:#84CC16,stroke:#0A211F,stroke-width:2px,color:#0A211F

    class Playbooks,SOPs,Custom sourceNode
    class Extract,Chunk,EmbedGen processNode
    class KnowledgeDocs,KnowledgeChunks dbNode
    class Assistant,IntelStream,AnyAgent agentNode
```

## RAG Retrieval Flow

```mermaid
---
config:
  theme: forest
---
sequenceDiagram
    autonumber
    actor User as User / Agent Trigger
    participant Agent as Agent<br/>e.g. assistant
    participant Edge as RAG Retrieval<br/>Edge Function
    participant Embed as Gemini Embedding<br/>gemini-embedding-001
    participant DB as Supabase PostgreSQL<br/>pgvector
    participant LLM as Gemini LLM<br/>gemini-3.1-pro-preview

    User->>Agent: Send query or trigger

    Agent->>Edge: Request RAG context<br/>(query, org_id, filters)

    Note over Edge: Filters may include:<br/>industry_id, source_type,<br/>document_id, date_range

    Edge->>Embed: POST /embedding<br/>query text
    Embed-->>Edge: Query vector (768/1536 dim)

    Edge->>DB: SELECT via match_knowledge_chunks()<br/>SQL function: cosine similarity

    Note over DB: pgvector query:<br/>1 - (embedding <=> query_vector)<br/>ORDER BY similarity DESC<br/>LIMIT top_k (default: 5)

    DB-->>Edge: Top-K chunks with similarity scores

    Edge->>Edge: Filter by similarity threshold (> 0.7)
    Edge->>Edge: Assemble context window

    Note over Edge: Context assembly:<br/>- Rank by similarity score<br/>- Deduplicate overlapping chunks<br/>- Include source metadata<br/>- Respect token budget

    Edge-->>Agent: Retrieved chunks + metadata

    Agent->>Agent: Inject chunks into system prompt

    Note over Agent: System prompt structure:<br/>1. Agent role + instructions<br/>2. Industry context (Layer 4)<br/>3. Retrieved knowledge chunks<br/>4. User query

    Agent->>LLM: Generate response with<br/>augmented context
    LLM-->>Agent: Grounded response

    Agent-->>User: Response with citations

    Note over User,Agent: Citations reference:<br/>document title, chunk index,<br/>similarity score
```

## Knowledge Base Data Model

```mermaid
---
config:
  theme: forest
---
erDiagram
    KNOWLEDGE_DOCUMENT ||--|{ KNOWLEDGE_CHUNK : contains
    KNOWLEDGE_DOCUMENT }o--|| ORGANIZATION : "belongs to"
    KNOWLEDGE_DOCUMENT }o--o| INDUSTRY : "tagged with"

    KNOWLEDGE_DOCUMENT {
        uuid id PK
        uuid org_id FK
        uuid industry_id FK "nullable"
        varchar title
        varchar source_type "playbook, sop, upload"
        varchar file_url
        varchar mime_type
        varchar status "processing, ready, error"
        int chunk_count
        int token_count
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }

    KNOWLEDGE_CHUNK {
        uuid id PK
        uuid document_id FK
        text content
        vector embedding "768 or 1536 dimensions"
        int chunk_index
        int token_count
        jsonb metadata "headers, page_number, section"
        timestamp created_at
    }

    CHAT_SESSION ||--|{ CHAT_MESSAGE : contains
    CHAT_SESSION }o--|| ORGANIZATION : "belongs to"

    CHAT_SESSION {
        uuid id PK
        uuid user_id FK
        uuid org_id FK
        varchar channel "widget, dashboard, cmd_k"
        varchar status "active, archived"
        jsonb context "project_id, page, role"
        timestamp created_at
        timestamp updated_at
    }

    CHAT_MESSAGE {
        uuid id PK
        uuid session_id FK
        varchar role "user, assistant, system"
        text content
        varchar agent_name "nullable"
        jsonb citations "document refs, chunk ids"
        jsonb tool_calls "function calling log"
        int token_count
        timestamp created_at
    }

    ORGANIZATION {
        uuid id PK
        varchar name
        varchar slug UK
        varchar plan_tier
    }

    INDUSTRY {
        uuid id PK
        varchar slug UK
        varchar name
    }
```
