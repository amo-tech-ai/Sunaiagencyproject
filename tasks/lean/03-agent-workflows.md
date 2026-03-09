# Strategy Engine — Agent Workflows & Data Flows

---

## 1. Agent Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA MONITORING LAYER                     │
│                                                             │
│  wizard_answers  │  clients  │  crm_deals  │  ai_run_logs  │
│  wizard_sessions │  contacts │  interactions│  ai_cache     │
│  projects        │  tasks    │  milestones  │  activities   │
└────────────────────────────┬────────────────────────────────┘
                             │
                     POST /strategy/analyze
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  STRATEGY INTERPRETATION LAYER               │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Strategy     │  │ Opportunity  │  │  Roadmap     │      │
│  │  Synthesizer  │  │ Detector     │  │  Planner     │      │
│  │              │  │              │  │              │      │
│  │  Updates     │  │  Finds       │  │  Suggests    │      │
│  │  canvas      │  │  bottlenecks │  │  phase/task  │      │
│  │  blocks      │  │  & automation│  │  changes     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │               │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │  System      │  │  Metrics     │                        │
│  │  Recommender │  │  Interpreter │                        │
│  │              │  │              │                        │
│  │  Suggests    │  │  Explains    │                        │
│  │  new AI      │  │  KPI trends  │                        │
│  │  systems     │  │  & alerts    │                        │
│  └──────┬───────┘  └──────┬───────┘                        │
│         │                 │                                 │
└─────────┼─────────────────┼─────────────────────────────────┘
          │                 │
          ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                      DECISION LAYER                         │
│                                                             │
│  ┌─ Auto-Approved ──────────────┐ ┌─ Needs Approval ─────┐│
│  │                               │ │                       ││
│  │  strategy_insights (draft)    │ │  strategy_recs        ││
│  │  automation_opps (detected)   │ │  (canvas_update)      ││
│  │  metric alerts                │ │  (roadmap_change)     ││
│  │  scoring                      │ │  (new_system)         ││
│  │                               │ │  (task_creation)      ││
│  └───────────────────────────────┘ └───────────────────────┘│
│                                              │              │
│                                     User Approves/Rejects   │
│                                              │              │
└──────────────────────────────────────────────┼──────────────┘
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     EXECUTION LAYER                         │
│                                                             │
│  • Update lean_canvases block                               │
│  • Create lean_canvas_versions snapshot                     │
│  • Insert strategy_insights                                 │
│  • Insert automation_opportunities                          │
│  • Insert strategy_recommendations                          │
│  • Log to strategy_actions                                  │
│  • Update StrategyMetrics                                   │
│  • Send notification badge to sidebar                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Full Analysis Cycle — Step-by-Step

### Trigger
User clicks **[▶ Run Analysis]** button on StrategyEnginePage

### Backend Flow (POST /strategy/analyze)

