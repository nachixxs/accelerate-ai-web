import React from "react";

export function Fuente({ children, fondo = "claro", style, ...rest }) {
  return (
    <div
      data-layer="fuente"
      style={{
        fontFamily: "var(--font-core)",
        fontSize: "var(--type-meta-size)",
        fontWeight: "var(--type-meta-weight)",
        color: fondo === "oscuro" ? "var(--text-muted-light)" : "var(--text-muted-dark)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
