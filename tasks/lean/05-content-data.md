# Strategy Engine — Content Data & Sample Payloads

---

## 1. Canvas Block Labels & Descriptions

| Block Key | Display Label | Description | Placeholder Text |
|-----------|--------------|-------------|-----------------|
| problem | Problem | Top 1-3 problems worth solving | What pain points does the business face? |
| customer_segments | Customer Segments | Target customers and early adopters | Who are the primary customer groups? |
| value_proposition | Unique Value Proposition | Clear compelling message for why you're different | What makes the approach unique? |
| solution | Solution | Outline of the solution for each problem | What AI systems solve these problems? |
| channels | Channels | Path to reach customers | How do customers find and engage? |
| revenue_streams | Revenue Streams | Revenue model and lifetime value | How does the business make money? |
| cost_structure | Cost Structure | Fixed and variable costs | What are the main cost drivers? |
| key_metrics | Key Metrics | Key activities and numbers to measure | Which KPIs matter most? |
| unfair_advantage | Unfair Advantage | What can't be easily copied or bought | What sustainable edge exists? |

---

## 2. Sample Seeded Canvas (from Wizard Data)

### Input: Fashion E-commerce Client

```json
{
  "id": "canvas-001",
  "session_id": "wiz-abc-123",
  "version": 1,
  "is_current": true,
  "problem": [
    { "id": "p1", "text": "Manual customer support across 3 channels", "source": "ai", "confidence": 0.92, "updatedAt": "2026-03-08T10:00:00Z" },
    { "id": "p2", "text": "No personalized product recommendations", "source": "ai", "confidence": 0.88, "updatedAt": "2026-03-08T10:00:00Z" },
    { "id": "p3", "text": "Cart abandonment rate at 72%", "source": "ai", "confidence": 0.85, "updatedAt": "2026-03-08T10:00:00Z" }
  ],
  "customer_segments": [
    { "id": "cs1", "text": "Fashion-conscious women 25-40", "source": "ai", "confidence": 0.90, "updatedAt": "2026-03-08T10:00:00Z" },
    { "id": "cs2", "text": "Online-first shoppers preferring mobile", "source": "ai", "confidence": 0.87, "updatedAt": "2026-03-08T10:00:00Z" }
  ],
  "value_proposition": [
    { "id": "vp1", "text": "AI-powered shopping assistant that understands personal style", "source": "ai", "confidence": 0.82, "updatedAt": "2026-03-08T10:00:00Z" }
  ],
  "solution": [
    { "id": "s1", "text": "AI Chatbot — Automated customer support", "source": "ai", "confidence": 0.95, "updatedAt": "2026-03-08T10:00:00Z" },
    { "id": "s2", "text": "Recommendation Engine — Personalized product suggestions", "source": "ai", "confidence": 0.90, "updatedAt": "2026-03-08T10:00:00Z" },
    { "id": "s3", "text": "CRM Automation — Lead nurturing workflows", "source": "ai", "confidence": 0.88, "updatedAt": "2026-03-08T10:00:00Z" }
  ],
  "channels": [
    { "id": "ch1", "text": "Instagram (primary acquisition)", "source": "ai", "confidence": 0.85, "updatedAt": "2026-03-08T10:00:00Z" },
    { "id": "ch2", "text": "Website (conversion)", "source": "ai", "confidence": 0.90, "updatedAt": "2026-03-08T10:00:00Z" },
    { "id": "ch3", "text": "WhatsApp (support + reorders)", "source": "ai", "confidence": 0.78, "updatedAt": "2026-03-08T10:00:00Z" }
  ],
  "revenue_streams": [
    { "id": "rs1", "text": "Product sales — $45K/month average", "source": "ai", "confidence": 0.80, "updatedAt": "2026-03-08T10:00:00Z" }
  ],
  "cost_structure": [
    { "id": "cc1", "text": "AI platform: $2.4K/month", "source": "ai", "confidence": 0.85, "updatedAt": "2026-03-08T10:00:00Z" },
    { "id": "cc2", "text": "Support team: $4K/month (target: reduce 60%)", "source": "ai", "confidence": 0.82, "updatedAt": "2026-03-08T10:00:00Z" }
  ],
  "key_metrics": [
    { "id": "km1", "text": "Customer Acquisition Cost (CAC)", "source": "ai", "confidence": 0.90, "updatedAt": "2026-03-08T10:00:00Z" },
    { "id": "km2", "text": "Cart abandonment rate", "source": "ai", "confidence": 0.88, "updatedAt": "2026-03-08T10:00:00Z" },
    { "id": "km3", "text": "Support automation rate", "source": "ai", "confidence": 0.85, "updatedAt": "2026-03-08T10:00:00Z" }
  ],
  "unfair_advantage": [
    { "id": "ua1", "text": "First-mover in AI-powered fashion retail support", "source": "ai", "confidence": 0.75, "updatedAt": "2026-03-08T10:00:00Z" },
    { "id": "ua2", "text": "Strong Instagram community (50K followers)", "source": "ai", "confidence": 0.88, "updatedAt": "2026-03-08T10:00:00Z" }
  ],
  "metadata": {
    "industry": "fashion",
    "companySize": "11-50",
    "readinessScore": 68,
    "completeness": 75
  }
}
```

