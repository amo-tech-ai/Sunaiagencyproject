---
id: 038-journey-wizard-discovery
diagram_id: JOURNEY-02
prd_section: User Journeys
title: Wizard discovery journey — 5-step AI opportunity analysis
skill: frontend
phase: CRITICAL
priority: P0
status: Not Started
owner: Frontend
dependencies:
  - 037-journey-new-user-onboarding
estimated_effort: XL
percent_complete: 0
area: wizard
wizard_step: null
schema_tables: [wizard_sessions, wizard_answers, ai_cache, ai_run_logs]
figma_prompt: prompts/038-journey-wizard-discovery.md
---

# JOURNEY-02: Wizard Discovery Journey

## Summary Table

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| **Journey ID**     | JOURNEY-02                                                         |
| **Prompt ID**      | 038-journey-wizard-discovery                                       |
| **Title**          | Wizard discovery journey — 5-step AI opportunity analysis          |
| **Phase**          | CRITICAL                                                           |
| **Priority**       | P0                                                                 |
| **Owner**          | Frontend                                                           |
| **Effort**         | XL                                                                 |
| **Area**           | wizard                                                             |
| **Schema Tables**  | wizard_sessions, wizard_answers, ai_cache, ai_run_logs             |
| **Dependencies**   | 037-journey-new-user-onboarding                                    |
| **Status**         | Not Started                                                        |

---

## Description

### Situation

A user has completed onboarding (JOURNEY-01) and is now at `/wizard`. They need to walk through a 5-step discovery process that progressively gathers business context, runs AI analysis at each step, and culminates in a personalized AI implementation roadmap. The wizard is the core product experience — it replaces the traditional sales discovery call with an interactive, AI-powered diagnostic tool. No wizard implementation exists yet; only the database schema and the concept are defined.

### Why It Matters

The wizard is the entire value proposition of the platform. It turns a vague interest in AI into a concrete, actionable plan. Each step builds on the previous one — business context informs industry diagnostics, diagnostics drive system recommendations, recommendations shape the executive summary, and the summary becomes the roadmap. If any step is confusing, slow, or produces generic output, the user loses trust and abandons. The wizard must feel like a conversation with a brilliant AI strategist, not a form submission.

### What Exists

The database schema includes wizard_sessions (tracking overall progress), wizard_answers (per-step data and AI results), ai_cache (avoiding redundant API calls), and ai_run_logs (tracking AI performance). The design system provides Playfair Display headings, Lora body text, and the dark teal / lime / beige palette. The marketing site has a `/wizard` route placeholder. Edge functions for AI agents are planned but not yet deployed.

### The Build

The wizard is a 5-step flow rendered at `/wizard` with a persistent sidebar showing progress, a main content area for questions and inputs, and a right panel for AI-generated insights.

**Step 1 — Business Context (5 min)**:
Left panel shows 5-6 input fields: company URL, business description (textarea), industry (dropdown), company size (radio: 1-10, 11-50, 51-200, 201-1000, 1000+), and primary goals (multi-select checkboxes: reduce costs, increase revenue, improve customer experience, automate operations, data-driven decisions). On "Continue," the `analyze-business` agent runs, and the right panel reveals a Company Analysis card showing detected industry, company summary, key opportunities, and competitive landscape.

**Step 2 — Industry Diagnostics (3 min)**:
Left panel shows 8 questions: 4 universal (current tech stack satisfaction, data management maturity, automation level, budget readiness) and 4 industry-specific (dynamically loaded based on detected industry from Step 1). Questions use a mix of Likert scales (1-5), single-select radio, and short text. On "Continue," the `industry-diagnostics` agent runs, and the right panel shows pain points, opportunities, and industry benchmarks with visual indicators.

**Step 3 — System Recommendations (3 min)**:
Left panel presents AI-ranked systems (from the `systems` table) with fit scores (0-100), personalized "why it fits" explanation, expected ROI range, implementation complexity, and a "quick win" flag. User selects 2-5 systems via checkboxes. On selection change, a combined strategy summary updates in the right panel showing synergies between selected systems, total investment tier, and implementation timeline estimate.

**Step 4 — Executive Summary (2 min)**:
Full-width layout. AI generates a readiness score across 5 dimensions (digital maturity, data readiness, process automation, team capability, strategic alignment) displayed as a radar chart. Below: a strategy brief (3-4 paragraphs) with inline editing — user can refine the AI-generated text. Strengths and gaps listed as pill-style tags. A "next steps" section previews what the roadmap will contain.

