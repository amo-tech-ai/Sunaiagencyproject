# UI Layout & Component Diagrams

## Three-Panel Layout Architecture

```mermaid
flowchart LR
    subgraph Page["Wizard Page Layout"]
        direction TB

        subgraph TopBar["Top Bar (64px)"]
            Logo[Sun AI Logo]
            StepLabel[Step X of 5 — Title]
            SaveStatus[Saved ✓]
        end

        subgraph MainContent["Main Content Area"]
            direction LR

            subgraph Left["Left Panel (240px)"]
                direction TB
                Progress[Progress Stepper]
                Context[Detected Context]
            end

            subgraph Center["Center Panel (flex-1, max 640px)"]
                direction TB
                Title[Page Title]
                Subtitle[Subtitle]
                Fields[Form Fields / Content]
            end

            subgraph Right["Right Panel (320px)"]
                direction TB
                WhyCard[Why This Step/Question]
                Signals[Signals Detected]
                Preview[Preview / Summary]
            end
        end

        subgraph BottomBar["Bottom Bar (72px)"]
            Back[← Back]
            Continue[Continue →]
        end
    end

    style Left fill:#F1EEEA,stroke:#0A211F
    style Center fill:#FFFFFF,stroke:#0A211F
    style Right fill:#F1EEEA,stroke:#0A211F
    style TopBar fill:#FFFFFF,stroke:#D4CFC8
    style BottomBar fill:#FFFFFF,stroke:#D4CFC8
```

## Responsive Layout Breakpoints

```mermaid
flowchart TD
    subgraph Desktop["Desktop (1280px+)"]
        D_Left[Left 240px] --- D_Center[Center flex-1] --- D_Right[Right 320px]
    end

    subgraph Tablet["Tablet (768-1279px)"]
        T_Top[Progress → Top Bar]
        T_Center[Center Full Width]
        T_Drawer[Right → Slide Drawer]
    end

    subgraph Mobile["Mobile (<768px)"]
        M_Bar[Step X of 5 → Top Bar]
        M_Content[Single Column]
        M_Sheet[Right → Bottom Sheet]
        M_CTA[Continue → Sticky Bottom]
    end

    Desktop -->|Resize down| Tablet
    Tablet -->|Resize down| Mobile
```

## Component Hierarchy

```mermaid
flowchart TD
    WizardLayout[WizardLayout]
    WizardLayout --> TopBar[TopBar]
    WizardLayout --> ThreePanel[ThreePanelLayout]
    WizardLayout --> BottomBar[BottomBar]

    TopBar --> Logo[Logo]
    TopBar --> StepIndicator[StepIndicator]
    TopBar --> SaveStatus[SaveStatus]

    ThreePanel --> LeftPanel[LeftPanel]
    ThreePanel --> CenterPanel[CenterPanel]
    ThreePanel --> RightPanel[RightPanel]

    LeftPanel --> ProgressStepper[ProgressStepper]
    LeftPanel --> ContextSummary[ContextSummary]

    CenterPanel --> Step1[Step1BusinessContext]
    CenterPanel --> Step2[Step2IndustryDiagnostics]
    CenterPanel --> Step3[Step3SystemRecommendations]
    CenterPanel --> Step4[Step4ExecutiveBrief]
    CenterPanel --> Step5[Step5DashboardEntry]

    Step1 --> TextInput[TextInput]
    Step1 --> SelectInput[SelectInput]
    Step1 --> CardSelect[CardSelect]
    Step1 --> TextareaInput[TextareaInput]
    Step1 --> FileUpload[FileUpload]

    Step2 --> MultiSelectCards[MultiSelectCards]
    Step2 --> SelectInput2[SelectInput]
    Step2 --> TriStateCards[TriStateCards: Yes/No/Partial]

    Step3 --> RecommendationCard[RecommendationCard]
    Step3 --> SystemToggle[SystemToggle]
    Step3 --> EffortBadge[EffortBadge]

    Step4 --> BriefSection[BriefSection]
    Step4 --> InlineEditor[InlineEditor]
    Step4 --> ApprovalControls[ApprovalControls]

    Step5 --> ConfirmationCard[ConfirmationCard]
    Step5 --> PreviewCards[PreviewCards]
    Step5 --> DashboardCTA[DashboardCTA]

    RightPanel --> ContextCard[ContextCard]
    RightPanel --> InsightPill[InsightPill]
    RightPanel --> SignalsList[SignalsList]
    RightPanel --> SelectionSummary[SelectionSummary]

    BottomBar --> BackButton[BackButton]
    BottomBar --> ContinueButton[ContinueButton]

    style WizardLayout fill:#0A211F,color:#fff
    style Step1 fill:#84CC16,stroke:#0A211F
    style Step2 fill:#84CC16,stroke:#0A211F
    style Step3 fill:#84CC16,stroke:#0A211F
    style Step4 fill:#84CC16,stroke:#0A211F
    style Step5 fill:#84CC16,stroke:#0A211F
```

## User Journey Through Wizard

```mermaid
journey
    title Sun AI Agency — Wizard User Journey
    section Step 1: Business Context
        Enter company name: 5: User
        Select industry: 4: User
        Choose company size: 5: User
        Describe main goal: 4: User
        Write biggest challenge: 3: User
        Upload documents: 3: User
        Click Continue: 5: User
    section Step 2: Industry Diagnostics
        Answer channel question: 4: User
        Answer sales process: 4: User
        Answer support method: 4: User
        Answer tools used: 4: User
        Answer industry questions: 3: User
        Review signals detected: 5: User
        Click Continue: 5: User
    section Step 3: System Recommendations
        Review recommendations: 5: User, AI
        Read why it fits: 5: User
        Select systems: 4: User
        Review selection summary: 5: User
        Click Continue: 5: User
    section Step 4: Executive Brief
        Read executive summary: 5: User
        Review company profile: 4: User
        Check industry analysis: 5: User
        Review recommended systems: 4: User
        Edit sections if needed: 3: User
        Approve brief: 5: User
    section Step 5: Dashboard Entry
        See project confirmation: 5: User
        Review what was created: 5: User
        Enter dashboard: 5: User
```

## Auto-Save State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle

    Idle --> Debouncing: Field changed
    Debouncing --> Debouncing: Another field changed (reset timer)
    Debouncing --> Saving: 500ms elapsed
    Saving --> Saved: Supabase returns success
    Saving --> Error: Supabase returns error
    Saved --> Idle: After 2s (hide indicator)
    Error --> Idle: User modifies field
    Error --> Saving: Auto-retry after 3s

    note right of Debouncing
        Timer: 500ms
        Shows: nothing yet
    end note

    note right of Saving
        Shows: "Saving..."
    end note

    note right of Saved
        Shows: "Saved ✓"
        Duration: 2s then fade
    end note

    note right of Error
        Shows: "Save failed — retrying..."
        Auto-retry: 3s
        Max retries: 3
    end note
```
