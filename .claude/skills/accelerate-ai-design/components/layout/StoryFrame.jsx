import React from "react";
import { Logo } from "../brand/Logo.jsx";
import { SafeZones } from "./SafeZones.jsx";

export function StoryFrame({ children, fondo = "oscuro", logo = true, piezaLogo = "logotipo", guias = false, scale = 1, assetBase = "", style, ...rest }) {
  const oscuro = fondo === "oscuro";
  return (
    <div style={{ width: 1080 * scale, height: 1920 * scale, flex: "none" }}>
      <div
        data-formato="historia"
        style={{
          position: "relative",
          width: 1080,
          height: 1920,
          overflow: "hidden",
          background: oscuro ? "var(--surface-dark)" : "var(--surface-alt)",
          fontFamily: "var(--font-core)",
          transform: scale === 1 ? undefined : "scale(" + scale + ")",
          transformOrigin: "top left",
          ...style,
        }}
        {...rest}
      >
        {children}
        {logo ? (
          <div style={{ position: "absolute", top: 290, left: 90 }}>
            <Logo pieza={piezaLogo} fondo={oscuro ? "claro" : "azul"} width={piezaLogo === "isotipo" ? 72 : piezaLogo === "imagotipo" ? 320 : 240} assetBase={assetBase} />
          </div>
        ) : null}
        {guias ? <SafeZones formato="historia" /> : null}
      </div>
    </div>
  );
}
