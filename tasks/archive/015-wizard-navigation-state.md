---
id: 015-wizard-navigation-state
diagram_id: CORE-WIZARD-01
prd_section: Wizard Shell and Navigation
title: Wizard step navigation, stepper, and progress indicators
skill: frontend
phase: CORE
priority: P0
status: Open
owner: Frontend
dependencies:
  - 014-wizard-shell-layout
  - 002-supabase-client-setup
estimated_effort: M
percent_complete: 0
---

## Objective
Implement wizard step navigation between 5 steps with session management, stepper component, and progress indicators.

## Scope
- **Session management**:
  - On wizard entry: check for existing `wizard_sessions` (status = in_progress)
  - No session: create new (current_step=1, status=in_progress), redirect to `/app/wizard/step-1`
  - Existing session: load session, redirect to `/app/wizard/step-{current_step}`
  - Load `wizard_answers` for current step to pre-fill form
- **Step navigation**:
  - **Continue**: validate current step fields -> if valid, increment `current_step` -> UPDATE `wizard_sessions` -> navigate to next step route
  - **Back**: decrement `current_step` -> UPDATE `wizard_sessions` -> navigate to previous step (disabled on step 1)
  - **Save Draft**: manual save trigger (same UPSERT as auto-save)
- **Step validation**:
  - Each step defines its required fields and validation rules
  - Continue button disabled until all required fields valid
  - Show inline validation errors on attempt to continue with invalid data
- **Stepper component** (left panel):
  - 5 steps displayed vertically
  - Step states:
    - NotStarted: gray circle, muted text
    - Active: `#84CC16` lime circle with pulse animation, bold title
    - InProgress: partial fill indicator (has saved data but incomplete)
    - Completed: green circle with checkmark
  - Clicking a completed step navigates back to it
- **Step 5 submission**:
  - On Continue at step 5: set status='completed', completed_at=now()
  - Trigger project creation flow (handled by step 5 component)
- **URL sync**: `/app/wizard/step-{N}` reflects current step, browser back/forward works

## Acceptance Criteria
- New user gets fresh wizard_session, starts at step 1
- Returning user resumes at exact `current_step` with pre-filled data
- Continue validates then advances to next step (URL and DB updated)
- Back navigates to previous step without data loss
- Stepper shows correct visual state for each step
- Clicking completed step in stepper navigates back
- Continue button disabled when validation fails
- Step 5 completion marks session as completed
- Browser back/forward navigates between visited steps

## Failure Handling
- Session creation failure shows error with retry
- Step advancement DB update failure: show error, do not navigate
- Stale session (completed by another tab): detect and redirect to dashboard
