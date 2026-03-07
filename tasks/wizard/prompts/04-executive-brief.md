---
task_id: 004-WIZ
title: Wizard Step 4 — Executive Brief
phase: CRITICAL
priority: P0
status: In Progress
estimated_effort: 5 days
area: wizard
wizard_step: 4
skill: [design/frontend-design, product/feature-dev, ai/gemini, product/api-wiring]
subagents: [supabase-expert, code-reviewer]
edge_function: summary, generate-roadmap
schema_tables: [briefs, brief_versions, roadmaps, roadmap_phases]
depends_on: [003-WIZ]
figma_prompt: prompts/04-executive-brief.md
mermaid_diagram: mermaid-wizard/05-executive-summary.md
---

# Wizard Step 4 — Executive Brief

## Figma Make Prompt

> Design Step 4 of a 5-step premium wizard for "Sun AI Agency." This is the "Executive Summary" screen where all wizard inputs are compiled into a polished, professional strategy brief that the client reviews, can edit, and must approve.
>
> **Layout:** Three-panel layout (1440px desktop). The center panel is document-focused — it should feel like reading a beautifully typeset strategy document, not filling out a form.
>
> **Left Panel (240px, white):**
> - Stepper: Steps 1-3 completed (green checkmarks), Step 4 active, Step 5 inactive
> - Context Card (all prior data, compact):
>   - Company: "Acme Retail Group"
>   - Industry: "E-commerce / Retail"
>   - Size: "Medium"
>   - Goal: "Growth"
> - Signals: compact chip list
> - Selected Systems: list with green checks
> - New section: "Brief Status"
>   - Status badge: "Draft" (amber) / "In Review" (blue) / "Approved" (green)
>   - "Version 1" indicator
>   - "Last edited: just now"
>
> **Center Panel (flexible, white background — NOT beige, to feel like a document):**
>
> - **Document container** styled like a premium report:
>   - Max-width: 720px, centered in the panel
>   - 48px top padding, 32px side padding
>   - Subtle paper-like feel: white background, very faint border on sides
>
> - **Brief Header:**
>   - "STRATEGY BRIEF" — 12px uppercase, letter-spacing 0.1em, lime green
>   - Company name: "Acme Retail Group" — 32px Playfair Display, dark teal
>   - "Prepared by Sun AI Agency" — 14px Lora, medium gray
>   - Date: "March 6, 2026"
>   - Subtle horizontal rule (lime green, 2px, 60px wide)
>
> - **Section 1 — Executive Summary**
>   - Section heading: "Executive Summary" — 24px Playfair Display
>   - AI-generated paragraph (3-4 sentences) summarizing the business, challenges, and proposed approach
>   - Each section has a small "Edit" pencil icon (top right of section) — clicking enables inline editing
>   - Editable text has a subtle highlight/border when in edit mode
>
> - **Section 2 — Company Profile**
>   - Table-style layout:
>     - Company: Acme Retail Group
>     - Industry: E-commerce / Retail
>     - Size: Medium (11-50 employees)
>     - Primary Goal: Growth
>     - Website: www.acmeretail.com
>   - Read-only — sourced from Step 1 (editable via "Go to Step 1" link)
>
> - **Section 3 — Industry Analysis**
>   - Heading: "Industry Analysis: E-commerce & Retail"
>   - Paragraph: AI-generated analysis based on Step 2 diagnostic answers
>   - Key findings as a bulleted list:
>     - "Cart abandonment rate above 50% — significantly above industry average (38%)"
>     - "Customer support is fully manual — high opportunity for AI automation"
>     - "No personalization in place — missing 10-30% uplift in average order value"
>     - "Low repeat customer revenue (<20%) — retention is the primary growth lever"
>   - Each bullet has a small colored dot: red for problems, amber for opportunities, green for strengths
>
> - **Section 4 — Recommended Systems**
>   - For each selected system, a mini-card:
>     - System name (bold) + priority number
>     - "Why" — 1 sentence from Step 3 reasoning
>     - Impact and Effort badges
>   - Systems displayed as a compact list, not full cards
>
> - **Section 5 — Proposed Roadmap (High-Level)**
>   - Simple 3-phase visual:
>     - Phase 1: "Foundation" (Weeks 1-4) — 2-3 bullet outcomes
>     - Phase 2: "Implementation" (Weeks 5-8) — 2-3 bullet outcomes
>     - Phase 3: "Optimization" (Weeks 9-12) — 2-3 bullet outcomes
>   - Each phase as a horizontal card with phase number, title, timeline, and outcomes
>   - Connected by a horizontal line/arrow between them
>
> - **Section 6 — Expected Outcomes**
>   - 3-4 outcome cards in a 2-column grid:
>     - Each card: metric icon, metric name, projected improvement
>     - e.g., "Support Response Time" -> "80% faster"
>     - e.g., "Cart Recovery Rate" -> "10-15% recovered"
>     - e.g., "Repeat Purchase Rate" -> "25-40% increase"
>     - e.g., "Average Order Value" -> "10-30% higher"
>   - Subtle, confident — not hyperbolic
>
> - **Section 7 — Next Steps**
>   - "Upon approval of this brief, your project will be created and your dashboard activated."
>   - Checklist of what happens next:
>     - "Project created with selected systems"
>     - "Roadmap phases and milestones set"
>     - "Initial tasks generated for Phase 1"
>     - "Dashboard access enabled"
>
> - **Approval Section (bottom of document):**
>   - Horizontal card with:
>     - "Ready to proceed?" — 18px Playfair Display
>     - "By approving this brief, your project will be created and you'll enter your dashboard."
>     - Two buttons side by side:
>       - "Request Changes" — outlined button (dark teal border, no fill)
>       - "Approve Brief" — filled button (lime green background, dark text, bold)
>     - Below buttons: "You can edit any section above before approving"
>
> **Right Panel (320px, white):**
> - Sticky header: "Brief Guide" — serif, dark teal
> - Table of contents for the brief (clickable, scrolls center panel):
>   - Executive Summary
>   - Company Profile
>   - Industry Analysis
>   - Recommended Systems
>   - Proposed Roadmap
>   - Expected Outcomes
>   - Next Steps
> - Active section highlighted with lime green left border
> - Below TOC: divider
> - "Document Actions" section:
>   - "Export as PDF" button (outline)
>   - "Print" button (outline)
>   - "Share Link" button (outline)
> - Below actions: divider
> - "Version History" section:
>   - "Version 1 — Current Draft"
>   - "Created Mar 6, 2026"
>   - If edits made: "Version 2 — Edited Mar 6, 2026" appears above
>
> **Footer Bar:**
> - Left: "Back" text button
> - Center: "Draft — Not yet approved" in amber, or "Approved" in green
> - Right: "Continue" button — only active after brief is approved
>
> **Design Direction:**
> - The center panel should feel like a premium PDF report rendered in the browser
> - Think: McKinsey engagement letter meets modern SaaS — clean, confident, structured
> - Typography hierarchy is critical: large serif headings, readable body text, clear sections
> - The document should be scannable in 30 seconds but rewarding to read in detail
> - Inline editing should feel seamless — click edit, border appears, type, auto-save
> - The approval action at the bottom should feel weighty but not scary
> - Color is used sparingly — mostly for status indicators and the section rule
>
> **Responsive:**
> - Mobile: document takes full width (no side panels). TOC becomes a sticky top bar with horizontal scroll. Right panel actions move to a floating action button (FAB)
> - Tablet: document centered, right panel as slide-over drawer
> - Desktop: full three-panel

