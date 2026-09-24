import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { CheckoutProvider, useCheckout, CheckoutStep } from './CheckoutContext';
import { CheckoutStepper } from './CheckoutStepper';
import { ReviewStep } from './ReviewStep';
import { DeliveryStep } from './DeliveryStep';
import { PaymentStep } from './PaymentStep';
import { ConfirmationStep } from './ConfirmationStep';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModalInner: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state, goToStep } = useCheckout();
  const { step, isProcessing } = state;
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key (unless payment is actively processing)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProcessing, onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleStepClick = (targetStep: CheckoutStep) => {
    if (!isProcessing && targetStep < step && step !== 4) {
      goToStep(targetStep);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
    >
      {/* Backdrop (solid alpha dark, ZERO backdrop-filter blur) */}
      <div
        className="anim-fade-in fixed inset-0 bg-black/85 transition-opacity"
        onClick={() => {
          if (!isProcessing) onClose();
        }}
        aria-hidden="true"
      />

      {/* Modal Dialog Body */}
      <div
        ref={modalRef}
        className="anim-modal-scale-in relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl border border-[#262626] bg-[#0A0A0A] shadow-2xl overflow-hidden"
      >
        {/* Top Bar with Brand & Close Button */}
        <div className="flex h-16 items-center justify-between border-b border-[#262626] bg-[#111111] px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1F1F1F] border border-[#333333] text-[#FFD60A]">
              <span className="font-bebas text-lg leading-none">E&amp;C</span>
            </div>
            <div>
              <h1
                id="checkout-modal-title"
                className="font-sora text-sm font-bold text-[#F5F5F5] leading-none"
              >
                Wood-Fired Express Checkout
              </h1>
              <span className="font-mono text-[10px] text-[#A3A3A3]">
                Artisanal Kitchen Dispatch
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            aria-label="Close checkout"
            className="press-scale flex h-9 w-9 items-center justify-center rounded-lg border border-[#262626] bg-[#1A1A1A] text-[#A3A3A3] hover:border-[#FFD60A] hover:text-[#F5F5F5] transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Stepper Header */}
        <CheckoutStepper currentStep={step} onStepClick={handleStepClick} />

        {/* Scrollable Step Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {step === 1 && <ReviewStep onClose={onClose} />}
          {step === 2 && <DeliveryStep />}
          {step === 3 && <PaymentStep />}
          {step === 4 && <ConfirmationStep onFinish={onClose} />}
        </div>
      </div>
    </div>
  );
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <CheckoutProvider>
      <CheckoutModalInner onClose={onClose} />
    </CheckoutProvider>
  );
};

export default CheckoutModal;
