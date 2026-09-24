import React from 'react';
import { Phone, Star, ShieldCheck, Bike } from 'lucide-react';

export interface DeliveryPartnerProps {
  partner?: {
    name: string;
    rating: string;
    vehicle: string;
    phone: string;
  };
}

/**
 * Delivery partner status card rendered once order reaches 'Out for Delivery'.
 *
 * // [SWAP-POINT] In production, connect to live courier GPS telemetry & real-time dispatch API.
 */
export const DeliveryPartnerCard: React.FC<DeliveryPartnerProps> = ({ partner }) => {
  const courier = partner || {
    name: 'Vikram Singh',
    rating: '4.9 ★ (420+ trips)',
    vehicle: 'Electric Two-Wheeler · Insulated Bag',
    phone: '+91 98765 00000',
  };

  return (
    <div
      id="delivery-partner-card"
      className="anim-fade-in relative overflow-hidden rounded-xl border border-[#262626] bg-[#141414] p-4 transition-colors hover:border-[#383838]"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Avatar + Details */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1F1F1F] border border-[#333333] text-[#FFD60A]">
            <Bike className="h-5 w-5" />
            <span
              className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-[#0A0A0A]"
              title="Verified Driver"
            >
              <ShieldCheck className="h-3 w-3 stroke-[3]" />
            </span>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2">
              <h4 className="font-sora text-sm font-bold text-[#F5F5F5]">
                {courier.name}
              </h4>
              <span className="flex items-center gap-1 rounded bg-[#FFD60A]/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#FFD60A]">
                <Star className="h-2.5 w-2.5 fill-current" />
                {courier.rating.split(' ')[0]}
              </span>
            </div>
            <p className="font-mono text-xs text-[#A3A3A3] mt-0.5">{courier.vehicle}</p>
          </div>
        </div>

        {/* Right: Call Button with clear simulation badge */}
        <div className="flex flex-col items-end gap-1">
          <button
            type="button"
            disabled
            title="Simulated — no real call"
            aria-label="Call delivery partner (Simulated — no real call)"
            className="flex items-center gap-1.5 rounded-lg border border-[#333333] bg-[#1F1F1F] px-3 py-1.5 font-mono text-xs font-semibold text-[#737373] opacity-80 cursor-not-allowed"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Call</span>
          </button>
          <span className="font-mono text-[9px] text-[#737373]">
            Simulated — demo only
          </span>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPartnerCard;
