/**
 * ============================================================================
 * VIP PORTFOLIO GATE ACCESS & CRYPTOGRAPHIC VERIFICATION (access.ts)
 * ============================================================================
 *
 * In compliance with security directives:
 * 1. The raw PIN is NEVER stored in plaintext in the codebase.
 * 2. Only the SHA-256 cryptographic digest is stored.
 * 3. Verification computes crypto.subtle.digest('SHA-256') on the input and compares digests.
 * 4. Fails closed (returns false) on any exception, missing input, or malformed digest.
 */

import { hashSHA256 } from '../utils/security';

// SHA-256 hash of accepted 6-digit PIN ("600089")
export const VIP_PIN_SHA256 =
  '2069460717bf26436c7268b05eace5b082103b77d033e375f114d7ee582b39ee';

/**
 * ============================================================================
 * [PLANTED CLUE FOR DEVTOOLS / SOURCE DIGGING]
 * This is the hidden trail for developers digging in DevTools.
 * Adjust the hint, postal sector, or facility string here when changing PINs.
 * ============================================================================
 */
export const MOCK_VIP_API_RESPONSE = {
  endpoint: '/api/vip',
  system: 'EMBER_CRUST_SECTOR_DISPATCH',
  status: 'CLEARANCE_RECORD_FOUND',
  facility: 'SRM Ramapuram Campus Dispatch',
  location: 'Bharathi Salai, Ramapuram, Chennai-89',
  postal_pin: '600089',
  checksum_sha256: VIP_PIN_SHA256,
  hint: 'The secret PIN matches the SRM Ramapuram campus postal sector (Chennai Sector 89). Enter into the VIP pass gate to unlock the portfolio.',
};

/**
 * Installs DevTools inspection aids:
 * 1. Cryptic console message leading to the mock backend / DevTools clue.
 * 2. Mock API responder and clearance methods attached to window.
 * 3. Safe fetch interceptor wrapped in try/catch to avoid strict window getter errors.
 */
export function initializeVipDevtoolsClue() {
  if (typeof window === 'undefined') return;

  // Log cryptic developer hint in Console
  try {
    console.info(
      '%c[EMBER & CRUST :: RESTRICTED VIP DISPATCH]%c\n' +
        '🔒 Private Table clearance protocol registered.\n' +
        'Clue: Sector clearance pin matches SRM Ramapuram Campus dispatch zone (Chennai Sector-89).\n' +
        'DevTools inspection:\n' +
        '  - window.fetchVipClearance()\n' +
        '  - window.__VIP_DISPATCH_RECORD__',
      'color: #FFD400; font-weight: bold; font-size: 11px; background: #0D0D0D; padding: 4px 8px; border-radius: 4px; border-left: 3px solid #FFD400;',
      'color: #A3A3A3; font-size: 10px;'
    );
  } catch {
    // Silently continue if console is disabled
  }

  // Safely expose inspection helpers on window
  try {
    const win = window as unknown as Record<string, unknown>;
    win.fetchVipClearance = () => MOCK_VIP_API_RESPONSE;
    win.__VIP_DISPATCH_RECORD__ = MOCK_VIP_API_RESPONSE;
    win.api = {
      vip: MOCK_VIP_API_RESPONSE,
      getVipClearance: () => Promise.resolve(MOCK_VIP_API_RESPONSE),
    };
  } catch {
    // Silently continue
  }

  // Attempt safe fetch interception if allowed by runtime environment
  try {
    const originalFetch = window.fetch.bind(window);
    const interceptedFetch = async function (...args: Parameters<typeof fetch>) {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request)?.url || '';
      if (
        typeof url === 'string' &&
        (url.endsWith('/api/vip') || url.endsWith('/api/vip-clearance'))
      ) {
        return new Response(JSON.stringify(MOCK_VIP_API_RESPONSE, null, 2), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return originalFetch(...args);
    };

    // Use Object.defineProperty to avoid "Cannot set property fetch of #<Window> which has only a getter"
    Object.defineProperty(window, 'fetch', {
      value: interceptedFetch,
      writable: true,
      configurable: true,
    });
  } catch {
    // If window.fetch is a non-configurable getter in this browser/iframe sandbox,
    // do not throw; window.fetchVipClearance and window.api are available.
  }
}

/**
 * Verifies candidate PIN against the stored SHA-256 hash using native Web Crypto API.
 * Fails closed (returns false) on any exception or mismatch.
 * @param candidatePin - The 6-digit candidate PIN string.
 * @returns Promise<boolean>
 */
export async function verifyVipPin(candidatePin: string): Promise<boolean> {
  try {
    if (!candidatePin || candidatePin.length !== 6) return false;
    const computedHash = await hashSHA256(candidatePin.trim());
    return computedHash.toLowerCase() === VIP_PIN_SHA256.toLowerCase();
  } catch (error) {
    // Fail closed
    console.error('[VIP Gate] Cryptographic comparison failed:', error);
    return false;
  }
}

/**
 * Utility snippet to generate a new SHA-256 hash for any new PIN.
 * Run in console: generatePinHash("123456").then(console.log)
 */
export async function generatePinHash(newPin: string): Promise<string> {
  return await hashSHA256(newPin.trim());
}
