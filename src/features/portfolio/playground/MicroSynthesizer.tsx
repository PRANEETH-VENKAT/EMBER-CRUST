import React, { useState, useRef, useCallback, useEffect } from 'react';

interface NoteDefinition {
  name: string;
  frequency: number;
  keyLabel: string;
  chordDegree: string;
}

const TUNED_NOTES: NoteDefinition[] = [
  { name: 'C5', frequency: 523.25, keyLabel: '1', chordDegree: 'Root' },
  { name: 'E5', frequency: 659.25, keyLabel: '2', chordDegree: 'Major 3rd' },
  { name: 'G5', frequency: 783.99, keyLabel: '3', chordDegree: 'Perfect 5th' },
  { name: 'B5', frequency: 987.77, keyLabel: '4', chordDegree: 'Major 7th' },
  { name: 'D6', frequency: 1174.66, keyLabel: '5', chordDegree: '9th Extension' },
];

interface MicroSynthesizerProps {
  className?: string;
}

/**
 * MicroSynthesizer
 * Zero-audio-file Web Audio synthesizer generating harmonic chime notes on demand.
 * Features AudioContext oscillator synthesis with exponential gain decay,
 * tactile vertical illuminated keys, and active acoustic telemetry.
 */
export const MicroSynthesizer: React.FC<MicroSynthesizerProps> = ({ className = '' }) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [lastPlayed, setLastPlayed] = useState<{ name: string; freq: number; time: string } | null>(
    null
  );

  // Lazy initialize AudioContext on user gesture
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Web Audio Synth Note Engine
  const playNote = useCallback(
    (frequency: number, noteName: string, duration = 0.16) => {
      if (!soundEnabled) return;

      try {
        const audioCtx = getAudioContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;

        // Instantiate OscillatorNode set to type: 'sine'
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, now);

        // Instantiate GainNode with instant attack and exponential decay
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.14, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        // Connect oscillator -> gainNode -> destination
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + duration);

        // Clean disconnect
        setTimeout(() => {
          try {
            osc.disconnect();
            gainNode.disconnect();
          } catch {
            // Safe cleanup
          }
        }, (duration + 0.1) * 1000);

        setActiveNote(noteName);
        setLastPlayed({
          name: noteName,
          freq: frequency,
          time: new Date().toLocaleTimeString(),
        });

        setTimeout(() => {
          setActiveNote((curr) => (curr === noteName ? null : curr));
        }, 180);
      } catch (err) {
        console.warn('Web Audio note trigger error:', err);
      }
    },
    [getAudioContext, soundEnabled]
  );

  // Keyboard shortcut listener (Keys 1 to 5)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing when user is typing in form inputs
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const keyIndex = parseInt(e.key, 10) - 1;
      if (keyIndex >= 0 && keyIndex < TUNED_NOTES.length) {
        const note = TUNED_NOTES[keyIndex];
        playNote(note.frequency, note.name);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playNote]);

  // Arpeggiate chord demonstration
  const handleArpeggiate = () => {
    TUNED_NOTES.forEach((note, idx) => {
      setTimeout(() => {
        playNote(note.frequency, note.name, 0.22);
      }, idx * 110);
    });
  };

  return (
    <div
      className={`relative flex flex-col rounded-2xl border border-white/10 bg-[#08090c] p-5 sm:p-6 shadow-2xl ${className}`}
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#e4ff3a]" />
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              Harmonic Micro-Click Synthesizer
            </h4>
          </div>
          <p className="font-mono text-[10px] text-neutral-400 mt-0.5">
            Web Audio Oscillator · Polyphonic Harmonic Tones
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleArpeggiate}
            className="flex items-center gap-1 rounded-full border border-[#e4ff3a]/40 bg-[#e4ff3a]/10 px-3 py-1 font-mono text-[10px] font-semibold text-[#e4ff3a] hover:bg-[#e4ff3a] hover:text-black transition-all cursor-pointer"
          >
            <span>Arpeggiate Chord</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Toggle Sound"
          >
            {soundEnabled ? 'AUDIO: ON' : 'AUDIO: MUTED'}
          </button>
        </div>
      </div>

      {/* Tactile Visual Keyboard UI (5 tuned keys) */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 py-2">
        {TUNED_NOTES.map((note) => {
          const isTriggered = activeNote === note.name;

          return (
            <button
              key={note.name}
              type="button"
              onClick={() => playNote(note.frequency, note.name)}
              onMouseEnter={() => {
                // Pre-warm audio on mouse enter
                getAudioContext();
              }}
              className={`group relative flex h-36 sm:h-44 flex-col justify-between rounded-xl border p-3 text-left transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e4ff3a] ${
                isTriggered
                  ? 'border-[#e4ff3a] bg-[#e4ff3a] text-[#0b0c0e] -translate-y-2 shadow-[0_12px_24px_rgba(228,255,58,0.35)]'
                  : 'border-white/[0.08] bg-white/[0.04] text-neutral-300 hover:border-[#e4ff3a]/60 hover:bg-white/[0.07] hover:-translate-y-1'
              }`}
            >
              {/* Key Top: Number & Degree */}
              <div className="flex items-start justify-between">
                <span
                  className={`font-mono text-xs font-bold ${
                    isTriggered ? 'text-black' : 'text-[#e4ff3a]'
                  }`}
                >
                  [{note.keyLabel}]
                </span>
                <span
                  className={`font-mono text-[8px] uppercase tracking-wider ${
                    isTriggered ? 'text-black/80' : 'text-neutral-500'
                  }`}
                >
                  {note.chordDegree}
                </span>
              </div>

              {/* Key Middle Graphic Wavelet */}
              <div className="flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                <svg
                  width="24"
                  height="12"
                  viewBox="0 0 24 12"
                  fill="none"
                  stroke={isTriggered ? '#0b0c0e' : '#e4ff3a'}
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M2 6 Q6 1, 12 6 T22 6" />
                </svg>
              </div>

              {/* Key Base: Note Name & Frequency */}
              <div className="flex flex-col">
                <span
                  className={`font-sora text-lg sm:text-2xl font-black ${
                    isTriggered ? 'text-[#0b0c0e]' : 'text-white'
                  }`}
                >
                  {note.name}
                </span>
                <span
                  className={`font-mono text-[9px] ${
                    isTriggered ? 'text-black/70' : 'text-neutral-400'
                  }`}
                >
                  {note.frequency.toFixed(1)} Hz
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Minimalist Status Indicator & Active Tone Telemetry */}
      <div className="mt-4 flex flex-wrap items-center justify-between border-t border-white/[0.08] pt-3 font-mono text-[10px]">
        <div className="flex items-center gap-2 text-neutral-400">
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#e4ff3a]" />
          <span>PRESS KEYS [1 - 5] OR CLICK PADS</span>
        </div>

        <div className="text-neutral-400">
          {lastPlayed ? (
            <span>
              LAST TONE:{' '}
              <strong className="text-[#e4ff3a]">
                {lastPlayed.name} ({lastPlayed.freq.toFixed(1)} Hz)
              </strong>{' '}
              AT {lastPlayed.time}
            </span>
          ) : (
            <span className="text-neutral-500">STANDBY · ZERO AUDIO LOADED</span>
          )}
        </div>
      </div>
    </div>
  );
};
