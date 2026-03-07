# Sun AI Agency — Diagram Index

**Source:** `prd.md` (v3.0)
**System:** `system.md` (PRD -> Diagrams -> Tasks -> Roadmap -> Milestones)
**Date:** 2026-03-07

---

## Phase Summary

| Phase | Diagrams | Question |
|-------|----------|----------|
| CORE | 5 | Can it work at all? |
| MVP | 5 | Does it solve the main problem? |
| ADVANCED | 5 | Does it help users do better? |
| PRODUCTION | 3 | Can it be trusted at scale? |
| **Total** | **18** | |

---

## CORE Phase

| ID | Title | Type | PRD Section | File |
|----|-------|------|-------------|------|
| CORE-ARCH-01 | System Architecture (C4 Context) | C4Context, flowchart | 3. Tech Stack | [CORE-ARCH-01.md](CORE-ARCH-01.md) |
| CORE-AUTH-01 | Authentication & Entry Flow | flowchart, sequence | 6.2 Auth & Entry, 12. Auth & Security | [CORE-AUTH-01.md](CORE-AUTH-01.md) |
| CORE-DATA-01 | Core Database ERD | erDiagram | 8. Data Model | [CORE-DATA-01.md](CORE-DATA-01.md) |
| CORE-EDGE-01 | Edge Function Architecture | flowchart, sequence | 7. AI Agents | [CORE-EDGE-01.md](CORE-EDGE-01.md) |
| CORE-WIZARD-01 | Wizard Shell & Navigation | flowchart, stateDiagram | 5. Layouts, 6.3 Wizard | [CORE-WIZARD-01.md](CORE-WIZARD-01.md) |

---

## MVP Phase

| ID | Title | Type | PRD Section | File |
|----|-------|------|-------------|------|
| MVP-WIZ-01 | Wizard Steps 1-5 Complete Sequence | sequence | 6.3 Wizard, 11.1 Prospect to Client | [MVP-WIZ-01.md](MVP-WIZ-01.md) |
| MVP-AI-01 | AI Agent Pipeline (17 Agents) | classDiagram, flowchart | 7. AI Agents | [MVP-AI-01.md](MVP-AI-01.md) |
| MVP-SAVE-01 | Auto-Save & Data Persistence | sequence, flowchart | 8.3 Auto-Save Pattern | [MVP-SAVE-01.md](MVP-SAVE-01.md) |
| MVP-BRIEF-01 | Brief Approval Workflow | stateDiagram, sequence | 6.3 Step 4, 11.2 Brief Approval | [MVP-BRIEF-01.md](MVP-BRIEF-01.md) |
| MVP-DASH-01 | Client Dashboard | flowchart, erDiagram | 6.4 Client Dashboard, 11.4 | [MVP-DASH-01.md](MVP-DASH-01.md) |

---

## ADVANCED Phase

| ID | Title | Type | PRD Section | File |
|----|-------|------|-------------|------|
| ADV-AGENCY-01 | Agency Dashboard & CRM Pipeline | flowchart, erDiagram | 6.5 Agency Dashboard, 11.5 | [ADV-AGENCY-01.md](ADV-AGENCY-01.md) |
| ADV-CHAT-01 | Chatbot System & Command Bar | sequence, flowchart | 7.3-7.4 Agents, 8.1 Chat tables | [ADV-CHAT-01.md](ADV-CHAT-01.md) |
| ADV-REV-01 | Revenue & Billing (Stripe) | sequence, flowchart | 13. Revenue Model | [ADV-REV-01.md](ADV-REV-01.md) |
| ADV-SVC-01 | Services Catalog & Industry Packs | classDiagram, flowchart | 9. Industry Packs, 10. Services | [ADV-SVC-01.md](ADV-SVC-01.md) |
| ADV-RAG-01 | RAG Pipeline & Knowledge Base | sequence, flowchart, erDiagram | 8.1 Knowledge tables, 7.6 Planned | [ADV-RAG-01.md](ADV-RAG-01.md) |

---

## PRODUCTION Phase

| ID | Title | Type | PRD Section | File |
|----|-------|------|-------------|------|
| PROD-SEC-01 | Security Model (RLS, JWT, Access Control) | flowchart, classDiagram | 12. Auth & Security | [PROD-SEC-01.md](PROD-SEC-01.md) |
| PROD-PERF-01 | Performance & Monitoring | flowchart | 14. Performance Requirements | [PROD-PERF-01.md](PROD-PERF-01.md) |
| PROD-ERR-01 | Error Handling & Recovery Patterns | sequence, flowchart | 17. Risks (Technical) | [PROD-ERR-01.md](PROD-ERR-01.md) |

---

## Existing Wizard Diagrams

These pre-existing diagrams in `tasks/wizard/mermaid-wizard/` cover the wizard in detail. The MVP-WIZ-01 diagram above is the end-to-end sequence; these provide deeper per-step views:

| File | Content |
|------|---------|
| `00-wizard-overview.md` | Main flow, state machine, data flow, AI pipeline, three-panel layout |
| `01-auth-entry.md` | Auth flow, post-auth routing, auth sequence |
| `01-wizard-flow.md` | Wizard flow details |
| `02-business-context.md` | Step 1 deep dive |
| `02-data-flow.md` | Data flow across steps |
| `03-ai-agent-flow.md` | AI agent interactions |
| `03-industry-diagnostics.md` | Step 2 deep dive |
| `04-system-recommendations.md` | Step 3 deep dive |
| `04-ui-layout.md` | UI layout details |
| `05-executive-summary.md` | Step 4 deep dive |
| `05-dashboard-transition.md` | Wizard-to-dashboard transition |
| `06-launch-project.md` | Step 5 deep dive |

---

## Phase Rules (from system.md)

1. Phases apply to DIAGRAMS, not tasks
2. Tasks inherit phase from their diagram
3. Roadmaps organize DIAGRAMS by phase
4. Milestones complete when ALL diagrams in a phase are complete
5. Progress rolls up: Tasks -> Diagrams -> Phase -> Milestone
6. Diagrams never move between phases

## Flow

```
PRD (prd.md)
  |
  v
Diagrams (tasks/mermaid/) <-- this index
  |
  v
Tasks (tasks/index-progress.md)
  |
  v
Roadmap (roadmap.md) -- phases: CORE -> MVP -> ADVANCED -> PRODUCTION
  |
  v
Milestones -- prove phase completion
```
