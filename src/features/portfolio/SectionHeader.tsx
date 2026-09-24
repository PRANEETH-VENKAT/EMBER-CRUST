import React from 'react';

interface SectionHeaderProps {
  number: string;
  title: string;
}

/**
 * SectionHeader
 * Shared "NN // TITLE" header used by portfolio sections that don't
 * carry their own bespoke header (e.g. the Creative Lab playground).
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({ number, title }) => (
  <div className="border-b border-[#1F1F1F] pb-6 mb-8">
    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[#FFD400]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />
      <span>{number} // PLAYGROUND</span>
    </div>
    <h2 className="mt-2 font-sora text-3xl sm:text-4xl md:text-5xl font-black text-white">
      {title}
    </h2>
  </div>
);

export default SectionHeader;
