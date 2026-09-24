import { useEffect, useState, RefObject } from 'react';

interface IndicatorStyle {
  transform: string;
  width: string;
  opacity: number;
}

/**
 * Hook to position a single sliding indicator pill behind an active item in a container.
 * Calculates position on active key change or container resize, animating with transform: translateX.
 *
 * @param containerRef - Ref to the scroll/flex container of items
 * @param activeId - Identifier or index of the currently active child button/element
 * @returns Indicator position styles and measurement state
 */
export function useSlidingIndicator(
  containerRef: RefObject<HTMLElement | null>,
  activeId: string | number
): { indicatorStyle: IndicatorStyle; isReady: boolean } {
  const [style, setStyle] = useState<IndicatorStyle>({
    transform: 'translateX(0px)',
    width: '0px',
    opacity: 0,
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measureActive = () => {
      // Find element with data-active="true" or matching aria-pressed
      const activeElement =
        container.querySelector<HTMLElement>('[aria-pressed="true"]') ||
        container.querySelector<HTMLElement>(`[data-indicator-id="${activeId}"]`);

      if (!activeElement) return;

      const left = activeElement.offsetLeft;
      const width = activeElement.offsetWidth;

      setStyle({
        transform: `translateX(${left}px)`,
        width: `${width}px`,
        opacity: 1,
      });
      setIsReady(true);
    };

    // Measure initially
    measureActive();

    // Use ResizeObserver to update on container or window layout changes
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        measureActive();
      });
      resizeObserver.observe(container);
    } else {
      window.addEventListener('resize', measureActive);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', measureActive);
      }
    };
  }, [containerRef, activeId]);

  return { indicatorStyle: style, isReady };
}

export default useSlidingIndicator;
