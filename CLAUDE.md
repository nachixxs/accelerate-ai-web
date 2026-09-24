# CLAUDE.md — Web de Accelerate.ai

Landing de una sola página de la agencia. El alcance está en `SPECS.md`; el estado, las
decisiones tomadas y el próximo paso, en `ESTADO.md`. Leer los dos antes de tocar código.

## Stack

Astro, HTML estático, CSS propio con los tokens del design system. **Sin React, sin
Tailwind, sin librerías de UI y sin JavaScript en el navegador** salvo que `SPECS.md` cambie.

## Skills, en orden de prioridad

1. **`accelerate-ai-design`** (en `.claude/skills/`): la marca. **Manda sobre cualquier otra
   skill.** Si otra skill propone otra tipografía, otro color, vidrio, blur o violeta, gana
   esta. Su escala tipográfica es para piezas de redes de 1080 px: en la web se usa una
   escala propia, responsive, derivada de esa.
2. **`design-taste-frontend`** y **`frontend-design`**: calidad visual. La de Taste viene
   pensada para React/Next, Tailwind y mucha animación: al usarla, declarar que el sistema de
   diseño es `accelerate-ai-design`, el stack es Astro sin React y `MOTION_INTENSITY` es 2.
3. **`web-design-guidelines`**: revisión de UX y accesibilidad antes de dar algo por terminado.
4. **`playwright-cli`**: capturas y pruebas en el navegador. Playwright va como dependencia de
   desarrollo del proyecto (`npx playwright cli`), nunca instalado global.
5. **`image-to-code`**: solo si hay imágenes de referencia. Claude Code no genera imágenes;
   se generan con Canva o Adobe, o las pasa el usuario.

## Reglas de la web

- Se diseña primero para celular de 360 px de ancho.
- Áreas táctiles de 44 px como mínimo.
- Espaciado en múltiplos de 8 px.
- Contraste WCAG AA en todo el texto.
- Animación mínima y con motivo; respetar `prefers-reduced-motion`.
- Íconos solo de Lucide. Sin emoji.
- Copy en voseo rioplatense, sentence case, sin "potenciado por IA" ni "transformación digital".
- CTA: "Escribinos por WhatsApp" → `https://wa.me/5492625634845?text=...`.

## Git

- Commits chicos, en español: `tipo: descripción corta`.
- **Nunca `git push` sin confirmación explícita.**
- Nunca subir `.env` ni credenciales.
