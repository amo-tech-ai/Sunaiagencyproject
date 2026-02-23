# IMPLEMENTATION PLAN — PROJECTS PAGE

**Target:** `/projects` route with calm luxury design system  
**Timeline:** Modular implementation in phases  
**Dependencies:** Motion/React, Lucide icons, existing design system

---

## PHASE 1: DATA & TYPES (Foundation)

### 1.1 Create Type Definitions
**File:** `/lib/types/projects.ts`

```typescript
export interface Screenshot {
  url: string;
  caption: string;
  type: 'desktop' | 'mobile';
}

export interface TechStack {
  name: string;
  icon: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  industry: string[];
  problem: string[];
  solution: string;
  aiCapabilities: string[];
  results: string[];
  techStack: TechStack[];
  screenshots: Screenshot[];
  caseStudyUrl?: string;
}
```

### 1.2 Create Project Data
**File:** `/lib/data/projectsData.ts`

Sample projects:
- StartupAI
- FashionOS
- EventsOS
- Medellín AI

---

## PHASE 2: CORE COMPONENTS (Bottom-Up)

### 2.1 ProjectHeader Component
**File:** `/components/projects/ProjectHeader.tsx`
- Project name (H2, Playfair)
- Tagline
- Industry tags (pills)
- Border separator

### 2.2 ScreenshotCarousel Component
**File:** `/components/projects/ScreenshotCarousel.tsx`
- Map through screenshots
- Motion animations (stagger)
- Hover states
- Caption display

### 2.3 ProjectStory Component
**File:** `/components/projects/ProjectStory.tsx`
- Problem section (bullet list)
- Solution section (paragraph)
- AI Capabilities (arrow list)
- Results (checkmark list)
- Tech Stack (pill grid)

### 2.4 ProjectCTA Component
**File:** `/components/projects/ProjectCTA.tsx`
- Primary: "View Case Study"
- Secondary: "Start Similar Project"
- Border separator

---

## PHASE 3: MODULE ASSEMBLY

### 3.1 ProjectModule Component
**File:** `/components/projects/ProjectModule.tsx`

Combines:
- ProjectHeader
- 2-column grid (desktop)
  - Left: ScreenshotCarousel (60%)
  - Right: ProjectStory (40%)
- ProjectCTA

Responsive behavior:
- Desktop: 2 columns
- Mobile: Stacked (screenshots first)

---

## PHASE 4: PAGE-LEVEL COMPONENTS

### 4.1 ProjectsHero
**File:** `/components/projects/ProjectsHero.tsx`
- Label: "CASE STUDIES"
- H1: "Real AI Products. Real Results."
- Subheadline
- Body text
- CTA buttons
- Motion fade-in

### 4.2 ProjectNavigation (Sticky)
**File:** `/components/projects/ProjectNavigation.tsx`
- Map project tabs
- Active state tracking (Intersection Observer)
- Smooth scroll on click
- URL hash updates
- Sticky positioning

### 4.3 SystemDiagram
**File:** `/components/projects/SystemDiagram.tsx`
- Section title
- 6-step flowchart
- Lucide icons
- Arrows (visual connectors)
- Motion animations

### 4.4 ComparisonSection
**File:** `/components/projects/ComparisonSection.tsx`
- Title: "Why Our Projects Ship Faster"
- 2-column grid
- Traditional Agency (left)
- Sun AI Agency (right, highlighted)
- X/Check icons

