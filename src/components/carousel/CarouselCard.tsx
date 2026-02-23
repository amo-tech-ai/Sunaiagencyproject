import { useRef } from 'react';
import ScopeCard from './cards/ScopeCard';
import BlueprintCard from './cards/BlueprintCard';
import DashboardCard from './cards/DashboardCard';
import { useSwipeGesture } from '../../lib/hooks/useSwipeGesture';

type Screen = 'scope' | 'blueprint' | 'dashboard';
type Direction = 'forward' | 'backward';

interface CarouselCardProps {
  activeScreen: Screen;
  isTransitioning: boolean;
  direction: Direction;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isVisible?: boolean;
}

export default function CarouselCard({
  activeScreen,
  isTransitioning,
  direction,
  onMouseEnter,
  onMouseLeave,
  onSwipeLeft,
  onSwipeRight,
  isVisible = true,
}: CarouselCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mobile swipe gestures
  useSwipeGesture(containerRef, {
    onSwipeLeft,
    onSwipeRight,
  });

  // Calculate transform based on transition state and direction
  const getTransform = () => {
    if (isTransitioning) {
      // Exiting: slide slightly in opposite direction
      return direction === 'forward' ? '-translate-x-5' : 'translate-x-5';
    }
    return 'translate-x-0';
  };

  const getOpacity = () => {
    return isTransitioning ? 'opacity-0' : 'opacity-100';
  };

  return (
    <div
      ref={containerRef}
      className="relative touch-pan-y"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={`transition-all ${getOpacity()} ${getTransform()}`}
        style={{
          transitionDuration: isTransitioning ? '300ms' : '400ms',
          transitionTimingFunction: isTransitioning
            ? 'cubic-bezier(0.4, 0, 1, 1)' // ease-in for exit
            : 'cubic-bezier(0.16, 1, 0.3, 1)', // smooth ease-out for entry
          willChange: 'transform, opacity',
        }}
      >
        {activeScreen === 'scope' && <ScopeCard />}
        {activeScreen === 'blueprint' && <BlueprintCard />}
        {activeScreen === 'dashboard' && <DashboardCard />}
      </div>
    </div>
  );
}
