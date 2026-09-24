/**
 * Mock Checkout API Service
 *
 * ============================================================================
 * ARCHITECTURAL INTEGRATION POINT:
 * This module simulates a server-side payment processing gateway and order creation endpoint.
 * When integrating a real backend or payment gateway (e.g. Razorpay, Stripe, Cashfree):
 * 1. Replace the simulated `setTimeout` below with a real fetch/axios call to:
 *    POST /api/checkout/process-payment
 * 2. Pass authorization tokens, idempotency keys, and encrypted payment payloads.
 * 3. Return the verified server-generated order response.
 * ============================================================================
 */

export interface CheckoutPayload {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  sauces: Record<string, number>;
  deliveryAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  paymentMethod: 'card' | 'upi' | 'wallet' | 'cod';
  paymentDetails?: {
    cardLast4?: string;
    cardNetwork?: string;
    upiId?: string;
    walletName?: string;
  };
  pricing: {
    subtotal: number;
    tax: number;
    deliveryFee: number;
    grandTotal: number;
  };
}

export interface CheckoutResult {
  success: boolean;
  orderId: string;
  estimatedDelivery: string;
  timestamp: string;
  paymentRef: string;
}

/**
 * Process a checkout and payment transaction.
 * Currently returns a deterministic simulated success result after an asynchronous delay.
 *
 * @param payload - The complete checkout and payment payload.
 * @returns Promise resolving to the checkout result object.
 */
export async function processPayment(payload: CheckoutPayload): Promise<CheckoutResult> {
  // Simulate network roundtrip and payment processor verification
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate a realistic, readable Ember & Crust order tracking ID
  const timestampCode = Date.now().toString(36).toUpperCase().slice(-5);
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const orderId = `EC-${timestampCode}-${randomSuffix}`;
  const paymentRef = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  // Log in development for auditability
  if (import.meta.env.DEV) {
    console.info('[MockCheckoutApi] Successfully processed simulated payment:', {
      orderId,
      amount: payload.pricing.grandTotal,
      method: payload.paymentMethod,
    });
  }

  return {
    success: true,
    orderId,
    estimatedDelivery: '35 - 40 Mins',
    timestamp: new Date().toISOString(),
    paymentRef,
  };
}
