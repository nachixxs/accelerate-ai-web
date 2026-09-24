# Accelerate.ai — sistema de diseño para redes

Plantilla base reutilizable para piezas de redes sociales de **Accelerate.ai**, agencia
argentina de automatización de procesos para pymes. No contiene contenido real: contiene
la identidad, los tokens, los componentes y los cinco layouts cerrados sobre los que después
se escriben carruseles y placas.

La marca se escribe **siempre** `Accelerate.ai`. Nunca "Accelerate.ia".

## Fuentes de este sistema

- **Brief de marca provisto por el cliente en el chat** (identidad, color, tipografía,
  efectos, formatos, los cinco layouts, reglas de composición, tono). Es la única fuente:
  no hubo repositorio, archivo de Figma ni codebase adjuntos.
- **Archivos de identidad: recibidos como PNG** (263px de alto, sólo las variantes azules).
  Viven en `assets/identidad/`. Ver "Identidad — estado" más abajo.

---

## CONTENT FUNDAMENTALS

**Voz.** Voseo rioplatense, directo, en segunda persona: "tu equipo", "agendá", "escribinos".
Le habla al dueño de una pyme, no a un área de IT enterprise. Se vende **resultado de negocio**,
no arquitectura técnica: "cada pedido entra al sistema sin que nadie lo tipee", no "integración
vía webhooks con la API de tu ERP".

**Vibe.** Alivio operativo, no hype de IA. La emoción que se busca es "esto me saca trabajo de
encima", no "el futuro ya llegó". Nada de "revolucionario", "potenciado por IA", "transformación
digital".

**Casing.** Sentence case en todos los titulares. Nunca Title Case, nunca ALL CAPS. La única
excepción del sistema es el **eyebrow**, que va en mayúsculas con tracking 8%.

**Topes de copy** (si no entra, se reescribe el copy — nunca se baja el tamaño):
hook 8 palabras · titular 12 · cuerpo 24.

**Emoji.** No, nunca, en copy de marca. La única marca gráfica tipo emoji del sistema es el
tilde ✔ de enviado dentro del mock de WhatsApp, y eso es producto, no interfaz.

**CTA.** Verbo + canal concreto. Sólo dos textos permitidos: "Escribinos por WhatsApp" o
"Agendá una llamada". Nunca "Empezar", "Saber más", "Conocé más", "Descubrí".

**Cifras.** Ningún número sin fuente citada inline, en 22px, al pie de la cifra.
Si no hay fuente, no va el número.

Ejemplos en el registro correcto:

- hook — "Tu equipo deja de copiar y pegar"
- titular — "Cada pedido entra al sistema sin que nadie lo tipee"
- cuerpo — "El bot toma el pedido por WhatsApp, lo carga en tu planilla y avisa al depósito. Vos sólo revisás los casos raros."
- eyebrow — "AUTOMATIZACIÓN PARA PYMES"
- fuente — "Fuente: medición interna, 14 clientes pyme, 2026"

---

## VISUAL FOUNDATIONS

**Color.** Dos rampas (azul de 11 pasos, cian de 5) más neutros oscuros y claros.
La regla que más define el resultado es la **jerarquía del azul**: `#2971f2` a máxima
saturación aparece **una sola vez por pieza o carrusel**, en el botón del CTA primario.
Todo lo demás que pediría ese azul baja a `#1f57c2` sobre fondo claro o `#22d3ee` sobre
fondo oscuro — íconos, bordes de acento, chips, burbujas de chat, subrayados. Un color de
máxima saturación repetido deja de ser jerarquía y pasa a ser el fondo de la pieza.
**Violeta, púrpura y magenta están prohibidos** en cualquier elemento: es la paleta de un
competidor y se evita deliberadamente. Ningún elemento de la identidad usa `#ffffff` puro.

**Tipografía.** Archivo (Google Fonts), pesos 400/500/600/700/800, **ninguna otra familia**.
Escala absoluta para lienzo de 1080px: hook 104 / titular 72 / gigante 200 / label 40 /
cuerpo 32 / eyebrow 24 / meta 22. No es responsive: son valores fijos de export.

**Fondos.** Máximo **dos** por serie: claro `#f7f9fc` para las piezas de desarrollo, oscuro
`#0b1220` para hook y cierre. Ningún tercero. No hay fotos, ni stock, ni ilustración, ni
patrones, ni texturas.

**Iluminación: el glow.** Es el recurso de iluminación de la marca y el único blur permitido.
Elipse irregular (no círculo perfecto), layer blur 90, que entra **siempre desde una esquina**
y queda a medias fuera del frame. Nunca centrada, nunca simétrica. Sobre fondo oscuro van dos
apiladas: azul `#2971f2` al 50% + cian `#22d3ee` al 20%. Sobre fondo claro va **una sola** al
12-18%, alternando azul y cian entre piezas consecutivas.

