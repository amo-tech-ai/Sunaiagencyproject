# Strategy Engine — ASCII Wireframes

> All wireframes use the existing design system:
> Georgia serif headings | #1A1A1A dark | #F5F5F0 beige | #00875A green | #E8E8E4 borders

---

## 1. Full Strategy Engine Page Layout

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ ┌──────┐                                                                        │
│ │ ☰    │  Strategy Engine                         🔔  SK ▾                      │
│ └──────┘                                                                        │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  AI Strategy Engine                                    Last analyzed: 2h ago     │
│  ───────────────────                                   [▶ Run Analysis]          │
│                                                                                  │
│  ┌─ Metrics Bar ────────────────────────────────────────────────────────────┐    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │    │
│  │  │ Health   │  │ Canvas   │  │ Opps     │  │ Pending  │  │ Est. ROI │  │    │
│  │  │ Score    │  │ Complete │  │ Detected │  │ Approvals│  │          │  │    │
│  │  │          │  │          │  │          │  │          │  │          │  │    │
│  │  │   78     │  │   70%    │  │    5     │  │  3 ⚠️    │  │ $12.4K   │  │    │
│  │  │  ▲ +5    │  │  ▲ +10%  │  │  ▲ +2   │  │          │  │  /month  │  │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │    │
│  └──────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌── Lean Canvas ──────────────┐┌── Execution ───────────┐┌── Intelligence ────┐│
│  │                              ││                        ││                    ││
│  │  ┌────────┐┌────────┐┌────┐ ││  Phase 1 — Foundation  ││  ⚠ 3 Pending      ││
│  │  │Problem ││Customer││UVP │ ││  ████████████░░ 75%    ││  Approvals         ││
│  │  │        ││Segments││    │ ││  ├─ AI CRM       ✅    ││                    ││
│  │  │• Slow  ││        ││    │ ││  ├─ Lead capture  ✅    ││  ┌──────────────┐ ││
│  │  │  resp  ││• SaaS  ││• AI│ ││  └─ Database     🔄    ││  │ Canvas Update│ ││
│  │  │• Data  ││  cos   ││ +  │ ││                        ││  │ Problem block│ ││
│  │  │  silos ││• Retail││auto│ ││  Phase 2 — Automation  ││  │ +WhatsApp    │ ││
│  │  │• No    ││• Agency││    │ ││  ████░░░░░░░░░░ 25%    ││  │ support load │ ││
│  │  │  auto  ││        ││    │ ││  ├─ AI Chatbot   🔄    ││  │              │ ││
│  │  │   🤖   ││   🤖   ││ 🤖│ ││  ├─ Marketing    ⬚    ││  │ [✓] [✗]     │ ││
│  │  └────────┘└────────┘└────┘ ││  └─ Analytics    ⬚    ││  └──────────────┘ ││
│  │                              ││                        ││                    ││
│  │  ┌────────┐┌────────┐┌────┐ ││  Phase 3 — Optimize    ││  ┌──────────────┐ ││
│  │  │Solution││Channels││Rev │ ││  ░░░░░░░░░░░░░░ 0%     ││  │ New System   │ ││
│  │  │        ││        ││    │ ││                        ││  │ Rec Engine   │ ││
│  │  │• Chat- ││• Web   ││• $ │ ││                        ││  │ fit: 92%     │ ││
│  │  │  bot   ││• Email ││24K │ ││                        ││  │              │ ││
│  │  │• CRM   ││• Whats ││/yr │ ││                        ││  │ [✓] [✗]     │ ││
│  │  │• Auto  ││  App   ││    │ ││                        ││  └──────────────┘ ││
│  │  │   🤖   ││   🤖   ││    │ ││                        ││                    ││
│  │  └────────┘└────────┘└────┘ ││                        ││  ── Insights ──    ││
│  │                              ││                        ││                    ││
│  │  ┌────────┐┌────────┐┌────┐ ││                        ││  🟢 Readiness +5  ││
│  │  │Costs   ││Key     ││Adv │ ││                        ││     AI maturity   ││
│  │  │        ││Metrics ││    │ ││                        ││     improving     ││
│  │  │• Dev   ││• CAC   ││• 1st│ ││                        ││                    ││
│  │  │  $8K/m ││• LTV   ││mover│ ││                        ││  🟡 2 deals stale ││
│  │  │• AI    ││• Churn ││in AI│ ││                        ││     >14 days in   ││
│  │  │  $2K/m ││• NPS   ││    │ ││                        ││     Negotiation   ││
│  │  │        ││        ││    │ ││                        ││                    ││
│  │  └────────┘└────────┘└────┘ ││                        ││  ── Opportunities ─││
│  │                              ││                        ││                    ││
│  │  🤖 = AI suggestions avail  ││                        ││  🔵 Lead Qual     ││
│  │  [View History] [v3]         ││                        ││    Impact: 85     ││
│  └──────────────────────────────┘└────────────────────────┘│    ROI: 300-500%  ││
│                                                            │    [Evaluate]     ││
│                                                            └────────────────────┘│
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Lean Canvas Block — Expanded Edit State

