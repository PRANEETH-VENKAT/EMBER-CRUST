import { useState, useEffect, useRef, useCallback } from 'react';
import { ORDERS_STORAGE_KEY } from '../../utils/constants';
import { OrderRecord } from '../../types/auth';

/**
 * Demo-friendly stage delay durations in milliseconds.
 * Adjustable constants for fast, responsive live testing.
 */
export const STAGE_DELAYS_MS = {
  PLACED: 0,
  PREPARING: 4000,
  OUT_FOR_DELIVERY: 10000,
  DELIVERED: 20000,
} as const;

export type TrackingStageId = 'PLACED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

export interface StageInfo {
  id: TrackingStageId;
  index: number;
  label: string;
  statusLine: string;
}

export const TRACKING_STAGES: StageInfo[] = [
  {
    id: 'PLACED',
    index: 0,
    label: 'Order Placed',
    statusLine: 'Your order has been received and confirmed',
  },
  {
    id: 'PREPARING',
    index: 1,
    label: 'Preparing',
    statusLine: 'The kitchen is firing up your dishes in the wood-fired oven',
  },
  {
    id: 'OUT_FOR_DELIVERY',
    index: 2,
    label: 'Out for Delivery',
    statusLine: 'Our delivery partner is en route with your fresh order',
  },
  {
    id: 'DELIVERED',
    index: 3,
    label: 'Delivered',
    statusLine: 'Order delivered. Enjoy your hot wood-fired feast!',
  },
];

export interface PersistedTrackingState {
  orderId: string;
  createdAt: number;
  stageId: TrackingStageId;
  stageTimestamps: Record<TrackingStageId, string | null>;
}

export interface UseOrderSimulationReturn {
  currentStage: TrackingStageId;
  stageIndex: number;
  stages: StageInfo[];
  timestamps: Record<TrackingStageId, string | null>;
  announcement: string;
  countdownText: string;
  isDelivered: boolean;
  isOutForDelivery: boolean;
  progressRatio: number;
  deliveryPartner: {
    name: string;
    rating: string;
    vehicle: string;
    phone: string;
  };
}

const STORAGE_PREFIX = 'ec_tracking_';

function formatTimestamp(timestamp: number = Date.now()): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Hook to drive realistic 4-stage order tracking with:
 * - LocalStorage persistence across page reloads
 * - Page Visibility API tab pause support for countdown
 * - ARIA live announcements for screen readers
 * - Clean cleanup on unmount
 *
 * // [SWAP-POINT] Replace mock simulation timer with WebSocket / Polling API in production
 */
