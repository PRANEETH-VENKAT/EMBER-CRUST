import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  useRef,
} from 'react';
import { MENU_ITEMS, MenuItem } from '../data/menu';
import { SAUCE_OPTIONS } from '../data/sauces';
import {
  CART_STORAGE_KEY,
  SAUCES_STORAGE_KEY,
  RESTAURANT_TAX_RATE,
  BADGE_BUMP_DURATION_MS,
} from '../utils/constants';

/**
 * Cart item interface extending MenuItem with quantity.
 */
export interface CartItemType extends MenuItem {
  quantity: number;
}

interface CartState {
  items: CartItemType[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: MenuItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'INCREASE_QTY'; payload: { id: string } }
  | { type: 'DECREASE_QTY'; payload: { id: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'INIT_CART'; payload: CartItemType[] };

export interface CartContextValue {
  cart: CartItemType[];
  selectedSauces: Record<string, number>;
  totalItems: number;
  itemsSubtotal: number;
  saucesSubtotal: number;
  subtotal: number;
  tax: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  badgeBump: boolean;
  triggerBadgeBump: () => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
  addSauce: (sauceId: string) => void;
  removeSauce: (sauceId: string) => void;
  setSauceQty: (sauceId: string, qty: number) => void;
  clearSauces: () => void;
}

/**
 * Validates a cart item parsed from localStorage to guard against corrupted storage.
 */
function isValidCartItem(item: unknown): item is CartItemType {
  if (!item || typeof item !== 'object') return false;
  const candidate = item as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.price === 'number' &&
    !isNaN(candidate.price) &&
    typeof candidate.quantity === 'number' &&
    Number.isInteger(candidate.quantity) &&
    candidate.quantity >= 1
  );
}

/**
 * Reads and validates initial cart state from localStorage with fail-safe fallback.
 */
function getInitialCart(): CartItemType[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Re-hydrate from the live menu so stale or tampered prices in storage are never trusted.
    // Items that no longer exist on the menu are dropped.
    return parsed.filter(isValidCartItem).flatMap((stored) => {
      const live = MENU_ITEMS.find((m) => m.id === stored.id);
      return live ? [{ ...live, quantity: Math.min(stored.quantity, 99) }] : [];
    });
  } catch {
    return [];
  }
}

/**
 * Reads and validates initial selected sauces from localStorage.
 */
function getInitialSauces(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(SAUCES_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const sanitized: Record<string, number> = {};
      Object.entries(parsed as Record<string, unknown>).forEach(([key, val]) => {
        if (typeof val === 'number' && val > 0) {
          sanitized[key] = Math.min(Math.floor(val), 20);
        }
      });
      return sanitized;
    }
    return {};
  } catch {
    return {};
  }
}

/**
 * Reducer governing all deterministic cart state mutations.
 */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'INIT_CART':
      return { items: action.payload };

    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingIndex > -1) {
        const updated = [...state.items];
        const existing = updated[existingIndex];
        if (existing) {
          updated[existingIndex] = {
            ...existing,
            quantity: existing.quantity + 1,
          };
        }
        return { items: updated };
      }
      return {
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }

    case 'INCREASE_QTY': {
      const updated = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      return { items: updated };
    }

    case 'DECREASE_QTY': {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (!existing) return state;

      // If quantity is 1 or less, decreasing removes it completely from the cart
      if (existing.quantity <= 1) {
        return {
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }

      return {
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity - 1 } : item
        ),
      };
    }

    case 'REMOVE_ITEM': {
      return {
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }

    case 'CLEAR_CART':
      return { items: [] };

    default:
      return state;
  }
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

/**
 * CartProvider component providing centralized cart management and localStorage persistence.
 */
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: getInitialCart() });
  const [selectedSauces, setSelectedSauces] =
    useState<Record<string, number>>(getInitialSauces);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [badgeBump, setBadgeBump] = useState<boolean>(false);
  const bumpTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync state.items to localStorage on changes
  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Storage quota exceeded or disabled in private browsing
    }
  }, [state.items]);

  // Sync selectedSauces to localStorage on changes
  useEffect(() => {
    try {
      window.localStorage.setItem(SAUCES_STORAGE_KEY, JSON.stringify(selectedSauces));
    } catch {
      // Storage quota exceeded
    }
  }, [selectedSauces]);

  // Clean up bump animation timer on unmount
  useEffect(() => {
    return () => {
      if (bumpTimeoutRef.current) {
        clearTimeout(bumpTimeoutRef.current);
      }
    };
  }, []);

  const triggerBadgeBump = () => {
    setBadgeBump(true);
    if (bumpTimeoutRef.current) {
      clearTimeout(bumpTimeoutRef.current);
    }
    bumpTimeoutRef.current = setTimeout(() => {
      setBadgeBump(false);
    }, BADGE_BUMP_DURATION_MS);
  };

  const addToCart = (item: MenuItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    triggerBadgeBump();
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const increaseQty = (id: string) => {
    dispatch({ type: 'INCREASE_QTY', payload: { id } });
    triggerBadgeBump();
  };

  const decreaseQty = (id: string) => {
    dispatch({ type: 'DECREASE_QTY', payload: { id } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    setSelectedSauces({});
  };

  const addSauce = (sauceId: string) => {
    setSelectedSauces((prev) => ({
      ...prev,
      [sauceId]: (prev[sauceId] || 0) + 1,
    }));
    triggerBadgeBump();
  };

  const removeSauce = (sauceId: string) => {
    setSelectedSauces((prev) => {
      const current = prev[sauceId] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[sauceId];
        return next;
      }
      return { ...prev, [sauceId]: current - 1 };
    });
  };

  const setSauceQty = (sauceId: string, qty: number) => {
    setSelectedSauces((prev) => {
      if (qty <= 0) {
        const next = { ...prev };
        delete next[sauceId];
        return next;
      }
      return { ...prev, [sauceId]: Math.min(qty, 20) };
    });
  };

  const clearSauces = () => {
    setSelectedSauces({});
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Calculated totals
  const saucesSubtotal = Object.entries(selectedSauces).reduce((sum, [sauceId, qty]) => {
    const sauce = SAUCE_OPTIONS.find((s) => s.id === sauceId);
    return sum + (sauce ? sauce.price * qty : 0);
  }, 0);

  const totalSauceUnits = Object.values(selectedSauces).reduce(
    (sum, qty) => sum + qty,
    0
  );
  const itemsSubtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const subtotal = itemsSubtotal + saucesSubtotal;
  const totalItems =
    state.items.reduce((sum, item) => sum + item.quantity, 0) + totalSauceUnits;
  const tax = Math.round(subtotal * RESTAURANT_TAX_RATE);
  const totalPrice = subtotal + tax;

  return (
    <CartContext.Provider
      value={{
        cart: state.items,
        selectedSauces,
        totalItems,
        itemsSubtotal,
        saucesSubtotal,
        subtotal,
        tax,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        badgeBump,
        triggerBadgeBump,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        addSauce,
        removeSauce,
        setSauceQty,
        clearSauces,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook to access the shopping cart context throughout the application.
 */
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
