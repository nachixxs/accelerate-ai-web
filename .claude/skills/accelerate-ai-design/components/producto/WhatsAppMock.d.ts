/**
 * Mock de conversación de WhatsApp: la única forma de mostrar el producto.
 * Burbuja recibida gris oscuro a la izquierda, burbuja enviada #1f57c2 a la derecha,
 * con hora y tilde de enviado. La ÚLTIMA burbuja se sale del borde de la card
 * contenedora y lo cruza, con sombra propia — esa profundidad es obligatoria.
 * @startingPoint section="Producto" subtitle="Mock de conversación con burbuja que cruza el borde" viewport="700x520"
 */
export interface WhatsAppMensaje {
  /** Dirección del mensaje. */
  from: "recibida" | "enviada";
  text: string;
  /** Hora corta, p. ej. "9:41". */
  hora: string;
}
export interface WhatsAppMockProps {
  /** Conversación, en orden. 2-4 mensajes: más no se lee en el feed. */
  mensajes?: WhatsAppMensaje[];
  /** Chip montado sobre el borde opuesto al de la burbuja que sangra (posicionalo absolute). */
  chip?: React.ReactNode;
  /** Ancho de la card en px. Default 760. */
  width?: number;
  style?: React.CSSProperties;
}
export declare function WhatsAppMock(props: WhatsAppMockProps): JSX.Element;