export function useOrderSimulation(orderId: string): UseOrderSimulationReturn {
  const [currentStage, setCurrentStage] = useState<TrackingStageId>('PLACED');
  const [timestamps, setTimestamps] = useState<Record<TrackingStageId, string | null>>({
    PLACED: formatTimestamp(),
    PREPARING: null,
    OUT_FOR_DELIVERY: null,
    DELIVERED: null,
  });
  const [announcement, setAnnouncement] = useState<string>('Your order has been placed.');
  const [now, setNow] = useState<number>(() => Date.now());
  const createdAtRef = useRef<number>(Date.now());

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // Helper to safely persist order status update into central orders storage
  const syncOrderRecordStatus = useCallback(
    (targetOrderId: string, stageLabel: string) => {
      try {
        const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (!raw) return;
        const orders: OrderRecord[] = JSON.parse(raw);
        const updated = orders.map((o) =>
          o.id === targetOrderId ? { ...o, status: stageLabel } : o
        );
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors in restricted contexts
      }
    },
    []
  );

  // Update tracking state in local state and localStorage
  const applyStage = useCallback(
    (stageId: TrackingStageId, time: string = formatTimestamp()) => {
      if (!isMountedRef.current) return;

      setCurrentStage(stageId);
      setTimestamps((prev) => {
        const next = { ...prev, [stageId]: prev[stageId] || time };
        // Persist to localStorage
        try {
          const key = `${STORAGE_PREFIX}${orderId}`;
          const raw = localStorage.getItem(key);
          const existing: PersistedTrackingState = raw
            ? JSON.parse(raw)
            : {
                orderId,
                createdAt: Date.now(),
                stageId,
                stageTimestamps: next,
              };
          existing.stageId = stageId;
          existing.stageTimestamps = next;
          localStorage.setItem(key, JSON.stringify(existing));
        } catch {
          // ignore
        }
        return next;
      });

      const stageObj = TRACKING_STAGES.find((s) => s.id === stageId);
      if (stageObj) {
        setAnnouncement(`Your order is now ${stageObj.label.toLowerCase()}`);
        syncOrderRecordStatus(orderId, stageObj.label);
      }
    },
    [orderId, syncOrderRecordStatus]
  );

  // Initialize and drive stage progression
  useEffect(() => {
    isMountedRef.current = true;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    let createdAt = Date.now();
    let initialTimestamps: Record<TrackingStageId, string | null> = {
      PLACED: formatTimestamp(createdAt),
      PREPARING: null,
      OUT_FOR_DELIVERY: null,
      DELIVERED: null,
    };

    // Load persisted state if exists
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${orderId}`);
      if (raw) {
        const parsed: PersistedTrackingState = JSON.parse(raw);
        createdAt = parsed.createdAt || createdAt;
        initialTimestamps = { ...initialTimestamps, ...parsed.stageTimestamps };
      } else {
        const initData: PersistedTrackingState = {
          orderId,
          createdAt,
          stageId: 'PLACED',
          stageTimestamps: initialTimestamps,
        };
        localStorage.setItem(`${STORAGE_PREFIX}${orderId}`, JSON.stringify(initData));
      }
    } catch {
      // ignore
    }

    setTimestamps(initialTimestamps);
    createdAtRef.current = createdAt;
    setNow(Date.now());

    const elapsed = Date.now() - createdAt;

    // Determine current stage based on elapsed time since order creation
    let currentId: TrackingStageId = 'PLACED';
    if (elapsed >= STAGE_DELAYS_MS.DELIVERED) {
      currentId = 'DELIVERED';
    } else if (elapsed >= STAGE_DELAYS_MS.OUT_FOR_DELIVERY) {
      currentId = 'OUT_FOR_DELIVERY';
    } else if (elapsed >= STAGE_DELAYS_MS.PREPARING) {
      currentId = 'PREPARING';
    }

    applyStage(currentId, initialTimestamps[currentId] || formatTimestamp());

    // [SWAP-POINT] Replace mock simulation timer with WebSocket / Polling API in production
    // If not yet delivered, queue transitions for remaining stages
    if (elapsed < STAGE_DELAYS_MS.DELIVERED) {
      const scheduleTransition = (targetStage: TrackingStageId, targetDelay: number) => {
        const remainingDelay = targetDelay - elapsed;
        if (remainingDelay > 0) {
          const t = setTimeout(() => {
            if (isMountedRef.current) {
              applyStage(targetStage);
            }
          }, remainingDelay);
          timersRef.current.push(t);
        }
      };

      if (elapsed < STAGE_DELAYS_MS.PREPARING) {
        scheduleTransition('PREPARING', STAGE_DELAYS_MS.PREPARING);
      }
      if (elapsed < STAGE_DELAYS_MS.OUT_FOR_DELIVERY) {
        scheduleTransition('OUT_FOR_DELIVERY', STAGE_DELAYS_MS.OUT_FOR_DELIVERY);
      }
      scheduleTransition('DELIVERED', STAGE_DELAYS_MS.DELIVERED);
    }

    return () => {
      isMountedRef.current = false;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [orderId, applyStage]);

  // Live countdown timer with Page Visibility API support
  useEffect(() => {
    if (currentStage === 'DELIVERED') {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      return;
    }

    const tick = () => {
      // Do not tick if the browser tab is hidden
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return;
      }
      setNow(Date.now());
    };

    countdownIntervalRef.current = setInterval(tick, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [currentStage]);

  const stageIndex = TRACKING_STAGES.findIndex((s) => s.id === currentStage);
  const isDelivered = currentStage === 'DELIVERED';
  const isOutForDelivery = currentStage === 'OUT_FOR_DELIVERY' || isDelivered;
  const progressRatio = Math.max(
    0,
    Math.min(1, stageIndex / (TRACKING_STAGES.length - 1))
  );

  // Countdown is derived from real elapsed time so it always agrees with the stage timeline
  const remainingMs = Math.max(
    0,
    STAGE_DELAYS_MS.DELIVERED - (now - createdAtRef.current)
  );
  const remainingTotalSeconds = Math.ceil(remainingMs / 1000);
  const remainingMinutes = Math.floor(remainingTotalSeconds / 60);

  const countdownText = isDelivered
    ? 'Delivered! Enjoy your meal'
    : remainingMinutes > 0
      ? `Arriving in ~${remainingMinutes} min`
      : remainingTotalSeconds > 0
        ? `Arriving in ~${remainingTotalSeconds}s`
        : 'Arriving momentarily';

  return {
    currentStage,
    stageIndex,
    stages: TRACKING_STAGES,
    timestamps,
    announcement,
    countdownText,
    isDelivered,
    isOutForDelivery,
    progressRatio,
    deliveryPartner: {
      name: 'Vikram Singh',
      rating: '4.9 ★ (420+ trips)',
      vehicle: 'Electric Two-Wheeler · Insulated Bag',
      phone: '+91 98765 00000',
    },
  };
}

export default useOrderSimulation;
