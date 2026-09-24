# ESTADO — Web de Accelerate.ai

## Dónde estamos

2026-09-23. Proyecto de Astro creado (plantilla mínima, Astro 7, TypeScript estricto) y
commits en `main`. La base está terminada: las 7 secciones con un borrador de textos que falta
revisar (`REVISION-TEXTOS.md`), vistas en 360 y 1280 px con `npm run capturas`. Pasó la
revisión de UX y accesibilidad y tiene las etiquetas Open Graph con su imagen, con un dominio
provisorio. Sin repo en GitHub.

**Rediseño dinámico terminado** en la rama `rediseno-dinamico` (ver la sección de abajo),
sin merge a `main` todavía: espera la confirmación del usuario. El usuario vio la base "súper
plana" y pidió una página como https://minificando.ai/: linda, profesional, con mucho
movimiento y visuales reales del producto (panel, línea de tiempo).

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
7. ~~Revisión de UX y accesibilidad~~ con `web-design-guidelines`. Se corrigió:
   - Con la letra del celular al 150 %, el botón de WhatsApp y el chip de la card quedaban
     recortados (el `overflow: hidden` del glow tapa el scroll horizontal, así que no se
     notaba). Ahora bajan de línea, y `npm run capturas` lo chequea en cada corrida.
   - Portada y cierre quedaban fuera de `<main>`: ahora todo va adentro y el pie es un
     componente aparte (`Pie.astro`), fuera de `<main>`.
   - Favicon de Astro reemplazado por el isotipo (`favicon.png`) y el avatar
     (`apple-touch-icon.png`); `theme-color` con el fondo de la portada.
   - `text-wrap: balance` en `.t-label`, espacios que no se cortan en "45 minutos" y
     "3 semanas", estado `:active` del botón en vez del resaltado gris de Android.
   - Las capturas completas no cargaban las imágenes lazy (el logo del pie no salía).
   Descartadas de la guía: Title Case, evitar la primera persona y `translate="no"`, porque
   chocan con la marca o con el público.
8. ~~Open Graph~~ (SPECS §9). Etiquetas `og:*` y `twitter:card` en `Base.astro`, armadas
   con el `site` de `astro.config.mjs`. La imagen, `public/og.jpg` (1200 × 630, 50 KB), sale
   de `src/pages/[plantilla].astro`: `npm run og` la compila aparte y la fotografía con
   Playwright; en el build del sitio esa plantilla no existe. Repite la portada, con el texto
   en una columna central de 600 px por si WhatsApp recorta la vista previa a un cuadrado.
   `npm run capturas` chequea que las etiquetas estén y que la imagen esté publicada.

## Rediseño dinámico (terminado, rama `rediseno-dinamico`)

Referencia: minificando.ai (Astro, modo claro, panel del producto en la portada, cinta de
logos, línea de tiempo de "tu día", calendario, reseñas, video). De ahí se toma la estructura y
la riqueza visual; los colores, la tipografía y los efectos siguen siendo los de la marca.

Todo el movimiento es CSS, sin JavaScript: `animation-timeline: view()` y `view-timeline`
con nombre, `:has()`, `@supports` y `prefers-reduced-motion` en todo lo que se mueve. El estado
de base es el final, así en Firefox y con movimiento reducido la página se ve completa y quieta.

