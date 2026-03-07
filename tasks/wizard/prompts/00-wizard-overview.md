---
task_id: 000-WIZ-OVERVIEW
title: Wizard Design System Overview
phase: CRITICAL
priority: P0
status: Completed
estimated_effort: 2 days
area: wizard
wizard_step: null
skill: [design/frontend-design]
subagents: []
edge_function: null
schema_tables: []
depends_on: []
figma_prompt: prompts/00-wizard-overview.md
mermaid_diagram: mermaid-wizard/00-wizard-overview.md
---

# Sun AI Agency — Wizard Design System Overview

## Figma Make Global Prompt

> Design a premium, editorial wizard experience for Sun AI Agency — an AI consulting platform that guides businesses through a structured discovery process. The wizard is the core product experience: calm, premium, typography-led, and trust-building.

---

## Brand & Visual Identity

### Colors
- **Primary Dark:** #0A211F (deep teal — headers, primary text, active states)
- **Accent Green:** #84CC16 (lime green — CTAs, progress indicators, success states)
- **Background:** #F1EEEA (warm beige — page backgrounds)
- **Surface White:** #FFFFFF (cards, panels, input fields)
- **Border:** #D4CFC8 (warm gray — dividers, input borders)
- **Muted Text:** #6B6560 (secondary text, placeholders)
- **Error:** #DC2626 (validation errors only)
- **Warning:** #F59E0B (attention states)

### Typography
- **Headings:** Playfair Display (serif) — editorial authority
- **Body / UI:** Lora (serif) — warm readability
- **Sizes:**
  - Page title: 32px / 40px line-height
  - Section heading: 24px / 32px
  - Question label: 18px / 28px
  - Body text: 16px / 26px
  - Caption / helper: 14px / 22px
  - Badge / tag: 12px / 16px

### Spacing System
- Base unit: 8px
- Section gap: 48px (6 units)
- Card padding: 32px (4 units)
- Input gap: 24px (3 units)
- Inline gap: 16px (2 units)
- Tight gap: 8px (1 unit)

### Design Rules
- No gradients
- No drop shadows (use borders instead)
- No rounded corners > 8px (prefer 4px or 8px)
- No decorative icons — use text and whitespace
- No playful UI elements
- Motion is subtle or absent
- Typography communicates hierarchy
- Color communicates status only

---

## Three-Panel Layout Architecture

The overall layout is a vertically stacked structure with a top bar, a three-column main area, and a bottom bar.

**Top Bar** — A horizontal bar spanning the full width, 64px tall. On the left is the logo, in the center is the step indicator (e.g., "Step 1 of 5 — Business Context"), and on the right is the save status indicator.

**Main Area** — Below the top bar, three panels sit side by side horizontally:

- **Left Panel (240px fixed width):** Contains the progress stepper, contextual signals, and summary information. This panel is read-only.
- **Center Panel (flex-1, fills remaining space):** The main work area where the user interacts with questions, forms, selections, and uploads. This is the human-first, interactive zone.
- **Right Panel (320px fixed width):** Displays intelligence content — contextual guidance, explanations of why we ask each question, insights, and previews. This panel is read-only.

**Bottom Bar** — A horizontal bar spanning the full width, 72px tall. The "Back" text button sits on the left and the "Continue" primary button sits on the right.

### Panel Behavior

| Panel | Desktop (1280px+) | Tablet (768-1279px) | Mobile (<768px) |
|-------|-------------------|---------------------|-----------------|
| Left | Visible, 240px fixed | Collapsed to top bar progress indicator | Hidden, accessible via menu |
| Center | Flex-1, max-width 640px | Full width with padding | Full width, 16px padding |
| Right | Visible, 320px fixed | Collapsible drawer (slide from right) | Bottom sheet or hidden |

### Top Bar
- Logo (left)
- Step title + step indicator (center)
- Auto-save status: "Saved ✓" or "Saving..." (right)
- Height: 64px
- Background: white
- Bottom border: 1px #D4CFC8

### Bottom Bar
- Sticky to bottom
- Background: white
- Top border: 1px #D4CFC8
- Height: 72px
- Left: "← Back" (text button, muted)
- Right: "Continue →" (primary button, #0A211F background, white text)
- Continue disabled until required fields complete
- On mobile: full-width Continue button, Back as top-left link

---

## Component Library (Shared Across All Screens)

### Progress Stepper (Left Panel)

The stepper is a vertical list of five steps connected by a vertical line:

- **Step 1 — Business Context:** Active state — green dot (#84CC16) with bold text
- **Step 2 — Industry Diagnostics:** Upcoming state — hollow circle with muted text
- **Step 3 — System Recommendations:** Upcoming state — hollow circle with muted text
- **Step 4 — Executive Brief:** Upcoming state — hollow circle with muted text
- **Step 5 — Dashboard Entry:** Upcoming state — hollow circle with muted text

- Active step: green dot (#84CC16), bold text
- Completed step: green checkmark, regular text
- Upcoming step: hollow circle, muted text
- Vertical line connecting dots

### Input Fields
- Label above input (Lora, 14px, #6B6560)
- Input: 48px height, 16px padding, 1px border #D4CFC8, 4px radius
- Focus: border color #0A211F, 2px
- Error: border color #DC2626, error message below in 14px red
- Placeholder: #A39E98

### Select Dropdowns
- Same dimensions as input
- Chevron icon right-aligned
- Dropdown: white background, 1px border, 4px radius, 8px shadow-y

### Multi-Select Cards
- Grid of selectable cards (2-3 columns)
- Each card: border 1px #D4CFC8, 16px padding, 4px radius
- Selected: border 2px #0A211F, subtle #F1EEEA background
- Hover: border #0A211F
- Card content: icon/emoji (optional) + label + brief description

### Textarea
- Min-height 120px, max 240px
- Same styling as input
- Character count bottom-right (muted)

### File Upload
- Dashed border area, 160px height
- "Drop files here or click to upload" centered text
- Accepted formats listed below
- Uploaded files: list with filename, size, remove button

### Context Card (Right Panel)
- Background: #F1EEEA
- Border: 1px #D4CFC8
- Padding: 24px
- Title: 16px bold
- Body: 14px regular
- Icon: optional emoji or none

### Insight Pill (Right Panel)
- Small rounded badge
- Background: #0A211F, text: white
- Used for detected signals like "E-commerce detected" or "3 opportunities found"

---

## Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| 1280px+ | Full three-panel |
| 1024-1279px | Two-panel (left collapsed to top) |
| 768-1023px | Single panel + right as drawer |
| <768px | Single column, stacked, bottom sheet for context |

---

## Interaction Patterns

- Auto-save: every field change triggers save after 500ms debounce
- Save indicator: top-right, transitions from "Saving..." to "Saved ✓"
- Validation: inline, on blur. Never block typing. Show errors after field loses focus.
- Navigation: Back always works. Continue requires validation pass.
- Keyboard: Tab between fields. Enter on single-line inputs advances to next field.
- Loading: skeleton screens for panel content, never blank states

---

## Accessibility

- All inputs have visible labels (no placeholder-only labels)
- Focus states are clearly visible (2px border)
- Color is never the only indicator — always paired with text or icon
- Minimum 4.5:1 contrast ratio for text
- Touch targets: minimum 44px
- Screen reader: aria-labels on all interactive elements
