# SPECS — Web de Accelerate.ai

Borrador del 2026-09-23. Lo que dice **Pendiente** todavía no está decidido.

## 1. Qué es

Una landing de una sola página para Accelerate.ai. Existe para una cosa: que el dueño de
un negocio que llegó por una recomendación o por redes **escriba por WhatsApp pidiendo la
auditoría gratis**. Todo lo que no empuje hacia ese botón sobra.

## 2. Qué vendemos

**Sistemas a medida, para cualquier rubro.** No hay un catálogo de productos cerrados: la
puerta de entrada es la **auditoría**, en la que se mira cómo se mueve el negocio por dentro
y se elige el proceso que más tiempo o plata le hace perder. Sobre eso se construye el
sistema.

La promesa amplia ("hacemos lo que tu negocio necesite") necesita ejemplos concretos al
lado, o no se cree. La página muestra 3 o 4 ejemplos de lo que se puede armar, como
muestra y no como menú. Salen de lo que ya construimos, contado sin nombres de clientes:

| Ejemplo | Basado en |
|---|---|
| Pedidos que entran por WhatsApp y se cargan solos en una planilla | El bot de la imprenta |
| Turnos y reservas por WhatsApp, con recordatorios | Turnos/Citas y El Parador |
| Control de cajas y cierres diarios sin cuadernos | El sistema de cajas |
| Paneles para ver el negocio de un vistazo | Lo que hace Colo con Excel y Power BI |

## 3. Para quién

Dueños de negocios chicos y medianos en Argentina, de cualquier rubro, que pierden tiempo
en tareas repetidas o en información desparramada en cuadernos, planillas y chats. No son
técnicos: la página no habla de n8n, APIs ni modelos.

## 4. Secciones, en orden

| # | Sección | Qué tiene que lograr |
|---|---|---|
| 1 | Portada | En una línea, qué hacen y para quién. El botón de WhatsApp visible sin hacer scroll |
| 2 | Qué resolvemos | 2-3 dolores concretos, contados como los cuenta el dueño, no como los ve un técnico |
| 3 | Sistemas a medida | La promesa del §2 y los ejemplos de la tabla |
| 4 | Cómo trabajamos | La auditoría como primer paso: auditoría gratis de 30-45 min → propuesta con dos números → construcción de 1 a 3 semanas, con una demo a mitad de camino → soporte mensual |
| 5 | Quiénes somos | Ignacio y Gabriel, qué hace cada uno. Corto |
| 6 | Preguntas frecuentes | Las objeciones típicas: "¿y si falla?", "¿tengo que cambiar mi número?", "¿cuánto tarda?", "¿sirve para mi rubro?" |
| 7 | Cierre y pie | El botón de WhatsApp otra vez, más las redes |

## 5. El botón de WhatsApp

`https://wa.me/5492625634845?text=<mensaje>`: abre WhatsApp con el mensaje ya escrito, sin
backend. El texto del botón es **"Escribinos por WhatsApp"**, uno de los dos CTA que permite la
marca. El mensaje propuesto: *"Hola, vi la web y quiero la auditoría gratis."*

## 6. Marca

Sale del design system de Colo (`F:\Accelerate.ai Design System.zip`). Está pensado para
piezas de redes, así que se toma una parte y otra no:

| Se usa tal cual | Se adapta para web |
|---|---|
| Colores, radios, sombras, glows y gradiente de texto (`tokens/`) | La escala tipográfica: la del sistema es fija para un lienzo de 1080 px; la web necesita una que se achique en el celular |
| Tipografía Archivo, sin otra familia | Los layouts de feed e historia no aplican; las secciones de la web son propias |
| Logos de `assets/identidad/` | Los componentes vienen en React (`.jsx`); se reescriben como componentes `.astro` |
| Las reglas de voz, CTA, íconos (solo Lucide) y color (el azul `#2971f2` una sola vez, sin violeta) | |

Los logos son PNG, no SVG. Alcanzan para el header de la web; si aparecen los SVG originales,
se cambian.

## 7. Fuera de alcance (por ahora)

- Precios: se suman en una etapa posterior.
- Casos de clientes y testimonios: se suman cuando haya permiso de los dueños.
- Blog, formulario de contacto, backend, login.
- Demo en vivo de un bot. Es la idea que haría que la web también sirva de portfolio técnico,
  pero va en una etapa aparte, si se decide.

## 8. Stack

| Qué | Decisión | Por qué |
|---|---|---|
| Framework | Astro | Componentes por sección y HTML estático como resultado. Deja la puerta abierta a un blog en Markdown |
| Estilos | Los tokens CSS del design system, más los estilos de cada componente dentro de su `.astro` | Sin Tailwind ni librerías de UI: la marca ya trae sus tokens |
| JavaScript en el navegador | Ninguno | Todo es contenido estático; el botón es un link |
| Hosting | GitHub Pages o Cloudflare Pages, gratis | **Pendiente:** elegir uno |
| Dominio | **Pendiente** | Se decide aparte; tiene costo anual |

## 9. Terminado significa

- `npm run build` termina sin errores.
- Se ve bien en un celular de 360 px de ancho, que es donde la van a abrir casi todos.
- El botón abre WhatsApp con el mensaje escrito, en el celular y en la compu.
- Al compartir el link por WhatsApp aparece la vista previa con título, descripción e imagen
  (etiquetas Open Graph).
- Respeta las reglas de marca del §6.
- Colo revisó y aprobó los textos.

## 10. Decisiones pendientes

| # | Decisión | Bloquea |
|---|---|---|
| P1 | Hosting | La publicación |
| P2 | Dominio | La publicación con URL propia |
| P3 | Repo público o privado en GitHub | Publicar gratis en GitHub Pages con un repo privado requiere un plan pago; en Cloudflare Pages no |
