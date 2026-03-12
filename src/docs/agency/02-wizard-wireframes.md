# Wizard Enhancements — Wireframes

**Document:** 02 of Agency Agents series
**Version:** 1.0
**Created:** 2026-03-12
**Parent:** [00-executive-summary.md](./00-executive-summary.md)
**Status:** Implementing

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

Stays exactly as-is. Collects company name, project description, website, industry, size, goal, challenge.

---

## Step 2 — Industry Diagnostics (Minor Enhancement)

**What changes:** The diagnostic questions become agent-informed. The AI generating questions uses a domain agent excerpt (e.g., Discovery Coach for sales-focused clients) to ask sharper questions.

**User sees:** Better questions. No visible UI change.

---

## Step 3 — System Recommendations (Enhanced)

**What changes:** Recommendations now include "why this fits YOUR business" reasoning powered by specialist agents. Each card shows:
- Fit score percentage (computed from signal matches + industry priority)
- Agent-generated reasoning (2-3 sentences, specific to the business)
- ROI estimate
- Quick Win indicator

### Wireframe

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
|                      [ Continue to Summary --> ]                      |
+----------------------------------------------------------------------+
```

### Fit Score Calculation

```
fitScore = baseIndustryScore + signalBoost + sizeAdjustment

baseIndustryScore:
  - #1 priority for industry: 85
  - #2 priority: 78
  - #3 priority: 72
  - #4 priority: 65
  - #5+: 55

signalBoost:
  - Each matching diagnostic signal: +5 (max +15)

sizeAdjustment:
  - Small company + Small effort system: +5
  - Enterprise + Large effort system: +3
  - Mismatch (small + large): -5

Final score capped at 99.
```

### Sample Content

**Dental Clinic (Dr. Patel, 8 employees):**
- System #1: Support Engine 92% — "Your front desk spends 3hrs/day on phone calls"
- System #2: Booking Engine 87% — "You have no online booking"
- System #3: Growth Engine 78% — "Your Google reviews are 3.8 stars, competitors average 4.5"

**E-commerce Brand (Bella's Boutique, 3 employees):**
- System #1: Growth Engine 98% — "Your Instagram has 2K followers but zero conversion path"
- System #2: Cart Recovery 91% — "Industry average cart abandonment is 70%, you have no recovery flow"
- System #3: Content Engine 85% — "You post 2x/week, top competitors post daily with UGC"

---

## Step 4 — Executive Summary / Proposal (Enhanced)

**What changes:** Adds "Your AI Team" section showing which specialist agents are assigned to this project. Proposal narrative is written by Proposal Strategist agent.

### Wireframe

```
+----------------------------------------------------------------------+
|  WIZARD STEP 4 — YOUR PROPOSAL                                       |
+----------------------------------------------------------------------+
|                                                                      |
|  +----------------------------------------------------------------+  |
|  |  EXECUTIVE SUMMARY                                              |  |
|  |  [existing proposal content — no change]                        |  |
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
|  |  AI READINESS SCORE [existing — no change]                      |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
|            [ Edit Proposal ]        [ Approve & Continue --> ]        |
+----------------------------------------------------------------------+
```

### Agent Team Assignment Rules

Primary agents (shown as cards) are selected based on selected systems:
- Support Engine → Support Responder
- Growth Engine → Growth Hacker
- Booking Engine → Rapid Prototyper
- Data Intelligence → Analytics Reporter
- Content Engine → Content Creator
- Cart Recovery → Growth Hacker (if not already assigned)
- Operations Autopilot → Software Architect
- Onboarding System → Rapid Prototyper (if not already assigned)
- Compliance → Reality Checker

Support agents (shown as list items) are always included:
- Project Shepherd — manages implementation roadmap
- Reality Checker — validates recommendations before delivery

### Agent Task Assignment

Each primary agent gets a one-line task description personalized to the client:
- Template: `${verb} your ${client-specific-noun} ${timeframe-or-detail}`
- Examples:
  - "Builds your booking bot MVP in 2 weeks"
  - "Designs your Instagram-to-purchase funnel"
  - "Projects your cost savings and ROI"

---

## Step 5 — Launch Project (Enhanced)

**What changes:** Shows the full agent team with their first tasks, plus enhanced roadmap preview.

### Wireframe

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
|  [Existing roadmap, quick wins, checklist — no change]               |
|                                                                      |
|                    [ Launch Project --> ]                              |
+----------------------------------------------------------------------+
```

---

## Agent Card Component Spec

### Primary Agent Card (Steps 4 & 5)

```
+------------------+
| (o) Agent Name   |   <- icon circle + name (Georgia serif)
|                  |
| Task description |   <- 1-2 lines, personalized (text-sm, #6B6B63)
| for this project |
+------------------+

Border: 1px solid #E8E8E4, border-radius: 4px
Background: #FFFFFF
Hover: subtle shadow lift
Icon: colored circle with agent initial or lucide icon
```

### Support Agent Row (Step 4)

```
+ Agent Name (role description)

Prefix: "+" in #00875A
Name: text-sm, #1A1A1A
Role: text-sm, #6B6B63, in parentheses
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
| [existing content]      |
+-------------------------+
|                         |
| YOUR AI TEAM            |
|                         |
| [Rapid   ] [Support ]  |
| [Prototyper] [Responder]|
|         < swipe >       |
+-------------------------+
|                         |
| READINESS: 68/100       |
| [========>         ]    |
+-------------------------+
|                         |
| [ Approve & Continue ]  |
+-------------------------+
```

---

## Implementation Checklist

- [x] Create agent data model (`/components/wizard/data/agentData.ts`)
- [x] Agent matching algorithm (industry + systems → agent team)
- [x] Fit score calculation for Step 3
- [x] "Your AI Team" section in Step 4
- [x] Agent team grid with first tasks in Step 5
- [ ] Gemini-powered personalized reasoning (Phase 2 — API integration)
- [ ] Agent task persistence to database (Phase 2 — onboarding agent)
