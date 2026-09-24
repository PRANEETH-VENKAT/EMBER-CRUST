import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Flame,
  Bike,
  CheckCircle2,
  Clock,
  MapPin,
  Check,
  ChefHat,
  ArrowRight,
} from 'lucide-react';
import { useOrderSimulation } from './useOrderSimulation';
import { DeliveryPartnerCard } from './DeliveryPartnerCard';
import { SplitSummaryCard } from '../split/SplitSummaryCard';
import { SplitCalculationResult } from '../split/splitTypes';

export interface OrderTrackingProps {
  orderId: string;
  deliveryAddress?: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    pincode?: string;
  };
  totalAmount?: number;
  itemsSummary?: string;
  onBackToMenu?: () => void;
  showBackToMenu?: boolean;
  splitResult?: SplitCalculationResult | null;
}

const STAGE_ICONS = {
  PLACED: ShoppingBag,
  PREPARING: Flame,
  OUT_FOR_DELIVERY: Bike,
  DELIVERED: CheckCircle2,
};

/**
 * Order Tracking view with live 4-stage stepper, countdown, partner card, and screen reader announcements.
 *
 * // [SWAP-POINT] In production, replace useOrderSimulation with real-time websocket/polling subscription.
 */
export const OrderTracking: React.FC<OrderTrackingProps> = ({
  orderId,
  deliveryAddress,
  totalAmount: _totalAmount,
  itemsSummary,
  onBackToMenu,
  showBackToMenu = true,
  splitResult,
}) => {
  const {
    currentStage,
    stageIndex,
    stages,
    timestamps,
    announcement,
    countdownText,
    isDelivered,
    isOutForDelivery,
    progressRatio,
    deliveryPartner,
  } = useOrderSimulation(orderId);

  // Retrieve split calculation if order was placed in split mode
  const [resolvedSplit, setResolvedSplit] = useState<SplitCalculationResult | null>(
    splitResult || null
  );

  useEffect(() => {
    if (splitResult) {
      setResolvedSplit(splitResult);
      return;
    }
    if (!orderId) return;
    try {
      const stored = localStorage.getItem(`ec_order_split_${orderId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.splitResult) {
          setResolvedSplit(parsed.splitResult);
        }
      }
    } catch {
      // ignore
    }
  }, [orderId, splitResult]);

  return (
    <div id="order-tracking-view" className="space-y-6 text-left">
      {/* Visually-hidden live region for screen readers */}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {/* Header Banner: Order ID & Live Countdown Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#262626] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#FFD60A]/10 border border-[#FFD60A]/30 px-2 py-0.5 font-mono text-[11px] font-bold text-[#FFD60A]">
              ORDER TRACKER
            </span>
            <span className="font-mono text-xs font-bold text-[#F5F5F5]">{orderId}</span>
          </div>
          <h2 className="mt-1 font-sora text-xl font-bold text-[#F5F5F5]">
            {isDelivered
              ? 'Order Delivered!'
              : currentStage === 'OUT_FOR_DELIVERY'
                ? 'Out for Delivery'
                : currentStage === 'PREPARING'
                  ? 'Kitchen is Firing Up Your Order'
                  : 'Order Confirmed'}
          </h2>
        </div>

        {/* Live Countdown Pill */}
        <div
          className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-xs font-semibold ${
            isDelivered
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
              : 'border-[#333333] bg-[#141414] text-[#FFD60A]'
          }`}
        >
          <Clock className="h-4 w-4 shrink-0" />
          <span>{countdownText}</span>
        </div>
      </div>

      {/* 4-Stage Stepper: Desktop (Horizontal) */}
      <div className="hidden sm:block">
        <div className="relative pt-2 pb-6">
          {/* Base Track */}
          <div className="absolute top-7 left-12 right-12 h-1 bg-[#262626] -z-0 rounded-full" />
          {/* Filled Progress Track via scaleX */}
          <div
            className="absolute top-7 left-12 right-12 h-1 bg-[#FFD60A] -z-0 rounded-full origin-left transition-transform duration-500 ease-out"
            style={{ transform: `scaleX(${progressRatio})` }}
          />

          {/* Stepper Columns */}
          <ol className="relative z-10 grid grid-cols-4 gap-2 text-center" role="list">
            {stages.map((stage, idx) => {
              const IconComponent = STAGE_ICONS[stage.id] || ChefHat;
              const isCompleted = stageIndex > idx;
              const isActive = stageIndex === idx;
              const isUpcoming = stageIndex < idx;
              const time = timestamps[stage.id];

              return (
                <li
                  key={stage.id}
                  aria-current={isActive ? 'step' : undefined}
                  className="flex flex-col items-center group px-1"
                >
                  {/* Step Bubble */}
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors ${
                      isCompleted
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                        : isActive
                          ? 'border-[#FFD60A] bg-[#FFD60A]/20 text-[#FFD60A] anim-pulse-opacity shadow-lg shadow-[#FFD60A]/10'
                          : 'border-[#333333] bg-[#141414] text-[#737373]'
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="h-5 w-5 text-emerald-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline className="anim-draw-check" points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <IconComponent className="h-5 w-5" />
                    )}
                  </div>

                  {/* Stage Label */}
                  <span
                    className={`mt-2 font-sora text-xs font-bold ${
                      isActive
                        ? 'text-[#FFD60A]'
                        : isCompleted
                          ? 'text-[#F5F5F5]'
                          : 'text-[#737373]'
                    }`}
                  >
                    {stage.label}
                  </span>

                  {/* Timestamp */}
                  <span className="font-mono text-[10px] text-[#A3A3A3] mt-0.5">
                    {time || (isUpcoming ? 'Pending' : 'In Progress')}
                  </span>

                  {/* Status short description */}
                  <p className="mt-1 font-inter text-[11px] text-[#A3A3A3] leading-tight max-w-[130px]">
                    {stage.statusLine}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* 4-Stage Stepper: Mobile (Vertical) */}
      <div className="block sm:hidden">
        <div className="relative pl-6">
          {/* Base Vertical Line */}
          <div className="absolute top-4 bottom-4 left-3 w-0.5 bg-[#262626] -z-0" />
          {/* Filled Vertical Line via scaleY */}
          <div
            className="absolute top-4 bottom-4 left-3 w-0.5 bg-[#FFD60A] -z-0 origin-top transition-transform duration-500 ease-out"
            style={{ transform: `scaleY(${progressRatio})` }}
          />

          <ol className="space-y-6 relative z-10" role="list">
            {stages.map((stage, idx) => {
              const IconComponent = STAGE_ICONS[stage.id] || ChefHat;
              const isCompleted = stageIndex > idx;
              const isActive = stageIndex === idx;
              const isUpcoming = stageIndex < idx;
              const time = timestamps[stage.id];

              return (
                <li
                  key={stage.id}
                  aria-current={isActive ? 'step' : undefined}
                  className="flex items-start gap-3.5"
                >
                  {/* Step Bubble positioned over the line */}
                  <div
                    className={`-ml-6 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-[#0A0A0A] transition-colors ${
                      isCompleted
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                        : isActive
                          ? 'border-[#FFD60A] bg-[#FFD60A]/20 text-[#FFD60A] anim-pulse-opacity shadow-md shadow-[#FFD60A]/10'
                          : 'border-[#333333] bg-[#141414] text-[#737373]'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4 text-emerald-400 stroke-[3]" />
                    ) : (
                      <IconComponent className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`font-sora text-xs font-bold ${
                          isActive
                            ? 'text-[#FFD60A]'
                            : isCompleted
                              ? 'text-[#F5F5F5]'
                              : 'text-[#737373]'
                        }`}
                      >
                        {stage.label}
                      </span>
                      <span className="font-mono text-[10px] text-[#A3A3A3]">
                        {time || (isUpcoming ? 'Pending' : 'Now')}
                      </span>
                    </div>
                    <p className="mt-0.5 font-inter text-xs text-[#A3A3A3] leading-relaxed">
                      {stage.statusLine}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Delivery Partner Card: Pops up once Out for Delivery is reached */}
      {isOutForDelivery && <DeliveryPartnerCard partner={deliveryPartner} />}

      {/* Delivery Address & Order Info Card */}
      {deliveryAddress && (
        <div className="rounded-xl border border-[#262626] bg-[#141414] p-4 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-[#A3A3A3] border-b border-[#222222] pb-2">
            <span className="flex items-center gap-1.5 text-[#F5F5F5]">
              <MapPin className="h-3.5 w-3.5 text-[#FFD60A]" />
              Delivery Destination
            </span>
            <span className="text-[11px] text-[#737373]">
              {deliveryAddress.city || 'Chennai'}
            </span>
          </div>
          <div className="font-inter text-xs text-[#F5F5F5] leading-relaxed">
            <p className="font-semibold">{deliveryAddress.name}</p>
            <p className="text-[#A3A3A3] mt-0.5">
              {deliveryAddress.address}, {deliveryAddress.city} -{' '}
              {deliveryAddress.pincode}
            </p>
            {deliveryAddress.phone && (
              <p className="text-[#737373] text-[11px] mt-0.5">
                Contact: +91 {deliveryAddress.phone}
              </p>
            )}
          </div>
          {itemsSummary && (
            <div className="border-t border-[#222222] pt-2 text-[#A3A3A3]">
              <span className="text-[#737373]">Items: </span>
              {itemsSummary}
            </div>
          )}
        </div>
      )}

      {/* Group Bill Split Breakdown Card (If group split was used) */}
      {resolvedSplit && (
        <SplitSummaryCard
          calculation={resolvedSplit}
          title="Group Bill Split & Who Owes What"
          interactivePaid={true}
        />
      )}

      {/* Back to Menu Action */}
      {showBackToMenu && onBackToMenu && (
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={onBackToMenu}
            className="press-scale flex items-center justify-center gap-2 rounded-xl bg-[#FFD60A] px-6 py-3 font-mono text-xs font-bold text-[#0A0A0A] hover:bg-[#E5C009] transition-colors"
          >
            <span>Back to Menu</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
