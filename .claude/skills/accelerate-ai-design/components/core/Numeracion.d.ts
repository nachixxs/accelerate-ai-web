/**
 * Numeración de carrusel "01/05". Va abajo a la izquierda, a 150px del borde
 * inferior (fuera de la zona insegura de 120px) y alineada al margen de 90px.
 * FeedFrame ya la coloca cuando se le pasan index/total.
 */
export interface NumeracionProps {
  /** Posición de la slide, 1-based. Default 1. */
  index?: number;
  /** Total de slides de la serie. Default 5. */
  total?: number;
  fondo?: "claro" | "oscuro";
  style?: React.CSSProperties;
}
export declare function Numeracion(props: NumeracionProps): JSX.Element;
