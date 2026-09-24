/**
 * Lienzo de historia y reel 1080×1920. Zona útil 250 → 1670: arriba se la come la
 * foto de perfil, abajo la barra de respuesta. El logo va a 290px del borde superior
 * (dentro de la zona útil) sobre el margen de 90px.
 */
export interface StoryFrameProps {
  children?: React.ReactNode;
  /** Fondo de la pieza. Default "oscuro". */
  fondo?: "claro" | "oscuro";
  logo?: boolean;
  piezaLogo?: "isotipo" | "imagotipo" | "logotipo";
  /** Superpone las guías de zona segura. Default false. */
  guias?: boolean;
  /** Escala de previsualización. Default 1. */
  scale?: number;
  assetBase?: string;
  style?: React.CSSProperties;
}
export declare function StoryFrame(props: StoryFrameProps): JSX.Element;
