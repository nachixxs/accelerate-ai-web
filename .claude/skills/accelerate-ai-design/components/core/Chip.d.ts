/**
 * Pill de dato o etiqueta. Con montado={true} obtiene sombra propia y se coloca
 * a caballo del borde de una card — mitad adentro, mitad afuera. Esa superposición
 * es obligatoria: al menos un elemento por pieza cruza el borde de otro.
 */
export interface ChipProps {
  children?: React.ReactNode;
  /** Superficie. Default "claro". */
  tone?: "claro" | "oscuro" | "acento";
  /** Ícono de Lucide a la izquierda. */
  icon?: string;
  /** Añade sombra propia para montarlo sobre el borde de una card. Default false. */
  montado?: boolean;
  /** "feed" = escala 1080px · "compact" para specimens. Default "feed". */
  size?: "feed" | "compact";
  style?: React.CSSProperties;
}
export declare function Chip(props: ChipProps): JSX.Element;
