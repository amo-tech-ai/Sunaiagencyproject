---
id: ADV-REV-01
phase: ADVANCED
prd_section: Revenue & Billing
title: Revenue & Billing — Stripe Integration
type: sequence
---

# Revenue & Billing — Stripe Integration

Stripe powers all payment processing: Checkout Sessions for one-time payments, Subscriptions for recurring billing, and Webhooks for event-driven state synchronization. The agency earns through five distinct revenue streams.

## Stripe Webhook Processing Flow

```mermaid
---
config:
  theme: forest
---
sequenceDiagram
    autonumber
    participant Stripe as Stripe API
    participant Webhook as stripe-webhook<br/>Edge Function
    participant DB as Supabase<br/>PostgreSQL
    participant Notify as Notification<br/>Service

    Note over Stripe,Notify: One-Time Payment Flow (Consultations / Implementations)

    Stripe->>Webhook: POST /stripe-webhook<br/>checkout.session.completed
    Webhook->>Webhook: Verify webhook signature
    Webhook->>DB: Look up session metadata (client_id, service_type)

    alt Consultation Payment ($500-$2000)
        Webhook->>DB: INSERT into payments (type: consultation)
        Webhook->>DB: UPDATE deal stage to 'won'
        Webhook->>Notify: Send payment confirmation email
    else Implementation Payment ($5K-$100K+)
        Webhook->>DB: INSERT into payments (type: implementation)
        Webhook->>DB: CREATE project record from deal
        Webhook->>DB: UPDATE deal stage to 'won'
        Webhook->>Notify: Send onboarding email + project link
    end

    Note over Stripe,Notify: Subscription Flow (Recurring Billing)

    Stripe->>Webhook: POST /stripe-webhook<br/>customer.subscription.created
    Webhook->>DB: INSERT into subscriptions
    Webhook->>DB: UPDATE organization plan tier
    Webhook->>Notify: Send welcome to plan email

    Stripe->>Webhook: POST /stripe-webhook<br/>invoice.payment_succeeded
    Webhook->>DB: INSERT into invoices (status: paid)
    Webhook->>DB: UPDATE subscription.current_period_end

    Stripe->>Webhook: POST /stripe-webhook<br/>invoice.payment_failed
    Webhook->>DB: UPDATE invoice status to 'failed'
    Webhook->>DB: UPDATE subscription status to 'past_due'
    Webhook->>Notify: Send payment failure alert to client

    Stripe->>Webhook: POST /stripe-webhook<br/>customer.subscription.deleted
    Webhook->>DB: UPDATE subscription status to 'cancelled'
    Webhook->>DB: Downgrade organization to free tier
    Webhook->>Notify: Send cancellation confirmation
```

## Revenue Streams & Billing Pipeline

