import { CURRENCY_CODE, CURRENCY_LOCALE } from './constants';

/**
 * Formats a numeric price into INR currency string with ₹ symbol.
 * Example: 499 -> "₹499", 1250 -> "₹1,250"
 */
export function formatCurrency(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: 'currency',
    currency: CURRENCY_CODE,
    maximumFractionDigits: 0,
  }).format(amount);
}
