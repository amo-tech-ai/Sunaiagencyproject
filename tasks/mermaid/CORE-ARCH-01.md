---
id: CORE-ARCH-01
phase: CORE
prd_section: System Architecture
title: System Architecture — C4 Context Level
type: C4Context
---

# System Architecture — C4 Context Level

High-level view of the Sun AI Agency platform showing all actors, the core system, and external dependencies.

## C4 Context Diagram

```mermaid
C4Context
    title Sun AI Agency Platform — System Context

    Person(client, "Client User", "Business owner seeking AI strategy and implementation services")
    Person(agency, "Agency Consultant", "Sun AI team member managing projects and clients")
    Person(guest, "Guest Visitor", "Unauthenticated visitor browsing the marketing site")

    System(platform, "Sun AI Agency Platform", "Multi-tenant SaaS platform for AI strategy consulting: wizard-driven discovery, AI-generated briefs, project management, and client dashboards")

    System_Ext(supabase, "Supabase", "PostgreSQL 58+ tables, Auth, Edge Functions x17, Storage, Realtime, pgvector embeddings, Row Level Security")
    System_Ext(gemini, "Gemini AI", "gemini-3.1-pro-preview for reasoning and scoring, gemini-3-flash-preview for speed and extraction")
    System_Ext(stripe, "Stripe", "Checkout Sessions, Subscriptions, Connect for payouts, Invoicing, Payment Intents, Webhooks")
    System_Ext(google, "Google APIs", "Google Search for market research, URL Context for competitor analysis")
    System_Ext(vercel, "Vercel", "Edge deployment, SPA hosting, rewrite rules, environment variables")

    Rel(guest, platform, "Browses marketing site, views services and industries")
    Rel(client, platform, "Completes wizard, reviews briefs, tracks project progress")
    Rel(agency, platform, "Manages clients, reviews AI output, assigns tasks, monitors analytics")

    Rel(platform, supabase, "Auth, data persistence, realtime subscriptions, edge function invocation", "HTTPS / WebSocket")
    Rel(platform, gemini, "AI analysis, brief generation, diagnostics, scoring, roadmap creation", "HTTPS / REST")
    Rel(platform, stripe, "Payment processing, subscription management, invoice generation", "HTTPS / REST")
    Rel(platform, google, "Market research queries, competitor URL analysis", "HTTPS / REST")
    Rel(platform, vercel, "Static asset hosting, SPA routing, edge middleware", "HTTPS")

    UpdateRelStyle(guest, platform, $offsetX="-80", $offsetY="-20")
    UpdateRelStyle(client, platform, $offsetX="0", $offsetY="-20")
    UpdateRelStyle(agency, platform, $offsetX="80", $offsetY="-20")
```

## Container-Level Overview (Flowchart)

```mermaid
---
config:
  theme: forest
---
flowchart TB
    subgraph Users
        direction LR
        Guest([Guest Visitor])
        Client([Client User])
        Agency([Agency Consultant])
    end

    subgraph SPA["React SPA — Vite 6 / React 18 / TypeScript"]
        direction TB
        Marketing["Marketing Site<br/>React Router v7, Tailwind v4, shadcn/ui"]
        AppShell["App Shell /app/*<br/>Protected routes, Layout, Auth guards"]
        Wizard["Wizard Module<br/>5-step discovery, 3-panel layout"]
        Dashboard["Dashboard Module<br/>Project tracking, briefs, roadmaps"]
        AgencyPanel["Agency Panel<br/>CRM, analytics, task management"]
    end

    subgraph Supabase["Supabase Backend"]
        direction TB
        Auth["Auth Service<br/>Email/password, Google OAuth, JWT"]
        DB[("PostgreSQL<br/>58+ tables, RLS, pgvector")]
        EdgeFns["Edge Functions x17<br/>Deno runtime, JWT verification"]
        Storage["Storage<br/>File uploads, avatars"]
        Realtime["Realtime<br/>Presence, broadcast, DB changes"]
    end

    subgraph External["External Services"]
        direction TB
        Gemini["Gemini AI<br/>Pro: reasoning<br/>Flash: extraction"]
        Stripe["Stripe<br/>Checkout, Subscriptions<br/>Connect, Invoicing"]
        GoogleAPIs["Google APIs<br/>Search, URL Context"]
    end

    subgraph Deploy["Deployment"]
        Vercel["Vercel<br/>Edge CDN, SPA rewrites"]
    end

    Guest --> Marketing
    Client --> AppShell
    Agency --> AppShell
    AppShell --> Wizard
    AppShell --> Dashboard
    AppShell --> AgencyPanel

    Marketing --> Vercel
    AppShell --> Auth
    Wizard --> EdgeFns
    Dashboard --> EdgeFns
    AgencyPanel --> EdgeFns
    EdgeFns --> DB
    EdgeFns --> Gemini
    EdgeFns --> GoogleAPIs
    Auth --> DB
    Realtime --> DB
    AppShell --> Stripe

    classDef userNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef spaNode fill:#F1EEEA,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef supaNode fill:#1a5c3a,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef extNode fill:#2d2d2d,stroke:#84CC16,stroke-width:1px,color:#F1EEEA
    classDef deployNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#84CC16

    class Guest,Client,Agency userNode
    class Marketing,AppShell,Wizard,Dashboard,AgencyPanel spaNode
    class Auth,DB,EdgeFns,Storage,Realtime supaNode
    class Gemini,Stripe,GoogleAPIs extNode
    class Vercel deployNode
```
