import React from 'react';
import { useInView } from '../../hooks/useInView';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger or delay offset in milliseconds */
  delay?: number;
  /** Whether to animate transform (up) or fade-only */
  direction?: 'up' | 'none';
  /** Optional HTML tag type to render */
  as?: React.ElementType;
}

/**
 * Reusable scroll reveal component that fades and lifts elements into view
 * using IntersectionObserver. Unobserves once revealed for zero background overhead.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  as: Component = 'div',
}) => {
  const [ref, isInView] = useInView<HTMLDivElement>({ once: true, threshold: 0.1 });

  return (
    <Component
      ref={ref}
      className={`transition-all duration-[var(--dur-slow)] ease-[var(--ease-out)] ${
        isInView
          ? 'opacity-100 translate-y-0'
          : direction === 'up'
            ? 'opacity-0 translate-y-4'
            : 'opacity-0'
      } ${className}`}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
      }}
    >
      {children}
    </Component>
  );
};

export default Reveal;
