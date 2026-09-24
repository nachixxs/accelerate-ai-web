/**
 * Fill de texto con el gradiente 90° #2971f2 → #22d3ee. El recurso más distintivo
 * de la marca y por eso el más racionado: una o dos apariciones por carrusel, nunca más.
 * Se aplica a una palabra o a una línea, no a un párrafo.
 */
export interface GradientTextProps {
  children?: React.ReactNode;
  /** Etiqueta a renderizar. Default "span". */
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}
export declare function GradientText(props: GradientTextProps): JSX.Element;
