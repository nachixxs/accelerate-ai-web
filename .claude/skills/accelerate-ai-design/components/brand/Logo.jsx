import React from "react";

/* Las tres piezas de identidad son archivos de marca: se usan tal cual, no se
   redibujan ni se recomponen. Los originales entregados son PNG a 263px de alto
   (sólo las variantes azules); las variantes para fondo oscuro se generaron
   recoloreando capa por capa e invirtiendo el orden de luminancia — nunca con
   un fill blanco. Ningún elemento usa #ffffff puro. */
const SRC = (pieza, fondo) => "assets/identidad/" + pieza + "-" + fondo + ".png";

/* relación de aspecto real de cada archivo recortado */
const AR = { isotipo: 240 / 167, imagotipo: 962 / 168, logotipo: 922 / 168 };
const DEFAULT_W = { isotipo: 120, imagotipo: 320, logotipo: 240 };
const MIN_IMAGOTIPO = 280;

export function Logo({ pieza = "imagotipo", fondo = "azul", width, assetBase = "", style, ...rest }) {
  const w = width || DEFAULT_W[pieza] || 320;

  if (pieza === "imagotipo" && w < MIN_IMAGOTIPO) {
    console.warn("[Logo] imagotipo por debajo de su ancho mínimo (" + MIN_IMAGOTIPO + "px): usá pieza=\"logotipo\" en lugar de achicarlo.");
  }

  return (
    <img
      data-layer="logo"
      src={assetBase + SRC(pieza, fondo)}
      alt={"Accelerate.ai — " + pieza}
      width={Math.round(w)}
      height={Math.round(w / AR[pieza])}
      style={{ width: w, height: w / AR[pieza], display: "block", ...style }}
      {...rest}
    />
  );
}

/* Avatar cuadrado: lienzo 1000×1000 con el isotipo dentro del margen de
   seguridad de 15,5% por lado, para que el recorte circular de redes no coma nada. */
export function Avatar({ fondo = "azul", size = 160, assetBase = "", style, ...rest }) {
  return (
    <img
      data-layer="avatar"
      src={assetBase + "assets/identidad/avatar-" + fondo + ".png"}
      alt="Accelerate.ai"
      width={size}
      height={size}
      style={{ width: size, height: size, display: "block", ...style }}
      {...rest}
    />
  );
}
