import React, { useMemo } from 'react';
import {
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCheckout } from './CheckoutContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { MOCK_DELIVERY_FEE, TAX_RATE } from '../../utils/constants';
import { SAUCE_OPTIONS } from '../../data/sauces';
import { getImagePath } from '../../utils/getImagePath';
import { useSplit } from '../split/SplitContext';
import { SplitSummaryCard } from '../split/SplitSummaryCard';
import { SplitPerson } from '../split/splitTypes';

interface ReviewStepProps {
  onClose: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ onClose }) => {
  const {
    cart,
    selectedSauces,
    itemsSubtotal,
    saucesSubtotal,
    increaseQty,
    decreaseQty,
    removeFromCart,
    addSauce,
    removeSauce,
  } = useCart();

  const { goToStep } = useCheckout();
  const { isSplitMode, people, assignments, computeSplit } = useSplit();

  const combinedSubtotal = itemsSubtotal + saucesSubtotal;
  const taxAmount = Math.round(combinedSubtotal * TAX_RATE);
  const deliveryFee = cart.length > 0 ? MOCK_DELIVERY_FEE : 0;
  const grandTotal = combinedSubtotal + taxAmount + deliveryFee;

  const splitResult = useMemo(() => {
    if (!isSplitMode) return null;
    return computeSplit(cart, {
      tax: taxAmount,
      deliveryFee,
      saucesSubtotal,
    });
  }, [isSplitMode, computeSplit, cart, taxAmount, deliveryFee, saucesSubtotal]);

  const hasSauces = Object.values(selectedSauces).some((qty) => qty > 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1A1A1A] border border-[#262626] text-[#FFD60A] mb-4">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h3 className="font-sora text-xl font-bold text-[#F5F5F5]">Your cart is empty</h3>
        <p className="mt-2 max-w-sm font-inter text-sm text-[#A3A3A3]">
          Explore our artisanal wood-fired pizzas and smashed burgers before checking out.
        </p>
        <button
          onClick={onClose}
          className="press-scale mt-6 rounded-full bg-[#FFD60A] px-6 py-2.5 font-mono text-xs font-bold text-[#0A0A0A] hover:bg-[#E5C009] transition-colors"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-[#262626] pb-4">
        <div>
          <h2 className="font-sora text-lg font-bold text-[#F5F5F5]">
            Review Your Order
          </h2>
          <p className="font-mono text-xs text-[#A3A3A3]">
            Verify your dishes and customize quantities before delivery
          </p>
        </div>
        <span className="rounded-full border border-[#262626] bg-[#141414] px-3 py-1 font-mono text-xs text-[#FFD60A]">
          Step 1 of 4
        </span>
      </div>

      {/* Cart Items List */}
      <div className="space-y-3">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#A3A3A3]">
          Selected Dishes ({cart.reduce((acc, item) => acc + item.quantity, 0)})
        </h3>

        <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#262626] bg-[#141414] p-3 transition-colors hover:border-[#383838]"
            >
              {/* Thumbnail & Info */}
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={getImagePath(item.slug)}
                  alt={item.name}
                  className="h-12 w-12 shrink-0 rounded-lg border border-[#262626] object-cover bg-[#0A0A0A]"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <h4 className="truncate font-sora text-sm font-semibold text-[#F5F5F5]">
                    {item.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    <span className="font-mono text-xs text-[#FFD60A]">
                      {formatCurrency(item.price)} each
                    </span>

                    {/* Split assignees badge if split mode is active */}
                    {isSplitMode &&
                      (() => {
                        const assignedIds = assignments[item.id] || [];
                        const assigned = people.filter((p: SplitPerson) =>
                          assignedIds.includes(p.id)
                        );
                        if (assigned.length === 0) {
                          return (
                            <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#FFD60A]">
                              <AlertTriangle className="h-3 w-3" />
                              Unassigned
                            </span>
                          );
                        }
                        return (
                          <span className="font-mono text-[10px] text-[#A3A3A3]">
                            ({assigned.map((p: SplitPerson) => p.name).join(', ')})
                          </span>
                        );
                      })()}
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Subtotal */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center rounded-lg border border-[#262626] bg-[#0A0A0A] p-1">
                  {item.quantity === 1 ? (
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="press-scale flex h-7 w-7 items-center justify-center rounded text-[#A3A3A3] hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => decreaseQty(item.id)}
                      aria-label={`Decrease quantity of ${item.name}`}
                      className="press-scale flex h-7 w-7 items-center justify-center rounded text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                  )}

                  <span className="w-7 text-center font-mono text-xs font-bold text-[#F5F5F5]">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => increaseQty(item.id)}
                    aria-label={`Increase quantity of ${item.name}`}
                    className="press-scale flex h-7 w-7 items-center justify-center rounded text-[#A3A3A3] hover:text-[#FFD60A] transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <span className="w-16 text-right font-mono text-sm font-bold text-[#F5F5F5]">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Sauces Section */}
      {hasSauces && (
        <div className="space-y-2.5 rounded-xl border border-[#262626] bg-[#111111] p-3.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-[#FFD60A]">
              <Sparkles className="h-3.5 w-3.5" />
              House Reduction Sauces &amp; Dips
            </span>
            <span className="font-mono text-xs font-bold text-[#F5F5F5]">
              {formatCurrency(saucesSubtotal)}
            </span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            {SAUCE_OPTIONS.filter((s) => (selectedSauces[s.id] || 0) > 0).map((sauce) => (
              <div
                key={sauce.id}
                className="flex items-center justify-between text-[#A3A3A3]"
              >
                <span className="truncate pr-2">
                  {sauce.name} (x{selectedSauces[sauce.id]})
                </span>
                <div className="flex items-center gap-2">
                  <span>{formatCurrency(sauce.price * selectedSauces[sauce.id])}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => removeSauce(sauce.id)}
                      className="text-[#737373] hover:text-[#F5F5F5] p-0.5"
                      aria-label={`Remove one ${sauce.name}`}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => addSauce(sauce.id)}
                      className="text-[#737373] hover:text-[#FFD60A] p-0.5"
                      aria-label={`Add one ${sauce.name}`}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Group Bill Split Breakdown Card (If split mode is active) */}
      {isSplitMode && splitResult && (
        <SplitSummaryCard calculation={splitResult} title="Group Bill Split Breakdown" />
      )}

      {/* Order Pricing Breakdown */}
      <div className="rounded-xl border border-[#262626] bg-[#141414] p-4 space-y-2.5 font-mono text-xs">
        <div className="flex justify-between text-[#A3A3A3]">
          <span>Dishes Subtotal</span>
          <span className="font-semibold text-[#F5F5F5]">
            {formatCurrency(itemsSubtotal)}
          </span>
        </div>

        {saucesSubtotal > 0 && (
          <div className="flex justify-between text-[#A3A3A3]">
            <span>Extra Sauces</span>
            <span className="font-semibold text-[#F5F5F5]">
              {formatCurrency(saucesSubtotal)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-[#A3A3A3]">
          <span>Restaurant GST (5%)</span>
          <span className="font-semibold text-[#F5F5F5]">
            {formatCurrency(taxAmount)}
          </span>
        </div>

        <div className="flex justify-between text-[#A3A3A3]">
          <div className="flex items-center gap-1.5">
            <span>Delivery Fee</span>
            <span className="rounded bg-[#1F1F1F] px-1.5 py-0.5 text-[10px] text-[#A3A3A3]">
              Flat Rate
            </span>
          </div>
          <span className="font-semibold text-[#F5F5F5]">
            {formatCurrency(deliveryFee)}
          </span>
        </div>

        <div className="border-t border-[#262626] pt-2.5 flex items-baseline justify-between">
          <span className="font-sora text-sm font-bold text-[#F5F5F5]">Grand Total</span>
          <span className="font-bebas text-2xl text-[#FFD60A] tracking-wider">
            {formatCurrency(grandTotal)}
          </span>
        </div>
      </div>

      {/* Assurance Tag */}
      <div className="flex items-center gap-2 text-xs font-mono text-[#737373]">
        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
        <span>48-hour cold fermented sourdough baked fresh upon order arrival</span>
      </div>

      {/* Primary Step Actions */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="press-scale rounded-xl border border-[#262626] bg-[#141414] px-5 py-3 font-mono text-xs font-semibold text-[#A3A3A3] hover:border-[#383838] hover:text-[#F5F5F5] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
        >
          Add More Dishes
        </button>

        <button
          type="button"
          id="proceed-to-delivery-btn"
          onClick={() => goToStep(2)}
          className="press-scale flex items-center gap-2 rounded-xl bg-[#FFD60A] px-6 py-3 font-mono text-xs font-bold text-[#0A0A0A] hover:bg-[#E5C009] shadow-md shadow-[#FFD60A]/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
        >
          <span>Proceed to Delivery</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
