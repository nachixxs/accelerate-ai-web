Renderiza la identidad de Accelerate.ai: elegí la pieza por el espacio disponible, no por gusto.

```jsx
<Logo pieza="imagotipo" fondo="claro" width={320} />   {/* sobre fondo oscuro */}
<Logo pieza="logotipo" fondo="azul" width={200} />     {/* espacio reducido */}
<Logo pieza="isotipo" fondo="azul" width={72} />       {/* usos chicos del ícono solo */}
<Avatar fondo="azul" size={160} />                     {/* foto de perfil, favicon */}
```

- `pieza="imagotipo"` exige **280px de ancho mínimo**. Por debajo se cambia a `logotipo` — nunca se achica el imagotipo.
- `fondo="claro"` es la variante para fondo oscuro: recoloreada capa por capa invirtiendo la luminancia (`#dce8fe` / `#588ff8` / `#1f57c2`). Nunca un fill blanco, nunca `#ffffff` puro.
- Posición estándar en piezas de redes: arriba a la izquierda, sobre el margen de 90px, igual en toda la serie. `FeedFrame` y `StoryFrame` ya lo colocan.
- Desde un subdirectorio pasale `assetBase` (p. ej. `"../../"`) para que resuelva la ruta a `assets/`.
