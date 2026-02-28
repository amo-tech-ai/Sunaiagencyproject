# Process Page — Style Guide Compliance Plan

**Date:** February 27, 2026  
**Page:** `/process` (ProcessPageV12)  
**Status:** ⚠️ **Requires Significant Changes**

---

## 📋 Executive Summary

The current Process page (`/components/process/v12/ProcessPageV12.tsx`) **does not follow the Sun AI Style Guide**. It uses incompatible colors, wrong typography, rounded corners, and shadows—all of which violate the established brand system.

**Style Guide Reference:** `/style-guide`

---

## 🎨 Style Guide Core Requirements

### **Color Palette**
| Color | Hex | Usage |
|-------|-----|-------|
| Dark Teal | `#0F3D3E` | Hero sections, premium backgrounds |
| Lime Green | `#84CC16` | CTAs, accents, highlights |
| White | `#FFFFFF` | Backgrounds, cards |
| Light Gray | `#F3F4F6` | Alternate sections |
| Gray 900 | `#111827` | Primary text, headings |
| Gray 600 | `#4B5563` | Secondary text, body copy |

### **Typography**
- **Headlines:** Playfair Display (400, 600, 700)
- **Body/UI:** Lora (400, 500, 600)
- **Type Scale:** 60px (H1), 48px (H2), 36px (H3), 30px (H4), 20px (Body Large), 16px (Body), 14px (Small)

### **Design Principles**
1. **Calm Luxury** — Editorial-inspired, sophisticated typography
2. **Clean Minimal** — **No shadows, no rounded buttons**
3. **Premium Experience** — Scroll-triggered animations, smooth transitions
4. **Sharp Corners** — All buttons and cards use 0 border-radius
5. **8px Base Unit** — Consistent spacing rhythm
6. **Section Padding** — 96px (`py-24`) or 128px (`py-32`)

---

## 🔍 Current Implementation Review

### **Section 1: ProcessHeroSection**
**File:** `/components/process/v12/ProcessHeroSection.tsx`

#### ❌ **Issues Found:**

| Element | Current | Style Guide | Status |
|---------|---------|-------------|---------|
| **Background** | `#1A1A1A` | `#0F3D3E` (Dark Teal) | ❌ Wrong color |
| **Accent Color** | `#F59E0B` (Orange) | `#84CC16` (Lime Green) | ❌ Wrong color |
| **Buttons** | Rounded corners | **Sharp corners required** | ❌ Has border-radius |
| **Typography** | Mixed (Georgia serif) | Playfair Display + Lora | ❌ Wrong fonts |
| **Stats** | 20+, $2M+, 300% | Outdated | ⚠️ Update needed |
| **Eyebrow** | Uppercase orange | Lime green per guide | ❌ Wrong color |

#### ✅ **What Works:**
- Grid layout (12-column system)
- Content hierarchy
- CTA positioning
- Stats bar structure

#### 🔧 **Changes Required:**

1. **Background Color**
   ```tsx
   // Current:
   className="bg-[#1A1A1A]"
   
   // Change to:
   className="bg-[#0F3D3E]"
   ```

2. **Accent Color (All Orange → Lime)**
   ```tsx
   // Current:
   text-[#F59E0B]
   bg-[#F59E0B]
   
   // Change to:
   text-[#84CC16]
   bg-[#84CC16]
   ```

3. **Typography**
   ```tsx
   // Current:
   style={{ fontFamily: 'Playfair Display, serif' }} // ✅ Correct
   style={{ fontFamily: 'Georgia, serif' }} // ❌ Wrong
   
   // Change to:
   className="font-['Lora']" // For body text
   ```

4. **Buttons — Remove Border Radius**
   ```tsx
   // Current:
   className="bg-[#F59E0B] text-[#1A1A1A] px-10 py-5 ..."
   
   // Change to:
   className="bg-[#84CC16] text-gray-900 px-8 py-4 font-['Lora'] hover:bg-[#73b512] transition-colors"
   // Note: NO rounded-* classes allowed
   ```

5. **Stats Update**
   ```tsx
   // Current:
   { value: '20+', label: 'Projects Delivered' }
   { value: '$2M+', label: 'Monthly GMV' }
   { value: '300%', label: 'Average ROI' }
   
   // Update to:
   { value: '40+', label: 'Projects Delivered' }
   { value: '$5M+', label: 'Client Revenue Impact' }
   { value: '4.2×', label: 'Average ROI' }
   ```