### 4.5 ProjectsFinalCTA
**File:** `/components/projects/ProjectsFinalCTA.tsx`
- Dark background (#1A1A1A)
- Centered layout
- H2 headline
- Body text
- 2 CTA buttons

---

## PHASE 5: PAGE ASSEMBLY

### 5.1 Main ProjectsPage Component
**File:** `/components/ProjectsPage.tsx`

```tsx
import { PROJECTS } from '../lib/data/projectsData';
import ProjectsHero from './projects/ProjectsHero';
import ProjectNavigation from './projects/ProjectNavigation';
import ProjectModule from './projects/ProjectModule';
import SystemDiagram from './projects/SystemDiagram';
import ComparisonSection from './projects/ComparisonSection';
import ProjectsFinalCTA from './projects/ProjectsFinalCTA';

export default function ProjectsPage() {
  return (
    <main className="bg-[#FDFCFB]">
      <ProjectsHero />
      <ProjectNavigation projects={PROJECTS} />
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <ProjectModule project={PROJECTS[0]} /> {/* StartupAI */}
        <ProjectModule project={PROJECTS[1]} /> {/* FashionOS */}
      </div>
      
      <SystemDiagram />
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <ProjectModule project={PROJECTS[2]} /> {/* EventsOS */}
        <ProjectModule project={PROJECTS[3]} /> {/* Medellín AI */}
      </div>
      
      <ComparisonSection />
      <ProjectsFinalCTA />
    </main>
  );
}
```

---

## PHASE 6: ROUTING & NAVIGATION

### 6.1 Update App.tsx
Add route handling for `/projects` and `projects` page state

### 6.2 Update Header.tsx
Add "Projects" to navigation menu

### 6.3 Update Footer.tsx
Add "Projects" link

---

## PHASE 7: ADVANCED FEATURES

### 7.1 Intersection Observer Hook
**File:** `/lib/hooks/useProjectNavigation.ts`
- Track which project is in viewport
- Update active state
- Update URL hash

### 7.2 Smooth Scroll Handler
**File:** `/lib/utils/scrollToProject.ts`
- Click handler for navigation
- Smooth scroll to section
- Hash management

### 7.3 Screenshot Modal (Optional)
**File:** `/components/projects/ScreenshotModal.tsx`
- Click screenshot to enlarge
- Modal overlay
- Close on ESC/click outside

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Foundation
- [ ] Create `/lib/types/projects.ts`
- [ ] Create `/lib/data/projectsData.ts`
- [ ] Add 4 projects with complete data

### Phase 2: Components
- [ ] ProjectHeader.tsx
- [ ] ScreenshotCarousel.tsx
- [ ] ProjectStory.tsx
- [ ] ProjectCTA.tsx

### Phase 3: Module
- [ ] ProjectModule.tsx (combines above)
- [ ] Test 2-column layout
- [ ] Test mobile stacking

### Phase 4: Page Sections
- [ ] ProjectsHero.tsx
- [ ] ProjectNavigation.tsx
- [ ] SystemDiagram.tsx
- [ ] ComparisonSection.tsx
- [ ] ProjectsFinalCTA.tsx

### Phase 5: Page Assembly
- [ ] ProjectsPage.tsx
- [ ] Test full page flow
- [ ] Test all animations

### Phase 6: Routing
- [ ] Add to App.tsx
- [ ] Add to Header.tsx
- [ ] Add to Footer.tsx
- [ ] Test navigation

### Phase 7: Polish
- [ ] Intersection Observer hook
- [ ] Smooth scroll utility
- [ ] URL hash sync
- [ ] Screenshot modal (optional)

---

## TECHNICAL DECISIONS

### State Management
- No global state needed
- Local state for:
  - Active project (navigation)
  - Modal open/close (if implemented)
  - Scroll position tracking

### Performance Optimization
- Lazy load screenshots (use ImageWithFallback)
- Intersection Observer for animations
- Debounce scroll handlers
- CSS transforms for smooth animations

### Accessibility
- Semantic HTML (nav, main, section)
- ARIA labels for navigation
- Keyboard navigation (Tab, Enter)
- Focus states on all interactive elements
- Alt text for all images

### Responsive Strategy
- Mobile-first approach
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- Grid → Flexbox → Stack

---

## FILE STRUCTURE SUMMARY

```
/lib/
├── types/
│   └── projects.ts
├── data/
│   └── projectsData.ts
└── hooks/
    └── useProjectNavigation.ts

/components/
├── ProjectsPage.tsx
└── projects/
    ├── ProjectsHero.tsx
    ├── ProjectNavigation.tsx
    ├── ProjectModule.tsx
    ├── ProjectHeader.tsx
    ├── ScreenshotCarousel.tsx
    ├── ProjectStory.tsx
    ├── ProjectCTA.tsx
    ├── SystemDiagram.tsx
    ├── ComparisonSection.tsx
    └── ProjectsFinalCTA.tsx
```

---

## NEXT STEPS AFTER IMPLEMENTATION

1. **Content Review**
   - Verify all project data is accurate
   - Get real screenshots
   - Review copy for tone

2. **Performance Audit**
   - Lighthouse score
   - Image optimization
   - Animation performance

3. **User Testing**
   - Navigation usability
   - CTA clarity
   - Mobile experience

4. **Analytics Setup**
   - Track CTA clicks
   - Monitor scroll depth
   - Measure time on page

---

**END OF IMPLEMENTATION PLAN**
