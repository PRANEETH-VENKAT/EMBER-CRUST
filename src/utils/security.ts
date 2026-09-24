/**
 * Security helpers (client-side only).
 *
 * This is a frontend-only demo. Anything here is a UX-level guard, not a real
 * security boundary: production use needs server-side validation, real auth
 * and a PCI-compliant payment gateway.
 */

/**
 * Computes a SHA-256 hex digest using the native Web Crypto API.
 * Used by the VIP pincode gate so the raw PIN never sits in the source code.
 */
export async function hashSHA256(input: string): Promise<string> {
  const data = new TextEncoder().encode(String(input).trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Session auto-expires after 20 minutes of inactivity (warning 1 minute before). */
export const INACTIVITY_TIMEOUT_MS = 20 * 60 * 1000;
export const INACTIVITY_WARNING_MS = 19 * 60 * 1000;
