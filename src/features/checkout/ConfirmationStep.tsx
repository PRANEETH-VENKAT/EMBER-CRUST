import React, { useState, useMemo } from 'react';
import { CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { useCheckout } from './CheckoutContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { MOCK_DELIVERY_FEE, TAX_RATE } from '../../utils/constants';
import { OrderTracking } from './OrderTracking';
import { useSplit } from '../split/SplitContext';

interface ConfirmationStepProps {
  onFinish: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ onFinish }) => {
  const { state, resetCheckout } = useCheckout();
  const { cart, selectedSauces, itemsSubtotal, saucesSubtotal, clearCart, clearSauces } =
    useCart();
  const [showReceipt, setShowReceipt] = useState<boolean>(false);

  const { orderResult, deliveryDetails, paymentMethod, paymentDetails } = state;
  const { isSplitMode, computeSplit } = useSplit();

  const combinedSubtotal = itemsSubtotal + saucesSubtotal;
  const taxAmount = Math.round(combinedSubtotal * TAX_RATE);
  const deliveryFee = MOCK_DELIVERY_FEE;
  const grandTotal = combinedSubtotal + taxAmount + deliveryFee;

  const orderId = orderResult?.orderId || 'EC-WOODFIRED-101';

  const splitResult = useMemo(() => {
    if (!isSplitMode) return null;
    return computeSplit(cart, {
      tax: taxAmount,
      deliveryFee,
      saucesSubtotal,
    });
  }, [isSplitMode, computeSplit, cart, taxAmount, deliveryFee, saucesSubtotal]);

  const handleBackToMenu = () => {
    clearCart();
    clearSauces();
    resetCheckout();
    onFinish();
  };

  const itemsSummary =
    cart.length > 0
      ? cart.map((i) => `${i.name} (x${i.quantity})`).join(', ')
      : 'Wood-Fired Artisanal Selection';

  return (
    <div className="space-y-6 text-left">
      {/* Live Order Tracking 4-Stage Stepper View */}
      <OrderTracking
        orderId={orderId}
        deliveryAddress={deliveryDetails}
        totalAmount={grandTotal}
        itemsSummary={itemsSummary}
        onBackToMenu={handleBackToMenu}
        showBackToMenu={false}
        splitResult={splitResult}
      />

      {/* Collapsible Order Receipt & Payment Summary */}
      <div className="rounded-xl border border-[#262626] bg-[#141414] overflow-hidden">
        <button
          type="button"
          onClick={() => setShowReceipt((prev) => !prev)}
          className="w-full flex items-center justify-between p-4 font-mono text-xs text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors"
          aria-expanded={showReceipt}
        >
          <span className="flex items-center gap-2 font-semibold uppercase tracking-wider">
            <span>Receipt Details &amp; Payment</span>
            <span className="font-bold text-[#FFD60A] font-mono normal-case">
              ({formatCurrency(grandTotal)})
            </span>
          </span>
          <div className="flex items-center gap-1 text-[#737373]">
            <span>{showReceipt ? 'Hide' : 'View'}</span>
            {showReceipt ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </button>

        {showReceipt && (
          <div className="border-t border-[#222222] p-4 pt-3 font-mono text-xs space-y-3 anim-fade-in">
            {/* Ordered Dishes */}
            <div className="space-y-1.5 text-[#A3A3A3]">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="truncate pr-2">
                    {item.name}{' '}
                    <strong className="text-[#F5F5F5] font-normal">
                      x{item.quantity}
                    </strong>
                  </span>
                  <span className="text-[#F5F5F5]">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              {Object.entries(selectedSauces)
                .filter(([, qty]) => qty > 0)
                .map(([id, qty]) => (
                  <div key={id} className="flex justify-between text-[#737373]">
                    <span className="truncate pr-2">
                      Sauce: {id} (x{qty})
                    </span>
                    <span>Included</span>
                  </div>
                ))}
            </div>

            {/* Financial breakdown */}
            <div className="border-t border-[#262626] pt-2 space-y-1 text-[#737373]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(combinedSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-[#FFD60A] pt-1 border-t border-[#222222]">
                <span>Total Paid</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-t border-[#262626] pt-2 flex items-center justify-between text-[#737373]">
              <div className="flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-[#FFD60A]" />
                <span className="text-[#A3A3A3]">
                  {paymentMethod === 'card'
                    ? `Card ending in ${paymentDetails.cardNumber.replace(/\D/g, '').slice(-4) || '••••'}`
                    : paymentMethod === 'upi'
                      ? `UPI (${paymentDetails.upiId})`
                      : paymentMethod === 'wallet'
                        ? `Wallet (${paymentDetails.wallet.toUpperCase()})`
                        : 'Cash on Delivery'}
                </span>
              </div>
              <span className="text-emerald-400 font-semibold text-[11px]">
                Paid Successfully
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Action: Back to Menu */}
      <div className="pt-2 flex justify-center">
        <button
          type="button"
          id="confirmation-back-to-menu-btn"
          onClick={handleBackToMenu}
          className="press-scale flex items-center justify-center gap-2 rounded-xl bg-[#FFD60A] px-8 py-3.5 font-mono text-sm font-bold text-[#0A0A0A] hover:bg-[#E5C009] shadow-lg shadow-[#FFD60A]/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
        >
          <span>Back to Menu &amp; Clear Cart</span>
        </button>
      </div>
    </div>
  );
};
