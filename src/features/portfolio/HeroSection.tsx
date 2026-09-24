import React from 'react';
import { ArrowDown, Sparkles, Terminal, Cpu } from 'lucide-react';

interface HeroSectionProps {
  onScrollToJourney: () => void;
}

/**
 * HERO SECTION
 * Minimal, text-forward presentation inspired by guillaumezhu.com.
 * Anchored by ONE strong positioning statement: "I build interfaces that think."
 * Pure black canvas with soft blue, violet and amber radial gradients.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToJourney }) => {
  return (
    <section
      id="hero"
      aria-label="Hero Section"
      className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col justify-between px-4 py-12 sm:px-6 md:py-20 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Soft Ambient Radial Background Glows (Lightweight CSS, zero blur filter cost) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] sm:h-[650px] sm:w-[650px] rounded-full z-0 opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(47, 91, 255, 0.18) 0%, rgba(138, 43, 226, 0.1) 40%, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 right-10 h-[350px] w-[350px] rounded-full z-0 opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(255, 212, 0, 0.15) 0%, transparent 65%)',
        }}
      />

      {/* Top Credentials Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2.5 rounded-full border border-[#262626] bg-[#0E0E0E]/90 px-3.5 py-1.5 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-[#3ef0b0] shadow-[0_0_8px_#3ef0b0]" />
          <span className="text-[#A3A3A3]">
            STUDENT &amp; BUILDER ·{' '}
            <span className="text-white font-medium">SRM RAMAPURAM</span>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[#737373]">
          <span className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-[#2f5bff]" />
            <span>AI / ML Track</span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-[#FFD400]" />
            <span>Systems &amp; Design</span>
          </span>
        </div>
      </div>

      {/* Main Massive Headline & Statement */}
      <div className="relative z-10 my-auto py-12 md:py-16">
        {/* Role Pill Line */}
        <div className="mb-6 flex items-center gap-2">
          <span className="h-px w-8 bg-[#FFD400]" />
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#FFD400]">
            Padavala · First-year B.Tech AI/ML at SRM
          </p>
        </div>

        {/* ONE Singular Positioning Statement */}
        <h1 className="font-sora text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.05]">
          I build interfaces <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-white via-[#FFD400] to-[#3ef0b0] bg-clip-text text-transparent">
            that think.
          </span>
        </h1>

        {/* Narrative Deck */}
        <div className="mt-8 max-w-2xl">
          <p className="font-inter text-base sm:text-lg md:text-xl text-[#A3A3A3] leading-relaxed">
            Bridging kinetic front-end craft with artificial intelligence. First-year B.Tech AI/ML at SRM, aspiring toward dual-degree research in AI/ML and Bioinformatics.
          </p>
        </div>

        {/* Strategic Roadmap Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <div className="rounded-xl border border-[#1F1F1F] bg-[#0D0D0D]/80 p-4">
            <div className="font-mono text-[10px] uppercase text-[#737373] tracking-widest">
              Academic Program
            </div>
            <div className="mt-1 font-sora text-sm font-bold text-white">
              B.Tech in AI/ML
            </div>
            <div className="font-mono text-xs text-[#A3A3A3]">
              First-year at SRM
            </div>
          </div>

          <div className="rounded-xl border border-[#FFD400]/30 bg-[#FFD400]/5 p-4">
            <div className="font-mono text-[10px] uppercase text-[#FFD400] tracking-widest flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Future Focus</span>
            </div>
            <div className="mt-1 font-sora text-sm font-bold text-white">
              AI/ML + Bioinformatics
            </div>
            <div className="font-mono text-xs text-[#A3A3A3]">
              Computational Research Target
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="relative z-10 flex items-center justify-between border-t border-[#1A1A1A] pt-6 font-mono text-xs text-[#737373]">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />
          <span>SCROLL DRIVEN JOURNEY</span>
        </div>

        <button
          onClick={onScrollToJourney}
          className="group flex items-center gap-2 text-[#A3A3A3] hover:text-[#FFD400] transition-colors focus:outline-none focus:ring-1 focus:ring-[#FFD400] rounded px-2 py-1"
        >
          <span>Explore Story</span>
          <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-1 text-[#FFD400]" />
        </button>
      </div>
    </section>
  );
};
