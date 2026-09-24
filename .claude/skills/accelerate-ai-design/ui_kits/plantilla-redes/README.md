# Plantilla de redes — Accelerate.ai

Los cinco layouts del sistema, cerrados como componentes. `index.html` es el visor:
navegá con ← →, prendé y apagá las guías de zona segura con G.

Todo el texto viene como placeholder marcado entre corchetes (`[Hook de hasta ocho palabras]`).
Se escribe encima; el layout no se toca.

## Cómo se arma una serie de 5

```jsx
<LayoutHook index={1} total={5} eyebrow="Automatización para pymes" hook="Tu equipo deja de" destacado="copiar y pegar" />
<LayoutPunto index={2} total={5} glowTone="cian" glowCorner="bottom-right" icono="clock" … />
<LayoutProducto index={3} total={5} fondo="oscuro" mensajes={[…]} chip="Respuesta en 4 s" />
<LayoutCifra index={4} total={5} cifra="68%" label="…" fuente="Fuente: …" chip="−11 h por semana" />
<LayoutCta index={5} total={5} titular="…" cta="Escribinos por WhatsApp" />
```

Reglas que el visor te deja verificar de un golpe:

1. Dos fondos nada más: oscuro en A y E, claro en el medio.
2. El glow alterna azul/cian y cambia de esquina entre piezas consecutivas.
3. Un solo `#2971f2` saturado en toda la serie: el botón del slide E.
4. Cada pieza tiene un elemento cruzando el borde de otro, con sombra propia.
5. La cifra del slide D lleva fuente citada inline, sin excepción.

Para exportar, dejá `scale` en 1 (default) y apagá las guías: el frame mide 1080×1350 real.
