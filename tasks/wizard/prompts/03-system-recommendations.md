---
task_id: 003-WIZ
title: Wizard Step 3 — System Recommendations
phase: CRITICAL
priority: P0
status: In Progress
estimated_effort: 4 days
area: wizard
wizard_step: 3
skill: [design/frontend-design, product/feature-dev, ai/gemini, product/api-wiring]
subagents: [supabase-expert]
edge_function: recommend-systems
schema_tables: [project_systems, ai_cache, systems, system_services]
depends_on: [002-WIZ]
figma_prompt: prompts/03-system-recommendations.md
mermaid_diagram: mermaid-wizard/04-system-recommendations.md
---

# Wizard Step 3 — System Recommendations

## Figma Make Prompt

> Design Step 3 of a 5-step premium wizard for "Sun AI Agency." This is the key decision screen titled "System Recommendations" where AI-generated system proposals are presented for the user to review and select.
>
> **Layout:** Three-panel layout (1440px desktop). This screen has the richest right panel.
>
> **Left Panel (240px, white):**
> - Stepper: Steps 1-2 completed (green checkmarks), Step 3 active (lime green), Steps 4-5 inactive
> - Context Card:
>   - Company: "Acme Retail Group"
>   - Industry: "E-commerce / Retail"
>   - Size: "Medium"
>   - Goal: "Growth"
> - Signals from Step 2 (compact list):
>   - "High cart abandonment"
>   - "Manual support"
>   - "No personalization"
>   - "Low repeat revenue"
> - New section: "Your Selections" — starts empty, fills as user selects systems:
>   - Selected system names with small green checkmark
>   - Running count: "2 of 5 selected"
>
> **Center Panel (flexible, beige):**
> - Heading: "Our recommendations for your business" — Playfair Display
> - Subtitle: "Based on your industry, goals, and diagnostic results, we recommend these systems. Select the ones you'd like to pursue." — Lora, gray
> - Sort/filter bar: "Sort by: Recommended priority | Impact | Effort" — small pills, active has underline
>
> - **Recommendation Cards (vertical stack, 32px gap):**
>
>   **Card Design — Each system recommendation:**
>   - White card, 12px radius, 24px padding, full width
>   - Top row:
>     - Left: Priority badge — "#1 RECOMMENDED" in small lime green pill (or "#2", "#3", etc.)
>     - Right: Select toggle — large checkbox/switch. Unselected: gray outline. Selected: lime green with checkmark
>   - System name: 20px Playfair Display, dark teal (e.g., "AI Customer Support Engine")
>   - One-line description: "Automated first-line support with intelligent escalation" — Lora, gray
>   - **Why it fits section:**
>     - Small label "WHY THIS FITS YOUR BUSINESS" (12px, uppercase, lime green)
>     - 2-3 bullet points tied to user's specific answers, each with a small arrow icon:
>       - "Your support is currently manual — this automates 60-80% of inquiries"
>       - "Customers primarily find you via Google — chatbot improves on-site conversion"
>   - **Impact row** (horizontal, 3 metrics in small cards):
>     - "Expected Impact: High" — green badge
>     - "Effort: Medium" — amber badge
>     - "Timeline: 2-4 weeks" — gray badge
>   - **Expand button:** "See details & trade-offs >" — text link, dark teal
>     - Expanded section (accordion):
>       - "What this system does" — 2-3 sentences
>       - "Trade-offs to consider" — bullet list
>       - "Related services" — tags linking to services catalog
>   - **Bottom border** if selected: 2px lime green bottom border. If not selected: 1px light gray
>
>   **Show 4-6 recommendation cards total.** Example systems for E-commerce:
>   1. "AI Customer Support Engine" — #1 priority
>   2. "Cart Recovery & Follow-Up System" — #2
>   3. "Personalized Recommendation Engine" — #3
>   4. "Sales & Marketing Automation Suite" — #4
>   5. "Customer Loyalty & Retention System" — #5
>
>   **Non-recommended section** (below recommendations):
>   - Subtle divider with text: "Other available systems"
>   - Collapsed by default — "Show 3 more systems >"
>   - These are systems not recommended but available to select
>   - Cards have muted styling: no priority badge, lighter border
>
> **Right Panel (320px, white):**
> - Sticky header: "Your Selection Summary" — Playfair Display, dark teal
> - Dynamic content updates as user selects/deselects:
>
>   **When nothing selected:**
>   - Empty state: "Select systems from the recommendations to see your summary here."
>   - Soft illustration or icon: clipboard/checklist outline
>
>   **When systems selected:**
>   - "Selected Systems" header with count badge
>   - List of selected system names (compact, with remove "x" button)
>   - Divider
>   - "Combined Impact" section:
>     - "Estimated time to deploy: 6-10 weeks"
>     - "Total effort: Medium-Large"
>     - "Primary focus area: Customer Experience + Revenue"
>   - Divider
>   - "Investment Tier" indicator:
>     - Tier 1 (1-2 systems): "Focused"
>     - Tier 2 (3-4 systems): "Comprehensive"
>     - Tier 3 (5+ systems): "Full Transformation"
>   - Shown as a horizontal bar with tiers, current tier highlighted
>   - Divider
>   - "Recommendation" note:
>     - "We recommend starting with your top 2-3 priorities and expanding after initial results."
>     - Subtle, advisory tone — not pushy
>
> **Footer Bar:**
> - Left: "Back" text button
> - Center: "All changes saved" with green dot
> - Right: "Continue" button — active only when at least 1 system is selected
> - Micro-text above Continue: "You can change selections later"
>
> **Design Direction:**
> - This is the most visually rich screen — but still calm and structured
> - Cards should feel substantial but not heavy — white with good spacing
> - The priority badges create a natural reading order
> - Selected cards should feel "activated" — lime green border, slightly elevated feel
> - The right panel summary should feel like a live receipt updating in real-time
> - Transitions: when selecting a card, smooth border color change (200ms). When a system appears in the right panel, slide-in animation
> - No overwhelming animations — everything is subtle and professional
> - The "Why this fits" section is the most important — it must feel personalized, not generic
>
> **Responsive:**
> - Mobile: cards stack full width. Right panel becomes a sticky bottom bar showing "X systems selected — View Summary" that opens a bottom sheet
> - Tablet: two columns — cards + right panel as slide-over
> - Desktop: full three-panel layout

