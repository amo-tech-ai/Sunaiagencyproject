# Services Navigation Structure

## Overview
This document outlines the navigation structure for all service and industry pages.

## Service Pages

### Industries

| Page | Primary URL | Alias | Status | Components | Docs |
|------|-------------|-------|--------|-----------|------|
| E-Commerce | `/industries/e-commerce` | `/ecommerce` | ✅ Live | 12 | `/docs/services/01-ecommerce.md` |
| Fashion | `/industries/fashion` | `/fashion` | ✅ Live | 12 | `/docs/services/02-fashion.md` |

## Footer Navigation

The footer now includes an **Industries** column with links to:
- E-Commerce
- Fashion

### Footer Structure
```typescript
const industriesLinks = [
  { id: 'ecommerce', label: 'E-Commerce' },
  { id: 'fashion', label: 'Fashion' },
];
```

## Routing Configuration

### App.tsx Routes

```typescript
// E-Commerce routes
case 'industries/e-commerce':
case 'ecommerce':
  return <EcommercePage onNavigate={setCurrentPage} />;

// Fashion routes  
case 'industries/fashion':
case 'fashion':
  return <FashionPage onNavigate={setCurrentPage} />;
```

## Navigation Flow

### To Industry Pages

**From Footer:**
1. Scroll to footer
2. Click "Industries" column
3. Click "E-Commerce" or "Fashion"

**Direct URL:**
- Navigate to `/industries/fashion` or `/fashion`
- Navigate to `/industries/e-commerce` or `/ecommerce`

### From Industry Pages

**CTA Buttons:**
- Hero CTA → Booking page
- Final CTA → Booking page

**Navigation Bar:**
- Header remains accessible for all navigation

## URL Strategy

Each industry page has:
1. **Primary URL:** `/industries/{industry-name}` (canonical)
2. **Alias:** `/{industry-name}` (short form)

Both URLs route to the same component for maximum accessibility.

## Future Industry Pages

When adding new industry pages:

1. Create component directory: `/components/{industry}/`
2. Create main page: `/components/{IndustryPage}.tsx`
3. Add routing in `App.tsx`:
   ```typescript
   case 'industries/{industry}':
   case '{industry}':
     return <IndustryPage onNavigate={setCurrentPage} />;
   ```
4. Add to Footer.tsx:
   ```typescript
   const industriesLinks = [
     { id: 'ecommerce', label: 'E-Commerce' },
     { id: 'fashion', label: 'Fashion' },
     { id: '{industry}', label: '{Industry Name}' },
   ];
   ```
5. Create documentation: `/docs/services/{number}-{industry}.md`

## Industry Page Template

Recommended structure (12 sections):
1. Hero
2. Introduction
3. Industry Stats
4. Our Approach
5. Framework (Tabbed)
6. Service Cards (6 cards)
7. ROI Chart
8. Value Chain / Additional Framework
9. Suggested Services
10. Insights
11. Related Services
12. CTA Band

## Cross-Linking Strategy

### Related Services Cards
Each industry page should link to related pages:
- Fashion → Luxury Goods, Retail, Customer Experience
- E-Commerce → Retail, Customer Experience, AI Agents

### Insights Cards
Link to relevant blog posts or thought leadership content

### Suggested Services
Link to capability pages or contact/booking

## Testing Checklist

For each new industry page:
- [ ] Primary URL works (`/industries/{industry}`)
- [ ] Alias URL works (`/{industry}`)
- [ ] Footer link navigates correctly
- [ ] Hero CTA navigates to booking
- [ ] Final CTA navigates to booking
- [ ] All animations trigger on scroll
- [ ] Mobile responsive layout works
- [ ] All images load correctly
- [ ] Typography follows design system
- [ ] Green accent color used consistently

## Active Links Verification

✅ **Verified Active Links:**
- `/ecommerce` → EcommercePage
- `/industries/e-commerce` → EcommercePage
- `/fashion` → FashionPage
- `/industries/fashion` → FashionPage

✅ **Footer Links:**
- Footer → Industries → E-Commerce ✓
- Footer → Industries → Fashion ✓

---

**Last Updated:** February 10, 2026  
**Active Pages:** 2 industry pages (E-Commerce, Fashion)
