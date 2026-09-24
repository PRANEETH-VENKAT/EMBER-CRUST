import React, { useState } from 'react';
import { SectionHeader } from '../SectionHeader';
import { Reveal } from '../../../components/ui/Reveal';
import { HarmonicWaveCanvas } from './HarmonicWaveCanvas';
import { KineticTypography } from './KineticTypography';
import { SpecularTiltCard } from './SpecularTiltCard';
import { MicroSynthesizer } from './MicroSynthesizer';

type LabFilter = 'all' | 'wave' | 'type' | 'tilt' | 'synth';

/**
 * CreativeLabSection
 * Interactive playground module embedded directly within the VIP Portfolio Dossier.
 * Houses 4 bespoke creative developer experiments:
 * 1. 60fps Harmonic Sine Wave Fluid Canvas
 * 2. Euclidean Distance Vector Kinetic Variable Typography
 * 3. 3D Specular Fresnel Perspective Tilt Card
 * 4. Polyphonic Harmonic Micro-Click Synthesizer
 */
export const CreativeLabSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<LabFilter>('all');

  return (
    <section id="creative-lab" className="scroll-mt-24 py-8">
      <SectionHeader number="07" title="Creative Lab" />

      <Reveal direction="up">
        <div className="flex flex-col gap-6">
          {/* Section Introduction Deck */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#262626] pb-4">
            <div>
              <p className="font-mono text-xs sm:text-sm text-[#A3A3A3] max-w-2xl leading-relaxed">
                A live interactive engineering sandbox. Exploring tactile micro-interactions,
                60fps HTML5 Canvas fluid physics, dynamic Euclidean typographic tracking,
                anisotropic specular lighting, and zero-file Web Audio oscillator synthesis.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
              {[
                { id: 'all', label: 'All Experiments (4)' },
                { id: 'wave', label: 'Fluid Wave' },
                { id: 'type', label: 'Kinetic Type' },
                { id: 'tilt', label: '3D Tilt' },
                { id: 'synth', label: 'Micro Synth' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as LabFilter)}
                  className={`rounded-full px-3 py-1 font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-[#FFD60A] text-[#0A0A0A]'
                      : 'bg-[#141414] text-[#888888] hover:text-[#F5F5F5] border border-[#262626]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Experiment Grid / Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Experiment A: Harmonic Wave Canvas */}
            {(activeFilter === 'all' || activeFilter === 'wave') && (
              <div className={activeFilter === 'wave' ? 'lg:col-span-2' : ''}>
                <HarmonicWaveCanvas />
              </div>
            )}

            {/* Experiment B: Kinetic Variable Typography */}
            {(activeFilter === 'all' || activeFilter === 'type') && (
              <div className={activeFilter === 'type' ? 'lg:col-span-2' : ''}>
                <KineticTypography />
              </div>
            )}

            {/* Experiment C: 3D Specular Tilt Card */}
            {(activeFilter === 'all' || activeFilter === 'tilt') && (
              <div className={activeFilter === 'tilt' ? 'lg:col-span-2' : ''}>
                <SpecularTiltCard />
              </div>
            )}

            {/* Experiment D: Harmonic Micro-Click Synthesizer */}
            {(activeFilter === 'all' || activeFilter === 'synth') && (
              <div className={activeFilter === 'synth' ? 'lg:col-span-2' : ''}>
                <MicroSynthesizer />
              </div>
            )}
          </div>

          {/* Standalone Editorial Portfolio Launcher Banner */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#FFD60A]/30 bg-gradient-to-r from-[#141414] via-[#1A1A12] to-[#141414] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFD60A]/10 border border-[#FFD60A]/40 text-[#FFD60A]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <div>
                <h4 className="font-sora text-sm font-bold text-[#F5F5F5]">
                  Avant-Garde Standalone Editorial Portfolio
                </h4>
                <p className="font-mono text-xs text-[#A3A3A3]">
                  Prefer the full-bleed, unconstrained editorial magazine experience?
                </p>
              </div>
            </div>

            <a
              href="/portfolio.html"
              target="_blank"
              rel="noopener noreferrer"
              className="press-scale shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#FFD60A] px-4 py-2.5 font-mono text-xs font-bold text-[#0A0A0A] hover:bg-[#FFE566] transition-colors"
            >
              <span>Launch /portfolio.html</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
};
