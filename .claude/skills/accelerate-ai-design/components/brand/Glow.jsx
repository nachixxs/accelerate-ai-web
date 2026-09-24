import React from "react";

const CORNERS = {
  "top-left":     (w, h) => ({ top: -h * 0.42, left: -w * 0.34, rotate: "-18deg" }),
  "top-right":    (w, h) => ({ top: -h * 0.45, right: -w * 0.3, rotate: "14deg" }),
  "bottom-left":  (w, h) => ({ bottom: -h * 0.4, left: -w * 0.36, rotate: "22deg" }),
  "bottom-right": (w, h) => ({ bottom: -h * 0.46, right: -w * 0.32, rotate: "-12deg" }),
};

export function Glow({ tone = "azul", fondo = "oscuro", corner = "top-left", size = 1000, opacity, style, ...rest }) {
  const w = size;
  const h = size * 0.72;
  const pos = (CORNERS[corner] || CORNERS["top-left"])(w, h);
  const claro = fondo === "claro";
  const bg = claro
    ? (tone === "cian" ? "var(--glow-claro-cian)" : "var(--glow-claro-azul)")
    : (tone === "cian" ? "var(--glow-cian)" : "var(--glow-azul)");
  const { rotate, ...place } = pos;
  return (
    <div
      aria-hidden="true"
      data-layer={tone === "cian" ? "glow-cian" : "glow-azul"}
      style={{
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
        ...style,
      }}
      {...rest}
    />
  );
}
