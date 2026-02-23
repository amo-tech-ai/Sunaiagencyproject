# Home V2 Visual Design Reference

## Color Palette - V2 Luxury Editorial

### Primary Backgrounds
```
┌─────────────────────────────────────────┐
│  #FDFCFB - Warm Off-White              │  ← Page background
│  Hex: #FDFCFB                          │
│  RGB: 253, 252, 251                    │
│  Use: Main page background             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  #FFFFFF - Pure White                  │  ← Cards, elevated surfaces
│  Hex: #FFFFFF                          │
│  RGB: 255, 255, 255                    │
│  Use: Cards, forms, elevated content   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  #FAF8F6 - Soft Ivory                  │  ← Alternate sections
│  Hex: #FAF8F6                          │
│  RGB: 250, 248, 246                    │
│  Use: Metrics, pricing backgrounds     │
└─────────────────────────────────────────┘
```

### Text Colors
```
███████  #1A1A1A - Deep Charcoal
         Primary headlines, important text
         High contrast, maximum readability

████████  #666666 - Medium Gray
          Body text, descriptions
          Comfortable reading, reduces eye strain

█████████  #999999 - Light Gray
           Labels, metadata, secondary info
           Supporting information
```

### Accent Colors (NEW for V2)
```
██████  #84CC16 - Lime Green
        Primary CTAs, highlights, progress
        Meaning, not decoration
        Hover: #65A30D (darker lime)

░░░░░░  #84CC16/10 - Subtle Lime Tint
        Icon backgrounds, hover effects
        Barely visible, sophisticated
```

### Borders
```
─────────  #EFE9E4 - Warm Beige
           Hex: #EFE9E4
           Cards, dividers, form fields
           Subtle, editorial, not harsh
```

### Dark Sections
```
███████████  #1A1A1A - Near Black
             Footer, final CTA
             High contrast backgrounds

████████████  #FFFFFF - White on Dark
              Text on dark backgrounds
              Maximum contrast

█████████████  #E5E5E5 - Light Gray on Dark
               Secondary text on dark
               Supporting copy
```

---

## Typography System

### Playfair Display (Editorial Headlines)
```
╔════════════════════════════════════════╗
║                                        ║
║   AI acceleration for                  ║
║   intelligent businesses               ║
║                                        ║
╚════════════════════════════════════════╝
Font: Playfair Display
Weight: 700 (Bold)
Size: 60px (desktop) / 48px (mobile)
Line Height: 1.1
Color: #1A1A1A
Use: Hero, section titles
```

### Lora (Narrative Body Text)
```
┌────────────────────────────────────────┐
│ We build production-grade AI systems  │
│ that transform operations, unlock     │
│ revenue, and deliver measurable       │
│ outcomes.                             │
└────────────────────────────────────────┘
Font: Lora (serif)
Weight: 400 (Regular)
Size: 18-20px
Line Height: 1.6
Color: #666666
Use: Intro paragraphs, testimonials
```

### Inter (UI & Body Text)
```
[  Standard body text and UI elements  ]
   Font: Inter (sans-serif)
   Weight: 400 (Regular)
   Size: 16px
   Line Height: 1.6
   Color: #666666
   Use: General body copy, UI text
```

### Inter Uppercase (Labels)
```
[ ONGOING PARTNERSHIP ]
  Font: Inter
  Weight: 500-700
  Size: 10-12px
  Transform: Uppercase
  Tracking: 0.1em (widest)
  Color: #84CC16 or #666666
  Use: Section eyebrows, categories
```

---

## Component Visual Hierarchy

