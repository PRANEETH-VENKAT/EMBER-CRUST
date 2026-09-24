import React from 'react';
import { ArrowDown, Sparkles, Award } from 'lucide-react';
import { DishImage } from './DishImage';

interface HeroProps {
  onExploreClick: () => void;
}

/**
 * Hero component presenting brand headline, wood-fired value propositions, and featured dish showcase.
 */
export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section className="relative overflow-hidden border-b border-[#262626] bg-[#0A0A0A] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Typography & CTAs with staggered fade-up on load */}
          <div className="text-center lg:col-span-7 lg:text-left">
            {/* Pill badge (Delay 0ms) */}
            <div
              className="anim-fade-up inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#141414] px-3.5 py-1.5 font-mono text-xs font-semibold text-[#FFD60A]"
              style={{ animationDelay: '0ms' }}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#FFD60A]" />
              <span>900° Wood-Fired Oven &bull; Smashed-to-Order Patties</span>
            </div>

            {/* Heading (Delay 80ms) */}
            <h1
              className="anim-fade-up mt-6 font-bebas text-5xl tracking-wide text-[#F5F5F5] sm:text-6xl md:text-7xl lg:text-8xl"
              style={{ animationDelay: '80ms' }}
            >
              EMBER <span className="text-[#FFD60A]">&amp;</span> CRUST
            </h1>

            {/* Subheading (Delay 160ms) */}
            <p
              className="anim-fade-up mt-2 font-sora text-xl font-semibold text-[#F5F5F5] sm:text-2xl"
              style={{ animationDelay: '160ms' }}
            >
              Charred to Perfection. Smashed with Passion.
            </p>

            {/* Subtext description (Delay 240ms) */}
            <p
              className="anim-fade-up mx-auto mt-4 max-w-2xl text-base text-[#A3A3A3] sm:text-lg lg:mx-0"
              style={{ animationDelay: '240ms' }}
            >
              Welcome to our open-fire kitchen. 48-hour fermented sourdough crusts baked
              at 900°F alongside prime smash burgers on white-hot cast iron.
            </p>

            {/* Action buttons (Delay 320ms) */}
            <div
              className="anim-fade-up mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
              style={{ animationDelay: '320ms' }}
            >
              <button
                onClick={onExploreClick}
                id="hero-cta-button"
                className="cta-sweep-btn press-scale group flex items-center gap-2.5 rounded-full bg-[#FFD60A] px-7 py-3.5 font-mono text-sm font-bold text-[#0A0A0A] shadow-lg shadow-[#FFD60A]/10 transition-colors duration-[var(--dur-base)] hover:bg-[#E5C009] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
              >
                <span>Explore The Menu (23 Dishes)</span>
                <ArrowDown className="h-4 w-4 transition-transform duration-[var(--dur-fast)] group-hover:translate-y-1" />
              </button>

              <div className="flex items-center gap-2 font-mono text-xs text-[#A3A3A3]">
                <div className="flex h-2 w-2 rounded-full bg-[#FFD60A]" />
                <span>Wood-Fire Oven Firing Now</span>
              </div>
            </div>

            {/* Micro value props (Delay 400ms) */}
            <div
              className="anim-fade-up mt-10 grid grid-cols-3 gap-3 border-t border-[#262626] pt-6 text-left"
              style={{ animationDelay: '400ms' }}
            >
              <div>
                <p className="font-bebas text-2xl text-[#FFD60A] sm:text-3xl">48 HRS</p>
                <p className="font-mono text-xs text-[#A3A3A3]">Cold Fermented Dough</p>
              </div>
              <div>
                <p className="font-bebas text-2xl text-[#FFD60A] sm:text-3xl">900°F</p>
                <p className="font-mono text-xs text-[#A3A3A3]">Live Oak Wood Fire</p>
              </div>
              <div>
                <p className="font-bebas text-2xl text-[#FFD60A] sm:text-3xl">
                  23 DISHES
                </p>
                <p className="font-mono text-xs text-[#A3A3A3]">Original Scratch Menu</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Food Showcase (Delay 200ms) */}
          <div
            className="anim-fade-up relative lg:col-span-5"
            style={{ animationDelay: '200ms' }}
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative overflow-hidden rounded-3xl border border-[#262626] bg-[#141414] shadow-2xl h-80 sm:h-96 w-full card-img-container">
                <DishImage
                  slug="truffled-wild-mushroom-pizza"
                  name="Truffled Wild Mushroom Pizza"
                  category="Pizza"
                  width={500}
                  height={400}
                  className="h-full w-full object-cover object-center"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80 pointer-events-none" />

                {/* Floating highlight card */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-[#262626] bg-[#0A0A0A]/95 p-4">
                  <div>
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#FFD60A]">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Signature Sourdough Pie</span>
                    </div>
                    <p className="mt-0.5 font-sora text-sm font-bold text-[#F5F5F5]">
                      Truffled Wild Mushroom
                    </p>
                  </div>
                  <span className="font-bebas text-2xl text-[#FFD60A]">₹549</span>
                </div>

                {/* Floating badge */}
                <div className="absolute top-4 right-4 rounded-full border border-[#262626] bg-[#0A0A0A]/95 px-3 py-1 font-mono text-xs font-semibold text-[#F5F5F5] shadow-lg flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-[#FFD60A]" />
                  <span>Chef's Choice</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