---

## Screen Purpose
Present the user with a polished executive brief that synthesizes everything from Steps 1-3. This document becomes the permanent reference for the project. The user can review, edit sections inline, and approve it. It should feel like receiving a deliverable from a premium consulting firm.

---

## Layout Specification

### Left Panel — Table of Contents

The left panel is divided into two vertical sections.

**Upper section — Discovery Wizard stepper:**
The heading "DISCOVERY WIZARD" appears at the top. Below it, five steps are listed vertically. Steps 1 through 3 each display a green checkmark indicating completion. Step 4 is marked with a filled circle, indicating it is the currently active step. Step 5 shows an empty circle, indicating it is not yet reached.

**Lower section — Brief Contents (table of contents):**
A horizontal divider separates the stepper from the table of contents. The heading "BRIEF CONTENTS" appears, followed by a vertical list of section links:

- Executive Summary — currently active, highlighted with bold text and a left accent line
- Company Profile
- Industry Analysis
- Key Challenges
- Recommended Systems
- Proposed Roadmap
- Expected Outcomes
- Next Steps

Table of contents items are clickable — scroll center panel to that section.
Active section (in viewport) is highlighted with bold text and left accent line.

### Center Panel — The Brief Document

The center panel renders as a long-scroll editorial document, styled like a consulting firm deliverable.

