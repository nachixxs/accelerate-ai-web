/**
 * CTA primario. Fill #2971f2, radius 999px, sombra de botón. Es el único elemento
 * que usa el azul a máxima saturación y aparece UNA vez por pieza o carrusel.
 * El texto es verbo + canal concreto: "Escribinos por WhatsApp" o "Agendá una llamada".
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** Nombre de ícono de Lucide a la derecha del texto. */
  icon?: string;
  /** "feed" = escala 1080px (40px de texto) · "compact" para UI y specimens. Default "feed". */
  size?: "feed" | "compact";
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
