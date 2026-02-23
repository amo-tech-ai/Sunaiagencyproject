# Fashion Page - BCG Design System Testing Guide

## 🚀 Quick Start Testing

### Step 1: Access the Fashion Page
1. Navigate to your application
2. Click on **Industries** in the footer
3. Click on **Fashion** 
4. OR navigate directly to `/fashion` or `/industries/fashion`

---

## ✅ Visual Testing Checklist

### Hero Section
- [ ] **Background**: Should be CREAM (#F1EEEA), not dark teal
- [ ] **Text**: Should be DARK (#212427), not white
- [ ] **Tag Badge**: Should be lime green (#7EF473) with "FASHION INDUSTRY"
- [ ] **CTA Button**: Should be lime green (#7EF473) with dark text
- [ ] **Image**: Should be visible on right side (desktop) or below (mobile)
- [ ] **NO dark overlay** on the background

**Expected Result**: Clean cream background with dark text, professional appearance

---

### Section 2: Introduction
- [ ] **Background**: White
- [ ] **Text Color**: Muted gray (#696969)
- [ ] **Max Width**: Properly constrained content
- [ ] **Line Height**: Comfortable reading

**Expected Result**: Clean, readable introduction text

---

### Section 3: Industry Stats (Exhibit 1)
- [ ] **Section Background**: White
- [ ] **Card Backgrounds**: Cream (#F1EEEA)
- [ ] **Card Borders**: Light gray (#D4D4D4)
- [ ] **Stat Numbers**: Lime green (#7EF473), large, Playfair Display
- [ ] **Label**: "EXHIBIT 1" in small uppercase
- [ ] **Grid**: 4 columns on desktop, 2 on tablet, 1 on mobile
- [ ] **Additional bullets**: Below stats, properly formatted

**Expected Result**: 4 bordered cards with green numbers, BCG exhibit style

---

### Section 4: Our Approach
- [ ] **Background**: Cream (#F1EEEA)
- [ ] **Green Accent Line**: 64px wide, 4px tall, lime green
- [ ] **Headline**: Large, dark, Playfair Display
- [ ] **Body Text**: Muted gray, Lora font

**Expected Result**: Cream section with green accent line and dark headline

---

### Section 5: Framework (Exhibit 2)
- [ ] **Section Background**: Cream (#F1EEEA)
- [ ] **Label**: "EXHIBIT 2" in small uppercase
- [ ] **Tabs**: 
  - Active tab: Lime green background (#7EF473), dark text
  - Inactive tabs: White background with gray border
- [ ] **Tab Content**: White card with border
- [ ] **Grid**: 4 columns showing framework stages
- [ ] **Numbers**: Green circled numbers (①, ②, ③, ④)

**Expected Result**: Tabbed interface with green active state, switching content works

---

### Section 6: Service Cards
- [ ] **Section Background**: White
- [ ] **Grid**: 2 columns (desktop), 1 column (mobile)
- [ ] **Card Background**: Cream (#F1EEEA)
- [ ] **Card Borders**: Light gray (#D4D4D4)
- [ ] **Faded Number**: Large number in top-right corner (#D4D4D4)
- [ ] **Badges**: Different colors (green, red, dark green, purple)
- [ ] **ROI Metric**: Lime green (#7EF473), large
- [ ] **Hover**: Changes to white background
- [ ] **Feature Tags**: Small bordered tags
- [ ] **Border Separators**: Between sections

**Expected Result**: 6 professional service cards (3 rows × 2 columns) with cream backgrounds

---

### Section 7: ROI Chart (Exhibit 3)
- [ ] **Section Background**: White
- [ ] **Label**: "EXHIBIT 3" in small uppercase
- [ ] **Chart Background**: Cream (#F1EEEA)
- [ ] **Chart Border**: Light gray (#D4D4D4)
- [ ] **Bars**: Horizontal, lime green (#7EF473)
- [ ] **Bar Backgrounds**: White with borders
- [ ] **Animation**: Bars animate on scroll

**Expected Result**: Custom horizontal bar chart with green bars animating in

---

### Section 8: Value Chain (Exhibit 4)
- [ ] **Section Background**: Cream (#F1EEEA)
- [ ] **Label**: "EXHIBIT 4" in small uppercase
- [ ] **Grid**: 3 columns (desktop), 2 (tablet), 1 (mobile)
- [ ] **Cards**: White background with borders
- [ ] **Stage Titles**: Dark text, Playfair Display
- [ ] **Impact Numbers**: Lime green (#7EF473)
- [ ] **Bullet Points**: Green bullets with gray text
- [ ] **Hover**: Light gray background

**Expected Result**: 6 value chain stage cards in 3-column grid

---

### Section 9: Suggested Services
- [ ] **Section Background**: White
- [ ] **Grid**: 4 columns (desktop), 2 (tablet), 1 (mobile)
- [ ] **Card Background**: Cream (#F1EEEA)
- [ ] **Icon Box**: Lime green (#7EF473) square with dark icon
- [ ] **Titles**: Dark, Playfair Display
- [ ] **Descriptions**: Muted gray
- [ ] **Hover**: Changes to white background

**Expected Result**: 4 service cards with green icon boxes

---

### Section 10: Insights Cards
- [ ] **Section Background**: Cream (#F1EEEA)
- [ ] **Grid**: 4 columns (desktop), 2 (tablet), 1 (mobile)
- [ ] **Card Borders**: Light gray (#D4D4D4)
- [ ] **Card Headers**: Gradient backgrounds (rose, green, purple, orange)
- [ ] **Tag Badges**: White background with dark text
- [ ] **Content Area**: White background
- [ ] **Hover**: Border changes to lime green
- [ ] **CTA Link**: "See more insights" with arrow

**Expected Result**: 4 editorial-style insight cards with gradient headers

---

### Section 11: Related Services
- [ ] **Section Background**: Cream (#F1EEEA)
- [ ] **Grid**: 3 columns (desktop), 1 column (mobile)
- [ ] **Card Borders**: Light gray (#D4D4D4)
- [ ] **Gradient Backgrounds**: Amber, green, blue gradients
- [ ] **Tag Badges**: White background in top corner
- [ ] **Titles**: Large white text at bottom
- [ ] **Hover**: Border changes to lime green

**Expected Result**: 3 large gradient cards with white text

---

### Section 12: CTA Section
- [ ] **Background**: Dark green (#0E3E1B)
- [ ] **Text**: White
- [ ] **Headline**: Large, white, Playfair Display
- [ ] **Body**: Lighter white (opacity 90%)
- [ ] **CTA Button**: Lime green (#7EF473) with dark text (#212427)
- [ ] **Hover**: Slightly darker green

**Expected Result**: High-contrast dark green section with lime green button

---

## 🎨 Color Verification

### Primary Colors (Should appear throughout)
1. **#F1EEEA (Cream)** - Section backgrounds, card backgrounds
2. **#FFFFFF (White)** - Section backgrounds, card content areas
3. **#212427 (Dark)** - Headlines, primary text
4. **#696969 (Muted Gray)** - Body text, descriptions
5. **#7EF473 (Lime Green)** - Accents, CTAs, numbers, badges
6. **#D4D4D4 (Border Gray)** - All borders and dividers

### Colors That Should NOT Appear
- ❌ #0F3D3E (old dark teal)
- ❌ #84CC16 (old lime green)
- ❌ #FAF8F6 (old off-white)
- ❌ Any gray-300, gray-500, gray-700, gray-900 (use specific hex values)

---

## 🔧 Interactive Testing

### Framework Tabs
1. Click on "Brand & Style Audit" tab
   - [ ] Tab becomes lime green
   - [ ] Content shows 4 framework stages
   - [ ] Animation is smooth

2. Click on "AI Implementation" tab
   - [ ] Tab becomes lime green, previous tab becomes white
   - [ ] Content changes to implementation stages
   - [ ] Animation is smooth

3. Click on "Measure & Scale" tab
   - [ ] Tab becomes lime green
   - [ ] Content changes to measurement metrics
   - [ ] All content renders correctly

### Hover States
1. Hover over service cards
   - [ ] Background changes from cream to white
   - [ ] Transition is smooth

2. Hover over insight cards
   - [ ] Border changes from gray to lime green
   - [ ] Transition is smooth

3. Hover over related services
   - [ ] Border changes to lime green
   - [ ] Cursor shows pointer

### Button Clicks
1. Click "Explore Fashion AI Solutions" (Hero)
   - [ ] Navigates to booking page

2. Click "Book Your Fashion AI Assessment" (CTA)
   - [ ] Navigates to booking page

3. Click "See more insights" link
   - [ ] Hover effect shows lime green color
   - [ ] Arrow animates on hover

---

## 📱 Responsive Testing

### Desktop (>= 1024px)
- [ ] Hero: 2 columns (text + image)
- [ ] Stats: 4 columns
- [ ] Service Cards: 2 columns
- [ ] Framework: 4 columns per tab
- [ ] Value Chain: 3 columns
- [ ] Suggested Services: 4 columns
- [ ] Insights: 4 columns
- [ ] Related Services: 3 columns

### Tablet (768px - 1023px)
- [ ] Hero: 2 columns or stacked
- [ ] Stats: 2 columns
- [ ] Service Cards: 2 columns
- [ ] Framework: 4 columns (may wrap)
- [ ] Value Chain: 2 columns
- [ ] Suggested Services: 2 columns
- [ ] Insights: 2 columns
- [ ] Related Services: 2-3 columns

### Mobile (< 768px)
- [ ] Hero: 1 column (image below text)
- [ ] Stats: 1 column
- [ ] Service Cards: 1 column
- [ ] Framework: 1 column or 2 columns
- [ ] Value Chain: 1 column
- [ ] Suggested Services: 1 column
- [ ] Insights: 1 column
- [ ] Related Services: 1 column

---

## 🎬 Animation Testing

### Scroll Animations
1. Scroll down page slowly
   - [ ] Each section fades in from bottom (y: 40 to y: 0)
   - [ ] Opacity transitions from 0 to 1
   - [ ] Duration is smooth (0.8s)
   - [ ] Stagger delay works for grid items

2. ROI Chart
   - [ ] Bars animate horizontally when scrolled into view
   - [ ] Animation is smooth and progressive

3. Service Cards
   - [ ] Cards appear sequentially with slight delay
   - [ ] Each card animates individually

### Performance
- [ ] No janky animations
- [ ] Smooth 60fps scrolling
- [ ] No layout shifts
- [ ] Images load progressively

---

## ✅ Final Checklist

### Design System Compliance
- [ ] All colors match BCG palette exactly
- [ ] Typography uses Playfair Display + Lora only
- [ ] No rounded corners anywhere
- [ ] No shadows anywhere
- [ ] Exhibits properly labeled (EXHIBIT 1, 2, 3, 4)
- [ ] Consistent spacing (py-24 lg:py-32)
- [ ] Proper max-width (max-w-7xl)
- [ ] Grid gaps are consistent (gap-8)

### Content & Functionality
- [ ] All text is readable and properly formatted
- [ ] All buttons work and navigate correctly
- [ ] All tabs switch content correctly
- [ ] All hover states work
- [ ] No console errors
- [ ] No missing images
- [ ] All icons render correctly

### Accessibility
- [ ] Sufficient color contrast
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Headings are hierarchical (h1 → h2 → h3)
- [ ] Alt text on images (if applicable)

---

## 🐛 Common Issues to Check

### If colors look wrong:
1. Check Tailwind CSS is compiling correctly
2. Verify color values in component files
3. Clear browser cache
4. Check for CSS conflicts

### If layout breaks:
1. Check responsive classes (lg:, md:, sm:)
2. Verify grid column classes
3. Check max-width containers
4. Test on different screen sizes

### If animations don't work:
1. Check motion/react import
2. Verify useInView hook settings
3. Check initial/animate states
4. Verify transition durations

### If tabs don't switch:
1. Check useState hook
2. Verify button onClick handlers
3. Check activeTab comparison
4. Verify tab content rendering

---

## 📸 Screenshot Comparison

Take screenshots at these key points and compare with BCG reference images:

1. **Hero Section** (full width)
2. **Stats Grid** (Exhibit 1)
3. **Service Cards** (2 cards visible)
4. **Framework Tabs** (active tab view)
5. **ROI Chart** (Exhibit 3)
6. **Full Page Overview** (desktop)
7. **Mobile View** (full page)

---

## ✅ Success Criteria

The Fashion page passes BCG design system compliance if:

✅ **ALL** colors match BCG palette  
✅ **ALL** sections have correct backgrounds  
✅ **ALL** text uses correct colors and fonts  
✅ **ALL** borders use #D4D4D4  
✅ **ALL** green accents use #7EF473  
✅ **ALL** exhibits are properly labeled  
✅ **ALL** animations work smoothly  
✅ **ALL** interactive elements function correctly  
✅ **ALL** hover states work  
✅ **NO** console errors  

---

## 🎯 Final Validation

**Status: READY FOR PRODUCTION** ✅

Once all checkboxes above are marked, the Fashion page is:
- ✅ BCG design system compliant
- ✅ Fully responsive
- ✅ Professionally designed
- ✅ Production ready
- ✅ Performance optimized

**Next Step**: Deploy to production or move on to next page!