**Gradiente de texto.** `linear-gradient(90deg, #2971f2, #22d3ee)` como fill de texto. Es el
recurso más distintivo de la marca y por eso el más racionado: una o dos apariciones por
carrusel, nunca más, sobre una palabra o una línea — nunca un párrafo.

**Radios.** 8 inputs · 12 badges · 22 cards · 28 cards grandes · 999 botones, chips y tags.

**Sombras.** Siempre con tinte navy, nunca gris neutro.
card `0 24 60 #0f172a/14%` · elevada `0 16 36 #0f172a/16%` · botón `0 18 40 #0f2450/45%`.

**Cards.** Sobre fondo claro el único contenedor permitido es la **card invertida** `#111b30`
con radius 28 y sombra de card: una card blanca sobre `#f7f9fc` se lee como una sola superficie
plana. Máximo **un** elemento invertido por pieza clara, y sólo entre un tercio y la mitad de
las claras lo llevan.

**Profundidad (regla dura).** En cada pieza al menos un elemento se monta sobre el borde de otro
y lo cruza, con sombra propia: la última burbuja del mock sale de la card, el chip pill queda
mitad adentro mitad afuera, la card sangra el margen. Cards con contenido adentro y padding
prolijo = plano.

**Espacio negativo.** Cae de un lado distinto en cada pieza. Un 60% vacío siempre arriba,
repetido, no es minimalismo: es plantilla.

**Transparencia y blur.** Sólo en los glows. Nada de vidrio, nada de blur decorativo, y el texto
nunca se atenúa con alpha: sobre fondo oscuro va a opacidad plena.

**Animación y estados.** El sistema es de piezas estáticas de export: no hay animación.
Los únicos estados interactivos son los de las herramientas de previsualización (los visores
de este proyecto), donde hover = borde y texto a `#1f57c2`, y el estado activo = fill
`#1f57c2` con texto claro. Sin bounce, sin escalas al presionar.

---

## ICONOGRAPHY

- **Lucide, exclusivamente**, vía CDN (`lucide-static@1.47.0` vía jsDelivr, servido como máscara CSS para poder
  teñir el glifo con el color del sistema). Stroke 1.5-2px.
- **Está prohibido dibujar íconos a mano en SVG.** Si un concepto no tiene ícono en Lucide,
  se cambia el concepto.
- Tamaños: 40-56px dentro de una card · 72-96px si el ícono encabeza la pieza.
- Color: `#1f57c2` sobre fondo claro, `#22d3ee` sobre fondo oscuro. Nunca `#2971f2`.
- **Única excepción de vector propio:** el tilde de enviado del mock de WhatsApp, dibujado
  dentro de `WhatsAppMock` porque ahí es producto, no interfaz.
- No se usa emoji como ícono, ni caracteres unicode como glifos.
- No hay icon font propia ni sprite: no se recibió ninguna.

---

## Identidad — estado

Las seis combinaciones están activas y viven en `assets/identidad/`:

```
isotipo-azul.png   isotipo-claro.png     240×167
imagotipo-azul.png imagotipo-claro.png   962×168
logotipo-azul.png  logotipo-claro.png    922×168
avatar-azul.png    avatar-claro.png      1000×1000
```

**Qué se recibió:** las tres piezas azules en PNG con transparencia, 263px de alto. Se les
recortó el margen transparente (de ahí las medidas de arriba) y se conservaron tal cual: los
tres tintes del original son exactamente los del brief — `#2971f2` capa frontal, `#4e88f0` capa
media e inserto, `#a1bbe9` capa trasera.

**Cómo se hicieron las variantes para fondo oscuro:** no se recibieron, así que se generaron por
**sustitución de color capa por capa** sobre el archivo original, invirtiendo el orden de
luminancia como pide el brief — `#2971f2 → #dce8fe`, `#4e88f0 → #588ff8`, `#a1bbe9 → #1f57c2`.
No es un fill blanco ni un redibujo: es el mismo vector rasterizado con otros tres tintes, así
que las capas de movimiento siguen leyéndose. El logotipo, de un solo color, queda `#dce8fe` plano.

**Los avatares** son el isotipo sobre lienzo 1000×1000 con el margen de seguridad de 15,5% por
lado, para que el recorte circular de las plataformas no coma nada. `avatar-azul` sobre blanco,
`avatar-claro` sobre `#0b1220`.

