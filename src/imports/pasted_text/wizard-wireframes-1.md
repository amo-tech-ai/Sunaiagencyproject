# Wizard Enhancements — Wireframes

> Figma Make: Design an onboarding wizard with 5 steps shown in a left sidebar progress tracker. Clean white card layout with subtle shadows. Step 3 shows recommendation cards. Step 4 shows a proposal document with an "Your AI Team" section featuring agent avatar circles. Step 5 shows a launch confirmation with an agent team grid. Use electric blue primary, emerald green for success states, and warm gray for backgrounds.

---

## Wizard Flow Overview

```
STEP 1              STEP 2              STEP 3              STEP 4              STEP 5
Business            Industry            System              Executive           Launch
Context             Diagnostics         Recommendations     Summary             Project
                                        + Agent Logic       + Your AI Team      + Team Reveal
(no change)         (smarter Qs)        (ENHANCED)          (ENHANCED)          (ENHANCED)
```

No new steps added. Steps 3, 4, and 5 get enhanced content sections.

---

## Step 1 — Business Context (No Change)

Stays exactly as-is. Collects company name, website, industry, size, goal, challenge.

---

## Step 2 — Industry Diagnostics (Minor Enhancement)

**What changes:** The diagnostic questions become agent-informed. The AI generating questions uses a domain agent excerpt (e.g., Discovery Coach for sales-focused clients) to ask sharper questions.

**User sees:** Better questions. No visible UI change.

---

## Step 3 — System Recommendations (Enhanced)

**What changes:** Recommendations now include "why this fits YOUR business" reasoning powered by specialist agents.

```
+----------------------------------------------------------------------+
|  WIZARD STEP 3 — SYSTEM RECOMMENDATIONS                              |
+----------------------------------------------------------------------+
|                                                                      |
|  Based on your answers, here are your recommended AI systems:        |
|                                                                      |
|  +----------------------------+  +----------------------------+      |
|  | #1  GROWTH ENGINE      98% |  | #2  SUPPORT ENGINE     92% |      |
|  |                            |  |                            |      |
|  | "Your Instagram traffic    |  | "Your front desk spends    |      |
|  |  has no conversion path.   |  |  3hrs/day on phone calls.  |      |
|  |  A growth engine captures  |  |  An AI support engine      |      |
|  |  visitors into a funnel    |  |  handles 70% of routine    |      |
|  |  with automated follow-up."|  |  bookings automatically."  |      |
|  |                            |  |                            |      |
|  | ROI: $2,400/mo in 90 days  |  | ROI: Save 2 hrs/day       |      |
|  | Quick Win: Yes             |  | Quick Win: Yes             |      |
|  |                            |  |                            |      |
|  | [x] SELECT                 |  | [x] SELECT                 |      |
|  +----------------------------+  +----------------------------+      |
|                                                                      |
|  +----------------------------+  +----------------------------+      |
|  | #3  BOOKING ENGINE     87% |  | #4  DATA INTELLIGENCE  78% |      |
|  |                            |  |                            |      |
|  | "You have no online        |  | "You're making decisions   |      |
|  |  booking. Patients leave   |  |  without data. A dashboard |      |
|  |  when they can't book at   |  |  showing patient retention |      |
|  |  11pm on their phone."     |  |  and revenue trends would  |      |
|  |                            |  |  change your planning."    |      |
|  | ROI: 35% more bookings     |  |                            |      |
|  | Quick Win: Yes             |  | ROI: Better decisions      |      |
|  |                            |  | Quick Win: No              |      |
|  | [ ] SELECT                 |  | [ ] SELECT                 |      |
|  +----------------------------+  +----------------------------+      |
|                                                                      |
|                      [ Continue to Summary --> ]                      |
+----------------------------------------------------------------------+
```

**Sample content — Dental Clinic (Dr. Patel, 8 employees):**
- System #1: Support Engine 92% — "Your front desk spends 3hrs/day on phone calls"
- System #2: Booking Engine 87% — "You have no online booking"
- System #3: Growth Engine 78% — "Your Google reviews are 3.8 stars, competitors average 4.5"

