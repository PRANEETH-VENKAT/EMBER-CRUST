import React, { useState } from 'react';
import { Terminal, Palette, Cpu, Sparkles, Binary } from 'lucide-react';

interface StageData {
  id: string;
  tag: string;
  tabLabel: string;
  headline: string;
  lead: string;
  description: string;
  skills: string[];
  color: string;
  glow: string;
  icon: React.ElementType;
  styleMode: 'technical' | 'expressive' | 'converged';
}

const JOURNEY_STAGES: StageData[] = [
  {
    id: 'stage-1',
    tag: 'STAGE 01 // SYSTEMS & LOGIC',
    tabLabel: 'Work',
    headline: 'I made them work.',
    lead: 'Deterministic state machines, systems programming in C, and computational logic.',
    description:
      'Visuals crumble without engineering rigour. I began by mastering modular state machines, Chrome Extension APIs, and deep problem solving in C and Python. My focus centered on decoupling components, zero-dependency data structures, and deterministic logic.',
    skills: [
      'State Machines (useReducer)',
      'Systems Programming (C)',
      'Python Algorithms',
      'Chrome Extension APIs',
      'Deterministic Logic',
    ],
    color: '#3ef0b0', // Technical mint / terminal green
    glow: 'rgba(62, 240, 176, 0.18)',
    icon: Terminal,
    styleMode: 'technical',
  },
  {
    id: 'stage-2',
    tag: 'STAGE 02 // SENSORY DESIGN & TYPOGRAPHY',
    tabLabel: 'Look Good',
    headline: 'I made things look good.',
    lead: 'Mastering the raw canvas: semantic DOM, optical typography, and fluid CSS.',
    description:
      'I dove deep into pure HTML, modern CSS architectures, and vanilla JavaScript. Before touching complex frameworks, I studied layout mathematics, responsive clamp() typography, and how 60fps micro-motion creates trust and visceral delight for human eyes.',
    skills: [
      'HTML5 Semantic Markup',
      'Modern CSS & Design Tokens',
      'Optical Typography',
      'Vanilla JS ES6+',
      '60fps Micro-Motion',
    ],
    color: '#c084fc', // Expressive violet / magenta
    glow: 'rgba(192, 132, 252, 0.22)',
    icon: Palette,
    styleMode: 'expressive',
  },
  {
    id: 'stage-3',
    tag: 'STAGE 03 // CONVERGENCE & AI',
    tabLabel: 'Bridge AI',
    headline: 'Today, I bridge design and AI.',
    lead: 'Converging front-end craft with computational intelligence, systems programming, and bioinformatics.',
    description:
      'Now studying B.Tech CSE (AI/ML) at SRM IST Ramapuram. I combine kinetic front-end precision with intelligent reasoning systems, prompt architecture, and deep engineering fundamentals to build software that anticipates user intent.',
    skills: [
      'AI/ML Foundations (SRM)',
      'Intelligent Reasoning Systems',
      'Prompt Architecture',
      'Bioinformatics Vision',
      'Kinetic Interfaces',
    ],
    color: '#FFD400', // Gold & Mint merged with V-mark
    glow: 'rgba(255, 212, 0, 0.22)',
    icon: Cpu,
    styleMode: 'converged',
  },
];

/**
 * JOURNEY SECTION
 * Reordered stages strictly per specification:
 * Stage 1: "I made them work." (Technical / Monospace treatment)
 * Stage 2: "I made things look good." (Expressive / Gradient treatment)
 * Stage 3: "Today, I bridge design and AI." (Merged look with V-mark)
 */
