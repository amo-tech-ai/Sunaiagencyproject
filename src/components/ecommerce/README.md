# E-Commerce AI Services Components

This folder contains all components for the E-Commerce AI Services industry page.

## Components

### 1. **EcommerceHero.tsx**
Hero section with breadcrumb, industry tag, headline, subheadline, and CTA button.

### 2. **EcommerceIntro.tsx**
Introduction copy framing the problem and market shift (4,700% AI growth stat).

### 3. **EcommerceStats.tsx**
4-column stat grid with animated numbers and context.

### 4. **EcommerceApproach.tsx**
Section explaining the agency's end-to-end approach to e-commerce AI.

### 5. **EcommerceFramework.tsx**
Tabbed framework component with 3 tabs:
- Set the Direction (5 steps)
- Define the Customer Journey (5 stages)
- Deploy & Scale Timeline (4 phases)

### 6. **EcommerceServiceCards.tsx**
6 detailed service cards in 3×2 grid with badges, features, ROI metrics, examples, and costs.

### 7. **EcommerceROIChart.tsx**
BCG-style Exhibit 1 with animated horizontal bar chart showing ROI by application area.

### 8. **EcommerceTools.tsx**
Assessment tools section with 4 proprietary assessment types in 2×2 grid.

### 9. **EcommerceSuggestedServices.tsx**
4 complementary service cards with icons (Product Descriptions, Reviews, Forecasting, Segmentation).

### 10. **EcommerceInsights.tsx**
4 insight cards with gradient images, tags, dates, and headlines. Includes "See more insights" CTA.

### 11. **EcommerceRelatedServices.tsx**
3 horizontal cards linking to related services with gradient accents.

### 12. **EcommerceCTA.tsx**
Final conversion band with headline, body copy, and "Book Your Free Assessment" CTA.

---

## Design System

### Colors
- **Dark Teal:** `#0F3D3E` (hero backgrounds)
- **Lime Green:** `#84CC16` (accents, CTAs, metrics)
- **Warm Cream:** `#FAF8F6` (alternating sections)
- **Pure White:** `#FFFFFF` (primary sections)

### Typography
- **Headings:** `Playfair Display` serif
- **Body:** `Lora` serif
- **Labels:** Uppercase with tracking

### Animations
- Motion/react with `useInView` hook
- Fade-in from bottom (y: 40)
- Staggered delays for grid items
- Duration: 0.8s standard

### BCG-Style Elements
- No shadows
- No rounded corners
- Border-based cards
- Exhibit boxes with labels
- Process flows with numbered circles

---

## Usage

```tsx
import EcommercePage from './components/EcommercePage';

<EcommercePage onNavigate={handleNavigation} />
```

Each component is independently importable:

```tsx
import { EcommerceHero, EcommerceStats } from './components/ecommerce';
```

---

## Props

Most components are self-contained. Two components accept props:

```tsx
interface EcommerceHeroProps {
  onCTAClick?: () => void;
}

interface EcommerceCTAProps {
  onCTAClick?: () => void;
}
```

---

## Accessibility

- Semantic HTML
- Keyboard navigation
- Screen reader compatible
- WCAG AA color contrast
- Proper heading hierarchy

---

## Performance

- Scroll-triggered animations
- Lazy rendering with IntersectionObserver
- Optimized Unsplash images
- GPU-accelerated transitions

---

For full documentation, see `/docs/services/01-ecommerce.md`