**Hecho:**
1. `Portada`: fondo claro, texto a la izquierda y el producto a la derecha (panel "Pedidos de
   hoy", chat montado encima, chip sobre el borde). La historia corre al cargar en escritorio y
   con el scroll en el celular.
2. `Rubros`: cinta de rubros con botón de pausa (checkbox, sin JS). Con movimiento reducido
   queda quieta y centrada.
3. `QueResolvemos`: interruptor "Hoy / Con un sistema" (radios + `:has()`). "Hoy" se ve
   desordenado (filas corridas, divisiones punteadas); "Con un sistema" pasa a la card oscura,
   con un fundido con blur y en cascada.
4. `SistemasAMedida` (`#sistemas`), fondo oscuro: bento de 4 cards (7/5/5/7 en escritorio,
   2 columnas en tablet, 1 en el celular), cada una con su mock en `src/components/mocks/`
   (pedidos, turnos con recordatorio, ticket de caja, gráfico de barras) que se arma con el
   scroll.
5. `ComoTrabajamos` (`#proceso`): línea de tiempo alternada en escritorio. La línea se llena
   con el scroll y cada marca se enciende cuando la punta la alcanza. Un visual por paso; la
   propuesta es la única card invertida de la sección.
6. `QuienesSomos`: los nombres (hoy Ignacio y Gabriel) a escala gigante, los nombres entran desde lados opuestos.
7. `PreguntasFrecuentes` (`#preguntas`): título fijo en escritorio y apertura suave con
   `::details-content` + `interpolate-size`.
8. `Cierre`: el mensaje real del botón (sale de `config.ts`) como burbuja, "escribiendo…" y la
   respuesta con el scroll. Imagotipo claro grande en el pie.
9. `capturas.mjs`: primera pantalla con movimiento; página completa con
   `reducedMotion: 'reduce'`; chequea que las animaciones de scroll tengan timeline, el
   interruptor, los links del encabezado, gradiente ≤ 2, eyebrows ≤ 1 cada 3 secciones y
   que no haya rayas largas.
10. Pasada de skills y pulido final: selección y barra de scroll con la marca, puntos de
    "escribiendo" atados al scroll (sin loop infinito), interruptor a 300 ms, link para saltar
    al contenido, `touch-action` y `scroll-padding-top` para que el encabezado no tape el foco.
    `review-animations` no la puede correr Claude: la corre el usuario con `/review-animations`.

**Dos errores que dejaban las animaciones de scroll muertas en el build (ya corregidos):**
- Lightning CSS, el minificador de Vite, junta `animation-timeline` dentro del atajo
  `animation` (`animation: linear both nombre view()`), y Chrome descarta esa declaración
  entera. Se minifica con esbuild (`astro.config.mjs`). En el dev server no se ve: solo en el
  build.
- `overflow: hidden` en `.con-glow` volvía a cada sección un contenedor de scroll, y los
  `view()` de adentro quedaban sin timeline. Ahora es `overflow: clip`.

**Reglas de la marca que se cuidaron:** `#2971f2` solo en el botón principal; en el fondo
claro, una sola card invertida por sección; un glow sobre claro y dos sobre oscuro; sin vidrio
ni blur fuera de los glows; texto sin alpha; los mocks usan datos de ejemplo, sin métricas;
en la cinta, rubros y no clientes; sin em-dash; sin rebote ni escala al tocar.

## Segunda tanda del rediseño (2026-09-24, misma rama)

Pedidos del usuario después de ver la primera versión, todos hechos y con `npm run capturas`
en verde:

1. **Portada sin superposición:** el chat arriba, una línea punteada con un pedido que baja y
   el panel "Pedidos de hoy" abajo; el chip "Cargado sin que nadie lo tipee" sobre el borde.
2. **Rubros como cinta transportadora:** dos filas en sentidos opuestos (19 rubros), que además
   se corren con el scroll. Pausa con checkbox y con el mouse encima.
3. **Interruptor:** sin las filas torcidas (se veía roto); íconos en círculos, tachado que se
   dibuja, sello y un anillo que invita a tocarlo.
4. **Mocks nuevos:** pedidos (chat → planilla que se escribe sola), turnos (el aviso de Sofía
   debajo de la agenda, sobre el borde), panel con KPI que cuentan en CSS y gráfico de línea.
5. **Quiénes somos:** Ignacio y Gabriel, con el nombre que se llena con el scroll.
6. **Logo:** imagotipo azul en el encabezado (150-176 px) y en el pie (200-232 px).
7. **Botones de WhatsApp:** sin las capas de velocidad (al usuario no le gustaron); con el
   mouse se agrandan (`scale(1.05)`). Uno por sección, cada uno con su texto y su mensaje
   (`whatsappUrl(mensaje)` en `config.ts`), como minificando. "Escribinos por WhatsApp" queda
   solo en el encabezado, la portada y el cierre.
8. **Cierre:** la charla completa (mensaje, respuesta, día elegido, confirmación) y el aviso
   "Auditoría agendada" sobre el borde; tres datos en píldoras. Avatar: `avatar-claro.png`
   movido -6 % dentro del círculo (la A cursiva centrada por su caja se ve corrida).
9. **Pie nuevo:** marca + secciones + contacto, estela de velocidad con los colores de la A que
   cruza con el scroll, "Volver arriba". Secciones con id nuevo: `#resolvemos` y `#somos`.

**Ojo al revisar:** en la PC del usuario Windows tiene apagados los efectos de animación
(Configuración > Accesibilidad > Efectos visuales > Efectos de animación), y Chrome lo informa
como `prefers-reduced-motion: reduce`: la página se ve quieta, completa y sin movimiento. Para
ver el movimiento hay que prender esa opción.

## Próximo paso

0. El usuario revisa en http://localhost:4400/ (`npx astro build` y
   `npx astro preview --port 4400`) con los efectos de animación de Windows prendidos, corre
   `/review-animations` si quiere, y confirma el merge de `rediseno-dinamico` a `main`.
