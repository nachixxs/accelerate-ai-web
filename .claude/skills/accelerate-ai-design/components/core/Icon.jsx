import React from "react";

/* Lucide exclusivamente, servido desde CDN como máscara CSS para poder
   heredar el color. Está PROHIBIDO dibujar íconos a mano en SVG: si un
   concepto no tiene ícono en Lucide, se cambia el concepto.
   Única excepción del sistema: el tilde de enviado del mock de WhatsApp,
   que es producto y no interfaz (vive en WhatsAppMock). */
const CDN = "https://cdn.jsdelivr.net/npm/lucide-static@1.47.0/icons/";

export function Icon({ name, size = 48, color = "currentColor", style, ...rest }) {
  const url = "url(" + CDN + name + ".svg)";
  return (
    <span
      role="img"
      aria-label={name}
      data-layer={"icono-" + name}
      style={{
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
        ...style,
      }}
      {...rest}
    />
  );
}
