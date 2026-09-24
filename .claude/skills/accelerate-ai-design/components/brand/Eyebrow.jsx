import React from "react";

export function Eyebrow({ children, fondo = "claro", style, ...rest }) {
  return (
    <div
      data-layer="eyebrow"
      style={{
        fontFamily: "var(--font-core)",
        fontSize: "var(--type-eyebrow-size)",
        fontWeight: "var(--type-eyebrow-weight)",
        letterSpacing: "var(--type-eyebrow-ls)",
        textTransform: "uppercase",
        color: fondo === "oscuro" ? "var(--brand-accent)" : "var(--brand-primary-deep)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