### Section Layout Pattern
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  [ SECTION EYEBROW ]  ← 12px uppercase, lime green     │
│                                                         │
│  Section Title Here   ← 48-60px Playfair, charcoal    │
│                                                         │
│  Supporting paragraph that explains the section        │
│  purpose and provides context. 18-20px Lora.          │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │   Content    │  │   Content    │  │   Content    ││
│  │     Card     │  │     Card     │  │     Card     ││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Card Structure
```
┌───────────────────────────────────────┐
│  bg-white                             │ ← White background
│  border-2 border-[#EFE9E4]           │ ← 2px beige border
│  p-10 lg:p-12                        │ ← Generous padding
│                                       │
│  ╔═══════════════════════════════╗  │
│  ║   Card Content                ║  │
│  ║   - Title (24px Playfair)    ║  │
│  ║   - Description (16px Inter) ║  │
│  ║   - Features list            ║  │
│  ╚═══════════════════════════════╝  │
│                                       │
│  ─────────────────────────────────  │ ← Border divider
│                                       │
│  [ CTA Button ]                      │ ← Action
│                                       │
└───────────────────────────────────────┘
```

### Button Styles
```
PRIMARY (Lime Green):
┌────────────────────────┐
│   Start Project   ✓   │
└────────────────────────┘
bg-[#84CC16]
text-[#1A1A1A]
px-8 py-4
font-medium
NO border-radius
hover:bg-[#65A30D]

SECONDARY (Outlined):
┌────────────────────────┐
│   View How It Works   │
└────────────────────────┘
border-2 border-[#1A1A1A]
text-[#1A1A1A]
px-8 py-4
font-medium
NO border-radius
hover:bg-[#1A1A1A] hover:text-white
```

### Grid Patterns

**2-Column Layout:**
```
┌──────────────────────┐  ┌──────────────────────┐
│                      │  │                      │
│   Content Column     │  │   Visual Column      │
│   - Headline         │  │   - Chart/Image      │
│   - Description      │  │   - Stats            │
│   - Features         │  │   - Diagram          │
│                      │  │                      │
└──────────────────────┘  └──────────────────────┘
```

**3-Column Grid:**
```
┌────────────┐  ┌────────────┐  ┌────────────┐
│   Card 1   │  │   Card 2   │  │   Card 3   │
│            │  │            │  │            │
│  [Icon]    │  │  [Icon]    │  │  [Icon]    │
│  Title     │  │  Title     │  │  Title     │
│  Text      │  │  Text      │  │  Text      │
│            │  │            │  │            │
└────────────┘  └────────────┘  └────────────┘
```

**4-Column Grid:**
```
┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│  Stat  │  │  Stat  │  │  Stat  │  │  Stat  │
│        │  │        │  │        │  │        │
│  3.2x  │  │  87%   │  │ $12M+  │  │  24/7  │
│  ROI   │  │ Faster │  │Revenue │  │Uptime  │
│        │  │        │  │        │  │        │
└────────┘  └────────┘  └────────┘  └────────┘
```

---

## Spacing System

### Section Padding
```
Desktop:  py-24 lg:py-32  (96px - 128px)
Mobile:   py-16           (64px)

Between elements:
Large:    space-y-8       (32px)
Medium:   space-y-6       (24px)
Small:    space-y-4       (16px)
Tight:    space-y-2       (8px)
```

### Container Widths
```
┌────────────────────────────────────────────┐
│  max-w-7xl mx-auto                        │  ← Standard container
│  px-6 lg:px-12                            │  ← Horizontal padding
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Content (1280px max)                │ │
│  └──────────────────────────────────────┘ │
│                                            │
└────────────────────────────────────────────┘

Narrow sections:
┌────────────────────────────────────────────┐
│         max-w-3xl mx-auto                 │  ← Centered content
│                                            │
│      ┌──────────────────────────┐        │
│      │  Content (768px max)     │        │
│      └──────────────────────────┘        │
│                                            │
└────────────────────────────────────────────┘
```

---

## Icon System

### Icon Container Pattern
```
┌────────┐
│        │  bg-[#84CC16]/10
│   ⚡   │  w-16 h-16
│        │  flex items-center justify-center
└────────┘
Icon: Lucide React
Size: w-8 h-8
Color: text-[#84CC16]
```

### Icon Usage Rules
- ✅ Use Lucide React icons only
- ✅ Square containers, not circles
- ✅ Lime green on tinted background
- ✅ Consistent sizing (16px, 20px, 24px, 32px)
- ❌ No filled icons (outline only)
- ❌ No icon fonts (SVG only)

---

## Form Elements

