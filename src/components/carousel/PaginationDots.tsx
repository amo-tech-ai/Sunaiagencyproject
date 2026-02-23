interface PaginationDotsProps {
  totalScreens: number;
  activeIndex: number;
  onDotClick: (index: number) => void;
  screenNames: string[];
}

export default function PaginationDots({
  totalScreens,
  activeIndex,
  onDotClick,
  screenNames,
}: PaginationDotsProps) {
  return (
    <div className="flex items-center justify-center gap-3 mt-8" role="tablist">
      {Array.from({ length: totalScreens }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          role="tab"
          aria-label={`Go to ${screenNames[index]} screen`}
          aria-selected={activeIndex === index}
          aria-current={activeIndex === index ? 'true' : 'false'}
          className={`transition-all duration-200 ease-in-out rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-4 ${
            activeIndex === index
              ? 'w-12 h-3 bg-orange-500'
              : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
          }`}
          style={{
            minWidth: activeIndex === index ? '48px' : '44px',
            minHeight: '44px',
            padding: activeIndex === index ? '20.5px 18px' : '20.5px 20.5px',
          }}
        />
      ))}
    </div>
  );
}
