---
id: 043-journey-performance-monitoring
diagram_id: JOURNEY-07
prd_section: User Journeys
title: Performance monitoring journey — tracking AI impact, readiness improvement, and ROI
skill: frontend
phase: MEDIUM
priority: P2
status: Not Started
owner: Frontend
dependencies:
  - 042-journey-project-execution
  - 029-ai-insights-dashboard
estimated_effort: M
percent_complete: 0
area: client-dashboard
wizard_step: null
schema_tables: [wizard_answers, context_snapshots, projects, milestones, ai_run_logs, roadmaps]
figma_prompt: prompts/043-journey-performance-monitoring.md
---

# JOURNEY-07: Performance Monitoring Journey

## Summary Table

| Field              | Value                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------- |
| **Journey ID**     | JOURNEY-07                                                                               |
| **Prompt ID**      | 043-journey-performance-monitoring                                                       |
| **Title**          | Performance monitoring journey — tracking AI impact, readiness improvement, and ROI      |
| **Phase**          | MEDIUM                                                                                   |
| **Priority**       | P2                                                                                       |
| **Owner**          | Frontend                                                                                 |
| **Effort**         | M                                                                                        |
| **Area**           | client-dashboard                                                                         |
| **Schema Tables**  | wizard_answers, context_snapshots, projects, milestones, ai_run_logs, roadmaps           |
| **Dependencies**   | 042-journey-project-execution, 029-ai-insights-dashboard                                 |
| **Status**         | Not Started                                                                              |

---

## Description

### Situation

At least one project phase has been delivered (JOURNEY-06). The client has seen their AI Sizing System go live, or their chatbot deployed, or their forecasting model running. But the critical question remains unanswered: "Is it working? Is our investment paying off?" The platform promised measurable AI impact — now it must deliver on that promise. The client needs to see concrete metrics: how their AI readiness has improved since the initial wizard assessment, whether success metrics from the roadmap are being hit, and what the ROI looks like. The consultant needs to demonstrate value to retain the client and expand the engagement. No performance tracking, re-assessment, or ROI measurement capability exists yet.

### Why It Matters

Performance monitoring is the retention engine. Without it, clients complete their roadmap and leave — they got their deliverables but never quantified the value. With it, clients see their readiness score climb from 55 to 78, their return rates drop by 22%, their operational costs decrease by $45K/quarter. These numbers justify the investment, build trust, and create the opening for expansion: "Your readiness score improved, but there's still a gap in process automation — here's what Phase 2 could address." This journey turns a one-time engagement into a long-term relationship. It also provides Sun AI with aggregate data across clients to refine their offerings.

### What Exists

The database has wizard_answers (containing the original readiness score and AI assessments from the wizard), context_snapshots (designed for point-in-time captures of assessment data), projects and milestones (with completion dates and status), ai_run_logs (tracking AI usage), and roadmaps (with success metrics defined during wizard Step 5). The AI Insights Dashboard is planned (prompt 029) but not yet built. No re-assessment flow, metric tracking, comparison views, or reporting exists.

### The Build

**1. AI Insights Dashboard Tab**: A new tab "AI Insights" in the project dashboard navigation. This is the entry point for all performance monitoring. It shows three main sections: Readiness Score, Success Metrics, and ROI Analysis.

**2. Readiness Score Comparison**:
The original readiness score (from wizard Step 4) is stored in wizard_answers. After Phase 1 completion (or at any time the client/consultant triggers it), a "Re-run AI Readiness Assessment" button is available. Clicking it opens a lightweight re-assessment flow — the same 5 dimensions (digital maturity, data readiness, process automation, team capability, strategic alignment) are scored again by the AI, but this time using updated context: what was delivered, current system state, and user-provided updates on their capabilities. The new score is saved as a context_snapshot with a timestamp. The dashboard shows a before/after comparison:
- Side-by-side radar charts (original vs. current)
- Delta per dimension (e.g., "Process Automation: +18 points")
- Overall score change (e.g., "55 -> 73, +18 points improvement")
- Trend line if multiple re-assessments have been run

