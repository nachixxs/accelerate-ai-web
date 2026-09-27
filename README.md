# accelerate-ai-web

The one-page marketing site of Accelerate.ai, a small agency (co-founded by the author) that
builds custom software for small and medium businesses. The site copy is in Spanish, since the
target market is Argentina.

![Open Graph preview of the site](public/og.jpg)

## Overview

- A single landing page in eight sections: hero, industries, the problems a custom system
  solves (with a "today" vs. "with a system" toggle), examples of custom systems, how the
  agency works, about, FAQ and a closing call to action.
- The only goal of the page is to start a conversation: every call to action opens WhatsApp
  with a prefilled message, and buttons inside a section can tailor that message to it (each
  example system asks about that kind of system).
- The example systems are shown as animated UI mockups (a daily cash closing ticket, a work
  order board, a stock list and a business dashboard), all with sample data that is labeled
  as such.
- Designed mobile-first for a 360 px screen, with 44 px minimum touch targets.

## Tech stack

- **Astro 7**, output as static HTML
- **Hand-written CSS** built on the brand's design tokens (`src/styles/tokens/`); no UI
  framework, no Tailwind, no React
- **Small bundled TypeScript scripts** for progressive enhancement (for example, count-up
  numbers in `src/scripts/contar.ts`)
- **Phosphor icons** (plus the WhatsApp logo from Simple Icons) through Iconify, inlined as
  SVG at build time by `src/components/Icono.astro`
- **Archivo** font, downloaded at build time and self-hosted through Astro's font API
- **Playwright** (dev dependency) for the Open Graph image and the visual checks

## How it works

- **Motion without a JavaScript dependency**: section reveals and mockup animations use CSS
  scroll-driven animations (`animation-timeline: view()`). The base state of every element is
  its final state, so without JavaScript, without scroll-timeline support or with
  `prefers-reduced-motion: reduce`, the page renders complete and still.
- **CSS minification with esbuild**: Astro's default minifier folded `animation-timeline` into
  the `animation` shorthand, which made Chrome drop the declaration and every scroll-driven
  animation with it (see the comment in `astro.config.mjs`).
- **Open Graph image**: `src/pages/[plantilla].astro` is a 1200 x 630 template that only
  exists when `npm run og` builds it; the script screenshots it with Playwright into
  `public/og.jpg` and fails if the file is over 300 KB, since WhatsApp may skip larger
  previews.
- **Visual checks**: `npm run capturas` builds the site and takes screenshots at 360, 768 and
  1280 px, with and without reduced motion, then runs automated checks on each width: no
  horizontal scroll, the hero button visible without scrolling, touch targets of at least
  44 px, internal links that resolve, scroll-driven animations that actually got a timeline,
  the mobile menu and the toggle working, elements that don't overflow their cards (also with
  text at 150 %), and the Open Graph tags and image.

## Getting started

Requirements: Node.js 22.12 or later.

```bash
npm ci
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run preview    # serve the build locally
```

The Open Graph and screenshot scripts use Playwright's Chromium, installed once with
`npx playwright install chromium`:

```bash
npm run og         # regenerate public/og.jpg
npm run capturas   # build, screenshots in capturas/ and checks (exits with an error if any fail)
```

No environment variables are needed.

## Project structure

```
src/pages/          index.astro (the page) and the Open Graph template
src/components/     header, footer, WhatsApp button, icons and glow effect
  secciones/        the page sections
  mocks/            the animated UI mockups
src/styles/         global styles and brand tokens
src/scripts/        client-side helpers
src/config.ts       WhatsApp link and contact details
scripts/            og.mjs and capturas.mjs (Playwright)
```

## Project status

Built and iterating on design and copy. Not deployed yet: the site URL in `astro.config.mjs`
is a placeholder, and the build prints a warning until it is replaced with the real domain.
