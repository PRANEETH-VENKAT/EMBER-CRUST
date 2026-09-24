/**
 * Application-wide constants for Ember & Crust.
 * Centralizes configuration values, storage keys, timing values, rates, and limits.
 */

/** LocalStorage persistence key for cart state */
export const CART_STORAGE_KEY = 'ember_and_crust_cart_v1' as const;

/** LocalStorage persistence key for selected sauces state */
export const SAUCES_STORAGE_KEY = 'ember_and_crust_sauces_v1' as const;

/** LocalStorage persistence key for mock user session */
export const AUTH_STORAGE_KEY = 'ec_mock_session' as const;

/** LocalStorage persistence key for mock user orders */
export const ORDERS_STORAGE_KEY = 'ec_mock_orders' as const;

/** LocalStorage persistence key for saved delivery address */
export const SAVED_ADDRESS_STORAGE_KEY = 'ec_saved_delivery_address' as const;

/** Flat mock delivery fee in INR */
export const MOCK_DELIVERY_FEE = 40 as const;

/** Restaurant Goods & Services Tax (GST) rate: 5% */
export const RESTAURANT_TAX_RATE = 0.05 as const;
export const TAX_RATE = RESTAURANT_TAX_RATE;

/** Milliseconds before resetting added checkmark on FoodCard */
export const ADDED_CHECKMARK_DURATION_MS = 900 as const;

/** Delay for search query debouncing to keep typing at 60fps */
export const SEARCH_DEBOUNCE_DELAY_MS = 200 as const;

/** Interval for rotating search placeholder suggestions */
export const PLACEHOLDER_CYCLE_INTERVAL_MS = 3200 as const;

/** Maximum number of grid cards that receive staggered animation delay */
export const MAX_STAGGER_CARDS = 8 as const;

/** Default animation duration in milliseconds for count-up numbers */
export const DEFAULT_COUNT_UP_DURATION_MS = 300 as const;

/** Default duration for badge bump scale pulse */
export const BADGE_BUMP_DURATION_MS = 400 as const;

/** VIP Gate Access Constants */
export const VIP_PIN_LENGTH = 6 as const;
export const VIP_UNLOCK_TRANSITION_MS = 550 as const;

/** Currency configuration */
export const CURRENCY_CODE = 'INR' as const;
export const CURRENCY_LOCALE = 'en-IN' as const;

/** Popular search tags featured in SearchModal */
export const POPULAR_SEARCH_TAGS = [
  'Margherita',
  'Smash Burger',
  'Truffle Fries',
  'Nashville Chicken',
  'Lava Cake',
  'Cheesecake',
  'Cold Brew',
  'Buffalo Wings',
] as const;

/** Quick filter pills featured below the search bar in FoodGrid */
export const QUICK_SEARCH_PILLS = [
  'All',
  '🔥 Bestseller',
  '🇮🇳 Street Craft',
  '⭐ Signature',
  '🌿 Pure Veg',
  '🍗 Non-Veg',
  '🌶️ Spicy',
  'Under ₹350',
  'Desserts',
] as const;
