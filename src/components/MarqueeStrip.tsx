import React, { useEffect, useRef, useState } from 'react';

const MARQUEE_ITEMS = [
  '48H COLD-FERMENTED SOURDOUGH',
  '900° LIVE OAK WOOD-FIRE',
  'PRIME CAST-IRON SMASH BURGERS',
  'SAN MARZANO D.O.P. TOMATOES',
  'HOUSE-MADE BUFFALO SCAMORZA',
  'ZERO PRESERVATIVES • 100% ARTISANAL',
  'SCRATCH-MADE BRIOCHE & DIPS',
];

/**
 * Reusable Marquee strip adhering strictly to performance rules:
 * - Only one infinite animation on the entire site
 * - Transforms ONLY translateX
 * - Pauses via IntersectionObserver when off-screen to save GPU cycles
 * - Pauses on hover
 * - Disables movement completely under prefers-reduced-motion
 */
export const MarqueeStrip: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`marquee-container relative w-full max-w-full overflow-hidden border-y border-[#262626] bg-[#0E0E0E] py-2.5 select-none ${
        !isVisible ? 'marquee-paused' : ''
      }`}
    >
      <div className="marquee-track flex gap-8 items-center font-mono text-xs tracking-wider text-[#A3A3A3]">
        {/* Render twice for continuous loop */}
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
          <span key={`${item}-${idx}`} className="flex items-center gap-6 shrink-0">
            <span className="hover:text-[#FFD60A] transition-colors">{item}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFD60A]" />
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeStrip;
