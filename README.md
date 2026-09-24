# 🔥 EMBER & CRUST (Ember Crests)

> **Submission for the CodeKrafters Recruitment Process — Round 1 (Web Development).**
> Task chosen: **Food Ordering Interface** (frontend-only) · First-year participant · Black & yellow CodeKrafters theme

A wood-fired pizza + smash burger ordering app built with **React 19, TypeScript, Vite and Tailwind CSS 4**. No backend, no paid APIs. Everything runs in the browser and is structured so a real backend can be plugged in later.

---

## 👋 hey, quick note from me

hey CodeKrafters team, this is my round 1 submission 🙌

so i'm a first year AI/ML student at SRM RMP and i didn't want to just build "another food app". i wanted to show 3 things:

- **unique thinking** → there's a secret VIP section hidden inside the app (more on that below 👀)
- **using AI properly** → i used AI to build faster, but i planned the folder structure, fixed the bugs and cleaned the code myself, so it's not just copy paste
- **clean base code** → small files, one job per file, typed with TypeScript, so anyone can open the repo and understand it in 5 mins

tbh i'm still learning and my goal is to code without depending on AI in the future, so i kept the code simple and commented where it matters. hope you like it 🔥

---

## ✨ Features

- 🍕 **Menu** with 27 dishes across Pizza, Burgers, Sides, Drinks and Desserts, category filter, veg / non-veg and spice info
- 🔍 **Fast search** modal with quick tags and keyboard navigation (debounced so it doesn't lag)
- 🛒 **Cart drawer** with quantity controls, sauces add-ons, GST and totals, saved between reloads
- 💳 **Realistic checkout (mock)**: Review → Delivery → Payment (card / UPI / wallet / COD) → Confirmation, with live validation and Luhn card check
- 📦 **Live order tracking**: Order Placed → Preparing → Out for Delivery → Delivered, with a countdown
- 👥 **Split bill / group order mode**: add friends, assign items, see who owes what
- 👤 **Login / sign up (mock)** with your profile at the top-right and an order history
- ⏱️ **Auto logout** after 20 minutes of inactivity (with a warning 1 minute before)
- 🎬 **Smooth animations** using only `transform` + `opacity`, and they respect `prefers-reduced-motion`
- 🔒 **Hidden VIP portfolio** (see below)

---

## 🔒 The hidden VIP portfolio

Inside the app there's a private **VIP Table** button in the navbar. It opens a 6-digit PIN gate.

- The PIN is a **postal code**. The footer tells you where this was crafted, so go find it 😄
- stuck? open **DevTools → Console**, there's a clue trail there
- wrong PIN 3 times = 30s lockout (doubles if you keep failing)
- the PIN is stored only as a **SHA-256 hash**, and the portfolio code is **lazy loaded**, so it only downloads after you unlock it
- unlock state is never saved, closing the portfolio locks it again

Inside: a minimal hero, my journey, toolkit grid, project index, an animated SaaS-style spotlight and a **Creative Lab** playground (canvas waves, kinetic type, 3D tilt card, micro synth).

The same portfolio data lives in `portfolio/portfolio.json`. Run `npm run portfolio:md` to regenerate `portfolio/PORTFOLIO.md`.

---

## 🚀 Run it locally

You need **Node.js 20.19+** (or 22.12+).

```bash
git clone <this-repo-url>
cd <repo-folder>
npm install
npm run dev        # http://localhost:3000
```

Other commands:

```bash
npm run build      # type-check + production build (dist/)
npm run preview    # preview the production build
npm run lint       # eslint + tsc
npm run format     # prettier
```

No `.env` needed, the app doesn't use any API keys.

---

## 🛠 Tech stack

| Area | Choice |
| --- | --- |
| Framework | React 19 + Vite 8 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| Icons | lucide-react |
| Quality | ESLint (typescript-eslint, react-hooks) + Prettier |

Design tokens: background `#0A0A0A`, surface `#141414`, border `#262626`, accent yellow `#FFD60A`. Fonts: Bebas Neue, Sora, Inter, JetBrains Mono.

---

## 📁 Project structure

```text
src/
├── components/     # UI pieces (Navbar, FoodGrid, CartDrawer, modals...)
├── features/
│   ├── checkout/   # stepper, payment, validation, mock API, order tracking
│   ├── split/      # split-bill context, utils and UI
│   └── portfolio/  # hidden VIP portfolio + Creative Lab (lazy loaded)
├── context/        # Cart + Auth state
├── config/         # VIP gate config (hashed PIN)
├── data/           # menu + sauces (single source of truth)
├── hooks/          # useInView, useCountUp, useDebouncedValue...
├── utils/          # constants, currency, image paths, security helpers
└── styles/         # animation keyframes
docs/ARCHITECTURE.md   # deeper explanation of decisions
portfolio/             # portfolio data (json → md)
public/                # dish images (.webp) + standalone portfolio.html
```

More detail in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## ⚠️ Honest limitations

- it's **frontend-only**: payments, login and order tracking are all simulated (`src/features/checkout/api/mockCheckoutApi.ts`, `AuthContext`). No real money or real accounts.
- data (cart, orders, split state) is saved in `localStorage`
- the mock API has clear swap points (`[SWAP-POINT]`) where a real backend can be connected
- a few dishes reuse the same photo for now

---

Made with 🔥 by **PADAVALA** · CSE-AIML, SRM RMP · for the **CodeKrafters Recruitment Process**
