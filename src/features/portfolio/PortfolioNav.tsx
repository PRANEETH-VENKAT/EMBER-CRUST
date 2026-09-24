import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PortfolioNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onClose: () => void;
}

export const NAV_ITEMS = [
  { id: 'journey', label: '01 Journey' },
  { id: 'toolkit', label: '02 Toolkit' },
  { id: 'projects', label: '03 Projects' },
  { id: 'creative-lab', label: '04 Playground' },
  { id: 'contact', label: '05 Contact' },
];

/**
 * PortfolioNav
 * Minimal sticky navigation header inspired by guillaumezhu.com.
 * Features the Padavala "P" mark, active anchor links with a club yellow (#FFD400)
 * indicator line, and smooth return to food app.
 */
export const PortfolioNav: React.FC<PortfolioNavProps> = ({
  activeSection,
  onNavigate,
  onClose,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1F1F1F] bg-[#000000]/85 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('hero')}
            className="group flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] rounded-lg p-1 text-left"
            aria-label="Padavala Portfolio - Scroll to Top"
          >
            {/* P Geometric Mark */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111111] border border-[#262626] text-[#FFD400] group-hover:border-[#FFD400] transition-colors">
              <span className="font-bebas text-xl leading-none">P</span>
            </div>
            <div>
              <span className="font-bebas text-lg tracking-wider text-white group-hover:text-[#FFD400] transition-colors">
                PADAVALA
              </span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3ef0b0]" />
                <span className="font-mono text-[10px] text-[#A3A3A3] tracking-wide">
                  SRM IST RAMAPURAM
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Minimal Anchor Links (Desktop / Tablet) */}
        <nav
          aria-label="Portfolio sections"
          className="hidden md:flex items-center gap-1 lg:gap-2 font-mono text-xs"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-3 py-2 transition-colors rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FFD400] ${
                  isActive
                    ? 'text-[#FFD400] font-semibold'
                    : 'text-[#A3A3A3] hover:text-white hover:bg-[#141414]'
                }`}
              >
                <span>{item.label}</span>
                {/* Yellow active underline indicator */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#FFD400] shadow-[0_0_8px_#FFD400]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Return */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Close & Return to Food App Button */}
          <button
            onClick={onClose}
            id="portfolio-return-food-app-btn"
            aria-label="Close portfolio and return to Ember Crests dining interface (Esc)"
            className="group flex h-9 sm:h-10 items-center gap-2 rounded-full border border-[#FFD400] bg-[#FFD400]/10 px-3.5 sm:px-4 font-mono text-xs font-semibold text-[#FFD400] hover:bg-[#FFD400] hover:text-[#000000] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] shadow-[0_0_15px_rgba(255,212,0,0.15)]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Return to Dining</span>
            <span className="sm:hidden">Exit</span>
            <kbd className="hidden lg:inline rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-[#FFD400] group-hover:text-black group-hover:bg-black/10">
              ESC
            </kbd>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Subnav */}
      <div className="flex md:hidden overflow-x-auto border-t border-[#1A1A1A] px-3 py-1.5 scrollbar-none font-mono text-[11px]">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`shrink-0 px-2.5 py-1 rounded transition-colors ${
                isActive
                  ? 'bg-[#FFD400]/15 text-[#FFD400] font-semibold'
                  : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
