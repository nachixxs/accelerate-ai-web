import React from "react";
import { FeedFrame } from "../../components/layout/FeedFrame.jsx";
import { Glow } from "../../components/brand/Glow.jsx";
import { Button } from "../../components/core/Button.jsx";

/* LAYOUT E — CTA · fondo oscuro.
   Glow desde una esquina distinta a la del hook. Titular arriba, botón abajo,
   aire en el medio. El CTA es el único #2971f2 saturado del carrusel. */
export function LayoutCta({ titular, cta = "Escribinos por WhatsApp", icono = "message-circle", index = 5, total = 5, guias = false, scale = 1, assetBase = "" }) {
  return (
    <FeedFrame fondo="oscuro" piezaLogo="imagotipo" index={index} total={total} guias={guias} scale={scale} assetBase={assetBase}>
      <Glow tone="cian" corner="bottom-left" size={1150} />
      <Glow tone="azul" corner="bottom-left" size={900} />
      <h2 data-layer="titular" style={{ position: "absolute", left: 90, right: 230, top: 300, margin: 0, fontSize: "var(--type-titular-size)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.01em", color: "var(--text-heading-light)", textWrap: "pretty" }}>
        {titular || "[Titular de cierre: el resultado, no el producto]"}
      </h2>
      <div style={{ position: "absolute", left: 90, bottom: 290 }}>
        <Button icon={icono}>{cta}</Button>
      </div>
    </FeedFrame>
  );
}