**3. Success Metrics Tracking**:
The roadmap (from wizard Step 5) includes success_metrics — e.g., "Reduce return rate from 30% to 20%" or "Increase average order value by 15%." These metrics are displayed in a table with columns: Metric Name, Baseline (from wizard), Target, Current, Status (On Track / At Risk / Exceeded). The "Current" value is entered manually by the consultant or client via an inline edit field. As values are updated, the dashboard calculates progress percentage and status color-coding:
- Green (Exceeded): current surpasses target
- Lime (On Track): current is trending toward target
- Amber (At Risk): current is below expected trajectory
- Red (Behind): current is significantly below target

**4. ROI Analysis**:
A calculated section showing:
- Total investment (from roadmap.total_investment)
- Estimated value delivered (sum of quantified metric improvements, entered by consultant)
- ROI percentage: ((value_delivered - investment) / investment) * 100
- Payback timeline: projected months to full ROI based on current trajectory
- Visual: bar chart comparing investment vs. value delivered

**5. Context Snapshots**:
Every re-assessment and metric update creates a context_snapshot row capturing the full state at that moment: readiness scores, metric values, milestone status, phase progress. This enables historical trend analysis. The dashboard includes a "History" view showing snapshots over time as a timeline with expandable detail cards.

**6. Quarterly Business Review (QBR) Report**:
A "Generate QBR" button produces a comprehensive report combining: readiness progression, success metrics, ROI, milestone timeline vs. actuals, and AI-generated strategic recommendations for next steps. The report is generated by an AI agent that synthesizes all available data and outputs a structured document (stored in the documents table). The report can be downloaded as PDF or shared via link.

**7. Re-Analysis and Expansion Suggestions**:
When the re-assessment shows significant readiness improvement (score increase > 15 points), the AI suggests next steps: "Your data readiness has improved significantly. Consider adding a Demand Forecasting system to leverage this capability." This creates a pathway back to the wizard for a follow-up engagement or a direct "Add System" flow that creates new roadmap phases on the existing project.

### Example

Three months after launching his fashion e-commerce project, James's Phase 1 (AI Sizing System) has been live for 6 weeks. His consultant Sarah suggests a readiness re-assessment. James clicks "Re-run Assessment" on his AI Insights dashboard. The AI analyzes the current state: the sizing system is deployed, return data is being collected, the model is in production. His new readiness score: 73/100, up from 55/100. The radar chart shows dramatic improvement in "Data Readiness" (+22 points) and "Process Automation" (+15 points). On the Success Metrics table, the return rate has dropped from 30% to 23% (target: 20%, status: On Track). The ROI section shows $125K invested, estimated $89K in value delivered so far (reduced returns, fewer support tickets), with a projected 8-month payback period. The AI suggests: "Your data infrastructure can now support demand forecasting — consider accelerating Phase 3." James schedules a call with Sarah to discuss. Sarah generates a QBR report and shares it with James's leadership team, reinforcing the partnership.

---

## User Stories

| ID       | Story                                                                                                                       | Priority |
| -------- | --------------------------------------------------------------------------------------------------------------------------- | -------- |
| US-043-1 | As a client, I can view my AI readiness score comparison (original vs. current) after a re-assessment.                      | P0       |
| US-043-2 | As a client, I can trigger a readiness re-assessment from the AI Insights dashboard.                                        | P0       |
| US-043-3 | As a user, I see a radar chart comparing original and current readiness scores across 5 dimensions.                          | P1       |
| US-043-4 | As a user, I can track success metrics from my roadmap with baseline, target, and current values.                            | P0       |
| US-043-5 | As a consultant, I can update the "Current" value for success metrics to reflect real-world measurements.                    | P0       |
| US-043-6 | As a user, I see success metrics color-coded by status: Exceeded (green), On Track (lime), At Risk (amber), Behind (red).   | P1       |
| US-043-7 | As a user, I see an ROI analysis section showing investment, value delivered, ROI percentage, and payback timeline.           | P1       |
| US-043-8 | As a user, I can view historical context snapshots showing how scores and metrics have changed over time.                    | P2       |
| US-043-9 | As a consultant, I can generate a Quarterly Business Review report from the AI Insights dashboard.                           | P2       |
| US-043-10 | As a client, when my readiness significantly improves, I see AI suggestions for next steps or system expansions.            | P2       |
| US-043-11 | As a user, I can download the QBR report as a PDF or share it via a link.                                                  | P2       |
| US-043-12 | As a consultant, I can enter estimated value delivered per metric to calculate ROI.                                          | P1       |