---

### **Section 2: PhaseCardsSection**
**File:** `/components/process/v12/PhaseCardsSection.tsx`

#### ❌ **Issues Found:**

| Element | Current | Style Guide | Status |
|---------|---------|-------------|---------|
| **Section Padding** | `py-24 md:py-32` | ✅ Correct (96px/128px) | ✅ Good |
| **Typography** | Playfair Display | ✅ Correct | ✅ Good |
| **Cards** | Likely rounded | **Sharp corners required** | ⚠️ Check PhaseCard.tsx |
| **Text Color** | `#666666` | `#4B5563` (Gray 600) | ⚠️ Close but wrong hex |
| **Background** | White | ✅ Correct | ✅ Good |

#### 🔧 **Changes Required:**

1. **Text Color**
   ```tsx
   // Current:
   text-[#666666]
   
   // Change to:
   text-gray-600 // or #4B5563
   ```

2. **Check PhaseCard Component**
   - Review `/components/process/v12/PhaseCard.tsx`
   - Ensure NO `rounded-*` classes
   - Ensure NO `shadow-*` classes
   - All borders must be sharp corners

---

### **Section 3: ClientInvolvementMatrix**
**File:** `/components/process/v12/ClientInvolvementMatrix.tsx`

#### ⚠️ **Review Needed:**
- Check for rounded corners
- Check for shadows
- Verify color palette compliance
- Ensure typography uses Playfair Display + Lora

---

### **Section 4: MethodologyComparison**
**File:** `/components/process/v12/MethodologyComparison.tsx`

#### ⚠️ **Review Needed:**
- Check for rounded corners
- Check for shadows
- Verify color palette compliance
- Ensure sharp borders on comparison tables

---

### **Section 5: ProcessCTASection**
**File:** `/components/process/v12/ProcessCTASection.tsx`

#### ⚠️ **Review Needed:**
- Check button styling (must be sharp corners)
- Verify background color (should be `#0F3D3E` if dark, or white)
- Check CTA button color (must be `#84CC16`)
- Verify typography (Playfair Display + Lora)

---

## 📐 Style Guide Checklist

### **Do's** ✅
- [ ] Use sharp corners (`border-radius: 0`)
- [ ] Use Dark Teal (`#0F3D3E`) for hero backgrounds
- [ ] Use Lime Green (`#84CC16`) for CTAs and accents
- [ ] Use Playfair Display for headlines
- [ ] Use Lora for body text and UI
- [ ] Maintain generous whitespace
- [ ] Use scroll-triggered animations (0.8s duration)
- [ ] Apply 8px spacing rhythm
- [ ] Use `py-24` or `py-32` for section padding

### **Don'ts** ❌
- [ ] **No shadows** (`shadow-*` classes not allowed)
- [ ] **No rounded buttons or cards** (`rounded-*` not allowed)
- [ ] **No orange color** (`#F59E0B` violates palette)
- [ ] Don't use more than 3 colors per section
- [ ] Avoid cluttered layouts
- [ ] No random fonts (only Playfair Display + Lora)

---

## 🛠️ Implementation Plan

### **Phase 1: Critical Fixes** (High Priority)
**Estimated Time:** 2-3 hours

1. **ProcessHeroSection.tsx**
   - [ ] Change background from `#1A1A1A` to `#0F3D3E`
   - [ ] Change all orange (`#F59E0B`) to lime (`#84CC16`)
   - [ ] Remove all `rounded-*` classes from buttons
   - [ ] Change Georgia font to Lora for body text
   - [ ] Update stats to current metrics
   - [ ] Add hover transition: `hover:bg-[#73b512]`

2. **Button Audit Across All Sections**
   - [ ] Search for `rounded-` in all process files
   - [ ] Replace with sharp corners (remove border-radius)
   - [ ] Verify all CTAs use `bg-[#84CC16]`

### **Phase 2: Color & Typography Cleanup** (Medium Priority)
**Estimated Time:** 1-2 hours

3. **PhaseCardsSection.tsx**
   - [ ] Change `#666666` to `text-gray-600` (`#4B5563`)
   - [ ] Verify section uses only approved colors

4. **PhaseCard.tsx**
   - [ ] Remove rounded corners from cards
   - [ ] Remove any shadow effects
   - [ ] Ensure borders are sharp
   - [ ] Check icon styling (should use lime or dark teal)

