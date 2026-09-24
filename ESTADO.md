# ESTADO — Web de Accelerate.ai

## Dónde estamos

2026-09-23. Proyecto de Astro creado (plantilla mínima, Astro 7, TypeScript estricto) y
commits en `main`. La base está terminada: las 7 secciones con un borrador de textos que falta
revisar (`REVISION-TEXTOS.md`), vistas en 360 y 1280 px con `npm run capturas`. Sin repo en
GitHub.

## La base (terminada)

1. ~~Nombre de la carpeta y del repo~~: `accelerate-ai-web`.
2. ~~`npm create astro@latest`, `git init`, primer commit~~. Se generó en una carpeta
   temporal y se copió, sin el `CLAUDE.md`/`AGENTS.md`/`README.md` genéricos de la plantilla.
3. ~~Tokens y logos del design system~~. En `src/styles/tokens/` (colores, efectos y base tal
   cual; de layout solo `--space-*`; de tipografía solo familia y pesos) y
   `src/assets/identidad/`. Archivo se carga con la API de fuentes de Astro
   (`astro.config.mjs`), servida desde el sitio, no con el `@import` a Google del sistema.
   `src/layouts/Base.astro` carga la fuente y `src/styles/global.css`.
4. ~~Escala tipográfica responsive~~. En `src/styles/tokens/typography.css`, con `clamp()` de
   360 a 1280 px: hook 40→72 (`h1`), titular 28→48 (`h2`), label 20→26 (`h3`), cuerpo 17→20
   (lh 1.5, 65ch), eyebrow 13→14, meta 14→15. Sin "gigante" hasta que haya cifras con fuente.
5. ~~Las 7 secciones y el botón de WhatsApp~~. Una sección por componente en
   `src/components/secciones/`; el link de WhatsApp en `src/config.ts`. Íconos con
   `@lucide/astro` (SVG en el HTML, sin CDN ni JS). Borrador de textos escrito por Claude; las
   dudas para Colo, en `REVISION-TEXTOS.md`. Build sin JavaScript, contraste WCAG AA calculado.
6. ~~Playwright y capturas~~. `npm run capturas` compila, levanta la vista previa y guarda en
   `capturas/` (fuera de git) la primera pantalla y la página completa en 360 y 1280 px.
   Además chequea: sin scroll horizontal, botón dentro del margen y visible sin scroll, áreas
   táctiles de 44 px. Las capturas mostraron 5 errores de maquetación en escritorio, ya
   corregidos.

## Próximo paso

1. Revisión de UX y accesibilidad con `web-design-guidelines` (la pide `CLAUDE.md` antes de
   dar algo por terminado).
2. Etiquetas Open Graph y su imagen, para la vista previa al compartir el link (SPECS §9).
3. Los textos corregidos por Colo y los links de las redes (`REVISION-TEXTOS.md`).
4. Hosting y dominio (pendientes 2 a 4), recién para publicar.

## Decisiones tomadas (2026-09-23)

| Decisión | Por qué |
|---|---|
| Web de la agencia antes que el portfolio personal | Pedido del usuario |
| Objetivo único: escribir por WhatsApp pidiendo la auditoría | Es como venden hoy; no necesita backend |
| Astro, no HTML suelto ni React | Componentes por sección y puerta abierta a un blog |
| Sistemas a medida en cualquier rubro, con la auditoría como entrada | Pedido del usuario. Se acompaña con 3-4 ejemplos concretos para que se crea |
| Sin casos de clientes todavía | Falta el permiso de los dueños |
| Precios en una etapa posterior | Pedido del usuario |
| Marca: el design system de Colo (`F:\Accelerate.ai Design System.zip`) | Ya está hecho; se adapta la tipografía para web |
| Archivo servida desde el sitio con la API de fuentes de Astro, no con el `@import` a Google | El `@import` frena el primer dibujado; así hay precarga y fallback con métricas ajustadas |
| Escala web por roles del sistema, con `clamp()` 360→1280 px; cuerpo con lh 1.5 | En 360 px el cuerpo de redes dividido por 3 quedaría en 11 px; la web tiene párrafos más largos |

## Skills

Instaladas globales: `design-taste-frontend` e `image-to-code` (de `leonxlnx/taste-skill`),
`playwright-cli` (de `microsoft/playwright-cli`) y `web-design-guidelines` (de
`vercel-labs/agent-skills`). `frontend-design` ya estaba. Cómo se usa cada una: `CLAUDE.md`.

**Descartadas:**

- **Awesome Design** (`bergside/awesome-design-skills`, 67 estilos): se leyeron las cinco
  más afines (levels, professional, spacious, sleek, clean). Son la misma plantilla genérica
  con otra tipografía y otra paleta, y las cinco traen violeta `#8B5CF6`, que la marca prohíbe.
- **ui-ux-pro-max**: su fuerte es elegir paleta y tipografía, que ya decidió la marca.
- **Skills de Astro y de "landing page"** de terceros: muchas descargas y casi sin estrellas.

## Pendientes

| # | Qué | Bloquea |
|---|---|---|
| 1 | ~~Nombre de la carpeta y del repo~~: `accelerate-ai-web` | — |
| 2 | Hosting (GitHub Pages o Cloudflare Pages) | La publicación |
| 3 | Dominio | La URL propia |
| 4 | Repo público o privado | Si es privado, GitHub Pages pide plan pago |
| 5 | Los SVG del logo, si existen | Nada; los PNG alcanzan para la web |
| 6 | Revisión de textos por Colo: las dudas están en `REVISION-TEXTOS.md` | El cierre |
