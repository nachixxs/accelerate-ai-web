import React from "react";

/* El producto SIEMPRE se muestra con este mock. Nunca con íconos genéricos
   de "imagen" ni con fotografía de stock.
   El tilde de enviado es el único vector dibujado a mano del sistema: es
   producto, no interfaz. */
function Tilde({ color }) {
  return (
    <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true" style={{ display: "block" }}>
      <path d="M1 8.2 4.6 12 12.4 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.6 8.2 12.2 12 20 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Burbuja({ from, text, hora, bleed }) {
  const enviada = from === "enviada";
  return (
    <div
      data-layer={"burbuja-" + from}
      style={{
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
        boxShadow: bleed ? "var(--shadow-elevada)" : "none",
      }}
    >
      <div>{text}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, marginTop: 12, fontSize: 20, fontWeight: 500, color: enviada ? "rgba(234,241,255,.72)" : "var(--text-muted-light)" }}>
        <span>{hora}</span>
        {enviada ? <Tilde color="var(--cyan-300)" /> : null}
      </div>
    </div>
  );
}

export function WhatsAppMock({ mensajes = [], chip = null, width = 760, style, ...rest }) {
  return (
    <div data-layer="mock-whatsapp" style={{ position: "relative", width, ...style }} {...rest}>
      <div
        style={{
          position: "relative",
          background: "var(--surface-card-dark)",
          border: "1px solid var(--border-dark)",
          borderRadius: "var(--radius-card-lg)",
          boxShadow: "var(--shadow-card)",
          padding: "48px 56px 56px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {mensajes.map((m, i) => (
          <Burbuja key={i} from={m.from} text={m.text} hora={m.hora} bleed={i === mensajes.length - 1} />
        ))}
      </div>
      {chip}
    </div>
  );
}
