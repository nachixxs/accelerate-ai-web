import React from "react";
import { FeedFrame } from "../../components/layout/FeedFrame.jsx";
import { Glow } from "../../components/brand/Glow.jsx";
import { Eyebrow } from "../../components/brand/Eyebrow.jsx";
import { GradientText } from "../../components/brand/GradientText.jsx";
import { Icon } from "../../components/core/Icon.jsx";

/* LAYOUT A — HOOK · fondo oscuro.
   Glow azul + cian desde una esquina. Eyebrow arriba. Hook alineado a la
   izquierda en el tercio central-inferior. Chevron a la derecha. Texto a
   sangre, sin card. Nada centrado. */
export function LayoutHook({ eyebrow, hook, destacado, index = 1, total = 5, guias = false, scale = 1, assetBase = "" }) {
  return (
    <FeedFrame fondo="oscuro" piezaLogo="imagotipo" index={index} total={total} guias={guias} scale={scale} assetBase={assetBase}>
      <Glow tone="azul" corner="top-right" size={1180} />
      <Glow tone="cian" corner="top-right" size={860} />
      <div style={{ position: "absolute", left: 90, top: 236 }}>
        <Eyebrow fondo="oscuro">{eyebrow || "[eyebrow · 24px · mayúsculas]"}</Eyebrow>
      </div>
      <h1
        data-layer="hook"
        style={{ position: "absolute", left: 90, right: 190, bottom: 296, margin: 0, fontSize: "var(--type-hook-size)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em", color: "var(--text-heading-light)", textWrap: "pretty" }}
      >
        {hook || "[Hook de hasta ocho palabras]"}
        {destacado ? <React.Fragment> <GradientText>{destacado}</GradientText></React.Fragment> : null}
      </h1>
      <Icon name="chevron-right" size={48} color="var(--text-heading-light)" style={{ position: "absolute", right: 66, bottom: 430, opacity: 0.6 }} />
    </FeedFrame>
  );
}
