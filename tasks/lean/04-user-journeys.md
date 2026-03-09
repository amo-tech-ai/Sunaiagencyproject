# Strategy Engine — User Journeys

---

## Journey 1: First-Time Setup (Wizard → Canvas)

### Persona
Sarah, a consultant onboarding a new retail client. She completed the wizard yesterday.

### Flow

```
Step 1: Navigate to Strategy
  Sarah clicks "Strategy" in the sidebar (🧠 icon)
  → Page loads with empty state

Step 2: Empty State
  ┌─────────────────────────────────────┐
  │                                     │
  │        🧠 Strategy Engine           │
  │                                     │
  │  Your strategy canvas isn't set up  │
  │                                     │
  │  [🔮 Create from Wizard]           │
  │  [📝 Start Fresh]                  │
  │                                     │
  └─────────────────────────────────────┘

Step 3: Create from Wizard
  Sarah clicks "Create from Wizard"
  → Loading spinner (1-2s)
  → Canvas populates with wizard data:
    - Problem: pain points from business analysis
    - Customer Segments: from industry selection
    - Solution: selected AI systems
    - Key Metrics: from diagnostics signals
    - Unfair Advantage: from readiness strengths

Step 4: Review Canvas
  Sarah sees the 3x3 grid with pre-filled blocks
  Each block shows items tagged "ai" (from wizard data)
  She clicks "Problem" block to expand
  → Inline editor opens with items

Step 5: Edit & Refine
  Sarah adds a manual item: "No real-time inventory tracking"
  She removes an irrelevant AI-generated item
  → Canvas auto-saves (version 2 created)

Step 6: Run First Analysis
  Sarah clicks [▶ Run Analysis]
  → Analysis progress sheet shows 5 agents running
  → ~8-12s for all agents to complete
  → Results appear:
    - 2 canvas update suggestions (pending approval)
    - 3 automation opportunities detected
    - 1 new system recommendation
    - Health score: 72

Step 7: Review Intelligence Panel
  Sarah sees pending approvals with approve/reject buttons
  She approves the Problem block update (adds WhatsApp signal)
  → Canvas updates live, version 3 created
  She dismisses the second suggestion

Step 8: Done
  Total time: ~5 minutes
  Canvas: v3 with 6/9 blocks filled
  Next: Sarah will re-run analysis after CRM data accumulates
```

---

## Journey 2: Ongoing Strategy Review (Weekly Check-in)

### Persona
Mike, agency founder, checks strategy weekly after CRM and project updates.

### Flow

```
Step 1: Dashboard → Strategy
  Mike sees the "Strategy" nav item with badge "⚠3"
  (3 pending approvals from background signals)
  He clicks through

Step 2: Review Metrics Bar
  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
  │Health  │ │Canvas  │ │Opps    │ │Pending │ │Est ROI │
  │ 78 ▲+5│ │ 85% ▲  │ │ 7 ▲+2 │ │ 3 ⚠   │ │$15.2K  │
  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘

  Health improved since last week. 2 new opportunities detected.

Step 3: Check Pending Approvals
  Intelligence Panel shows 3 recommendations:
  a) Canvas Update: "Add 'poor follow-up speed' to Problem block"
     - Rationale: CRM shows 45% of deals stale >7 days
  b) Roadmap Change: "Add lead scoring phase before Phase 3"
     - Rationale: Opportunity Detector found high-impact automation
  c) New System: "AI appointment scheduler"
     - Rationale: Calendar booking patterns show 3h/week manual work

Step 4: Approve Strategically
  Mike approves (a) — canvas updates automatically
  Mike approves (c) — logged for implementation planning
  Mike rejects (b) — not ready to change roadmap yet

Step 5: Review Opportunities
  Mike scrolls to Opportunities section
  Sees "Automate Lead Qualification" with:
    Impact: 85 | ROI: 300-500% | Complexity: Low
  He clicks [▶ Evaluate] → status changes to "evaluating"
  (He'll discuss with team before approving)

Step 6: Deep Dive on a Block
  Mike clicks [🤖 Ask AI] on the Revenue Streams block
  AI returns 3 suggestions:
    - "Add recurring maintenance revenue" (conf: 90%)
    - "Expand to WhatsApp commerce revenue" (conf: 72%)
    - "Consider training/workshop revenue" (conf: 65%)
  He accepts the first two, dismisses the third

Step 7: Run Fresh Analysis
  After making changes, Mike clicks [▶ Run Analysis]
  → New analysis with updated canvas context
  → Health score: 81 (improved from changes)
  → 1 new insight: "Revenue strategy strengthened by recurring model"

  Total time: ~10 minutes
```

