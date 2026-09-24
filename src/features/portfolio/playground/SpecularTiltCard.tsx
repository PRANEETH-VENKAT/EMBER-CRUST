import React, { useState, useRef, useCallback } from 'react';

interface SpecularTiltCardProps {
  className?: string;
}

/**
 * SpecularTiltCard
 * Hardware-accelerated 3D tilt card featuring physical perspective rotation (1000px)
 * and dynamic specular Fresnel light reflection with smooth return transition.
 */
export const SpecularTiltCard: React.FC<SpecularTiltCardProps> = ({ className = '' }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [rotations, setRotations] = useState<{ x: number; y: number; isHovered: boolean }>({
    x: 0,
    y: 0,
    isHovered: false,
  });

  const [highlightCoords, setHighlightCoords] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });

  // Calculate 3D perspective tilt & specular Fresnel highlight
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Perspective rotation formula
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    // Specular Fresnel coordinates (0% to 100%)
    const highlightX = (x / rect.width) * 100;
    const highlightY = (y / rect.height) * 100;

    setRotations({
      x: parseFloat(rotateX.toFixed(2)),
      y: parseFloat(rotateY.toFixed(2)),
      isHovered: true,
    });

    setHighlightCoords({
      x: parseFloat(highlightX.toFixed(1)),
      y: parseFloat(highlightY.toFixed(1)),
    });
  }, []);

  // Smooth return transition on pointer leave
  const handlePointerLeave = useCallback(() => {
    setRotations({
      x: 0,
      y: 0,
      isHovered: false,
    });
    setHighlightCoords({
      x: 50,
      y: 50,
    });
  }, []);

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-3 select-none [perspective:1000px] ${className}`}
    >
      {/* 3D Hardware Accelerated Tilt Card Body */}
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="group relative w-full overflow-hidden rounded-2xl border border-white/[0.12] p-6 shadow-2xl transition-all duration-200 ease-out will-change-transform"
        style={{
          background: 'linear-gradient(135deg, #181b24 0%, #0c0d12 100%)',
          transform: rotations.isHovered
            ? `perspective(1000px) rotateX(${rotations.x}deg) rotateY(${rotations.y}deg) scale3d(1.02, 1.02, 1.02)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: rotations.isHovered
            ? 'transform 0.08s ease-out'
            : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: rotations.isHovered
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(228, 255, 58, 0.12)'
            : '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Specular Fresnel Radial Reflection Layer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle at ${highlightCoords.x}% ${highlightCoords.y}%, rgba(228, 255, 58, 0.45) 0%, transparent 60%)`,
            mixBlendMode: 'overlay',
            opacity: rotations.isHovered ? 1 : 0,
          }}
        />

        {/* Card Header & Chip Metaphor */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#e4ff3a]" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              SPECIMEN // 03 · TACTILE QUARTZ
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[9px] text-[#e4ff3a]">
            <span>60 FPS ACCEL</span>
          </div>
        </div>

        {/* Card Central Graphic Core */}
        <div className="relative z-10 my-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e4ff3a]/40 bg-[#e4ff3a]/10 font-mono text-xs font-bold text-[#e4ff3a]">
              [3D]
            </div>
            <div className="text-right font-mono text-[10px] text-neutral-500">
              <div>PHYSICAL DEPTH: 1000PX</div>
              <div>SURFACE: SPECULAR_GLASS</div>
            </div>
          </div>

          <div>
            <h4 className="font-sora text-xl font-bold uppercase tracking-tight text-white">
              Kinetic Spatial Matrix
            </h4>
            <p className="mt-1 font-mono text-xs text-neutral-400 leading-relaxed">
              Physical Fresnel angle displacement with dual-axis rotational momentum.
              Simulates refractive light scattering across an anisotropic silicon substrate.
            </p>
          </div>
        </div>

        {/* Minimal Status Bar & Telemetry */}
        <div className="relative z-10 mt-4 flex items-center justify-between border-t border-white/[0.08] pt-3 font-mono text-[10px]">
          <div className="flex gap-3 text-neutral-400">
            <span>
              ROT_X:{' '}
              <strong className={rotations.isHovered ? 'text-[#e4ff3a]' : 'text-neutral-300'}>
                {rotations.x > 0 ? `+${rotations.x}` : rotations.x}°
              </strong>
            </span>
            <span>
              ROT_Y:{' '}
              <strong className={rotations.isHovered ? 'text-[#e4ff3a]' : 'text-neutral-300'}>
                {rotations.y > 0 ? `+${rotations.y}` : rotations.y}°
              </strong>
            </span>
          </div>

          <div className="text-neutral-500">
            FRESNEL: ({highlightCoords.x}%, {highlightCoords.y}%)
          </div>
        </div>
      </div>
    </div>
  );
};
