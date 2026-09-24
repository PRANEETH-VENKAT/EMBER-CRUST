import React, { useState, useMemo, useEffect, useRef, useDeferredValue } from 'react';
import { Search, RotateCcw, Utensils, X, Sparkles, Globe } from 'lucide-react';
import { MenuItem, Category, SpicePreference } from '../data/menu';
import { FoodCard } from './FoodCard';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { ChiliPepperIcon } from './SpiceLevelIndicator';
import {
  QUICK_SEARCH_PILLS,
  SEARCH_DEBOUNCE_DELAY_MS,
  PLACEHOLDER_CYCLE_INTERVAL_MS,
  MAX_STAGGER_CARDS,
} from '../utils/constants';

interface FoodGridProps {
  items: MenuItem[];
  activeCategory: Category;
  onResetFilter: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSelectCategory?: (category: Category) => void;
  highlightedItemId?: string | null;
}

const ROTATING_PLACEHOLDERS = [
  'Search pizza…',
  'Search burgers…',
  'Search desserts…',
  'Search drinks…',
  'Search artisanal dishes…',
] as const;

/**
 * FoodGrid component presenting dishes, search filtering, dietary toggles, and responsive card grids.
 * Strictly constrained against mobile viewport horizontal overflow.
 */
export const FoodGrid: React.FC<FoodGridProps> = ({
  items,
  activeCategory,
  onResetFilter,
  searchQuery: externalSearchQuery,
  onSearchChange: externalOnSearchChange,
  highlightedItemId,
}) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [spiceFilter, setSpiceFilter] = useState<SpicePreference>('all');
  const [searchAcrossAll, setSearchAcrossAll] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [placeholderIndex, setPlaceholderIndex] = useState<number>(0);
  const [placeholderFading, setPlaceholderFading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Category transition skeleton loader
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 240);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const searchQuery =
    externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = (val: string) => {
    if (externalOnSearchChange) {
      externalOnSearchChange(val);
    } else {
      setInternalSearchQuery(val);
    }
  };

  // Debounce filtering and use useDeferredValue so typing remains responsive at 60fps
  const debouncedQuery = useDebouncedValue(searchQuery, SEARCH_DEBOUNCE_DELAY_MS);
  const deferredQuery = useDeferredValue(debouncedQuery);

  // Rotating placeholder cycle when unfocused and empty
  useEffect(() => {
    if (isSearchFocused || searchQuery.trim().length > 0) return;

    const interval = setInterval(() => {
      setPlaceholderFading(true);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length);
        setPlaceholderFading(false);
      }, 150);
    }, PLACEHOLDER_CYCLE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isSearchFocused, searchQuery]);

  // "/" keyboard shortcut to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (e.key === '/' && !isInput) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchAcrossAll(false);
    }
  }, [searchQuery]);

  const matchesSpice = (
    item: MenuItem,
    filter: 'all' | 'mild' | 'medium' | 'hot'
  ): boolean => {
    if (filter === 'all') return true;
    if (!item.spicyLevel) return false;
    if (filter === 'mild') return item.spicyLevel === 1 || item.spicyLevel === 2;
    if (filter === 'medium') return item.spicyLevel === 3;
    if (filter === 'hot') return item.spicyLevel === 4 || item.spicyLevel === 5;
    return true;
  };

  // Total global matches across all categories using deferredQuery
  const globalMatches = useMemo(() => {
    if (!deferredQuery.trim()) return [];
    const query = deferredQuery.toLowerCase();
    return items.filter((item) => {
      if (dietaryFilter !== 'all' && item.dietary !== dietaryFilter) return false;
      if (!matchesSpice(item, spiceFilter)) return false;
      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    });
  }, [items, deferredQuery, dietaryFilter, spiceFilter]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter (ignored if searchAcrossAll is active)
      if (
        !searchAcrossAll &&
        activeCategory !== 'All' &&
        item.category !== activeCategory
      ) {
        return false;
      }

      // Dietary filter
      const matchesDietary = dietaryFilter === 'all' || item.dietary === dietaryFilter;
      if (!matchesDietary) return false;

      // Spice preference filter
      if (!matchesSpice(item, spiceFilter)) return false;

      // Search query filter using deferredQuery
      if (!deferredQuery.trim()) return true;
      const query = deferredQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    });
  }, [items, activeCategory, dietaryFilter, spiceFilter, deferredQuery, searchAcrossAll]);

  const hasCrossCategoryResults =
    Boolean(searchQuery.trim()) &&
    activeCategory !== 'All' &&
    !searchAcrossAll &&
    globalMatches.length > filteredItems.length;

  return (
    <section
      id="menu"
      className="w-full max-w-full min-w-0 scroll-mt-24 py-8 overflow-x-hidden"
    >
      {/* Category Header & Filter Controls Bar */}
      <div className="mb-6 flex flex-col gap-4 border-b border-[#262626] pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-bebas text-3xl tracking-wide text-[#F5F5F5] sm:text-4xl">
              {searchAcrossAll
                ? 'All Matching Dishes'
                : activeCategory === 'All'
                  ? 'Complete Wood-Fired Menu'
                  : `${activeCategory} Collection`}
            </h2>

            {/* Live Count Badge with quick fade transition */}
            <span
              key={filteredItems.length}
              className="anim-fade-in rounded-full bg-[#1F1F1F] border border-[#262626] px-2.5 py-0.5 font-mono text-xs font-bold text-[#FFD60A] transition-all"
            >
              {filteredItems.length} dishes found
            </span>

            {searchQuery.trim() && (
              <span className="anim-fade-in rounded-full bg-[#FFD60A]/10 border border-[#FFD60A]/30 px-2.5 py-0.5 font-mono text-xs font-medium text-[#FFD60A]">
                Searching: "{searchQuery}"
              </span>
            )}

            {spiceFilter !== 'all' && (
              <span className="anim-fade-in flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 px-2.5 py-0.5 font-mono text-xs font-semibold text-amber-400">
                <ChiliPepperIcon className="h-3 w-3" color="#F59E0B" />
                <span>
                  Heat: {spiceFilter.charAt(0).toUpperCase() + spiceFilter.slice(1)}
                </span>
                <button
                  onClick={() => setSpiceFilter('all')}
                  className="rounded-full p-0.5 text-amber-400/80 hover:text-white transition-colors"
                  title="Clear spice filter"
                  aria-label="Clear spice filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
          <p className="mt-1 font-mono text-xs text-[#A3A3A3]">
            Wood-fired artisanal pizzas, smash burgers, Indian street craft, drinks, and
            desserts.
          </p>
        </div>

        {/* Search, Dietary & Spice Toggle Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Dietary toggle chips */}
          <div className="flex items-center rounded-full border border-[#262626] bg-[#141414] p-1 font-mono text-xs">
            <button
              onClick={() => setDietaryFilter('all')}
              aria-pressed={dietaryFilter === 'all'}
              className={`press-scale rounded-full px-3 py-1 font-semibold transition-colors duration-[var(--dur-fast)] ${
                dietaryFilter === 'all'
                  ? 'bg-[#FFD60A] text-[#0A0A0A]'
                  : 'text-[#A3A3A3] hover:text-[#F5F5F5]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setDietaryFilter('veg')}
              aria-pressed={dietaryFilter === 'veg'}
              className={`press-scale flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-colors duration-[var(--dur-fast)] ${
                dietaryFilter === 'veg'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : 'text-[#A3A3A3] hover:text-emerald-400'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Veg
            </button>
            <button
              onClick={() => setDietaryFilter('non-veg')}
              aria-pressed={dietaryFilter === 'non-veg'}
              className={`press-scale flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-colors duration-[var(--dur-fast)] ${
                dietaryFilter === 'non-veg'
                  ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  : 'text-[#A3A3A3] hover:text-rose-400'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              Non-Veg
            </button>
          </div>

          {/* Spice Preference Filter Toggle */}
          <div
            id="spice-preference-toggle"
            className="flex items-center rounded-full border border-[#262626] bg-[#141414] p-1 font-mono text-xs"
            role="group"
            aria-label="Spice level preference filter"
          >
            <span className="hidden sm:inline-flex items-center gap-1 pl-2.5 pr-1 text-[11px] font-bold uppercase tracking-wider text-[#737373]">
              <ChiliPepperIcon className="h-3 w-3 text-[#FFD60A]" /> Spice:
            </span>
            <button
              onClick={() => setSpiceFilter('all')}
              aria-pressed={spiceFilter === 'all'}
              className={`press-scale rounded-full px-2.5 py-1 font-semibold transition-colors duration-[var(--dur-fast)] ${
                spiceFilter === 'all'
                  ? 'bg-[#FFD60A] text-[#0A0A0A]'
                  : 'text-[#A3A3A3] hover:text-[#F5F5F5]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSpiceFilter((prev) => (prev === 'mild' ? 'all' : 'mild'))}
              aria-pressed={spiceFilter === 'mild'}
              className={`press-scale flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold transition-colors duration-[var(--dur-fast)] ${
                spiceFilter === 'mild'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                  : 'text-[#A3A3A3] hover:text-amber-400'
              }`}
              title="Mild spice preference (1-2 Chilies)"
            >
              <ChiliPepperIcon className="h-3 w-3" color="#F59E0B" />
              <span>Mild</span>
            </button>
            <button
              onClick={() =>
                setSpiceFilter((prev) => (prev === 'medium' ? 'all' : 'medium'))
              }
              aria-pressed={spiceFilter === 'medium'}
              className={`press-scale flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold transition-colors duration-[var(--dur-fast)] ${
                spiceFilter === 'medium'
                  ? 'bg-orange-950 text-orange-300 border border-orange-500/50'
                  : 'text-[#A3A3A3] hover:text-orange-400'
              }`}
              title="Medium spice preference (3 Chilies)"
            >
              <div className="flex -space-x-1">
                <ChiliPepperIcon className="h-3 w-3" color="#FB923C" />
                <ChiliPepperIcon className="h-3 w-3" color="#FB923C" />
              </div>
              <span>Medium</span>
            </button>
            <button
              onClick={() => setSpiceFilter((prev) => (prev === 'hot' ? 'all' : 'hot'))}
              aria-pressed={spiceFilter === 'hot'}
              className={`press-scale flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold transition-colors duration-[var(--dur-fast)] ${
                spiceFilter === 'hot'
                  ? 'bg-red-950 text-red-300 border border-red-500/50'
                  : 'text-[#A3A3A3] hover:text-red-400'
              }`}
              title="Hot spice preference (4-5 Chilies)"
            >
              <div className="flex -space-x-1">
                <ChiliPepperIcon className="h-3 w-3" color="#EF4444" />
                <ChiliPepperIcon className="h-3 w-3" color="#EF4444" />
                <ChiliPepperIcon className="h-3 w-3" color="#EF4444" />
              </div>
              <span>Hot</span>
            </button>
          </div>

          {/* Interactive Search Bar Container */}
          <div
            className={`relative w-full min-w-0 sm:w-72 sm:flex-initial ${
              isSearchFocused ? 'search-active' : ''
            }`}
          >
            {/* Soft yellow focus ring fading in with opacity on pseudo-layer */}
            <div className="search-ring-glow absolute -inset-0.5 rounded-full border border-[#FFD60A]/60 shadow-[0_0_12px_rgba(255,214,10,0.25)] pointer-events-none" />

            {/* Sliding Search Icon */}
            <Search
              className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-all duration-[var(--dur-base)] ease-[var(--ease-out)] ${
                isSearchFocused ? 'translate-x-0.5 text-[#FFD60A]' : 'text-[#A3A3A3]'
              }`}
            />

            <input
              ref={searchInputRef}
              type="text"
              id="menu-search-input"
              aria-label="Search artisanal pizzas, smash burgers, sides, drinks, and desserts"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isSearchFocused
                  ? 'Search dishes, cheese, dough…'
                  : ROTATING_PLACEHOLDERS[placeholderIndex]
              }
              className={`w-full rounded-full border border-[#262626] bg-[#141414] py-2 pl-9 pr-14 font-mono text-xs text-[#F5F5F5] placeholder-[#737373] transition-all duration-[var(--dur-base)] ease-[var(--ease-out)] focus:outline-none focus:border-[#FFD60A] ${
                placeholderFading ? 'placeholder:opacity-0' : 'placeholder:opacity-100'
              }`}
            />

            {/* Yellow underline drawing in from the left via scaleX */}
            <div className="search-underline-bar absolute bottom-0 left-4 right-4 h-0.5 bg-[#FFD60A] rounded-full pointer-events-none" />

            {/* Clear (×) button: fades and scales in when text exists */}
            <button
              onClick={() => {
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              aria-label="Clear search query"
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#262626] transition-all duration-[var(--dur-fast)] ease-[var(--ease-out)] ${
                searchQuery
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-75 pointer-events-none'
              }`}
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {/* "/" Keyboard hint badge: fades out when text or focus exists */}
            <span
              className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded bg-[#262626] border border-[#383838] px-1.5 py-0.5 font-mono text-[10px] text-[#A3A3A3] transition-opacity duration-[var(--dur-fast)] ${
                !isSearchFocused && !searchQuery ? 'opacity-100' : 'opacity-0'
              }`}
            >
              /
            </span>
          </div>
        </div>
      </div>

      {/* Quick Search Suggestions & Cross-Category Alert */}
      <div className="mb-6 flex flex-col gap-2.5 w-full max-w-full min-w-0">
        {/* Quick Search Tag Pills - Contained within mobile boundaries */}
        <div className="w-full max-w-full min-w-0 overflow-hidden">
          <div className="flex w-full max-w-full items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs overscroll-x-contain touch-pan-x">
            <span className="text-[11px] text-[#737373] shrink-0 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[#FFD60A]" /> Popular:
            </span>
            {QUICK_SEARCH_PILLS.map((pill) => (
              <button
                key={pill}
                onClick={() => {
                  setSearchQuery(pill);
                  setSearchAcrossAll(true);
                }}
                className={`press-scale shrink-0 rounded-full border px-2.5 py-1 text-[11px] transition-all duration-[var(--dur-fast)] ${
                  searchQuery.toLowerCase() === pill.toLowerCase()
                    ? 'border-[#FFD60A] bg-[#FFD60A] text-[#0A0A0A] font-bold'
                    : 'border-[#262626] bg-[#141414] text-[#A3A3A3] hover:border-[#FFD60A]/50 hover:text-[#F5F5F5]'
                }`}
              >
                {pill}
              </button>
            ))}
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchAcrossAll(false);
                }}
                className="press-scale shrink-0 flex items-center gap-1 rounded-full border border-[#262626] bg-[#1C1C1C] px-2.5 py-1 text-[11px] text-[#A3A3A3] hover:text-[#F5F5F5]"
              >
                <X className="h-3 w-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Helpful alert if matching dishes exist in other categories */}
        {hasCrossCategoryResults && (
          <div className="anim-fade-in flex items-center justify-between gap-3 rounded-xl border border-[#FFD60A]/30 bg-[#FFD60A]/10 px-4 py-2.5 text-xs font-mono text-[#F5F5F5]">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#FFD60A] shrink-0" />
              <span>
                Found <strong>{globalMatches.length} matching dishes</strong> across the
                full menu.
              </span>
            </div>
            <button
              onClick={() => setSearchAcrossAll(true)}
              className="press-scale underline underline-offset-4 text-[#FFD60A] hover:text-white font-bold"
            >
              View all {globalMatches.length} dishes &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Menu Cards Grid with Skeleton Loading State & Staggered Entrance */}
      {isLoading ? (
        <div
          aria-label="Loading dishes"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#222222] bg-[#121212] overflow-hidden animate-pulse flex flex-col justify-between"
            >
              <div className="aspect-[4/3] bg-[#1A1A1A] w-full" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-[#262626] rounded-md" />
                <div className="h-3 w-full bg-[#1C1C1C] rounded-md" />
                <div className="h-3 w-2/3 bg-[#1C1C1C] rounded-md" />
              </div>
              <div className="border-t border-[#222222] bg-[#0E0E0E] px-5 py-3.5 flex items-center justify-between">
                <div className="h-6 w-16 bg-[#262626] rounded-md" />
                <div className="h-8 w-20 bg-[#262626] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div
          key={`${activeCategory}-${dietaryFilter}-${searchAcrossAll}-${searchQuery ? 'search' : 'all'}`}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredItems.map((item, index) => {
            const isHighlighted = highlightedItemId === item.id;
            return (
              <div
                key={item.id}
                className="anim-card-stagger"
                style={
                  {
                    '--card-index': Math.min(index, MAX_STAGGER_CARDS - 1),
                  } as React.CSSProperties
                }
              >
                <FoodCard
                  item={item}
                  className={
                    isHighlighted
                      ? 'ring-2 ring-[#FFD60A] ring-offset-2 ring-offset-[#0A0A0A]'
                      : ''
                  }
                />
              </div>
            );
          })}
        </div>
      ) : (
        /* Friendly Empty State with smooth fade */
        <div className="anim-fade-in flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#262626] bg-[#141414] py-16 px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1F1F1F] border border-[#262626] text-[#FFD60A] mb-4">
            <Utensils className="h-8 w-8 opacity-60" />
          </div>
          <h3 className="font-bebas text-2xl tracking-wide text-[#F5F5F5] sm:text-3xl">
            NO DISHES FOUND
          </h3>
          <p className="mt-2 max-w-md font-mono text-xs leading-relaxed text-[#A3A3A3]">
            {searchQuery
              ? `We couldn't find any items matching "${searchQuery}" in this category.`
              : 'No dishes are available for the selected dietary filter.'}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery('');
                setDietaryFilter('all');
                setSpiceFilter('all');
                onResetFilter();
              }}
              className="press-scale flex items-center gap-2 rounded-full bg-[#FFD60A] px-5 py-2 font-mono text-xs font-bold text-[#0A0A0A] shadow-md shadow-[#FFD60A]/10 transition-colors hover:bg-[#E5C009]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset All Filters</span>
            </button>

            {hasCrossCategoryResults && (
              <button
                onClick={() => setSearchAcrossAll(true)}
                className="press-scale flex items-center gap-2 rounded-full border border-[#262626] bg-[#1C1C1C] px-5 py-2 font-mono text-xs font-bold text-[#F5F5F5] hover:border-[#FFD60A]"
              >
                <Globe className="h-3.5 w-3.5 text-[#FFD60A]" />
                <span>Search All Categories</span>
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default FoodGrid;