---

## Journey 3: Responding to Business Change

### Persona
Ana, operations lead. Their retail client suddenly shifts 60% of support to WhatsApp.

### Flow

```
Step 1: CRM Data Changes
  Ana logs several WhatsApp interactions in CRM Pipeline
  Support volume data shows WhatsApp growing

Step 2: Phase 2 (future) — Auto-Trigger
  In Phase 2, the engine would auto-detect this shift.
  In Phase 1, Ana navigates to Strategy and clicks Run Analysis.

Step 3: Analysis Detects Shift
  Strategy Synthesizer sees:
    - CRM interactions: 60% now via WhatsApp (was 25%)
    - Support response time: slower on WhatsApp
    - Customer satisfaction: lower for WhatsApp channel

  Generates recommendations:
    ┌───────────────────────────────────────────┐
    │ Canvas Update — Problem block             │
    │ Add: "WhatsApp support volume grew 140%,  │
    │ response time 3x slower than email"       │
    │ Confidence: 92%                           │
    └───────────────────────────────────────────┘

    ┌───────────────────────────────────────────┐
    │ Canvas Update — Channels block            │
    │ Replace: "Email (primary)" with           │
    │ "WhatsApp (primary), Email (secondary)"   │
    │ Confidence: 88%                           │
    └───────────────────────────────────────────┘

Step 4: Opportunity Detected
  ┌───────────────────────────────────────────┐
  │ 🔵 WhatsApp Support Automation            │
  │ Impact: 92 | ROI: 400-600% | Easy         │
  │ Current: Manual WhatsApp replies          │
  │ Proposed: AI WhatsApp support agent       │
  │ Est: 4 weeks | Saves: 15h/week            │
  └───────────────────────────────────────────┘

Step 5: System Recommendation
  ┌───────────────────────────────────────────┐
  │ 🆕 Recommended: AI WhatsApp Agent        │
  │ Fit: 95% | Addresses: Channels, Problem  │
  │ "Client's top channel needs AI support"   │
  └───────────────────────────────────────────┘

Step 6: Ana Reviews & Approves
  Ana approves both canvas updates → blocks update live
  Ana approves the system recommendation → logged
  She shares the opportunity with the team

Step 7: Strategy Updated
  Canvas now reflects the WhatsApp reality:
    Problem: includes WhatsApp bottleneck
    Channels: WhatsApp marked as primary
    Solution: includes AI WhatsApp agent
    Key Metrics: adds "WhatsApp response time"

  Version history shows the evolution:
    v1: Initial from wizard
    v2: Manual edits
    v3: AI-detected WhatsApp shift
```

---

## Journey 4: New Consultant Onboarding

### Persona
Tom, new consultant joining the agency, assigned to an existing client.

### Flow

```
Step 1: Open Strategy Page
  Tom navigates to /app/strategy
  Canvas already exists with version history

Step 2: Understand Client Strategy
  Tom reads the Lean Canvas:
    Problem: 3 items (AI-detected + manual)
    Customer Segments: retail brands
    Solution: AI chatbot + CRM automation
    Key Metrics: CAC, LTV, NPS
    ...

Step 3: View Version History
  Tom clicks [View History]
  → Sheet shows v1-v5 with timestamps and change reasons
  → He sees the strategic evolution over 3 weeks

Step 4: Review Intelligence Feed
  Tom reads recent insights:
    "Pipeline value grew 12% this week"
    "2 deals stale in Negotiation stage"
    "AI readiness improving (+5 since last analysis)"

Step 5: Review Opportunities
  Tom sees 5 detected opportunities ranked by impact
  He understands what automation is possible

Step 6: Run Analysis for Fresh Context
  Tom clicks [▶ Run Analysis]
  → Gets latest AI interpretation of the business
  → Ready to have an informed conversation with the client

  Total time: ~5 minutes to understand entire strategy
```

