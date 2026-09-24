import React, { useEffect, useState, useRef, useCallback } from 'react';
import { AlertCircle, Clock, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { INACTIVITY_TIMEOUT_MS, INACTIVITY_WARNING_MS } from '../utils/security';

/**
 * SessionInactivityHandler
 * Manages 20-minute client inactivity session timeout:
 * - Warns the user 1 minute before expiry (at minute 19)
 * - Logs user out and clears the cart state at minute 20
 * - Resets on any user interaction (pointer, keyboard, scroll, touch)
 */
export const SessionInactivityHandler: React.FC = () => {
  const { user, logout } = useAuth();
  const { clearCart, cart } = useCart();

  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);
  const [expiredNotice, setExpiredNotice] = useState<boolean>(false);

  const lastActivityRef = useRef<number>(Date.now());
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetInactivityTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setShowWarning(false);
    setSecondsRemaining(60);

    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    // Only monitor if user is logged in or has items in cart
    if (!user && cart.length === 0) return;

    // Set 19-minute advance warning
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      setSecondsRemaining(60);

      // Start 60-second countdown
      countdownIntervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, INACTIVITY_WARNING_MS);

    // Set 20-minute expiration
    timeoutTimerRef.current = setTimeout(() => {
      setShowWarning(false);
      setExpiredNotice(true);
      logout();
      clearCart();

      // Clear expired notification after 8s
      setTimeout(() => {
        setExpiredNotice(false);
      }, 8000);
    }, INACTIVITY_TIMEOUT_MS);
  }, [user, cart.length, logout, clearCart]);

  useEffect(() => {
    resetInactivityTimer();

    // Throttled activity listener
    let throttleTimer: ReturnType<typeof setTimeout> | null = null;
    const handleUserActivity = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
        if (!showWarning) {
          lastActivityRef.current = Date.now();
        }
      }, 2000);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((evt) =>
      window.addEventListener(evt, handleUserActivity, { passive: true })
    );

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleUserActivity));
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [resetInactivityTimer, showWarning]);

  if (!showWarning && !expiredNotice) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full anim-slide-up pointer-events-auto">
      {showWarning && (
        <div className="rounded-2xl border border-amber-500/50 bg-[#161205]/95 p-4 shadow-2xl backdrop-blur-md text-[#F5F5F5]">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-sora text-sm font-bold text-amber-300">
                Session Inactivity Warning
              </h4>
              <p className="mt-1 text-xs text-[#D4D4D4] leading-relaxed">
                Your session and cart will expire in{' '}
                <span className="font-mono font-bold text-white">
                  {secondsRemaining}s
                </span>{' '}
                due to inactivity.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetInactivityTimer}
                  className="rounded-full bg-[#FFD400] px-3.5 py-1 font-mono text-xs font-bold text-black hover:bg-[#FFE359] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
                >
                  Keep Me Active
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {expiredNotice && (
        <div className="rounded-2xl border border-rose-500/40 bg-[#1A0A0A]/95 p-4 shadow-2xl backdrop-blur-md text-[#F5F5F5]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-sora text-sm font-bold text-rose-300">
                  Session Expired
                </h4>
                <p className="mt-1 text-xs text-[#A3A3A3]">
                  You were logged out and cart items were cleared after 20 minutes of
                  inactivity.
                </p>
              </div>
            </div>
            <button
              onClick={() => setExpiredNotice(false)}
              className="text-[#737373] hover:text-white"
              aria-label="Dismiss notice"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionInactivityHandler;