```
Step 1 ─ Load Context Data
  │
  ├── SELECT * FROM lean_canvases WHERE is_current = true AND session_id = ?
  ├── SELECT step_number, answers, ai_results FROM wizard_answers WHERE session_id = ?
  ├── SELECT * FROM clients WHERE created_by = ? LIMIT 50
  ├── SELECT * FROM crm_deals WHERE owner_id = ? ORDER BY updated_at DESC LIMIT 30
  ├── SELECT count(*), prompt_type FROM ai_run_logs GROUP BY prompt_type
  └── Assemble into `context` object
  │
  ▼
Step 2 ─ Strategy Synthesizer Agent
  │
  │  callGemini('strategy-synthesize', systemPrompt, userPrompt, context)
  │
  │  Input context:
  │    • current canvas blocks (9 blocks)
  │    • wizard step 1 business analysis
  │    • CRM deal titles + values + stages
  │    • client industries + health scores
  │
  │  Output:
  │    • blockUpdates[] → INSERT INTO strategy_recommendations
  │      (type: canvas_update, status: pending)
  │    • completenessScore → UPDATE lean_canvases SET metadata.completeness
  │
  │  Log → INSERT INTO strategy_actions (agent: strategy-synthesizer)
  │
  ▼
Step 3 ─ Opportunity Detector Agent
  │
  │  callGemini('opportunity-detect', systemPrompt, userPrompt, context)
  │
  │  Input context:
  │    • canvas problem + solution blocks
  │    • wizard diagnostics (step 2 ai_results)
  │    • CRM interaction patterns (call/email/meeting counts)
  │    • AI run frequency by prompt_type
  │
  │  Output:
  │    • opportunities[] → INSERT INTO automation_opportunities
  │      (status: detected — auto-approved)
  │
  │  Log → INSERT INTO strategy_actions (agent: opportunity-detector)
  │
  ▼
Step 4 ─ Roadmap Planner Agent
  │
  │  callGemini('roadmap-suggest', systemPrompt, userPrompt, context)
  │
  │  Input context:
  │    • wizard step 5 roadmap phases
  │    • approved automation opportunities
  │    • canvas solution + key_metrics blocks
  │    • current project progress
  │
  │  Output:
  │    • suggestions[] → INSERT INTO strategy_recommendations
  │      (type: roadmap_change, status: pending)
  │
  │  Log → INSERT INTO strategy_actions (agent: roadmap-planner)
  │
  ▼
Step 5 ─ System Recommender Agent
  │
  │  callGemini('system-recommend-strategy', systemPrompt, userPrompt, context)
  │
  │  Input context:
  │    • canvas all blocks
  │    • wizard step 3 selected systems
  │    • detected opportunities
  │    • industry benchmarks (from step 1 analysis)
  │
  │  Output:
  │    • systemSuggestions[] → INSERT INTO strategy_recommendations
  │      (type: new_system, status: pending)
  │
  │  Log → INSERT INTO strategy_actions (agent: system-recommender)
  │
  ▼
Step 6 ─ Metrics Interpreter Agent
  │
  │  callGemini('metrics-interpret', systemPrompt, userPrompt, context)
  │
  │  Input context:
  │    • wizard step 4 readiness score
  │    • CRM pipeline total value + deal count
  │    • AI run logs (success rate, token usage)
  │    • canvas completeness
  │    • project progress %
  │
  │  Output:
  │    • summary, alerts[], trends[] → INSERT INTO strategy_insights
  │      (status: draft — auto-approved)
  │    • healthScore → include in response metrics
  │
  │  Log → INSERT INTO strategy_actions (agent: metrics-interpreter)
  │
  ▼
Step 7 ─ Compute Aggregate Metrics
  │
  │  SELECT count(*) FROM automation_opportunities WHERE canvas_id = ?
  │  SELECT count(*) FROM strategy_recommendations WHERE approval_status = 'pending'
  │  SELECT count(*) FROM strategy_insights WHERE canvas_id = ?
  │  Calculate: automationCoverage, canvasCompleteness, healthScore, totalROI
  │
  ▼
Step 8 ─ Return Combined Response
  │
  │  {
  │    insights: StrategyInsight[],
  │    opportunities: AutomationOpportunity[],
  │    recommendations: StrategyRecommendation[],
  │    metrics: StrategyMetrics
  │  }
```

---

## 3. Per-Block AI Synthesis — Step-by-Step

### Trigger
User clicks **[🤖 Ask AI]** on a specific canvas block

### Backend Flow (POST /strategy/synthesize-block)

```
Step 1 ─ Load Canvas + Context
  │
  ├── SELECT * FROM lean_canvases WHERE id = ?
  ├── SELECT answers, ai_results FROM wizard_answers WHERE session_id = ?
  └── Optional: user-provided context string
  │
  ▼
Step 2 ─ callGemini('strategy-synthesize-block', ...)
  │
  │  System prompt tailored to the specific block:
  │    "You are analyzing the {block_name} section of a Lean Canvas.
  │     Given the current items, business analysis, and industry data,
  │     suggest 2-4 additions, modifications, or removals.
  │     Each suggestion must cite specific data that supports it."
  │
  │  User prompt includes:
  │    • Current block items
  │    • All other canvas blocks (for context)
  │    • Wizard analysis results
  │    • User's additional context (if provided)
  │
  ▼
Step 3 ─ Return Suggestions (NOT auto-applied)
  │
  │  {
  │    suggestions: CanvasBlockItem[],
  │    rationale: "Based on wizard analysis showing..."
  │  }
  │
  │  Frontend shows suggestions inline on the block.
  │  User clicks [Accept] or [Dismiss] per suggestion.
  │  Accept → updateCanvasBlocks() → creates version
```