---

## Goals & Acceptance Criteria

- [ ] AI Insights tab appears in project dashboard navigation after at least one phase is completed
- [ ] "Re-run AI Readiness Assessment" button triggers a lightweight re-assessment flow
- [ ] Re-assessment calls the readiness-assessment AI agent with updated context (delivered systems, user-provided capability updates)
- [ ] New readiness score saved as context_snapshot with timestamp, linked to project
- [ ] Radar chart (Recharts) displays original score and current score overlaid on the same 5-axis chart
- [ ] Delta per dimension shown below radar chart with positive/negative indicators and point values
- [ ] Overall score change displayed prominently (e.g., "55 -> 73, +18 points")
- [ ] Trend line chart appears if 2+ re-assessments exist, showing score over time
- [ ] Success metrics table displays: Metric Name, Baseline, Target, Current (editable by consultant), Status
- [ ] Status auto-calculated: Exceeded (current > target), On Track (current >= 60% of target-baseline delta), At Risk (30-60%), Behind (<30%)
- [ ] Status color-coding: green, lime, amber, red respectively
- [ ] ROI section shows: Total Investment (from roadmap), Value Delivered (sum of consultant-entered values), ROI % (calculated), Payback Timeline (projected)
- [ ] Bar chart (Recharts) comparing investment vs. value delivered
- [ ] Context snapshots created on each re-assessment and each metric update batch
- [ ] History view shows timeline of snapshots with expandable detail cards
- [ ] "Generate QBR" button calls QBR AI agent, produces structured report, saves to documents table
- [ ] QBR report downloadable as PDF (via client-side generation or server-side rendering)
- [ ] QBR report shareable via unique link (public or authenticated)
- [ ] When readiness score increases > 15 points, AI suggestion card appears recommending next steps
- [ ] Suggestion card links to either wizard re-entry (new session) or "Add System" flow

---

## Screen Flow

### Screen 1: AI Insights Dashboard — Overview

- **Route**: `/dashboard/projects/{project_id}/insights`
- **Layout**: Full-width main content area within dashboard shell
- **Sections** (top to bottom):
  - **Readiness Score Section**:
    - Left: Dual radar chart (Recharts) — original score (dashed line, muted color) overlaid with current score (solid line, lime fill)
    - Right: Score summary card — overall score change, dimension deltas, date of last assessment
    - Button: "Re-run Assessment" (lime outline button, below the chart)
  - **Success Metrics Section**:
    - Table with columns: Metric | Baseline | Target | Current | Progress | Status
    - Each "Current" cell is an inline-editable number field (click to edit, blur to save)
    - Progress column shows a mini progress bar (0-100%)
    - Status column shows color-coded badge
  - **ROI Analysis Section**:
    - Left: Key numbers — Investment, Value Delivered, ROI %, Payback Timeline
    - Right: Bar chart comparing investment (dark teal) vs. value delivered (lime)
    - "Value Delivered" has an "Edit" link that opens a breakdown modal
  - **AI Suggestions Section** (conditional — only shown when readiness improved > 15 points):
    - Card with heading: "Recommended Next Steps"
    - AI-generated suggestion text (2-3 sentences)
    - "Explore Options" button linking to wizard or system expansion flow
- **Action**: Various (re-assessment, metric editing, QBR generation)

### Screen 2: Re-Assessment Flow

- **Route**: `/dashboard/projects/{project_id}/insights/reassess` (or modal overlay)
- **Layout**: Centered card, similar to wizard Step 4 layout
- **Elements**:
  - Heading: "Update Your AI Readiness"
  - Subtext: "Answer a few questions about your current capabilities"
  - 5 questions (one per dimension), each a Likert scale (1-5) with descriptive labels:
    - Digital Maturity: "How digitized are your core operations now?"
    - Data Readiness: "How effectively are you collecting and using data?"
    - Process Automation: "What percentage of key processes are now automated?"
    - Team Capability: "How comfortable is your team with AI tools?"
    - Strategic Alignment: "How aligned is your AI strategy with business goals?"
  - Optional text area: "What has changed since your last assessment?"
  - "Generate New Score" button (lime bg)
