# accelerate-ai-web

The one-page marketing site of Accelerate.ai, a small agency that builds custom software for
small and medium businesses. The site copy is in Spanish (Argentine), since that is the target
market.

![Open Graph preview of the site](public/og.jpg)

## What it is

A single landing page whose only goal is to start a conversation: every call to action opens
WhatsApp with a prefilled message, and buttons inside a section can tailor that message to it.
Designed mobile-first for a 360 px screen, with 44 px minimum touch targets and WCAG AA contrast.

The page, in order (`src/pages/index.astro`, one component per section in
`src/components/secciones/`):

1. **Hero** (`#inicio`): headline and call to action next to an animated business dashboard.
2. **Industries**: a slow ticker of the kinds of business it is for.
3. **What we solve** (`#resolvemos`): common pain points, with a "today" vs. "with a system" toggle.
4. **Custom systems** (`#sistemas`): animated UI mockups (daily cash closing, work order board,
   stock list), all with sample data labeled as such.
5. **A first project** (`#trabajo`): a demo of a system already in production, shown as a phone scene and a simulated month, with test data labeled as such.
6. **How we work** (`#proceso`): the process, as a timeline.
7. **Your time** (`#tiempo`): a small calculator of the hours lost to repetitive tasks.
8. **FAQ** (`#preguntas`).
9. **Closing call to action**, then the footer.

Plus one separate page, `/legal` (privacy and terms), and `404.astro`.

## Tech stack

- **Astro 7**, static HTML output.
- **Hand-written CSS** on the brand's design tokens (`src/styles/tokens/`). No UI framework,
  no Tailwind, no React.
- **Small bundled TypeScript scripts** for progressive enhancement (`src/scripts/`). The page is
  complete without JavaScript.
- **Phosphor icons** (and the WhatsApp logo from Simple Icons) through Iconify, inlined as SVG
  at build time by `src/components/Icono.astro`.
- **Archivo**, downloaded at build time and self-hosted through Astro's font API.
- **Playwright** and **axe-core** (dev dependencies) for the visual and accessibility checks and
  for the Open Graph image.

## How it works

- **Motion with a safe base state**: section reveals and mockup animations use CSS
  scroll-driven animations (`animation-timeline: view()`). The base state of every element is
  its final state, so without JavaScript, without scroll-timeline support or with
  `prefers-reduced-motion: reduce`, the page renders complete and still.
- **CSS minified with esbuild**: Astro's default minifier folded `animation-timeline` into the
  `animation` shorthand, which made Chrome drop the declaration and every scroll-driven
  animation with it (see the comment in `astro.config.mjs`).
- **Site URL**: `astro.config.mjs` holds the public URL (`SITIO`). The canonical link, the Open
  Graph URLs, `robots.txt` (`src/pages/robots.txt.ts`) and `sitemap.xml`
  (`src/pages/sitemap.xml.ts`) are all built from it. While it is a placeholder, the build prints
  a warning.
- **Open Graph image**: `src/pages/[plantilla].astro` is a 1200 x 630 template that only exists
  when `npm run og` builds it. The script screenshots it with Playwright into `public/og.jpg`
  and fails if the file is over 300 KB, since WhatsApp may skip larger previews.
- **Icons**: `npm run iconos` renders `public/favicon.png` and `public/apple-touch-icon.png`
  from `public/favicon.svg`.

## Getting started

Requirements: Node.js 22.12 or later (`engines` in `package.json`). No environment variables.

```bash
npm ci
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server at `http://localhost:4321` (the next free port if it is taken). |
| `npm run build` | Static site into `dist/`. |
| `npm run preview` | Serves the build locally. |
| `npm run capturas` | Builds, then runs Playwright at 360, 768 and 1280 px, with and without reduced motion: screenshots in `capturas/` and automated checks (no horizontal scroll, touch targets, internal links, scroll animations, axe accessibility, 200 % text, forced colors, Chromium, Firefox and WebKit, `/legal`, Open Graph tags and image). Exits with an error if any check fails. |
| `npm run check` | `astro check`: types for the scripts and component props. |
| `npm run og` | Regenerates `public/og.jpg` from the template. Run it when the headline or the logo changes. |
| `npm run iconos` | Regenerates the favicon PNGs from `public/favicon.svg`. |

`og`, `iconos` and `capturas` use Playwright's Chromium, installed once with
`npx playwright install chromium`.

## Project structure

```
src/pages/          index.astro, legal.astro, 404.astro, the Open Graph template, robots.txt and sitemap.xml
src/components/     header, footer, logo, icons, WhatsApp button
  secciones/        the page sections
  mocks/ trabajo/ tiempo/   the animated mockups and interactive blocks
  legal/            the text of the privacy and terms page
src/layouts/        base layout (head, meta tags, Open Graph)
src/styles/         global styles and brand tokens
src/scripts/        client-side helpers
src/config.ts       WhatsApp link
public/             favicons, Open Graph image, _headers
scripts/            og, iconos and the Playwright checks (capturas*.mjs)
```

## Deployment

Static output in `dist/`, deployed on Cloudflare Pages (build command `npm run build`,
production branch `main`).

## License

[MIT](LICENSE)

The MIT license covers the source code only. The Accelerate.ai name and logo, the images in
`src/assets/` and `public/` (`og.jpg` and the favicons) and the texts of the site are not
covered: all rights reserved.
