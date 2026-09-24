import React, { useState, useRef } from 'react';
import { Plus, Minus, Check, Sparkles, Star } from 'lucide-react';
import { MenuItem } from '../data/menu';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../context/CartContext';
import { DishImage } from './DishImage';
import { ADDED_CHECKMARK_DURATION_MS } from '../utils/constants';
import { SpiceLevelIndicator, ChiliPepperIcon } from './SpiceLevelIndicator';

interface FoodCardProps {
  item: MenuItem;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * FoodCard component presenting an artisanal menu dish in CodeKrafters black & yellow theme.
 * Features:
 * - 16px card radius with smooth hover lift and golden border accent
 * - Image subtle zoom on hover (transform only)
 * - Price and Rating chips
 * - Clear "Add" button that dynamically morphs into an interactive quantity stepper
 * - Web Animations API fly-to-cart particle (transform + opacity only)
 */
export const FoodCard: React.FC<FoodCardProps> = React.memo(
  ({ item, style, className = '' }) => {
    const { addToCart, increaseQty, decreaseQty, cart, triggerBadgeBump, openCart } =
      useCart();
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const addButtonRef = useRef<HTMLButtonElement>(null);

    // Check quantity in cart
    const cartItem = cart.find((ci) => ci.id === item.id);
    const currentQuantity = cartItem ? cartItem.quantity : 0;

    // Fixed mock rating (4.8 or 4.9) based on item ID hash
    const rating = (4.7 + ((item.id.charCodeAt(0) + item.price) % 3) * 0.1).toFixed(1);

    const triggerFlyAnimation = (sourceEl: HTMLElement) => {
      // Check prefers-reduced-motion
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        triggerBadgeBump();
        return;
      }

      try {
        const btnRect = sourceEl.getBoundingClientRect();
        const cartTarget =
          document.getElementById('cart-badge-count') ||
          document.getElementById('nav-cart-button');

        if (cartTarget) {
          const cartRect = cartTarget.getBoundingClientRect();
          const startX = btnRect.left + btnRect.width / 2;
          const startY = btnRect.top + btnRect.height / 2;
          const endX = cartRect.left + cartRect.width / 2;
          const endY = cartRect.top + cartRect.height / 2;

          const dot = document.createElement('div');
          dot.style.position = 'fixed';
          dot.style.left = `${startX - 5}px`;
          dot.style.top = `${startY - 5}px`;
          dot.style.width = '10px';
          dot.style.height = '10px';
          dot.style.borderRadius = '50%';
          dot.style.backgroundColor = '#FFD400';
          dot.style.boxShadow = '0 0 12px rgba(255, 212, 0, 0.9)';
          dot.style.pointerEvents = 'none';
          dot.style.zIndex = '9999';
          dot.style.willChange = 'transform, opacity';
          document.body.appendChild(dot);

          const deltaX = endX - startX;
          const deltaY = endY - startY;

          const animation = dot.animate(
            [
              { transform: 'translate(0px, 0px) scale(1)', opacity: 1 },
              {
                transform: `translate(${deltaX * 0.45}px, ${deltaY * 0.25 - 35}px) scale(1.3)`,
                opacity: 0.95,
                offset: 0.45,
              },
              { transform: `translate(${deltaX}px, ${deltaY}px) scale(0.3)`, opacity: 0 },
            ],
            {
              duration: 520,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            }
          );

          const cleanup = () => {
            dot.style.willChange = 'auto';
            dot.remove();
            triggerBadgeBump();
          };

          animation.onfinish = cleanup;
          animation.oncancel = cleanup;
        } else {
          triggerBadgeBump();
        }
      } catch {
        triggerBadgeBump();
      }
    };

    const handleFirstAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isAdding) return;
      setIsAdding(true);
      addToCart(item);
      triggerFlyAnimation(e.currentTarget);

