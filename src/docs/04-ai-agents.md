# AI AGENTS SERVICE PAGE V11 — DESIGN SPECIFICATION

**Page:** `/services/ai-agents`  
**Design System:** Calm Luxury Editorial (V11)  
**Purpose:** Premium AI agents service page that educates and converts  
**Status:** 🟡 In Planning

---

## 📋 PROGRESS TRACKER

### Phase 1: Design & Planning
- [x] Design brief created
- [x] Content strategy defined
- [ ] Visual wireframes approved
- [ ] Diagram concepts finalized
- [ ] Animation blueprint complete

### Phase 2: Component Design
- [ ] Hero section designed
- [ ] Definition cards designed
- [ ] Agent type cards designed
- [ ] Use case timeline designed
- [ ] Agent flow diagram designed
- [ ] Comparison table designed
- [ ] Trust section designed
- [ ] Final CTA designed

### Phase 3: Development
- [ ] Hero component built
- [ ] Definition section built
- [ ] Agent cards grid built
- [ ] Use cases scroll built
- [ ] Flow diagram built
- [ ] Comparison table built
- [ ] Trust badges built
- [ ] Final CTA built

### Phase 4: Integration & Polish
- [ ] Route integration
- [ ] Responsive testing
- [ ] Animation implementation
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Launch

---

## 🎨 DESIGN BRIEF

### Role
You are a **Senior Product Designer & UX Architect** for Sun AI Agency, designing a premium marketing page for AI Agents services.

### Objective
Create a **high-converting AI Agents service page** that:
- Explains AI agents in simple business language
- Shows real-world use cases with measurable outcomes
- Clearly defines agent types and their value
- Builds trust through transparency
- Drives users to book strategy calls or start wizard

### Design Philosophy
**Luxury · Premium · Sophisticated · Intelligent · Calm · High-End**

- Editorial magazine quality
- Generous whitespace
- Strong Playfair Display headlines
- Clean 1px borders only
- No shadows, no rounded buttons
- Amber accent for hierarchy

### Visual Tone
- **Not:** Techy, sci-fi, robotic
- **Yes:** Business-focused, elegant, trustworthy
- **Feeling:** Like consulting a premium strategy firm

---

## 🗺️ PAGE ARCHITECTURE

### Section Flow
```
1. Hero (Value Proposition)
    ↓
2. Definition (What is an AI Agent?)
    ↓
3. Agent Types Grid (6 Agent Cards)
    ↓
4. Real-World Use Cases (Scroll Story)
    ↓
5. How Agents Work Together (Flow Diagram)
    ↓
6. Core vs Advanced Tiers (Comparison)
    ↓
7. Trust & Safety (Reassurance)
    ↓
8. Final CTA (Conversion)
```

---

## 📐 WIREFRAMES

