# EMBER & CRUST — System Architecture & Engineering Guide

## 1. Executive Overview

**EMBER & CRUST** is an artisanal wood-fired food ordering web application engineered for maximum performance, responsiveness, and resilience. The frontend is built on **React 19**, **Vite 8**, and **Tailwind CSS v4** following strict zero-bloat principles.

Key engineering benchmarks:
- **Refactor & Hardening**: Production-hardened with zero changes to visual identity or customer features.
- **Zero Third-Party Motion Libraries**: Animations run purely via composited CSS properties (`transform`, `opacity`) and the native Web Animations API.
- **Zero Blur / Filter**: Overlays and navigation bars use solid alpha backgrounds (`bg-black/90`, `bg-[#0A0A0A]`) with zero `filter` or `backdrop-filter: blur()`, maintaining fluid 60fps/120fps frame rates.
- **Strict Horizontal Overflow Containment**: Guaranteed zero horizontal scrolling across mobile viewports (320px–430px) through defensive viewport locking and flex boundaries.
- **Fail-Safe Persistence**: Local storage state validation guards against corrupted payloads.
- **Locked VIP Premier View**: The developer dossier and technical portfolio is gated behind a 6-digit PIN modal, accessible via the top navbar, and code-split via dynamic imports.

---

## 2. Directory Structure

```text
├── docs/
│   └── ARCHITECTURE.md          # Architectural decisions & data flow documentation
├── portfolio/
│   ├── portfolio.json           # Single source of truth for technical dossier & stats
│   └── PORTFOLIO.md             # Generated GitHub-friendly plain text view
├── public/
│   └── images/
│       └── menu/                # 27 WebP food assets resolved via item slugs
├── scripts/
│   └── build-portfolio-md.js    # Markdown build generator script (npm run portfolio:md)
├── src/
│   ├── components/              # Modular UI components (one component per file)
│   │   ├── ui/
│   │   │   └── Reveal.tsx       # Zero-scroll IntersectionObserver scroll reveal
│   │   ├── CartDrawer.tsx       # Slide-out order summary with count-up animation
│   │   ├── CartItem.tsx         # Individual line item with increment/decrement
│   │   ├── CategoryFilter.tsx   # Contained horizontal chip navigation with sliding pill
│   │   ├── DishImage.tsx        # Optimized image loader with dark skeleton fallback
│   │   ├── ErrorBoundary.tsx    # Declarative component tree error protection
│   │   ├── FoodCard.tsx         # Menu dish card with zoom, badge, and add-to-cart
│   │   ├── FoodGrid.tsx         # Category, dietary, and fuzzy search grid
│   │   ├── Footer.tsx           # Contact details, schedule & campus location clue
│   │   ├── Hero.tsx             # Brand statement and featured wood-fired dish
│   │   ├── MarqueeStrip.tsx     # Single infinite strip, paused off-screen and on hover
│   │   ├── Navbar.tsx           # Header with VIP access button, search, and cart
│   │   ├── SearchModal.tsx      # Command-palette modal with quick tags and keyboard navigation
│   │   └── VipGateModal.tsx     # 6-digit PIN gate modal with rate limiting and hints
│   ├── config/
│   │   └── access.ts            # VIP gate: SHA-256 hash of the PIN + verification
│   ├── context/
│   │   └── CartContext.tsx      # Hardened reducer-based cart state & persistence
│   ├── data/
│   │   └── menu.ts              # Single source of truth for 27 menu dishes
│   ├── features/
│   │   └── portfolio/           # Modular VIP Premier View dossier suite
│   │       ├── types.ts         # Shared portfolio TypeScript interfaces
│   │       ├── VipPremierView.tsx # Full-screen menu-card frame & sweep coordinator
│   │       ├── VipHero.tsx      # Staggered PRANEETH typography & count-up stat chips
│   │       ├── SideRail.tsx     # Zero-scroll desktop rail & mobile dot-bar
│   │       ├── SectionHeader.tsx # Outlined background numbers & dotted leader line
│   │       ├── MeetTheChefSection.tsx # Split layout with golden "P" monogram
│   │       ├── EducationSection.tsx # Vertical timeline with animated scaleY line
│   │       ├── IngredientsSection.tsx # Grouped skill chips with verbatim levels
│   │       ├── AiKitchenSection.tsx # 5-step engineering methodology with connecting line
│   │       ├── SignatureDishesSection.tsx # Bento grid with disabled TODO buttons
│   │       ├── AwardsSection.tsx # Trophy SVG cards with yellow left accents
│   │       ├── TheRecipeSection.tsx # Mock code editor & 3-step item creation guide
│   │       ├── NextCourseSection.tsx # Dotted learning roadmap without percentages
│   │       └── ReservationsSection.tsx # Ticket stub cards with email copy interaction
│   ├── hooks/
│   │   ├── useCountUp.ts        # 60fps rAF price & stat counter
│   │   ├── useDebouncedValue.ts # Input debouncer (200ms)
│   │   ├── useInView.ts         # Single shared IntersectionObserver hook
│   │   └── useSlidingIndicator.ts # Matrix-free transform sliding indicator
│   ├── styles/
│   │   └── animations.css       # Hardware-accelerated keyframes & utility classes
│   ├── utils/
│   │   ├── constants.ts         # Centralized application constants & magic numbers
│   │   ├── formatCurrency.ts    # Indian Rupee (₹) standard currency formatter
│   │   └── getImagePath.ts      # Slug-to-asset resolution helper
│   ├── App.tsx                  # Root coordinator wrapped with ErrorBoundary
│   ├── index.css                # Tailwind theme tokens & mobile viewport containment
│   └── main.tsx                 # React DOM mount point
├── eslint.config.js             # ESLint flat config with TypeScript and React plugins
└── package.json                 # Dependency manifest & scripts
```

