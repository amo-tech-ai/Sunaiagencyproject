import { useState, useEffect, useCallback, useRef } from 'react';

type Screen = 'scope' | 'blueprint' | 'dashboard';
type Direction = 'forward' | 'backward';

const SCREENS: Screen[] = ['scope', 'blueprint', 'dashboard'];
const AUTO_ADVANCE_DELAY = 5000;
const TRANSITION_DURATION = 300;

export function useCarouselNavigation(initialScreen: Screen = 'scope') {
  const [activeScreen, setActiveScreen] = useState<Screen>(initialScreen);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<Direction>('forward');
  const [isAnimationTriggered, setIsAnimationTriggered] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const screenIndex = SCREENS.indexOf(activeScreen);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const transitionToScreen = useCallback(
    (targetScreen: Screen, transitionDirection?: Direction) => {
      if (activeScreen === targetScreen || isTransitioning) return;

      // Determine direction
      const currentIndex = SCREENS.indexOf(activeScreen);
      const targetIndex = SCREENS.indexOf(targetScreen);
      const autoDirection = targetIndex > currentIndex ? 'forward' : 'backward';
      
      setDirection(transitionDirection || autoDirection);
      setIsTransitioning(true);

      setTimeout(() => {
        setActiveScreen(targetScreen);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
    },
    [activeScreen, isTransitioning]
  );

  const navigateToNext = useCallback(() => {
    const nextIndex = (screenIndex + 1) % SCREENS.length;
    transitionToScreen(SCREENS[nextIndex], 'forward');
  }, [screenIndex, transitionToScreen]);

  const navigateToPrevious = useCallback(() => {
    const prevIndex = (screenIndex - 1 + SCREENS.length) % SCREENS.length;
    transitionToScreen(SCREENS[prevIndex], 'backward');
  }, [screenIndex, transitionToScreen]);

  // Auto-advance with requestAnimationFrame
  const startAutoAdvance = useCallback(() => {
    clearTimer();
    startTimeRef.current = performance.now();
    pausedTimeRef.current = 0;

    const tick = () => {
      if (isPaused) {
        pausedTimeRef.current = performance.now() - startTimeRef.current;
        return;
      }

      const elapsed = performance.now() - startTimeRef.current;
      
      if (elapsed >= AUTO_ADVANCE_DELAY) {
        navigateToNext();
        startTimeRef.current = performance.now();
        pausedTimeRef.current = 0;
      }

      timerRef.current = requestAnimationFrame(tick);
    };

    timerRef.current = requestAnimationFrame(tick);
  }, [isPaused, navigateToNext, clearTimer]);

  // Resume from paused position
  useEffect(() => {
    if (!isAnimationTriggered) return;

    if (isPaused) {
      clearTimer();
    } else {
      clearTimer();
      startTimeRef.current = performance.now() - pausedTimeRef.current;
      
      const tick = () => {
        const elapsed = performance.now() - startTimeRef.current;
        
        if (elapsed >= AUTO_ADVANCE_DELAY) {
          navigateToNext();
          startTimeRef.current = performance.now();
          pausedTimeRef.current = 0;
        }

        timerRef.current = requestAnimationFrame(tick);
      };

      timerRef.current = requestAnimationFrame(tick);
    }

    return () => clearTimer();
  }, [isPaused, isAnimationTriggered, navigateToNext, clearTimer]);

  // Start auto-advance when animation is triggered
  useEffect(() => {
    if (isAnimationTriggered && !isPaused) {
      startAutoAdvance();
    }

    return () => clearTimer();
  }, [activeScreen, isAnimationTriggered, isPaused, startAutoAdvance, clearTimer]);

  // Handle visibility change (pause when tab is hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handlePause = useCallback((paused: boolean) => {
    setIsPaused(paused);
  }, []);

  const triggerAnimation = useCallback(() => {
    setIsAnimationTriggered(true);
  }, []);

  return {
    activeScreen,
    isTransitioning,
    direction,
    screenIndex,
    screens: SCREENS,
    isAnimationTriggered,
    transitionToScreen,
    navigateToNext,
    navigateToPrevious,
    setIsPaused: handlePause,
    triggerAnimation,
  };
}
