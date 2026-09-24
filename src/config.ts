// El único objetivo de la página (SPECS §1 y §5): abrir WhatsApp con el mensaje ya escrito.
const WHATSAPP_NUMERO = '5492625634845';
export const WHATSAPP_NUMERO_VISIBLE = '+54 9 2625 63-4845';
export const WHATSAPP_MENSAJE = 'Hola, vi la web y quiero la auditoría gratis.';

// Cada botón puede abrir WhatsApp con su propio mensaje, según la sección donde está: así la
// charla arranca por el tema que le interesó a quien escribe.
export const whatsappUrl = (mensaje = WHATSAPP_MENSAJE) =>
	`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;

export const WHATSAPP_URL = whatsappUrl();

// Los mails de los dos socios, para el pie. El WhatsApp sigue siendo el contacto principal.
export const EMAILS = [
	{ nombre: 'Ignacio', email: 'ignacionogpa@gmail.com' },
	{ nombre: 'Gabriel', email: 'ggil24761@gmail.com' },
];