**Limitación a resolver:** son PNG, no vectores. A 962px de ancho el imagotipo cubre el uso de
feed (el header de una pieza de 1080px usa 320px), pero no escala para impresión ni para un
header de 1920px. **Si tenés los SVG originales, mandalos:** los reemplazo y sólo cambia la
extensión en `components/brand/Logo.jsx`.

Reglas que ya están codificadas en el componente:
imagotipo con **280px de ancho mínimo** (por debajo se cambia a logotipo, no se achica);
variante para fondo oscuro recoloreada capa por capa (`#dce8fe` / `#588ff8` / `#1f57c2`),
nunca un fill blanco; logo arriba a la izquierda sobre el margen de 90px, igual en toda la serie.

## Tipografía — sustitución declarada

No se recibieron binarios de fuente. Archivo se carga desde Google Fonts
(`tokens/fonts.css`). Es la familia correcta, no un sustituto — pero si necesitás render
offline o self-hosted, mandá los `.woff2` y los cambio por reglas `@font-face` locales.

---

## Índice

**Raíz**
- `styles.css` — punto de entrada único (sólo `@import`s). Es el archivo que linkean los consumidores.
- `readme.md` — este documento.
- `SKILL.md` — envoltorio para usar el sistema como Agent Skill.
- `thumbnail.html` — tile del sistema.

**`assets/identidad/`** — las seis piezas de identidad más los dos avatares.

**`tokens/`** — `fonts.css` · `colors.css` · `typography.css` · `effects.css` · `layout.css` · `base.css`

**`components/`**
- `brand/` — **Logo**, **Avatar**, **Glow**, **Eyebrow**, **GradientText**
- `core/` — **Button**, **Chip**, **CardInvertida**, **Icon**, **Numeracion**, **Fuente**
- `producto/` — **WhatsAppMock**
- `layout/` — **FeedFrame**, **StoryFrame**, **SafeZones**

**`ui_kits/plantilla-redes/`** — los cinco layouts cerrados como componentes
(**LayoutHook**, **LayoutPunto**, **LayoutProducto**, **LayoutCifra**, **LayoutCta**) más
`index.html`, el visor interactivo del carrusel de 5 con guías conmutables.

**`templates/carrusel-feed/`** — plantilla editable de carrusel de 5 slides.
**`templates/placa-historia/`** — plantilla editable de historia/reel 1080×1920.

**`guidelines/`** — fichas de fundamentos (color, tipografía, efectos, composición) y los dos
frames de formato con las zonas seguras marcadas como guías.

## Los cinco layouts

Set **cerrado**. Toda slide se asigna a uno; ninguna inventa un layout nuevo. Si un contenido
no entra en ninguno, se reescribe el contenido.

| | Layout | Fondo | Núcleo |
|---|---|---|---|
| A | Hook | oscuro | glow azul+cian de una esquina, hook a sangre en el tercio central-inferior, chevron al borde derecho |
| B | Punto | claro | un glow al 14%, texto a sangre sin card blanca, un elemento invertido cruzando el margen |
| C | Producto | claro u oscuro | mock de WhatsApp con la última burbuja saliendo de la card y chip montado en el borde opuesto |
| D | Cifra | claro | card invertida arriba, cifra a 200px en `#5be3f3`, fuente citada inline, chip en el borde inferior, remate de 32px |
| E | CTA | oscuro | glow desde otra esquina que el hook, titular arriba, botón abajo, aire en el medio |

En una serie de 5: al menos tres composiciones distintas y al menos un momento de escala
desproporcionada (tipografía gigante o una palabra dominando el frame).

## Nombres de capa

Los componentes emiten `data-layer` con los nombres del sistema, así la pieza exportada queda
legible: `hook`, `titular`, `cuerpo`, `label`, `cifra`, `eyebrow`, `mock-whatsapp`,
`burbuja-recibida`, `burbuja-enviada`, `chip`, `chip-stat`, `boton-cta`, `glow-azul`,
`glow-cian`, `texto-gradiente`, `card-invertida`, `numeracion`, `fuente`, `logo`, `guias`.

## Adiciones intencionales

El brief no venía con inventario de componentes (no hubo Figma ni codebase), así que el set se
derivó de las reglas: cada componente existe porque el brief nombra una regla que sin él se
rompe a mano. Dos son infraestructura y conviene declararlos:

- **`Icon`** — envoltorio de Lucide. Existe para hacer cumplir "Lucide exclusivamente" y para
  poder teñir el glifo con los colores del sistema sin tocar el SVG.
- **`SafeZones`** — overlay de guías. Es el entregable "frames con las zonas seguras marcadas
  como guías", convertido en algo conmutable en vez de una capa que hay que borrar antes de exportar.