### DESKTOP LAYOUT (1400px wide)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                    HERO SECTION                            │
│                                                            │
│    AI Agents That Work Like a Team — Not a Chatbot        │
│                                                            │
│    [Subheading text about autonomous digital workers]     │
│                                                            │
│    [See Which Agents You Need]  [View Real Use Cases]     │
│                                                            │
│    [Abstract illustration: connected nodes/network]       │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                                                            │
│              WHAT IS AN AI AGENT?                          │
│                                                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────┐│
│  │                 │  │                 │  │            ││
│  │  Definition     │  │  How They       │  │  Why They  ││
│  │  Card           │  │  Differ from    │  │  Matter    ││
│  │                 │  │  Chatbots       │  │  Now       ││
│  │                 │  │                 │  │            ││
│  └─────────────────┘  └─────────────────┘  └────────────┘│
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                                                            │
│              AI AGENT TYPES (3-COLUMN GRID)                │
│                                                            │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐│
│  │ [Icon: Brain]  │ │ [Icon: Chart]  │ │ [Icon: Pen]    ││
│  │                │ │                │ │                ││
│  │ Orchestrator   │ │ Sales Agent    │ │ Content Agent  ││
│  │ Agent          │ │                │ │                ││
│  │ [Description]  │ │ [Description]  │ │ [Description]  ││
│  │                │ │                │ │                ││
│  │ [View Details] │ │ [View Details] │ │ [View Details] ││
│  └────────────────┘ └────────────────┘ └────────────────┘│
│                                                            │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐│
│  │ [Icon: Gear]   │ │ [Icon: Graph]  │ │ [Icon: Bot]    ││
│  │                │ │                │ │                ││
│  │ Ops            │ │ Analytics      │ │ Custom         ││
│  │ Automation     │ │ Agent          │ │ Agent          ││
│  │ [Description]  │ │ [Description]  │ │ [Description]  ││
│  │                │ │                │ │                ││
│  │ [View Details] │ │ [View Details] │ │ [View Details] ││
│  └────────────────┘ └────────────────┘ └────────────────┘│
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                                                            │
│         REAL-WORLD USE CASES (VERTICAL STORY)              │
│                                                            │
│  [Progress Indicator Line on Left]                        │
│                                                            │
│  ● ─────────────────────────────────────────              │
│  │  Real Estate Example                                   │
│  │  Problem → Agent Used → Result                         │
│  │  [Metric cards showing improvement]                    │
│  │                                                         │
│  ● ─────────────────────────────────────────              │
│  │  Fashion Ecommerce Example                             │
│  │  Problem → Agent Used → Result                         │
│  │  [Metric cards showing improvement]                    │
│  │                                                         │
│  ● ─────────────────────────────────────────              │
│  │  SaaS Example                                          │
│  │  Problem → Agent Used → Result                         │
│  │  [Metric cards showing improvement]                    │
│  │                                                         │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                                                            │
│       HOW AGENTS WORK TOGETHER (FLOW DIAGRAM)              │
│                                                            │
│         Lead Entry                                         │
│             ↓                                              │
│        Sales Agent ────────→ CRM                           │
│             ↓                 ↓                            │
│        Follow-up          Analytics Agent                  │
│             ↓                 ↓                            │
│        Booking            Planner Agent                    │
│             ↓                 ↓                            │
│        Calendar           Ops Agent                        │
│             ↓                 ↓                            │
│        Confirmed          Reporting                        │
│                                                            │
│   Caption: Agents operate as a coordinated system          │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                                                            │
│       CORE VS ADVANCED AGENTS (COMPARISON TABLE)           │
│                                                            │
│  ┌──────────────┬─────────────┬─────────────┬──────────┐  │
│  │ Feature      │ Core        │ Advanced    │Enterprise│  │
│  ├──────────────┼─────────────┼─────────────┼──────────┤  │
│  │ Agents       │ 2-3         │ 5-7         │ 10+      │  │
│  │ Coordination │ Basic       │ Smart       │ Full     │  │
│  │ Approval     │ Manual      │ Conditional │ Custom   │  │
│  │ Price        │ $X/month    │ $Y/month    │ Custom   │  │
│  └──────────────┴─────────────┴─────────────┴──────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                                                            │
│            TRUST & SAFETY SECTION                          │
│                                                            │
│  ✓ Human approval gates for critical decisions            │
│  ✓ Explainable actions with full audit logs               │
│  ✓ No black-box automation                                │
│  ✓ Secure data handling with encryption                   │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                       DARK BACKGROUND                       │
│                                                            │
│              Build Your AI Agent Team                      │
│                                                            │
│  You don't need all agents. We recommend only what        │
│  unlocks growth for your specific business.               │
│                                                            │
│     [Build My AI Strategy]  [See Recommended Agents]      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### TABLET LAYOUT (768px)

```
┌──────────────────────────────┐
│         HERO                 │
│    (Centered, stacked)       │
└──────────────────────────────┘
┌──────────────────────────────┐
│    DEFINITION (2 COLS)       │
│  ┌───────┐  ┌───────┐       │
│  │ Card1 │  │ Card2 │       │
│  └───────┘  └───────┘       │
│  ┌───────┐                  │
│  │ Card3 │                  │
│  └───────┘                  │
└──────────────────────────────┘
┌──────────────────────────────┐
│   AGENT TYPES (2 COLS)       │
│  ┌───────┐  ┌───────┐       │
│  │Agent 1│  │Agent 2│       │
│  └───────┘  └───────┘       │
│       ... (stacked)          │
└──────────────────────────────┘
┌──────────────────────────────┐
│    USE CASES (VERTICAL)      │
└──────────────────────────────┘
┌──────────────────────────────┐
│    FLOW DIAGRAM              │
│    (Condensed vertical)      │
└──────────────────────────────┘
┌──────────────────────────────┐
│    COMPARISON TABLE          │
│    (Scrollable horizontal)   │
└──────────────────────────────┘
┌──────────────────────────────┐
│    FINAL CTA                 │
└──────────────────────────────┘
```

