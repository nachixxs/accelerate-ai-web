/**
 * Las tres piezas de identidad de Accelerate.ai en sus dos fondos (seis combinaciones).
 * A más espacio, más detalle: isotipo (la "A" sola) · imagotipo (la "A" fundida con
 * "ccelerate.ai", con las capas de movimiento) · logotipo (la misma forma en un solo
 * color, para espacios chicos).
 * Cuando no hay espacio NO se achica el imagotipo: se cambia a logotipo. Son piezas
 * distintas para escalas distintas, no versiones de lo mismo.
 */
export interface LogoProps {
  /** Pieza de identidad. Default "imagotipo". */
  pieza?: "isotipo" | "imagotipo" | "logotipo";
  /** Fondo sobre el que se apoya. "azul" = fondo claro · "claro" = fondo oscuro. Default "azul". */
  fondo?: "azul" | "claro";
  /** Ancho en px; el alto sale de la relación de aspecto del archivo. Default 320 (imagotipo) · 240 (logotipo) · 120 (isotipo). Mínimo imagotipo: 280. */
  width?: number;
  /** Prefijo de ruta a assets/ cuando la pieza se renderiza desde un subdirectorio. */
  assetBase?: string;
  style?: React.CSSProperties;
}
export declare function Logo(props: LogoProps): JSX.Element;

/**
 * Avatar cuadrado de redes: el isotipo sobre lienzo 1000×1000 con margen de seguridad
 * de 15,5% por lado, para que el recorte circular de las plataformas no coma nada.
 */
export interface AvatarProps {
  /** "azul" = lienzo blanco · "claro" = lienzo #0b1220. Default "azul". */
  fondo?: "azul" | "claro";
  /** Lado en px. Default 160. */
  size?: number;
  assetBase?: string;
  style?: React.CSSProperties;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
