/**
 * Lienzo de feed 1080×1350 (carrusel y placa). Pone el logo arriba a la izquierda
 * sobre el margen de 90px y la numeración "01/05" abajo a la izquierda a 150px del borde.
 * Máximo DOS fondos por serie: claro (#f7f9fc) para desarrollo, oscuro (#0b1220)
 * para hook y cierre. Ningún tercero.
 */
export interface FeedFrameProps {
  children?: React.ReactNode;
  /** Fondo de la pieza. Default "claro". */
  fondo?: "claro" | "oscuro";
  /** Muestra el logo arriba a la izquierda. Default true. */
  logo?: boolean;
  /** Pieza de identidad a usar en el header. Default "logotipo". */
  piezaLogo?: "isotipo" | "imagotipo" | "logotipo";
  /** Posición en la serie, 1-based. Omitir para una placa suelta. */
  index?: number;
  /** Total de slides de la serie. */
  total?: number;
  /** Superpone las guías de zona segura. Default false. */
  guias?: boolean;
  /** Escala de previsualización (1 = tamaño real de export). Default 1. */
  scale?: number;
  /** Prefijo de ruta a assets/ si la pieza vive en un subdirectorio. */
  assetBase?: string;
  style?: React.CSSProperties;
}
export declare function FeedFrame(props: FeedFrameProps): JSX.Element;
