/**
 * Ícono de Lucide (única familia permitida), teñido con el color que se le pase.
 * Tamaños del sistema: 40-56px dentro de una card · 72-96px si encabeza la pieza.
 * Sobre fondo claro usa #1f57c2, sobre fondo oscuro #22d3ee — nunca #2971f2,
 * que está reservado al CTA primario.
 */
export interface IconProps {
  /** Nombre kebab-case del ícono de Lucide, p. ej. "chevron-right", "message-circle". */
  name: string;
  /** Lado en px. Default 48. */
  size?: number;
  /** Color del trazo. Default "currentColor". */
  color?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
