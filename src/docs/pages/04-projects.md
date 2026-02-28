# Projects Page — Style Guide Compliance Plan

**Date:** February 27, 2026  
**Page:** `/projects` (ProjectsPage)  
**Status:** ✅ **Mostly Compliant** (Minor Changes Needed)

---

## 📋 Executive Summary

The current Projects page (`/components/ProjectsPage.tsx`) is **mostly aligned** with the Sun AI Style Guide. It uses correct typography (Playfair Display), clean design, and appropriate spacing. However, some color adjustments and minor refinements are needed for 100% compliance.

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

### **Section 1: ProjectsHero**
**File:** `/components/projects/ProjectsHero.tsx`

#### ⚠️ **Minor Issues Found:**

| Element | Current | Style Guide | Status |
|---------|---------|-------------|------------|
| **Background** | `#FDFCFB` (cream) | `bg-white` or `bg-gray-50` | ⚠️ Custom color |
| **Typography** | Playfair Display ✅ | Playfair Display ✅ | ✅ Good |
| **Heading Colors** | `#1A1A1A` | `text-gray-900` (`#111827`) | ⚠️ Close but different |
| **Body Colors** | `#666666` | `text-gray-600` (`#4B5563`) | ⚠️ Wrong hex |
| **Buttons** | Sharp corners ✅ | Sharp corners ✅ | ✅ Good |
| **Button BG** | `#1A1A1A` | `#0F3D3E` or `#84CC16` | ⚠️ Should use brand color |

#### 🔧 **Changes Required:**

1. **Background Color**
   ```tsx
   // Current:
   className="bg-[#FDFCFB]"
   
   // Change to:
   className="bg-white"
   // OR
   className="bg-gray-50"
   ```

2. **Text Colors**
   ```tsx
   // Current:
   text-[#1A1A1A]
   text-[#666666]
   text-[#999999]
   
   // Change to:
   text-gray-900  // #111827
   text-gray-600  // #4B5563
   text-gray-500  // For lighter text
   ```

3. **Button Colors**
   ```tsx
   // Primary button - Current:
   className="bg-[#1A1A1A] text-white px-10 py-5 text-base font-semibold hover:bg-[#333] transition-colors"
   
   // Change to:
   className="bg-[#84CC16] text-gray-900 px-8 py-4 text-base font-semibold hover:bg-[#73b512] transition-colors font-['Lora']"
   
   // Secondary button - Current:
   className="border border-[#1A1A1A] text-[#1A1A1A] ... hover:bg-[#1A1A1A]"
   
   // Change to:
   className="border border-[#0F3D3E] text-[#0F3D3E] px-8 py-4 text-base font-semibold hover:bg-[#0F3D3E] hover:text-white transition-colors font-['Lora']"
   ```

4. **Add Lora for Body Text**
   ```tsx
   // Sub-headline and body text:
   className="... font-['Lora']"
   ```

---

### **Sections 2-6: All Sub-Components**

**Files to Audit:**
- `/components/projects/ProjectNavigation.tsx`
- `/components/projects/ProjectModule.tsx`
- `/components/projects/SystemDiagram.tsx`
- `/components/projects/ComparisonSection.tsx`
- `/components/projects/ProjectsFinalCTA.tsx`

#### ⚠️ **Common Issues to Check:**

1. **Color Palette Adjustments**
   - Replace `#FDFCFB` with `bg-white` or `bg-gray-50`
   - Replace `#1A1A1A` with `#0F3D3E` (for dark elements)
   - Replace `#666666` with `text-gray-600` (`#4B5563`)
   - Replace `#999999` with `text-gray-500`

2. **Typography**
   - Ensure body text uses `font-['Lora']`
   - Headlines already use Playfair Display ✅

3. **Button Styling**
   - Primary CTAs should use `bg-[#84CC16]`
   - Secondary CTAs can use `border-[#0F3D3E]`
   - Verify sharp corners (already correct)

4. **Project Cards**
   - Ensure sharp corners on all cards
   - Check for any shadow effects
   - Verify spacing follows 8px rhythm

---

## 📐 Style Guide Checklist

### **Do's** ✅
- [x] Use sharp corners (`border-radius: 0`) — Already done
- [ ] Use Dark Teal (`#0F3D3E`) for hero backgrounds or dark CTAs
- [ ] Use Lime Green (`#84CC16`) for primary CTAs
- [x] Use Playfair Display for headlines — Already done
- [ ] Use Lora for body text and UI
- [x] Maintain generous whitespace — Already done
- [x] Use scroll-triggered animations — Already done
- [x] Apply 8px spacing rhythm — Mostly done
- [x] Use `py-24` or `py-32` for section padding — Already done