5. **ClientInvolvementMatrix.tsx**
   - [ ] Audit for rounded corners
   - [ ] Remove shadows if present
   - [ ] Verify color compliance

6. **MethodologyComparison.tsx**
   - [ ] Audit for rounded corners
   - [ ] Verify table borders are sharp
   - [ ] Check color palette

7. **ProcessCTASection.tsx**
   - [ ] Remove rounded corners from buttons
   - [ ] Verify background uses approved colors
   - [ ] Check CTA button color is `#84CC16`

### **Phase 3: Animation & Polish** (Low Priority)
**Estimated Time:** 1 hour

8. **Add Scroll-Triggered Animations**
   - [ ] Ensure all sections use `motion.div`
   - [ ] Use 0.8s duration consistently
   - [ ] Add staggered delays (index * 0.1)
   - [ ] Pattern: `initial={{ opacity: 0, y: 40 }}`
   - [ ] Pattern: `animate={{ opacity: 1, y: 0 }}`

9. **Verify Spacing**
   - [ ] Check all sections use `py-24` or `py-32`
   - [ ] Verify 8px spacing rhythm throughout
   - [ ] Check max-width is `max-w-7xl` (1280px)

---

## 📊 Compliance Score

| Category | Current | Target | Status |
|----------|---------|--------|--------|
| **Color Palette** | 40% | 100% | ❌ Needs work |
| **Typography** | 70% | 100% | ⚠️ Close |
| **Buttons/CTAs** | 30% | 100% | ❌ Critical |
| **Spacing** | 85% | 100% | ✅ Good |
| **Animations** | 60% | 100% | ⚠️ Needs polish |
| **Shadows/Radius** | 20% | 100% | ❌ Critical |

**Overall Compliance:** **51%** → Target: **100%**

---

## 🎯 Priority Order

1. **CRITICAL** — Fix button styling (remove rounded corners, change colors)
2. **CRITICAL** — Change hero background from `#1A1A1A` to `#0F3D3E`
3. **CRITICAL** — Change all orange to lime green
4. **HIGH** — Fix typography (Georgia → Lora)
5. **HIGH** — Remove all shadows and rounded corners from cards
6. **MEDIUM** — Update stats to current metrics
7. **MEDIUM** — Verify color compliance in all sections
8. **LOW** — Polish animations and transitions

---

## 🔗 Reference Files

- **Style Guide Page:** `/components/StyleGuidePage.tsx`
- **Current Process Page:** `/components/process/v12/ProcessPageV12.tsx`
- **Hero Section:** `/components/process/v12/ProcessHeroSection.tsx`
- **Phase Cards:** `/components/process/v12/PhaseCardsSection.tsx`
- **Individual Card:** `/components/process/v12/PhaseCard.tsx`
- **Matrix Section:** `/components/process/v12/ClientInvolvementMatrix.tsx`
- **Comparison:** `/components/process/v12/MethodologyComparison.tsx`
- **CTA Section:** `/components/process/v12/ProcessCTASection.tsx`

---

## ✅ Success Criteria

The Process page will be **compliant** when:

1. ✅ All backgrounds use Dark Teal (`#0F3D3E`) or approved colors
2. ✅ All CTAs use Lime Green (`#84CC16`)
3. ✅ Zero instances of rounded corners on buttons or cards
4. ✅ Zero shadow effects
5. ✅ All headlines use Playfair Display
6. ✅ All body text uses Lora
7. ✅ Stats are current and accurate
8. ✅ All sections have scroll animations
9. ✅ Spacing follows 8px rhythm
10. ✅ Section padding uses `py-24` or `py-32`

---

## 📝 Notes

- The newly created `/components/process/ProcessHero.tsx` follows the Sun AI Spruced palette (different from style guide), which uses `#F4F3EE`, `#1E3D36`, `#2E6F5E`, etc. **This needs clarification on which palette to use.**
- The style guide shows Dark Teal + Lime, but HomePageV3 uses Sage + Beige (Spruced)
- **Decision needed:** Should Process page follow Style Guide (Dark Teal/Lime) or HomePageV3 aesthetic (Sage/Beige)?

**Current Recommendation:** Follow the **Style Guide** (`/style-guide`) as it's the documented standard, unless explicitly told to use the Spruced palette instead.

---

**End of Document**