### MOBILE LAYOUT (<768px)

```
┌──────────────┐
│    HERO      │
│  (Stacked)   │
│              │
│  [CTA Stack] │
└──────────────┘
┌──────────────┐
│  DEFINITION  │
│              │
│  ┌────────┐  │
│  │ Card 1 │  │
│  └────────┘  │
│  ┌────────┐  │
│  │ Card 2 │  │
│  └────────┘  │
│  ┌────────┐  │
│  │ Card 3 │  │
│  └────────┘  │
└──────────────┘
┌──────────────┐
│ AGENT TYPES  │
│              │
│  ┌────────┐  │
│  │Agent 1 │  │
│  └────────┘  │
│  ┌────────┐  │
│  │Agent 2 │  │
│  └────────┘  │
│     ...      │
└──────────────┘
┌──────────────┐
│  USE CASES   │
│  (Vertical   │
│   timeline)  │
└──────────────┘
┌──────────────┐
│ FLOW DIAGRAM │
│  (Vertical   │
│   simplified)│
└──────────────┘
┌──────────────┐
│ COMPARISON   │
│ (Cards not   │
│  table)      │
└──────────────┘
┌──────────────┐
│  TRUST       │
│  (Stacked)   │
└──────────────┘
┌──────────────┐
│  FINAL CTA   │
│  (Full width)│
└──────────────┘
```

---

## 📝 CONTENT STRUCTURE

### 1. HERO SECTION

#### Headline
```
AI Agents That Work Like a Team — Not a Chatbot
```

#### Subheading
```
AI agents are autonomous digital workers that execute tasks, make decisions, 
and coordinate work across your business — without hiring.
```

#### Primary CTA
```
See Which Agents You Need
```
**Route:** `/wizard`

#### Secondary CTA
```
View Real Use Cases
```
**Action:** Smooth scroll to use cases section

#### Visual Element
- Abstract illustration of connected nodes
- Subtle network pattern
- Light parallax effect on scroll
- Amber accent lines connecting nodes

---

### 2. DEFINITION SECTION

#### Section Title
```
What Is an AI Agent?
```

#### Card 1: Definition
**Headline:** What Is an AI Agent?

**Body:**
```
An AI agent is a specialized system designed to perform a specific role 
in your business — like sales follow-ups, content creation, reporting, 
or operations — automatically and continuously.

Think digital employee, not chatbot.
```

#### Card 2: How They Differ
**Headline:** Not Just a Chatbot

**Body:**
```
Chatbots respond to questions. AI agents take action.

Agents make decisions, execute workflows, coordinate with other systems, 
and work 24/7 without supervision.
```

#### Card 3: Why Now
**Headline:** Why AI Agents Matter Now

**Body:**
```
Your competitors are automating. Manual operations can't scale.

AI agents let you grow revenue without proportionally growing headcount.
```

---

### 3. AI AGENT TYPES GRID

#### Section Title
```
Types of AI Agents We Build
```

#### Section Subtitle
```
Each agent is designed for a specific business function
```

#### Agent 1: Orchestrator Agent
- **Icon:** Brain or Network
- **Name:** Orchestrator Agent
- **Tagline:** Coordinates all AI agents and workflows
- **Description:** The "manager" agent that ensures all other agents work together without conflicts, duplicates, or errors.
- **Outcome:** Nothing breaks, nothing duplicates, seamless operation
- **Best For:** Businesses with 3+ agents
- **CTA:** View Orchestration Details →

#### Agent 2: Sales Agent
- **Icon:** TrendingUp or Target
- **Name:** Sales Agent
- **Tagline:** Follows up, qualifies, and books leads automatically
- **Description:** Responds to inquiries instantly, qualifies prospects, schedules meetings, and updates CRM—all without manual intervention.
- **Outcome:** Faster response times, higher conversion, more booked calls
- **Best For:** Sales teams, lead generation
- **CTA:** View Sales Agent →

