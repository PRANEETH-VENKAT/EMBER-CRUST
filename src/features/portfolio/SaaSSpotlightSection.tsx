import React, { useState, useEffect } from 'react';
import { ArrowRight, Activity } from 'lucide-react';

interface SaaSSpotlightSectionProps {
  onOpenCaseStudy: (projectId: string) => void;
}

/**
 * VISUAL STYLE B — "SAAS FEATURE ANNOUNCEMENT"
 * Positioned between Projects and Contact.
 * Charcoal (#1a1d21) background with subtle geometric grid lines,
 * cobalt (#2f5bff) and mint (#3ef0b0) accents, kinetic typography,
 * framed architectural dashboard card with cobalt glow,
 * animated SVG telemetry chart with stroke-dashoffset drawing, and 4-beat stepper.
 */
export const SaaSSpotlightSection: React.FC<SaaSSpotlightSectionProps> = ({
  onOpenCaseStudy,
}) => {
  const [activeBeat, setActiveBeat] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  // Auto-advance beats every 3.8s if user hasn't paused
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setActiveBeat((prev) => {
        return prev >= 4 ? 1 : prev + 1;
      });
    }, 3800);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleSelectBeat = (beat: number) => {
    setIsAutoPlaying(false);
    setActiveBeat(beat);
  };

  return (
    <section
      id="spotlight"
      aria-label="SaaS Feature Spotlight"
      className="relative w-full border-y border-[#262B33] bg-[#1a1d21] py-20 px-4 sm:px-6 lg:px-8 text-white overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px',
      }}
    >
      {/* Soft Cobalt Radial Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-1/4 h-[550px] w-[550px] rounded-full z-0 opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(47, 91, 255, 0.4) 0%, transparent 65%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-10 h-[450px] w-[450px] rounded-full z-0 opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(62, 240, 176, 0.35) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Pill / Style B Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 border-b border-[#2B313A] pb-4">
          <div className="flex items-center gap-2 font-mono text-xs text-[#3ef0b0]">
            <span className="flex h-2 w-2 rounded-full bg-[#3ef0b0] shadow-[0_0_8px_#3ef0b0]" />
            <span className="uppercase tracking-[0.2em] font-bold">
              STYLE B // SAAS ARCHITECTURAL SPOTLIGHT
            </span>
          </div>

          {/* 4-Beat Stepper Controls */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((step) => (
              <button
                key={step}
                onClick={() => handleSelectBeat(step)}
                aria-label={`Jump to Beat ${step}`}
                className={`flex h-7 items-center gap-1.5 rounded-full px-3 font-mono text-xs transition-all ${
                  activeBeat === step
                    ? 'bg-[#2f5bff] text-white font-bold shadow-[0_0_12px_rgba(47,91,255,0.6)]'
                    : 'bg-[#242930] text-[#8C9BAE] hover:text-white hover:bg-[#2C323B]'
                }`}
              >
                <span>BEAT 0{step}</span>
              </button>
            ))}

            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="ml-2 font-mono text-[10px] text-[#8C9BAE] hover:text-white uppercase"
            >
              {isAutoPlaying ? 'PAUSE' : 'PLAY'}
            </button>
          </div>
        </div>

        {/* 4-Beat Sequential Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Kinetic Headlines & Narrative (Beats 1 & 4) */}
          <div className="lg:col-span-6 space-y-6">
            {/* BEAT 1: Headline "See what drives the build." */}
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#2f5bff] font-semibold flex items-center gap-2">
                <span>Core Architectural Thesis</span>
              </div>

              <h2 className="mt-3 font-sora text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1]">
                See what drives{' '}
                <span className="relative inline-block text-[#3ef0b0] underline decoration-[#2f5bff] decoration-4 underline-offset-8">
                  the build.
                </span>
              </h2>

              <p className="mt-6 font-inter text-base sm:text-lg text-[#BAC7D5] leading-relaxed max-w-xl">
                High-performance front-end architecture is not accidental. It is engineered through
                zero-dependency game loops, composited hardware layers, and algorithmic state distribution.
              </p>
            </div>

            {/* BEAT 3 Telemetry Values (Count-Up Statements) */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="rounded-xl border border-[#2B313A] bg-[#222730]/80 p-3.5">
                <div className="font-sora text-2xl sm:text-3xl font-black text-[#3ef0b0]">
                  3+
                </div>
                <div className="font-mono text-[11px] text-[#8C9BAE] mt-0.5">
                  Apps Shipped
                </div>
              </div>

              <div className="rounded-xl border border-[#2B313A] bg-[#222730]/80 p-3.5">
                <div className="font-sora text-2xl sm:text-3xl font-black text-[#2f5bff]">
                  60 FPS
                </div>
                <div className="font-mono text-[11px] text-[#8C9BAE] mt-0.5">
                  Composited Motion
                </div>
              </div>

              <div className="rounded-xl border border-[#2B313A] bg-[#222730]/80 p-3.5">
                <div className="font-sora text-2xl sm:text-3xl font-black text-[#FFD400]">
                  0 KB
                </div>
                <div className="font-mono text-[11px] text-[#8C9BAE] mt-0.5">
                  CSS Animation Bloat
                </div>
              </div>
            </div>

            {/* BEAT 4: Product Close & CTA */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onOpenCaseStudy('ember-crests')}
                id="spotlight-cta-btn"
                className="group flex items-center gap-3 rounded-xl bg-[#2f5bff] px-6 py-3.5 font-mono text-sm font-bold text-white shadow-[0_4px_25px_rgba(47,91,255,0.4)] hover:bg-[#254bda] transition-all focus:outline-none focus:ring-2 focus:ring-[#3ef0b0]"
              >
                <span>View Ember Crests Case Study</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onOpenCaseStudy('nova')}
                className="rounded-xl border border-[#2B313A] bg-[#222730] px-5 py-3.5 font-mono text-xs font-semibold text-[#BAC7D5] hover:text-white hover:border-[#2f5bff] transition-colors"
              >
                Inspect NOVA Engine
              </button>
            </div>
          </div>

          {/* Right Column: BEAT 2 (Framed Architectural Card) & BEAT 3 (Animated SVG Chart) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl border border-[#2F5BFF]/40 bg-[#14181F] p-5 sm:p-7 shadow-[0_20px_60px_rgba(47,91,255,0.22)]">
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-[#232933] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                  <span className="font-mono text-[11px] text-[#8C9BAE] ml-2">
                    EMBER_CRESTS_RUNTIME_TELEMETRY.TSX
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[10px] text-[#3ef0b0]">
                  <Activity className="h-3.5 w-3.5 animate-pulse" />
                  <span>LIVE PROFILER</span>
                </div>
              </div>

              {/* BEAT 3: Animated SVG Line Chart drawing on with stroke-dashoffset */}
              <div className="relative rounded-xl border border-[#232933] bg-[#0E1116] p-4">
                <div className="flex items-center justify-between font-mono text-xs text-[#8C9BAE] mb-2">
                  <span>FRAME TIME (TARGET 16.6ms / 60FPS)</span>
                  <span className="text-[#3ef0b0] font-bold">16.4ms (99.8%)</span>
                </div>

                {/* SVG Performance Curve */}
                <div className="h-32 w-full">
                  <svg className="h-full w-full overflow-visible" viewBox="0 0 400 120">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2f5bff" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#2f5bff" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#2f5bff" />
                        <stop offset="70%" stopColor="#8a2be2" />
                        <stop offset="100%" stopColor="#3ef0b0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal 60fps Target Guideline */}
                    <line
                      x1="0"
                      y1="40"
                      x2="400"
                      y2="40"
                      stroke="#232933"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />

                    {/* Fill Area */}
                    <path
                      d="M 0 90 Q 50 85, 100 65 T 200 45 T 300 42 T 400 38 L 400 120 L 0 120 Z"
                      fill="url(#chartGradient)"
                    />

                    {/* Animated Line Stroke */}
                    <path
                      d="M 0 90 Q 50 85, 100 65 T 200 45 T 300 42 T 400 38"
                      fill="none"
                      stroke="url(#lineGrad)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />

                    {/* Mint Highlight Indicator on the Last Point */}
                    <circle
                      cx="400"
                      cy="38"
                      r="5"
                      fill="#3ef0b0"
                      className="animate-pulse shadow-[0_0_12px_#3ef0b0]"
                    />
                  </svg>
                </div>

                <div className="flex justify-between font-mono text-[10px] text-[#606E7F] mt-2">
                  <span>INIT MOUNT</span>
                  <span>CART STATE DISPATCH</span>
                  <span>SPLIT BILL ROUNDING</span>
                  <span className="text-[#3ef0b0]">60 FPS STABLE</span>
                </div>
              </div>

              {/* Code Architecture Callout */}
              <div className="mt-4 rounded-xl border border-[#232933] bg-[#0E1116] p-3 font-mono text-xs text-[#BAC7D5] space-y-1">
                <div className="flex items-center justify-between text-[#8C9BAE]">
                  <span>// DETERMINISTIC STATE MACHINE</span>
                  <span className="text-[#FFD400]">PASS</span>
                </div>
                <div className="text-[11px] text-[#8C9BAE]">
                  <span className="text-[#2f5bff]">const</span> state = useReducer(splitReducer, initialBill);
                </div>
                <div className="text-[11px] text-[#3ef0b0]">
                  // Remainder cents allocated strictly to primary user
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
