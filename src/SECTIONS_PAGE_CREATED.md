# Sections Page - Archived Content

## ✅ New "Sections" Page Created

A new temporary page has been created to store archived/removed sections from the main website.

**URL:** Navigate to `sections` page  
**Purpose:** Temporary storage for sections removed from active pages

---

## 📋 Moved Section

### INVESTMENT LEVELS - Flexible engagement models ✅

**Original Location:** Home Page V2 (HomePageV2.tsx)  
**New Location:** Sections Page (/sections)

**Content Includes:**
- **Heading:** "INVESTMENT LEVELS"
- **Title:** "Flexible engagement models"
- **Description:** "Choose the partnership level that matches your ambition and timeline"
- **Three Pricing Tiers:**
  1. **Discovery** - For businesses exploring AI opportunities (2-4 weeks)
  2. **Build** - For companies ready to deploy AI systems (8-16 weeks, Most Popular)
  3. **Partnership** - For organizations scaling AI operations (Ongoing)

**Features:**
- ✅ Detailed feature lists for each tier
- ✅ Custom pricing with timeline information
- ✅ CTA buttons linking to booking page
- ✅ "Most Popular" badge on Build tier
- ✅ Hover effects and responsive design
- ✅ Note about customization at bottom

---

## 🗂️ File Structure

### New Files Created:
- `/components/SectionsPage.tsx` - Main sections archive page

### Files Modified:
- `/components/HomePageV2.tsx` - Removed V2PricingSection import and render
- `/App.tsx` - Added route for 'sections' page

### Files Preserved (Not Deleted):
- `/components/homev2/V2PricingSection.tsx` - Still exists, now rendered on Sections page

---

## 📊 Page Structure

### SectionsPage.tsx Layout:

```
┌─────────────────────────────────────┐
│ Page Header                         │
│ "Archived Sections"                 │
│ "Temporarily stored page sections"  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ INVESTMENT LEVELS                   │
│ Flexible engagement models          │
│ ┌────────┬────────┬────────┐       │
│ │Discovery│ Build │Partnership│     │
│ └────────┴────────┴────────┘       │
└─────────────────────────────────────┘
```

---

## 🔗 Navigation

### To Access the Sections Page:
1. Navigate to the page using internal navigation
2. Or directly set URL parameter: `sections`

### From Sections Page:
- Pricing tier CTA buttons link to → `booking` page
- Header and Footer navigation work normally

---

## 📝 Updated Homepage Structure

### Home Page V2 (12 Sections):

1. ✅ **V2Hero** - Hero section with CTA
2. ✅ **V2ValueSection** - Ongoing support model
3. ✅ **V2MetricsSection** - Large outcome numbers
4. ✅ **V2HighlightCards** - 2024 highlights data cards
5. ✅ **V2CapabilityFramework** - Strategic diagram
6. ✅ **V2AIMaturityFramework** - BCG-style cards
7. ✅ **V2IndustriesStrip** - Industry tiles
8. ✅ **V2ServicesGrid** - Service offerings
9. ✅ **V2CreativeServices** - Creative services slider
10. ✅ **V2HowItWorks** - Animated timeline
11. ✅ **V2ProjectForm** - Start project form
12. ✅ **V2FinalCTA** - Final call-to-action

**Removed from Homepage:**
- ❌ Investment Levels / Pricing Section (moved to /sections)

---

## 🎨 Design Consistency

The Sections page maintains the same design system as the main site:
- ✅ Same fonts: Playfair Display (headings), Lora (body)
- ✅ Same colors: Cream background (#FDFCFB), lime green accents (#84CC16)
- ✅ Same spacing and layout patterns
- ✅ Same component styling from V2PricingSection

---

## 🔄 How to Restore to Homepage

If you want to bring the Investment Levels section back to the homepage:

### Step 1: Re-import in HomePageV2.tsx
```tsx
import V2PricingSection from './homev2/V2PricingSection';
```

### Step 2: Add to render order
```tsx
{/* Investment / Pricing */}
<V2PricingSection onNavigate={onNavigate} />
```

Place it wherever you'd like in the section order (typically before Project Form).

---

## 🧪 Testing Checklist

### Sections Page
- [ ] Navigate to `/sections` or `sections` page
- [ ] Page header displays "Archived Sections"
- [ ] Investment Levels section renders correctly
- [ ] All three pricing tiers display properly
- [ ] "Most Popular" badge shows on Build tier
- [ ] CTA buttons navigate to booking page
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Hover effects work on cards

### Homepage
- [ ] Navigate to homepage (/)
- [ ] Verify Investment Levels section is removed
- [ ] Page flows from "How It Works" → "Project Form"
- [ ] No broken layouts or spacing issues
- [ ] All remaining sections render correctly

### Navigation
- [ ] Can navigate to sections page
- [ ] Can navigate back from sections page
- [ ] All internal links work correctly

---

## 📦 What's on the Sections Page

| Section | Original Page | Status | Description |
|---------|--------------|--------|-------------|
| **Investment Levels** | Home V2 | ✅ Moved | Flexible engagement models - Discovery, Build, Partnership tiers with pricing |

*More sections can be added here as needed*

---

## 💡 Purpose of Sections Page

The Sections page serves as:
1. **Temporary Storage** - Keep sections that might be reused later
2. **Archive** - Maintain removed content without deleting
3. **Reference** - Easy access to preserved sections
4. **Testing** - Preview sections before re-implementing
5. **Content Management** - Organized approach to content changes

---

## ✅ Status

**MIGRATION COMPLETE** ✅

The "INVESTMENT LEVELS - Flexible engagement models" section has been successfully moved from the Home Page V2 to the new Sections archive page.

**Access:**
- Homepage (/) - Section removed ✓
- Sections Page (/sections) - Section available ✓

**Homepage now has 12 sections instead of 13**

---

*Updated: 2026-02-11*  
*Section Moved: Investment Levels → Sections Page*  
*Status: Complete* ✅