**Document header card:**
A contained card at the top of the document displays the agency attribution and project title. At the very top, two lines of muted uppercase text (12px caps): "SUN AI AGENCY" and "STRATEGIC BRIEF." A full-width horizontal rule separates this from the project title below. The project title "Acme Corp" is set in Playfair Display at 36px. Beneath it, a subtitle "AI Strategy & Implementation Plan" is set in Lora at 18px in a muted tone. Below the subtitle, two lines of muted 14px text: "Prepared: March 7, 2026" and "Version 1.0 — Draft." Another full-width horizontal rule closes the header card.

**Section: Executive Summary**
A section divider line with the label "EXECUTIVE SUMMARY" on the left and a pencil-icon "Edit" button on the right. Below it, body text reads: "Acme Corp is a medium-sized e-commerce business focused on growth, facing key challenges in cart abandonment recovery and customer support scalability. Our analysis identifies 4 high-impact opportunities across automation, personalization, and customer engagement. The recommended approach focuses on two primary systems — AI Cart Recovery and AI Customer Support — deliverable within a 90-day phased implementation."

**Section: Company Profile**
A section divider line with the label "COMPANY PROFILE" on the left and a pencil-icon "Edit" button on the right. Below it, a two-column data table displays:

- Company: Acme Corp
- Industry: E-commerce / Retail
- Size: Medium (21-100)
- Website: acmecorp.com
- Primary Goal: Growth

**Section: Industry Analysis**
A section divider line with the label "INDUSTRY ANALYSIS" on the left and a pencil-icon "Edit" button on the right. Below it, introductory text reads "Based on diagnostic assessment:" followed by a bulleted list:

- Customer acquisition relies on 3 channels (Google, social, paid) — moderate diversification
- Sales process is partially automated — room for AI-assisted optimization
- Support handled via email only — significant opportunity for AI chatbot deployment
- No CRM system in place — manual tracking limits scaling potential

**Section: Key Challenges**
A section divider line with the label "KEY CHALLENGES" on the left and a pencil-icon "Edit" button on the right. Below it, a numbered list of challenges:

1. Cart Abandonment (50-70%) — Above industry average. No recovery system in place. Estimated lost revenue: $XX,XXX/mo
2. Manual Customer Support — Email-only support creates delays and inconsistent experience. No self-service options available.
3. No Post-Purchase Engagement — Less than 20% repeat customers. No automated follow-up sequences. High CAC dependency.

**Section: Recommended Systems**
A section divider line with the label "RECOMMENDED SYSTEMS" on the left and a pencil-icon "Edit" button on the right. Below it, a card list with two items, each as a row within a bordered container:

- Row 1: "1. AI Cart Recovery System" with a green checkmark on the right. Subtext: "Effort: M | Impact: High" and "Recover 10-15% of abandoned carts."
- Row 2: "2. AI Customer Support Engine" with a green checkmark on the right. Subtext: "Effort: S | Impact: High" and "80% faster response, 60-80% automated."

