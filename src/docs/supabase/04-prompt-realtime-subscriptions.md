# Prompt: Realtime Subscriptions for Live Wizard Collaboration

> Target: Enable live collaboration on wizard sessions using Supabase Realtime so multiple team members can see each other's progress, and AI processing status updates stream to the UI in real time.

---

## Current State

The wizard currently saves to Supabase via a 2-second debounced POST to the wizard/save edge function. Loading a session is a one-time GET on mount. There is no live sync between browser tabs or between team members viewing the same session. The AI analysis endpoints return results synchronously after the Gemini call completes, with no progress streaming.

The frontend uses WizardContext for all state management. The Supabase client singleton lives in lib/supabase.ts via getSupabaseClient. The database has wizard_sessions and wizard_answers tables that update on every save. The ai_run_logs table gets a new row after every AI call.

Supabase Realtime supports postgres_changes (listen to INSERT, UPDATE, DELETE on any table) and broadcast (arbitrary messages to a channel). Both are available through the Supabase JS client.

## What Needs to Happen

### Channel 1: Wizard Session Sync

Subscribe to postgres_changes on the wizard_sessions table, filtered to the current sessionId. When another tab or user updates the session (current_step changes, status changes), the frontend should receive the update and decide whether to apply it. If the update comes from a different userId than the current viewer, show a toast notification rather than auto-applying (to avoid overwriting in-progress edits). If the update comes from the same user in a different tab, auto-apply the step navigation change.

### Channel 2: Wizard Answers Sync

Subscribe to postgres_changes on the wizard_answers table, filtered to the current sessionId. When an answer row is updated (another team member filled in a step, or an AI result landed), the frontend receives the new answers and ai_results. For answer changes from another user, show a notification with the option to view their changes. For ai_results updates (AI processing complete), immediately merge the results into WizardContext so the readiness score or roadmap appears without a page refresh.

### Channel 3: AI Processing Progress

When an AI endpoint starts processing (analyze-business, readiness-score, generate-roadmap), it takes several seconds. Use Supabase Realtime broadcast to send progress updates from the edge function to the frontend. The edge function sends status messages to a channel named wizard-ai-sessionId with payloads like started, cache-check, calling-gemini, parsing-response, saving-result, complete. The frontend subscribes to this channel and displays a step-by-step progress indicator during AI analysis.

This requires the edge function to create a Supabase client and use channel.send for broadcast messages at each stage of the callGemini pipeline.

### Channel 4: AI Run Activity Feed

Subscribe to postgres_changes on ai_run_logs filtered by the current sessionId. When a new log row is inserted, update an optional AI activity indicator in the wizard header showing the latest AI action (analyzing business, scoring readiness, generating roadmap) with its duration and success status.

### Frontend: Realtime Hook

Create a useWizardRealtime hook that takes the sessionId and returns connection status (connected, disconnected, reconnecting). The hook sets up all relevant channel subscriptions on mount and cleans them up on unmount. It exposes callbacks for onSessionUpdate, onAnswersUpdate, onAIProgress, and onAIRunLogged.

### Frontend: WizardContext Integration

WizardContext should call useWizardRealtime when a sessionId is available. When realtime delivers an ai_results update for the current step, merge it into the wizard state so the UI updates live. When realtime delivers an answers update from another user, store it in a pendingRemoteChanges state and surface a merge prompt rather than auto-overwriting local edits.

### Frontend: Presence (Optional)

Use Supabase Realtime presence to show which team members are currently viewing the wizard session. Display small avatar circles in the wizard header showing connected collaborators. Each presence payload includes userId, name, currentStep, and lastActive timestamp. When a collaborator navigates to a different step, their avatar moves in the step indicator.

### Frontend: Connection Indicator

Show a small connection status dot in the wizard header next to the save indicator. Green means realtime is connected. Yellow means reconnecting. Gray means disconnected (offline mode, local-only saves still work). On disconnect, queue any remote changes and apply them when reconnection succeeds.

### Server: Enable Realtime on Tables

Supabase Realtime requires tables to have replication enabled. The wizard_sessions, wizard_answers, and ai_run_logs tables need to be added to the supabase_realtime publication. This is a one-time database configuration step done in the Supabase dashboard or via SQL.

### Server: Broadcast from Edge Functions

The callGemini function in gemini.tsx should be updated to accept an optional broadcastChannel parameter. When provided, it sends progress messages at key stages: before cache check, after cache miss, before Gemini API call, after response received, after parsing, after caching, and on completion or error. The edge function creates a temporary Supabase client, joins the broadcast channel, sends the message, and does not wait for delivery confirmation.

### Conflict Resolution Strategy

When two users edit the same step simultaneously, the last-write-wins model applies at the database level (upsert). The realtime notification lets the other user know their version was overwritten. For the executive summary (step 4) where inline editing is common, show a diff indicator if the remote version differs from the local version, and let the user choose which version to keep.

For AI results, there is no conflict because AI writes are idempotent (same input produces same cached output). If two users trigger the same AI endpoint, the second call hits the cache and both get the same result.

## Subscription Lifecycle

Subscribe when: a sessionId is set in WizardContext (either from a new save or from loading a saved session).

Unsubscribe when: the component unmounts, the sessionId changes, or the user navigates away from the wizard.

Reconnect: Supabase client handles automatic reconnection. The hook should detect reconnection events and refetch the latest session state to catch any updates missed during the disconnect.

## Performance Considerations

Filter all postgres_changes subscriptions to the specific sessionId to avoid receiving updates for other sessions. Use the eq filter on session_id or id columns. Do not subscribe to unfiltered table changes.

Debounce incoming realtime updates to avoid excessive re-renders when rapid saves occur (another user typing quickly). A 500ms debounce on incoming answer updates is reasonable.

Unsubscribe from AI progress channels after the AI call completes to avoid stale listeners accumulating.

## Acceptance Criteria

Opening the same wizard session in two browser tabs shows live sync of step navigation. An AI result completing on one tab appears on the other tab within 2 seconds without manual refresh. A progress indicator during AI processing shows real-time stage updates. An optional presence display shows connected collaborators. The wizard remains fully functional when realtime is disconnected (graceful degradation to poll-on-load). All subscriptions clean up on unmount with no memory leaks.