---

## 3. Sample Strategy Analysis Response

### POST /strategy/analyze Response

```json
{
  "insights": [
    {
      "id": "si-001",
      "agent_name": "metrics-interpreter",
      "insight_type": "trend",
      "title": "Support Channel Shift Detected",
      "description": "WhatsApp interactions grew 140% in the last 2 weeks, now representing 58% of all support volume. Email dropped to 22%. Instagram DM remains at 20%.",
      "priority": "high",
      "impact_score": 88,
      "confidence": 0.91,
      "data_sources": ["crm_interactions", "crm_deals"],
      "status": "draft"
    },
    {
      "id": "si-002",
      "agent_name": "metrics-interpreter",
      "insight_type": "risk",
      "title": "Pipeline Velocity Slowing",
      "description": "Average deal cycle time increased from 14 to 21 days. Two deals in 'Proposal Sent' stage for over 14 days without interaction.",
      "priority": "medium",
      "impact_score": 65,
      "confidence": 0.84,
      "data_sources": ["crm_deals", "crm_stages"],
      "status": "draft"
    },
    {
      "id": "si-003",
      "agent_name": "metrics-interpreter",
      "insight_type": "recommendation",
      "title": "AI Readiness Improving",
      "description": "Readiness score increased from 68 to 73 after implementing AI chatbot. System recommendations completion rate at 67% — on track for Phase 2.",
      "priority": "low",
      "impact_score": 45,
      "confidence": 0.93,
      "data_sources": ["wizard_answers", "ai_run_logs"],
      "status": "draft"
    }
  ],
  "opportunities": [
    {
      "id": "ao-001",
      "title": "Automate WhatsApp Support Triage",
      "description": "58% of support is now WhatsApp-based. AI can auto-classify and respond to 70% of common questions (sizing, shipping, returns).",
      "process_area": "support",
      "current_state": "Manual WhatsApp replies by 2 team members, avg response: 45 min",
      "proposed_state": "AI handles sizing/shipping/returns instantly. Complex issues routed to humans with context.",
      "impact_score": 92,
      "roi_estimate": "400-600%",
      "complexity": "low",
      "estimated_weeks": 4,
      "estimated_cost": "$3,200 setup + $800/month",
      "recommended_system": "whatsapp-ai-agent",
      "status": "detected"
    },
    {
      "id": "ao-002",
      "title": "Cart Recovery Automation",
      "description": "72% cart abandonment rate. AI can send personalized recovery messages via WhatsApp within 30 minutes of abandonment.",
      "process_area": "sales",
      "current_state": "No cart recovery process in place",
      "proposed_state": "Automated WhatsApp message with personalized discount + product reminder",
      "impact_score": 85,
      "roi_estimate": "500-800%",
      "complexity": "medium",
      "estimated_weeks": 3,
      "estimated_cost": "$2,400 setup + $600/month",
      "recommended_system": "marketing-automation",
      "status": "detected"
    },
    {
      "id": "ao-003",
      "title": "Lead Scoring from Wizard Data",
      "description": "Wizard completions contain rich business data. AI can auto-score leads by readiness, budget fit, and urgency.",
      "process_area": "sales",
      "current_state": "All wizard leads treated equally — manual review",
      "proposed_state": "AI scores each lead 0-100, routes hot leads (80+) immediately",
      "impact_score": 78,
      "roi_estimate": "200-400%",
      "complexity": "low",
      "estimated_weeks": 2,
      "estimated_cost": "$1,600 setup + $400/month",
      "recommended_system": "sales-automation",
      "status": "detected"
    }
  ],
  "recommendations": [
    {
      "id": "sr-001",
      "agent_name": "strategy-synthesizer",
      "recommendation_type": "canvas_update",
      "title": "Update Problem Block — WhatsApp Bottleneck",
      "rationale": "CRM data shows WhatsApp is now the primary support channel (58% of volume) but response time is 3x slower than email. This is a critical operational bottleneck that should be reflected in the strategy.",
      "proposed_changes": {
        "block": "problem",
        "action": "add",
        "items": [
          { "id": "p4", "text": "WhatsApp support response time 3x slower than email despite being primary channel", "source": "ai", "confidence": 0.91 }
        ]
      },
      "approval_status": "pending"
    },
    {
      "id": "sr-002",
      "agent_name": "strategy-synthesizer",
      "recommendation_type": "canvas_update",
      "title": "Update Channels — WhatsApp as Primary",
      "rationale": "Channel mix shifted dramatically. WhatsApp now handles 58% of interactions, up from 20% two weeks ago. Strategy should reflect this reality.",
      "proposed_changes": {
        "block": "channels",
        "action": "replace",
        "items": [
          { "id": "ch1-r", "text": "WhatsApp (primary — 58% of interactions)", "source": "ai", "confidence": 0.91 },
          { "id": "ch2-r", "text": "Instagram (acquisition — 20%)", "source": "ai", "confidence": 0.88 },
          { "id": "ch3-r", "text": "Email (secondary support — 22%)", "source": "ai", "confidence": 0.85 }
        ]
      },
      "approval_status": "pending"
    },
    {
      "id": "sr-003",
      "agent_name": "system-recommender",
      "recommendation_type": "new_system",
      "title": "Deploy AI WhatsApp Support Agent",
      "rationale": "WhatsApp is the primary channel with highest volume but slowest response. An AI agent can handle 70% of queries instantly, reducing team workload by 15h/week.",
      "proposed_changes": {
        "systemId": "whatsapp-ai-agent",
        "fit_score": 0.95,
        "blocks_addressed": ["problem", "channels", "solution"],
        "estimated_impact": "60% reduction in response time, 70% automation rate"
      },
      "approval_status": "pending"
    },
    {
      "id": "sr-004",
      "agent_name": "roadmap-planner",
      "recommendation_type": "roadmap_change",
      "title": "Prioritize WhatsApp Automation Before Phase 3",
      "rationale": "The detected WhatsApp support opportunity has the highest impact score (92) and lowest complexity. It should be implemented before the planned Phase 3 optimization work.",
      "proposed_changes": {
        "type": "new_phase",
        "title": "Phase 2.5 — WhatsApp Automation",
        "insertAfter": 2,
        "weeks": "3-4",
        "tasks": [
          "Set up WhatsApp Business API integration",
          "Train AI on top 50 support questions",
          "Build escalation routing to human agents",
          "Deploy and monitor automation rate"
        ]
      },
      "approval_status": "pending"
    }
  ],
  "metrics": {
    "automationCoverage": 35,
    "insightCount": 3,
    "pendingApprovals": 4,
    "opportunitiesDetected": 3,
    "totalROIEstimate": "$12,400/month",
    "canvasCompleteness": 75,
    "healthScore": 78
  }
}
```

