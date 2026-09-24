import React, { useEffect, useRef, useState } from 'react';

/**
 * CustomCursor
 * High-performance hardware-accelerated cursor for fine-pointer devices.
 * Bridges to the club theme with a vibrant yellow accent (#FFD400).
 * Disabled automatically on touch devices and when prefers-reduced-motion is active.
 */
export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on fine-pointer devices (mouse/trackpad), not touchscreens
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check if target is interactive
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('a, button, [role="button"], input, select, textarea, .interactive-card');
        setIsHovering(!!interactive);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth lerp for outer ring
    const render = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
    >
      {/* Precision Yellow Center Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-[#FFD400] transition-opacity duration-150 will-change-transform shadow-[0_0_8px_#FFD400] ${
          isHovering ? 'scale-150 opacity-100' : 'opacity-90'
        }`}
      />

      {/* Trailing Ring with Magnetic Expansion */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border border-[#FFD400]/40 transition-[width,height,margin,border-color,background-color] duration-200 ease-out will-change-transform ${
          isHovering
            ? '-ml-5 -mt-5 h-10 w-10 border-[#FFD400] bg-[#FFD400]/10 backdrop-blur-[0.5px]'
            : '-ml-3.5 -mt-3.5 h-7 w-7'
        }`}
      />
    </div>
  );
};