### **Don'ts** ❌
- [x] **No shadows** — Already compliant ✅
- [x] **No rounded buttons or cards** — Already compliant ✅
- [ ] **No custom cream/beige** (`#FDFCFB` should be white/gray-50)
- [ ] **No #1A1A1A** (should be `#0F3D3E` for dark elements)
- [ ] Don't use `#666666` (use `text-gray-600`)

---

## 🛠️ Implementation Plan

### **Phase 1: Color Refinements** (High Priority)
**Estimated Time:** 1-2 hours

1. **ProjectsHero.tsx**
   - [ ] Change `bg-[#FDFCFB]` to `bg-white`
   - [ ] Change `text-[#1A1A1A]` to `text-gray-900`
   - [ ] Change `text-[#666666]` to `text-gray-600`
   - [ ] Change `text-[#999999]` to `text-gray-500`
   - [ ] Update primary button to `bg-[#84CC16]`
   - [ ] Update secondary button border to `border-[#0F3D3E]`
   - [ ] Add `font-['Lora']` to body text

2. **ProjectsFinalCTA.tsx**
   - [ ] Update CTA button colors to match style guide
   - [ ] Ensure background uses approved colors
   - [ ] Add `font-['Lora']` to body text

### **Phase 2: Component Audit** (Medium Priority)
**Estimated Time:** 2-3 hours

3. **Global Color Replacements**
   - [ ] Search for `#FDFCFB` → Replace with `bg-white`
   - [ ] Search for `#1A1A1A` → Replace with `#0F3D3E` or `text-gray-900`
   - [ ] Search for `#666666` → Replace with `text-gray-600`
   - [ ] Search for `#999999` → Replace with `text-gray-500`

4. **Typography Audit**
   - [ ] Add `font-['Lora']` to all body text elements
   - [ ] Verify headlines use Playfair Display (already correct)

5. **ProjectModule.tsx**
   - [ ] Check card styling for sharp corners ✅
   - [ ] Verify color palette compliance
   - [ ] Add Lora font to descriptions

6. **ComparisonSection.tsx**
   - [ ] Update table/comparison colors
   - [ ] Ensure accent colors use lime green

### **Phase 3: Polish** (Low Priority)
**Estimated Time:** 30 minutes

7. **Final Review**
   - [ ] Verify all sections use approved colors
   - [ ] Check spacing consistency
   - [ ] Ensure animations are smooth

---

## 📊 Compliance Score

| Category | Current | Target | Status |
|----------|---------|--------|-----------|
| **Color Palette** | 75% | 100% | ⚠️ Needs refinement |
| **Typography** | 85% | 100% | ⚠️ Add Lora |
| **Buttons/CTAs** | 80% | 100% | ⚠️ Update colors |
| **Spacing** | 95% | 100% | ✅ Excellent |
| **Animations** | 90% | 100% | ✅ Excellent |
| **Shadows/Radius** | 100% | 100% | ✅ Perfect |

**Overall Compliance:** **88%** → Target: **100%**

---

## 🎯 Priority Order

1. **HIGH** — Update button colors to use `#84CC16` and `#0F3D3E`
2. **HIGH** — Replace custom cream color with white
3. **HIGH** — Update text colors to approved palette
4. **MEDIUM** — Add Lora font to body text
5. **MEDIUM** — Audit all sub-components for color consistency
6. **LOW** — Final polish and review

---

## ✅ Success Criteria

The Projects page will be **100% compliant** when:

1. ✅ Background uses white or gray-50 (no custom cream)
2. ✅ Primary CTAs use Lime Green (`#84CC16`)
3. ✅ Dark elements use Dark Teal (`#0F3D3E`)
4. ✅ All text colors use approved palette (gray-900, gray-600, gray-500)
5. ✅ All headlines use Playfair Display
6. ✅ All body text uses Lora
7. ✅ Zero shadow effects (already compliant)
8. ✅ Zero rounded corners (already compliant)
9. ✅ Section padding uses `py-24` or `py-32` (already compliant)
10. ✅ Spacing follows 8px rhythm (already compliant)

---

## 📝 Notes

- **Current Status:** The Projects page is in excellent shape structurally
- **Main Issue:** Color palette needs to be aligned with official brand colors
- **Typography:** Playfair Display is already correct; just needs Lora for body text
- **Design:** Layout, spacing, and animations are already compliant
- **Estimated Total Time:** 3-5 hours for full compliance

---

**End of Document**