#### Agent 3: Content Agent
- **Icon:** PenTool or FileText
- **Name:** Content Agent
- **Tagline:** Creates posts, ads, emails, and campaigns
- **Description:** Generates on-brand content for social media, email campaigns, and advertising based on your style and voice.
- **Outcome:** Consistent content without burnout or hiring writers
- **Best For:** Marketing teams, agencies
- **CTA:** View Content Agent →

#### Agent 4: Ops Automation Agent
- **Icon:** Settings or Zap
- **Name:** Ops Automation Agent
- **Tagline:** Runs internal workflows and alerts teams
- **Description:** Automates recurring operations like reporting, task assignments, data entry, and team notifications.
- **Outcome:** Hours saved every week, zero manual errors
- **Best For:** Operations teams, founders
- **CTA:** View Ops Agent →

#### Agent 5: Analytics Agent
- **Icon:** BarChart or PieChart
- **Name:** Analytics Agent
- **Tagline:** Analyzes data and generates actionable insights
- **Description:** Monitors metrics, identifies trends, and surfaces opportunities or risks—without manual data analysis.
- **Outcome:** Better decisions, clearer priorities, less guesswork
- **Best For:** Decision-makers, founders
- **CTA:** View Analytics Agent →

#### Agent 6: Custom Agent
- **Icon:** Puzzle or Sparkles
- **Name:** Custom Agent
- **Tagline:** Built for your unique business needs
- **Description:** We design and deploy custom AI agents for specialized workflows that don't fit standard categories.
- **Outcome:** Competitive advantage through bespoke automation
- **Best For:** Unique business models
- **CTA:** Discuss Custom Agent →

**Design Notes:**
- 3 columns on desktop, 2 on tablet, 1 on mobile
- Equal-height cards with borders
- Icons: 48px, amber color
- Hover state: border color change to amber
- CTA buttons at bottom of each card

---

### 4. REAL-WORLD USE CASES

#### Section Title
```
AI Agents in Action
```

#### Section Subtitle
```
Real businesses, real results
```

#### Use Case 1: Real Estate
**Problem:**
```
Leads arrive at night and go cold by morning. 
Manual follow-up takes hours.
```

**Agent Used:**
```
WhatsApp Sales Agent
```

**Result:**
```
• Instant replies 24/7
• Leads qualified automatically
• Showings booked while agent sleeps
• 40% more conversions
```

**Visual:** Screenshot or mockup of WhatsApp conversation

---

#### Use Case 2: Fashion Ecommerce
**Problem:**
```
Customers ask the same sizing, shipping, and return questions repeatedly. 
Support team overwhelmed.
```

**Agent Used:**
```
Support & Sales Agent
```

**Result:**
```
• 60% of questions answered automatically
• Higher conversion on product pages
• Support team focuses on complex issues
• 25% increase in average order value
```

**Visual:** Chat interface mockup

---

#### Use Case 3: SaaS Company
**Problem:**
```
Leads forget demo calls. Manual reminders ineffective.
Show-up rate: 45%.
```

**Agent Used:**
```
Sales + CRM Agent
```

**Result:**
```
• Automated reminders via email + SMS
• Rescheduling handled automatically
• Show-up rate increased to 78%
• More demos = more revenue
```

**Visual:** Calendar/scheduling interface

**Design Notes:**
- Vertical timeline layout
- Progress indicator on left (amber line)
- Each use case fades in on scroll
- Metrics displayed in small cards
- Before/after comparison where applicable

---

### 5. HOW AGENTS WORK TOGETHER

#### Section Title
```
Agents Work as a Coordinated System
```

#### Section Subtitle
```
Individual agents are powerful. Connected agents are transformative.
```

#### Flow Diagram Visual

**Stages:**
1. **Lead Entry** (Website form, WhatsApp, email)
2. **Sales Agent** (Qualification, initial response)
3. **CRM Integration** (Data logged automatically)
4. **Analytics Agent** (Patterns identified)
5. **Planner Agent** (Next actions determined)
6. **Ops Agent** (Tasks executed)
7. **Reporting** (Results tracked)

**Visual Elements:**
- Circular nodes for each stage
- Directional arrows showing flow
- Amber highlights for active connections
- Data flowing between nodes (animated)

**Caption:**
```
Agents don't operate in isolation. They share data, coordinate actions, 
and create a unified intelligence layer across your business.
```

