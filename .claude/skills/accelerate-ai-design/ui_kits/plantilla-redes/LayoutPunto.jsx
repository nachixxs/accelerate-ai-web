import React from "react";
import { FeedFrame } from "../../components/layout/FeedFrame.jsx";
import { Glow } from "../../components/brand/Glow.jsx";
import { Eyebrow } from "../../components/brand/Eyebrow.jsx";
import { Chip } from "../../components/core/Chip.jsx";
import { Icon } from "../../components/core/Icon.jsx";

/* LAYOUT B — PUNTO · fondo claro.
   Un solo glow al 14%, esquina alternada. Texto a sangre, SIN card blanca.
   El espacio negativo cae arriba a la derecha. El chip cruza el margen izquierdo. */
export function LayoutPunto({ eyebrow, titular, cuerpo, chip, icono = "clock", glowTone = "cian", glowCorner = "bottom-right", index = 2, total = 5, guias = false, scale = 1, assetBase = "" }) {
  return (
    <FeedFrame fondo="claro" index={index} total={total} guias={guias} scale={scale} assetBase={assetBase}>
      <Glow tone={glowTone} fondo="claro" corner={glowCorner} size={980} />
      <Icon name={icono} size={96} color="var(--brand-primary-deep)" style={{ position: "absolute", left: 90, top: 300 }} />
      <div style={{ position: "absolute", left: 90, right: 150, top: 470 }}>
        <Eyebrow>{eyebrow || "[eyebrow]"}</Eyebrow>
        <h2 data-layer="titular" style={{ margin: "28px 0 0", fontSize: "var(--type-titular-size)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.01em", color: "var(--text-heading-dark)", textWrap: "pretty" }}>
          {titular || "[Titular de hasta doce palabras, sentence case]"}
        </h2>
        <p data-layer="cuerpo" style={{ margin: "40px 0 0", maxWidth: 740, fontSize: "var(--type-cuerpo-size)", fontWeight: 400, lineHeight: 1.4, color: "var(--text-body-dark)", textWrap: "pretty" }}>
          {cuerpo || "[Cuerpo de hasta veinticuatro palabras. Explica el punto en lenguaje llano, sin arquitectura técnica: qué deja de hacer el equipo a partir de mañana.]"}
        </p>
      </div>
      <Chip tone="oscuro" icon="check" montado style={{ position: "absolute", left: -44, bottom: 340 }}>
        {chip || "[dato de apoyo]"}
      </Chip>
    </FeedFrame>
  );
}
