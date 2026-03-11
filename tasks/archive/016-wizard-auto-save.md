---
id: 016-wizard-auto-save
diagram_id: CORE-WIZARD-01
prd_section: Wizard Shell and Navigation
title: Auto-save system with 500ms debounce and save indicator
skill: frontend
phase: CORE
priority: P0
status: Open
owner: Frontend
dependencies:
  - 015-wizard-navigation-state
estimated_effort: M
percent_complete: 0
---

## Objective
Implement the auto-save system for all wizard steps using a 500ms debounced UPSERT to `wizard_answers`, with a visual save indicator state machine.

## Scope
- **useAutoSave hook** (`src/lib/hooks/useAutoSave.ts`):
  - Input: `{sessionId, stepNumber, data}` — reactive to data changes
  - 500ms debounce for local state; 2s debounce for cloud save (reduces API load)
  - After debounce: UPSERT `wizard_answers`
    - `INSERT INTO wizard_answers (session_id, step_number, data) VALUES (?, ?, ?) ON CONFLICT (session_id, step_number) DO UPDATE SET data = ?, updated_at = now()`
  - Returns: `{saveStatus, lastSaved, error, retrySave}`
- **Save indicator state machine**:
  - `Idle` — no indicator shown (or small checkmark)
  - `Debouncing` — 500ms timer active (no visual change)
  - `Saving` — show "Saving..." text with spinner
  - `Saved` — show "Saved" with checkmark, fade to Idle after 2 seconds
  - `Error` — show "Save failed" with retry button
  - Transitions:
    - Idle -> Debouncing (user types)
    - Debouncing -> Debouncing (user types again within 500ms, reset timer)
    - Debouncing -> Saving (500ms elapsed)
    - Saving -> Saved (UPSERT succeeds)
    - Saving -> Error (UPSERT fails)
    - Saved -> Idle (2s timeout)
    - Saved -> Debouncing (user types while showing Saved)
    - Error -> Retrying (auto-retry after 1s, max 3 attempts)
    - Retrying -> Saved (retry succeeds)
    - Retrying -> Error (max retries exhausted)
    - Error -> Debouncing (user types, new save cycle)
- **SaveIndicator component** in wizard footer:
  - Renders current state visually
  - Error state shows manual "Retry" button
- **On step load (resume)**:
  - Fetch `wizard_answers` WHERE session_id AND step_number
  - Pre-fill all form fields from saved `data` JSONB
- **Left panel context card**:
  - Updates in real-time after each successful save
  - Shows key values from saved data (company name, industry, selections)
- **Manual save**: "Save Draft" button in footer triggers immediate UPSERT (bypasses debounce)

## Acceptance Criteria
- Field change triggers save exactly 500ms after last change
- Rapid typing within 500ms resets debounce (no premature saves)
- Save indicator shows "Saving..." during UPSERT
- Save indicator shows "Saved" with checkmark on success
- Save indicator shows "Save failed" with retry on error
- Failed save auto-retries up to 3 times with 1s delay
- Returning to a step pre-fills all form fields from saved data
- Left panel context card updates after each save
- "Save Draft" button triggers immediate save
- Multiple tabs: last write wins (no conflict resolution needed for CORE)

## Failure Handling
- Network offline: queue save, retry on reconnect
- All retries exhausted: show persistent error with manual retry button
- Supabase error (constraint violation): log and show generic error
- Large JSONB payload: validate size before UPSERT (< 1MB)
