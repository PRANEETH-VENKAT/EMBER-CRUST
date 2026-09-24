import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  /** Trigger only once and unobserve immediately */
  once?: boolean;
  /** IntersectionObserver threshold from 0 to 1 */
  threshold?: number | number[];
  /** Margin around the root element */
  rootMargin?: string;
}

/**
 * Hook to observe element visibility using IntersectionObserver.
 * Adheres strictly to the animation performance rule: no scroll event listeners,
 * unobserves after first reveal if `once` is true.
 *
 * @param options - Configuration options for the observer
 * @returns [ref, isInView]
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
): [React.RefObject<T | null>, boolean] {
  const { once = true, threshold = 0.1, rootMargin = '0px 0px -40px 0px' } = options;
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Check if IntersectionObserver is supported
    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.unobserve(node);
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [once, threshold, rootMargin]);

  return [ref, isInView];
}

export default useInView;
