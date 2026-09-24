import React from "react";

export function Numeracion({ index = 1, total = 5, fondo = "claro", style, ...rest }) {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <span
      data-layer="numeracion"
      style={{
        fontFamily: "var(--font-core)",
        fontSize: "var(--type-meta-size)",
        fontWeight: "var(--type-meta-weight)",
        letterSpacing: "0.04em",
        color: fondo === "oscuro" ? "var(--text-muted-light)" : "var(--text-muted-dark)",
        ...style,
      }}
      {...rest}
    >
      {pad(index) + "/" + pad(total)}
    </span>
  );
}
