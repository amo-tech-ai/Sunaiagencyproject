---
id: CORE-WIZARD-01
phase: CORE
prd_section: Wizard Shell and Navigation
title: Wizard Shell and Navigation
type: flowchart
---

# Wizard Shell and Navigation

Three-panel layout, progress stepper, footer navigation, auto-save with debounce, responsive breakpoints, and step 5 layout exception.

## Three-Panel Layout

```mermaid
---
config:
  theme: forest
---
flowchart LR
    subgraph WizardShell["Wizard Shell — /app/wizard"]
        direction LR

        subgraph LeftPanel["Left Panel — 240px"]
            direction TB
            Logo["Sun AI Logo"]
            Stepper["Progress Stepper"]
            Step1["Step 1: Business Profile"]
            Step2["Step 2: Goals and Challenges"]
            Step3["Step 3: Tech and Operations"]
            Step4["Step 4: Budget and Timeline"]
            Step5["Step 5: Review and Submit"]
            Stepper --> Step1 --> Step2 --> Step3 --> Step4 --> Step5
            ContextInfo["Context Summary<br/>Key data from previous steps"]
        end

        subgraph CenterPanel["Center Panel — flex-1 max-w-640px"]
            direction TB
            StepTitle["Step Title + Description"]
            FormContent["Dynamic Form Content<br/>Fields vary per step"]
            Validation["Inline Validation Messages"]
        end

        subgraph RightPanel["Right Panel — 320px"]
            direction TB
            IntelHeader["AI Intelligence"]
            IntelContent["Contextual AI suggestions<br/>Real-time analysis<br/>Recommendations based on input"]
            IntelLoading["Loading skeleton during AI calls"]
        end
    end

    subgraph FooterBar["Footer Bar — Fixed Bottom"]
        direction LR
        BackBtn["Back Button<br/>Always enabled except step 1"]
        SaveIndicator["Save Indicator<br/>idle / Saving... / Saved"]
        ContinueBtn["Continue Button<br/>Validates then advances"]
    end

    WizardShell --> FooterBar

    classDef panelLeft fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef panelCenter fill:#F1EEEA,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef panelRight fill:#1a5c3a,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef footerNode fill:#0A211F,stroke:#84CC16,stroke-width:1px,color:#84CC16

    class Logo,Stepper,Step1,Step2,Step3,Step4,Step5,ContextInfo panelLeft
    class StepTitle,FormContent,Validation panelCenter
    class IntelHeader,IntelContent,IntelLoading panelRight
    class BackBtn,SaveIndicator,ContinueBtn footerNode
```

## Step Navigation Flow

```mermaid
---
config:
  theme: forest
---
flowchart TD
    Entry([Enter Wizard]) --> LoadSession{"Existing wizard_session?"}

    LoadSession -->|No| CreateSession["Create new wizard_session<br/>current_step = 1, status = in_progress"]
    CreateSession --> RenderStep1["Render Step 1"]

    LoadSession -->|Yes| ResumeSession["Load session, get current_step"]
    ResumeSession --> RenderCurrentStep["Render Step N<br/>Load wizard_answers for step N"]

    RenderStep1 --> UserInteracts
    RenderCurrentStep --> UserInteracts

    UserInteracts["User fills form fields"] --> AutoSave["Auto-save triggers<br/>500ms debounce"]

    AutoSave --> UpsertAnswer["UPSERT wizard_answers<br/>SET data = JSONB payload<br/>WHERE session_id AND step_number"]

    UserInteracts --> NavAction{"Navigation Action"}

    NavAction -->|Back| BackLogic{"current_step > 1?"}
    BackLogic -->|Yes| DecrementStep["current_step -= 1<br/>UPDATE wizard_sessions"]
    DecrementStep --> RenderCurrentStep
    BackLogic -->|No| StayOnStep["Stay on Step 1<br/>Back button disabled"]

    NavAction -->|Continue| ValidateStep{"Step validation passes?"}
    ValidateStep -->|No| ShowErrors["Show inline validation errors<br/>Highlight invalid fields"]
    ShowErrors --> UserInteracts

    ValidateStep -->|Yes| CheckLastStep{"current_step = 5?"}
    CheckLastStep -->|No| IncrementStep["current_step += 1<br/>UPDATE wizard_sessions"]
    IncrementStep --> RenderCurrentStep

    CheckLastStep -->|Yes| SubmitWizard["Submit wizard<br/>status = completed<br/>completed_at = now()"]
    SubmitWizard --> TriggerAI["Trigger AI pipeline<br/>generate-diagnostics<br/>generate-roadmap<br/>task-generator"]
    TriggerAI --> CreateProject["Create project record<br/>Link wizard_session_id"]
    CreateProject --> RedirectDash([Redirect to /app/dashboard])

    NavAction -->|Save Draft| SaveDraft["Manual save<br/>Same UPSERT logic<br/>Show Saved indicator"]
    SaveDraft --> UserInteracts

    classDef startEnd fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#F1EEEA
    classDef action fill:#1a5c3a,stroke:#84CC16,stroke-width:1px,color:#F1EEEA
    classDef decision fill:#84CC16,stroke:#0A211F,stroke-width:2px,color:#0A211F
    classDef error fill:#dc2626,stroke:#991b1b,stroke-width:2px,color:#F1EEEA

    class Entry,RedirectDash startEnd
    class CreateSession,RenderStep1,RenderCurrentStep,UserInteracts,AutoSave,UpsertAnswer,DecrementStep,IncrementStep,SubmitWizard,TriggerAI,CreateProject,SaveDraft action
    class LoadSession,NavAction,BackLogic,ValidateStep,CheckLastStep decision
    class ShowErrors,StayOnStep error
```

