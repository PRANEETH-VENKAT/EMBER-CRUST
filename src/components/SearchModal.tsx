import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  Flame,
  Plus,
  Check,
  Utensils,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { MENU_ITEMS, MenuItem } from '../data/menu';
import { DishImage } from './DishImage';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../context/CartContext';
import { POPULAR_SEARCH_TAGS } from '../utils/constants';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: MenuItem) => void;
  initialQuery?: string;
  onApplyQueryToMenu?: (query: string) => void;
}

/**
 * SearchModal component presenting a command-palette style instant fuzzy search.
 * Features quick tag buttons, dietary filtering, keyboard navigation, and instant cart additions.
 */
export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectItem,
  initialQuery = '',
  onApplyQueryToMenu,
}) => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [selectedDietary, setSelectedDietary] = useState<'all' | 'veg' | 'non-veg'>(
    'all'
  );
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, initialQuery]);

  // Keyboard shortcut listener (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter items based on query and dietary selection
  const results = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      if (selectedDietary !== 'all' && item.dietary !== selectedDietary) {
        return false;
      }

      if (!cleanQuery) return true;

      return (
        item.name.toLowerCase().includes(cleanQuery) ||
        item.description.toLowerCase().includes(cleanQuery) ||
        item.category.toLowerCase().includes(cleanQuery) ||
        (cleanQuery === 'veg' && item.dietary === 'veg') ||
        (cleanQuery === 'non-veg' && item.dietary === 'non-veg') ||
        (cleanQuery === 'spicy' && item.spicyLevel && item.spicyLevel > 0)
      );
    });
  }, [query, selectedDietary]);

  const handleAddToCart = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    addToCart(item);
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  const handleSelect = (item: MenuItem) => {
    onSelectItem(item);
    onClose();
  };

  const handleViewAllInMenu = () => {
    if (onApplyQueryToMenu) {
      onApplyQueryToMenu(query);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:pt-16 bg-black/90 transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-[#262626] bg-[#0A0A0A] shadow-2xl text-[#F5F5F5]"
        onClick={(e) => e.stopPropagation()}
        id="search-modal-container"
      >
        {/* Search Header Bar */}
        <div className="flex items-center gap-3 border-b border-[#262626] px-4 py-3.5 sm:px-6 bg-[#141414]">
          <Search className="h-5 w-5 text-[#FFD60A] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            id="search-modal-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 24 dishes, wood-fired pizzas, smash burgers, sides..."
            className="flex-1 bg-transparent font-mono text-sm sm:text-base text-[#F5F5F5] placeholder-[#737373] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            id="search-modal-close-btn"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1C1C1C] text-[#A3A3A3] hover:bg-[#262626] hover:text-white transition-colors"
            title="Close (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Tags & Dietary Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#262626] bg-[#141414] px-4 py-2.5 sm:px-6 font-mono text-xs">
          {/* Dietary filters */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#737373] mr-1">Filter:</span>
            <button
              onClick={() => setSelectedDietary('all')}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                selectedDietary === 'all'
                  ? 'bg-[#FFD60A] text-[#0A0A0A]'
                  : 'bg-[#1C1C1C] text-[#A3A3A3] hover:text-[#F5F5F5]'
              }`}
            >
              All Dishes
            </button>
            <button
              onClick={() => setSelectedDietary('veg')}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                selectedDietary === 'veg'
                  ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                  : 'bg-[#1C1C1C] text-[#A3A3A3] hover:text-emerald-400'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Veg
            </button>
            <button
              onClick={() => setSelectedDietary('non-veg')}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                selectedDietary === 'non-veg'
                  ? 'bg-rose-950 border border-rose-500/50 text-rose-300'
                  : 'bg-[#1C1C1C] text-[#A3A3A3] hover:text-rose-400'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              Non-Veg
            </button>
          </div>

          <div className="text-[11px] text-[#A3A3A3]">
            <span>{results.length} dishes found</span>
          </div>
        </div>

        {/* Popular Tags Horizontal Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto px-4 py-2 border-b border-[#262626] bg-[#0A0A0A] scrollbar-none font-mono text-[11px]">
          <span className="text-[#737373] shrink-0 font-medium mr-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-[#FFD60A]" /> Popular:
          </span>
          {POPULAR_SEARCH_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="shrink-0 rounded-full border border-[#262626] bg-[#141414] px-2.5 py-0.5 text-[#A3A3A3] hover:border-[#FFD60A]/50 hover:bg-[#FFD60A] hover:text-[#0A0A0A] transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5 divide-y divide-[#262626]">
          {results.length > 0 ? (
            results.map((item) => {
              const isAdded = addedItemIds[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="group flex items-center justify-between gap-4 pt-2.5 first:pt-0 p-2 rounded-xl hover:bg-[#141414] cursor-pointer transition-colors"
                >
                  {/* Image & Title Info */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl overflow-hidden bg-[#141414] border border-[#262626]">
                      <DishImage
                        slug={item.slug}
                        name={item.name}
                        width={64}
                        height={64}
                        isThumbnail
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-sora text-sm font-semibold text-[#F5F5F5] group-hover:text-[#FFD60A] transition-colors truncate">
                          {item.name}
                        </h4>

                        {/* Dietary Badge */}
                        <span
                          className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
                            item.dietary === 'veg'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              item.dietary === 'veg' ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                          />
                          {item.dietary === 'veg' ? 'Veg' : 'Non-Veg'}
                        </span>

                        {/* Spice Level */}
                        {item.spicyLevel && item.spicyLevel > 0 && (
                          <span
                            className="flex items-center text-[#FFD60A] text-[10px]"
                            title={`Spicy level: ${item.spicyLevel}/3`}
                          >
                            {Array.from({ length: item.spicyLevel }).map((_, i) => (
                              <Flame
                                key={`${item.id}-flame-${i}`}
                                className="h-3 w-3 fill-[#FFD60A]"
                              />
                            ))}
                          </span>
                        )}
                      </div>

                      <p className="font-mono text-xs text-[#A3A3A3] line-clamp-1 mt-0.5">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="rounded bg-[#1C1C1C] border border-[#262626] px-1.5 py-0.5 font-mono text-[10px] text-[#A3A3A3]">
                          {item.category}
                        </span>
                        <span className="font-bebas text-base text-[#FFD60A]">
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => handleAddToCart(e, item)}
                      id={`search-add-btn-${item.id}`}
                      className={`flex h-9 items-center gap-1.5 rounded-xl px-3 font-mono text-xs font-semibold transition-all ${
                        isAdded
                          ? 'bg-emerald-500 text-[#0A0A0A] font-bold'
                          : 'bg-[#FFD60A] text-[#0A0A0A] font-bold hover:bg-[#E5C009] active:scale-95 shadow-md shadow-[#FFD60A]/10'
                      }`}
                      title="Add to order"
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#141414] text-[#737373] mb-3">
                <Utensils className="h-6 w-6 text-[#FFD60A]" />
              </div>
              <h4 className="font-sora text-sm font-semibold text-[#F5F5F5]">
                No dishes found for "{query}"
              </h4>
              <p className="font-mono text-xs text-[#A3A3A3] mt-1 max-w-sm">
                Try searching for pizza, smash burger, fries, wings, cold brew, or
                cheesecake.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {POPULAR_SEARCH_TAGS.slice(0, 4).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="rounded-full bg-[#141414] border border-[#262626] px-3 py-1 font-mono text-xs text-[#FFD60A] hover:bg-[#FFD60A] hover:text-[#0A0A0A] transition-colors"
                  >
                    Try "{tag}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info & Jump to menu button */}
        {results.length > 0 && query.trim() && (
          <div className="flex items-center justify-between border-t border-[#262626] bg-[#141414] px-4 py-3 sm:px-6">
            <span className="font-mono text-xs text-[#A3A3A3]">
              Click any dish to inspect, or add directly to cart
            </span>
            <button
              onClick={handleViewAllInMenu}
              className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#FFD60A] hover:underline transition-colors"
            >
              <span>Filter menu grid by "{query}"</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
