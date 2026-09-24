import React from 'react';
import { Flame, MapPin, Clock, Phone } from 'lucide-react';
import { Reveal } from './ui/Reveal';

interface FooterProps {
  onOpenPortfolio?: (triggerEl?: HTMLElement) => void;
}

/**
 * Footer component providing operating hours, campus location with postal PIN clue,
 * phone contact, craft pledge, and subtle "Who built this?" easter egg.
 */
export const Footer: React.FC<FooterProps> = ({ onOpenPortfolio }) => {
  return (
    <footer className="w-full max-w-full overflow-x-hidden border-t border-[#262626] bg-[#0A0A0A] text-[#A3A3A3]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Reveal direction="up">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#141414] border border-[#262626] text-[#FFD60A]">
                  <Flame className="h-5 w-5 fill-[#FFD60A]" />
                </div>
                <span className="font-bebas text-2xl tracking-wider text-[#F5F5F5]">
                  EMBER &amp; CRUST
                </span>
              </div>

              <p className="font-mono text-xs leading-relaxed text-[#A3A3A3]">
                Wood-fired sourdough pizza &amp; smashed-to-order burgers. 48-hour cold
                fermentation, live oak fires at 900°F.
              </p>

              <div className="flex items-center gap-2 font-mono text-xs text-[#FFD60A]">
                <span className="h-2 w-2 rounded-full bg-[#FFD60A]" />
                <span>Oven temperature running steady at 900°F</span>
              </div>
            </div>

            {/* Kitchen Hours */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#F5F5F5]">
                <Clock className="h-4 w-4 text-[#FFD60A]" />
                <span>Oven Hours</span>
              </h4>
              <ul className="space-y-2 font-mono text-xs">
                <li className="flex justify-between border-b border-[#262626] pb-1">
                  <span className="text-[#A3A3A3]">Tuesday – Friday</span>
                  <span className="text-[#F5F5F5]">12:30 PM – 11:30 PM</span>
                </li>
                <li className="flex justify-between border-b border-[#262626] pb-1">
                  <span className="text-[#A3A3A3]">Saturday &amp; Sunday</span>
                  <span className="text-[#F5F5F5]">12:00 PM – 12:00 AM</span>
                </li>
                <li className="flex justify-between pb-1">
                  <span className="text-[#A3A3A3]">Monday</span>
                  <span className="text-[#FFD60A] font-semibold">
                    Cold Ovens (Closed)
                  </span>
                </li>
              </ul>
            </div>

            {/* Location & Contact - SRM IST Ramapuram with PIN code 600089 */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#F5F5F5]">
                <MapPin className="h-4 w-4 text-[#FFD60A]" />
                <span>Smokehouse Location</span>
              </h4>
              <p className="font-mono text-xs leading-relaxed text-[#A3A3A3]">
                SRM IST Campus, Bharathi Salai,
                <br />
                Ramapuram, Chennai, Tamil Nadu – 600089
              </p>
              <div className="pt-1 font-mono text-xs">
                <p className="flex items-center gap-2 text-[#A3A3A3]">
                  <Phone className="h-3.5 w-3.5 text-[#FFD60A]" />
                  <span>+91 (44) 4392-EMBER</span>
                </p>
              </div>
            </div>

            {/* Quality & Craft pledge with Clue */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#F5F5F5]">
                Our Craft Promise
              </h4>
              <p className="font-mono text-xs leading-relaxed text-[#A3A3A3]">
                No commercial frozen dough or pre-ground patties. Every crust stretched by
                hand and every sauce simmered daily from scratch.
              </p>
              <div className="rounded-xl border border-[#262626] bg-[#141414] p-2.5 font-mono text-[11px] text-[#A3A3A3] leading-relaxed">
                Crafted at SRM IST, Ramapuram, Chennai –{' '}
                <span className="inline-block border-b border-[#FFD60A]/80 w-16 text-center font-mono text-[#FFD60A] tracking-widest font-semibold">
                  ______
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Bottom copyright line */}
        <Reveal direction="up" delay={100}>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#262626] pt-6 font-mono text-xs text-[#737373] sm:flex-row">
            <p>
              &copy; {new Date().getFullYear()} EMBER &amp; CRUST Wood-Fired Kitchen. All
              rights reserved.
            </p>
            <div className="flex items-center gap-2 text-[#737373]">
              <span>Forged with fire &amp; sourdough</span>
              <span>·</span>
              <button
                type="button"
                onClick={(e) => onOpenPortfolio?.(e.currentTarget)}
                id="footer-who-built-this-link"
                className="text-[#FFD60A] hover:underline focus:outline-none focus:ring-1 focus:ring-[#FFD60A] rounded px-1 transition-colors"
                aria-label="Padavala Portfolio - Who built this?"
              >
                Who built this?
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
};

export default Footer;