export const JourneySection: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);

  return (
    <section
      id="journey"
      aria-label="Padavala Journey"
      className="relative w-full border-t border-[#1F1F1F] bg-[#000000] py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1F1F1F] pb-8 mb-12">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[#FFD400]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />
              <span>01 // THE JOURNEY</span>
            </div>
            <h2 className="mt-2 font-sora text-3xl sm:text-4xl md:text-5xl font-black text-white">
              Evolution of a Builder
            </h2>
          </div>

          {/* Stage Selector Tabs with Updated Labels */}
          <div className="flex gap-2">
            {JOURNEY_STAGES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveStage(idx)}
                aria-label={`Jump to stage ${idx + 1}: ${s.tabLabel}`}
                className={`flex items-center gap-2 rounded-full border px-3 sm:px-4 py-1.5 font-mono text-xs transition-all ${
                  activeStage === idx
                    ? 'border-[#FFD400] bg-[#FFD400]/15 text-[#FFD400] font-bold'
                    : 'border-[#262626] bg-[#0E0E0E] text-[#737373] hover:text-white hover:border-[#383838]'
                }`}
              >
                <span>0{idx + 1}</span>
                <span className="hidden sm:inline">{s.tabLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3 Sequential Viewport Stages with Distinct Visual Treatments */}
        <div className="space-y-16 lg:space-y-24">
          {JOURNEY_STAGES.map((stage, idx) => {
            const isFeatured = activeStage === idx;

            return (
              <article
                key={stage.id}
                onMouseEnter={() => setActiveStage(idx)}
                className={`relative rounded-3xl border transition-all duration-300 p-6 sm:p-10 md:p-14 ${
                  isFeatured
                    ? 'border-[#FFD400]/40 bg-[#0A0A0A] shadow-[0_10px_40px_rgba(0,0,0,0.8)]'
                    : 'border-[#1C1C1C] bg-[#050505] opacity-80 hover:opacity-100 hover:border-[#2C2C2C]'
                }`}
                style={{
                  boxShadow: isFeatured ? `0 0 50px ${stage.glow}` : 'none',
                }}
              >
                {/* Visual Treatment A: Technical / Monospace for Stage 1 */}
                {stage.styleMode === 'technical' && (
                  <div>
                    {/* Top Terminal Indicator */}
                    <div className="flex items-center justify-between font-mono text-xs pb-4 border-b border-[#1A2E26]">
                      <div className="flex items-center gap-2 text-[#3ef0b0]">
                        <Binary className="h-4 w-4" />
                        <span className="font-bold tracking-widest uppercase">
                          [SYS_MODE: DETERMINISTIC_LOGIC]
                        </span>
                      </div>
                      <span className="font-mono text-sm font-bold text-[#3ef0b0]/80">
                        STAGE // 01
                      </span>
                    </div>

                    {/* Monospace Header Reveal */}
                    <div className="mt-8 font-mono text-xs uppercase tracking-widest text-[#3ef0b0]">
                      {stage.tag}
                    </div>
                    <h3 className="mt-3 font-mono text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#3ef0b0] tracking-tight leading-tight">
                      &gt; &quot;{stage.headline}&quot;
                    </h3>

                    <p className="mt-4 font-mono text-sm sm:text-base text-[#A3E3D1] max-w-3xl leading-relaxed">
                      {stage.lead}
                    </p>

                    <p className="mt-4 font-mono text-xs sm:text-sm leading-relaxed text-[#A3A3A3] max-w-3xl">
                      {stage.description}
                    </p>

                    {/* Technical Monospace Tag Grid */}
                    <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-[#1C1C1C]">
                      {stage.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded border border-[#3ef0b0]/30 bg-[#0A1F18] px-3 py-1 font-mono text-xs text-[#3ef0b0]"
                        >
                          ${'{' + skill + '}'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visual Treatment B: Expressive / Gradient for Stage 2 */}
                {stage.styleMode === 'expressive' && (
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs pb-4 border-b border-[#2A1836]">
                      <div className="flex items-center gap-2 text-violet-400">
                        <Palette className="h-4 w-4" />
                        <span className="font-semibold tracking-wider">{stage.tag}</span>
                      </div>
                      <span className="font-bebas text-3xl sm:text-4xl text-[#333333]">
                        STAGE 02
                      </span>
                    </div>

                    {/* Expressive Gradient Typography Reveal */}
                    <h3 className="mt-8 font-sora text-3xl sm:text-5xl md:text-6xl font-black leading-tight bg-gradient-to-r from-violet-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
                      {stage.headline}
                    </h3>

                    <p className="mt-4 font-sora text-sm sm:text-base font-semibold leading-relaxed text-violet-200 max-w-3xl">
                      {stage.lead}
                    </p>

                    <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#D4D4D4] max-w-3xl">
                      {stage.description}
                    </p>

                    {/* Gradient Badges */}
                    <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-[#1C1C1C]">
                      {stage.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-violet-500/30 bg-gradient-to-r from-violet-950/40 to-fuchsia-950/40 px-3.5 py-1 text-xs font-medium text-violet-300 shadow-sm"
                        >
                          ✦ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visual Treatment C: Merged look with V-mark for Stage 3 */}
                {stage.styleMode === 'converged' && (
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs pb-4 border-b border-[#2A2408]">
                      <div className="flex items-center gap-2 text-[#FFD400]">
                        <Cpu className="h-4 w-4" />
                        <span className="font-semibold tracking-wider">{stage.tag}</span>
                      </div>
                      {/* Geometric V-mark Lockup */}
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#FFD400]/40 bg-[#1A1603] text-[#FFD400] shadow-[0_0_12px_rgba(255,212,0,0.3)]">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4 fill-current text-[#FFD400]"
                            aria-hidden="true"
                          >
                            <path d="M12 21L3 6h4.5l4.5 8 4.5-8H21z" />
                          </svg>
                        </div>
                        <span className="font-bebas text-3xl sm:text-4xl text-[#FFD400]">
                          STAGE 03
                        </span>
                      </div>
                    </div>

                    {/* Gold & Mint Converged Typography Reveal */}
                    <div className="mt-8 flex items-center gap-2 font-mono text-xs text-[#FFD400] tracking-widest uppercase">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>THE CONVERGENCE</span>
                    </div>

                    <h3 className="mt-2 font-sora text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
                      Today, I bridge{' '}
                      <span className="text-[#FFD400] underline decoration-[#FFD400]/40 decoration-4 underline-offset-8">
                        design
                      </span>{' '}
                      and{' '}
                      <span className="text-[#3ef0b0] underline decoration-[#3ef0b0]/40 decoration-4 underline-offset-8">
                        AI.
                      </span>
                    </h3>

                    <p className="mt-5 font-sora text-sm sm:text-base font-semibold text-[#F5F5F5] max-w-3xl leading-relaxed">
                      {stage.lead}
                    </p>

                    <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#A3A3A3] max-w-3xl">
                      {stage.description}
                    </p>

                    {/* Merged Gold + Mint Badges with V-symbol */}
                    <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-[#1C1C1C]">
                      {stage.skills.map((skill, sIdx) => (
                        <span
                          key={skill}
                          className={`rounded-full border px-3.5 py-1 font-mono text-xs font-medium ${
                            sIdx % 2 === 0
                              ? 'border-[#FFD400]/30 bg-[#FFD400]/10 text-[#FFD400]'
                              : 'border-[#3ef0b0]/30 bg-[#3ef0b0]/10 text-[#3ef0b0]'
                          }`}
                        >
                          ▼ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
