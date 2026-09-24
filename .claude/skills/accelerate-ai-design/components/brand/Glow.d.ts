/**
 * El recurso de iluminación de la marca: elipse irregular con blur 90, entrando
 * desde una esquina y a medias fuera del frame. Nunca centrada, nunca simétrica.
 * Fondo oscuro = azul al 50% + cian al 20% (dos Glow apilados).
 * Fondo claro = UNA sola elipse al 12-18%, alternando azul y cian entre piezas consecutivas.
 */
export interface GlowProps {
  /** Tinte. Default "azul". */
  tone?: "azul" | "cian";
  /** Fondo de la pieza: define la opacidad base. Default "oscuro". */
  fondo?: "oscuro" | "claro";
  /** Esquina de entrada. Default "top-left". */
  corner?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Ancho de la elipse en px (alto = size × 0.72). Default 1000. */
  size?: number;
  /** Override de opacidad. */
  opacity?: number;
  style?: React.CSSProperties;
}
export declare function Glow(props: GlowProps): JSX.Element;
