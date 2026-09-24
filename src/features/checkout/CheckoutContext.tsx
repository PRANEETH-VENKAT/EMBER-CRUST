import React, { createContext, useContext, useReducer } from 'react';
import { CheckoutResult } from './api/mockCheckoutApi';

export type CheckoutStep = 1 | 2 | 3 | 4;
export type PaymentMethod = 'card' | 'upi' | 'wallet' | 'cod';

export interface DeliveryDetailsState {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  saveAddress: boolean;
}

export interface PaymentDetailsState {
  cardNumber: string;
  cardholderName: string;
  expiry: string;
  cvv: string;
  upiId: string;
  wallet: string;
}

export interface CheckoutState {
  step: CheckoutStep;
  deliveryDetails: DeliveryDetailsState;
  paymentMethod: PaymentMethod;
  paymentDetails: PaymentDetailsState;
  orderResult: CheckoutResult | null;
  isProcessing: boolean;
  processingPhase: 'idle' | 'processing' | 'verifying';
  errorMessage: string | null;
}

type CheckoutAction =
  | { type: 'SET_STEP'; payload: CheckoutStep }
  | { type: 'UPDATE_DELIVERY'; payload: Partial<DeliveryDetailsState> }
  | { type: 'SET_PAYMENT_METHOD'; payload: PaymentMethod }
  | { type: 'UPDATE_PAYMENT_DETAILS'; payload: Partial<PaymentDetailsState> }
  | { type: 'START_PAYMENT' }
  | { type: 'SET_PROCESSING_PHASE'; payload: 'idle' | 'processing' | 'verifying' }
  | { type: 'PAYMENT_SUCCESS'; payload: CheckoutResult }
  | { type: 'PAYMENT_ERROR'; payload: string }
  | {
      type: 'RESET_CHECKOUT';
      payload?: { initialDelivery?: Partial<DeliveryDetailsState> };
    };

const initialDeliveryState: DeliveryDetailsState = {
  name: '',
  phone: '',
  address: '',
  city: '',
  pincode: '',
  saveAddress: true,
};

const initialPaymentDetails: PaymentDetailsState = {
  cardNumber: '',
  cardholderName: '',
  expiry: '',
  cvv: '',
  upiId: '',
  wallet: 'paytm',
};

const initialCheckoutState: CheckoutState = {
  step: 1,
  deliveryDetails: initialDeliveryState,
  paymentMethod: 'card',
  paymentDetails: initialPaymentDetails,
  orderResult: null,
  isProcessing: false,
  processingPhase: 'idle',
  errorMessage: null,
};

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload, errorMessage: null };
    case 'UPDATE_DELIVERY':
      return {
        ...state,
        deliveryDetails: { ...state.deliveryDetails, ...action.payload },
      };
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload, errorMessage: null };
    case 'UPDATE_PAYMENT_DETAILS':
      return {
        ...state,
        paymentDetails: { ...state.paymentDetails, ...action.payload },
      };
    case 'START_PAYMENT':
      return {
        ...state,
        isProcessing: true,
        processingPhase: 'processing',
        errorMessage: null,
      };
    case 'SET_PROCESSING_PHASE':
      return {
        ...state,
        processingPhase: action.payload,
      };
    case 'PAYMENT_SUCCESS':
      return {
        ...state,
        isProcessing: false,
        processingPhase: 'idle',
        orderResult: action.payload,
        step: 4,
        errorMessage: null,
      };
    case 'PAYMENT_ERROR':
      return {
        ...state,
        isProcessing: false,
        processingPhase: 'idle',
        errorMessage: action.payload,
      };
    case 'RESET_CHECKOUT':
      return {
        ...initialCheckoutState,
        deliveryDetails: {
          ...initialDeliveryState,
          ...(action.payload?.initialDelivery || {}),
        },
      };
    default:
      return state;
  }
}

interface CheckoutContextValue {
  state: CheckoutState;
  dispatch: React.Dispatch<CheckoutAction>;
  goToStep: (step: CheckoutStep) => void;
  updateDelivery: (data: Partial<DeliveryDetailsState>) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  updatePaymentDetails: (data: Partial<PaymentDetailsState>) => void;
  resetCheckout: (initialDelivery?: Partial<DeliveryDetailsState>) => void;
}

const CheckoutContext = createContext<CheckoutContextValue | undefined>(undefined);

export const CheckoutProvider: React.FC<{
  children: React.ReactNode;
  initialDelivery?: Partial<DeliveryDetailsState>;
}> = ({ children, initialDelivery }) => {
  const [state, dispatch] = useReducer(checkoutReducer, {
    ...initialCheckoutState,
    deliveryDetails: {
      ...initialDeliveryState,
      ...(initialDelivery || {}),
    },
  });

  const goToStep = (step: CheckoutStep) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const updateDelivery = (data: Partial<DeliveryDetailsState>) => {
    dispatch({ type: 'UPDATE_DELIVERY', payload: data });
  };

  const setPaymentMethod = (method: PaymentMethod) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  };

  const updatePaymentDetails = (data: Partial<PaymentDetailsState>) => {
    dispatch({ type: 'UPDATE_PAYMENT_DETAILS', payload: data });
  };

  const resetCheckout = (delivery?: Partial<DeliveryDetailsState>) => {
    dispatch({ type: 'RESET_CHECKOUT', payload: { initialDelivery: delivery } });
  };

  return (
    <CheckoutContext.Provider
      value={{
        state,
        dispatch,
        goToStep,
        updateDelivery,
        setPaymentMethod,
        updatePaymentDetails,
        resetCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = (): CheckoutContextValue => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};
