import { useRef, useEffect, RefObject } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

interface SwipeConfig {
  minDistance?: number;
  minVelocity?: number;
}

export function useSwipeGesture(
  ref: RefObject<HTMLElement>,
  handlers: SwipeHandlers,
  config: SwipeConfig = {}
) {
  const { minDistance = 50, minVelocity = 0.3 } = config;
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();

      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;
      const deltaTime = touchEndTime - touchStartTime.current;

      // Calculate velocity
      const velocity = Math.abs(deltaX) / deltaTime;

      // Check if horizontal swipe (more horizontal than vertical)
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

      if (isHorizontalSwipe && Math.abs(deltaX) >= minDistance && velocity >= minVelocity) {
        if (deltaX > 0) {
          // Swipe right
          handlers.onSwipeRight?.();
        } else {
          // Swipe left
          handlers.onSwipeLeft?.();
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handlers.onSwipeLeft, handlers.onSwipeRight, minDistance, minVelocity]);
}
