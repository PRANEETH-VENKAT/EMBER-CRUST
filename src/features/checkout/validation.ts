/**
 * Pure validation functions for checkout fields.
 * Fully decoupled from UI components with deterministic input/output signatures.
 */

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export type CardNetwork = 'visa' | 'mastercard' | 'rupay' | 'unknown';

/**
 * Validates a recipient or cardholder name.
 * @param name - The full name to validate.
 * @returns Object with boolean isValid and error message or null.
 */
export function validateName(name: string): ValidationResult {
  const trimmed = name.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Full name is required.' };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters.' };
  }
  return { isValid: true, error: null };
}

/**
 * Validates an Indian 10-digit mobile phone number.
 * @param phone - Raw phone input string.
 * @returns Object with boolean isValid and error message or null.
 */
export function validatePhone(phone: string): ValidationResult {
  const digitsOnly = phone.replace(/\D/g, '');
  if (!digitsOnly) {
    return { isValid: false, error: 'Phone number is required.' };
  }
  if (digitsOnly.length !== 10) {
    return { isValid: false, error: 'Enter a valid 10-digit mobile number.' };
  }
  // Standard Indian mobile number prefixes (6, 7, 8, 9)
  if (!/^[6-9]\d{9}$/.test(digitsOnly)) {
    return { isValid: false, error: 'Mobile number should start with 6, 7, 8, or 9.' };
  }
  return { isValid: true, error: null };
}

/**
 * Validates delivery address line.
 * @param address - Address string.
 * @returns Object with boolean isValid and error message or null.
 */
export function validateAddress(address: string): ValidationResult {
  const trimmed = address.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Street address is required.' };
  }
  if (trimmed.length < 5) {
    return { isValid: false, error: 'Address must be at least 5 characters.' };
  }
  return { isValid: true, error: null };
}

/**
 * Validates delivery city.
 * @param city - City name string.
 * @returns Object with boolean isValid and error message or null.
 */
export function validateCity(city: string): ValidationResult {
  const trimmed = city.trim();
  if (!trimmed) {
    return { isValid: false, error: 'City is required.' };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Enter a valid city name.' };
  }
  return { isValid: true, error: null };
}

/**
 * Validates Indian 6-digit postal PIN code.
 * @param pincode - PIN code string.
 * @returns Object with boolean isValid and error message or null.
 */
export function validatePincode(pincode: string): ValidationResult {
  const digitsOnly = pincode.replace(/\D/g, '');
  if (!digitsOnly) {
    return { isValid: false, error: 'PIN code is required.' };
  }
  if (digitsOnly.length !== 6) {
    return { isValid: false, error: 'PIN code must be exactly 6 digits.' };
  }
  if (/^0/.test(digitsOnly)) {
    return { isValid: false, error: 'PIN code cannot start with 0.' };
  }
  return { isValid: true, error: null };
}

/**
 * Detects payment card network based on BIN / leading digits.
 * @param cardNumber - Formatted or unformatted card number.
 * @returns 'visa' | 'mastercard' | 'rupay' | 'unknown'
 */
export function detectCardNetwork(cardNumber: string): CardNetwork {
  const clean = cardNumber.replace(/\D/g, '');
  if (!clean) return 'unknown';

  // Visa begins with 4
  if (/^4/.test(clean)) return 'visa';

  // Mastercard begins with 51-55 or 2221-2720
  if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(clean)) {
    return 'mastercard';
  }

  // RuPay begins with 60, 65, 81, 82, or 508
  if (/^(60|65|81|82|508)/.test(clean)) {
    return 'rupay';
  }

  return 'unknown';
}

/**
 * Auto-formats card number with spaces every 4 digits, capped at 19 characters (16 digits + 3 spaces).
 * @param input - Raw card number input.
 * @returns Formatted string (e.g. "4532 8901 2345 6789")
 */
export function formatCardNumber(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 16);
  const parts: string[] = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.slice(i, i + 4));
  }
  return parts.join(' ');
}

/**
 * Performs basic Luhn algorithm check on numeric digits.
 * @param digits - Digit-only card string.
 * @returns Boolean indicating if Luhn checksum is valid.
 */
function luhnCheck(digits: string): boolean {
  if (digits.length < 13) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

/**
 * Validates a simulated payment card number.
 * @param cardNumber - Raw or spaced card number.
 * @returns Object with boolean isValid and error message or null.
 */
export function validateCardNumber(cardNumber: string): ValidationResult {
  const digits = cardNumber.replace(/\D/g, '');
  if (!digits) {
    return { isValid: false, error: 'Card number is required.' };
  }
  if (digits.length !== 16) {
    return { isValid: false, error: 'Card number must be 16 digits.' };
  }
  // Soft Luhn check: in simulation, provide helpful feedback if invalid
  if (!luhnCheck(digits)) {
    return { isValid: false, error: 'Invalid card number checksum (Luhn check failed).' };
  }
  return { isValid: true, error: null };
}

/**
 * Auto-formats expiry input with a slash (MM/YY).
 * @param input - Raw expiry input.
 * @returns Formatted expiry (e.g. "12/28")
 */
export function formatExpiry(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  }
  return digits;
}

/**
 * Validates card expiration date in MM/YY format.
 * @param expiry - String formatted as MM/YY.
 * @returns Object with boolean isValid and error message or null.
 */
export function validateExpiry(expiry: string): ValidationResult {
  const clean = expiry.trim();
  if (!clean) {
    return { isValid: false, error: 'Expiry date is required.' };
  }
  if (!/^\d{2}\/\d{2}$/.test(clean)) {
    return { isValid: false, error: 'Enter expiry as MM/YY.' };
  }

  const [monthStr, yearStr] = clean.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(`20${yearStr}`, 10);

  if (month < 1 || month > 12) {
    return { isValid: false, error: 'Invalid month (01–12).' };
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { isValid: false, error: 'Card has expired.' };
  }

  if (year > currentYear + 20) {
    return { isValid: false, error: 'Expiry year is too far in future.' };
  }

  return { isValid: true, error: null };
}

/**
 * Validates card CVV/CVC code (3 or 4 digits).
 * @param cvv - Raw CVV string.
 * @returns Object with boolean isValid and error message or null.
 */
export function validateCvv(cvv: string): ValidationResult {
  const digits = cvv.replace(/\D/g, '');
  if (!digits) {
    return { isValid: false, error: 'CVV is required.' };
  }
  if (digits.length < 3 || digits.length > 4) {
    return { isValid: false, error: 'CVV must be 3 or 4 digits.' };
  }
  return { isValid: true, error: null };
}

/**
 * Validates a virtual payment address (UPI ID).
 * Standard format: handle@provider (e.g. rahul@okhdfcbank, chef@paytm)
 * @param upiId - Raw UPI ID string.
 * @returns Object with boolean isValid and error message or null.
 */
export function validateUpi(upiId: string): ValidationResult {
  const trimmed = upiId.trim();
  if (!trimmed) {
    return { isValid: false, error: 'UPI ID is required.' };
  }
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;
  if (!upiRegex.test(trimmed)) {
    return { isValid: false, error: 'Enter a valid UPI ID (e.g. yourname@upi).' };
  }
  return { isValid: true, error: null };
}

/**
 * Validates user email address format.
 * @param email - Raw email string.
 * @returns Object with boolean isValid and error message or null.
 */
export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Email address is required.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }
  return { isValid: true, error: null };
}
