import React from "react";
import { FeedFrame } from "../../components/layout/FeedFrame.jsx";
import { Glow } from "../../components/brand/Glow.jsx";
import { Eyebrow } from "../../components/brand/Eyebrow.jsx";
import { Chip } from "../../components/core/Chip.jsx";
import { WhatsAppMock } from "../../components/producto/WhatsAppMock.jsx";

/* LAYOUT C — PRODUCTO · fondo claro u oscuro.
   Mock de WhatsApp. La última burbuja cruza el borde de la card; un chip pill
   va montado sobre el borde opuesto, mitad adentro mitad afuera, con sombra propia. */
const DEFAULT_MSGS = [
  { from: "recibida", text: "[mensaje que entra por WhatsApp]", hora: "9:38" },
  { from: "enviada", text: "[respuesta automática del flujo]", hora: "9:38" },
];

export function LayoutProducto({ eyebrow, titular, mensajes, chip, fondo = "oscuro", index = 3, total = 5, guias = false, scale = 1, assetBase = "" }) {
  const oscuro = fondo === "oscuro";
  return (
    <FeedFrame fondo={fondo} index={index} total={total} guias={guias} scale={scale} assetBase={assetBase}>
      <Glow tone="azul" corner="bottom-right" size={1100} fondo={oscuro ? "oscuro" : "claro"} />
      {oscuro ? <Glow tone="cian" corner="bottom-right" size={780} /> : null}
      <div style={{ position: "absolute", left: 90, right: 200, top: 230 }}>
        <Eyebrow fondo={oscuro ? "oscuro" : "claro"}>{eyebrow || "[eyebrow]"}</Eyebrow>
        <h2 data-layer="titular" style={{ margin: "26px 0 0", fontSize: "var(--type-titular-size)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.01em", color: oscuro ? "var(--text-heading-light)" : "var(--text-heading-dark)", textWrap: "pretty" }}>
          {titular || "[Titular corto que nombra el resultado]"}
        </h2>
      </div>
      <div style={{ position: "absolute", left: 200, top: 600 }}>
        <WhatsAppMock
          width={790}
          mensajes={mensajes || DEFAULT_MSGS}
          chip={
            <Chip tone="acento" icon="zap" montado style={{ position: "absolute", top: -34, left: -68 }}>
              {chip || "[tiempo de respuesta]"}
            </Chip>
          }
        />
      </div>
    </FeedFrame>
  );
}
