// Sitemap estático, sin @astrojs/sitemap: son dos páginas. Las URL salen del `site` de astro.config.mjs
// y las páginas, de src/pages (sin las rutas con parámetros, como la plantilla del OG).
import type { APIRoute } from 'astro';

const paginas = Object.keys(import.meta.glob('./*.astro'))
	.filter((archivo) => !archivo.includes('[') && archivo !== './404.astro')
	.map((archivo) => archivo.slice(2, -'.astro'.length))
	.map((nombre) => (nombre === 'index' ? '/' : `/${nombre}/`));

export const GET: APIRoute = ({ site }) => {
	const urls = paginas.map((ruta) => `\t<url><loc>${new URL(ruta, site)}</loc></url>`).join('\n');
	return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
};