**Design Notes:**
- Centered diagram on desktop
- Vertical flow on mobile
- Subtle animation: data pulses between nodes
- Hover: highlight connected path
- Clean, minimal aesthetic

---

### 6. CORE VS ADVANCED AGENTS

#### Section Title
```
Choose Your Agent Tier
```

#### Section Subtitle
```
Start simple, scale as you grow
```

#### Comparison Table

| Feature | Core | Advanced | Enterprise |
|---------|------|----------|------------|
| **Number of Agents** | 2-3 agents | 5-7 agents | 10+ agents |
| **Coordination** | Basic sequencing | Smart routing | Full orchestration |
| **Approval Gates** | Manual approval required | Conditional automation | Custom approval logic |
| **Analytics** | Basic reporting | Advanced insights | Predictive intelligence |
| **Integration** | 3-5 tools | 10+ tools | Unlimited |
| **Support** | Email support | Priority support | Dedicated success manager |
| **Best For** | Small teams | Growing businesses | Complex organizations |
| **Starting Price** | $2,500/mo | $7,500/mo | Custom pricing |
| **CTA** | Get Started | Get Started | Contact Us |

**Design Notes:**
- Clean table layout
- Highlight "Advanced" column (amber accent)
- Mobile: Convert to stacked cards
- Sticky header on scroll (table header)
- CTA buttons at bottom of each column

---

### 7. TRUST & SAFETY SECTION

#### Section Title
```
Built with Trust and Transparency
```

#### Trust Points

**Point 1: Human Approval Gates**
- **Icon:** CheckCircle
- **Text:** Critical decisions require human approval. You're always in control.

**Point 2: Explainable Actions**
- **Icon:** Eye
- **Text:** Every agent action is logged and explainable. No black-box automation.

**Point 3: Full Audit Logs**
- **Icon:** FileText
- **Text:** Complete activity history for compliance and oversight.

**Point 4: Secure Data Handling**
- **Icon:** Shield
- **Text:** Enterprise-grade encryption and data security standards.

**Point 5: Gradual Rollout**
- **Icon:** TrendingUp
- **Text:** Start with monitoring mode, expand as you build confidence.

**Point 6: Custom Guardrails**
- **Icon:** Settings
- **Text:** Set limits, restrictions, and approval thresholds that fit your risk tolerance.

