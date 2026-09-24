# ESTADO — Web de Accelerate.ai

## Dónde estamos

2026-09-23. Proyecto de Astro creado (plantilla mínima, Astro 7, TypeScript estricto) y
primer commit en `main`. `npm run build` compila. La página es todavía la de ejemplo de la
plantilla. Sin repo en GitHub.

## Próximo paso: la base

1. ~~Nombre de la carpeta y del repo~~: `accelerate-ai-web`.
2. ~~`npm create astro@latest`, `git init`, primer commit~~. Se generó en una carpeta
   temporal y se copió, sin el `CLAUDE.md`/`AGENTS.md`/`README.md` genéricos de la plantilla.
3. Pasar al proyecto los tokens (`tokens/*.css`) y los logos (`assets/identidad/`) del design
   system, que está en `.claude/skills/accelerate-ai-design/`.
4. Escala tipográfica responsive para web, derivada de la del design system.
5. Esqueleto con las 7 secciones de `SPECS.md` §4 como componentes `.astro` y el botón de
   WhatsApp funcionando.
6. Playwright como dependencia de desarrollo, para capturas en 360 px y en escritorio.

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
| 6 | Revisión de textos por Colo | El cierre |
