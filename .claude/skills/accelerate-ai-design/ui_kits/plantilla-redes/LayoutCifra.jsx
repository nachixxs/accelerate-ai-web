import React from "react";
import { FeedFrame } from "../../components/layout/FeedFrame.jsx";
import { Glow } from "../../components/brand/Glow.jsx";
import { CardInvertida } from "../../components/core/CardInvertida.jsx";
import { Chip } from "../../components/core/Chip.jsx";
import { Fuente } from "../../components/core/Fuente.jsx";

/* LAYOUT D — CIFRA · fondo claro.
   Card invertida en la mitad superior, cifra a 200px en #5be3f3, label debajo,
   fuente citada al pie, chip montado sobre el borde inferior de la card y una
   línea de 32px que explica el resultado en lenguaje llano.
   NINGÚN NÚMERO SIN FUENTE CITADA INLINE. */
export function LayoutCifra({ cifra, label, fuente, chip, remate, glowTone = "azul", index = 4, total = 5, guias = false, scale = 1, assetBase = "" }) {
  return (
    <FeedFrame fondo="claro" index={index} total={total} guias={guias} scale={scale} assetBase={assetBase}>
      <Glow tone={glowTone} fondo="claro" corner="top-left" size={900} />
      <CardInvertida style={{ position: "absolute", left: 90, right: -56, top: 260, padding: "72px 80px 64px" }}>
        <div data-layer="cifra" style={{ fontSize: "var(--type-gigante-size)", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em", color: "var(--cyan-300)" }}>
          {cifra || "00%"}
        </div>
        <div data-layer="label" style={{ marginTop: 18, maxWidth: 660, fontSize: "var(--type-label-size)", fontWeight: 500, lineHeight: 1.3, color: "var(--text-body-light)" }}>
          {label || "[label de la cifra, 40px]"}
        </div>
        <Fuente fondo="oscuro" style={{ marginTop: 40 }}>{fuente || "[Fuente: dato citado inline — obligatorio]"}</Fuente>
        <Chip tone="acento" icon="trending-up" montado style={{ position: "absolute", bottom: -34, left: 80 }}>
          {chip || "[chip-stat]"}
        </Chip>
      </CardInvertida>
      <p data-layer="cuerpo" style={{ position: "absolute", left: 90, right: 200, bottom: 300, margin: 0, fontSize: "var(--type-cuerpo-size)", fontWeight: 400, lineHeight: 1.4, color: "var(--text-body-dark)", textWrap: "pretty" }}>
        {remate || "[Una línea de 32px que traduce la cifra a un resultado concreto para el dueño de la pyme.]"}
      </p>
    </FeedFrame>
  );
}
