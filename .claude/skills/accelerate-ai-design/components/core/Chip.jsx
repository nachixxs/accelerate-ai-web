import React from "react";
import { Icon } from "./Icon.jsx";

const TONES = {
  claro:  { bg: "var(--white)", fg: "var(--brand-primary-deep)", border: "1px solid var(--border-light)" },
  oscuro: { bg: "var(--surface-card-dark)", fg: "var(--brand-accent)", border: "1px solid var(--border-dark)" },
  acento: { bg: "var(--cyan-300)", fg: "var(--navy-950)", border: "none" },
};

export function Chip({ children, tone = "claro", icon, montado = false, size = "feed", style, ...rest }) {
  const t = TONES[tone] || TONES.claro;
  const compact = size === "compact";
  return (
    <span
      data-layer={montado ? "chip-stat" : "chip"}
      style={{
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
        ...style,
      }}
      {...rest}
    >
      {icon ? <Icon name={icon} size={compact ? 16 : 30} /> : null}
      {children}
    </span>
  );
}