```mermaid
---
config:
  theme: forest
---
flowchart TB
    subgraph RevenueStreams["Five Revenue Streams"]
        direction TB

        subgraph OneTime["One-Time Payments"]
            direction LR
            Consult["Consultations<br/>$500 - $2,000<br/>Checkout Session"]
            Implement["Implementations<br/>$5K - $100K+<br/>Checkout Session<br/>or Invoice"]
        end

        subgraph Recurring["Recurring Subscriptions"]
            direction LR
            Starter["Starter Plan<br/>$99 - $299/month<br/>1-50 employees"]
            Professional["Professional Plan<br/>$299 - $999/month<br/>51-200 employees"]
            Enterprise["Enterprise Plan<br/>Custom pricing<br/>200+ employees"]
        end

        subgraph UsageBased["Usage-Based"]
            direction LR
            WhatsApp["WhatsApp Automation<br/>$0.002 - $0.005/message<br/>Metered billing"]
        end

        subgraph Support["Premium Support"]
            direction LR
            SupportTier["Tiered SLA<br/>$299 - $2,499/month<br/>Response time guarantees"]
        end
    end

    subgraph StripeIntegration["Stripe Integration Layer"]
        direction TB
        Connect["Stripe Connect<br/>Account linking"]
        Checkout["Checkout Sessions<br/>One-time payments"]
        Subs["Subscriptions API<br/>Recurring billing"]
        Metered["Usage Records API<br/>Metered billing"]
        Invoicing["Invoicing API<br/>Enterprise billing"]
    end

    subgraph WebhookHandler["Webhook Edge Function"]
        direction TB
        Verify["Verify Signature"]
        Route["Route by event type"]
        Sync["Sync to database"]
    end

    subgraph DataSync["Synced Tables"]
        direction LR
        SubsTable[("subscriptions<br/>plan, status, period")]
        InvoicesTable[("invoices<br/>amount, status, PDF")]
        PaymentsTable[("payments<br/>type, amount, metadata")]
    end

    Consult --> Checkout
    Implement --> Checkout
    Implement --> Invoicing
    Starter --> Subs
    Professional --> Subs
    Enterprise --> Subs
    Enterprise --> Invoicing
    WhatsApp --> Metered
    SupportTier --> Subs

    Checkout --> WebhookHandler
    Subs --> WebhookHandler
    Metered --> WebhookHandler
    Invoicing --> WebhookHandler

    Verify --> Route --> Sync
    Sync --> SubsTable
    Sync --> InvoicesTable
    Sync --> PaymentsTable

    classDef revenueNode fill:#F1EEEA,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef stripeNode fill:#635bff,stroke:#0A211F,stroke-width:2px,color:#FFFFFF
    classDef webhookNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#84CC16
    classDef dbNode fill:#1a5c3a,stroke:#84CC16,stroke-width:2px,color:#F1EEEA

    class Consult,Implement,Starter,Professional,Enterprise,WhatsApp,SupportTier revenueNode
    class Connect,Checkout,Subs,Metered,Invoicing stripeNode
    class Verify,Route,Sync webhookNode
    class SubsTable,InvoicesTable,PaymentsTable dbNode
```

## Client Billing & Agency Analytics Views

```mermaid
---
config:
  theme: forest
---
flowchart LR
    subgraph ClientView["/app/dashboard/billing — Client Billing Tab"]
        direction TB
        InvoiceList["Invoice List<br/>Date, amount, status,<br/>PDF download"]
        PaymentStatus["Payment Status<br/>Paid, pending, failed,<br/>retry action"]
        SubMgmt["Subscription Management<br/>Current plan, usage,<br/>upgrade/downgrade,<br/>cancel"]
    end

    subgraph AgencyView["/admin/analytics — Agency Analytics"]
        direction TB
        RevTrends["Revenue Trends<br/>Recharts line/bar charts,<br/>MRR, ARR, growth rate"]
        ConvFunnel["Conversion Funnel<br/>Lead to Won ratio,<br/>stage drop-off analysis"]
        AIUsage["AI Token Usage<br/>Per-agent token consumption,<br/>cost tracking, budget alerts"]
        CompletionRates["Completion Rates<br/>Wizard completion %,<br/>onboarding completion %,<br/>project delivery %"]
    end

    subgraph DataSources["Data Sources"]
        direction TB
        StripeAPI["Stripe API<br/>Real-time balance,<br/>payout schedule"]
        SupaDB[("Supabase DB<br/>subscriptions, invoices,<br/>payments, projects")]
        AnalyticsAgent["analytics Agent<br/>AI-powered forecasting,<br/>anomaly detection"]
    end

    StripeAPI --> InvoiceList
    StripeAPI --> PaymentStatus
    StripeAPI --> SubMgmt
    SupaDB --> RevTrends
    SupaDB --> ConvFunnel
    SupaDB --> CompletionRates
    AnalyticsAgent --> RevTrends
    AnalyticsAgent --> AIUsage

    classDef clientNode fill:#F1EEEA,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef agencyNode fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#84CC16
    classDef sourceNode fill:#1a5c3a,stroke:#84CC16,stroke-width:2px,color:#F1EEEA

    class InvoiceList,PaymentStatus,SubMgmt clientNode
    class RevTrends,ConvFunnel,AIUsage,CompletionRates agencyNode
    class StripeAPI,SupaDB,AnalyticsAgent sourceNode
```
