import { useEffect, useRef, useState } from 'react';
import { DEFAULT_COUNT_UP_DURATION_MS } from '../utils/constants';

/**
 * Hook to smoothly count a numerical value up or down using requestAnimationFrame.
 * Honors prefers-reduced-motion by updating immediately without frame interpolation.
 *
 * @param target - The destination number to interpolate towards
 * @param duration - Animation duration in ms (default: 300ms)
 * @returns The current animated number value
 */
export function useCountUp(
  target: number,
  duration: number = DEFAULT_COUNT_UP_DURATION_MS
): number {
  const [current, setCurrent] = useState<number>(target);
  const currentRef = useRef<number>(target);
  const startRef = useRef<number>(target);
  const targetRef = useRef<number>(target);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // If the target didn't change, do nothing
    if (target === currentRef.current && target === targetRef.current) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || duration <= 0) {
      currentRef.current = target;
      setCurrent(target);
      startRef.current = target;
      targetRef.current = target;
      return;
    }

    startRef.current = currentRef.current;
    targetRef.current = target;
    startTimeRef.current = null;

    const easeOutQuad = (t: number): number => t * (2 - t);

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);

      const nextValue = Math.round(
        startRef.current + (targetRef.current - startRef.current) * easedProgress
      );
      currentRef.current = nextValue;
      setCurrent(nextValue);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        currentRef.current = targetRef.current;
        setCurrent(targetRef.current);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration]);

  return current;
}

export default useCountUp;
