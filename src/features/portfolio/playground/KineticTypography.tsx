import React, { useState, useRef, useCallback } from 'react';

interface KineticTypographyProps {
  className?: string;
  defaultWord?: string;
}

/**
 * KineticTypography
 * Interactive variable typography experiment where character tracking responds
 * dynamically to the pointer's Euclidean distance from the center.
 * Features smooth natural settling curve (0.08s ease-out) and real-time telemetry.
 */
export const KineticTypography: React.FC<KineticTypographyProps> = ({
  className = '',
  defaultWord = 'KINETIC',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeWord, setActiveWord] = useState<string>(defaultWord);
  const [letterSpacing, setLetterSpacing] = useState<string>('0.020em');
  const [telemetry, setTelemetry] = useState<{
    dist: number;
    deltaX: number;
    deltaY: number;
    isHovered: boolean;
    rawSpacing: number;
  }>({
    dist: 0,
    deltaX: 0,
    deltaY: 0,
    isHovered: false,
    rawSpacing: 0.02,
  });

  // Calculate Euclidean Distance Vector
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const dist = Math.hypot(deltaX, deltaY);

    // Dynamic Tracking Formula:
    // const spacing = Math.max(-0.04, Math.min(0.28, (180 - dist) / 500));
    const spacing = Math.max(-0.04, Math.min(0.28, (180 - dist) / 500));
    const formattedSpacing = spacing.toFixed(3) + 'em';

    setLetterSpacing(formattedSpacing);
    setTelemetry({
      dist: Math.round(dist),
      deltaX: Math.round(deltaX),
      deltaY: Math.round(deltaY),
      isHovered: true,
      rawSpacing: spacing,
    });
  }, []);

  // Natural Settling Curve on Pointer Leave
  const handlePointerLeave = useCallback(() => {
    setLetterSpacing('0.020em');
    setTelemetry((prev) => ({
      ...prev,
      isHovered: false,
      rawSpacing: 0.02,
    }));
  }, []);

  const sampleWords = ['KINETIC', 'SYNTHESIS', 'MANIFESTO', 'RADICAL'];

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#08090c] p-5 sm:p-6 shadow-2xl transition-colors duration-300 hover:border-[#e4ff3a]/40 ${className}`}
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#e4ff3a]" />
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            Variable Kinetic Typography
          </h4>
          <span className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[9px] text-[#e4ff3a] border border-[#e4ff3a]/30">
            EUCLIDEAN VECTOR VECTORIAL
          </span>
        </div>

        {/* Word Switcher Chips */}
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="text-neutral-500 mr-1 hidden sm:inline">GLYPH:</span>
          {sampleWords.map((w) => (
            <button
              key={w}
              onClick={() => setActiveWord(w)}
              className={`rounded px-2 py-0.5 transition-all cursor-pointer ${
                activeWord === w
                  ? 'bg-[#e4ff3a] text-black font-bold'
                  : 'bg-white/[0.05] text-neutral-400 hover:text-white'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Stage Display */}
      <div className="relative my-4 flex h-36 sm:h-44 w-full select-none items-center justify-center overflow-hidden rounded-xl border border-white/[0.04] bg-radial from-[#131620] to-[#08090c]">
        {/* Subtle Crosshair Center Guides */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-full w-px border-l border-dashed border-white/[0.05]" />
          <div className="w-full h-px border-t border-dashed border-white/[0.05] absolute" />
        </div>

        {/* Large Display Word with dynamic letter-spacing and CSS easing */}
        <span
          className="relative z-10 font-bold uppercase text-white font-sora text-3xl sm:text-5xl md:text-6xl tracking-tight select-none pointer-events-none"
          style={{
            letterSpacing,
            transition: 'letter-spacing 0.08s ease-out',
            textShadow: telemetry.isHovered ? '0 0 40px rgba(228, 255, 58, 0.25)' : 'none',
          }}
        >
          {activeWord}
        </span>

        {/* Distance Radius Radar Indicator */}
        {telemetry.isHovered && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full border border-[#e4ff3a]/25 transition-all duration-75"
            style={{
              width: `${Math.min(360, Math.max(40, telemetry.dist * 2))}px`,
              height: `${Math.min(360, Math.max(40, telemetry.dist * 2))}px`,
            }}
          />
        )}
      </div>

      {/* Unboxed Bottom Real-time Telemetry Data Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-white/[0.08] pt-3 font-mono text-[10px]">
        <div className="flex flex-col">
          <span className="text-neutral-500 uppercase">Tracking Offset</span>
          <span className="text-[#e4ff3a] font-bold text-xs">
            {letterSpacing}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-neutral-500 uppercase">Euclidean Dist</span>
          <span className="text-white font-semibold text-xs">
            {telemetry.isHovered ? `${telemetry.dist}px` : 'REST (0px)'}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-neutral-500 uppercase">Delta Vector [X,Y]</span>
          <span className="text-neutral-300 font-mono text-xs">
            {telemetry.isHovered ? `[${telemetry.deltaX}, ${telemetry.deltaY}]` : '[0, 0]'}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-neutral-500 uppercase">Settling Curve</span>
          <span className="text-white font-mono text-xs flex items-center gap-1">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                telemetry.isHovered ? 'bg-[#e4ff3a]' : 'bg-neutral-600'
              }`}
            />
            {telemetry.isHovered ? 'DYNAMIC_STRETCH' : 'NATURAL_REST'}
          </span>
        </div>
      </div>
    </div>
  );
};
