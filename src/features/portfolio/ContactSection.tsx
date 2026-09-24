import React, { useState } from 'react';
import { Mail, Github, Linkedin, ArrowLeft, Check, Copy, ExternalLink } from 'lucide-react';

interface ContactSectionProps {
  onReturnToFoodApp: () => void;
}

/**
 * CONTACT SECTION
 * "Open to joining a creative team" style bold closing line.
 * Direct communication channels, academic credentials, and return to Ember Crests dining.
 */
export const ContactSection: React.FC<ContactSectionProps> = ({
  onReturnToFoodApp,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const email = 'praneethvenkat.cn@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="contact"
      aria-label="Contact and Colloboration"
      className="relative w-full border-t border-[#1F1F1F] bg-[#050505] py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl text-center">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#0E0E0E] px-4 py-1.5 font-mono text-xs text-[#3ef0b0] mb-8">
          <span className="h-2 w-2 rounded-full bg-[#3ef0b0] shadow-[0_0_8px_#3ef0b0] animate-pulse" />
          <span>OPEN TO JOINING A CREATIVE &amp; ENGINEERING TEAM</span>
        </div>

        {/* Big Bold Headline */}
        <h2 className="font-sora text-4xl sm:text-6xl md:text-7xl font-black text-white leading-tight">
          Let’s engineer something <br />
          <span className="bg-gradient-to-r from-white via-[#FFD400] to-[#3ef0b0] bg-clip-text text-transparent">
            unforgettable.
          </span>
        </h2>

        {/* Editorial Subline */}
        <p className="mt-6 font-inter text-base sm:text-lg text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed">
          I'm eager to collaborate with ambitious software engineering teams, design studios,
          and research initiatives pushing the frontier of intelligent user experiences.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {/* Copy Email Button */}
          <div className="flex items-center rounded-2xl border border-[#2E2E2E] bg-[#0E0E0E] p-1.5">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2.5 px-4 py-2 font-mono text-xs text-white hover:text-[#FFD400] transition-colors"
            >
              <Mail className="h-4 w-4 text-[#FFD400]" />
              <span>{email}</span>
            </a>

            <button
              onClick={handleCopyEmail}
              aria-label="Copy email address"
              className="flex h-8 items-center gap-1 rounded-xl bg-[#1C1C1C] px-3 font-mono text-[11px] text-[#A3A3A3] hover:text-white hover:bg-[#262626] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-[#3ef0b0]" />
                  <span className="text-[#3ef0b0]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* GitHub Link */}
          <a
            href="https://github.com/PRANEETH-VENKAT/EMBER-CRUST"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-2xl border border-[#2E2E2E] bg-[#0E0E0E] px-5 py-3.5 font-mono text-xs font-semibold text-white hover:border-[#FFD400] hover:text-[#FFD400] transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>GitHub Profile</span>
            <ExternalLink className="h-3 w-3 text-[#737373]" />
          </a>

          {/* LinkedIn Link */}
          <a
            href="https://www.linkedin.com/in/praneeth-venkat-352068437/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-2xl border border-[#2E2E2E] bg-[#0E0E0E] px-5 py-3.5 font-mono text-xs font-semibold text-white hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors"
          >
            <Linkedin className="h-4 w-4" />
            <span>LinkedIn</span>
            <ExternalLink className="h-3 w-3 text-[#737373]" />
          </a>
        </div>

        {/* Return to Food App CTA Button */}
        <div className="mt-16 pt-12 border-t border-[#1C1C1C] flex flex-col items-center">
          <p className="font-mono text-xs text-[#737373] mb-4">
            Finished reviewing the portfolio submission?
          </p>

          <button
            onClick={onReturnToFoodApp}
            id="contact-return-food-btn"
            className="group flex items-center gap-3 rounded-full bg-[#FFD400] text-black px-7 py-3.5 font-mono text-xs font-black shadow-[0_4px_25px_rgba(255,212,0,0.3)] hover:bg-[#e6bf00] transition-all focus:outline-none focus:ring-4 focus:ring-[#FFD400]/40"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>RETURN TO EMBER CRESTS DINING</span>
            <kbd className="rounded bg-black/20 px-2 py-0.5 text-[10px] text-black">
              ESC
            </kbd>
          </button>
        </div>

        {/* Academic Colophon Stamp */}
        <div className="mt-16 font-mono text-[11px] text-[#525252] space-y-1">
          <p>PRANEETH · FIRST-YEAR B.TECH AI/ML AT SRM RMP</p>
          <p className="text-[#3ef0b0]">WOOD-FIRED DINING INTERFACE SUBMISSION · ROUND 1</p>
        </div>
      </div>
    </section>
  );
};
