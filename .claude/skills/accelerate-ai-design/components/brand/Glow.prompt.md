Iluminación de marca. Va dentro de un contenedor `position:relative` con `overflow:hidden`.

```jsx
{/* fondo oscuro: el par completo */}
<Glow tone="azul" corner="top-left" size={1100} />
<Glow tone="cian" corner="top-left" size={820} />

{/* fondo claro: una sola, esquina alternada respecto de la pieza anterior */}
<Glow tone="cian" fondo="claro" corner="bottom-right" size={900} />
```

Reglas: siempre desde una esquina y a medias fuera del frame; alternar azul/cian entre piezas consecutivas; nada de blur decorativo fuera de estos glows.