**Design Notes:**
- 2-column grid on desktop, stack on mobile
- Icons: 32px, amber
- Minimal, reassuring tone
- Clean borders between items
- Light background (#FAF8F6)

---

### 8. FINAL CTA SECTION

#### Headline
```
Build Your AI Agent Team
```

#### Body
```
You don't need all agents. We recommend only what unlocks growth 
for your specific business.

Start with a strategy session to identify your highest-impact agents.
```

#### Primary CTA
```
Build My AI Strategy
```
**Route:** `/wizard`

#### Secondary CTA
```
See Recommended Agents
```
**Route:** `/booking`

**Design Notes:**
- Dark background (#1A1A1A)
- White headline (Playfair Display)
- Amber CTA buttons
- Center-aligned
- Generous padding (py-32)
- Full-width section

---

## 🎨 VISUAL DESIGN ELEMENTS

### Diagrams & Illustrations

#### Hero Illustration
**Concept:** Abstract network of nodes
- **Style:** Minimalist, geometric
- **Colors:** Light gray nodes, amber connections
- **Animation:** Subtle pulse on active nodes
- **Format:** SVG or inline illustration

#### Agent Type Icons
**Style:** Line icons, 48px
- **Weight:** 2px stroke
- **Color:** Amber (#F59E0B)
- **Background:** Light circle container (#FAF8F6)
- **Examples:** Brain, Chart, Pen, Gear, Graph, Sparkles

#### Flow Diagram
**Concept:** Connected workflow
- **Nodes:** Circular badges with labels
- **Connections:** Directional arrows
- **Style:** Clean, editorial
- **Animation:** Data flow pulses along paths

#### Progress Indicator (Use Cases)
**Style:** Vertical timeline
- **Line:** 2px amber
- **Dots:** 12px circles
- **Active:** Filled amber
- **Inactive:** Outlined gray

### Photography & Screenshots
- **Real chat interfaces** (WhatsApp, web chat)
- **Dashboard screenshots** (analytics, CRM)
- **Calendar/scheduling** interfaces
- **All images:** Clean, high-contrast, professional

---

## 🎬 ANIMATION & SCROLL EFFECTS

### Scroll-Triggered Animations

#### Hero Section
- **Effect:** Parallax on background illustration
- **Speed:** Subtle (0.3x scroll speed)
- **Elements:** Background nodes shift slightly

#### Definition Cards
- **Effect:** Fade in + slide up
- **Stagger:** 0.1s delay between cards
- **Trigger:** When 20% visible
- **Once:** Yes (viewport: once: true)

#### Agent Type Cards
- **Effect:** Fade in + slide up
- **Stagger:** 0.15s delay per card
- **Trigger:** When entering viewport
- **Hover:** Border color change (200ms ease)

#### Use Case Timeline
- **Effect:** Progressive reveal
- **Behavior:** Each case fades in as you scroll
- **Progress Line:** Grows as you scroll
- **Active Dot:** Highlights current section

#### Flow Diagram
- **Effect:** Data pulse animation
- **Behavior:** Animated dots travel along arrows
- **Loop:** Infinite, subtle
- **Trigger:** When diagram is visible

#### Comparison Table
- **Effect:** Fade in rows sequentially
- **Stagger:** 0.1s per row
- **Highlight:** Amber glow on hover

### Hover States

#### Agent Cards
- **Border:** #EFE9E4 → #F59E0B
- **Duration:** 200ms
- **Easing:** ease-out
- **Icon:** Scale 1.1x

#### CTA Buttons
- **Primary:** bg-[#1A1A1A] → bg-[#333]
- **Accent:** bg-[#F59E0B] → bg-[#FCD34D]
- **Duration:** 200ms

#### Table Rows
- **Background:** transparent → #FDFCFB
- **Duration:** 150ms

---

## 🛣️ ROUTING STRUCTURE

### Main Agent Page
```
/services/ai-agents → AI Agents Overview (this page)
```

### Individual Agent Pages (Future)
```
/services/ai-agents/orchestrator → Orchestrator Agent Detail
/services/ai-agents/sales → Sales Agent Detail
/services/ai-agents/content → Content Agent Detail
/services/ai-agents/ops → Ops Automation Detail
/services/ai-agents/analytics → Analytics Agent Detail
/services/ai-agents/custom → Custom Agent Inquiry
```

### External Routes
```
/wizard → AI Strategy Wizard
/booking → Book Strategy Call
/projects → Case Studies
```

### Navigation Updates

#### Header
- Add to "Services" dropdown:
  - AI Agents

#### Footer
- Add to "Services" column:
  - AI Agents

---

## 📋 MULTI-STEP IMPLEMENTATION PLAN

### PROMPT 1: Hero Section + Definition Cards

**Task:** Create hero section and definition cards component

**Visual Requirements:**
- Hero with centered headline (Playfair 72px)
- Subheading (Lora 20px)
- Two CTA buttons side-by-side
- Abstract network illustration background
- Three definition cards below hero
- Cards: equal height, white background, clean borders

**Responsive:**
- Desktop: 3-column cards
- Tablet: 2 columns + 1 below
- Mobile: Stacked vertically

**Animation:**
- Hero: Fade in on load
- Cards: Stagger fade-in (0.1s delay)

---

### PROMPT 2: Agent Types Grid

**Task:** Create agent type cards grid

**Visual Requirements:**
- 6 agent cards in responsive grid
- Each card includes:
  - Icon (48px, amber)
  - Agent name (Playfair 24px)
  - Tagline (16px, gray)
  - Description paragraph
  - Outcome bullet
  - Best For label
  - CTA button
- White cards with borders
- Equal heights

**Responsive:**
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column

**Hover:**
- Border color change to amber
- Icon scale 1.1x

---

### PROMPT 3: Use Cases Timeline

**Task:** Create vertical timeline with use case stories

**Visual Requirements:**
- Vertical timeline with progress line
- 3 use case cards
- Each includes:
  - Problem statement
  - Agent used badge
  - Results with metrics
  - Visual mockup
- Progress dots on left

**Responsive:**
- Desktop: Timeline on left, content on right
- Mobile: Vertical stack, dots on left

**Animation:**
- Progressive reveal on scroll
- Fade in each case when visible
- Progress line grows with scroll

---

### PROMPT 4: Flow Diagram

**Task:** Create agent coordination flow diagram

**Visual Requirements:**
- Circular node layout
- 7 stages connected by arrows
- Center-aligned
- Clean labels
- Directional flow arrows

**Responsive:**
- Desktop: Horizontal flow
- Tablet: Condensed flow
- Mobile: Vertical simplified flow

**Animation:**
- Data pulse along arrows
- Subtle infinite loop
- Trigger when visible

---

### PROMPT 5: Comparison Table

**Task:** Create tier comparison table

**Visual Requirements:**
- 3-column table (Core, Advanced, Enterprise)
- 8 rows (features)
- Highlight middle column (Advanced)
- CTA buttons at bottom

**Responsive:**
- Desktop: Full table
- Tablet: Scrollable horizontal
- Mobile: Stacked cards (not table)

**Styling:**
- Clean borders
- Sticky header
- Amber highlights

---

### PROMPT 6: Trust Section + Final CTA

**Task:** Create trust badges and dark CTA section

**Visual Requirements:**
- Trust section:
  - 6 trust points
  - Icons + text
  - 2-column grid
  - Light background
- Final CTA:
  - Dark background (#1A1A1A)
  - White headline
  - Two buttons
  - Center-aligned

**Responsive:**
- Desktop: 2 columns
- Mobile: Stacked

**Animation:**
- Trust: Fade in on scroll
- CTA: Slide up when visible

---

## ✅ DESIGN CHECKLIST

### Visual Design
- [ ] Follows V11 style guide
- [ ] Playfair Display for headlines
- [ ] Clean 1px borders only
- [ ] No shadows or rounded buttons
- [ ] Amber accent used appropriately
- [ ] Generous whitespace maintained

### Content
- [ ] Business language (not technical)
- [ ] Clear value propositions
- [ ] Specific outcomes mentioned
- [ ] Trust elements included
- [ ] No hype or buzzwords

### Layout
- [ ] Responsive breakpoints tested
- [ ] Mobile-first approach
- [ ] Proper spacing scale
- [ ] Max-width containers
- [ ] Grid gaps consistent

### Components
- [ ] Reusable and modular
- [ ] Props clearly defined
- [ ] Accessible markup
- [ ] Hover states defined
- [ ] Focus states visible

### Animation
- [ ] Scroll animations smooth
- [ ] Stagger delays appropriate
- [ ] Viewport triggers set
- [ ] Performance optimized
- [ ] Reduced motion respected

### Navigation
- [ ] All routes defined
- [ ] CTAs link correctly
- [ ] Header updated
- [ ] Footer updated
- [ ] Breadcrumbs if needed

### Accessibility
- [ ] Semantic HTML
- [ ] ARIA labels present
- [ ] Keyboard navigation
- [ ] Color contrast WCAG AA
- [ ] Alt text for images
- [ ] Focus indicators visible

### Performance
- [ ] Lazy loading images
- [ ] Optimized animations
- [ ] Fast initial paint
- [ ] No layout shift
- [ ] Lighthouse score >90

---

## 🎯 SUCCESS METRICS

### Engagement
- [ ] Time on page >120 seconds
- [ ] Scroll depth >70%
- [ ] Agent card clicks >25%
- [ ] Use case interaction >15%

### Conversion
- [ ] CTA click-through >5%
- [ ] Wizard starts >3%
- [ ] Booking requests >2%
- [ ] Agent detail page views >20%

### Technical
- [ ] Page load <2s
- [ ] Lighthouse >90
- [ ] Mobile usability 100/100
- [ ] Accessibility 100/100

---

## 📚 RELATED DOCUMENTATION

- `/docs/style-guide.md` - V11 design system
- `/docs/sitemap.md` - Site architecture
- `/docs/100-website/06-servicesv11.md` - Services overview
- `/docs/02-projects.md` - Case studies examples

---

## 🔄 VERSION HISTORY

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.0 | 2026-01-08 | Initial specification | Planning |

---

**END OF AI AGENTS SERVICE PAGE SPECIFICATION**

**Next Steps:**
1. Review wireframes
2. Finalize diagrams
3. Begin design in phases (6 prompts)
4. Develop components
5. Test and launch