---

## 3. Data Flow & State Management

### 3.1 Cart State Machine (`CartContext.tsx`)
Cart state follows a unidirectional deterministic reducer model (`useReducer`):

```text
[User Action] ──> [dispatch(Action)] ──> [cartReducer] ──> [New State]
                                                               │
                           ┌───────────────────────────────────┴─────────────────────────────────┐
                           ▼                                                                     ▼
               [localStorage.setItem]                                                   [Subscribers Re-render]
             (Survives browser reloads)                                            (useCountUp, Navbar Badge, Drawer)
```

- **Validation at Boundary**: `getInitialCart()` tests parsed JSON against `isValidCartItem()`. Malformed or non-array records trigger an automatic fallback to `[]` without throwing.
- **Edge Cases Handled**:
  - Decreasing quantity from `1` removes the item entirely.
  - Adding an existing item increments its quantity without creating duplicate rows.
  - Cart item IDs are stable string identifiers.
- **Integer Rounding**: Tax (`TAX_RATE = 0.05`) and totals use integer-safe rounding `Math.round(subtotal * 0.05)` to avoid floating-point inaccuracies.
- **Timer Memory Safety**: Flying badge bump triggers use a stored `useRef<NodeJS.Timeout | null>` that is explicitly cleaned up on unmount.

---

## 4. Mobile Horizontal Scroll Fix & Viewport Containment

### Root Cause
Mobile viewports (e.g. 320px–430px) previously experienced horizontal scrolling because nested flex elements with `overflow-x: auto` had unconstrained parents without explicit `min-w-0 max-w-full overflow-hidden`.

### Architectural Solution
1. **Global Viewport Lock (`src/index.css`)**:
   Enforced strict `overflow-x: hidden` and `max-width: 100%` on `html`, `body`, and `#root`.
2. **Defensive Component Hierarchy**:
   - `App.tsx`: Added `w-full max-w-full overflow-x-hidden` on the app shell and `<main>`.
   - `CategoryFilter.tsx`: Bounded by `w-full max-w-full min-w-0 overflow-hidden`.
   - `FoodGrid.tsx`: Quick filter suggestion chips wrapped in `min-w-0 max-w-full overflow-hidden`.
   - `Footer.tsx`: Enclosed with `w-full max-w-full overflow-x-hidden`.

---

## 5. Performance & Animation Architecture

The application strictly obeys core performance rules:

