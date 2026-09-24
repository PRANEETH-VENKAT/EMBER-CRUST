import React, { useEffect, useState } from 'react';
import {
  X,
  Clock,
  MapPin,
  Receipt,
  Utensils,
  CheckCircle2,
  ShoppingBag,
  Flame,
  Bike,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import { OrderTracking } from '../features/checkout/OrderTracking';
import { STAGE_DELAYS_MS } from '../features/checkout/useOrderSimulation';

export const OrdersModal: React.FC = () => {
  const { isOrdersModalOpen, closeOrdersModal, orders } = useAuth();
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);
  const [, setTick] = useState<number>(0);

  // Interval to update live order status transitions for recent orders
  useEffect(() => {
    if (!isOrdersModalOpen) return;

    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1500);

    return () => clearInterval(interval);
  }, [isOrdersModalOpen]);

  // Handle ESC key (returns from tracking view or closes modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOrdersModalOpen) {
        if (activeTrackingOrderId) {
          setActiveTrackingOrderId(null);
        } else {
          closeOrdersModal();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOrdersModalOpen, activeTrackingOrderId, closeOrdersModal]);

  if (!isOrdersModalOpen) return null;

  // Compute live stage based on persistent elapsed time
  const getLiveStage = (orderId: string, baseStatus: string) => {
    try {
      const raw = localStorage.getItem(`ec_tracking_${orderId}`);
      if (!raw) return baseStatus;
      const parsed = JSON.parse(raw);
      const elapsed = Date.now() - (parsed.createdAt || 0);

      if (elapsed >= STAGE_DELAYS_MS.DELIVERED) return 'Delivered';
      if (elapsed >= STAGE_DELAYS_MS.OUT_FOR_DELIVERY) return 'Out for Delivery';
      if (elapsed >= STAGE_DELAYS_MS.PREPARING) return 'Preparing';
      return 'Order Placed';
    } catch {
      return baseStatus;
    }
  };

  const activeOrder = activeTrackingOrderId
    ? orders.find((o) => o.id === activeTrackingOrderId)
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="orders-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Dark backdrop (solid alpha, ZERO backdrop-filter blur) */}
      <div
        className="anim-fade-in fixed inset-0 bg-black/85 transition-opacity"
        onClick={() => {
          setActiveTrackingOrderId(null);
          closeOrdersModal();
        }}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="anim-modal-scale-in relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-[#262626] bg-[#0A0A0A] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#262626] bg-[#111111] px-6 py-4">
          <div className="flex items-center gap-2.5">
            {activeTrackingOrderId ? (
              <button
                type="button"
                onClick={() => setActiveTrackingOrderId(null)}
                className="press-scale flex h-8 w-8 items-center justify-center rounded-lg border border-[#333333] bg-[#1F1F1F] text-[#FFD60A] hover:border-[#FFD60A] transition-colors"
                aria-label="Back to all orders"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1F1F1F] border border-[#333333] text-[#FFD60A]">
                <Receipt className="h-4 w-4" />
              </div>
            )}
            <div>
              <h2
                id="orders-modal-title"
                className="font-sora text-sm font-bold text-[#F5F5F5]"
              >
                {activeTrackingOrderId
                  ? `Track Order · ${activeTrackingOrderId}`
                  : 'My Orders'}
              </h2>
              <span className="font-mono text-[10px] text-[#A3A3A3]">
                {activeTrackingOrderId
                  ? 'Real-time wood-fired dispatch simulation'
                  : 'Order history stored locally on this device'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveTrackingOrderId(null);
              closeOrdersModal();
            }}
            aria-label="Close orders modal"
            className="press-scale flex h-8 w-8 items-center justify-center rounded-lg border border-[#262626] bg-[#1A1A1A] text-[#A3A3A3] hover:border-[#FFD60A] hover:text-[#F5F5F5] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeOrder ? (
            /* Live Step-Based Order Tracking View */
            <div className="space-y-4 anim-fade-in">
              <OrderTracking
                orderId={activeOrder.id}
                deliveryAddress={activeOrder.deliveryAddress}
                totalAmount={activeOrder.total}
                itemsSummary={activeOrder.itemsSummary}
                showBackToMenu={false}
              />
              <div className="pt-2 flex justify-start">
                <button
                  type="button"
                  onClick={() => setActiveTrackingOrderId(null)}
                  className="press-scale flex items-center gap-1.5 font-mono text-xs text-[#A3A3A3] hover:text-[#FFD60A] transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Return to Order History</span>
                </button>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#141414] border border-[#262626] text-[#737373] mb-4">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="font-sora text-base font-bold text-[#F5F5F5]">
                No Orders Placed Yet
              </h3>
              <p className="mt-1.5 max-w-sm font-inter text-xs text-[#A3A3A3]">
                Your completed orders from this session and past checkouts will appear
                right here.
              </p>
              <button
                type="button"
                onClick={closeOrdersModal}
                className="press-scale mt-5 rounded-full bg-[#FFD60A] px-5 py-2 font-mono text-xs font-bold text-[#0A0A0A] hover:bg-[#E5C009] transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const liveStatus = getLiveStage(order.id, order.status);
                const isDelivered = liveStatus === 'Delivered';
                const isOutForDelivery = liveStatus === 'Out for Delivery';
                const isPreparing = liveStatus === 'Preparing';

                return (
                  <div
                    key={order.id}
                    onClick={() => setActiveTrackingOrderId(order.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveTrackingOrderId(order.id);
                      }
                    }}
                    className="group rounded-xl border border-[#262626] bg-[#141414] p-4 transition-colors hover:border-[#FFD60A]/60 cursor-pointer space-y-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
                  >
                    {/* Order Top Line */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#222222] pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#FFD60A]">
                          {order.id}
                        </span>

                        {/* Status Badge with Stage-Specific Color */}
                        <span
                          className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold transition-colors ${
                            isDelivered
                              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                              : isOutForDelivery
                                ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400 anim-pulse-opacity'
                                : isPreparing
                                  ? 'border-amber-500/40 bg-amber-500/10 text-[#FFD60A] anim-pulse-opacity'
                                  : 'border-sky-500/40 bg-sky-500/10 text-sky-400'
                          }`}
                        >
                          {isDelivered ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : isOutForDelivery ? (
                            <Bike className="h-3 w-3" />
                          ) : isPreparing ? (
                            <Flame className="h-3 w-3" />
                          ) : (
                            <ShoppingBag className="h-3 w-3" />
                          )}
                          <span>{liveStatus}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-xs text-[#737373]">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{order.date}</span>
                      </div>
                    </div>

                    {/* Items Summary */}
                    <div>
                      <div className="flex items-start gap-2 font-inter text-xs text-[#F5F5F5]">
                        <Utensils className="h-4 w-4 text-[#FFD60A] shrink-0 mt-0.5" />
                        <p className="leading-relaxed">{order.itemsSummary}</p>
                      </div>
                    </div>

                    {/* Bottom Line: Address, Total, and Track Action */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#222222] pt-2.5 font-mono text-xs">
                      <div className="flex items-center gap-2 text-[#737373] text-[11px] truncate max-w-xs">
                        <MapPin className="h-3.5 w-3.5 text-[#A3A3A3] shrink-0" />
                        <span className="truncate">
                          {order.deliveryAddress.name} · {order.deliveryAddress.city}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bebas text-lg text-[#FFD60A]">
                          {formatCurrency(order.total)}
                        </span>
                        <div className="flex items-center gap-1 rounded bg-[#1F1F1F] group-hover:bg-[#FFD60A] px-2 py-1 text-[11px] font-bold text-[#A3A3A3] group-hover:text-[#0A0A0A] transition-colors">
                          <span>Track</span>
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersModal;