---

## Screen Purpose
Present AI-generated system recommendations grounded in the user's specific answers. Each recommendation is tied to their data — never generic. The user chooses which systems to pursue. This is the moment the platform demonstrates its intelligence and earns trust.

---

## Layout Specification

### Left Panel — Progress + Signals

The left panel is a 240px-wide vertical sidebar with three sections separated by horizontal dividers.

**Top section — Progress Stepper:**
- The heading "DISCOVERY WIZARD" appears at the top.
- Below it, a vertical step list:
  - Step 1 — shown as completed with a green checkmark.
  - Step 2 — shown as completed with a green checkmark.
  - Step 3 — shown as the currently active step with a filled green dot.
  - Step 4 — shown as incomplete with an empty circle.
  - Step 5 — shown as incomplete with an empty circle.

**Middle section — Signals Detected:**
- Below a horizontal divider, the heading "SIGNALS DETECTED" appears in caps.
- A vertical list of detected signals, each prefixed with a filled green dot:
  - Low automation
  - No CRM
  - High cart abandonment
  - No retention system
- Below the list, a counter: "4 opportunities."

**Bottom section — Company Info:**
- Below another horizontal divider, the heading "COMPANY" appears in caps.
- Three lines of summary text: "Acme Corp", "E-commerce", "Medium."

### Center Panel — Recommendation Cards

The center panel is a flexible-width column (max 720px) containing the page heading, a vertical stack of recommendation cards, and a freeform notes section at the bottom.

**Page heading:**
- Title: "Your Recommended Systems" in Playfair Display at 32px.
- Subtitle: "Based on your industry analysis, we recommend the following systems for your business." in Lora at 16px, muted color.

**Recommendation Card 1 (highest priority):**
- A bordered card with "RECOMMENDATION 1" and "PRIORITY" labels at the top edge.
- Inside the card:
  - A numbered badge showing "1" on the left, followed by the system name "AI Cart Recovery System" in Playfair Display at 22px.
  - A "WHY IT FITS" section (12px uppercase label) with a contextual paragraph: "Your cart abandonment rate is in the 50-70% range — above industry average. Combined with no post-purchase follow-up, this is your highest-impact opportunity."
  - An "EXPECTED IMPACT" section: "Recover 10-15% of abandoned carts" with a sub-line "estimated +$X,XXX/month in revenue."
  - Two inline badges: an Effort badge showing "M" and a Priority badge showing "Priority 1" with three filled stars.
  - A toggle row: a checkbox/toggle labeled "Select this system" — shown as selected (checked) in the example.
  - An expandable link: "View detailed breakdown" with a right-pointing triangle indicator.