**Step 5 — Launch Project (2 min)**:
Left panel shows the AI-generated implementation roadmap as a timeline visualization: phases with week ranges, systems per phase, deliverables, and estimated costs. Quick wins are highlighted at the top. Risk factors and success metrics shown below. A prominent "Launch Project" button triggers the project creation flow (detailed in JOURNEY-04). For guests, a sign-up modal appears before launch.

**Persistent elements**: Sidebar with step list (numbered 1-5, current step highlighted in lime, completed steps with checkmarks), overall progress percentage, estimated time remaining. Auto-save indicator in bottom-left. Back button to revisit previous steps (AI results are cached, not re-run).

### Example

James runs a mid-size e-commerce fashion brand. In Step 1, he enters his URL and selects "E-commerce" + "Fashion" as his industry. The AI detects his Shopify store, identifies product catalog size, and summarizes his business. In Step 2, he answers industry-specific questions about return rates, personalization maturity, and inventory management. The diagnostics reveal his biggest pain point is manual size recommendations causing 30% returns. Step 3 recommends an AI Sizing System (fit score 94), Visual Search (fit score 87), and Demand Forecasting (fit score 82). James selects all three. Step 4 shows his readiness score: 72/100 with high marks in data readiness but gaps in automation infrastructure. Step 5 presents a 16-week roadmap: Phase 1 (weeks 1-6) deploys the sizing system, Phase 2 (weeks 7-12) adds visual search, Phase 3 (weeks 13-16) implements demand forecasting. He clicks "Launch Project" and enters the dashboard.

---

## User Stories

| ID       | Story                                                                                                                | Priority |
| -------- | -------------------------------------------------------------------------------------------------------------------- | -------- |
| US-038-1 | As a user, I can see my progress through the 5 wizard steps in a sidebar with step names and completion status.       | P0       |
| US-038-2 | As a user in Step 1, I can enter my business details and receive an AI-generated company analysis.                   | P0       |
| US-038-3 | As a user in Step 2, I can answer universal and industry-specific diagnostic questions.                               | P0       |
| US-038-4 | As a user in Step 2, I can see AI-generated pain points, opportunities, and benchmarks after answering.              | P0       |
| US-038-5 | As a user in Step 3, I can see AI-ranked system recommendations with fit scores and select 2-5 systems.              | P0       |
| US-038-6 | As a user in Step 3, I can see how selected systems work together in a combined strategy summary.                    | P1       |
| US-038-7 | As a user in Step 4, I can see my AI readiness score across 5 dimensions and an editable strategy brief.             | P0       |
| US-038-8 | As a user in Step 5, I can see an implementation roadmap with phases, timelines, costs, and deliverables.            | P0       |
| US-038-9 | As a user in Step 5, I can click "Launch Project" to create my project and enter the dashboard.                      | P0       |
| US-038-10 | As a user, my wizard progress auto-saves so I can return later and resume where I left off.                         | P0       |
| US-038-11 | As a user, I can navigate back to previous steps without losing data or re-triggering AI analysis.                  | P1       |
| US-038-12 | As a user, I see loading states with meaningful progress indicators while AI analysis runs.                          | P1       |
| US-038-13 | As a guest user, I can complete all 5 steps but am prompted to sign up before launching a project.                  | P1       |

---

## Goals & Acceptance Criteria

- [ ] Wizard renders at `/wizard` with a 5-step sidebar, main content area, and right panel for AI results
- [ ] Step 1 collects: company URL, description, industry, company size, goals (multi-select)
- [ ] Step 1 "Continue" triggers `analyze-business` agent and displays Company Analysis card in right panel
- [ ] Step 2 displays 4 universal questions and 4 industry-specific questions (dynamic based on Step 1 industry)
- [ ] Step 2 "Continue" triggers `industry-diagnostics` agent and displays pain points, opportunities, benchmarks
- [ ] Step 3 displays AI-ranked systems with fit score, description, ROI, complexity, and quick-win flag
- [ ] Step 3 allows selection of 2-5 systems with real-time combined strategy update
- [ ] Step 4 displays radar chart with 5-dimension readiness score
- [ ] Step 4 displays editable strategy brief (contentEditable or textarea with rich preview)
- [ ] Step 5 displays timeline visualization of implementation roadmap with phases, weeks, deliverables, costs
- [ ] Step 5 "Launch Project" button triggers project creation (JOURNEY-04) and redirects to dashboard
- [ ] Auto-save runs every 500ms to localStorage and every 2 seconds to Supabase (wizard_answers upsert)
- [ ] Sidebar shows current step highlighted (lime), completed steps with checkmarks, and progress percentage
- [ ] Back navigation loads cached data and AI results without re-triggering API calls
- [ ] Loading state during AI analysis shows animated skeleton with estimated wait time
- [ ] If AI call fails, retry once then show fallback generic insights with "Analysis partially complete" notice
- [ ] All wizard_answers rows include both `data` (user inputs) and `ai_results` (AI output) as JSONB
- [ ] wizard_sessions.current_step updates on each step transition
- [ ] Guest users see all steps but "Launch Project" is gated behind a sign-up modal

