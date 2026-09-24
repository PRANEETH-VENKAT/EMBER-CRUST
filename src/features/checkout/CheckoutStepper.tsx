import React from 'react';
import { Check } from 'lucide-react';
import { CheckoutStep } from './CheckoutContext';

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
  onStepClick?: (step: CheckoutStep) => void;
}

interface StepMeta {
  number: CheckoutStep;
  title: string;
}

const STEPS: StepMeta[] = [
  { number: 1, title: 'Review' },
  { number: 2, title: 'Delivery' },
  { number: 3, title: 'Payment' },
  { number: 4, title: 'Confirmation' },
];

export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({
  currentStep,
  onStepClick,
}) => {
  // Calculate scaleX progress ratio: step 1 (0%), step 2 (33%), step 3 (66%), step 4 (100%)
  const progressRatio = Math.max(0, Math.min(1, (currentStep - 1) / (STEPS.length - 1)));

  return (
    <nav
      aria-label="Checkout Progress"
      className="relative w-full border-b border-[#262626] bg-[#0E0E0E] px-4 py-4 sm:px-8"
    >
      <div className="relative mx-auto max-w-2xl">
        {/* Background track */}
        <div
          className="absolute top-4 left-4 right-4 h-0.5 -translate-y-1/2 bg-[#262626]"
          aria-hidden="true"
        />

        {/* Filled progress bar - strictly transform: scaleX only */}
        <div
          className="absolute top-4 left-4 right-4 h-0.5 -translate-y-1/2 bg-[#FFD60A] transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] origin-left"
          style={{
            transform: `scaleX(${progressRatio})`,
          }}
          aria-hidden="true"
        />

        {/* Stepper items */}
        <ol className="relative flex justify-between">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isClickable =
              onStepClick && step.number < currentStep && currentStep !== 4;

            return (
              <li
                key={step.number}
                className="flex flex-col items-center"
                aria-current={isCurrent ? 'step' : undefined}
              >
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick(step.number)}
                  className={`group relative flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-bold transition-all duration-[var(--dur-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A] ${
                    isCompleted
                      ? 'border border-emerald-500 bg-emerald-500 text-black shadow-sm'
                      : isCurrent
                        ? 'border-2 border-[#FFD60A] bg-[#FFD60A] text-black shadow-md shadow-[#FFD60A]/20 scale-105'
                        : 'border border-[#383838] bg-[#1A1A1A] text-[#A3A3A3]'
                  } ${isClickable ? 'cursor-pointer hover:border-[#FFD60A]' : 'cursor-default'}`}
                  aria-label={`Step ${step.number}: ${step.title}${
                    isCompleted ? ' (Completed)' : isCurrent ? ' (Current step)' : ''
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 stroke-[3]" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </button>

                <span
                  className={`mt-2 font-mono text-[11px] font-semibold tracking-wider transition-colors ${
                    isCurrent
                      ? 'text-[#FFD60A]'
                      : isCompleted
                        ? 'text-[#F5F5F5]'
                        : 'text-[#737373]'
                  }`}
                >
                  {step.title}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
