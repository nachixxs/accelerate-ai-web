/* @ds-bundle: {"format":4,"namespace":"AccelerateAiDesignSystem_5ea60e","components":[{"name":"Eyebrow","sourcePath":"components/brand/Eyebrow.jsx"},{"name":"Glow","sourcePath":"components/brand/Glow.jsx"},{"name":"GradientText","sourcePath":"components/brand/GradientText.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Avatar","sourcePath":"components/brand/Logo.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"CardInvertida","sourcePath":"components/core/CardInvertida.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"Fuente","sourcePath":"components/core/Fuente.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Numeracion","sourcePath":"components/core/Numeracion.jsx"},{"name":"FeedFrame","sourcePath":"components/layout/FeedFrame.jsx"},{"name":"SafeZones","sourcePath":"components/layout/SafeZones.jsx"},{"name":"StoryFrame","sourcePath":"components/layout/StoryFrame.jsx"},{"name":"WhatsAppMock","sourcePath":"components/producto/WhatsAppMock.jsx"},{"name":"LayoutCifra","sourcePath":"ui_kits/plantilla-redes/LayoutCifra.jsx"},{"name":"LayoutCta","sourcePath":"ui_kits/plantilla-redes/LayoutCta.jsx"},{"name":"LayoutHook","sourcePath":"ui_kits/plantilla-redes/LayoutHook.jsx"},{"name":"LayoutProducto","sourcePath":"ui_kits/plantilla-redes/LayoutProducto.jsx"},{"name":"LayoutPunto","sourcePath":"ui_kits/plantilla-redes/LayoutPunto.jsx"}],"sourceHashes":{"components/brand/Eyebrow.jsx":"3902db82d9a1","components/brand/Glow.jsx":"25f094580e6f","components/brand/GradientText.jsx":"cd756828cf15","components/brand/Logo.jsx":"30560bf73bdd","components/core/Button.jsx":"61b9cba7f040","components/core/CardInvertida.jsx":"df2ea59f701a","components/core/Chip.jsx":"5aa2a62e1202","components/core/Fuente.jsx":"1bd8654176a4","components/core/Icon.jsx":"8dd8df1ce61a","components/core/Numeracion.jsx":"804394b3bfa4","components/layout/FeedFrame.jsx":"b1b3f476f698","components/layout/SafeZones.jsx":"1e591d29c3d4","components/layout/StoryFrame.jsx":"36a4c638529f","components/producto/WhatsAppMock.jsx":"776c419ab38e","ui_kits/plantilla-redes/LayoutCifra.jsx":"df096f0de351","ui_kits/plantilla-redes/LayoutCta.jsx":"13714c26a210","ui_kits/plantilla-redes/LayoutHook.jsx":"96db7f553488","ui_kits/plantilla-redes/LayoutProducto.jsx":"bd1127cc5727","ui_kits/plantilla-redes/LayoutPunto.jsx":"69287b209f6f"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AccelerateAiDesignSystem_5ea60e = window.AccelerateAiDesignSystem_5ea60e || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Eyebrow({
  children,
  fondo = "claro",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    "data-layer": "eyebrow",
    style: {
      fontFamily: "var(--font-core)",
      fontSize: "var(--type-eyebrow-size)",
      fontWeight: "var(--type-eyebrow-weight)",
      letterSpacing: "var(--type-eyebrow-ls)",
      textTransform: "uppercase",
      color: fondo === "oscuro" ? "var(--brand-accent)" : "var(--brand-primary-deep)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/brand/Glow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CORNERS = {
  "top-left": (w, h) => ({
    top: -h * 0.42,
    left: -w * 0.34,
    rotate: "-18deg"
  }),
  "top-right": (w, h) => ({
    top: -h * 0.45,
    right: -w * 0.3,
    rotate: "14deg"
  }),
  "bottom-left": (w, h) => ({
    bottom: -h * 0.4,
    left: -w * 0.36,
    rotate: "22deg"
  }),
  "bottom-right": (w, h) => ({
    bottom: -h * 0.46,
    right: -w * 0.32,
    rotate: "-12deg"
  })
};
function Glow({
  tone = "azul",
  fondo = "oscuro",
  corner = "top-left",
  size = 1000,
  opacity,
  style,
  ...rest
}) {
  const w = size;
  const h = size * 0.72;
  const pos = (CORNERS[corner] || CORNERS["top-left"])(w, h);
  const claro = fondo === "claro";
  const bg = claro ? tone === "cian" ? "var(--glow-claro-cian)" : "var(--glow-claro-azul)" : tone === "cian" ? "var(--glow-cian)" : "var(--glow-azul)";
  const {
    rotate,
    ...place
  } = pos;
  return /*#__PURE__*/React.createElement("div", _extends({
    "aria-hidden": "true",
    "data-layer": tone === "cian" ? "glow-cian" : "glow-azul",
    style: {
      position: "absolute",
      width: w,
      height: h,
      borderRadius: "50%",
      background: bg,
      filter: "blur(var(--glow-blur))",
      transform: "rotate(" + rotate + ") scale(1, 0.82)",
      opacity,
      pointerEvents: "none",
      ...place,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Glow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Glow.jsx", error: String((e && e.message) || e) }); }

// components/brand/GradientText.jsx
try { (() => {
function GradientText({
  children,
  as = "span",
  style,
  ...rest
}) {
  return React.createElement(as, {
    "data-layer": "texto-gradiente",
    style: {
      background: "var(--gradient-text)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      WebkitTextFillColor: "transparent",
      ...style
    },
    ...rest
  }, children);
}
Object.assign(__ds_scope, { GradientText });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/GradientText.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Las tres piezas de identidad son archivos de marca: se usan tal cual, no se
   redibujan ni se recomponen. Los originales entregados son PNG a 263px de alto
   (sólo las variantes azules); las variantes para fondo oscuro se generaron
   recoloreando capa por capa e invirtiendo el orden de luminancia — nunca con
   un fill blanco. Ningún elemento usa #ffffff puro. */
const SRC = (pieza, fondo) => "assets/identidad/" + pieza + "-" + fondo + ".png";

/* relación de aspecto real de cada archivo recortado */
const AR = {
  isotipo: 240 / 167,
  imagotipo: 962 / 168,
  logotipo: 922 / 168
};
const DEFAULT_W = {
  isotipo: 120,
  imagotipo: 320,
  logotipo: 240
};
const MIN_IMAGOTIPO = 280;
function Logo({
  pieza = "imagotipo",
  fondo = "azul",
  width,
  assetBase = "",
  style,
  ...rest
}) {
  const w = width || DEFAULT_W[pieza] || 320;
  if (pieza === "imagotipo" && w < MIN_IMAGOTIPO) {
    console.warn("[Logo] imagotipo por debajo de su ancho mínimo (" + MIN_IMAGOTIPO + "px): usá pieza=\"logotipo\" en lugar de achicarlo.");
  }
  return /*#__PURE__*/React.createElement("img", _extends({
    "data-layer": "logo",
    src: assetBase + SRC(pieza, fondo),
    alt: "Accelerate.ai — " + pieza,
    width: Math.round(w),
    height: Math.round(w / AR[pieza]),
    style: {
      width: w,
      height: w / AR[pieza],
      display: "block",
      ...style
    }
  }, rest));
}

/* Avatar cuadrado: lienzo 1000×1000 con el isotipo dentro del margen de
   seguridad de 15,5% por lado, para que el recorte circular de redes no coma nada. */
function Avatar({
  fondo = "azul",
  size = 160,
  assetBase = "",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("img", _extends({
    "data-layer": "avatar",
    src: assetBase + "assets/identidad/avatar-" + fondo + ".png",
    alt: "Accelerate.ai",
    width: size,
    height: size,
    style: {
      width: size,
      height: size,
      display: "block",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Logo, Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/core/CardInvertida.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CardInvertida({
  children,
  radius = "lg",
  padding = 64,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    "data-layer": "card-invertida",
    style: {
      position: "relative",
      background: "var(--surface-card-dark)",
      color: "var(--text-body-light)",
      borderRadius: radius === "lg" ? "var(--radius-card-lg)" : "var(--radius-card)",
      boxShadow: "var(--shadow-card)",
      padding,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { CardInvertida });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/CardInvertida.jsx", error: String((e && e.message) || e) }); }

// components/core/Fuente.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Fuente({
  children,
  fondo = "claro",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    "data-layer": "fuente",
    style: {
      fontFamily: "var(--font-core)",
      fontSize: "var(--type-meta-size)",
      fontWeight: "var(--type-meta-weight)",
      color: fondo === "oscuro" ? "var(--text-muted-light)" : "var(--text-muted-dark)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Fuente });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Fuente.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Lucide exclusivamente, servido desde CDN como máscara CSS para poder
   heredar el color. Está PROHIBIDO dibujar íconos a mano en SVG: si un
   concepto no tiene ícono en Lucide, se cambia el concepto.
   Única excepción del sistema: el tilde de enviado del mock de WhatsApp,
   que es producto y no interfaz (vive en WhatsAppMock). */
const CDN = "https://cdn.jsdelivr.net/npm/lucide-static@1.47.0/icons/";
function Icon({
  name,
  size = 48,
  color = "currentColor",
  style,
  ...rest
}) {
  const url = "url(" + CDN + name + ".svg)";
  return /*#__PURE__*/React.createElement("span", _extends({
    role: "img",
    "aria-label": name,
    "data-layer": "icono-" + name,
    style: {
      display: "inline-block",
      flex: "none",
      width: size,
      height: size,
      background: color,
      WebkitMaskImage: url,
      maskImage: url,
      WebkitMaskSize: "contain",
      maskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* El CTA es el único lugar del sistema donde aparece #2971f2 a máxima
   saturación, una sola vez por pieza o carrusel. */
const LABELS_OK = ["Escribinos por WhatsApp", "Agendá una llamada"];
function Button({
  children,
  icon,
  size = "feed",
  style,
  ...rest
}) {
  if (typeof children === "string" && !LABELS_OK.includes(children)) {
    console.warn('[Button] El CTA de marca es verbo + canal concreto: "Escribinos por WhatsApp" o "Agendá una llamada". Nunca "Empezar" ni "Saber más". Recibido: "' + children + '"');
  }
  const compact = size === "compact";
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "data-layer": "boton-cta",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: compact ? 12 : 20,
      border: "none",
      cursor: "pointer",
      background: "var(--brand-primary)",
      color: "var(--text-heading-light)",
      fontFamily: "var(--font-core)",
      fontWeight: 600,
      fontSize: compact ? 24 : 40,
      lineHeight: 1,
      letterSpacing: "-0.01em",
      padding: compact ? "20px 34px" : "32px 56px",
      borderRadius: "var(--radius-pill)",
      boxShadow: "var(--shadow-boton)",
      ...style
    }
  }, rest), children, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: compact ? 24 : 40
  }) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  claro: {
    bg: "var(--white)",
    fg: "var(--brand-primary-deep)",
    border: "1px solid var(--border-light)"
  },
  oscuro: {
    bg: "var(--surface-card-dark)",
    fg: "var(--brand-accent)",
    border: "1px solid var(--border-dark)"
  },
  acento: {
    bg: "var(--cyan-300)",
    fg: "var(--navy-950)",
    border: "none"
  }
};
function Chip({
  children,
  tone = "claro",
  icon,
  montado = false,
  size = "feed",
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.claro;
  const compact = size === "compact";
  return /*#__PURE__*/React.createElement("span", _extends({
    "data-layer": montado ? "chip-stat" : "chip",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: compact ? 8 : 14,
      background: t.bg,
      color: t.fg,
      border: t.border,
      fontFamily: "var(--font-core)",
      fontWeight: 600,
      fontSize: compact ? 16 : 28,
      lineHeight: 1,
      padding: compact ? "10px 18px" : "20px 34px",
      borderRadius: "var(--radius-pill)",
      boxShadow: montado ? "var(--shadow-elevada)" : "none",
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: compact ? 16 : 30
  }) : null, children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/Numeracion.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Numeracion({
  index = 1,
  total = 5,
  fondo = "claro",
  style,
  ...rest
}) {
  const pad = n => String(n).padStart(2, "0");
  return /*#__PURE__*/React.createElement("span", _extends({
    "data-layer": "numeracion",
    style: {
      fontFamily: "var(--font-core)",
      fontSize: "var(--type-meta-size)",
      fontWeight: "var(--type-meta-weight)",
      letterSpacing: "0.04em",
      color: fondo === "oscuro" ? "var(--text-muted-light)" : "var(--text-muted-dark)",
      ...style
    }
  }, rest), pad(index) + "/" + pad(total));
}
Object.assign(__ds_scope, { Numeracion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Numeracion.jsx", error: String((e && e.message) || e) }); }

// components/layout/SafeZones.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const LINE = "rgba(34,211,238,.9)";
const BAD = "rgba(41,113,242,.14)";
function SafeZones({
  formato = "feed",
  style,
  ...rest
}) {
  const feed = formato === "feed";
  const w = 1080;
  const h = feed ? 1350 : 1920;
  const label = (text, top, left) => /*#__PURE__*/React.createElement("div", {
    key: text + top,
    style: {
      position: "absolute",
      top,
      left,
      fontFamily: "var(--font-core)",
      fontSize: 20,
      fontWeight: 600,
      letterSpacing: "0.04em",
      color: "var(--cyan-500)",
      textTransform: "uppercase"
    }
  }, text);
  return /*#__PURE__*/React.createElement("div", _extends({
    "aria-hidden": "true",
    "data-layer": "guias",
    style: {
      position: "absolute",
      inset: 0,
      width: w,
      height: h,
      pointerEvents: "none",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 90,
      borderLeft: "1px dashed " + LINE
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 90,
      borderRight: "1px dashed " + LINE
    }
  }), feed ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 90,
      borderTop: "1px dashed " + LINE
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 120,
      background: BAD,
      borderTop: "1px solid " + LINE
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 150,
      borderTop: "1px dotted rgba(34,211,238,.55)"
    }
  }), label("margen superior 90", 100, 104), label("zona insegura · 120", h - 84, 104), label("línea de numeración · 150", h - 176, 104)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: 250,
      background: BAD,
      borderBottom: "1px solid " + LINE
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 250,
      background: BAD,
      borderTop: "1px solid " + LINE
    }
  }), label("zona insegura · 0 → 250 · foto de perfil", 200, 104), label("zona útil · 250 → 1670", 270, 104), label("zona insegura · 1670 → 1920 · barra de respuesta", h - 230, 104)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      border: "1px solid rgba(34,211,238,.35)"
    }
  }));
}
Object.assign(__ds_scope, { SafeZones });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/SafeZones.jsx", error: String((e && e.message) || e) }); }

// components/layout/FeedFrame.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function FeedFrame({
  children,
  fondo = "claro",
  logo = true,
  piezaLogo = "logotipo",
  index,
  total,
  guias = false,
  scale = 1,
  assetBase = "",
  style,
  ...rest
}) {
  const oscuro = fondo === "oscuro";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1080 * scale,
      height: 1350 * scale,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("div", _extends({
    "data-formato": "feed",
    style: {
      position: "relative",
      width: 1080,
      height: 1350,
      overflow: "hidden",
      background: oscuro ? "var(--surface-dark)" : "var(--surface-alt)",
      fontFamily: "var(--font-core)",
      transform: scale === 1 ? undefined : "scale(" + scale + ")",
      transformOrigin: "top left",
      ...style
    }
  }, rest), children, logo ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 90,
      left: 90
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    pieza: piezaLogo,
    fondo: oscuro ? "claro" : "azul",
    width: piezaLogo === "isotipo" ? 72 : piezaLogo === "imagotipo" ? 320 : 240,
    assetBase: assetBase
  })) : null, index ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 90,
      bottom: 150
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Numeracion, {
    index: index,
    total: total,
    fondo: oscuro ? "oscuro" : "claro"
  })) : null, guias ? /*#__PURE__*/React.createElement(__ds_scope.SafeZones, {
    formato: "feed"
  }) : null));
}
Object.assign(__ds_scope, { FeedFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/FeedFrame.jsx", error: String((e && e.message) || e) }); }

// components/layout/StoryFrame.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function StoryFrame({
  children,
  fondo = "oscuro",
  logo = true,
  piezaLogo = "logotipo",
  guias = false,
  scale = 1,
  assetBase = "",
  style,
  ...rest
}) {
  const oscuro = fondo === "oscuro";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1080 * scale,
      height: 1920 * scale,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("div", _extends({
    "data-formato": "historia",
    style: {
      position: "relative",
      width: 1080,
      height: 1920,
      overflow: "hidden",
      background: oscuro ? "var(--surface-dark)" : "var(--surface-alt)",
      fontFamily: "var(--font-core)",
      transform: scale === 1 ? undefined : "scale(" + scale + ")",
      transformOrigin: "top left",
      ...style
    }
  }, rest), children, logo ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 290,
      left: 90
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    pieza: piezaLogo,
    fondo: oscuro ? "claro" : "azul",
    width: piezaLogo === "isotipo" ? 72 : piezaLogo === "imagotipo" ? 320 : 240,
    assetBase: assetBase
  })) : null, guias ? /*#__PURE__*/React.createElement(__ds_scope.SafeZones, {
    formato: "historia"
  }) : null));
}
Object.assign(__ds_scope, { StoryFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/StoryFrame.jsx", error: String((e && e.message) || e) }); }

// components/producto/WhatsAppMock.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* El producto SIEMPRE se muestra con este mock. Nunca con íconos genéricos
   de "imagen" ni con fotografía de stock.
   El tilde de enviado es el único vector dibujado a mano del sistema: es
   producto, no interfaz. */
function Tilde({
  color
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "14",
    viewBox: "0 0 22 14",
    fill: "none",
    "aria-hidden": "true",
    style: {
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 8.2 4.6 12 12.4 2",
    stroke: color,
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.6 8.2 12.2 12 20 2",
    stroke: color,
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}
function Burbuja({
  from,
  text,
  hora,
  bleed
}) {
  const enviada = from === "enviada";
  return /*#__PURE__*/React.createElement("div", {
    "data-layer": "burbuja-" + from,
    style: {
      alignSelf: enviada ? "flex-end" : "flex-start",
      maxWidth: "76%",
      marginRight: enviada && bleed ? -96 : 0,
      marginLeft: !enviada && bleed ? -96 : 0,
      background: enviada ? "var(--brand-primary-deep)" : "var(--navy-800)",
      color: enviada ? "#eaf1ff" : "var(--text-body-light)",
      borderRadius: 26,
      borderBottomRightRadius: enviada ? 8 : 26,
      borderBottomLeftRadius: enviada ? 26 : 8,
      padding: "26px 32px 20px",
      fontFamily: "var(--font-core)",
      fontSize: 30,
      lineHeight: 1.35,
      boxShadow: bleed ? "var(--shadow-elevada)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", null, text), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 10,
      marginTop: 12,
      fontSize: 20,
      fontWeight: 500,
      color: enviada ? "rgba(234,241,255,.72)" : "var(--text-muted-light)"
    }
  }, /*#__PURE__*/React.createElement("span", null, hora), enviada ? /*#__PURE__*/React.createElement(Tilde, {
    color: "var(--cyan-300)"
  }) : null));
}
function WhatsAppMock({
  mensajes = [],
  chip = null,
  width = 760,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    "data-layer": "mock-whatsapp",
    style: {
      position: "relative",
      width,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      background: "var(--surface-card-dark)",
      border: "1px solid var(--border-dark)",
      borderRadius: "var(--radius-card-lg)",
      boxShadow: "var(--shadow-card)",
      padding: "48px 56px 56px",
      display: "flex",
      flexDirection: "column",
      gap: 24
    }
  }, mensajes.map((m, i) => /*#__PURE__*/React.createElement(Burbuja, {
    key: i,
    from: m.from,
    text: m.text,
    hora: m.hora,
    bleed: i === mensajes.length - 1
  }))), chip);
}
Object.assign(__ds_scope, { WhatsAppMock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/producto/WhatsAppMock.jsx", error: String((e && e.message) || e) }); }

// ui_kits/plantilla-redes/LayoutCifra.jsx
try { (() => {
/* LAYOUT D — CIFRA · fondo claro.
   Card invertida en la mitad superior, cifra a 200px en #5be3f3, label debajo,
   fuente citada al pie, chip montado sobre el borde inferior de la card y una
   línea de 32px que explica el resultado en lenguaje llano.
   NINGÚN NÚMERO SIN FUENTE CITADA INLINE. */
function LayoutCifra({
  cifra,
  label,
  fuente,
  chip,
  remate,
  glowTone = "azul",
  index = 4,
  total = 5,
  guias = false,
  scale = 1,
  assetBase = ""
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.FeedFrame, {
    fondo: "claro",
    index: index,
    total: total,
    guias: guias,
    scale: scale,
    assetBase: assetBase
  }, /*#__PURE__*/React.createElement(__ds_scope.Glow, {
    tone: glowTone,
    fondo: "claro",
    corner: "top-left",
    size: 900
  }), /*#__PURE__*/React.createElement(__ds_scope.CardInvertida, {
    style: {
      position: "absolute",
      left: 90,
      right: -56,
      top: 260,
      padding: "72px 80px 64px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-layer": "cifra",
    style: {
      fontSize: "var(--type-gigante-size)",
      fontWeight: 800,
      lineHeight: 1,
      letterSpacing: "-0.03em",
      color: "var(--cyan-300)"
    }
  }, cifra || "00%"), /*#__PURE__*/React.createElement("div", {
    "data-layer": "label",
    style: {
      marginTop: 18,
      maxWidth: 660,
      fontSize: "var(--type-label-size)",
      fontWeight: 500,
      lineHeight: 1.3,
      color: "var(--text-body-light)"
    }
  }, label || "[label de la cifra, 40px]"), /*#__PURE__*/React.createElement(__ds_scope.Fuente, {
    fondo: "oscuro",
    style: {
      marginTop: 40
    }
  }, fuente || "[Fuente: dato citado inline — obligatorio]"), /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    tone: "acento",
    icon: "trending-up",
    montado: true,
    style: {
      position: "absolute",
      bottom: -34,
      left: 80
    }
  }, chip || "[chip-stat]")), /*#__PURE__*/React.createElement("p", {
    "data-layer": "cuerpo",
    style: {
      position: "absolute",
      left: 90,
      right: 200,
      bottom: 300,
      margin: 0,
      fontSize: "var(--type-cuerpo-size)",
      fontWeight: 400,
      lineHeight: 1.4,
      color: "var(--text-body-dark)",
      textWrap: "pretty"
    }
  }, remate || "[Una línea de 32px que traduce la cifra a un resultado concreto para el dueño de la pyme.]"));
}
Object.assign(__ds_scope, { LayoutCifra });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/plantilla-redes/LayoutCifra.jsx", error: String((e && e.message) || e) }); }

// ui_kits/plantilla-redes/LayoutCta.jsx
try { (() => {
/* LAYOUT E — CTA · fondo oscuro.
   Glow desde una esquina distinta a la del hook. Titular arriba, botón abajo,
   aire en el medio. El CTA es el único #2971f2 saturado del carrusel. */
function LayoutCta({
  titular,
  cta = "Escribinos por WhatsApp",
  icono = "message-circle",
  index = 5,
  total = 5,
  guias = false,
  scale = 1,
  assetBase = ""
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.FeedFrame, {
    fondo: "oscuro",
    piezaLogo: "imagotipo",
    index: index,
    total: total,
    guias: guias,
    scale: scale,
    assetBase: assetBase
  }, /*#__PURE__*/React.createElement(__ds_scope.Glow, {
    tone: "cian",
    corner: "bottom-left",
    size: 1150
  }), /*#__PURE__*/React.createElement(__ds_scope.Glow, {
    tone: "azul",
    corner: "bottom-left",
    size: 900
  }), /*#__PURE__*/React.createElement("h2", {
    "data-layer": "titular",
    style: {
      position: "absolute",
      left: 90,
      right: 230,
      top: 300,
      margin: 0,
      fontSize: "var(--type-titular-size)",
      fontWeight: 700,
      lineHeight: 1.08,
      letterSpacing: "-0.01em",
      color: "var(--text-heading-light)",
      textWrap: "pretty"
    }
  }, titular || "[Titular de cierre: el resultado, no el producto]"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 90,
      bottom: 290
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    icon: icono
  }, cta)));
}
Object.assign(__ds_scope, { LayoutCta });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/plantilla-redes/LayoutCta.jsx", error: String((e && e.message) || e) }); }

// ui_kits/plantilla-redes/LayoutHook.jsx
try { (() => {
/* LAYOUT A — HOOK · fondo oscuro.
   Glow azul + cian desde una esquina. Eyebrow arriba. Hook alineado a la
   izquierda en el tercio central-inferior. Chevron a la derecha. Texto a
   sangre, sin card. Nada centrado. */
function LayoutHook({
  eyebrow,
  hook,
  destacado,
  index = 1,
  total = 5,
  guias = false,
  scale = 1,
  assetBase = ""
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.FeedFrame, {
    fondo: "oscuro",
    piezaLogo: "imagotipo",
    index: index,
    total: total,
    guias: guias,
    scale: scale,
    assetBase: assetBase
  }, /*#__PURE__*/React.createElement(__ds_scope.Glow, {
    tone: "azul",
    corner: "top-right",
    size: 1180
  }), /*#__PURE__*/React.createElement(__ds_scope.Glow, {
    tone: "cian",
    corner: "top-right",
    size: 860
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 90,
      top: 236
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, {
    fondo: "oscuro"
  }, eyebrow || "[eyebrow · 24px · mayúsculas]")), /*#__PURE__*/React.createElement("h1", {
    "data-layer": "hook",
    style: {
      position: "absolute",
      left: 90,
      right: 190,
      bottom: 296,
      margin: 0,
      fontSize: "var(--type-hook-size)",
      fontWeight: 800,
      lineHeight: 1.05,
      letterSpacing: "-0.02em",
      color: "var(--text-heading-light)",
      textWrap: "pretty"
    }
  }, hook || "[Hook de hasta ocho palabras]", destacado ? /*#__PURE__*/React.createElement(React.Fragment, null, " ", /*#__PURE__*/React.createElement(__ds_scope.GradientText, null, destacado)) : null), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 48,
    color: "var(--text-heading-light)",
    style: {
      position: "absolute",
      right: 66,
      bottom: 430,
      opacity: 0.6
    }
  }));
}
Object.assign(__ds_scope, { LayoutHook });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/plantilla-redes/LayoutHook.jsx", error: String((e && e.message) || e) }); }

// ui_kits/plantilla-redes/LayoutProducto.jsx
try { (() => {
/* LAYOUT C — PRODUCTO · fondo claro u oscuro.
   Mock de WhatsApp. La última burbuja cruza el borde de la card; un chip pill
   va montado sobre el borde opuesto, mitad adentro mitad afuera, con sombra propia. */
const DEFAULT_MSGS = [{
  from: "recibida",
  text: "[mensaje que entra por WhatsApp]",
  hora: "9:38"
}, {
  from: "enviada",
  text: "[respuesta automática del flujo]",
  hora: "9:38"
}];
function LayoutProducto({
  eyebrow,
  titular,
  mensajes,
  chip,
  fondo = "oscuro",
  index = 3,
  total = 5,
  guias = false,
  scale = 1,
  assetBase = ""
}) {
  const oscuro = fondo === "oscuro";
  return /*#__PURE__*/React.createElement(__ds_scope.FeedFrame, {
    fondo: fondo,
    index: index,
    total: total,
    guias: guias,
    scale: scale,
    assetBase: assetBase
  }, /*#__PURE__*/React.createElement(__ds_scope.Glow, {
    tone: "azul",
    corner: "bottom-right",
    size: 1100,
    fondo: oscuro ? "oscuro" : "claro"
  }), oscuro ? /*#__PURE__*/React.createElement(__ds_scope.Glow, {
    tone: "cian",
    corner: "bottom-right",
    size: 780
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 90,
      right: 200,
      top: 230
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, {
    fondo: oscuro ? "oscuro" : "claro"
  }, eyebrow || "[eyebrow]"), /*#__PURE__*/React.createElement("h2", {
    "data-layer": "titular",
    style: {
      margin: "26px 0 0",
      fontSize: "var(--type-titular-size)",
      fontWeight: 700,
      lineHeight: 1.08,
      letterSpacing: "-0.01em",
      color: oscuro ? "var(--text-heading-light)" : "var(--text-heading-dark)",
      textWrap: "pretty"
    }
  }, titular || "[Titular corto que nombra el resultado]")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 200,
      top: 600
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.WhatsAppMock, {
    width: 790,
    mensajes: mensajes || DEFAULT_MSGS,
    chip: /*#__PURE__*/React.createElement(__ds_scope.Chip, {
      tone: "acento",
      icon: "zap",
      montado: true,
      style: {
        position: "absolute",
        top: -34,
        left: -68
      }
    }, chip || "[tiempo de respuesta]")
  })));
}
Object.assign(__ds_scope, { LayoutProducto });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/plantilla-redes/LayoutProducto.jsx", error: String((e && e.message) || e) }); }

// ui_kits/plantilla-redes/LayoutPunto.jsx
try { (() => {
/* LAYOUT B — PUNTO · fondo claro.
   Un solo glow al 14%, esquina alternada. Texto a sangre, SIN card blanca.
   El espacio negativo cae arriba a la derecha. El chip cruza el margen izquierdo. */
function LayoutPunto({
  eyebrow,
  titular,
  cuerpo,
  chip,
  icono = "clock",
  glowTone = "cian",
  glowCorner = "bottom-right",
  index = 2,
  total = 5,
  guias = false,
  scale = 1,
  assetBase = ""
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.FeedFrame, {
    fondo: "claro",
    index: index,
    total: total,
    guias: guias,
    scale: scale,
    assetBase: assetBase
  }, /*#__PURE__*/React.createElement(__ds_scope.Glow, {
    tone: glowTone,
    fondo: "claro",
    corner: glowCorner,
    size: 980
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icono,
    size: 96,
    color: "var(--brand-primary-deep)",
    style: {
      position: "absolute",
      left: 90,
      top: 300
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 90,
      right: 150,
      top: 470
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, null, eyebrow || "[eyebrow]"), /*#__PURE__*/React.createElement("h2", {
    "data-layer": "titular",
    style: {
      margin: "28px 0 0",
      fontSize: "var(--type-titular-size)",
      fontWeight: 700,
      lineHeight: 1.08,
      letterSpacing: "-0.01em",
      color: "var(--text-heading-dark)",
      textWrap: "pretty"
    }
  }, titular || "[Titular de hasta doce palabras, sentence case]"), /*#__PURE__*/React.createElement("p", {
    "data-layer": "cuerpo",
    style: {
      margin: "40px 0 0",
      maxWidth: 740,
      fontSize: "var(--type-cuerpo-size)",
      fontWeight: 400,
      lineHeight: 1.4,
      color: "var(--text-body-dark)",
      textWrap: "pretty"
    }
  }, cuerpo || "[Cuerpo de hasta veinticuatro palabras. Explica el punto en lenguaje llano, sin arquitectura técnica: qué deja de hacer el equipo a partir de mañana.]")), /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    tone: "oscuro",
    icon: "check",
    montado: true,
    style: {
      position: "absolute",
      left: -44,
      bottom: 340
    }
  }, chip || "[dato de apoyo]"));
}
Object.assign(__ds_scope, { LayoutPunto });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/plantilla-redes/LayoutPunto.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Glow = __ds_scope.Glow;

__ds_ns.GradientText = __ds_scope.GradientText;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.CardInvertida = __ds_scope.CardInvertida;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Fuente = __ds_scope.Fuente;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Numeracion = __ds_scope.Numeracion;

__ds_ns.FeedFrame = __ds_scope.FeedFrame;

__ds_ns.SafeZones = __ds_scope.SafeZones;

__ds_ns.StoryFrame = __ds_scope.StoryFrame;

__ds_ns.WhatsAppMock = __ds_scope.WhatsAppMock;

__ds_ns.LayoutCifra = __ds_scope.LayoutCifra;

__ds_ns.LayoutCta = __ds_scope.LayoutCta;

__ds_ns.LayoutHook = __ds_scope.LayoutHook;

__ds_ns.LayoutProducto = __ds_scope.LayoutProducto;

__ds_ns.LayoutPunto = __ds_scope.LayoutPunto;

})();
