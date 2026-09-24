import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Pizza,
  Sandwich,
  Utensils,
  Wine,
  CakeSlice,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CATEGORIES, Category } from '../data/menu';
import { useSlidingIndicator } from '../hooks/useSlidingIndicator';

interface CategoryFilterProps {
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
  categoryCounts: Record<string, number>;
}

const CATEGORY_ICONS: Record<Category, React.ComponentType<{ className?: string }>> = {
  All: Sparkles,
  Pizza: Pizza,
  Burgers: Sandwich,
  Sides: Utensils,
  Drinks: Wine,
  Desserts: CakeSlice,
};

/**
 * CategoryFilter component providing horizontal scrollable category pills with an animated sliding indicator.
 * Contained strictly to avoid horizontal window overflow on mobile screens.
 */
export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Single sliding yellow indicator pill using transform: translateX
  const { indicatorStyle, isReady } = useSlidingIndicator(
    scrollContainerRef,
    activeCategory
  );

  const checkScrollability = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => checkScrollability();
    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkScrollability);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [checkScrollability]);

  const scrollByAmount = (distance: number) => {
    scrollContainerRef.current?.scrollBy({ left: distance, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full max-w-full min-w-0 overflow-hidden">
      {/* Left Scroll Navigation Button */}
      {canScrollLeft && (
        <div className="pointer-events-none absolute left-0 top-0 bottom-3 z-20 hidden sm:flex items-center pr-6 bg-gradient-to-r from-[#0A0A0A] to-transparent">
          <button
            type="button"
            onClick={() => scrollByAmount(-220)}
            aria-label="Scroll categories left"
            className="press-scale pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#262626] bg-[#141414] text-[#F5F5F5] shadow-lg transition-all duration-[var(--dur-fast)] hover:border-[#FFD60A] hover:bg-[#FFD60A] hover:text-[#0A0A0A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Categories chips container - Contained within mobile boundaries */}
      <div
        ref={scrollContainerRef}
        id="category-chips-container"
        className="relative flex w-full max-w-full min-w-0 items-center justify-start lg:justify-center gap-2.5 overflow-x-auto pb-3 pt-1 scroll-smooth overscroll-x-contain touch-pan-x select-none"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#262626 transparent',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Single Yellow Sliding Active Pill Indicator */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1 h-[calc(100%-16px)] rounded-full bg-[#FFD60A] shadow-md shadow-[#FFD60A]/15 transition-all duration-[var(--dur-base)] ease-[var(--ease-out)]"
          style={{
            transform: indicatorStyle.transform,
            width: indicatorStyle.width,
            opacity: isReady ? 1 : 0,
            willChange: 'transform',
          }}
        />

        {CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category];
          const isActive = activeCategory === category;
          const count = categoryCounts[category] || 0;

          return (
            <button
              key={category}
              id={`category-tab-${category.toLowerCase()}`}
              data-indicator-id={category}
              onClick={() => onSelectCategory(category)}
              aria-pressed={isActive}
              className={`press-scale relative z-10 group flex shrink-0 items-center gap-2 rounded-full px-4 py-2 font-mono text-xs font-bold transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A] ${
                isActive
                  ? 'text-[#0A0A0A]'
                  : 'border border-[#262626] bg-[#141414] text-[#A3A3A3] hover:border-[#FFD60A]/50 hover:bg-[#1A1A1A] hover:text-[#F5F5F5]'
              }`}
            >
              <Icon
                className={`h-4 w-4 transition-colors duration-[var(--dur-fast)] ${
                  isActive ? 'text-[#0A0A0A]' : 'text-[#FFD60A]'
                }`}
              />
              <span className="whitespace-nowrap">{category}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-mono transition-colors duration-[var(--dur-fast)] ${
                  isActive
                    ? 'bg-black/20 text-[#0A0A0A]'
                    : 'bg-[#262626] text-[#A3A3A3] group-hover:text-[#F5F5F5]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Scroll Navigation Button */}
      {canScrollRight && (
        <div className="pointer-events-none absolute right-0 top-0 bottom-3 z-20 hidden sm:flex items-center pl-6 bg-gradient-to-l from-[#0A0A0A] to-transparent">
          <button
            type="button"
            onClick={() => scrollByAmount(220)}
            aria-label="Scroll categories right"
            className="press-scale pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#262626] bg-[#141414] text-[#F5F5F5] shadow-lg transition-all duration-[var(--dur-fast)] hover:border-[#FFD60A] hover:bg-[#FFD60A] hover:text-[#0A0A0A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