---

## 4. Sample Metrics Breakdown

### Health Score Components

| Component | Weight | Score | Source |
|-----------|--------|-------|--------|
| Canvas completeness | 20% | 75/100 | Blocks filled / total blocks |
| AI readiness | 20% | 73/100 | From wizard step 4 |
| Pipeline health | 20% | 82/100 | Deal velocity + win rate |
| Automation coverage | 20% | 35/100 | Systems implemented / recommended |
| Strategy freshness | 20% | 88/100 | Days since last analysis |
| **Weighted total** | 100% | **78** | |

### Automation Coverage Calculation

```
Systems recommended by wizard: 5
  - AI Chatbot        ✅ Implemented
  - CRM Automation    ✅ Implemented
  - Recommendation Engine  ⬚ Not started
  - Marketing Automation   ⬚ Not started
  - Analytics Dashboard    🔄 In progress

Coverage = (2 complete + 0.5 in-progress) / 5 = 50%
After opportunity detection: (2 + 0.5 + 3 new opps) / 8 = 31%
Reported as: 35% (weighted by impact scores)
```

---

## 5. Insight Priority Colors & Icons

| Priority | Color | Icon | Example |
|----------|-------|------|---------|
| High | `#DC2626` (red-600) | 🔴 | "Support bottleneck affecting response time" |
| Medium | `#D97706` (amber-600) | 🟡 | "Pipeline velocity slowing" |
| Low | `#00875A` (green) | 🟢 | "AI readiness improving" |

### Insight Types & Icons

| Type | Icon | Description |
|------|------|-------------|
| opportunity | 💡 | New automation or improvement found |
| risk | ⚠️ | Potential problem or degradation |
| recommendation | 📋 | Specific action to take |
| trend | 📈 | Pattern in the data |

### Recommendation Types & Icons

| Type | Icon | Description |
|------|------|-------------|
| canvas_update | 📝 | Modify Lean Canvas block |
| roadmap_change | 🗺️ | Add/modify roadmap phase |
| new_system | 🆕 | Deploy a new AI system |
| task_creation | ✅ | Create new task(s) |
| metric_alert | 📊 | KPI threshold alert |

### Opportunity Status Flow

```
detected → evaluating → approved → in_progress → completed
                    └→ dismissed
```

| Status | Color | Badge |
|--------|-------|-------|
| detected | `#3B82F6` (blue) | "New" |
| evaluating | `#D97706` (amber) | "Evaluating" |
| approved | `#00875A` (green) | "Approved" |
| in_progress | `#7C3AED` (purple) | "In Progress" |
| completed | `#059669` (emerald) | "Done" |
| dismissed | `#9CA39B` (gray) | "Dismissed" |
