// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import { DOMINIO, PROVISORIO, SITIO } from './src/dominio.mjs';
// SITIO (la URL pública) arma las URL completas de Open Graph, que WhatsApp necesita para mostrar
// la imagen. El dominio se cambia en un solo lugar: src/dominio.mjs.

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
	// Todo el CSS adentro del HTML: se ahorra el viaje de red que bloquea el primer pintado
	// (una landing de una sola visita no se beneficia de cachear el CSS aparte).
	build: {
		inlineStylesheets: 'always',
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
					if (PROVISORIO) {
						logger.warn(`El dominio es provisorio (${DOMINIO}): la vista previa de WhatsApp no va a funcionar y /legal tiene marcadores ([MAIL]) que no se pueden publicar. Se cambia en un solo lugar: DOMINIO en src/dominio.mjs.`);
					}
				},
			},
		},
	],
});
