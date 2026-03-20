# Infographic Services Page V2 — Design & Implementation Plan

**Route:** `/services/infographicv2`  
**Component:** `/components/services/InfographicsPageV2.tsx`  
**Version:** 2.0 · March 2026  
**Status:** Implementation  

---

## Overview

Complete redesign of the infographic services page as a **premium portfolio + pricing page**. Moves away from the v1 "scroll-through-samples" approach to a **bento grid studio page** inspired by Duck Design, Lemonly, and Superside.

Key differences from V1:
- **New brand palette:** Forest `#1B3A2D`, Lime `#7AC143`, Cream `#F5F0E2`, plus warm accents (tan, blush, plum, rust, teal)
- **New typography:** DM Serif Display (headlines) + DM Sans (body) — replacing Playfair Display + Lora
- **Bento grid services section** with 9 unique service cards, each containing a live infographic sample
- **Motion showcase** (dark section with 3 animated preview cards)
- **Interactive showcase** (sage section with browser-frame mockup)
- **Pricing table** (4-column fixed fees)
- **5-step horizontal process timeline** with alternating above/below labels

---

## Color Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| Forest green | `#1B3A2D` | Dark sections, nav, primary text on light |
| Lime | `#7AC143` | CTAs, highlights, active states, accents |
| Lime light | `#EAF3D5` | Light tints, tag backgrounds |
| Cream | `#F5F0E2` | Page base, light section bg |
| Sage | `#D6E8D0` | Mid-tone sections |
| White | `#FFFFFF` | Cards, elevated surfaces |
| Ink | `#1A1A1A` | Body text on light |
| Muted | `#6B7B6E` | Secondary text, captions |
| Border | `#DDD8CC` | Hairline rules, card borders |
| Teal | `#2E6B7A` | Data viz accent |
| Warm tan | `#C9A97D` | Process card bg |
| Blush pink | `#E0CFC8` | Soft card variant |
| Plum | `#3A2850` | Interactive/dark card |
| Rust | `#9E3D20` | Report card bg |

---

## Typography

- **Display/Headlines:** DM Serif Display — italic for emphasis words
- **Body/Labels:** DM Sans 300–600
- **Eyebrows:** DM Sans 600, 10px, 3px letter-spacing, ALL CAPS
- **Card titles:** DM Serif Display, 20–28px
- **Body:** DM Sans 300, 13–15px, line-height 1.65

---

## Section Rhythm

1. Hero (forest dark)
2. Services Bento Grid (cream) — 9 cards with live SVG infographics
3. Motion Showcase (forest dark) — 3-column animated previews
4. Interactive Showcase (sage) — browser-frame mockup
5. Process Timeline (cream) — 5-step horizontal
6. Pricing Table (white) — 4-column
7. CTA (forest dark)

---

## Service Cards (Bento Grid)

| # | Card | Color | Grid Span | Visual |
|---|------|-------|-----------|--------|
| 01 | Process Flow | Warm tan | 4 col, 2 rows | 5-step vertical flow diagram |
| 02 | Motion Graphics | Forest | 8 col, 1 row | Animated bar chart |
| 03 | Interactive | Plum | 6 col, 1 row | Bubble scatter chart |
| 04 | Data Visualization | Teal | 6 col, 1 row | Donut + KPI trio |
| 05 | Architecture Diagrams | Blush | 4 col, 1 row | Radial node map |
| 06 | Timeline | Off-white | 4 col, 1 row | Vertical milestone timeline |
| 07 | Comparison | Lime | 4 col, 1 row | Before/After split panel |
| 08 | Reports & Decks | Rust | 8 col, 1 row | Report cover mockup |
| 09 | Programmatic Video | Sage | 12 col, 1 row | 3-step pipeline |

---

## Pricing Tiers

| Tier | Price | Delivery |
|------|-------|----------|
| Motion Starter | From $1,500 | 5–8 days |
| Data Story (Most Popular) | From $2,500 | 8–12 days |
| Process Explainer | From $4,000 | 10–15 days |
| Diagnostic Video System | Custom | Strategy call |

---

## Implementation Notes

- Uses `react-router` (not `react-router-dom`)
- Motion animations via `motion/react`
- Font import: DM Serif Display + DM Sans via Google Fonts
- Max-width container: 1100px
- Bento grid: CSS grid, 12 columns, 14px gap
- Card border-radius: 14px
- Button border-radius: 3px
- Card hover: translateY(-2px) + shadow deepen
- Responsive: 1280→12col, 1024→8col, 768→2col, 375→1col
