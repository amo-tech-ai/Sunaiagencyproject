import StepIndicator from './carousel/StepIndicator';
import CarouselCard from './carousel/CarouselCard';
import PaginationDots from './carousel/PaginationDots';
import { useCarouselNavigation } from '../lib/hooks/useCarouselNavigation';
import { useScrollAnimation } from '../lib/hooks/useScrollAnimation';
import { useEffect } from 'react';

const STEP_DATA = [
  {
    number: '01',
    title: 'Scope',
    description:
      'Start your project. Use AI or work with an expert to build a custom scope to share with our engineers.',
    screen: 'scope' as const,
  },
  {
    number: '02',
    title: 'Blueprint',
    description:
      'Receive a detailed technical blueprint with architecture, timeline, milestones, and deliverables.',
    screen: 'blueprint' as const,
  },
  {
    number: '03',
    title: 'Dashboard',
    description:
      'Track progress in real-time. Review deliverables, communicate with your team, and monitor milestones.',
    screen: 'dashboard' as const,
  },
];

export default function HowItWorksCarousel() {
  const {
    activeScreen,
    isTransitioning,
    direction,
    screenIndex,
    screens,
    isAnimationTriggered,
    transitionToScreen,
    navigateToNext,
    navigateToPrevious,
    setIsPaused,
    triggerAnimation,
  } = useCarouselNavigation();

  const [sectionRef, isVisible] = useScrollAnimation({ 
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '0px 0px -20% 0px'
  });

  // Trigger animations when section becomes visible
  useEffect(() => {
    if (isVisible && !isAnimationTriggered) {
      // Start auto-advance after initial scroll animations
      const timer = setTimeout(() => {
        triggerAnimation();
      }, 1200); // After all scroll animations complete

      return () => clearTimeout(timer);
    }
  }, [isVisible, isAnimationTriggered, triggerAnimation]);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsPaused(true);
    }
  }, [setIsPaused]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      navigateToNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navigateToPrevious();
    }
  };

  const handleDotClick = (index: number) => {
    transitionToScreen(screens[index]);
  };

  return (
    <section
      ref={sectionRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 border-t border-gray-200"
      role="region"
      aria-label="Project workflow carousel"
      aria-live="polite"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column */}
        <div className="lg:col-span-5">
          {/* Eyebrow with scroll animation */}
          <div
            className="overflow-hidden"
            style={{
              transitionDelay: isVisible ? '200ms' : '0ms',
            }}
          >
            <p
              className={`text-xs tracking-wider text-orange-600 mb-6 uppercase transition-all duration-500 ease-out ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
            >
              How it works
            </p>
          </div>

          {/* Headline with scroll animation */}
          <div
            className="overflow-hidden"
            style={{
              transitionDelay: isVisible ? '300ms' : '0ms',
            }}
          >
            <h2
              className={`text-4xl md:text-5xl lg:text-6xl tracking-tight mb-12 transition-all duration-500 ease-out ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
            >
              The smarter way to build your startup
            </h2>
          </div>

          {/* Steps List with scroll animation */}
          <div
            className="overflow-hidden"
            style={{
              transitionDelay: isVisible ? '400ms' : '0ms',
            }}
          >
            <div
              className={`space-y-8 transition-all duration-500 ease-out ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
            >
              {STEP_DATA.map((step) => (
                <StepIndicator
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  isActive={activeScreen === step.screen}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-7">
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-16'
            }`}
            style={{
              transitionDelay: isVisible ? '500ms' : '0ms',
            }}
          >
            <CarouselCard
              activeScreen={activeScreen}
              isTransitioning={isTransitioning}
              direction={direction}
              isVisible={isVisible}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onSwipeLeft={navigateToNext}
              onSwipeRight={navigateToPrevious}
            />

            <PaginationDots
              totalScreens={screens.length}
              activeIndex={screenIndex}
              onDotClick={handleDotClick}
              screenNames={screens}
            />
          </div>
        </div>
      </div>
    </section>
  );
}