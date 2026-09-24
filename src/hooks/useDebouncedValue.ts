import { useEffect, useState } from 'react';

/**
 * Hook to debounce any rapidly changing value by a specified duration.
 * Ensures typing and input controls never trigger redundant synchronous filtering.
 *
 * @param value - The input value to debounce
 * @param delay - Delay in milliseconds (default: 200ms)
 * @returns The debounced value
 */
export function useDebouncedValue<T>(value: T, delay: number = 200): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebouncedValue;