```
┌─────────────────────────────────────────────┐
│  Problem                          [🤖 Ask AI]│
│  ─────────                                   │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ 🟢 Manual customer support response    │  │
│  │    Source: user  |  Added Mar 7        │  │
│  │                              [Edit][✕] │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ 🟢 Data silos across departments      │  │
│  │    Source: user  |  Added Mar 7        │  │
│  │                              [Edit][✕] │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌─ AI Suggestion ───────────────────────┐  │
│  │ 🤖 WhatsApp support volume growing    │  │
│  │    35% — becoming primary channel     │  │
│  │    Confidence: 85%                    │  │
│  │    Source: CRM activity analysis      │  │
│  │                      [Accept] [Dismiss]│  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌─────────────────────────────────┐        │
│  │ + Add new item...               │        │
│  └─────────────────────────────────┘        │
│                                              │
└─────────────────────────────────────────────┘
```

---

## 3. Intelligence Panel — Pending Approval Card

```
┌─────────────────────────────────────────────┐
│  ⚠ Pending Approvals (3)                    │
│  ─────────────────────                      │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  📝 Canvas Update                      │  │
│  │  ──────────────                         │  │
│  │  Update Problem block                   │  │
│  │                                         │  │
│  │  Add: "WhatsApp support volume grew     │  │
│  │  35%, now primary support channel"      │  │
│  │                                         │  │
│  │  Rationale: CRM interaction data shows  │  │
│  │  60% of new support requests come via   │  │
│  │  WhatsApp, up from 25% last month.      │  │
│  │                                         │  │
│  │  Agent: Strategy Synthesizer            │  │
│  │  Confidence: 85%                        │  │
│  │                                         │  │
│  │  ┌─────────┐  ┌──────────┐             │  │
│  │  │✓ Approve│  │✗ Reject  │             │  │
│  │  └─────────┘  └──────────┘             │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  🆕 New System                          │  │
│  │  ──────────                              │  │
│  │  AI Recommendation Engine               │  │
│  │                                         │  │
│  │  E-commerce focus with 3+ product       │  │
│  │  categories suggests personalization    │  │
│  │  will drive 15-25% revenue uplift.      │  │
│  │                                         │  │
│  │  Fit Score: 92% | Impact: High          │  │
│  │  Blocks: revenue_streams, channels      │  │
│  │                                         │  │
│  │  ┌─────────┐  ┌──────────┐             │  │
│  │  │✓ Approve│  │✗ Reject  │             │  │
│  │  └─────────┘  └──────────┘             │  │
│  └────────────────────────────────────────┘  │
│                                              │
└─────────────────────────────────────────────┘
```

---

## 4. Automation Opportunity Card

```
┌─────────────────────────────────────────────┐
│  🔵 Automate Lead Qualification             │
│  ───────────────────────────                │
│                                              │
│  Area: Sales                                │
│                                              │
│  Current: Manual review of wizard           │
│  submissions takes 2-3 hours per lead       │
│                                              │
│  Proposed: AI scores leads in real-time,    │
│  routes hot leads to senior team            │
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │Impact: 85│ │ROI: 300% │ │Complex:  │    │
│  │  ████████ │ │  ++++    │ │  Low     │    │
│  └──────────┘ └──────────┘ └──────────┘    │
│                                              │
│  Est. 3 weeks | System: sales-automation    │
│                                              │
│  Status: Detected                           │
│  ┌────────────┐  ┌──────────┐              │
│  │ ▶ Evaluate │  │ Dismiss  │              │
│  └────────────┘  └──────────┘              │
│                                              │
└─────────────────────────────────────────────┘
```

---

## 5. Metrics Bar Detail

