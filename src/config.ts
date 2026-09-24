// El único objetivo de la página (SPECS §1 y §5): abrir WhatsApp con el mensaje ya escrito.
const WHATSAPP_NUMERO = '5492625634845';
const WHATSAPP_MENSAJE = 'Hola, vi la web y quiero la auditoría gratis.';

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_MENSAJE)}`;
