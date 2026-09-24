# VIP Table · Premier View

> Chef's Dossier & Technical Portfolio

### Key Highlights

- **50+** hrs of AI usage training
- **3** projects
- **5** core architectural projects

*Auto-generated from [portfolio.json](./portfolio.json). Do not edit directly; run `npm run portfolio:md` after updating the JSON source.*

---

## 01. Meet the Chef

PADAVALA. First-year B.Tech AI/ML at SRM. I plan, prompt and organize projects so the code stays clean and easy for others to understand. Goal: dual degree (B.Tech + M.Tech) in AI/ML + Bioinformatics.

---

## 02. Education

First-year B.Tech in AI/ML at SRM.

---

## 03. Ingredients

Languages: Python (basics), C (learning), JavaScript, HTML, CSS.
Frameworks: React, Tailwind CSS.
Working skills: debugging (beginner-to-intermediate error finder), AI prompting, project planning, code organization.

---

## 04. AI Kitchen

50+ hours of classes on AI usage with Vaibhav Sisinty. Experience building several projects with AI assistance. My method: plan, prompt, review, refactor, document.

---

## 05. Signature Dishes

NOVA (Chrome new-tab dashboard with a glassmorphism UI)
Snake Game (browser game with a modular architecture)
Focus Timer App (productivity timer with ambient visuals and multiple timer techniques)
Links: TODO: add GitHub/live link

---

## 06. Awards

Completed 50+ hours of AI usage training.
TODO: add achievement

---

## 07. The Recipe

How this app is built:

```text
src/
├── components/       # Single-responsibility UI modules
├── config/           # Access gates & app configuration
├── context/          # State management via CartContext & reducer
├── data/             # Single source of truth menu data
├── features/vip/     # Lazy-loaded VIP Premier View
├── hooks/            # Custom hooks (useCountUp, useInView, etc.)
├── styles/           # CSS animations & design tokens
└── utils/            # Shared constants, helpers & formatters
```

Design decisions:
1. Cart state machine: Context + useReducer with validated localStorage synchronization and integer rounding.
2. Strict separation: Data structures are decoupled from UI presentation.
3. Zero-runtime animation budget: Only composited transform and opacity properties; no third-party animation libraries.
4. CodeKrafters design tokens: Dark canvas (#0A0A0A) paired with warm golden amber (#FFD60A).
5. Lazy loading: VIP section is split into a separate bundle with React.lazy + Suspense.
6. Accessibility: Keyboard traps, ARIA labels, and full prefers-reduced-motion support.

Add a new menu item in 3 steps:
1. Open src/data/menu.ts
2. Add a new entry to MENU_ITEMS with unique id, slug, price, and category
3. Place the corresponding WebP image in public/images/menu/

Callout: This structure is my reusable starter for future websites, apps and prototypes.

---

## 08. Next Course

Building core coding knowledge without relying on AI: deepening C and Python fundamentals and practicing debugging by hand.

---

## 09. Reservations

Email: TODO: add email
GitHub: TODO: add GitHub profile
LinkedIn: TODO: add LinkedIn profile

---
