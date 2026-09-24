import React from "react";

export function CardInvertida({ children, radius = "lg", padding = 64, style, ...rest }) {
  return (
    <div
      data-layer="card-invertida"
      style={{
        position: "relative",
        background: "var(--surface-card-dark)",
        color: "var(--text-body-light)",
        borderRadius: radius === "lg" ? "var(--radius-card-lg)" : "var(--radius-card)",
        boxShadow: "var(--shadow-card)",
        padding,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