## Auto-Save State Machine

```mermaid
---
config:
  theme: forest
---
stateDiagram-v2
    [*] --> Idle

    Idle --> Debouncing : User types / changes input
    Debouncing --> Debouncing : Another change within 500ms (reset timer)
    Debouncing --> Saving : 500ms elapsed, no new changes

    Saving --> Saved : UPSERT wizard_answers succeeds
    Saving --> Error : UPSERT fails (network, server error)

    Saved --> Idle : 2s display timeout
    Saved --> Debouncing : User types again

    Error --> Retrying : Auto-retry after 1s
    Retrying --> Saved : Retry succeeds
    Retrying --> Error : Retry fails (max 3 attempts)
    Error --> Debouncing : User types again (new save cycle)

    state Idle {
        [*] --> NoIndicator
        NoIndicator : Save indicator hidden or shows checkmark
    }

    state Debouncing {
        [*] --> WaitingForPause
        WaitingForPause : 500ms debounce timer active
    }

    state Saving {
        [*] --> ShowSaving
        ShowSaving : Display "Saving..." indicator
    }

    state Saved {
        [*] --> ShowSaved
        ShowSaved : Display "Saved" with checkmark
    }

    state Error {
        [*] --> ShowError
        ShowError : Display "Save failed" with retry option
    }
```

## Responsive Breakpoints

```mermaid
---
config:
  theme: forest
---
flowchart TB
    subgraph Mobile["Mobile — under 768px"]
        direction TB
        M_Layout["Single Column Layout"]
        M_Center["Center panel only<br/>Full width"]
        M_Left["Left panel: collapsed to<br/>hamburger menu with stepper"]
        M_Right["Right panel: collapsed to<br/>expandable bottom sheet"]
        M_Footer["Footer bar: sticky bottom<br/>Back + Continue only"]
    end

    subgraph Tablet["Tablet — 768px to 1024px"]
        direction TB
        T_Layout["Two Panel Layout"]
        T_Left["Left panel: 200px<br/>Stepper visible, no context"]
        T_Center["Center panel: flex-1<br/>Form content"]
        T_Right["Right panel: hidden<br/>Toggle via icon button"]
        T_Footer["Footer bar: full width<br/>All 3 elements"]
    end

    subgraph Desktop["Desktop — over 1024px"]
        direction TB
        D_Layout["Three Panel Layout"]
        D_Left["Left panel: 240px<br/>Stepper + context summary"]
        D_Center["Center panel: flex-1 max-640px<br/>Form content"]
        D_Right["Right panel: 320px<br/>AI intelligence feed"]
        D_Footer["Footer bar: full width<br/>All 3 elements"]
    end

    subgraph Step5Exception["Step 5 Exception — All Breakpoints"]
        direction TB
        S5_Layout["Single centered column<br/>max-width: 800px"]
        S5_NoSide["Left and right panels hidden"]
        S5_Content["Review summary<br/>Edit buttons per section<br/>Submit CTA centered"]
    end

    classDef mobileNode fill:#dc2626,stroke:#991b1b,stroke-width:1px,color:#F1EEEA
    classDef tabletNode fill:#d97706,stroke:#92400e,stroke-width:1px,color:#F1EEEA
    classDef desktopNode fill:#1a5c3a,stroke:#84CC16,stroke-width:1px,color:#F1EEEA
    classDef step5Node fill:#0A211F,stroke:#84CC16,stroke-width:2px,color:#84CC16

    class M_Layout,M_Center,M_Left,M_Right,M_Footer mobileNode
    class T_Layout,T_Left,T_Center,T_Right,T_Footer tabletNode
    class D_Layout,D_Left,D_Center,D_Right,D_Footer desktopNode
    class S5_Layout,S5_NoSide,S5_Content step5Node
```

## Step Progress Indicators

```mermaid
---
config:
  theme: forest
---
stateDiagram-v2
    [*] --> NotStarted

    NotStarted --> Active : User navigates to this step
    Active --> Completed : Validation passes + user advances
    Active --> InProgress : User partially fills fields
    InProgress --> Active : User returns to this step
    Completed --> Active : User navigates back to edit

    state NotStarted {
        [*] --> GrayCircle
        GrayCircle : Gray circle, muted text
    }

    state Active {
        [*] --> LimeCircle
        LimeCircle : Lime green circle with pulse animation
        LimeCircle : Bold step title, form visible
    }

    state InProgress {
        [*] --> HalfCircle
        HalfCircle : Partial fill indicator
        HalfCircle : Step has saved data but incomplete
    }

    state Completed {
        [*] --> CheckCircle
        CheckCircle : Green circle with checkmark
        CheckCircle : Step title with strikethrough or muted
    }
```