---

## 4. Canvas Seeding from Wizard — Step-by-Step

### Trigger
User clicks **[🔮 Create from Wizard]** on empty state

### Backend Flow (POST /strategy/canvas)

```
Step 1 ─ Load Wizard Data
  │
  ├── SELECT * FROM wizard_answers
  │   WHERE session_id = ? AND step_number IN (1,2,3,4,5)
  │   ORDER BY step_number
  │
  ▼
Step 2 ─ Extract & Map to Canvas Blocks
  │
  │  Step 1 (Business Analysis):
  │    ai_results.analysis.painPoints → problem[]
  │    ai_results.analysis.targetAudience → customer_segments[]
  │    ai_results.analysis.opportunities → value_proposition[]
  │    answers.industry → metadata.industry
  │    answers.companySize → metadata.companySize
  │
  │  Step 2 (Industry Diagnostics):
  │    ai_results.diagnostics.signals → key_metrics[] (top 3)
  │    ai_results.diagnostics.channelAnalysis → channels[]
  │
  │  Step 3 (System Recommendations):
  │    answers.selectedSystems → solution[] (system names)
  │    ai_results.recommendations → cost_structure[] (from pricing)
  │
  │  Step 4 (Readiness Score):
  │    ai_results.readiness.overallScore → metadata.readinessScore
  │    ai_results.readiness.strengths → unfair_advantage[]
  │    ai_results.readiness.gaps → problem[] (additional)
  │
  │  Step 5 (Roadmap):
  │    ai_results.roadmap.phases → metadata.phases
  │    ai_results.roadmap.totalInvestment → revenue_streams[] (target)
  │
  ▼
Step 3 ─ Insert Canvas
  │
  │  INSERT INTO lean_canvases (session_id, user_id, version, ...)
  │
  ▼
Step 4 ─ Create Initial Version
  │
  │  INSERT INTO lean_canvas_versions (canvas_id, version: 1,
  │    snapshot: full_canvas, change_summary: 'Created from wizard',
  │    changed_by: 'system')
  │
  ▼
Step 5 ─ Return Canvas
```

---

## 5. Recommendation Approval — Step-by-Step

### Trigger
User clicks **[✓ Approve]** on a recommendation card

### Backend Flow (POST /strategy/recommendations/:id/approve)

```
Step 1 ─ Load Recommendation
  │
  ├── SELECT * FROM strategy_recommendations WHERE id = ?
  ├── Validate: approval_status === 'pending'
  │
  ▼
Step 2 ─ Branch by Type

  ┌─ canvas_update ──────────────────────────┐
  │                                           │
  │  Load current canvas                     │
  │  Create version snapshot (before change)  │
  │  Apply proposed_changes to canvas blocks │
  │  Increment version                       │
  │  UPDATE lean_canvases SET blocks = ...   │
  │  INSERT lean_canvas_versions             │
  │  Return updated canvas                   │
  │                                           │
  └───────────────────────────────────────────┘

  ┌─ roadmap_change ─────────────────────────┐
  │                                           │
  │  Log as approved (no auto-execution)     │
  │  Return recommendation with status       │
  │  Frontend can show "approved" badge      │
  │  Manual implementation by consultant     │
  │                                           │
  └───────────────────────────────────────────┘

  ┌─ new_system ─────────────────────────────┐
  │                                           │
  │  Log as approved                         │
  │  Could trigger wizard re-entry for       │
  │  system configuration (Phase 2)          │
  │                                           │
  └───────────────────────────────────────────┘

  ┌─ task_creation ──────────────────────────┐
  │                                           │
  │  Log as approved                         │
  │  Phase 2: auto-insert into tasks table   │
  │                                           │
  └───────────────────────────────────────────┘
  │
  ▼
Step 3 ─ Update Recommendation Status
  │
  │  UPDATE strategy_recommendations
  │  SET approval_status = 'approved',
  │      approved_by = userId,
  │      approved_at = now()
  │  WHERE id = ?
  │
  ▼
Step 4 ─ Log Action
  │
  │  INSERT INTO strategy_actions
  │  (agent: 'governance', action_type: 'approve', ...)
```

