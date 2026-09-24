import React, { useState, useEffect } from 'react';
import { ArrowUpRight, X, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

export interface ProjectData {
  id: string;
  number: string;
  title: string;
  tagline: string;
  year: string;
  category: string;
  stack: string[];
  problem: string;
  approach: string;
  architecture: string;
  result: string[];
  metrics: { label: string; value: string }[];
  color: string;
  previewGradient: string;
}

export const PROJECTS_LIST: ProjectData[] = [
  {
    id: 'nova',
    number: '01',
    title: 'NOVA Dashboard',
    tagline: 'Glassmorphism Chrome New-Tab Productivity Engine',
    year: '2024',
    category: 'Chrome Extension · UI/UX',
    stack: ['Chrome Manifest V3', 'JavaScript ES6+', 'CSS Glassmorphism', 'Web APIs', 'Local Cache'],
    problem:
      'Default browser new-tab pages are cluttered with ad trackers, fragmented bookmarks, and distracting news feeds that disrupt mental flow.',
    approach:
      'Designed an ultra-clean glassmorphic interface that loads in under 40ms. Combined real-time weather widgets, focus clocks, keyboard command palettes, and custom curated bookmarks in a single composited layer.',
    architecture:
      'Manifest V3 Service Worker managing background alarms and cached API requests without draining laptop battery. Strict CSS backdrop-filter isolation avoiding repaint spikes.',
    result: [
      'Zero external npm dependencies for instant sub-50ms tab loads',
      'Over 99.8% crash-free runtime across Chrome Canary & Stable',
      'Minimalist glass aesthetics favored by student developers',
    ],
    metrics: [
      { label: 'Tab Load Time', value: '< 42ms' },
      { label: 'Bundle Size', value: '18 KB' },
      { label: 'Dependencies', value: '0' },
    ],
    color: '#2f5bff',
    previewGradient: 'from-[#2f5bff]/30 via-[#8a2be2]/20 to-black',
  },
  {
    id: 'focus-v3',
    number: '02',
    title: 'FocusV3 Ambient Timer',
    tagline: 'Productivity Timer with Atmospheric Fog Visuals',
    year: '2024',
    category: 'Web App · Audio/Visual',
    stack: ['React', 'HTML5 Canvas', 'WebAudio API', 'Tailwind CSS', 'LocalStorage'],
    problem:
      'Standard Pomodoro timers produce abrupt anxiety spikes with piercing buzzer alarms and rigid time limits that break deep cognitive immersion.',
    approach:
      'Engineered an ambient generative fog canvas that gently breathes with the user’s breathing cycles, paired with soft harmonic WebAudio bell chimes and interval transitions.',
    architecture:
      'Dual-canvas rendering: one composited background simulating particle mist with Perlin noise math, and one lightweight SVG arc displaying remaining interval percentages.',
    result: [
      '60 FPS steady animation loops even on low-power battery saver profiles',
      'Gentle sine-wave chime alerts engineered with WebAudio oscillators',
      'Preset modes for Deep Study (50/10), Classic Pomodoro (25/5), and Flow State',
    ],
    metrics: [
      { label: 'Frame Rate', value: '60 FPS' },
      { label: 'Audio Engine', value: 'WebAudio Synth' },
      { label: 'External Assets', value: '0' },
    ],
    color: '#8a2be2',
    previewGradient: 'from-[#8a2be2]/30 via-[#ff5733]/20 to-black',
  },
  {
    id: 'ember-crests',
    number: '03',
    title: 'Ember Crests Kitchen',
    tagline: 'Artisanal Wood-Fired Food Ordering & Real-Time Bill Splitter',
    year: '2026',
    category: 'Full Frontend Application',
    stack: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'useReducer Machine', 'WAI-ARIA'],
    problem:
      'Dining apps frequently suffer from messy bill splits, broken layout scaling on small mobile viewports, and confusing group ordering flows.',
    approach:
      'Architected a comprehensive wood-fired food ordering interface featuring a real-time group split-bill engine with penny-perfect integer distribution, a multi-step checkout state machine, and a private VIP technical dossier gate.',
    architecture:
      'Strict separation of concerns: CartContext and SplitContext state machines, zero-scroll-listener IntersectionObservers for sticky elements, and composited CSS hardware animations.',
    result: [
      'Zero layout thrashing with strict flex-shrink and min-h-0 container containment',
      'Penny-perfect split bill algorithm rounding remainder to primary user',
      '100% accessible keyboard trap and focus restoration modals',
    ],
    metrics: [
      { label: 'Lighthouse Perf', value: '98+' },
      { label: 'Split Math Accuracy', value: '100.0%' },
      { label: 'Scroll Jank', value: '0 ms' },
    ],
    color: '#FFD400',
    previewGradient: 'from-[#FFD400]/30 via-[#ff5733]/20 to-black',
  },
  {
    id: 'live-wallpaper',
    number: '04',
    title: 'Live Wallpaper Extension',
    tagline: 'Dynamic Lightweight Browser Wallpaper Engine',
    year: '2024',
    category: 'Extension · Creative Coding',
    stack: ['JavaScript', 'Canvas 2D', 'Trigonometric Math', 'CSS Variables', 'Chrome Storage'],
    problem:
      'Video wallpaper extensions hog gigabytes of RAM and induce severe GPU thermal throttling on laptops.',
    approach:
      'Constructed algorithmic mathematical waveforms and vector field flows rendered directly onto an HTML5 Canvas, drawing gorgeous organic motion using fewer than 40KB of code and under 2% CPU overhead.',
    architecture:
      'RequestAnimationFrame loop with offscreen dirty-rect repaints and dynamic resolution scaling based on device pixel ratio.',
    result: [
      'Under 2% CPU usage while maintaining fluid generative motion',
      'Custom color themes syncing with OS dark/light mode preference',
      'Instant wake from sleep with zero memory leaks',
    ],
    metrics: [
      { label: 'CPU Usage', value: '< 2.1%' },
      { label: 'Memory Footprint', value: '14 MB' },
      { label: 'Resolution', value: 'Dynamic DPI' },
    ],
    color: '#3ef0b0',
    previewGradient: 'from-[#3ef0b0]/30 via-[#2f5bff]/20 to-black',
  },
  {
    id: 'snake-modular',
    number: '05',
    title: 'Modular Snake Engine',
    tagline: 'Zero-Dependency Canvas Arcade Game with Pure Architecture',
    year: '2023',
    category: 'Game Loop · Vanilla JS',
    stack: ['Vanilla JavaScript', 'Canvas 2D', 'State Machine', 'Event Bus', 'Sound Synth'],
    problem:
      'Beginner game projects often devolve into spaghetti code with global mutable variables and collision edge-case bugs.',
    approach:
      'Crafted a pristine, modular architecture separating the Game Loop, Physics/Collision grid, State Machine, and Canvas Renderer into distinct decoupled modules.',
    architecture:
      'Fixed-timestep physics loop with variable rendering interpolation, touch D-pad support, and procedural sound synthesis on food consumption.',
    result: [
      'Modular readable code architecture praised by peers',
      'Zero external libraries or asset downloads',
      'Smooth mobile swipe controls and desktop arrow key mapping',
    ],
    metrics: [
      { label: 'Lines of Code', value: '~380' },
      { label: 'Third-Party Deps', value: '0' },
      { label: 'Touch Latency', value: '8ms' },
    ],
    color: '#ff5733',
    previewGradient: 'from-[#ff5733]/30 via-[#8a2be2]/20 to-black',
  },
];

