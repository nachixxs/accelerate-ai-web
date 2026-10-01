// Las tres pantallas de la app de la demo. Las capturas son 720x1560 (src/assets/trabajo/): se pisan
// con las reales sin tocar CSS. `pose` es el lugar inicial en el escenario (el asistente, al frente).
import cargaRapida from '../../assets/trabajo/carga-rapida.png';
import arqueo from '../../assets/trabajo/arqueo.png';
import asistente from '../../assets/trabajo/asistente.png';

export const pantallas = [
	{
		id: 'carga', pose: 'der', img: cargaRapida, icono: 'lightning-duotone', corto: 'Carga', momento: 'Mientras atendés', nombre: 'Carga rápida',
		texto: 'Fiado, cobro, pago o premio, en dos toques desde el celular.',
		alt: 'Pantalla de carga rápida de la app: cuatro botones grandes para registrar un fiado, un cobro, un pago o un premio.',
	},
	{
		id: 'arqueo', pose: 'izq', img: arqueo, icono: 'scales-duotone', corto: 'Arqueo', momento: 'Al cerrar la caja', nombre: 'Arqueo',
		texto: 'Cargás lo que contaste y te dice al instante si cierra o de cuánto es la diferencia.',
		alt: 'Pantalla de arqueo de la app: dos campos para el efectivo y las boletas contados, y el resultado, que cierra o muestra la diferencia.',
	},
	{
		id: 'asistente', pose: 'frente', img: asistente, icono: 'chat-circle-text-duotone', corto: 'Asistente', momento: 'Si no cuadra', nombre: 'Asistente',
		texto: 'Le preguntás «¿por qué no cuadra?» y te dice qué movimiento mirar. Solo consulta: no carga ni cambia nada.',
		alt: 'Chat del asistente de la app: una pregunta sobre un arqueo que no cuadra y la respuesta que señala qué movimiento revisar.',
	},
];
