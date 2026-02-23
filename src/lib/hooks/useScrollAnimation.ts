import { useState, useEffect, useRef, RefObject } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}

export function useScrollAnimation(
  options: UseScrollAnimationOptions = {}
): [RefObject<HTMLElement>, boolean] {
  const { threshold = 0.1, triggerOnce = true, rootMargin = '0px 0px -20% 0px' } = options;
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasTriggered.current || !triggerOnce) {
            setIsVisible(true);
            if (triggerOnce) {
              hasTriggered.current = true;
            }
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, triggerOnce, rootMargin]);

  return [elementRef, isVisible];
}
