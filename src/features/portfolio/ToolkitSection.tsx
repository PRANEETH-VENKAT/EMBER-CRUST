import React from 'react';
import { Layers, Sparkles } from 'lucide-react';

interface ToolItem {
  name: string;
  category: string;
  level: string;
  description: string;
  iconSvg: React.ReactNode;
}

const FRONTEND_TOOLS: ToolItem[] = [
  {
    name: 'React 19',
    category: 'Framework',
    level: 'Foundational',
    description: 'Component lifecycles, custom hooks, useReducer state machines, and memoized performance patterns.',
    iconSvg: (
      <svg className="h-6 w-6 text-[#2f5bff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    name: 'JavaScript / ESNext',
    category: 'Language',
    level: 'Foundational ',
    description: 'Closures, event loops, WebAudio API, Canvas 2D, asynchronous orchestration, and zero-runtime modules.',
    iconSvg: (
      <svg className="h-6 w-6 text-[#FFD400]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M16 8v8a2 2 0 0 1-2 2h-1" />
        <path d="M10 15c0 1.1-.9 2-2 2H7" />
      </svg>
    ),
  },
  {
    name: 'HTML5 & Semantic DOM',
    category: 'Markup',
    level: 'Foundational',
    description: 'Accessible tree structures, WAI-ARIA standards, microdata, focus management, and SEO primitives.',
    iconSvg: (
      <svg className="h-6 w-6 text-[#ff5733]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 3l2 15 6 3 6-3 2-15H4z" />
        <path d="M7 7h10M7 11h9.5M8 15h7l-3 1.5-2.5-1" />
      </svg>
    ),
  },
  {
    name: 'Modern CSS & Tokens',
    category: 'Styling',
    level: 'Foundational',
    description: 'Fluid clamp() typography, CSS Grid architectures, CSS variables, dark themes, and zero-pill discipline.',
    iconSvg: (
      <svg className="h-6 w-6 text-[#3ef0b0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 3l2 15 6 3 6-3 2-15H4z" />
        <path d="M16 7H8v4h7v4l-3 1-3-1v-2" />
      </svg>
    ),
  },
  {
    name: 'GSAP & Kinetic Motion',
    category: 'Animation',
    level: 'Interactive',
    description: 'ScrollTrigger choreographies, hardware-accelerated transform & opacity pipelines, and smooth 60fps pacing.',
    iconSvg: (
      <svg className="h-6 w-6 text-[#3ef0b0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    name: 'Chrome Extension APIs',
    category: 'Platform',
    level: 'Shipped (NOVA)',
    description: 'Manifest V3, Service Workers, declarativeNetRequest, tab storage, and custom new-tab overrides.',
    iconSvg: (
      <svg className="h-6 w-6 text-[#2f5bff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <line x1="21.17" y1="8" x2="12" y2="8" />
        <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
        <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
      </svg>
    ),
  },
];

const AI_CREATIVE_TOOLS: ToolItem[] = [
  {
    name: 'Python (AI/ML Track)',
    category: 'Language',
    level: 'Core Roadmap',
    description: 'Data analysis, algorithms, computational thinking, NumPy, and engineering foundations for machine learning.',
    iconSvg: (
      <svg className="h-6 w-6 text-[#2f5bff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2C8 2 6 4 6 6v3h6v1H4a2 2 0 0 0-2 2v4c0 2 2 4 6 4h2v-3H10v-1h8a2 2 0 0 0 2-2V7c0-2-2-5-8-5z" />
        <circle cx="9" cy="5" r="1" fill="currentColor" />
        <circle cx="15" cy="19" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'C Language',
    category: 'Systems',
    level: 'Deepening',
    description: 'Pointers, memory management, low-level data structures, algorithmic efficiency, and manual debugging.',
    iconSvg: (
      <svg className="h-6 w-6 text-[#FFD400]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M15 9a4.5 4.5 0 1 0 0 6" />
      </svg>
    ),
  },
  {
    name: 'Figma & Design Systems',
    category: 'Product Design',
    level: 'Design Sprints',
    description: 'Auto-layout systems, token libraries, wireframing, high-fidelity prototypes, and typographic hierarchies.',
    iconSvg: (
      <svg className="h-6 w-6 text-[#ff5733]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
        <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
        <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
        <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
        <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
      </svg>
    ),
  },
  {
    name: 'Short-Form Video & Motion',
    category: 'Content Creation',
    level: 'Creator',
    description: 'Visual hook timing, audio sync, narrative pacing, kinetic captions, and viral audience retention engineering.',
    iconSvg: (
      <svg className="h-6 w-6 text-[#8a2be2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="4" />
        <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'AI Video & Prompt Engines',
    category: 'Mastered in AI ',
    level: '50+ Hrs Trained',
    description: 'Multi-modal prompt architectures, AI video synthesis pipelines, generative asset creation, and rapid prototyping.',
    iconSvg: (
      <svg className="h-6 w-6 text-[#3ef0b0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3v3m0 12v3M3 12h3m12 0h3" />
        <circle cx="12" cy="12" r="4" />
        <path d="M18.36 5.64l-2.12 2.12M7.76 16.24l-2.12 2.12M18.36 18.36l-2.12-2.12M7.76 7.76L5.64 5.64" />
      </svg>
    ),
  },
  {
    name: 'Bioinformatics Research',
    category: 'Long-Term Goal',
    level: 'Dual Degree Target',
    description: 'Computational genomics, biological sequence modeling, and algorithmic interfaces applied to human health.',
    iconSvg: (
      <svg className="h-6 w-6 text-[#2f5bff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 3c3 4 3 6 0 10s-3 6 0 8" />
        <path d="M18 3c-3 4-3 6 0 10s3 6 0 8" />
        <line x1="6" y1="8" x2="18" y2="8" />
        <line x1="6" y1="13" x2="18" y2="13" />
        <line x1="6" y1="18" x2="18" y2="18" />
      </svg>
    ),
  },
];

/**
 * TOOLKIT SECTION
 * Visual grid of logos and skill cards grouped by discipline:
 * Group A: Front-End Architecture
 * Group B: AI & Creative Engineering
 */
export const ToolkitSection: React.FC = () => {
  return (
    <section
      id="toolkit"
      aria-label="Toolkit and Skills"
      className="relative w-full border-t border-[#1F1F1F] bg-[#050505] py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="border-b border-[#1F1F1F] pb-8 mb-12">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[#FFD400]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />
            <span>02 // CAPABILITIES</span>
          </div>
          <h2 className="mt-2 font-sora text-3xl sm:text-4xl md:text-5xl font-black text-white">
            The Builder's Toolkit
          </h2>
          <p className="mt-3 font-mono text-xs text-[#A3A3A3] max-w-2xl">
            Grouped by discipline. Zero third-party asset bloat; every icon rendered with precision inline SVGs.
          </p>
        </div>

        {/* GROUP 1: FRONT-END ARCHITECTURE */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6 font-mono text-xs font-bold uppercase tracking-wider text-[#F5F5F5]">
            <Layers className="h-4 w-4 text-[#2f5bff]" />
            <span>Group A // Front-End &amp; Interface Architecture</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FRONTEND_TOOLS.map((tool) => (
              <div
                key={tool.name}
                className="group relative rounded-2xl border border-[#1F1F1F] bg-[#0A0A0A] p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#FFD400]/50 hover:bg-[#0E0E0E]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#141414] border border-[#262626] group-hover:border-[#FFD400] transition-colors">
                    {tool.iconSvg}
                  </div>
                  <span className="rounded bg-[#1A1A1A] px-2 py-0.5 font-mono text-[10px] text-[#A3A3A3] border border-[#262626]">
                    {tool.level}
                  </span>
                </div>

                <h4 className="mt-4 font-sora text-base font-bold text-white group-hover:text-[#FFD400] transition-colors">
                  {tool.name}
                </h4>
                <div className="font-mono text-[11px] text-[#2f5bff] mt-0.5">
                  {tool.category}
                </div>
                <p className="mt-2 font-inter text-xs text-[#A3A3A3] leading-relaxed">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* GROUP 2: AI & CREATIVE ENGINEERING */}
        <div>
          <div className="flex items-center gap-2 mb-6 font-mono text-xs font-bold uppercase tracking-wider text-[#F5F5F5]">
            <Sparkles className="h-4 w-4 text-[#FFD400]" />
            <span>Group B // AI, Systems &amp; Creative Media</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AI_CREATIVE_TOOLS.map((tool) => (
              <div
                key={tool.name}
                className="group relative rounded-2xl border border-[#1F1F1F] bg-[#0A0A0A] p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#FFD400]/50 hover:bg-[#0E0E0E]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#141414] border border-[#262626] group-hover:border-[#FFD400] transition-colors">
                    {tool.iconSvg}
                  </div>
                  <span className="rounded bg-[#1A1A1A] px-2 py-0.5 font-mono text-[10px] text-[#A3A3A3] border border-[#262626]">
                    {tool.level}
                  </span>
                </div>

                <h4 className="mt-4 font-sora text-base font-bold text-white group-hover:text-[#FFD400] transition-colors">
                  {tool.name}
                </h4>
                <div className="font-mono text-[11px] text-[#FFD400] mt-0.5">
                  {tool.category}
                </div>
                <p className="mt-2 font-inter text-xs text-[#A3A3A3] leading-relaxed">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
