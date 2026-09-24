import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Smartphone,
  Wallet,
  Banknote,
  Lock,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Wifi,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useCheckout } from './CheckoutContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { MOCK_DELIVERY_FEE, TAX_RATE } from '../../utils/constants';
import { useSplit } from '../split/SplitContext';
import { SplitSummaryCard } from '../split/SplitSummaryCard';
import {
  detectCardNetwork,
  formatCardNumber,
  formatExpiry,
  validateCardNumber,
  validateExpiry,
  validateCvv,
  validateUpi,
  validateName,
} from './validation';
import { processPayment } from './api/mockCheckoutApi';

const WALLET_OPTIONS = [
  { id: 'paytm', name: 'Paytm Wallet', desc: 'Fast 1-click checkout' },
  { id: 'phonepe', name: 'PhonePe', desc: 'UPI & linked wallet' },
  { id: 'gpay', name: 'Google Pay', desc: 'Fast checkout with Google' },
  { id: 'amazonpay', name: 'Amazon Pay', desc: 'Use Amazon balance' },
] as const;

export const PaymentStep: React.FC = () => {
  const { state, goToStep, setPaymentMethod, updatePaymentDetails, dispatch } =
    useCheckout();

  const { cart, selectedSauces, itemsSubtotal, saucesSubtotal } = useCart();
  const { addOrder } = useAuth();

  const {
    paymentMethod,
    paymentDetails,
    deliveryDetails,
    isProcessing,
    processingPhase,
  } = state;

  // 3D Card Flip on CVV focus
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // Financial calculations
  const { isSplitMode, computeSplit } = useSplit();
  const combinedSubtotal = itemsSubtotal + saucesSubtotal;
  const taxAmount = Math.round(combinedSubtotal * TAX_RATE);
  const deliveryFee = MOCK_DELIVERY_FEE;
  const grandTotal = combinedSubtotal + taxAmount + deliveryFee;

  const splitResult = useMemo(() => {
    if (!isSplitMode) return null;
    return computeSplit(cart, {
      tax: taxAmount,
      deliveryFee,
      saucesSubtotal,
    });
  }, [isSplitMode, computeSplit, cart, taxAmount, deliveryFee, saucesSubtotal]);

  const cardNetwork = detectCardNetwork(paymentDetails.cardNumber);

  // Format card number for live preview (4 groups of 4)
  const getDisplayCardNumber = () => {
    const raw = paymentDetails.cardNumber.replace(/\D/g, '');
    const padded = (raw + '••••••••••••••••').slice(0, 16);
    return [
      padded.slice(0, 4),
      padded.slice(4, 8),
      padded.slice(8, 12),
      padded.slice(12, 16),
    ].join('  ');
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    updatePaymentDetails({ cardNumber: formatted });
    if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: null }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    updatePaymentDetails({ expiry: formatted });
    if (errors.expiry) setErrors((prev) => ({ ...prev, expiry: null }));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    updatePaymentDetails({ cvv: digits });
    if (errors.cvv) setErrors((prev) => ({ ...prev, cvv: null }));
  };

  const handleUpiSuggestion = (handle: string) => {
    const current = paymentDetails.upiId;
    const prefix = current.includes('@') ? current.split('@')[0] : current || 'myhandle';
    updatePaymentDetails({ upiId: `${prefix}${handle}` });
    if (errors.upiId) setErrors((prev) => ({ ...prev, upiId: null }));
  };

  const handleExecutePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    const newErrors: Record<string, string | null> = {};

    // Validate based on payment method
    if (paymentMethod === 'card') {
      const cardNumVal = validateCardNumber(paymentDetails.cardNumber);
      if (!cardNumVal.isValid) newErrors.cardNumber = cardNumVal.error;

      const nameVal = validateName(paymentDetails.cardholderName);
      if (!nameVal.isValid)
        newErrors.cardholderName = 'Enter cardholder name as printed.';

      const expiryVal = validateExpiry(paymentDetails.expiry);
      if (!expiryVal.isValid) newErrors.expiry = expiryVal.error;

      const cvvVal = validateCvv(paymentDetails.cvv);
      if (!cvvVal.isValid) newErrors.cvv = cvvVal.error;
    } else if (paymentMethod === 'upi') {
      const upiVal = validateUpi(paymentDetails.upiId);
      if (!upiVal.isValid) newErrors.upiId = upiVal.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    dispatch({ type: 'START_PAYMENT' });

    // Processing phase 1: Initial submission
    const verifyingTimer = setTimeout(() => {
      dispatch({ type: 'SET_PROCESSING_PHASE', payload: 'verifying' });
    }, 750);

    try {
      const itemsSummary = cart.map((i) => `${i.name} (x${i.quantity})`).join(', ');

      const sauceNames = Object.entries(selectedSauces)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => `${id} x${qty}`)
        .join(', ');

      const fullSummary = sauceNames
        ? `${itemsSummary} + Sauces [${sauceNames}]`
        : itemsSummary;

      // Call simulated async checkout API
      const result = await processPayment({
        items: cart.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        sauces: selectedSauces,
        deliveryAddress: {
          name: deliveryDetails.name,
          phone: deliveryDetails.phone,
          address: deliveryDetails.address,
          city: deliveryDetails.city,
          pincode: deliveryDetails.pincode,
        },
        paymentMethod,
        paymentDetails: {
          cardLast4: paymentDetails.cardNumber.slice(-4),
          cardNetwork,
          upiId: paymentDetails.upiId,
          walletName: paymentDetails.wallet,
        },
        pricing: {
          subtotal: combinedSubtotal,
          tax: taxAmount,
          deliveryFee,
          grandTotal,
        },
      });

      clearTimeout(verifyingTimer);

      // Save order to AuthContext persistent order history
      addOrder({
        id: result.orderId,
        itemsSummary: fullSummary,
        itemsCount: cart.reduce((acc, i) => acc + i.quantity, 0),
        subtotal: combinedSubtotal,
        tax: taxAmount,
        deliveryFee,
        total: grandTotal,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'Order Placed',
        deliveryAddress: {
          name: deliveryDetails.name,
          phone: deliveryDetails.phone,
          address: deliveryDetails.address,
          city: deliveryDetails.city,
          pincode: deliveryDetails.pincode,
        },
        paymentMethod:
          paymentMethod === 'card'
            ? `Card ending in ${paymentDetails.cardNumber.replace(/\D/g, '').slice(-4) || '••••'}`
            : paymentMethod === 'upi'
              ? `UPI (${paymentDetails.upiId})`
              : paymentMethod === 'wallet'
                ? `Wallet (${paymentDetails.wallet.toUpperCase()})`
                : 'Cash on Delivery',
      });

      // Initialize persistent tracking record for the new order
      try {
        const trackingInit = {
          orderId: result.orderId,
          createdAt: Date.now(),
          stageId: 'PLACED',
          stageTimestamps: {
            PLACED: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            PREPARING: null,
            OUT_FOR_DELIVERY: null,
            DELIVERED: null,
          },
        };
        localStorage.setItem(
          `ec_tracking_${result.orderId}`,
          JSON.stringify(trackingInit)
        );

        // Store split bill snapshot if split mode was used
        if (isSplitMode && splitResult) {
          localStorage.setItem(
            `ec_order_split_${result.orderId}`,
            JSON.stringify({ isSplit: true, splitResult })
          );
        }
      } catch {
        // ignore
      }

      dispatch({ type: 'PAYMENT_SUCCESS', payload: result });

      // Mock payment safety: immediately wipe sensitive card number and CVV from state
      updatePaymentDetails({
        cardNumber: '',
        expiry: '',
        cvv: '',
        cardholderName: '',
      });
    } catch {
      clearTimeout(verifyingTimer);
      dispatch({
        type: 'PAYMENT_ERROR',
        payload: 'Unable to process transaction. Please verify details and try again.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-[#262626] pb-4">
        <div>
          <h2 className="font-sora text-lg font-bold text-[#F5F5F5]">Payment Method</h2>
          <p className="font-mono text-xs text-[#A3A3A3]">
            Select your preferred simulated payment method
          </p>
        </div>
        <span className="rounded-full border border-[#262626] bg-[#141414] px-3 py-1 font-mono text-xs text-[#FFD60A]">
          Step 3 of 4
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Payment Methods & Inputs (7 cols) */}
        <div className="space-y-5 lg:col-span-7">
          {/* Group Settle-Up Tracker (If split mode is active) */}
          {isSplitMode && splitResult && (
            <SplitSummaryCard
              calculation={splitResult}
              interactivePaid={true}
              title="Group Settle-Up Tracker"
              showBreakdownItems={false}
            />
          )}

          {/* Payment Method Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`press-scale flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 font-mono text-xs font-semibold transition-all ${
                paymentMethod === 'card'
                  ? 'border-[#FFD60A] bg-[#FFD60A]/10 text-[#FFD60A]'
                  : 'border-[#262626] bg-[#141414] text-[#A3A3A3] hover:border-[#383838] hover:text-[#F5F5F5]'
              }`}
            >
              <CreditCard className="h-5 w-5" />
              <span>Card</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`press-scale flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 font-mono text-xs font-semibold transition-all ${
                paymentMethod === 'upi'
                  ? 'border-[#FFD60A] bg-[#FFD60A]/10 text-[#FFD60A]'
                  : 'border-[#262626] bg-[#141414] text-[#A3A3A3] hover:border-[#383838] hover:text-[#F5F5F5]'
              }`}
            >
              <Smartphone className="h-5 w-5" />
              <span>UPI</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('wallet')}
              className={`press-scale flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 font-mono text-xs font-semibold transition-all ${
                paymentMethod === 'wallet'
                  ? 'border-[#FFD60A] bg-[#FFD60A]/10 text-[#FFD60A]'
                  : 'border-[#262626] bg-[#141414] text-[#A3A3A3] hover:border-[#383838] hover:text-[#F5F5F5]'
              }`}
            >
              <Wallet className="h-5 w-5" />
              <span>Wallet</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('cod')}
              className={`press-scale flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 font-mono text-xs font-semibold transition-all ${
                paymentMethod === 'cod'
                  ? 'border-[#FFD60A] bg-[#FFD60A]/10 text-[#FFD60A]'
                  : 'border-[#262626] bg-[#141414] text-[#A3A3A3] hover:border-[#383838] hover:text-[#F5F5F5]'
              }`}
            >
              <Banknote className="h-5 w-5" />
              <span>Cash / COD</span>
            </button>
          </div>

          {/* TAB 1: CARD PAYMENT */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              {/* 3D Flip Card Container */}
              <div className="card-perspective mx-auto w-full max-w-[340px] pt-1">
                <div
                  className={`card-3d-inner relative aspect-[1.586/1] w-full rounded-2xl p-5 shadow-2xl transition-transform duration-500 select-none ${
                    isCardFlipped ? 'card-3d-flipped' : ''
                  }`}
                  style={{
                    background:
                      'linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 50%, #171717 100%)',
                    border: '1px solid #383838',
                  }}
                >
                  {/* FRONT FACE */}
                  <div className="card-face-front absolute inset-0 flex flex-col justify-between p-5 text-white">
                    {/* Top Row: Chip & Contactless & Brand */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Realistic EMV Golden Chip Graphic */}
                        <div className="h-7 w-9 rounded border border-amber-400/60 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 shadow-inner flex flex-col justify-around p-0.5">
                          <div className="h-0.5 w-full bg-amber-800/40" />
                          <div className="h-0.5 w-full bg-amber-800/40" />
                        </div>
                        <Wifi className="h-4 w-4 rotate-90 text-[#A3A3A3]" />
                      </div>

                      {/* Card Network Logo */}
                      <div className="flex items-center">
                        {cardNetwork === 'visa' && (
                          <span className="font-bebas text-2xl tracking-widest text-[#F5F5F5] italic drop-shadow">
                            VISA
                          </span>
                        )}
                        {cardNetwork === 'mastercard' && (
                          <div className="flex -space-x-2">
                            <span className="h-6 w-6 rounded-full bg-rose-500 opacity-90" />
                            <span className="h-6 w-6 rounded-full bg-amber-400 opacity-90" />
                          </div>
                        )}
                        {cardNetwork === 'rupay' && (
                          <span className="font-mono text-sm font-black tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                            RuPay
                          </span>
                        )}
                        {cardNetwork === 'unknown' && (
                          <span className="font-mono text-xs font-bold tracking-wider text-[#FFD60A]">
                            EMBER CARD
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle: 16-digit Card Number with sliding display */}
                    <div className="py-2">
                      <p className="font-mono text-base sm:text-lg font-bold tracking-widest text-[#F5F5F5] drop-shadow">
                        {getDisplayCardNumber()}
                      </p>
                    </div>

                    {/* Bottom: Cardholder Name & Expiry */}
                    <div className="flex items-end justify-between font-mono text-[10px] tracking-wider uppercase">
                      <div>
                        <span className="block text-[8px] text-[#737373]">
                          Cardholder
                        </span>
                        <span className="font-bold text-[#F5F5F5] truncate max-w-[170px] inline-block">
                          {paymentDetails.cardholderName || 'CARDHOLDER NAME'}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="block text-[8px] text-[#737373]">Expires</span>
                        <span className="font-bold text-[#F5F5F5]">
                          {paymentDetails.expiry || 'MM/YY'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE */}
                  <div className="card-face-back absolute inset-0 flex flex-col justify-between py-4 text-white">
                    {/* Magnetic Stripe */}
                    <div className="h-9 w-full bg-[#050505] border-y border-[#262626]" />

                    {/* Signature bar & CVV */}
                    <div className="px-5 space-y-1">
                      <div className="flex items-center justify-end rounded bg-[#2D2D2D] px-3 py-1.5 border border-[#383838]">
                        <span className="mr-2 font-mono text-[9px] uppercase tracking-wider text-[#A3A3A3]">
                          CVV
                        </span>
                        <span className="font-mono text-sm font-black tracking-widest text-[#FFD60A]">
                          {paymentDetails.cvv
                            ? '•'.repeat(paymentDetails.cvv.length)
                            : '•••'}
                        </span>
                      </div>
                      <p className="text-[8px] font-mono text-[#737373] text-right">
                        3 or 4 digit security code
                      </p>
                    </div>

                    {/* Hologram / Brand Mark */}
                    <div className="px-5 flex justify-between items-center text-[9px] font-mono text-[#737373]">
                      <span>EMBER &amp; CRUST REWARDS</span>
                      <Sparkles className="h-3 w-3 text-[#FFD60A]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Input Fields */}
              <div className="space-y-3 pt-2">
                {/* Card Number */}
                <div>
                  <label
                    htmlFor="card-number"
                    className="block font-mono text-xs font-semibold text-[#F5F5F5] mb-1"
                  >
                    Card Number <span className="text-[#FFD60A]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="card-number"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      maxLength={19}
                      placeholder="4532 8901 2345 6789"
                      value={paymentDetails.cardNumber}
                      onChange={handleCardNumberChange}
                      aria-invalid={Boolean(errors.cardNumber)}
                      className={`w-full rounded-xl border bg-[#141414] px-4 py-2.5 font-mono text-sm text-[#F5F5F5] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#FFD60A] ${
                        errors.cardNumber ? 'border-rose-500' : 'border-[#262626]'
                      }`}
                    />
                    {cardNetwork !== 'unknown' && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-[#FFD60A] uppercase">
                        {cardNetwork}
                      </span>
                    )}
                  </div>
                  {errors.cardNumber && (
                    <p className="mt-1 flex items-center gap-1 font-mono text-xs text-rose-400">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.cardNumber}</span>
                    </p>
                  )}
                </div>

                {/* Cardholder Name */}
                <div>
                  <label
                    htmlFor="cardholder-name"
                    className="block font-mono text-xs font-semibold text-[#F5F5F5] mb-1"
                  >
                    Name on Card <span className="text-[#FFD60A]">*</span>
                  </label>
                  <input
                    id="cardholder-name"
                    type="text"
                    autoComplete="cc-name"
                    placeholder="ADITI SHARMA"
                    value={paymentDetails.cardholderName}
                    onChange={(e) => {
                      updatePaymentDetails({
                        cardholderName: e.target.value.toUpperCase(),
                      });
                      if (errors.cardholderName)
                        setErrors((prev) => ({ ...prev, cardholderName: null }));
                    }}
                    aria-invalid={Boolean(errors.cardholderName)}
                    className={`w-full rounded-xl border bg-[#141414] px-4 py-2.5 font-mono text-sm text-[#F5F5F5] placeholder-[#737373] uppercase focus:outline-none focus:ring-2 focus:ring-[#FFD60A] ${
                      errors.cardholderName ? 'border-rose-500' : 'border-[#262626]'
                    }`}
                  />
                  {errors.cardholderName && (
                    <p className="mt-1 flex items-center gap-1 font-mono text-xs text-rose-400">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.cardholderName}</span>
                    </p>
                  )}
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="card-expiry"
                      className="block font-mono text-xs font-semibold text-[#F5F5F5] mb-1"
                    >
                      Expiry (MM/YY) <span className="text-[#FFD60A]">*</span>
                    </label>
                    <input
                      id="card-expiry"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      maxLength={5}
                      placeholder="12/28"
                      value={paymentDetails.expiry}
                      onChange={handleExpiryChange}
                      aria-invalid={Boolean(errors.expiry)}
                      className={`w-full rounded-xl border bg-[#141414] px-4 py-2.5 font-mono text-sm text-[#F5F5F5] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#FFD60A] ${
                        errors.expiry ? 'border-rose-500' : 'border-[#262626]'
                      }`}
                    />
                    {errors.expiry && (
                      <p className="mt-1 font-mono text-[11px] text-rose-400">
                        {errors.expiry}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="card-cvv"
                      className="block font-mono text-xs font-semibold text-[#F5F5F5] mb-1"
                    >
                      CVV <span className="text-[#FFD60A]">*</span>
                    </label>
                    <input
                      id="card-cvv"
                      type="password"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      maxLength={4}
                      placeholder="•••"
                      value={paymentDetails.cvv}
                      onChange={handleCvvChange}
                      onFocus={() => setIsCardFlipped(true)}
                      onBlur={() => setIsCardFlipped(false)}
                      aria-invalid={Boolean(errors.cvv)}
                      className={`w-full rounded-xl border bg-[#141414] px-4 py-2.5 font-mono text-sm text-[#F5F5F5] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#FFD60A] ${
                        errors.cvv ? 'border-rose-500' : 'border-[#262626]'
                      }`}
                    />
                    {errors.cvv && (
                      <p className="mt-1 font-mono text-[11px] text-rose-400">
                        {errors.cvv}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPI PAYMENT */}
          {paymentMethod === 'upi' && (
            <div className="space-y-4 rounded-xl border border-[#262626] bg-[#141414] p-5">
              <div>
                <label
                  htmlFor="upi-id-input"
                  className="block font-mono text-xs font-semibold text-[#F5F5F5] mb-1"
                >
                  Enter UPI ID / VPA <span className="text-[#FFD60A]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="upi-id-input"
                    type="text"
                    autoComplete="off"
                    placeholder="e.g. yourname@okhdfcbank"
                    value={paymentDetails.upiId}
                    onChange={(e) => {
                      updatePaymentDetails({ upiId: e.target.value });
                      if (errors.upiId) setErrors((prev) => ({ ...prev, upiId: null }));
                    }}
                    aria-invalid={Boolean(errors.upiId)}
                    className={`w-full rounded-xl border bg-[#0A0A0A] px-4 py-2.5 font-mono text-sm text-[#F5F5F5] placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#FFD60A] ${
                      errors.upiId ? 'border-rose-500' : 'border-[#262626]'
                    }`}
                  />
                </div>
                {errors.upiId && (
                  <p className="mt-1 flex items-center gap-1 font-mono text-xs text-rose-400">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.upiId}</span>
                  </p>
                )}
              </div>

              {/* Quick Handle Suggestion Chips */}
              <div>
                <span className="block font-mono text-[11px] text-[#A3A3A3] mb-1.5">
                  Popular handles:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['@okaxis', '@okhdfcbank', '@paytm', '@ybl', '@upi'].map((handle) => (
                    <button
                      key={handle}
                      type="button"
                      onClick={() => handleUpiSuggestion(handle)}
                      className="rounded-lg border border-[#262626] bg-[#1C1C1C] px-2.5 py-1 font-mono text-xs text-[#A3A3A3] hover:border-[#FFD60A] hover:text-[#FFD60A] transition-colors"
                    >
                      {handle}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-[#0A0A0A] p-3 border border-[#262626]">
                <Smartphone className="h-5 w-5 text-[#FFD60A] shrink-0" />
                <p className="font-mono text-xs text-[#A3A3A3]">
                  A collect request will be pushed to your UPI app upon tapping Pay.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: DIGITAL WALLETS */}
          {paymentMethod === 'wallet' && (
            <div className="space-y-3 rounded-xl border border-[#262626] bg-[#141414] p-5">
              <span className="block font-mono text-xs font-semibold text-[#F5F5F5] mb-2">
                Select Wallet Provider
              </span>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {WALLET_OPTIONS.map((w) => {
                  const isSelected = paymentDetails.wallet === w.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => updatePaymentDetails({ wallet: w.id })}
                      className={`press-scale flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                        isSelected
                          ? 'border-[#FFD60A] bg-[#FFD60A]/10 text-[#F5F5F5]'
                          : 'border-[#262626] bg-[#0A0A0A] text-[#A3A3A3] hover:border-[#383838]'
                      }`}
                    >
                      <div>
                        <h4 className="font-sora text-sm font-bold text-[#F5F5F5]">
                          {w.name}
                        </h4>
                        <p className="font-mono text-[11px] text-[#737373]">{w.desc}</p>
                      </div>
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                          isSelected
                            ? 'border-[#FFD60A] bg-[#FFD60A]'
                            : 'border-[#404040] bg-[#1A1A1A]'
                        }`}
                      >
                        {isSelected && (
                          <span className="h-1.5 w-1.5 rounded-full bg-black" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: CASH ON DELIVERY */}
          {paymentMethod === 'cod' && (
            <div className="space-y-3 rounded-xl border border-[#262626] bg-[#141414] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#FFD60A]">
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-sora text-sm font-bold text-[#F5F5F5]">
                    Cash or UPI upon Delivery
                  </h3>
                  <p className="mt-1 font-inter text-xs text-[#A3A3A3] leading-relaxed">
                    Pay our delivery executive in cash or scan the dynamic UPI QR code on
                    the order receipt at your doorstep. Please keep exact change ready
                    when possible.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-[#0A0A0A] p-2.5 font-mono text-xs text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Zero additional COD convenience charges applied.</span>
              </div>
            </div>
          )}

          {/* Security Guarantee Note */}
          <div className="flex items-center gap-2 rounded-xl border border-[#262626] bg-[#0E0E0E] p-3 text-xs font-mono text-[#737373]">
            <Lock className="h-4 w-4 text-[#FFD60A] shrink-0" />
            <span>Your payment info is simulated and never sent anywhere.</span>
          </div>
        </div>

        {/* Right Column: Sticky Payment Summary Sidebar (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          <div className="sticky top-4 rounded-xl border border-[#262626] bg-[#141414] p-5 space-y-4">
            <h3 className="font-sora text-sm font-bold text-[#F5F5F5] border-b border-[#262626] pb-3">
              Payment Summary
            </h3>

            {/* Price Line Items */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between text-[#A3A3A3]">
                <span>Dishes Subtotal</span>
                <span className="font-semibold text-[#F5F5F5]">
                  {formatCurrency(itemsSubtotal)}
                </span>
              </div>

              {saucesSubtotal > 0 && (
                <div className="flex justify-between text-[#A3A3A3]">
                  <span>Extra House Sauces</span>
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
                <span>Delivery Charge</span>
                <span className="font-semibold text-[#F5F5F5]">
                  {formatCurrency(deliveryFee)}
                </span>
              </div>

              <div className="border-t border-[#262626] pt-3 flex items-baseline justify-between">
                <span className="font-sora text-sm font-bold text-[#F5F5F5]">
                  Total Payable
                </span>
                <span className="font-bebas text-2xl text-[#FFD60A] tracking-wider">
                  {formatCurrency(grandTotal)}
                </span>
              </div>

              {isSplitMode && splitResult && (
                <div className="flex items-center justify-between text-[11px] font-mono text-[#A3A3A3] pt-1 border-t border-[#1C1C1C]">
                  <span>Group Bill Split</span>
                  <span className="text-[#FFD60A] font-semibold">
                    {splitResult.personSplits.length} people (
                    {splitResult.personSplits.filter((p) => p.isPaid).length} settled)
                  </span>
                </div>
              )}
            </div>

            {/* Delivery address recap */}
            <div className="rounded-lg bg-[#0A0A0A] p-3 font-mono text-xs text-[#A3A3A3] space-y-1 border border-[#222222]">
              <span className="block text-[10px] uppercase font-bold text-[#737373]">
                Delivering to:
              </span>
              <p className="text-[#F5F5F5] font-semibold">{deliveryDetails.name}</p>
              <p className="truncate">
                {deliveryDetails.address}, {deliveryDetails.city} –{' '}
                {deliveryDetails.pincode}
              </p>
            </div>

            {/* Pay Button with Processing / Verifying State */}
            <button
              type="button"
              id="pay-button"
              disabled={isProcessing}
              onClick={handleExecutePayment}
              className={`press-scale relative w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 font-mono text-sm font-bold transition-all duration-[var(--dur-base)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A] ${
                isProcessing
                  ? 'bg-[#1C1C1C] text-[#FFD60A] border border-[#FFD60A]/40 cursor-wait'
                  : 'bg-[#FFD60A] text-[#0A0A0A] hover:bg-[#E5C009] shadow-lg shadow-[#FFD60A]/20 cursor-pointer'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2.5">
                  <Loader2 className="h-4 w-4 anim-spin-fast text-[#FFD60A]" />
                  <span>
                    {processingPhase === 'processing'
                      ? 'Processing your payment…'
                      : 'Verifying with bank…'}
                  </span>
                </div>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Pay {formatCurrency(grandTotal)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation: Back to Delivery */}
      <div className="flex items-center justify-between border-t border-[#262626] pt-4">
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => goToStep(2)}
          className="press-scale flex items-center gap-2 rounded-xl border border-[#262626] bg-[#141414] px-5 py-2.5 font-mono text-xs font-semibold text-[#A3A3A3] hover:border-[#383838] hover:text-[#F5F5F5] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Delivery</span>
        </button>
      </div>
    </div>
  );
};