**Recommendation Card 2:**
- Same bordered card structure.
- Numbered badge "2", system name "AI Customer Support Engine."
- WHY IT FITS: "You handle support via email only with no formal process. An AI chatbot can handle 60-80% of inquiries instantly."
- EXPECTED IMPACT: "Reduce support response time by 80%" and "Free team for complex issues."
- Two inline badges: Effort "S", Priority "Priority 2" with two filled stars and one empty star.
- Toggle row: shown as unselected (unchecked) in the example.

**Additional cards** follow the same pattern (4-6 total depending on detected signals).

**Freeform notes section (bottom of card stack):**
- A bordered container with the prompt: "Not seeing what you need? Tell us what else matters to your business."
- A text input field with placeholder text: "Additional notes or requirements."

### Right Panel — Selection Summary

The right panel is 320px wide and contains three sections separated by horizontal dividers. It updates live as the user toggles systems on and off.

**Section 1 — YOUR SELECTION:**
- Heading: "YOUR SELECTION" in 12px uppercase.
- A bordered card containing:
  - A count line: "2 of 5 systems selected."
  - A horizontal divider within the card.
  - A list of selected systems, each with a checkmark prefix and its effort level:
    - Checkmark, "AI Cart Recovery", Effort: M
    - Checkmark, "AI Support Engine", Effort: S
  - Another horizontal divider within the card.
  - A "Combined Impact" summary as a bulleted list:
    - Revenue recovery
    - 80% faster support
    - 2 team hours/day saved

**Section 2 — ESTIMATED TIMELINE:**
- Heading: "ESTIMATED TIMELINE" in uppercase.
- A bordered card listing:
  - Phase 1: 30 days
  - Phase 2: 30 days
  - Phase 3: 30 days
  - Total: approximately 90 days

**Section 3 — HOW WE WORK:**
- Heading: "HOW WE WORK" in uppercase.
- A bordered card with the message: "You choose. We don't auto-add systems. Your selections become the foundation of your strategy."

---

## Content Data — System Catalog

### Systems Available (from `systems` table)
| System ID | Name | Description | Icon |
|-----------|------|-------------|------|
| growth-engine | Growth Engine | AI-powered marketing, lead gen, and conversion optimization | Rocket |
| support-engine | AI Customer Support Engine | Automated first-line support with intelligent escalation | Headset |
| cart-recovery | Cart Recovery System | Automated abandoned cart follow-up and win-back sequences | Shopping cart + arrow |
| recommendation-engine | Personalized Recommendation Engine | AI-driven product suggestions based on behavior and preferences | Sparkle + grid |
| sales-automation | Sales & Marketing Automation | End-to-end sales funnel automation with AI-driven outreach | Target |
| loyalty-system | Customer Loyalty & Retention | AI-powered churn prediction and retention workflows | Heart + shield |
| operations-autopilot | Operations Autopilot | Workflow automation, scheduling, and resource optimization | Gear + brain |
| data-intelligence | Data Intelligence Platform | Analytics, dashboards, and AI-driven business insights | Chart + lightbulb |
| booking-engine | Smart Booking Engine | AI-optimized scheduling, availability, and booking management | Calendar + check |
| compliance-automation | Compliance Automation | Document processing, regulatory checks, and audit trail | Shield + document |
| content-engine | Content Generation Engine | AI-powered content creation for marketing and communications | Pen + AI |
| onboarding-system | Digital Onboarding System | Streamlined client/patient onboarding with smart forms | User + arrow |