1. Los textos corregidos por Colo y los links de las redes (`REVISION-TEXTOS.md`). Si
   cambia el titular de la portada, correr `npm run og` para rehacer la imagen.
2. Hosting y dominio (pendientes 2 a 4), recién para publicar. Al tener el dominio, cambiar
   `SITIO` en `astro.config.mjs` y probar la vista previa mandando el link por WhatsApp antes
   de compartirlo con nadie: WhatsApp guarda la primera vista previa de cada link.

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
| Imagen OG compuesta en código (plantilla Astro + Playwright), no en Canva | Usa la fuente, los tokens, el glow y el logo reales, y se regenera con un comando si cambia el texto |
| Imagen OG en JPEG, no PNG | Pesa 50 KB; WhatsApp a veces no muestra imágenes de más de 300 KB |
| Rediseño: portada en fondo claro con el producto a la derecha, como minificando | Pedido del usuario. La marca pide fondo oscuro para el hook, pero en piezas de redes; en la web manda el pedido. El cierre sigue oscuro |
| Rediseño: movimiento solo con CSS (intensidad 7), sin JavaScript | Todo sale con animaciones de CSS y `animation-timeline`; en Firefox la página se ve completa y quieta |
| Imagotipo en el encabezado (150-176 px) y en el pie (200-232 px) | Pedido del usuario (logo "menos básico"). Los 280 px de mínimo de la marca son sobre el lienzo de 1080 de redes, que en el celular se ve a un tercio; a este tamaño las capas se leen. El zip de la agencia trae los mismos PNG que ya están en el repo, sin SVG |
| Dominio provisorio `accelerate-ai.example` | Open Graph pide URL completas. `.example` es un dominio reservado que no existe, y el build avisa mientras siga ahí |
| Minificar el CSS con esbuild y no con Lightning CSS | Lightning CSS rompe `animation-timeline` al juntarlo en el atajo `animation` |
| Sin modo oscuro | La marca tiene dos fondos fijos (claro y oscuro por sección); Taste lo pide, manda la marca |
| Botones que se agrandan con el mouse (`scale(1.05)`), solo con puntero fino | Pedido del usuario (2026-09-24), aunque la marca no usa escala. Al tocar sigue siendo de color |
| Varios botones de WhatsApp, cada uno con su mensaje | Pedido del usuario, como minificando. Taste pide no repetir el CTA; manda el pedido. Cada mensaje dice de qué sección vino |
| El panel de "Sistemas a medida" muestra cifras, con la nota "Datos de ejemplo" | Pedido del usuario (más profesional y llamativo). Las cifras suman bien entre sí |
| Los puntos de "escribiendo" y la portada del celular avanzan con el scroll, no en loop | Nada queda girando fuera de la pantalla y el que lee maneja el ritmo |

## Skills

Instaladas globales: `design-taste-frontend` e `image-to-code` (de `leonxlnx/taste-skill`),
`playwright-cli` (de `microsoft/playwright-cli`) y `web-design-guidelines` (de
`vercel-labs/agent-skills`). `frontend-design` ya estaba. Cómo se usa cada una: `CLAUDE.md`.
Sumadas el 2026-09-23 para el rediseño: `emil-design-eng`, `find-animation-opportunities` y
`review-animations` (de `emilkowalski/skills`) e `impeccable` (de `pbakaus/impeccable`).
`image-to-code` pide generar imágenes antes de codear; acá no aplica (la marca no usa fotos ni
ilustraciones): se usaron capturas de minificando como referencia.

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
| 3 | Dominio. Hoy está el provisorio `accelerate-ai.example` en `astro.config.mjs` | La URL propia y la vista previa de WhatsApp |
| 4 | Repo público o privado | Si es privado, GitHub Pages pide plan pago |
| 5 | Los SVG del logo, si existen | Nada; los PNG alcanzan para la web |
| 6 | Revisión de textos por Colo: las dudas están en `REVISION-TEXTOS.md` | El cierre |
| 7 | En escritorio, el glow cian de "Sistemas a medida" se corta en línea recta donde empieza la sección (ya estaba así antes de la revisión) | Nada; es un detalle visual |
