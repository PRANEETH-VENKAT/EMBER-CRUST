import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Lock, Unlock, X, ShieldAlert, Sparkles, Clock } from 'lucide-react';
import { verifyVipPin } from '../config/access';
import { VIP_PIN_LENGTH, VIP_UNLOCK_TRANSITION_MS } from '../utils/constants';

interface VipGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: () => void;
  triggerElement?: HTMLElement | null;
}

const STORAGE_KEY_FAILED = 'vip_gate_failed_attempts';
const STORAGE_KEY_LOCKOUT_UNTIL = 'vip_gate_lockout_until';
const STORAGE_KEY_PENALTY = 'vip_gate_penalty_seconds';

/**
 * VIP Gate PIN modal protecting access to the Premier View.
 * Enforces SHA-256 cryptographic hash comparison (raw PIN never stored in source).
 * Locks input for 30s after 3 wrong attempts, doubling penalties on repeat lockouts (30s -> 60s -> 120s).
 * Persists lockout state in sessionStorage. Fails closed on any error.
 */
export const VipGateModal: React.FC<VipGateModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
  triggerElement,
}) => {
  const [digits, setDigits] = useState<string[]>(Array(VIP_PIN_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lockoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUnlockedRef = useRef<boolean>(false);

  useEffect(() => {
    isUnlockedRef.current = isUnlocked;
  }, [isUnlocked]);

  // Check persisted lockout on mount or open
  const checkPersistedLockout = useCallback(() => {
    try {
      const untilStr = sessionStorage.getItem(STORAGE_KEY_LOCKOUT_UNTIL);
      if (untilStr) {
        const until = parseInt(untilStr, 10);
        const diffSec = Math.ceil((until - Date.now()) / 1000);
        if (diffSec > 0) {
          setLockoutRemaining(diffSec);
          setErrorMessage(`Security lockout active. Please wait ${diffSec}s.`);
          return true;
        } else {
          sessionStorage.removeItem(STORAGE_KEY_LOCKOUT_UNTIL);
          setLockoutRemaining(0);
        }
      }
    } catch (e) {
      console.warn('Storage read warning:', e);
    }
    return false;
  }, []);

  const handleClose = useCallback(() => {
    setDigits(Array(VIP_PIN_LENGTH).fill(''));
    setIsShaking(false);
    setIsUnlocked(false);
    setErrorMessage(null);
    onClose();
  }, [onClose]);

  // Reset the gate whenever it opens/closes. Runs ONLY on isOpen changes, so a successful
  // unlock (or a lockout tick) never wipes the modal's own state mid-flow.
  useEffect(() => {
    setDigits(Array(VIP_PIN_LENGTH).fill(''));
    setIsShaking(false);
    setIsUnlocked(false);
    setErrorMessage(null);
    if (!isOpen) return;

    const isCurrentlyLocked = checkPersistedLockout();
    const focusTimer = setTimeout(() => {
      if (isCurrentlyLocked) {
        closeButtonRef.current?.focus();
      } else {
        inputRefs.current[0]?.focus();
      }
    }, 60);

    return () => clearTimeout(focusTimer);
  }, [isOpen, checkPersistedLockout]);

  // Escape key + focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      // Trap focus
      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;

        const firstEl = focusable[0];
        const lastEl = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Hand focus back to the element that opened the gate when it closes
  useEffect(() => {
    if (!isOpen) return;
    return () => {
      // After a successful unlock the portfolio takes over focus, so only refocus on cancel
      if (!isUnlockedRef.current) triggerElement?.focus();
    };
  }, [isOpen, triggerElement]);

  // Handle countdown for lockout
  useEffect(() => {
    if (lockoutRemaining <= 0) {
      if (lockoutTimerRef.current) {
        clearInterval(lockoutTimerRef.current);
        lockoutTimerRef.current = null;
      }
      return;
    }

    lockoutTimerRef.current = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(lockoutTimerRef.current as ReturnType<typeof setTimeout>);
          lockoutTimerRef.current = null;
          try {
            sessionStorage.removeItem(STORAGE_KEY_LOCKOUT_UNTIL);
          } catch {
            // ignore
          }
          setErrorMessage(null);
          setTimeout(() => inputRefs.current[0]?.focus(), 50);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (lockoutTimerRef.current) {
        clearInterval(lockoutTimerRef.current);
      }
    };
  }, [lockoutRemaining]);

  if (!isOpen) return null;

  const isLockedOut = lockoutRemaining > 0;

  const handleDigitChange = (index: number, val: string) => {
    if (isLockedOut || isUnlocked || isVerifying) return;

    const cleaned = val.replace(/\D/g, '');
    if (!cleaned) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    // Single digit input
    const char = cleaned[cleaned.length - 1];
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto advance to next box
    if (index < VIP_PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check code if all digits filled
    const fullCode = newDigits.join('');
    if (fullCode.length === VIP_PIN_LENGTH) {
      handleVerify(fullCode);
    }
  };

  const handleKeyDownInput = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (isLockedOut || isUnlocked || isVerifying) return;

    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        e.preventDefault();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < VIP_PIN_LENGTH - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (isLockedOut || isUnlocked || isVerifying) return;

    const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '');
    if (!pastedData) return;

    const newDigits = [...digits];
    for (let i = 0; i < VIP_PIN_LENGTH; i++) {
      if (i < pastedData.length) {
        newDigits[i] = pastedData[i];
      }
    }
    setDigits(newDigits);

    const focusIndex = Math.min(pastedData.length, VIP_PIN_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();

    if (newDigits.filter(Boolean).length === VIP_PIN_LENGTH) {
      handleVerify(newDigits.join(''));
    }
  };

  const handleVerify = async (candidateCode: string) => {
    setIsVerifying(true);

    try {
      const isMatch = await verifyVipPin(candidateCode);

      if (isMatch) {
        // Success: clear failed-attempt and lockout counters (unlock state itself is memory-only)
        try {
          sessionStorage.removeItem(STORAGE_KEY_FAILED);
          sessionStorage.removeItem(STORAGE_KEY_LOCKOUT_UNTIL);
          sessionStorage.removeItem(STORAGE_KEY_PENALTY);
        } catch {
          // ignore
        }

        setIsUnlocked(true);
        setErrorMessage(null);

        setTimeout(() => {
          setIsVerifying(false);
          onUnlockSuccess();
        }, VIP_UNLOCK_TRANSITION_MS);
        return;
      }

      // Wrong PIN: Read and increment failed attempts
      let failed = 1;
      try {
        const prev = parseInt(sessionStorage.getItem(STORAGE_KEY_FAILED) || '0', 10);
        failed = prev + 1;
        sessionStorage.setItem(STORAGE_KEY_FAILED, String(failed));
      } catch {
        // ignore
      }

      setIsShaking(true);

      // Lockout check after 3 failed attempts
      if (failed >= 3) {
        let penalty = 30; // base 30 seconds
        try {
          const storedPenalty = parseInt(
            sessionStorage.getItem(STORAGE_KEY_PENALTY) || '30',
            10
          );
          penalty = storedPenalty;
          // Next penalty doubles
          sessionStorage.setItem(STORAGE_KEY_PENALTY, String(penalty * 2));
          sessionStorage.setItem(
            STORAGE_KEY_LOCKOUT_UNTIL,
            String(Date.now() + penalty * 1000)
          );
          sessionStorage.setItem(STORAGE_KEY_FAILED, '0');
        } catch {
          // ignore
        }

        setLockoutRemaining(penalty);
        setErrorMessage(
          `Too many failed attempts. Security lockout active: ${penalty}s.`
        );
      } else {
        const remaining = 3 - failed;
        setErrorMessage(
          `Incorrect PIN. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before lockout.`
        );
      }

      setTimeout(() => {
        setIsShaking(false);
        setDigits(Array(VIP_PIN_LENGTH).fill(''));
        if (failed < 3) {
          inputRefs.current[0]?.focus();
        }
        setIsVerifying(false);
      }, 400);
    } catch (err) {
      // Fail closed
      console.error('[VIP Gate Verification Error]', err);
      setIsVerifying(false);
      setErrorMessage('Verification failed. Try again.');
      setDigits(Array(VIP_PIN_LENGTH).fill(''));
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vip-gate-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-md rounded-2xl border border-[#262626] bg-[#0F0F0F] p-6 sm:p-8 shadow-2xl text-center transition-all ${
          isShaking ? 'anim-shake border-red-500/50' : ''
        } ${isUnlocked ? 'anim-unlock border-[#FFD60A]' : ''}`}
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={handleClose}
          id="vip-gate-close-btn"
          aria-label="Close VIP Gate"
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-lg border border-[#262626] bg-[#141414] text-[#A3A3A3] hover:text-[#F5F5F5] hover:border-[#FFD60A] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Lock Icon Emblem */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#262626] bg-[#141414] text-[#FFD60A] shadow-inner">
          {isUnlocked ? (
            <Unlock className="h-7 w-7 text-[#FFD60A] animate-pulse" />
          ) : (
            <Lock className="h-7 w-7 text-[#FFD60A]" />
          )}
        </div>

        {/* Header Title */}
        <h2
          id="vip-gate-title"
          className="font-bebas text-3xl sm:text-4xl text-[#F5F5F5] tracking-wider"
        >
          {isUnlocked ? 'ACCESS GRANTED' : 'PRIVATE VIP TABLE'}
        </h2>

        {/* Subtitle instructions */}
        <p className="mt-2 text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
          {isUnlocked
            ? 'Access authenticated. Loading premier portfolio canvas…'
            : isLockedOut
              ? 'Maximum attempts exceeded. Cryptographic cooldown in progress.'
              : 'Enter the chefs 6-digit secret code to see exactly how he cooks.'}
        </p>

        {/* Digit Input Boxes */}
        <div
          className="mt-6 flex justify-center gap-2 sm:gap-3"
          role="group"
          aria-label="6-digit PIN input"
        >
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              disabled={isLockedOut || isUnlocked || isVerifying}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDownInput(idx, e)}
              onPaste={handlePaste}
              aria-label={`Digit ${idx + 1}`}
              autoComplete="off"
              className={`h-12 w-10 sm:h-14 sm:w-12 rounded-xl border text-center font-mono text-xl sm:text-2xl font-bold transition-all duration-[var(--dur-fast)] focus:outline-none ${
                isLockedOut
                  ? 'border-[#222222] bg-[#0A0A0A] text-[#555555] cursor-not-allowed'
                  : isUnlocked
                    ? 'border-[#FFD60A] bg-[#FFD60A]/10 text-[#FFD60A]'
                    : digit
                      ? 'border-[#FFD60A] bg-[#1A1A1A] text-[#FFD60A] shadow-[0_0_10px_rgba(255,214,10,0.15)]'
                      : 'border-[#333333] bg-[#141414] text-white hover:border-[#555555] focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A]'
              }`}
            />
          ))}
        </div>

        {/* Error or Cooldown Status */}
        {errorMessage && (
          <div
            className={`mt-4 flex items-center justify-center gap-2 font-mono text-xs ${
              isLockedOut ? 'text-amber-400 font-bold' : 'text-rose-400'
            }`}
            role="alert"
          >
            {isLockedOut ? (
              <Clock className="h-4 w-4 animate-spin shrink-0" />
            ) : (
              <ShieldAlert className="h-4 w-4 shrink-0" />
            )}
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Lockout Countdown Timer */}
        {isLockedOut && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 font-mono text-xs font-semibold text-amber-300">
            <span>Cooldown:</span>
            <span className="text-white font-bold">{lockoutRemaining}s</span>
          </div>
        )}

        {/* Cryptic dev hint indicator */}
        <div className="mt-6 border-t border-[#1F1F1F] pt-4 text-center">
          <p className="font-mono text-[11px] text-[#737373] flex items-center justify-center gap-1.5">
            <Sparkles className="h-3 w-3 text-[#FFD60A]" />
            <span>Hint: SRM Ramapuram Campus dispatch sector (DevTools /api/vip)</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VipGateModal;
