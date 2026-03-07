---
id: 014-wizard-shell-layout
diagram_id: CORE-WIZARD-01
prd_section: Wizard Shell and Navigation
title: Three-panel wizard layout with responsive breakpoints
skill: frontend
phase: CORE
priority: P0
status: Open
owner: Frontend
dependencies:
  - 001-project-foundation
  - 006-route-protection
estimated_effort: L
percent_complete: 0
---

## Objective
Build the `WizardLayout` component — the three-panel shell used by wizard steps 1-4, with responsive breakpoints and the Step 5 single-column exception.

## Scope
- **WizardLayout** component at `/app/wizard/*`:
  - **Current state:** Implemented at `/wizard` (public, no auth). Post-auth target: `/app/wizard` behind ProtectedRoute (006).
  - Left panel: 240px fixed width
    - Sun AI logo
    - Progress stepper (5 steps with status indicators)
    - Context summary area (slot for step-specific context)
  - Center panel: flex-1, max-width 640px
    - Step title + description
    - Dynamic form content (Outlet/slot for step components)
    - Inline validation area
  - Right panel: 320px fixed width
    - "AI Intelligence" header
    - Contextual content slot (AI analysis, guidance, reasoning)
    - Loading skeleton during AI calls
  - Footer bar (fixed bottom):
    - Back button (left-aligned)
    - Save indicator (center)
    - Continue button (right-aligned)
- **Step 5 exception**:
  - When `current_step === 5`: render single centered column, max-width 800px
  - Hide left and right panels
  - Footer bar: only Back and Submit/Continue
- **Responsive breakpoints**:
  - Mobile (< 768px): single column (center only), left collapses to hamburger menu with stepper overlay, right collapses to expandable bottom sheet
  - Tablet (768-1024px): two-panel (left 200px + center), right panel togglable via icon button
  - Desktop (> 1024px): full three-panel layout
- **Design system**:
  - Left panel: `#0A211F` background, `#F1EEEA` text
  - Center panel: `#F1EEEA` or white background, `#0A211F` text
  - Right panel: dark teal variant background
  - Footer: `#0A211F` background, `#84CC16` accent for Continue button
  - Fonts: Playfair Display headings, Lora body
  - Card radius: 4px or 8px max, no shadows

## Acceptance Criteria
- Three-panel layout renders at desktop width (1440px) with correct widths (240/flex-1 max-640/320)
- Center panel content area accepts child routes via Outlet
- Step 5 renders as single centered column (800px max), no side panels
- Mobile (375px): single column, hamburger for stepper, bottom sheet for intelligence
- Tablet (768px): two-panel, right panel togglable
- Footer bar sticky at bottom with Back, save indicator, and Continue
- All panels scroll independently (no full-page scroll)
- Design system colors and fonts applied correctly

## Failure Handling
- Panel overflow handled with scroll (no content clipping)
- Extremely long content in any panel does not break layout
- Missing step content shows empty state (not broken layout)