/**
 * PROJECTS SECTION
 * Minimal editorial index list. Hover shifts row and reveals preview.
 * Clicking opens an in-page deep-dive Case Study Drawer.
 */
export const ProjectsSection: React.FC = () => {
  const [hoveredProject, setHoveredProject] = useState<ProjectData | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  return (
    <section
      id="projects"
      aria-label="Selected Projects"
      className="relative w-full border-t border-[#1F1F1F] bg-[#000000] py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1F1F1F] pb-8 mb-12">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[#FFD400]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />
              <span>03 // SELECTED WORKS</span>
            </div>
            <h2 className="mt-2 font-sora text-3xl sm:text-4xl md:text-5xl font-black text-white">
              Project Index
            </h2>
          </div>
          <p className="font-mono text-xs text-[#737373]">
            Click any row to open full technical case study
          </p>
        </div>

        {/* Minimal Editorial List */}
        <div className="divide-y divide-[#1A1A1A] border-y border-[#1A1A1A]">
          {PROJECTS_LIST.map((proj) => {
            const isHovered = hoveredProject?.id === proj.id;

            return (
              <div
                key={proj.id}
                onMouseEnter={() => setHoveredProject(proj)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => setSelectedProject(proj)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedProject(proj);
                  }
                }}
                className={`group relative flex flex-col md:flex-row md:items-center justify-between py-7 px-4 sm:px-6 transition-all duration-200 cursor-pointer ${
                  isHovered ? 'bg-[#0A0A0A] translate-x-2 sm:translate-x-3' : 'bg-transparent'
                }`}
              >
                {/* Left: Number & Title */}
                <div className="flex items-start md:items-center gap-4 sm:gap-8">
                  <span className="font-mono text-xs text-[#737373] group-hover:text-[#FFD400] transition-colors mt-1 md:mt-0">
                    {proj.number}
                  </span>
                  <div>
                    <h3 className="font-sora text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-[#FFD400] transition-colors flex items-center gap-3">
                      <span>{proj.title}</span>
                      <ArrowUpRight className="h-5 w-5 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-[#FFD400]" />
                    </h3>
                    <p className="mt-1 font-mono text-xs text-[#A3A3A3] group-hover:text-[#D4D4D4] transition-colors">
                      {proj.tagline}
                    </p>
                  </div>
                </div>

                {/* Right: Badges & Year */}
                <div className="mt-4 md:mt-0 flex items-center gap-4 pl-12 md:pl-0 font-mono text-xs">
                  <span className="rounded-full border border-[#262626] bg-[#111111] px-3 py-1 text-[#A3A3A3] group-hover:border-[#FFD400]/40 group-hover:text-white transition-colors">
                    {proj.category}
                  </span>
                  <span className="text-[#737373] font-semibold">{proj.year}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Quick Preview Card (Desktop) */}
        {hoveredProject && (
          <div
            aria-hidden="true"
            className="hidden lg:flex pointer-events-none mt-8 rounded-2xl border border-[#262626] bg-[#0E0E0E] p-6 shadow-2xl items-center justify-between animate-[fadeIn_150ms_ease-out]"
          >
            <div className="flex items-center gap-4">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center font-mono font-bold text-white"
                style={{ backgroundColor: hoveredProject.color }}
              >
                {hoveredProject.number}
              </div>
              <div>
                <h4 className="font-sora text-base font-bold text-white">
                  {hoveredProject.title}
                </h4>
                <div className="flex gap-2 mt-1">
                  {hoveredProject.stack.slice(0, 3).map((st) => (
                    <span
                      key={st}
                      className="rounded bg-[#1A1A1A] px-2 py-0.5 font-mono text-[10px] text-[#A3A3A3]"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-6 font-mono text-xs">
              {hoveredProject.metrics.map((m) => (
                <div key={m.label} className="text-right">
                  <div className="text-[10px] text-[#737373] uppercase">{m.label}</div>
                  <div className="font-bold text-[#FFD400]">{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* IN-PAGE CASE STUDY MODAL / DRAWER */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto"
        >
          <div className="relative w-full max-w-3xl rounded-3xl border border-[#2E2E2E] bg-[#0D0D0D] p-6 sm:p-10 shadow-2xl text-left my-8">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-[#222222] pb-4 mb-6">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: selectedProject.color }}
                />
                <span className="text-[#A3A3A3] uppercase">
                  CASE STUDY // {selectedProject.number} · {selectedProject.category}
                </span>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#262626] bg-[#141414] text-[#A3A3A3] hover:text-white hover:border-[#FFD400] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
                aria-label="Close Case Study"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Title & Tagline */}
            <h3
              id="case-study-title"
              className="font-sora text-3xl sm:text-4xl font-black text-white"
            >
              {selectedProject.title}
            </h3>
            <p className="mt-1 font-mono text-sm text-[#FFD400]">
              {selectedProject.tagline}
            </p>

            {/* Stack Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedProject.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-[#262626] bg-[#141414] px-2.5 py-1 font-mono text-xs text-[#E5E5E5]"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Metrics Ribbon */}
            <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-[#262626] bg-[#141414] p-4 text-center font-mono">
              {selectedProject.metrics.map((m) => (
                <div key={m.label}>
                  <div className="text-[10px] text-[#737373] uppercase tracking-wider">
                    {m.label}
                  </div>
                  <div className="mt-1 text-base sm:text-lg font-bold text-[#FFD400]">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Dossier Sections */}
            <div className="mt-8 space-y-6 font-inter text-sm text-[#A3A3A3] divide-y divide-[#1A1A1A]">
              <div>
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-[#ff5733]" />
                  <span>The Problem</span>
                </h4>
                <p className="leading-relaxed">{selectedProject.problem}</p>
              </div>

              <div className="pt-6">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-[#2f5bff]" />
                  <span>Technical Approach &amp; Architecture</span>
                </h4>
                <p className="leading-relaxed">{selectedProject.approach}</p>
                <div className="mt-3 rounded-xl border border-[#262626] bg-[#0A0A0A] p-3 font-mono text-xs text-[#C5C5C5]">
                  {selectedProject.architecture}
                </div>
              </div>

              <div className="pt-6">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#3ef0b0]" />
                  <span>Quantified Results</span>
                </h4>
                <ul className="space-y-2 font-mono text-xs text-[#C5C5C5]">
                  {selectedProject.result.map((res, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#3ef0b0] font-bold">✓</span>
                      <span>{res}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-[#222222]">
              <button
                onClick={() => setSelectedProject(null)}
                className="rounded-full border border-[#262626] bg-[#141414] px-5 py-2 font-mono text-xs font-semibold text-[#A3A3A3] hover:text-white hover:border-white transition-colors"
              >
                Close Case Study
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
