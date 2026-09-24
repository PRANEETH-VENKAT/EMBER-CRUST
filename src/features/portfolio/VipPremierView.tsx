import React, { useEffect, useRef, useState } from 'react';
import { CustomCursor } from './CustomCursor';
import { PortfolioNav } from './PortfolioNav';
import { HeroSection } from './HeroSection';
import { JourneySection } from './JourneySection';
import { ToolkitSection } from './ToolkitSection';
import { ProjectsSection } from './ProjectsSection';
import { SaaSSpotlightSection } from './SaaSSpotlightSection';
import { CreativeLabSection } from './playground/CreativeLabSection';
import { ContactSection } from './ContactSection';

interface VipPremierViewProps {
  isOpen: boolean;
  onClose: () => void;
  triggerElement?: HTMLElement | null;
}

/**
 * VIP TABLE PREMIER VIEW // PADAVALA TECHNICAL PORTFOLIO
 * Full-screen avant-garde portfolio submission seamlessly embedded inside Ember Crests.
 * Integrates:
 * - Minimalist text-forward Hero (guillaumezhu.com inspired)
 * - Three-stage sequential Journey ("First... Then... Today...")
 * - Two grouped Toolkit grids (Front-end & AI/Creative with inline SVGs)
 * - Editorial Project Index with in-page Case Studies
 * - Visual Style B: "SaaS Feature Announcement" Spotlight with live telemetry
 * - Accessible Contact Section & seamless return to Ember Crests dining.
 */
export const VipPremierView: React.FC<VipPremierViewProps> = ({
  isOpen,
  onClose,
  triggerElement,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Keyboard navigation & Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Accessible Focus Trap
      if (e.key === 'Tab') {
        const focusable = containerRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (triggerElement) {
        triggerElement.focus();
      }
    };
  }, [isOpen, onClose, triggerElement]);

  // Section Observer for active navigation highlight
  useEffect(() => {
    if (!isOpen) return;

    const sections = ['hero', 'journey', 'toolkit', 'projects', 'creative-lab', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: containerRef.current,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isOpen]);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Padavala Creative Engineering Portfolio"
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[#000000] text-[#F5F5F5] antialiased selection:bg-[#FFD400] selection:text-black"
    >
      {/* Hardware-accelerated fine-pointer custom cursor */}
      <CustomCursor />

      {/* Minimal Sticky Navigation */}
      <PortfolioNav
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onClose={onClose}
      />

      {/* Main Narrative Canvas */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* SECTION 1: HERO */}
        <HeroSection onScrollToJourney={() => handleNavigate('journey')} />

        {/* SECTION 2: THE JOURNEY ("First... Then... Today...") */}
        <JourneySection />

        {/* SECTION 3: TOOLKIT & CAPABILITIES */}
        <ToolkitSection />

        {/* SECTION 4: SELECTED PROJECTS & CASE STUDIES */}
        <ProjectsSection />

        {/* VISUAL STYLE B: SAAS FEATURE SPOTLIGHT */}
        <SaaSSpotlightSection
          onOpenCaseStudy={() => handleNavigate('projects')}
        />

        {/* SECTION 5: CREATIVE LAB (PLAYGROUND) */}
        <div className="w-full border-t border-[#1F1F1F] bg-[#050505] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <CreativeLabSection />
          </div>
        </div>

        {/* SECTION 6: CONTACT & RETURN */}
        <ContactSection onReturnToFoodApp={onClose} />
      </main>
    </div>
  );
};

export default VipPremierView;
