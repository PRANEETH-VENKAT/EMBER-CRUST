import React, { useEffect, useRef, useState, useCallback } from 'react';

interface HarmonicWaveCanvasProps {
  className?: string;
}

/**
 * HarmonicWaveCanvas
 * 60fps HTML5 Canvas 2D interactive fluid wave module.
 * Renders 3 superimposed sinusoidal waves on a deep dark canvas background (#08090c).
 * Primary wave in electric chartreuse (#e4ff3a) at 2px line width.
 * Secondary/tertiary waves in translucent white (rgba(255, 255, 255, 0.12)) at 1px.
 * Dynamically perturbated by pointermove within a 120px radius.
 */
export const HarmonicWaveCanvas: React.FC<HarmonicWaveCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Range Slider States
  const [frequency, setFrequency] = useState<number>(0.022);
  const [amplitude, setAmplitude] = useState<number>(26);

  // Mouse Interaction State (stored in refs for 60fps loop performance)
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -999,
    y: -999,
    active: false,
  });

  const [mouseTelemetry, setMouseTelemetry] = useState<{ active: boolean; x: number }>({
    active: false,
    x: 0,
  });

  // Handle pointer movements
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePosRef.current = { x, y, active: true };
    setMouseTelemetry({ active: true, x: Math.round(x) });
  }, []);

  const handlePointerLeave = useCallback(() => {
    mousePosRef.current.active = false;
    setMouseTelemetry({ active: false, x: 0 });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    let isRunning = true;

    // Crisp high-DPI canvas resizing
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = container.clientWidth;
      const height = container.clientHeight || 260;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(container);

    // Animation Loop (60 FPS)
    const render = () => {
      if (!isRunning) return;

      const width = container.clientWidth;
      const height = container.clientHeight || 260;
      const centerY = height / 2;

      // Deep dark canvas background
      ctx.fillStyle = '#08090c';
      ctx.fillRect(0, 0, width, height);

      // Subtle horizontal baseline grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // 3 Wave Layer Configurations
      // Layer 1: Tertiary translucent white wave (phased)
      // Layer 2: Secondary translucent white wave (counter-phased)
      // Layer 3: Primary electric chartreuse foreground wave
      const layers = [
        {
          color: 'rgba(255, 255, 255, 0.08)',
          lineWidth: 1,
          layerOffset: 1.8,
          layerYOffset: -12,
          speedMult: 0.8,
        },
        {
          color: 'rgba(255, 255, 255, 0.14)',
          lineWidth: 1,
          layerOffset: 3.4,
          layerYOffset: 10,
          speedMult: 1.2,
        },
        {
          color: '#e4ff3a', // High-visibility electric chartreuse
          lineWidth: 2,
          layerOffset: 0,
          layerYOffset: 0,
          speedMult: 1.0,
        },
      ];

      const mouse = mousePosRef.current;

      layers.forEach((layer) => {
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = layer.lineWidth;
        ctx.beginPath();

        for (let x = 0; x <= width; x += 3) {
          // Cursor perturbation with 120px radius and smooth cosine falloff
          let mouseRepulsion = 0;
          if (mouse.active) {
            const dist = Math.abs(x - mouse.x);
            if (dist < 120) {
              mouseRepulsion = Math.cos((dist / 120) * (Math.PI / 2));
            }
          }

          // Harmonic Wave Formula:
          // y = centerY + Math.sin(x * frequency + step + layerOffset) * amplitude * (1 + mouseRepulsion * 1.6) + layerYOffset
          const y =
            centerY +
            Math.sin(x * frequency + step * layer.speedMult + layer.layerOffset) *
              amplitude *
              (1 + mouseRepulsion * 1.6) +
            layer.layerYOffset;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      });

      // Cursor indicator anchor if pointer is hovering
      if (mouse.active && mouse.x >= 0 && mouse.x <= width) {
        ctx.strokeStyle = 'rgba(228, 255, 58, 0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(mouse.x, 0);
        ctx.lineTo(mouse.x, height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Small chartreuse pulse point on center line
        ctx.fillStyle = '#e4ff3a';
        ctx.beginPath();
        ctx.arc(mouse.x, centerY, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      step += 0.038;
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [frequency, amplitude]);

  return (
    <div
      className={`relative flex flex-col rounded-2xl border border-white/10 bg-[#08090c] p-4 sm:p-5 shadow-2xl overflow-hidden ${className}`}
    >
      {/* Top Header & Telemetry */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#e4ff3a] animate-pulse" />
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            Harmonic Fluid Wave Engine
          </h4>
          <span className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[9px] text-[#e4ff3a] border border-[#e4ff3a]/30">
            60 FPS · CANVAS 2D
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] text-neutral-400">
          <span>
            FREQ: <strong className="text-white">{frequency.toFixed(3)}</strong>
          </span>
          <span>
            AMP: <strong className="text-white">{amplitude}px</strong>
          </span>
          <span>
            STATUS:{' '}
            <strong className={mouseTelemetry.active ? 'text-[#e4ff3a]' : 'text-neutral-500'}>
              {mouseTelemetry.active ? `PERTURBING (X:${mouseTelemetry.x})` : 'HARMONIC_REST'}
            </strong>
          </span>
        </div>
      </div>

      {/* 60fps Canvas Display Viewport */}
      <div
        ref={containerRef}
        className="relative h-48 sm:h-56 w-full cursor-crosshair rounded-xl border border-white/[0.06] bg-[#08090c] overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="block h-full w-full touch-none"
        />

        {/* Ambient Overlay Legend */}
        <div className="pointer-events-none absolute bottom-2 left-3 font-mono text-[9px] text-white/30 tracking-widest uppercase">
          sin(x · ω + φ) · A · (1 + 1.6 · F)
        </div>
      </div>

      {/* Interactive Sliders Control Deck */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/[0.08] pt-3">
        {/* Frequency Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-[11px]">
            <label htmlFor="wave-frequency-input" className="text-neutral-400">
              Wave Frequency (ω)
            </label>
            <span className="text-[#e4ff3a] font-bold">{frequency.toFixed(3)}</span>
          </div>
          <input
            id="wave-frequency-input"
            type="range"
            min="0.010"
            max="0.050"
            step="0.002"
            value={frequency}
            onChange={(e) => setFrequency(parseFloat(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-[#e4ff3a]"
          />
          <div className="flex justify-between font-mono text-[9px] text-neutral-500">
            <span>0.010 (Gentle)</span>
            <span>0.050 (High Ripple)</span>
          </div>
        </div>

        {/* Amplitude Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-[11px]">
            <label htmlFor="wave-amplitude-input" className="text-neutral-400">
              Wave Amplitude (px)
            </label>
            <span className="text-[#e4ff3a] font-bold">{amplitude}px</span>
          </div>
          <input
            id="wave-amplitude-input"
            type="range"
            min="10"
            max="45"
            step="1"
            value={amplitude}
            onChange={(e) => setAmplitude(parseInt(e.target.value, 10))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-[#e4ff3a]"
          />
          <div className="flex justify-between font-mono text-[9px] text-neutral-500">
            <span>10px (Subtle)</span>
            <span>45px (Volumetric)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
