/**
 * Cita de fuente al pie de una cifra, 22px. Regla dura del sistema:
 * NINGÚN NÚMERO SIN FUENTE CITADA INLINE. Si no hay fuente, no va el número.
 */
export interface FuenteProps {
  children?: React.ReactNode;
  fondo?: "claro" | "oscuro";
  style?: React.CSSProperties;
}
export declare function Fuente(props: FuenteProps): JSX.Element;
