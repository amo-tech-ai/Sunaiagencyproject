# Sun AI Agency - Codebase Structure

## 📁 Project Organization

This project follows a modular, component-based architecture for maximum maintainability and reusability.

### Directory Structure

```
/
├── lib/
│   ├── constants.ts          # Shared data constants
│   └── hooks/
│       ├── index.ts           # Hook exports
│       ├── useCarouselNavigation.ts
│       └── useBookingForm.ts
├── components/
│   ├── home/                  # Home page sections
│   │   ├── index.ts
│   │   ├── HeroSection.tsx
│   │   ├── ServicesGrid.tsx
│   │   ├── IndustriesList.tsx
│   │   ├── ProofSection.tsx
│   │   └── CTASection.tsx
│   ├── carousel/              # Carousel components
│   │   ├── index.ts
│   │   ├── StepIndicator.tsx
│   │   ├── PaginationDots.tsx
│   │   ├── CarouselCard.tsx
│   │   └── cards/
│   │       ├── ScopeCard.tsx
│   │       ├── BlueprintCard.tsx
│   │       └── DashboardCard.tsx
│   ├── booking/               # Booking page components
│   │   ├── index.ts
│   │   ├── BookingForm.tsx
│   │   └── BookingInfoItem.tsx
│   ├── shared/                # Reusable components
│   │   ├── index.ts
│   │   └── PageHeader.tsx
│   ├── HomePage.tsx           # Page components
│   ├── SolutionsPage.tsx
│   ├── IndustriesPage.tsx
│   ├── AboutPage.tsx
│   ├── ProcessPage.tsx
│   ├── CaseStudiesPage.tsx
│   ├── BookingPage.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── HowItWorksCarousel.tsx
└── App.tsx                    # Main app component
```

## 🎯 Design Principles

### 1. Single Responsibility
Each component has one clear purpose and responsibility.

### 2. Reusability
Components are designed to be reused across the application with configurable props.

### 3. Separation of Concerns
- **Logic**: Custom hooks (`/lib/hooks`)
- **Data**: Constants (`/lib/constants.ts`)
- **UI**: Components (`/components`)

### 4. Type Safety
All components use TypeScript with proper type definitions.

## 🔧 Component Categories

### Page Components
Full-page views that compose smaller components:
- `HomePage.tsx`
- `SolutionsPage.tsx`
- `IndustriesPage.tsx`
- etc.

### Section Components
Reusable page sections (in `/components/home`):
- `HeroSection` - Hero banner with CTA
- `ServicesGrid` - Service listing grid
- `IndustriesList` - Industry list display
- `ProofSection` - Metrics/social proof
- `CTASection` - Call-to-action section

### Feature Components
Complex, feature-specific components:
- `HowItWorksCarousel` - Interactive 3-screen carousel
- `BookingForm` - Contact form with validation

### Shared Components
Reusable UI components (in `/components/shared`):
- `PageHeader` - Standardized page headers

## 🪝 Custom Hooks

### `useCarouselNavigation`
Manages carousel state and navigation logic.

**Returns:**
- `activeScreen` - Current active screen
- `isTransitioning` - Transition state
- `transitionToScreen()` - Navigate to specific screen
- `navigateToNext()` - Go to next screen
- `navigateToPrevious()` - Go to previous screen
- `setIsPaused()` - Pause/resume auto-advance

### `useBookingForm`
Handles booking form state and submission.

**Returns:**
- `formData` - Current form values
- `handleChange()` - Input change handler
- `handleSubmit()` - Form submission handler
- `resetForm()` - Reset form to initial state

## 📦 Constants

All shared data is centralized in `/lib/constants.ts`:
- `SERVICES` - Service offerings
- `INDUSTRIES` - Supported industries
- `METRICS` - Company metrics
- `SERVICE_OPTIONS` - Booking form service options
- `BOOKING_INFO` - Booking page information

## 🎨 Component Props Pattern

### Optional Props with Defaults
```typescript
interface ComponentProps {
  title?: string;  // Optional
  data: string[];  // Required
}

function Component({ title = 'Default', data }: ComponentProps) {
  // ...
}
```

### Callback Props
```typescript
interface ComponentProps {
  onSubmit?: (data: FormData) => void;
  onCancel?: () => void;
}
```

## 🚀 Usage Examples

### Using Section Components
```typescript
import { HeroSection, ServicesGrid } from './components/home';
import { SERVICES } from './lib/constants';

function Page() {
  return (
    <>
      <HeroSection 
        headline="Custom Headline"
        ctaText="Get Started"
      />
      <ServicesGrid services={SERVICES} />
    </>
  );
}
```

### Using Custom Hooks
```typescript
import { useBookingForm } from './lib/hooks';

function BookingComponent() {
  const { formData, handleChange, handleSubmit } = useBookingForm(
    (data) => console.log('Submitted:', data)
  );
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## ✅ Benefits of This Structure

1. **Maintainability**: Easy to locate and update specific features
2. **Testability**: Isolated components are easier to test
3. **Scalability**: Clear patterns for adding new features
4. **Reusability**: Components can be used across different pages
5. **Type Safety**: TypeScript ensures correctness
6. **Performance**: Modular imports reduce bundle size
7. **Developer Experience**: Clear structure improves onboarding

## 🔄 Migration Notes

All existing functionality has been preserved:
- ✅ No breaking changes
- ✅ All features work identically
- ✅ All props and behaviors maintained
- ✅ Enhanced type safety
- ✅ Improved code organization

## 📝 Best Practices

1. **Import from index files** when possible:
   ```typescript
   // ✅ Good
   import { HeroSection, ServicesGrid } from './components/home';
   
   // ❌ Avoid
   import HeroSection from './components/home/HeroSection';
   import ServicesGrid from './components/home/ServicesGrid';
   ```

2. **Keep components focused**: Each component should do one thing well

3. **Use constants**: Don't hardcode data that might change

4. **Leverage hooks**: Extract complex logic into custom hooks

5. **Type everything**: Use TypeScript interfaces for all props

## 🎯 Production Ready

This codebase is now production-ready with:
- ✅ Clean, modular architecture
- ✅ Type-safe components
- ✅ Reusable patterns
- ✅ Optimized performance
- ✅ Easy to maintain and extend
