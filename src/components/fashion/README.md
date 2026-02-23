# Fashion AI Services Components

This directory contains all components for the Fashion industry service page (`/industries/fashion`).

## Components Overview

### 1. FashionHero
- Dark teal hero section with fashion runway imagery
- Breadcrumb navigation
- Industry tag and headline
- Primary CTA button

### 2. FashionIntro
- Introduction section with two-paragraph overview
- Green accent line
- Statistics about AI adoption in fashion

### 3. FashionStats
- Exhibit 1: Industry Analysis — Key Stats
- Four-column stat display
- Additional bullet points with context
- Warm cream background

### 4. FashionApproach
- "Our Approach" section
- Explains methodology for fashion retailers
- Green accent line and Playfair Display headings

### 5. FashionFramework
- Exhibit 2: BCG-style tabbed framework
- Three tabs with 4-step processes each:
  - Brand & Style Audit
  - AI Implementation
  - Measure & Scale
- Horizontal flow diagrams with arrows

### 6. FashionServiceCards
- Six detailed service cards in 3×2 grid
- Each card includes:
  - Badge (HIGH DEMAND, STRATEGIC, etc.)
  - Title and description
  - Feature tags
  - ROI metrics
  - Real-world examples
  - Build cost and time to ROI
- Large faded numbers as background

### 7. FashionROIChart
- Exhibit 3: Fashion AI Impact chart
- Recharts horizontal bar chart
- Five impact areas with metrics
- Green bars with labels

### 8. FashionValueChain
- Exhibit 4: Fashion AI Value Chain
- Six-stage value chain visualization
- Shows AI applications at each stage
- Impact metrics for each stage

### 9. FashionSuggestedServices
- Four additional services in grid layout
- Lucide icons with green backgrounds
- Services: Catalog Intelligence, Circular Fashion AI, AI Campaign Content, Supply Chain Optimization

### 10. FashionInsights
- Four insight cards with gradient backgrounds
- Topics: Virtual try-on, sustainability, AI agents, strategy
- "See more insights" CTA link

### 11. FashionRelatedServices
- Three related service cards
- Gradient backgrounds: Luxury Goods, Retail Industry, Customer Experience
- Tag and title overlays

### 12. FashionCTA
- Final CTA section with dark teal background
- Centered headline and body copy
- Green CTA button to booking page

## Design System

- **Primary Font:** Playfair Display (headings)
- **Body Font:** Lora (paragraphs)
- **Accent Color:** #84CC16 (lime green)
- **Hero Color:** #0F3D3E (dark teal)
- **Backgrounds:** White (#FFFFFF) and warm cream (#FAF8F6)
- **No rounded corners, no shadows**
- **Clean, minimal, professional aesthetic**

## Animation System

All components use Motion (formerly Framer Motion):
- `useInView` hook with `once: true`
- Scroll-triggered reveals with `-100px` margin
- Staggered delays for sequential elements
- Consistent 0.6-0.8s duration

## Usage

```tsx
import {
  FashionHero,
  FashionIntro,
  FashionStats,
  // ... other components
} from './fashion';

// In parent component:
<FashionHero onCTAClick={handleCTAClick} />
<FashionIntro />
<FashionStats />
// ... etc.
```

## Props

Most components are self-contained with no props required.

**Exception:**
- `FashionHero` accepts `onCTAClick?: () => void`
- `FashionCTA` accepts `onCTAClick?: () => void`

## Data Structure

Service cards data structure:
```typescript
{
  number: '01',
  badge: { text: 'HIGH DEMAND', color: 'bg-[#84CC16]' },
  title: 'AI Virtual Try-On',
  description: '...',
  features: ['Selfie Avatar', 'Fabric Simulation', ...],
  roiLabel: 'Return Rate Reduction',
  roiValue: '-25%',
  example: '...',
  buildCost: '$40K–$120K',
  timeToROI: '6–12 months',
}
```

## Statistics Sources

All data is sourced from:
- McKinsey State of Fashion reports
- Business of Fashion (BoF) research
- Industry case studies and pilots
- Technology vendor data (Google, DressX, Heuritech, etc.)

## Maintenance

When updating content:
1. Update statistics in `FashionStats.tsx`
2. Refresh case studies in `FashionServiceCards.tsx`
3. Update pricing ranges as market evolves
4. Keep ROI metrics current with latest data
5. Refresh Unsplash images as needed

## Related Documentation

- `/docs/services/02-fashion.md` - Full implementation documentation
- `/docs/services/01-ecommerce.md` - Sister page for reference
- `/docs/style-guide.md` - Design system guidelines
