# 0001. Scroll animations in CSS, with the final state as the base

Status: accepted. The code described here is in `src/styles/global.css`, `astro.config.mjs` and
`scripts/capturas.mjs`.

## Context

The page reveals sections and animates its mockups as they enter the screen. Most visitors open
it on a phone from a WhatsApp link, and some have reduced motion turned on at the operating
system (the Windows animation effects switched off is enough for Chrome to report
`prefers-reduced-motion: reduce`). If an animation fails to start, the visitor must still see
the whole page.

## Decision

1. Every element is written in its final visual state. Animation only adds a way to get there.
2. Reveals use CSS scroll-driven animations: `animation-timeline: view()` with an
   `animation-range`, inside `@supports (animation-timeline: view())`. Where the browser does
   not support the property, the rule does not apply and the content is already visible.
3. Under `prefers-reduced-motion: reduce`, the same classes (`.revelar`, `.fundir`) become short
   opacity fades. Nothing moves across the screen.
4. JavaScript is used only for what CSS cannot do: dragging, the calculator and its odometer,
   counters, and the phone scene in `#trabajo`. The `Hoy / Con un sistema` toggle in `#resolvemos`
   works with radio inputs and `:has()`; the script adds the drag.
5. Three things run with reduced motion on, on purpose: the industries ticker (it pauses on
   hover, focus and touch), the rail, dot and marks of the process timeline (driven by the scroll
   position, so nothing moves by itself), and anything the visitor triggers (hover, drag, clicks).
   Comments in `Rubros.astro` and `ComoTrabajamos.astro` record the first two as exceptions
   requested by the site owner.
6. CSS is minified with esbuild (`vite.build.cssMinify: 'esbuild'`), not with Astro's default
   Lightning CSS. Lightning CSS merged `animation-timeline` into the `animation` shorthand and
   Chrome dropped the whole declaration, so every scroll animation stopped (comment in
   `astro.config.mjs`).

## Alternatives not taken

These come from the project's constraints; the repo does not record that they were evaluated.

- **Hidden by default, revealed by `IntersectionObserver` adding a class.** Without JavaScript,
  or if the script fails, the content stays invisible. It also needs a script on every page.
- **An animation library.** It adds a runtime dependency. `package.json` has one runtime
  dependency, `astro`, and the stack rules out UI libraries.
- **No animation.** The cheapest option, and the page would lose the sense that the mockups are
  working systems, which is what the site has to show.

## Consequences

- Browsers without scroll-driven animations show a still page. That is the intended fallback,
  but it means the motion design cannot be seen everywhere. The cross-browser check compares
  WebKit and Firefox opacity values against Chromium in the same width and motion setting, not
  against a fixed value, because some panels end at opacity 0 on purpose
  (`scripts/capturas-navegadores.mjs`).
- A broken timeline fails silently, so the suite looks for it. `scripts/capturas.mjs` lists every
  running animation that asks for a scroll timeline and does not have one. Two causes are
  documented: the minifier merge above, and `overflow: hidden` on an ancestor, which leaves the
  `view()` timelines inside it without a scroll container. The code uses `overflow: clip`
  instead (for example in the `.con-glow` sections).
- Overriding the CSS minifier is one more setting to keep. If Astro changes its default or
  Lightning CSS fixes the merge, the override can go, and the same check will say whether
  animations survived.
- Each component keeps its own animations next to its markup, so the motion rules are spread
  over the component files instead of one file.
