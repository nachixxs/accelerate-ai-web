/**
 * Línea de contexto arriba del titular. Es la ÚNICA excepción a la regla de sentence case:
 * el eyebrow va en mayúsculas, 24px, SemiBold, tracking 8%.
 */
export interface EyebrowProps {
  children?: React.ReactNode;
  /** Fondo de la pieza. "oscuro" → cian · "claro" → azul profundo. Default "claro". */
  fondo?: "claro" | "oscuro";
  style?: React.CSSProperties;
}
export declare function Eyebrow(props: EyebrowProps): JSX.Element;