      setTimeout(() => {
        setIsAdding(false);
      }, ADDED_CHECKMARK_DURATION_MS);
    };

    const handleIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
      increaseQty(item.id);
      triggerFlyAnimation(e.currentTarget);
    };

    const handleDecrement = () => {
      decreaseQty(item.id);
    };

    return (
      <article
        id={`food-card-${item.id}`}
        style={style}
        className={`group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#222222] bg-[#121212] shadow-md transition-all duration-300 ease-out hover:border-[#FFD400]/70 hover:shadow-[0_8px_30px_rgba(0,0,0,0.7)] ${className}`}
      >
        <div>
          {/* Card Image Container with overflow hidden for subtle hover zoom */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A0A0A]">
            <DishImage
              slug={item.slug}
              name={item.name}
              category={item.category}
              width={400}
              height={300}
              className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />

            {/* Top Badges Header */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
              {/* Dietary Pill Badge */}
              <span
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                  item.dietary === 'veg'
                    ? 'border-emerald-500/40 bg-[#0A0A0A]/90 text-emerald-400'
                    : 'border-rose-500/40 bg-[#0A0A0A]/90 text-rose-400'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    item.dietary === 'veg' ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}
                />
                <span>{item.dietary === 'veg' ? 'Veg' : 'Non-Veg'}</span>
              </span>

              {/* Rating Chip */}
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-1 rounded-full border border-[#333333] bg-[#0A0A0A]/90 px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#FFD400] shadow-sm backdrop-blur-md">
                  <Star className="h-3 w-3 fill-current text-[#FFD400]" />
                  <span>{rating}</span>
                </span>

                {/* Highlight Badge */}
                {item.badge && (
                  <span className="hidden sm:flex items-center gap-1 rounded-full border border-[#FFD400]/40 bg-[#FFD400] px-2.5 py-0.5 text-[11px] font-mono font-bold text-[#0A0A0A] shadow-sm">
                    <Sparkles className="h-3 w-3" />
                    <span>{item.badge}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Street Food or Secondary Badge */}
            {item.isIndianStreetFood && (
              <div className="absolute bottom-3 left-3 pointer-events-none">
                <span className="flex items-center gap-1 rounded-full border border-amber-500/50 bg-[#140F03]/95 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-400 shadow-sm backdrop-blur-sm">
                  <ChiliPepperIcon className="h-3 w-3" color="#F59E0B" />
                  <span>Street Food</span>
                </span>
              </div>
            )}
          </div>

          {/* Content Body */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-sora text-base font-bold text-[#F5F5F5] transition-colors duration-200 group-hover:text-[#FFD400] line-clamp-1">
                {item.name}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-[#A3A3A3] line-clamp-2">
                {item.description}
              </p>
            </div>

            {/* Spice Heat Indicator */}
            {item.spicyLevel && (
              <div className="mt-3.5 flex items-center justify-between rounded-xl border border-[#222222] bg-[#0D0D0D] px-2.5 py-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#737373]">
                    Heat:
                  </span>
                  <SpiceLevelIndicator
                    level={item.spicyLevel}
                    size="sm"
                    showLabel={true}
                  />
                </div>
                {item.isIndianStreetFood && (
                  <span className="font-mono text-[10px] uppercase font-semibold tracking-wider text-amber-400/80">
                    Desi Spice
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card Footer: Price & Morphed Add-to-Cart Stepper */}
        <div className="border-t border-[#222222] bg-[#0E0E0E] px-5 py-3.5 flex items-center justify-between gap-3">
          {/* Price Display */}
          <div>
            <span className="block font-mono text-[10px] uppercase font-semibold tracking-wider text-[#737373]">
              Price
            </span>
            <span className="font-bebas text-2xl text-[#FFD400] tracking-wide">
              {formatCurrency(item.price)}
            </span>
          </div>

          {/* Action Buttons: Add Button vs Quantity Stepper */}
          <div className="flex items-center gap-2">
            {currentQuantity > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openCart();
                }}
                id={`sauces-btn-${item.id}`}
                aria-label={`View options and extra sauces for ${item.name}`}
                className="rounded-full border border-[#2E2E2E] bg-[#161616] px-2.5 py-1.5 font-mono text-[11px] font-semibold text-[#FFD400] hover:border-[#FFD400] hover:bg-[#202020] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FFD400]"
                title="Customize with house dipping sauces"
              >
                + Sauces
              </button>
            )}

            {currentQuantity > 0 ? (
              /* Morphed Interactive Quantity Stepper */
              <div
                className="flex items-center rounded-full border border-[#FFD400] bg-[#FFD400] text-[#0A0A0A] p-0.5 shadow-md shadow-[#FFD400]/10"
                role="group"
                aria-label={`Quantity stepper for ${item.name}`}
              >
                <button
                  type="button"
                  onClick={handleDecrement}
                  aria-label={`Decrease quantity of ${item.name}`}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0A0A0A] text-[#FFD400] transition-transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
                >
                  <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
                </button>

                <span className="min-w-[28px] text-center font-mono text-xs font-black text-[#0A0A0A]">
                  {currentQuantity}
                </span>

                <button
                  type="button"
                  onClick={handleIncrement}
                  aria-label={`Increase quantity of ${item.name}`}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0A0A0A] text-[#FFD400] transition-transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                </button>
              </div>
            ) : (
              /* Clear "Add to Cart" Button */
              <button
                ref={addButtonRef}
                onClick={handleFirstAdd}
                id={`add-to-cart-${item.id}`}
                aria-label={`Add ${item.name} to cart for ${formatCurrency(item.price)}`}
                className={`group/btn relative flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-xs font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] ${
                  isAdding
                    ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-400/20'
                    : 'border border-[#2E2E2E] bg-[#1A1A1A] text-[#F5F5F5] hover:border-[#FFD400] hover:bg-[#FFD400] hover:text-[#0A0A0A]'
                }`}
              >
                {isAdding ? (
                  <span className="flex items-center gap-1">
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>Added!</span>
                  </span>
                ) : (
                  <>
                    <Plus className="h-4 w-4 transition-transform duration-200 group-hover/btn:rotate-90" />
                    <span>Add</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </article>
    );
  }
);

FoodCard.displayName = 'FoodCard';

export default FoodCard;
