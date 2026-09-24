// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// URL pública del sitio: con ella se arman las URL completas de las etiquetas Open Graph,
// que WhatsApp necesita para mostrar la imagen. PROVISORIA hasta decidir el dominio
// (ESTADO.md, pendiente 3): .example es un dominio reservado que no existe.
const SITIO = 'https://accelerate-ai.example';

// https://astro.build/config
export default defineConfig({
	site: SITIO,
	// El minificador por defecto (Lightning CSS) junta animation-timeline adentro del shorthand
	// `animation`, y Chrome descarta esa declaración entera: se perdían todas las animaciones
	// atadas al scroll. esbuild deja las propiedades separadas.
	vite: {
		build: {
			cssMinify: 'esbuild',
		},
	},
	// Archivo es la única familia de la marca. Astro la baja de Google en el build
	// y la sirve desde el propio sitio, con un fallback de métricas ajustadas.
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Archivo',
			cssVariable: '--font-archivo',
			weights: [400, 500, 600, 700, 800],
			styles: ['normal'],
			subsets: ['latin'],
		},
	],
	integrations: [
		{
			name: 'aviso-dominio-provisorio',
			hooks: {
				'astro:build:done': ({ logger }) => {
					if (SITIO.endsWith('.example')) {
						logger.warn(`El dominio es provisorio (${SITIO}): la vista previa de WhatsApp no va a funcionar hasta cambiarlo en astro.config.mjs.`);
					}
				},
			},
		},
	],
});