- **Action**: Answer questions, click "Generate New Score"
- **Transition**: Loading state (2-3s) -> results appear on AI Insights dashboard with updated radar chart

### Screen 3: Success Metrics Detail

- **Route**: `/dashboard/projects/{project_id}/insights` (inline editing on main page)
- **Interaction**: Consultant clicks on a "Current" value cell in the metrics table
- **Elements**:
  - Cell transforms to number input with up/down arrows
  - "Save" button (or auto-save on blur)
  - Optional: "Add Note" link to annotate the value (e.g., "Based on March Shopify report")
  - On save: progress bar and status badge update in real time
- **Data**: Updates a metrics tracking record; creates a context_snapshot entry

### Screen 4: ROI Breakdown Modal

- **Route**: `/dashboard/projects/{project_id}/insights` (modal overlay)
- **Trigger**: Click "Edit" on Value Delivered in ROI section
- **Layout**: Modal with table
- **Elements**:
  - Heading: "Value Delivered Breakdown"
  - Table: Category | Description | Estimated Value
  - Categories auto-populated from success metrics (e.g., "Reduced Returns", "Increased AOV")
  - Estimated Value: editable number input per row
  - "Add Custom" button to add non-metric value categories (e.g., "Time Saved: 20hrs/week = $X")
  - Total row at bottom (auto-calculated sum)
  - "Save" button
- **Action**: Edit values, save
- **Transition**: Modal closes; ROI section updates with new totals

### Screen 5: Context Snapshot History

- **Route**: `/dashboard/projects/{project_id}/insights/history`
- **Layout**: Vertical timeline of snapshot cards
- **Elements**:
  - Timeline line on the left with date markers
  - Each snapshot card:
    - Date and time
    - Trigger label: "Re-Assessment" or "Metric Update" or "Phase Completed"
    - Mini radar chart (small, non-interactive)
    - Overall readiness score at that point
    - Key metric values at that point
    - "View Full Detail" expand button
  - Expanded detail: full radar chart, all dimension scores, all metric values, delta from previous snapshot
- **Action**: Browse history, expand/collapse cards

### Screen 6: QBR Report Generation

- **Route**: `/dashboard/projects/{project_id}/insights` (modal + result)
- **Trigger**: "Generate QBR" button on AI Insights dashboard
- **Loading State**: Modal with progress: "Analyzing project data..." -> "Comparing milestones..." -> "Calculating ROI..." -> "Writing recommendations..."
- **Result**: Report preview in a document viewer
  - Sections: Executive Summary, Readiness Progression, Success Metrics Analysis, ROI Summary, Milestone Timeline vs. Actuals, Recommendations
  - "Download PDF" button
  - "Copy Share Link" button
  - "Save to Documents" button (saves to project documents)
- **Action**: Download, share, or save

---

## Data Flow

| Step                              | Action                          | Table(s) Written                                  | Table(s) Read                                      | Notes                                                      |
| --------------------------------- | ------------------------------- | ------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------- |
| Load AI Insights dashboard        | Fetch all data                  | —                                                 | wizard_answers (step-4), context_snapshots, projects, milestones, roadmaps | Join across tables for full picture |
| Trigger re-assessment             | User answers 5 questions        | —                                                 | —                                                  | Input collected on frontend                                |
| Run re-assessment                 | Call readiness-assessment agent  | ai_run_logs                                       | wizard_answers, projects, milestones, tasks         | Context includes delivered work                            |
| Save re-assessment results        | Insert snapshot                 | context_snapshots                                 | —                                                  | snapshot_type='readiness', data={scores, dimensions}       |
| Update success metric value       | Update metric current value     | context_snapshots (or dedicated metrics table)    | roadmaps (success_metrics from Step 5)             | Current value stored; snapshot records the update          |
| Calculate ROI                     | Compute on frontend             | —                                                 | roadmaps (total_investment), context_snapshots     | (value_delivered - investment) / investment * 100           |
| Update value delivered            | Consultant enters breakdown     | context_snapshots                                 | —                                                  | Breakdown categories + amounts stored                      |
| Generate QBR report               | Call QBR AI agent               | documents, ai_run_logs                            | wizard_answers, context_snapshots, projects, milestones, tasks, roadmaps | Full data synthesis |
| Save QBR report                   | Insert document                 | documents                                         | —                                                  | type='qbr_report', content=markdown, project_id            |
| Load snapshot history             | Fetch all snapshots             | —                                                 | context_snapshots (WHERE project_id ORDER BY date) | Paginated if > 20 snapshots                                |
| AI suggestion generation          | Check score delta               | —                                                 | context_snapshots (latest 2)                       | If delta > 15, generate suggestion via AI                  |

