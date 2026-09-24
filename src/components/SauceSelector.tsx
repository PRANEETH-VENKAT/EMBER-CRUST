import React, { useState } from 'react';
import { Plus, Minus, Check, Flame, Sparkles } from 'lucide-react';
import { SAUCE_OPTIONS } from '../data/sauces';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../context/CartContext';
import { ChiliPepperIcon } from './SpiceLevelIndicator';

interface SauceSelectorProps {
  className?: string;
  compact?: boolean;
}

export const SauceSelector: React.FC<SauceSelectorProps> = ({
  className = '',
  compact = false,
}) => {
  const { selectedSauces, addSauce, removeSauce } = useCart();
  const [filter, setFilter] = useState<'all' | 'spicy' | 'creamy'>('all');

  const filteredSauces = SAUCE_OPTIONS.filter((sauce) => {
    if (filter === 'spicy') return Boolean(sauce.spiceLevel && sauce.spiceLevel >= 2);
    if (filter === 'creamy') return !sauce.spiceLevel || sauce.spiceLevel <= 1;
    return true;
  });

  const totalSauceCount = Object.values(selectedSauces).reduce((sum, q) => sum + q, 0);

  return (
    <div
      id="additional-sauces-section"
      className={`rounded-2xl border border-[#262626] bg-[#111111] p-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1F1F1F] border border-[#262626] text-[#FFD60A]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bebas text-lg tracking-wide text-[#F5F5F5]">
              ADDITIONAL ARTISANAL SAUCES
            </h3>
            <p className="font-mono text-[10px] text-[#A3A3A3]">
              Wood-fired reductions & handcrafted desi chutneys
            </p>
          </div>
        </div>

        {totalSauceCount > 0 && (
          <span className="anim-scale-in flex items-center gap-1 rounded-full bg-[#FFD60A] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0A0A0A]">
            <Check className="h-3 w-3 stroke-[3]" />
            <span>{totalSauceCount} added</span>
          </span>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 mb-3 border-b border-[#1F1F1F] pb-2 font-mono text-[11px]">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-full px-2.5 py-0.5 transition-colors ${
            filter === 'all'
              ? 'bg-[#FFD60A] text-[#0A0A0A] font-bold'
              : 'text-[#A3A3A3] hover:text-[#F5F5F5]'
          }`}
        >
          All ({SAUCE_OPTIONS.length})
        </button>
        <button
          onClick={() => setFilter('spicy')}
          className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 transition-colors ${
            filter === 'spicy'
              ? 'bg-red-950 text-red-300 border border-red-500/50 font-bold'
              : 'text-[#A3A3A3] hover:text-red-400'
          }`}
        >
          <Flame className="h-3 w-3 text-red-400" />
          <span>Spicy Dips</span>
        </button>
        <button
          onClick={() => setFilter('creamy')}
          className={`rounded-full px-2.5 py-0.5 transition-colors ${
            filter === 'creamy'
              ? 'bg-amber-950 text-amber-300 border border-amber-500/50 font-bold'
              : 'text-[#A3A3A3] hover:text-amber-400'
          }`}
        >
          Mild & Creamy
        </button>
      </div>

      {/* Sauce Options List */}
      <div className="space-y-2.5">
        {filteredSauces.map((sauce) => {
          const qty = selectedSauces[sauce.id] || 0;
          const isSelected = qty > 0;

          return (
            <div
              key={sauce.id}
              className={`flex items-center justify-between gap-3 rounded-xl border p-2.5 transition-colors ${
                isSelected
                  ? 'border-[#FFD60A]/60 bg-[#191919]'
                  : 'border-[#222222] bg-[#0E0E0E] hover:border-[#333333]'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-sora text-xs font-semibold text-[#F5F5F5] truncate">
                    {sauce.name}
                  </h4>
                  {sauce.tag && (
                    <span className="rounded bg-[#1F1F1F] border border-[#2D2D2D] px-1.5 py-0.2 font-mono text-[9px] font-bold text-[#FFD60A]">
                      {sauce.tag}
                    </span>
                  )}
                  {sauce.spiceLevel && (
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: sauce.spiceLevel }).map((_, i) => (
                        <ChiliPepperIcon
                          key={i}
                          className="h-2.5 w-2.5"
                          color={
                            sauce.spiceLevel && sauce.spiceLevel >= 4
                              ? '#EF4444'
                              : '#F59E0B'
                          }
                        />
                      ))}
                    </span>
                  )}
                </div>
                {!compact && (
                  <p className="mt-0.5 font-mono text-[10px] text-[#888888] line-clamp-1">
                    {sauce.description}
                  </p>
                )}
                <span className="mt-1 inline-block font-mono text-xs font-bold text-[#FFD60A]">
                  +{formatCurrency(sauce.price)}
                </span>
              </div>

              {/* Action Controls */}
              <div className="shrink-0">
                {isSelected ? (
                  <div className="flex items-center gap-1.5 rounded-full border border-[#FFD60A]/40 bg-[#0A0A0A] p-0.5 font-mono text-xs font-bold">
                    <button
                      onClick={() => removeSauce(sauce.id)}
                      aria-label={`Decrease ${sauce.name} quantity`}
                      className="press-scale flex h-6 w-6 items-center justify-center rounded-full text-[#A3A3A3] hover:bg-[#262626] hover:text-[#F5F5F5] transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-4 text-center text-[#FFD60A] text-xs">
                      {qty}
                    </span>
                    <button
                      onClick={() => addSauce(sauce.id)}
                      aria-label={`Increase ${sauce.name} quantity`}
                      className="press-scale flex h-6 w-6 items-center justify-center rounded-full bg-[#FFD60A] text-[#0A0A0A] hover:bg-[#E5C009] transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addSauce(sauce.id)}
                    aria-label={`Add ${sauce.name} for ${formatCurrency(sauce.price)}`}
                    className="press-scale flex items-center gap-1 rounded-full border border-[#2B2B2B] bg-[#1C1C1C] px-3 py-1 font-mono text-xs font-semibold text-[#F5F5F5] hover:border-[#FFD60A] hover:bg-[#FFD60A] hover:text-[#0A0A0A] transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SauceSelector;