### Input Field
```
┌─────────────────────────────────────────┐
│  Full Name *                            │  ← Label (12px uppercase)
│  ┌───────────────────────────────────┐ │
│  │ John Smith                        │ │  ← Input
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
bg-[#FAF8F6]
border-2 border-[#EFE9E4]
px-4 py-3
focus:border-[#84CC16]
NO border-radius
```

### Dropdown
```
┌─────────────────────────────────────────┐
│  Project Type *                         │
│  ┌───────────────────────────────────┐ │
│  │ Select type              ▼        │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
Same styling as input
Arrow: Native browser select
```

### Textarea
```
┌─────────────────────────────────────────┐
│  Project Description *                  │
│  ┌───────────────────────────────────┐ │
│  │ Tell us about your project...    │ │
│  │                                  │ │
│  │                                  │ │
│  │                                  │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
rows={6}
resize-none
Same border/padding as inputs
```

---

## State Variations

### Hover States
```
Button:
  Normal:  bg-[#84CC16]
  Hover:   bg-[#65A30D]  (darker lime)

Card:
  Normal:  border-[#EFE9E4]
  Hover:   border-[#84CC16]  (lime border)

Link:
  Normal:  text-[#1A1A1A]
  Hover:   text-[#84CC16]  (lime text)
```

### Focus States
```
Input:
  Normal:  border-[#EFE9E4]
  Focus:   border-[#84CC16]  (lime border)
           outline-none
```

### Active States
```
Navigation:
  Normal:  text-[#666666]
  Active:  text-[#84CC16]  (lime)
           border-b-2 border-[#84CC16]
```

---

## Accessibility Guidelines

### Color Contrast Ratios
```
Text on Light Backgrounds:
#1A1A1A on #FDFCFB  →  16.5:1  ✅ AAA
#666666 on #FDFCFB  →   5.8:1  ✅ AA
#84CC16 on #FDFCFB  →   3.1:1  ⚠️  (Decorative only)

Text on Dark Backgrounds:
#FFFFFF on #1A1A1A  →  16.5:1  ✅ AAA
#E5E5E5 on #1A1A1A  →  12.3:1  ✅ AAA

Button Colors:
#1A1A1A on #84CC16  →   8.2:1  ✅ AAA
```

### Focus Indicators
```
All interactive elements MUST have:
- Visible focus state
- 2px minimum border width
- High contrast color (#84CC16)
- NO outline removal
```

---

## Responsive Breakpoints

### Mobile First Approach
```
Base (Mobile):     < 768px
  - Single column layouts
  - Stacked sections
  - Full-width buttons
  - Reduced typography scale

Tablet:            768px - 1024px
  - 2-column grids
  - Moderate spacing
  - Standard typography

Desktop:           > 1024px
  - 3-4 column grids
  - Generous spacing
  - Full typography scale
  - Horizontal layouts
```

### Typography Scale Adjustments
```
Mobile → Desktop:

H1:  36px → 60px  (67% increase)
H2:  28px → 48px  (71% increase)
H3:  24px → 32px  (33% increase)
Body: 16px → 18px (13% increase)
```

---

## Animation Guidelines

### Approved Animations
```
✅ Hover transitions (200-300ms)
✅ Border color changes
✅ Background color fades
✅ Opacity changes
✅ Subtle transforms (scale, translate)

❌ NO spinning loaders
❌ NO bounce effects
❌ NO slide-ins from sides
❌ NO complex keyframes
❌ NO animation libraries
```

### Timing Functions
```
ease-in-out  →  General purpose
ease-out     →  Entrances
ease-in      →  Exits
linear       →  Progress indicators

Duration:
Fast:    100-200ms  (micro-interactions)
Medium:  200-300ms  (hover states)
Slow:    300-500ms  (page transitions)
```

---

## Print This Reference

This visual guide should be printed or kept open while:
- Designing new components
- Reviewing implementation
- QA testing visual consistency
- Onboarding new designers

**Strict adherence to these specifications ensures the luxury editorial aesthetic remains consistent across all V2 components.**

---

**Version:** 1.0  
**Created:** 2026-02-04  
**Design System:** V2 Luxury Editorial