---

## Screen Flow

### Screen 1: Step 1 — Business Context

- **Route**: `/wizard` (step=1 in state)
- **Layout**: Three-column — sidebar (240px) | main content (flex-1) | right panel (360px, collapsed initially)
- **Sidebar**: Step list (1-5), current=1 highlighted in lime (#84CC16), progress bar at 0%
- **Main Content**:
  - Playfair Display heading: "Tell Us About Your Business"
  - Lora subtext: "We'll analyze your business to identify AI opportunities"
  - Company URL input (text, optional, placeholder: "https://yourcompany.com")
  - Business description textarea (required, placeholder: "Describe what your company does...")
  - Industry dropdown (required, options: E-commerce, Healthcare, Finance, Hospitality, Real Estate, Education, Fashion, Travel, Legal, Manufacturing, Other)
  - Company size radio group (required: 1-10, 11-50, 51-200, 201-1000, 1000+)
  - Primary goals checkboxes (select all that apply: Reduce Costs, Increase Revenue, Improve Customer Experience, Automate Operations, Data-Driven Decisions, Scale Operations)
  - "Continue" button (dark teal, full width at bottom)
- **Right Panel**: Collapsed/empty with placeholder text "AI analysis will appear here"
- **Action**: Click "Continue"
- **Transition**: AI loading state (2-5 seconds) -> right panel expands with Company Analysis card -> auto-advance to Step 2

### Screen 2: Step 2 — Industry Diagnostics

- **Route**: `/wizard` (step=2 in state)
- **Sidebar**: Step 1 = checkmark, Step 2 = highlighted, progress bar at 20%
- **Main Content**:
  - Heading: "Industry Diagnostics"
  - Subtext: "Answer these questions to help us understand your current capabilities"
  - **Universal Questions (Q1-Q4)**:
    - Q1: "How satisfied are you with your current technology stack?" (Likert 1-5)
    - Q2: "How would you rate your data management maturity?" (Likert 1-5)
    - Q3: "What percentage of your operations are automated?" (Radio: <10%, 10-30%, 30-50%, 50-70%, >70%)
    - Q4: "What is your annual technology budget range?" (Radio: <$50K, $50-150K, $150-500K, $500K-1M, >$1M)
  - **Industry-Specific Questions (Q5-Q8)**: Dynamically loaded based on detected industry
  - "Continue" button
- **Right Panel**: Company Analysis card from Step 1 (persisted)
- **Action**: Click "Continue"
- **Transition**: AI loading -> right panel updates with Diagnostics Results (pain points, opportunities, benchmarks)

### Screen 3: Step 3 — System Recommendations

- **Route**: `/wizard` (step=3 in state)
- **Sidebar**: Steps 1-2 = checkmarks, Step 3 = highlighted, progress bar at 40%
- **Main Content**:
  - Heading: "Recommended AI Systems"
  - Subtext: "Select 2-5 systems that align with your goals"
  - System cards in a grid (2 columns):
    - Each card: system name, fit score badge (0-100, color-coded), "Why it fits" paragraph, expected ROI, complexity indicator (Low/Med/High), quick win badge if applicable
    - Checkbox on each card for selection
    - Selected cards get a lime border highlight
  - Selection count indicator: "2 of 5 selected" with min/max validation
  - "Continue" button (disabled until 2+ selected)
- **Right Panel**: Combined Strategy Summary — updates in real-time as selections change. Shows synergies, total investment tier, implementation timeline estimate.
- **Action**: Select systems, click "Continue"
- **Transition**: AI loading -> advance to Step 4

### Screen 4: Step 4 — Executive Summary

- **Route**: `/wizard` (step=4 in state)
- **Sidebar**: Steps 1-3 = checkmarks, Step 4 = highlighted, progress bar at 70%
- **Layout**: Full-width (right panel merged into main), max-w-[1000px] centered
- **Main Content**:
  - Heading: "Your AI Readiness Assessment"
  - **Readiness Score Section**:
    - Overall score: large number (e.g., "72/100") with color indicator
    - Radar chart (Recharts) with 5 axes: Digital Maturity, Data Readiness, Process Automation, Team Capability, Strategic Alignment
    - Score breakdown: 5 rows with dimension name, score bar, and brief explanation
  - **Strategy Brief Section**:
    - Heading: "Strategy Brief"
    - Editable text area (3-4 AI-generated paragraphs) with "Edit" toggle button
    - Strengths displayed as lime pill tags
    - Gaps displayed as amber/red pill tags
  - **Next Steps Preview**:
    - Bulleted list of what the roadmap will include
  - "Continue to Roadmap" button
- **Action**: Review/edit, click "Continue to Roadmap"
- **Transition**: AI loading -> advance to Step 5

### Screen 5: Step 5 — Launch Project

- **Route**: `/wizard` (step=5 in state)
- **Sidebar**: Steps 1-4 = checkmarks, Step 5 = highlighted, progress bar at 90%
- **Layout**: Full-width, max-w-[1200px]
- **Main Content**:
  - Heading: "Your Implementation Roadmap"
  - **Quick Wins Section**: Highlighted cards at top showing immediate-impact items
  - **Roadmap Timeline**: Horizontal timeline visualization showing phases
    - Each phase: title, week range (e.g., "Weeks 1-6"), systems included, key deliverables, estimated cost
    - Phases connected by timeline line with milestone markers
  - **Risk Factors**: Collapsible section with identified risks and mitigations
  - **Success Metrics**: Table showing metric name, current baseline, target value, measurement method
  - **Launch Section**:
    - Summary: "Total timeline: X weeks | Estimated investment: $X-$Y"
    - "Launch Project" button (large, lime bg, dark text, prominent)
    - For guests: button triggers sign-up modal first
- **Action**: Click "Launch Project"
- **Transition**: Project creation (JOURNEY-04) -> redirect to `/dashboard`

---

## Data Flow

| Step   | Action                     | Table(s) Written                          | Table(s) Read               | Notes                                                       |
| ------ | -------------------------- | ----------------------------------------- | --------------------------- | ----------------------------------------------------------- |
| Entry  | Load wizard                | —                                         | wizard_sessions             | Check for existing session, load current_step               |
| Step 1 | Save user inputs           | wizard_answers (screen_id='step-1')       | —                           | data: {url, description, industry, size, goals}             |
| Step 1 | Run analyze-business       | ai_cache, ai_run_logs                     | ai_cache (cache check)      | Cache key = hash(inputs); log duration + tokens             |
| Step 1 | Save AI results            | wizard_answers (upsert ai_results)        | —                           | ai_results: {companySummary, detectedIndustry, opportunities} |
| Step 1 | Update session             | wizard_sessions (current_step=2)          | —                           | Mark step 1 complete                                        |
| Step 2 | Save user inputs           | wizard_answers (screen_id='step-2')       | wizard_answers (step-1)     | data: {Q1-Q8 answers}; reads step-1 for industry context    |
| Step 2 | Run industry-diagnostics   | ai_cache, ai_run_logs                     | ai_cache                    | Input includes step-1 and step-2 data                       |
| Step 2 | Save AI results            | wizard_answers (upsert ai_results)        | —                           | ai_results: {painPoints, opportunities, benchmarks}         |
| Step 2 | Update session             | wizard_sessions (current_step=3)          | —                           | Mark step 2 complete                                        |
| Step 3 | Load recommendations       | —                                         | wizard_answers (steps 1-2), systems | AI uses prior answers + available systems          |
| Step 3 | Save selections            | wizard_answers (screen_id='step-3')       | —                           | data: {selectedSystems: [...ids]}                           |
| Step 3 | Run system-ranking         | ai_cache, ai_run_logs                     | ai_cache, systems           | Ranks all systems, returns fit scores                       |
| Step 3 | Save AI results            | wizard_answers (upsert ai_results)        | —                           | ai_results: {rankedSystems, combinedStrategy, investmentTier} |
| Step 3 | Update session             | wizard_sessions (current_step=4)          | —                           | Mark step 3 complete                                        |
| Step 4 | Run readiness assessment   | ai_cache, ai_run_logs                     | wizard_answers (steps 1-3)  | Aggregates all prior data for scoring                       |
| Step 4 | Save AI results            | wizard_answers (screen_id='step-4')       | —                           | ai_results: {overallScore, scoreBreakdown, gaps, strengths} |
| Step 4 | Save user edits            | wizard_answers (update data.editedBrief)  | —                           | Only if user edited the strategy brief                      |
| Step 4 | Update session             | wizard_sessions (current_step=5)          | —                           | Mark step 4 complete                                        |
| Step 5 | Run generate-roadmap       | ai_cache, ai_run_logs                     | wizard_answers (steps 1-4)  | Full context from all steps                                 |
| Step 5 | Save AI results            | wizard_answers (screen_id='step-5')       | —                           | ai_results: {title, phases, quickWins, risks, metrics}      |
| Step 5 | Launch project             | See JOURNEY-04                            | wizard_answers (all)        | Triggers full project creation cascade                      |
| Auto   | Auto-save (every 2s)       | wizard_answers (upsert)                   | —                           | Debounced; localStorage updated every 500ms                 |

---

## AI Touchpoints

| Wizard Step | Agent Name            | Input                                              | Output                                                          | Avg Latency | Cache TTL |
| ----------- | --------------------- | -------------------------------------------------- | --------------------------------------------------------------- | ----------- | --------- |
| Step 1      | analyze-business      | URL, description, industry, size, goals            | companySummary, detectedIndustry, opportunities, landscape       | 3-5s        | 24h       |
| Step 2      | industry-diagnostics  | Step 1 context + Q1-Q8 answers                     | painPoints[], opportunities[], benchmarks{}                      | 3-5s        | 24h       |
| Step 3      | system-ranking        | Steps 1-2 context + available systems list         | rankedSystems[], combinedStrategy, investmentTier                | 4-6s        | 12h       |
| Step 4      | readiness-assessment  | Steps 1-3 context + selected systems               | overallScore, scoreBreakdown{}, gaps[], strengths[], nextSteps[] | 3-5s        | 12h       |
| Step 5      | generate-roadmap      | Steps 1-4 context + selected systems + readiness   | title, phases[], quickWins[], riskFactors[], successMetrics[]    | 5-8s        | 6h        |

All agents: Model = Gemini, structured JSON output, logged to ai_run_logs with agent_name, model, prompt_tokens, completion_tokens, duration_ms, success boolean.

---

## Edge Cases

| #  | Scenario                                        | Handling                                                                                          |
| -- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1  | AI agent times out (>15s)                        | Show timeout message, offer "Try again" button; do not auto-advance                              |
| 2  | AI returns malformed JSON                        | Wrap raw text in {rawText: "..."}, display in a simplified format, log error                     |
| 3  | User navigates back after AI ran                 | Load cached AI results from wizard_answers; do not re-trigger AI call                            |
| 4  | User changes Step 1 industry after Step 2 done   | Invalidate Steps 2-5 data; show confirmation dialog: "Changing industry will reset later steps"  |
| 5  | User selects fewer than 2 systems in Step 3      | "Continue" button disabled; show helper text: "Select at least 2 systems"                        |
| 6  | User selects more than 5 systems in Step 3       | Prevent additional selection; show: "Maximum 5 systems. Deselect one to choose another."         |
| 7  | Browser tab closed mid-wizard                    | Auto-save ensures data persists; on return, resume from last saved step                          |
| 8  | Network goes offline during auto-save            | Continue saving to localStorage; queue Supabase writes; sync when online                         |
| 9  | Two tabs open on same wizard session             | Last-write-wins with timestamp; show "Session updated in another tab" if conflict detected       |
| 10 | User edits strategy brief to empty string        | Revert to AI-generated text; show: "Brief cannot be empty. Original text restored."              |
| 11 | Company URL returns 404 during analysis          | AI proceeds without URL data; note in results: "Website could not be analyzed"                   |
| 12 | Guest reaches Step 5 with large localStorage     | Limit localStorage to 2MB; compress JSON if approaching limit                                    |

---

## Outcomes

| Outcome                           | Metric                                          | Target              |
| --------------------------------- | ----------------------------------------------- | ------------------- |
| Wizard completion rate            | % of users who complete all 5 steps             | > 65%               |
| Step 1 completion rate            | % of users who complete Step 1                  | > 85%               |
| Step drop-off identification      | Highest drop-off step                           | Tracked per step    |
| AI analysis satisfaction          | % of users who do NOT edit strategy brief       | > 70%               |
| Average wizard duration           | Median minutes from Step 1 to Step 5            | < 15 minutes        |
| System selection engagement       | Average number of systems selected in Step 3    | 2.5 - 3.5           |
| Readiness score distribution      | Average overall readiness score across users     | 55-75 (bell curve)  |
| Project launch rate               | % of Step 5 viewers who click "Launch Project"  | > 75%               |
| Cache hit rate                    | % of AI calls served from cache                 | > 20%               |
| AI error rate                     | % of AI calls that fail or timeout              | < 5%                |
