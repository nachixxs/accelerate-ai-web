/**
 * Overlay de guías: márgenes de 90px y zonas inseguras del formato.
 * Feed 1080×1350 → margen superior 90, últimos 120px inseguros, numeración a 150.
 * Historia 1080×1920 → 0-250 y 1670-1920 inseguros, zona útil 250-1670.
 * Sólo para revisión: no se exporta en la pieza final.
 */
export interface SafeZonesProps {
  /** Formato a guiar. Default "feed". */
  formato?: "feed" | "historia";
  style?: React.CSSProperties;
}
export declare function SafeZones(props: SafeZonesProps): JSX.Element;