---

## 6. Frontend Data Flow

```
StrategyEnginePage (mount)
  │
  ├── useAuth() → get accessToken
  │
  ├── useEffect → fetchAllData()
  │   │
  │   └── Promise.all([
  │         strategyApi.getCanvas({ session_id }, token),
  │         strategyApi.listInsights({ status: 'draft' }, token),
  │         strategyApi.listOpportunities(token),
  │         strategyApi.listRecommendations({ status: 'pending' }, token),
  │         strategyApi.getMetrics(token),
  │       ])
  │
  ├── State Management
  │   ├── canvas: LeanCanvas | null
  │   ├── insights: StrategyInsight[]
  │   ├── opportunities: AutomationOpportunity[]
  │   ├── recommendations: StrategyRecommendation[]
  │   ├── metrics: StrategyMetrics
  │   ├── analysisRunning: boolean
  │   ├── synthesizingBlock: CanvasBlockKey | null
  │   └── blockSuggestions: Record<CanvasBlockKey, CanvasBlockItem[]>
  │
  ├── Actions
  │   ├── handleRunAnalysis()
  │   │   → strategyApi.runAnalysis(canvasId, sessionId, token)
  │   │   → update all state from response
  │   │
  │   ├── handleSynthesizeBlock(block)
  │   │   → strategyApi.synthesizeBlock(canvasId, block, context, token)
  │   │   → update blockSuggestions[block]
  │   │
  │   ├── handleApproveRecommendation(id, approved)
  │   │   → strategyApi.approveRecommendation(id, approved, comment, token)
  │   │   → if canvas returned, update canvas state
  │   │   → remove from recommendations list
  │   │
  │   ├── handleUpdateBlock(block, items)
  │   │   → strategyApi.updateCanvasBlocks(canvasId, { [block]: items }, summary, token)
  │   │   → update canvas state
  │   │
  │   └── handleCreateCanvas(fromWizard: boolean)
  │       → strategyApi.createCanvas({ session_id? }, token)
  │       → set canvas state
  │
  └── Render
      ├── StrategyHeader (title, Run Analysis btn, last-run time)
      ├── StrategyMetricsBar (5 metric cards)
      └── 3-column grid
          ├── LeanCanvasPanel → CanvasBlock × 9
          ├── RoadmapExecutionPanel → PhaseCard × N (read-only Phase 1)
          └── IntelligencePanel
              ├── PendingApprovalsSection → RecommendationCard × N
              ├── InsightCard × N
              └── OpportunityCard × N
```

---

## 7. Agent Input/Output Reference Table

| Agent | Function Name | Input Sources | Output Tables | Governance |
|-------|--------------|---------------|---------------|------------|
| Strategy Synthesizer | `strategy-synthesize` | canvas, wizard step 1, CRM deals, clients | strategy_recommendations (canvas_update) | Pending |
| Opportunity Detector | `opportunity-detect` | canvas, wizard step 2, CRM interactions, AI logs | automation_opportunities | Auto (detected) |
| Roadmap Planner | `roadmap-suggest` | wizard step 5, approved opps, canvas, progress | strategy_recommendations (roadmap_change) | Pending |
| System Recommender | `system-recommend-strategy` | canvas, wizard step 3, opps, industry | strategy_recommendations (new_system) | Pending |
| Metrics Interpreter | `metrics-interpret` | readiness, pipeline, AI stats, completeness | strategy_insights | Auto (draft) |

---

## 8. Trigger Matrix (Phase 1 vs Phase 2)

| Trigger | Phase 1 | Phase 2 |
|---------|---------|---------|
| User clicks "Run Analysis" | ✅ Manual | ✅ Manual |
| User clicks "Ask AI" on block | ✅ Manual | ✅ Manual |
| Wizard session completed | ❌ | ✅ Auto-trigger Synthesizer |
| CRM deal stage changed | ❌ | ✅ Auto-trigger Opportunity Detector |
| Milestone completed | ❌ | ✅ Auto-trigger Roadmap Planner |
| Weekly cron | ❌ | ✅ Auto-trigger full analysis |
| New client added | ❌ | ✅ Auto-trigger Synthesizer |
| Readiness score changes >10pts | ❌ | ✅ Auto-trigger all agents |