A horizontal divider separates the two rows.

**Section: Proposed Roadmap**
A section divider line with the label "PROPOSED ROADMAP" on the left and a pencil-icon "Edit" button on the right. Below it, three phases:

- Phase 1 — Foundation (Days 1-30): Setup infrastructure, Data integration, Cart recovery system deployment
- Phase 2 — Activation (Days 31-60): AI support chatbot launch, Initial optimization, Performance benchmarking
- Phase 3 — Optimization (Days 61-90): A/B testing and refinement, Advanced personalization, ROI measurement and reporting

**Section: Expected Outcomes**
A section divider line with the label "EXPECTED OUTCOMES" on the left and a pencil-icon "Edit" button on the right. Below it, introductory text reads "At 90 days:" followed by a bulleted list:

- Cart recovery rate: +10-15%
- Support response time: -80%
- Team hours saved: ~2 hours/day
- Estimated revenue impact: +$XX,XXX/month

**Section: Next Steps**
A section divider line with the label "NEXT STEPS" on the left (no Edit button on this section). Below it, a numbered list:

1. Review and approve this brief
2. Your project dashboard will be created
3. Phase 1 tasks will be generated
4. Your dedicated team will begin execution

### Right Panel — Brief Controls

The right panel is divided into four vertical sections, each separated by horizontal dividers.

**Brief Status section:**
The heading "BRIEF STATUS" appears at the top. Below it, a card displays three metadata fields:

- Status: Draft (shown with an orange badge)
- Version: 1.0
- Last edited: now

**Actions section:**
The heading "ACTIONS" appears, followed by three stacked buttons:

- "Approve Brief" with a checkmark icon — styled as the primary action button
- "Export PDF" with a download-arrow icon — styled as a secondary button
- "Copy Share Link" with a link icon — styled as a secondary button

**Version History section:**
The heading "VERSION HISTORY" appears, followed by a card that reads: "v1.0 — Current, Created just now" and "(no prior versions)."

**About This Brief section:**
The heading "ABOUT THIS BRIEF" appears, followed by a card with explanatory text: "This brief is generated from your wizard responses. You can edit any section. Once approved, it becomes the foundation of your project dashboard."

---

## Content Data — Brief Template

### Executive Summary Template

The template follows this structure: "{company_name} is a {company_size} {industry} business focused on {primary_goal}. Based on our analysis, the primary opportunity areas are {top_signals}. We recommend {selected_systems_count} AI-powered systems targeting {primary_impact_areas}. The proposed roadmap spans {total_duration} with an estimated ROI of {roi_projection}."

### Industry Analysis — Signal-to-Finding Mapping
| Signal | Finding Text | Severity |
|--------|-------------|----------|
| High cart abandonment | Cart abandonment rate above 50% — significantly above industry average | Red |
| Manual support | Customer support is fully manual — high opportunity for AI automation | Amber |
| No personalization | No personalization in place — missing 10-30% uplift in average order value | Amber |
| Low repeat revenue | Low repeat customer revenue — retention is the primary growth lever | Red |
| No formal support | No structured support process — risk of customer churn and brand damage | Red |
| Manual sales | Sales process is manual — significant time and conversion optimization available | Amber |
| Single channel | Heavy reliance on single acquisition channel — diversification recommended | Amber |

### Roadmap Phase Template
| Phase | Title | Typical Timeline | Focus |
|-------|-------|-----------------|-------|
| 1 | Foundation | Weeks 1-4 | Setup, integration, data preparation |
| 2 | Implementation | Weeks 5-8 | System deployment, testing, training |
| 3 | Optimization | Weeks 9-12 | Performance tuning, scaling, automation |

---

## Inline Editing

When user clicks "Edit" on a section:

The section heading's "Edit" button is replaced by two text buttons: "Save" and "Cancel." The section body text transforms into an editable textarea pre-filled with the existing content and a blinking cursor, allowing the user to modify the text directly inline.

- Section becomes editable textarea
- "Edit" button becomes "Save | Cancel"
- Save creates a new `brief_versions` entry
- Version counter increments

---

## Approval Flow

| State | Badge | Continue Button |
|-------|-------|-----------------|
| Draft | Orange "Draft" | "Continue ->" (saves as draft, moves to Step 5) |
| In Review | Blue "In Review" | "Continue ->" (same) |
| Approved | Green "Approved" | "Continue ->" (creates project) |

Approval is optional before continuing — user can review and approve later from their dashboard.

---

## Responsive Behavior

### Tablet
- Left panel: table of contents becomes horizontal tabs at top
- Brief: full width, slightly reduced typography sizes
- Right panel: collapsible panel, approval button moves to bottom bar

### Mobile
- Single column, brief sections stacked
- Table of contents: horizontal scrollable tabs
- Edit: full-screen modal
- Approval: sticky bottom bar with "Approve" button
- PDF export: download button in bottom bar
- Share: native share sheet

---

## Data Saved

When the brief is saved, the following data structure is persisted:

**Table: briefs**

- **project_id** — UUID linking to the project
- **content** — An object containing all brief sections:
  - **executive_summary** — AI-generated text string
  - **company_profile** — Object with fields: name, industry, and other company details
  - **industry_analysis** — Array of bullet-point strings
  - **key_challenges** — Array of objects, each with: title, description, and severity (e.g., "high")
  - **recommended_systems** — Array of objects, each with: system_id (e.g., "cart-recovery"), selected (boolean), and impact description
  - **proposed_roadmap** — Object containing:
    - **phases** — Array of objects, each with: title, duration (e.g., "30 days"), and items array
    - **total_duration** — String (e.g., "90 days")
  - **expected_outcomes** — Array of strings (e.g., "Recovery rate: +10-15%")
  - **next_steps** — Array of strings (e.g., "Review brief", "Dashboard created")
- **status** — String, initially "draft"
- **version** — Integer, initially 1

---

## Workflow

1. **User arrives at /app/wizard/step-4**
   - Load all wizard_answers (steps 1-3)
   - Load selected systems from project_systems
   - Check for an existing brief in the briefs table
   - If a brief exists: load and display it (pre-filled)
   - If no brief exists: trigger the Edge Function to generate one
     - Input: all wizard data plus selected systems
     - Output: structured JSONB content for each section
     - Create a briefs row with status 'draft' and version 1
     - Create a brief_versions snapshot

2. **Display brief**
   - Render each section from briefs.content JSONB
   - Enable inline editing on each section

3. **User edits a section**
   - Changes are debounced by 500ms, then briefs.content is updated
   - Increment briefs.version
   - Create a new brief_versions snapshot
   - Update the right panel version history

4. **User clicks "Request Changes"**
   - Set briefs.status to 'in_review'
   - Optionally open a notes textarea for the user to describe what they want changed
   - Alert the Sun AI team (future: notification system)

5. **User clicks "Approve Brief"**
   - Show confirmation dialog: "Approve this brief and create your project?"
   - On confirm:
     - Set briefs.status to 'approved'
     - Create a brief_versions final snapshot
     - Update wizard_sessions.current_step to 5
     - Navigate to step-5
   - The "Continue" button becomes active as an alternative path

6. **User clicks "Continue" (after approval)**
   - Navigate to step-5

---

## Agent Behavior
- **AI generates the entire brief** via Edge Function on first load
- Generation takes 5-10 seconds — show elegant skeleton loading (sections appear one by one, top to bottom, with subtle fade-in)
- AI content is editable — user can override any AI-generated text
- All edits are versioned — nothing is lost
- AI explanations in the right panel are static (TOC + actions)
- PDF export renders the same layout as the screen (future feature)