---

## Journey 5: Strategy Comparison Over Time

### Persona
Sarah, revisiting a client's strategy after 2 months.

### Flow

```
Step 1: Open Strategy
  Canvas is at v12
  Health score: 85 (was 52 at start)

Step 2: View Version History
  ┌───────────────────────────────────────────┐
  │ v12 (current)         May 8              │
  │ v11                   May 1              │
  │ v10                   Apr 24             │
  │ ...                                      │
  │ v1 (initial)          Mar 8              │
  └───────────────────────────────────────────┘

Step 3: Compare v1 vs v12
  Sarah clicks [View] on v1
  Sees the original canvas in a sheet overlay
  Compares with current canvas side-by-side mentally

  Problem (v1): "Slow response, data silos, no automation"
  Problem (v12): "Scale support for 3 channels, data governance, API rate limits"

  → Strategy has evolved from basic issues to growth challenges

Step 4: Review Action Log
  Tom clicks the actions tab
  → Sees 48 strategy actions over 2 months
  → 12 canvas updates (6 AI-suggested, 6 manual)
  → 8 opportunities detected, 5 implemented
  → 3 systems recommended, 2 deployed

Step 5: Share Progress
  Sarah screenshots the metrics bar showing improvement:
    Health: 52 → 85
    Automation Coverage: 15% → 68%
    Opportunities Implemented: 5/8

  Uses this as proof of strategic progress for client review
```

---

## Journey State Diagram

```
                    ┌──────────┐
                    │  No      │
                    │  Canvas  │
                    └────┬─────┘
                         │
            ┌────────────┼────────────┐
            ▼                         ▼
     ┌──────────┐             ┌──────────┐
     │ Seed     │             │ Start    │
     │ from     │             │ Fresh    │
     │ Wizard   │             │          │
     └────┬─────┘             └────┬─────┘
          │                        │
          └──────────┬─────────────┘
                     ▼
              ┌──────────┐
              │ Canvas   │ ← Manual edits
              │ v1       │ ← AI suggestions
              └────┬─────┘
                   │
          ┌────────┼────────┐
          ▼                 ▼
   ┌──────────┐      ┌──────────┐
   │ Run      │      │ Ask AI   │
   │ Analysis │      │ on Block │
   │ (5 agents)│      │ (1 agent)│
   └────┬─────┘      └────┬─────┘
        │                  │
        ▼                  ▼
 ┌──────────────┐  ┌──────────────┐
 │ Review       │  │ Review       │
 │ Insights     │  │ Suggestions  │
 │ Opportunities│  │ per Block    │
 │ Recommendations│ │              │
 └────┬─────────┘  └────┬─────────┘
      │                  │
      ├──── Approve ────►├──── Accept ────►┐
      │                  │                 │
      ├──── Reject ─────►├──── Dismiss ──►│
      │                  │                 │
      └──────────────────┘                 ▼
                                    ┌──────────┐
                                    │ Canvas   │
                                    │ v(n+1)   │
                                    └────┬─────┘
                                         │
                                    Loop back to
                                    Run Analysis
                                    or Ask AI
```

---

## Key UX Principles

1. **No surprise changes** — AI never modifies the canvas without approval
2. **Progressive disclosure** — metrics bar → canvas blocks → expanded editor → AI suggestions
3. **Version safety** — every change creates a version; can always revert
4. **Clear provenance** — every item shows source (manual vs AI) and confidence
5. **Actionable intelligence** — every insight has approve/dismiss/evaluate actions
6. **Mobile-friendly** — tabs replace columns on small screens
7. **Fast startup** — empty state to first canvas in <10 seconds
8. **Transparent AI** — analysis progress shows each agent's work in real-time
