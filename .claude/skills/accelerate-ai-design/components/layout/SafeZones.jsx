import React from "react";

const LINE = "rgba(34,211,238,.9)";
const BAD = "rgba(41,113,242,.14)";

export function SafeZones({ formato = "feed", style, ...rest }) {
  const feed = formato === "feed";
  const w = 1080;
  const h = feed ? 1350 : 1920;
  const label = (text, top, left) => (
    <div key={text + top} style={{ position: "absolute", top, left, fontFamily: "var(--font-core)", fontSize: 20, fontWeight: 600, letterSpacing: "0.04em", color: "var(--cyan-500)", textTransform: "uppercase" }}>{text}</div>
  );
  return (
    <div aria-hidden="true" data-layer="guias" style={{ position: "absolute", inset: 0, width: w, height: h, pointerEvents: "none", ...style }} {...rest}>
      {/* márgenes laterales 90px */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 90, borderLeft: "1px dashed " + LINE }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 90, borderRight: "1px dashed " + LINE }} />
      {feed ? (
        <React.Fragment>
          <div style={{ position: "absolute", left: 0, right: 0, top: 90, borderTop: "1px dashed " + LINE }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, background: BAD, borderTop: "1px solid " + LINE }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, borderTop: "1px dotted rgba(34,211,238,.55)" }} />
          {label("margen superior 90", 100, 104)}
          {label("zona insegura · 120", h - 84, 104)}
          {label("línea de numeración · 150", h - 176, 104)}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 250, background: BAD, borderBottom: "1px solid " + LINE }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 250, background: BAD, borderTop: "1px solid " + LINE }} />
          {label("zona insegura · 0 → 250 · foto de perfil", 200, 104)}
          {label("zona útil · 250 → 1670", 270, 104)}
          {label("zona insegura · 1670 → 1920 · barra de respuesta", h - 230, 104)}
        </React.Fragment>
      )}
      <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(34,211,238,.35)" }} />
    </div>
  );
}
