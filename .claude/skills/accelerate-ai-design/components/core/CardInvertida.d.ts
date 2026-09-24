/**
 * El único contenedor permitido sobre fondo claro: #111b30, radius 28.
 * Una card blanca sobre #f7f9fc se lee como una superficie plana, así que cuando
 * hace falta contenedor va invertida. Máximo UN elemento invertido por pieza clara,
 * y sólo entre un tercio y la mitad de las piezas claras lo llevan.
 */
export interface CardInvertidaProps {
  children?: React.ReactNode;
  /** "lg" = 28px · "md" = 22px. Default "lg". */
  radius?: "lg" | "md";
  /** Padding interno en px. Default 64. */
  padding?: number;
  style?: React.CSSProperties;
}
export declare function CardInvertida(props: CardInvertidaProps): JSX.Element;