### Impact Scoring Matrix
| Impact Level | Badge Color | Description |
|-------------|-------------|-------------|
| High | Green (#84CC16) | Significant measurable improvement |
| Medium | Amber (#F59E0B) | Moderate improvement, good ROI |
| Low | Gray (#9CA3AF) | Incremental improvement |

### Effort Scoring
| Effort | Badge | Timeline |
|--------|-------|----------|
| S (Small) | Green | 1-2 weeks |
| M (Medium) | Amber | 2-4 weeks |
| L (Large) | Orange | 4-8 weeks |
| XL (Extra Large) | Red | 8+ weeks |

---

## Recommendation Card Component

### Layout

Each recommendation card is a bordered container with the following elements arranged top to bottom:

- **Top row:** A small square badge on the left containing the recommendation number (e.g., "1", "2", "3"). To its right, the system name in a larger font. A select/deselect toggle is aligned to the far right of this row.
- **WHY IT FITS section:** A 12px uppercase label followed by a contextual explanation paragraph tied to the user's data.
- **EXPECTED IMPACT section:** A label followed by a quantified outcome statement.
- **Badges row:** Two inline badges — an Effort badge (S, M, L, or XL) and a Priority badge (1, 2, or 3).
- **Expandable link:** A "View detailed breakdown" text link with a right-pointing triangle indicator.

### States
| State | Visual |
|-------|--------|
| Default | 1px border #D4CFC8, white bg |
| Hover | 1px border #0A211F |
| Selected | 2px border #84CC16, subtle green-tint bg (#F8FFF0) |
| Expanded | Card height increases, shows detailed breakdown |

### Expanded Content
- Problem it solves (from their data)
- How it works (2-3 bullet points)
- Trade-offs (honest assessment)
- Integration requirements
- Similar client results

### Effort Badges
| Badge | Color | Meaning |
|-------|-------|---------|
| S | Green bg #84CC16/10, green text | Quick win, 1-2 weeks |
| M | Blue bg #3B82F6/10, blue text | Standard, 3-4 weeks |
| L | Orange bg #F59E0B/10, orange text | Significant, 5-8 weeks |
| XL | Red bg #DC2626/10, red text | Major initiative, 8+ weeks |

---

## Responsive Behavior

### Tablet
- Left panel collapses to top bar
- Cards: full width, stacked
- Right panel: collapsible "Your Selection" drawer, slides from right
- Selection counter badge in top bar

### Mobile
- Single column, 16px padding
- Cards: full width, slightly simplified (hide expanded details by default)
- Selection summary: sticky bottom bar showing "2 selected" — tap to review
- Priority/effort badges: inline with title

---

## Data Saved

The following fields are saved when this screen is completed:

| Field | Example Value |
|-------|---------------|
| screen_id | step-3 |
| data.recommendations_shown | cart-recovery, ai-support, crm-system, growth-engine, retention-automation |
| data.selected_systems | cart-recovery, ai-support |
| data.deselected_systems | crm-system, growth-engine, retention-automation |
| data.priority_order | cart-recovery, ai-support |
| data.additional_notes | We'd also like to explore social media automation |

Also saved to `project_systems`:
- One row per recommendation shown
- `is_recommended = true` for all
- `is_selected = true/false` per user choice
- `why_it_matters` = AI reasoning text
- `recommendation_metadata` = full scoring JSONB

---

## Workflow

1. **User arrives at /app/wizard/step-3**
   - Check ai_cache for pre-computed recommendations (from the Step 2 trigger)
   - If cached: load and display immediately
   - If not cached: run the recommendation Edge Function synchronously (show skeleton loading state)
   - Load the systems catalog from the systems and system_services tables
   - Load any saved step-3 selections from project_systems

2. **Display recommendations**
   - Cards are ranked by AI priority score
   - Each card is populated with personalized "why it fits" content from the AI
   - Non-recommended systems are collapsed below the main recommendations

3. **User selects or deselects systems**
   - Toggle saves to project_systems (is_selected set to true or false)
   - Right panel summary updates immediately
   - Left panel "Your Selections" list updates
   - Changes are debounce-saved to wizard_answers.data

4. **User reorders systems (optional drag-and-drop)**
   - Update the priority order in project_systems or wizard_answers

5. **User clicks "Continue"**
   - Validate that at least 1 system is selected
   - Final save of all selections
   - Update wizard_sessions.current_step to 4
   - Navigate to step-4

---

## Agent Behavior
- **AI is visible on this screen** — recommendations are AI-generated
- "Why it fits" bullets reference specific user answers from Steps 1-2
- Impact/effort scores come from AI analysis cross-referenced with system metadata
- AI explains but never decides — user must explicitly select
- If user selects 5+ systems, right panel shows advisory note: "Consider starting with 2-3 priorities"
- All AI reasoning stored in `project_systems.recommendation_metadata`
