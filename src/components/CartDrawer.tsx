import React, { useEffect, useRef, useMemo } from 'react';
import {
  X,
  ShoppingBag,
  ArrowRight,
  Trash2,
  Sparkles,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartItem } from './CartItem';
import { SauceSelector } from './SauceSelector';
import { formatCurrency } from '../utils/formatCurrency';
import { useCountUp } from '../hooks/useCountUp';
import { DEFAULT_COUNT_UP_DURATION_MS } from '../utils/constants';
import { useSplit } from '../features/split/SplitContext';
import { PeopleManager } from '../features/split/PeopleManager';

interface CartDrawerProps {
  onCheckout: () => void;
  onBrowseMenu: () => void;
}

/**
 * CartDrawer component providing an accessible sliding drawer containing customer selections.
 * Features keyboard trapping, Escape listener, count-up bill summary, and checkout routing.
 */
export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout, onBrowseMenu }) => {
  const {
    cart,
    totalItems,
    itemsSubtotal,
    saucesSubtotal,
    tax,
    totalPrice,
    isCartOpen,
    closeCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    clearSauces,
  } = useCart();

  const {
    isSplitMode,
    toggleSplitMode,
    people,
    assignToPerson,
    computeSplit,
    getAvatarColor,
    getInitials,
  } = useSplit();

  const splitResult = useMemo(() => {
    if (!isSplitMode) return null;
    return computeSplit(cart, {
      tax,
      deliveryFee: 0,
      saucesSubtotal,
    });
  }, [isSplitMode, computeSplit, cart, tax, saucesSubtotal]);

  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Smoothly count total price using requestAnimationFrame (skips if reduced-motion)
  const animatedTotal = useCountUp(totalPrice, DEFAULT_COUNT_UP_DURATION_MS);
  const animatedItemsSubtotal = useCountUp(itemsSubtotal, DEFAULT_COUNT_UP_DURATION_MS);

  // Close drawer on Escape key press and manage focus
  useEffect(() => {
    if (!isCartOpen) return;

    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen, closeCart]);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-[var(--dur-base)] ease-[var(--ease-out)] ${
        isCartOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      {/* Backdrop overlay fading in/out */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/85 transition-opacity duration-[var(--dur-base)] ease-[var(--ease-out)] ${
          isCartOpen ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Slide-in Drawer Container with pure CSS translateX transform */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-6">
        <div
          ref={drawerRef}
          className={`flex h-full w-screen flex-col border-l border-[#262626] bg-[#0A0A0A] shadow-2xl sm:w-[480px] md:w-[520px] max-w-full transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ willChange: isCartOpen ? 'transform' : 'auto' }}
        >
          {/* Drawer Header */}
          <div className="shrink-0 flex items-center justify-between border-b border-[#262626] px-5 py-4 bg-[#141414]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1F1F1F] border border-[#262626] text-[#FFD60A]">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h2
                  id="cart-drawer-title"
                  className="font-bebas text-2xl tracking-wide text-[#F5F5F5]"
                >
                  YOUR EMBER CART
                </h2>
                <p className="font-mono text-[11px] text-[#A3A3A3]">
                  {totalItems === 1 ? '1 dish selected' : `${totalItems} dishes selected`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={() => {
                    clearCart();
                    clearSauces();
                  }}
                  id="clear-cart-button"
                  title="Clear Cart"
                  className="press-scale rounded-lg p-2 text-[#A3A3A3] transition-colors hover:bg-[#262626] hover:text-rose-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}

              <button
                ref={closeBtnRef}
                onClick={closeCart}
                id="close-cart-drawer"
                aria-label="Close cart drawer"
                className="press-scale rounded-lg p-2 text-[#A3A3A3] transition-colors hover:bg-[#262626] hover:text-[#FFD60A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div
            className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 py-4 overscroll-contain"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#262626 transparent',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {cart.length > 0 ? (
              <div className="space-y-4">
                {/* Split With Friends Toggle Card */}
                <div
                  id="split-friends-toggle-card"
                  className="rounded-xl border border-[#262626] bg-[#141414] p-3.5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                          isSplitMode
                            ? 'bg-[#FFD60A]/10 border-[#FFD60A]/40 text-[#FFD60A]'
                            : 'bg-[#1C1C1C] border-[#2D2D2D] text-[#737373]'
                        }`}
                      >
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-sora text-xs font-bold text-[#F5F5F5] block">
                          Split with friends
                        </span>
                        <span className="font-mono text-[10px] text-[#A3A3A3]">
                          {isSplitMode
                            ? 'Assign dishes to friends & split overhead'
                            : 'Single payer bill'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={isSplitMode}
                      aria-label="Toggle group bill split mode"
                      onClick={toggleSplitMode}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A] ${
                        isSplitMode ? 'bg-[#FFD60A]' : 'bg-[#2D2D2D]'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#0A0A0A] shadow-md ring-0 transition duration-200 ease-in-out ${
                          isSplitMode ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* People Panel (Rendered only when Split Mode is on) */}
                  {isSplitMode && <PeopleManager className="mt-3" />}
                </div>

                {/* Cart Items List */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onIncrease={increaseQty}
                      onDecrease={decreaseQty}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>

                {/* Additional Sauces in Purchase flow */}
                <SauceSelector className="mt-4" />

                <div className="rounded-xl border border-dashed border-[#262626] bg-[#141414] p-3 text-center">
                  <p className="font-mono text-xs text-[#A3A3A3] flex items-center justify-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#FFD60A]" />
                    <span>Dishes prepared fresh in 900° wood ovens</span>
                  </p>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="anim-fade-in flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#141414] border border-[#262626] text-[#FFD60A]">
                  <ShoppingBag className="h-10 w-10 opacity-70" />
                </div>
                <h3 className="mt-5 font-bebas text-2xl tracking-wide text-[#F5F5F5]">
                  YOUR CART IS EMPTY
                </h3>
                <p className="mt-2 max-w-xs font-mono text-xs leading-relaxed text-[#A3A3A3]">
                  You haven't added any wood-fired pizzas or flame-smashed burgers to your
                  order yet.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    onBrowseMenu();
                  }}
                  id="empty-cart-browse-button"
                  className="press-scale mt-6 flex items-center gap-2 rounded-full bg-[#FFD60A] px-6 py-2.5 font-mono text-xs font-bold text-[#0A0A0A] shadow-lg shadow-[#FFD60A]/10 transition-colors hover:bg-[#E5C009] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
                >
                  <span>Browse Menu</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer / Bill Summary & Checkout */}
          {cart.length > 0 && (
            <div className="shrink-0 border-t border-[#262626] bg-[#141414] px-4 sm:px-5 py-4 max-h-[48vh] overflow-y-auto">
              <div className="space-y-2 font-mono text-xs text-[#A3A3A3]">
                <div className="flex justify-between">
                  <span>Dishes Subtotal</span>
                  <span className="font-semibold text-[#F5F5F5]">
                    {formatCurrency(animatedItemsSubtotal)}
                  </span>
                </div>
                {saucesSubtotal > 0 && (
                  <div className="anim-scale-in flex justify-between text-[#FFD60A]">
                    <span>House Sauces & Dips</span>
                    <span className="font-semibold">
                      +{formatCurrency(saucesSubtotal)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Restaurant GST (5%)</span>
                  <span className="font-semibold text-[#F5F5F5]">
                    {formatCurrency(tax)}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Delivery Fee</span>
                  <span className="font-semibold uppercase tracking-wider text-[11px]">
                    FREE
                  </span>
                </div>

                <div className="border-t border-[#262626] pt-2 flex items-baseline justify-between text-sm">
                  <span className="font-sora font-bold text-[#F5F5F5]">Grand Total</span>
                  <span className="font-bebas text-2xl tracking-wide text-[#FFD60A]">
                    {formatCurrency(animatedTotal)}
                  </span>
                </div>

                {/* Live Per-Person Split Summary List */}
                {isSplitMode && splitResult && (
                  <div className="border-t border-[#262626] pt-3 space-y-2 anim-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-sora text-xs font-bold text-[#F5F5F5] flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-[#FFD60A]" />
                        <span>Live Per-Person Shares</span>
                      </span>
                      <span className="font-mono text-[10px] text-[#A3A3A3]">
                        {splitResult.personSplits.length}{' '}
                        {splitResult.personSplits.length === 1 ? 'person' : 'people'}
                      </span>
                    </div>

                    <ul
                      role="list"
                      className="space-y-1.5 max-h-32 overflow-y-auto pr-1"
                      aria-label="Per-person bill split totals"
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#262626 transparent',
                      }}
                    >
                      {splitResult.personSplits.map((p) => {
                        const color = getAvatarColor(p.colorIndex);
                        const initials = getInitials(p.name);
                        return (
                          <li
                            key={p.personId}
                            className="flex items-center justify-between rounded-lg border border-[#222222] bg-[#0E0E0E] px-2.5 py-1.5 font-mono text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                                style={{
                                  backgroundColor: color.bg,
                                  color: color.text,
                                  borderColor: color.border,
                                }}
                                aria-hidden="true"
                              >
                                {initials}
                              </span>
                              <span className="text-[#F5F5F5] font-medium">{p.name}</span>
                              <span className="text-[10px] text-[#737373]">
                                ({p.assignedItems.length}{' '}
                                {p.assignedItems.length === 1 ? 'dish' : 'dishes'})
                              </span>
                            </div>
                            <span className="font-bold text-[#FFD60A]">
                              {formatCurrency(p.total)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    {/* Unassigned Items Warning */}
                    {!splitResult.isFullyAssigned &&
                      splitResult.unassignedItems.length > 0 && (
                        <div className="flex items-center justify-between gap-2 rounded-lg bg-amber-500/10 border border-amber-500/30 p-2 font-mono text-[11px] text-[#FFD60A]">
                          <span className="flex items-center gap-1.5 min-w-0">
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                              {splitResult.unassignedItems.length} unassigned dish
                              {splitResult.unassignedItems.length > 1 ? 'es' : ''}
                            </span>
                          </span>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                splitResult.unassignedItems.forEach((uItem) => {
                                  assignToPerson(uItem.id, people[0]?.id || 'person_you');
                                });
                              }}
                              className="underline text-[10px] text-[#FFD60A] hover:text-[#FFE566] cursor-pointer"
                            >
                              Assign to You
                            </button>
                            <span className="font-semibold text-right">
                              {formatCurrency(splitResult.unassignedTotal)}
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  closeCart();
                  onCheckout();
                }}
                id="cart-checkout-button"
                className="press-scale mt-4 flex w-full items-center justify-between rounded-xl bg-[#FFD60A] px-5 py-3.5 font-mono text-sm font-bold text-[#0A0A0A] shadow-lg shadow-[#FFD60A]/15 transition-colors hover:bg-[#E5C009] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
              >
                <span>Proceed to Checkout</span>
                <span className="flex items-center gap-1.5 font-bebas text-lg">
                  {formatCurrency(animatedTotal)}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>

              <p className="mt-2.5 text-center font-mono text-[10px] text-[#737373]">
                Fast simulated checkout &bull; No payment charged
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