1. **Composited Only**: All animations and transitions manipulate **only** `transform` and `opacity`.
2. **Zero Blur & Zero Backdrop-Filter**: VIP Premier View and modal overlays use pure composited solid alpha backgrounds (`bg-black/90`, `bg-[#0A0A0A]/95`) to prevent expensive GPU compositor redraws.
3. **Zero Scroll Listeners**: Scroll reveals and navbar elevation use `IntersectionObserver` sentinel elements. The VIP `SideRail` navigation updates dynamically via an `IntersectionObserver` observing all 9 section containers.
4. **Single Marquee**: Only one continuous loop exists (`<MarqueeStrip>`). It pauses when outside the viewport (`IntersectionObserver`) and on hover.
5. **Stagger Budget**: Animation stagger is capped at 8 items (`MAX_STAGGER_CARDS = 8`) to preserve immediate interaction responsiveness.
6. **Reduced Motion**: Full support for `@media (prefers-reduced-motion: reduce)` which zeroes animation durations and disables transforms while maintaining accessible state transitions.

---

## 6. Resilience & Fault Tolerance

- **Dual ErrorBoundary Protection**:
  - Application Root: Encloses the entire application tree to catch unhandled rendering exceptions.
  - VIP View Level: Wraps the lazy-loaded `VipPremierView` suspense container to handle chunk loading or network failures gracefully with a retry prompt.
- **Missing Images**: Handled gracefully by `DishImage.tsx` with a dark skeleton placeholder and subtle typography fallback.
- **Search Robustness**: Search input pairs `useDebouncedValue` (`SEARCH_DEBOUNCE_DELAY_MS = 200`) with React 19's `useDeferredValue`, ensuring rapid typing remains fluid at 60fps.

---

## 7. VIP Portfolio Architecture & Navigation

The developer dossier is accessible via a top navbar "VIP" button and guarded by a 6-digit campus PIN (`600089`).

### 7.1 Single Source of Truth (`portfolio/portfolio.json`)
`portfolio/portfolio.json` defines the `stats` array and the 9-course sequence:
1. `meet-the-chef`: Split layout with yellow monogram block ("P") and academic goal chip.
2. `education`: Vertical timeline with animated drawing line (`scaleY`) and node dots.
3. `ingredients`: Grouped skill chips (Languages, Frameworks, Working Skills) with level tags.
4. `ai-kitchen`: 5-step engineering methodology with connecting line and training badge.
5. `signature-dishes`: Bento grid of projects with large index numbers and disabled TODO buttons.
6. `awards`: Trophy SVG cards with yellow left accent borders.
7. `the-recipe`: Code-editor window showing syntax-colored project structure and 3-step guide.
8. `next-course`: Roadmap path with three connected stops drawn with a dotted line.
9. `reservations`: Ticket-style stubs with dashed tear lines and copy-to-clipboard interactions.

### 7.2 Generating Plain Text Markdown (`npm run portfolio:md`)
Synchronize `portfolio/PORTFOLIO.md` whenever `portfolio/portfolio.json` is updated via:
```bash
npm run portfolio:md
```

### 7.3 VIP Gating & Code-Splitting
- **Trigger**: Click the "VIP" button on the right side of the top navbar (adjacent to the cart button).
- **The Clue**: Found in the footer: `"Crafted at SRM IST, Ramapuram, Chennai – ______"`. The postal code for SRM IST Ramapuram is `600089`.
- **Verification**: The entered PIN is hashed with SHA-256 (Web Crypto) and compared to the stored digest in `src/config/access.ts`. The raw PIN is not stored in code.
- **Sessionless Security**: The VIP unlock state lives strictly in React memory (`useState`). It defaults to `false` and resets to `false` whenever the modal or the VIP page is closed. The unlock flag itself is never persisted. Only the failed-attempt / lockout counters live in `sessionStorage` (3 wrong tries = 30s lockout, doubling on repeats).
- **Lazy Loading**: `VipPremierView` is code-split via dynamic `React.lazy()` and only imported after verification succeeds.
- **Keyboard & Focus**: Accessible focus trap inside the modal; Escape key safely returns focus to the triggering navbar button.

---

## 8. Build, Lint, and Run Commands

```bash
# Run local development server (Vite on port 3000)
npm run dev

# Run ESLint & TypeScript type-checker
npm run lint

# Format codebase with Prettier
npm run format

# Production compilation (outputs optimized static bundle in dist/)
npm run build

# Regenerate portfolio markdown dossier
npm run portfolio:md
```
