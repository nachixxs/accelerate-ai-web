import React from "react";
import { Icon } from "./Icon.jsx";

/* El CTA es el único lugar del sistema donde aparece #2971f2 a máxima
   saturación, una sola vez por pieza o carrusel. */
const LABELS_OK = ["Escribinos por WhatsApp", "Agendá una llamada"];

export function Button({ children, icon, size = "feed", style, ...rest }) {
  if (typeof children === "string" && !LABELS_OK.includes(children)) {
    console.warn('[Button] El CTA de marca es verbo + canal concreto: "Escribinos por WhatsApp" o "Agendá una llamada". Nunca "Empezar" ni "Saber más". Recibido: "' + children + '"');
  }
  const compact = size === "compact";
  return (
    <button
      type="button"
      data-layer="boton-cta"
      style={{
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
        ...style,
      }}
      {...rest}
    >
      {children}
      {icon ? <Icon name={icon} size={compact ? 24 : 40} /> : null}
    </button>
  );
}
