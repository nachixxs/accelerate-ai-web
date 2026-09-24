import React from "react";
import { Logo } from "../brand/Logo.jsx";
import { Numeracion } from "../core/Numeracion.jsx";
import { SafeZones } from "./SafeZones.jsx";

export function FeedFrame({ children, fondo = "claro", logo = true, piezaLogo = "logotipo", index, total, guias = false, scale = 1, assetBase = "", style, ...rest }) {
  const oscuro = fondo === "oscuro";
  return (
    <div style={{ width: 1080 * scale, height: 1350 * scale, flex: "none" }}>
      <div
        data-formato="feed"
        style={{
          position: "relative",
          width: 1080,
          height: 1350,
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
          <div style={{ position: "absolute", top: 90, left: 90 }}>
            <Logo pieza={piezaLogo} fondo={oscuro ? "claro" : "azul"} width={piezaLogo === "isotipo" ? 72 : piezaLogo === "imagotipo" ? 320 : 240} assetBase={assetBase} />
          </div>
        ) : null}
        {index ? (
          <div style={{ position: "absolute", left: 90, bottom: 150 }}>
            <Numeracion index={index} total={total} fondo={oscuro ? "oscuro" : "claro"} />
          </div>
        ) : null}
        {guias ? <SafeZones formato="feed" /> : null}
      </div>
    </div>
  );
}