```
┌──────────────────────────────────────────────────────────────────────┐
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐    │
│  │            │  │            │  │            │  │            │    │
│  │  ❤️ Health  │  │  📊 Canvas  │  │  💡 Opps   │  │  ⏳ Pending │    │
│  │   Score    │  │  Complete  │  │  Detected  │  │  Approvals │    │
│  │            │  │            │  │            │  │            │    │
│  │    78      │  │    70%     │  │     5      │  │    3 ⚠     │    │
│  │   ▲ +5     │  │   ▲ +10%  │  │   ▲ +2     │  │   needs    │    │
│  │  vs last   │  │  vs last  │  │  new this  │  │   review   │    │
│  │  analysis  │  │  version  │  │   cycle    │  │            │    │
│  │            │  │            │  │            │  │            │    │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘    │
│                                                                      │
│  ┌────────────┐                                                      │
│  │ 💰 Est ROI │                                                      │
│  │            │                                                      │
│  │  $12.4K    │                                                      │
│  │  /month    │                                                      │
│  │  if all    │                                                      │
│  │  approved  │                                                      │
│  └────────────┘                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 6. Canvas Version History (Sheet)

```
┌─────────────────────────────────────────────┐
│  Version History                    [✕]     │
│  ───────────────                            │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ v3 (current)          Mar 8, 2:30 PM  │  │
│  │ Changed by: AI Strategy Synthesizer   │  │
│  │ Updated Problem + Channels blocks     │  │
│  │ Added WhatsApp as primary channel     │  │
│  │                          [View] [Revert]│ │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ v2                    Mar 7, 4:15 PM  │  │
│  │ Changed by: User                      │  │
│  │ Added cost structure and metrics      │  │
│  │                          [View]        │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ v1 (initial)         Mar 7, 10:00 AM  │  │
│  │ Changed by: System (wizard seed)      │  │
│  │ Canvas created from wizard session    │  │
│  │                          [View]        │  │
│  └────────────────────────────────────────┘  │
│                                              │
└─────────────────────────────────────────────┘
```

---

## 7. Run Analysis Progress Sheet

```
┌─────────────────────────────────────────────┐
│  Running Strategy Analysis...        [✕]    │
│  ─────────────────────────                  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ ✅ Strategy Synthesizer    1.2s  42tk  │  │
│  │    Found 2 canvas update suggestions  │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ ✅ Opportunity Detector    0.8s  38tk  │  │
│  │    Detected 3 automation opportunities│  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ 🔄 Roadmap Planner        ...         │  │
│  │    Analyzing current roadmap...       │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ ⬚ System Recommender      waiting     │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ ⬚ Metrics Interpreter     waiting     │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  Progress: ████████████░░░░░ 60%            │
│                                              │
└─────────────────────────────────────────────┘
```

---

## 8. Mobile Layout (Stacked + Tabs)

```
┌──────────────────────────┐
│ ☰  Strategy Engine   🔔  │
├──────────────────────────┤
│                           │
│ [▶ Run Analysis]          │
│                           │
│ ┌───────┬────────┬──────┐│
│ │Canvas │Roadmap │Intel ││
│ └───────┴────────┴──────┘│
│  ▲ active tab             │
│                           │
│ ┌───────────────────────┐│
│ │  Problem              ││
│ │  • Slow response  🤖  ││
│ │  • Data silos         ││
│ └───────────────────────┘│
│                           │
│ ┌───────────────────────┐│
│ │  Customer Segments    ││
│ │  • SaaS companies     ││
│ │  • Retail brands  🤖  ││
│ └───────────────────────┘│
│                           │
│ ┌───────────────────────┐│
│ │  Value Proposition    ││
│ │  • AI-first ops  🤖   ││
│ └───────────────────────┘│
│                           │
│ ... (scrollable)          │
│                           │
│ ┌── Metrics ────────────┐│
│ │ Health: 78 | Canvas:70%│
│ │ Opps: 5  | Pending: 3 │
│ └───────────────────────┘│
└──────────────────────────┘
```

---

## 9. Empty State (No Canvas)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                                                                  │
│                        🧠                                        │
│                                                                  │
│              AI Strategy Engine                                  │
│                                                                  │
│    Your strategy canvas isn't set up yet.                       │
│    Create one from your wizard data or start fresh.             │
│                                                                  │
│    ┌──────────────────────────┐  ┌──────────────────────┐       │
│    │ 🔮 Create from Wizard   │  │ 📝 Start Fresh       │       │
│    │    Auto-populate from   │  │    Empty canvas       │       │
│    │    your analysis data   │  │    for manual entry   │       │
│    └──────────────────────────┘  └──────────────────────┘       │
│                                                                  │
│    What the Strategy Engine does:                               │
│    • Monitors your business signals continuously                │
│    • Suggests canvas updates based on real data                 │
│    • Detects automation opportunities                           │
│    • Recommends new AI systems as you grow                      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 10. Sidebar With Strategy Nav Item

```
┌──────────────────┐
│  ☀ SUN AI        │
│                   │
│  📊 Dashboard     │
│  📁 Projects      │
│  🗺️ Roadmap       │
│  👥 Clients       │
│  🔀 CRM Pipeline  │
│  💡 AI Insights   │
│  🧠 Strategy  ⚠3  │  ← NEW (Brain icon + pending count badge)
│  📄 Documents     │
│  💰 Financial     │
│  ⚡ Workflows     │
│  🤖 AI Agents     │
│  ⚙️ Settings      │
│                   │
│  ─────────────── │
│  🔄 Re-run Wizard│
│                   │
└──────────────────┘
```
