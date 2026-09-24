// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
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
});