---

## AI Touchpoints

| Feature                      | Agent                      | Input                                                   | Output                                                          | Trigger                               |
| ---------------------------- | -------------------------- | ------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------- |
| Readiness re-assessment      | readiness-assessment       | 5 dimension scores (user input) + project context       | Updated overallScore, scoreBreakdown, new gaps/strengths        | User clicks "Re-run Assessment"       |
| QBR report generation        | qbr-report-agent           | All project data: readiness, metrics, milestones, ROI   | Structured report with sections, charts data, recommendations   | Consultant clicks "Generate QBR"      |
| Expansion suggestion         | expansion-suggestion-agent | Readiness delta, current gaps, available systems        | 2-3 recommended next systems with rationale                     | Auto-triggered when score delta > 15  |
| Metric interpretation        | metric-insight-agent       | Success metric current vs. target vs. baseline          | One-sentence insight per metric (e.g., "Return rate trending 2 weeks ahead of schedule") | Auto-generated on metric update |

---

## Edge Cases

| #  | Scenario                                                  | Handling                                                                                          |
| -- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1  | No phases completed yet — user navigates to Insights      | Show placeholder: "Complete your first phase to unlock AI Insights." Link to task board           |
| 2  | Original wizard readiness score is missing                | Fall back to displaying only current score; note: "Original assessment data unavailable"          |
| 3  | Re-assessment score is lower than original                | Display honestly; AI insight: "Some scores may decrease as understanding matures. Focus on..."   |
| 4  | Consultant enters unrealistic metric value (e.g., -500%)  | Validate: numeric, within reasonable range per metric type; show warning for outliers             |
| 5  | No success metrics defined in roadmap                     | Success Metrics section shows: "No metrics were defined. Add custom metrics." with "Add" button  |
| 6  | QBR generation fails (AI timeout)                         | Show error: "Report generation failed. Try again." Retry button. Partial data saved as draft     |
| 7  | Multiple re-assessments in same day                       | Allow but warn: "You already ran an assessment today. Run another?" Context snapshot still saved  |
| 8  | Value delivered exceeds investment by 10x                  | Allow but flag with note: "This ROI seems unusually high. Please verify the inputs."             |
| 9  | Project has 0 context snapshots (first visit to Insights) | Show original wizard data only; prompt: "Run your first re-assessment to start tracking progress" |
| 10 | PDF generation fails on client browser                    | Offer alternative: "Download as HTML" or "Send to email" as fallback                            |
| 11 | Share link accessed by unauthenticated user               | If QBR link is set to public: show read-only report. If authenticated: redirect to login first   |
| 12 | Consultant and client see different metric interpretations | Same data displayed to both; interpretation notes (consultant-only) are hidden from client view  |

---

## Outcomes

| Outcome                           | Metric                                                     | Target               |
| --------------------------------- | ---------------------------------------------------------- | -------------------- |
| Re-assessment adoption            | % of projects with at least 1 re-assessment                | > 60%                |
| Readiness score improvement       | Average score delta between original and first re-assessment | > +10 points        |
| Metric tracking adoption          | % of projects with at least 1 metric value updated          | > 70%               |
| ROI positivity rate               | % of projects showing positive ROI within 6 months          | > 50%               |
| QBR generation rate               | % of projects with at least 1 QBR report generated          | > 40%               |
| Client retention after insights   | % of Phase 1 clients who proceed to Phase 2                 | > 45%               |
| Expansion suggestion acceptance   | % of expansion suggestions that lead to new wizard sessions  | > 20%              |
| Dashboard visit frequency         | Average Insights tab visits per month per active project     | > 3                 |
| Context snapshot frequency        | Average snapshots per project per quarter                    | > 4                 |
| Client satisfaction with insights | Survey score for "Insights dashboard usefulness"             | > 4.0 / 5.0        |