**Sample content — E-commerce Brand (Bella's Boutique, 3 employees):**
- System #1: Growth Engine 98% — "Your Instagram has 2K followers but zero conversion path"
- System #2: Cart Recovery 91% — "Industry average cart abandonment is 70%, you have no recovery flow"
- System #3: Content Engine 85% — "You post 2x/week, top competitors post daily with UGC"

---

## Step 4 — Executive Summary / Proposal (Enhanced)

**What changes:** Adds "Your AI Team" section showing which specialist agents are assigned to this project. Proposal narrative is written by Proposal Strategist agent.

```
+----------------------------------------------------------------------+
|  WIZARD STEP 4 — YOUR PROPOSAL                                       |
+----------------------------------------------------------------------+
|                                                                      |
|  +----------------------------------------------------------------+  |
|  |  EXECUTIVE SUMMARY                                              |  |
|  |                                                                  |  |
|  |  Dr. Patel, your clinic handles 40+ calls per day but has no   |  |
|  |  online booking system. Patients who can't book at 11pm on     |  |
|  |  their phone simply go to the competitor down the street.      |  |
|  |                                                                  |  |
|  |  We recommend starting with a WhatsApp booking bot that        |  |
|  |  handles appointment scheduling, reminders, and follow-ups.    |  |
|  |  Based on clinics your size, we expect 60-70% of bookings     |  |
|  |  to shift online within 3 months.                              |  |
|  |                                                                  |  |
|  |  Estimated savings: 2 hours/day in front desk workload.        |  |
|  |  Estimated revenue lift: 35% more bookings from after-hours.   |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
|  +----------------------------------------------------------------+  |
|  |  YOUR AI TEAM                                                    |  |
|  |                                                                  |  |
|  |  We've assembled a team of AI specialists for your project:    |  |
|  |                                                                  |  |
|  |  +------------------+  +------------------+  +----------------+ |  |
|  |  | (o) Rapid        |  | (o) Support      |  | (o) Finance   | |  |
|  |  |     Prototyper   |  |     Responder    |  |     Tracker   | |  |
|  |  |                  |  |                  |  |               | |  |
|  |  | Builds your      |  | Designs your     |  | Projects your | |  |
|  |  | booking bot MVP  |  | patient comms    |  | cost savings  | |  |
|  |  | in 2 weeks       |  | and FAQ flows    |  | and ROI       | |  |
|  |  +------------------+  +------------------+  +----------------+ |  |
|  |                                                                  |  |
|  |  + Project Shepherd (manages your implementation roadmap)       |  |
|  |  + Reality Checker (validates recommendations before delivery)  |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
|  +----------------------------------------------------------------+  |
|  |  AI READINESS SCORE                                              |  |
|  |                                                                  |  |
|  |  Overall: 68 / 100    [=========>          ]                    |  |
|  |                                                                  |  |
|  |  Digital Infrastructure    72  [========>         ]              |  |
|  |  Data Readiness            55  [=====>            ]              |  |
|  |  Process Automation        45  [====>             ]              |  |
|  |  Team Capability           80  [==========>       ]              |  |
|  |  Strategic Alignment       72  [========>         ]              |  |
|  |                                                                  |  |
|  |  Top gap: No online booking = biggest automation opportunity    |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
|            [ Edit Proposal ]        [ Approve & Continue --> ]        |
+----------------------------------------------------------------------+
```

**"Your AI Team" card content varies by client:**

Dental clinic team:
- Rapid Prototyper — "Builds your booking bot MVP in 2 weeks"
- Support Responder — "Designs patient communication flows"
- Finance Tracker — "Projects your cost savings and ROI"

E-commerce brand team:
- Growth Hacker — "Designs your Instagram-to-purchase funnel"
- Brand Guardian — "Ensures visual consistency across channels"
- SEO Specialist — "Targets long-tail keywords your competitors miss"

Real estate brokerage team:
- Pipeline Analyst — "Scores leads and prioritizes follow-ups"
- Outbound Strategist — "Designs automated lead nurture sequences"
- Deal Strategist — "Optimizes your listing-to-close conversion"

Tourism company team:
- Growth Hacker — "Builds referral program for guest-to-guest sharing"
- Content Creator — "Plans destination content calendar"
- Rapid Prototyper — "Scopes WhatsApp concierge bot"

---

## Step 5 — Launch Project (Enhanced)

**What changes:** Shows the full agent team with their first tasks, plus a roadmap preview.

```
+----------------------------------------------------------------------+
|  WIZARD STEP 5 — LAUNCH YOUR PROJECT                                  |
+----------------------------------------------------------------------+
|                                                                      |
|   Your project is ready to launch!                                   |
|                                                                      |
|  +----------------------------------------------------------------+  |
|  |  YOUR TEAM IS READY                                              |  |
|  |                                                                  |  |
|  |  (o) Rapid Prototyper        First task: Build booking bot      |  |
|  |  (o) Support Responder       First task: Map patient FAQ        |  |
|  |  (o) Finance Tracker         First task: Baseline cost report   |  |
|  |  (o) Project Shepherd        First task: Set up sprint plan     |  |
|  |  (o) Reality Checker         First task: Review bot spec        |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
|  +----------------------------------------------------------------+  |
|  |  ROADMAP PREVIEW                                                 |  |
|  |                                                                  |  |
|  |  Phase 1 (Week 1-3)     Phase 2 (Week 4-6)    Phase 3 (Week 7+)|  |
|  |  ================       ================       ================ |  |
|  |  WhatsApp booking       Reminder system        Analytics        |  |
|  |  bot live               + review requests      dashboard        |  |
|  |                                                                  |  |
|  |  Deliverables:          Deliverables:          Deliverables:    |  |
|  |  - Bot handles          - Auto reminders       - Patient        |  |
|  |    bookings             - Post-visit SMS          retention     |  |
|  |  - Calendar sync        - Google review            metrics     |  |
|  |  - Confirmation msgs      requests             - Revenue       |  |
|  |                                                    tracking    |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
|  +----------------------------------------------------------------+  |
|  |  QUICK WINS (available immediately)                              |  |
|  |                                                                  |  |
|  |  [x] WhatsApp business account setup guide                      |  |
|  |  [x] Google Business Profile optimization checklist             |  |
|  |  [x] Patient FAQ template (top 15 questions)                    |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
|                    [ Launch Project --> ]                              |
+----------------------------------------------------------------------+
```

---

## Mobile Behavior

All wizard steps stack vertically on mobile:
- Progress sidebar collapses to a top step indicator (Step 3 of 5)
- Recommendation cards stack single-column
- AI Team cards become a horizontal scrollable row
- Roadmap phases stack vertically as a timeline

```
+-------------------------+
| Step 4 of 5             |
| [====>     ]            |
+-------------------------+
|                         |
| EXECUTIVE SUMMARY       |
|                         |
| Dr. Patel, your clinic  |
| handles 40+ calls/day...|
|                         |
+-------------------------+
|                         |
| YOUR AI TEAM            |
|                         |
| [Rapid   ] [Support ]  |
| [Prototyper] [Responder]|
|         < swipe >       |
|                         |
+-------------------------+
|                         |
| READINESS: 68/100       |
| [========>         ]    |
|                         |
+-------------------------+
|                         |
| [ Approve & Continue ]  |
|                         |
+-------------------------+
```
