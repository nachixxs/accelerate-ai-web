// Chequeos del sitio que no son de una página: la 404 y las cabeceras de Cloudflare Pages.
// Va aparte de capturas.mjs (que está en su techo de líneas) y corre después, con su propio preview.
// - Una ruta que no existe responde 404 con la página propia (sin dist/404.html, Cloudflare Pages
//   trata el sitio como SPA y sirve la portada con 200 en cualquier ruta).
// - La 404 a 360 y 1280: una sola h1, un link a la portada de 44 px o más, sin desborde, sin errores
//   de consola, con noindex y fuera del sitemap.
// - public/_headers llega a dist con caché inmutable para /_astro/* y las cabeceras de seguridad.
import { readFile } from 'node:fs/promises';
import { preview } from 'astro';
import { chromium } from 'playwright';
import { terminarCarga } from './capturas-utils.mjs';

const servidor = await preview({ root: '.', logLevel: 'error' });
const url = `http://localhost:${servidor.port}/`;
const navegador = await chromium.launch();
const chequeos = [];
const chequear = (ok, texto) => chequeos.push([Boolean(ok), texto]);

// La 404, servida por una ruta inexistente.
for (const width of [360, 1280]) {
	const pagina = await navegador.newPage({ viewport: { width, height: 800 } });
	const errores = [];
	pagina.on('console', (m) => m.type() === 'error' && !m.text().includes('404') && errores.push(m.text()));
	pagina.on('pageerror', (e) => errores.push(String(e)));
	const respuesta = await pagina.goto(`${url}esta-ruta-no-existe/`, { waitUntil: 'load' });
	await terminarCarga(pagina);
	const m = await pagina.evaluate(() => {
		const aPortada = [...document.querySelectorAll('main a')].filter((a) => new URL(a.href).pathname === '/');
		return {
			h1: document.querySelectorAll('h1').length,
			titulo: document.querySelector('h1')?.textContent.trim() ?? '',
			// La propia lleva el logo del sitio; la portada (modo SPA) lleva #trabajo; la del preview de Astro, ninguno.
			propia: !!document.querySelector('.logo') && !document.querySelector('#trabajo'),
			altoLink: Math.min(...aPortada.map((a) => a.getBoundingClientRect().height)),
			links: aPortada.length,
			desborde: document.documentElement.scrollWidth - innerWidth,
			noindex: document.querySelector('meta[name="robots"]')?.content.includes('noindex') ?? false,
		};
	});
	await pagina.screenshot({ path: `capturas/404-${width}.png`, fullPage: true });
	chequear(respuesta?.status() === 404, `404 ${width}: una ruta inexistente responde 404 (dio ${respuesta?.status()})`);
	chequear(m.propia && m.h1 === 1, `404 ${width}: página propia con una sola h1 ("${m.titulo}")`);
	chequear(m.links > 0 && m.altoLink >= 44, `404 ${width}: link a la portada de 44 px o más (${m.links} link(s), ${Math.round(m.altoLink)} px)`);
	chequear(m.desborde <= 0, `404 ${width}: sin desborde horizontal (${m.desborde} px)`);
	chequear(m.noindex, `404 ${width}: meta robots noindex`);
	chequear(!errores.length, `404 ${width}: sin errores de consola${errores.length ? ` (${errores.join(' | ')})` : ''}`);
	await pagina.close();
}

// La 404 sale del build y no entra al sitemap.
const archivo = (ruta) => readFile(new URL(`../dist/${ruta}`, import.meta.url), 'utf8').catch(() => null);
chequear(await archivo('404.html'), 'build: dist/404.html existe');
const sitemap = (await archivo('sitemap.xml')) ?? '';
chequear(sitemap.includes('<loc>') && !sitemap.includes('404'), 'sitemap.xml: lista páginas y no incluye la 404');

// _headers: bloques "ruta" seguidos de cabeceras indentadas (formato de Cloudflare Pages).
const bloques = {};
let ruta = null;
for (const linea of ((await archivo('_headers')) ?? '').split(/\r?\n/)) {
	if (!linea.trim() || linea.trim().startsWith('#')) continue;
	if (!/^\s/.test(linea)) bloques[(ruta = linea.trim())] = {};
	else if (ruta) {
		const [nombre, ...valor] = linea.trim().split(':');
		bloques[ruta][nombre.toLowerCase()] = valor.join(':').trim();
	}
}
const astro = bloques['/_astro/*'] ?? {};
const todo = bloques['/*'] ?? {};
chequear(/max-age=31536000/.test(astro['cache-control']) && /immutable/.test(astro['cache-control']), `_headers: /_astro/* con caché inmutable de un año (${astro['cache-control'] ?? 'falta'})`);
chequear(todo['x-content-type-options'] === 'nosniff', '_headers: /* con X-Content-Type-Options: nosniff');
chequear(todo['referrer-policy'], `_headers: /* con Referrer-Policy (${todo['referrer-policy'] ?? 'falta'})`);
chequear(todo['permissions-policy'], '_headers: /* con Permissions-Policy');
chequear(/frame-ancestors 'none'/.test(todo['content-security-policy'] ?? ''), `_headers: /* con CSP frame-ancestors 'none' (${todo['content-security-policy'] ?? 'falta'})`);
chequear(!/script-src|style-src|default-src/.test(todo['content-security-policy'] ?? ''), '_headers: sin CSP de scripts ni estilos (van dentro del HTML)');

await navegador.close(), await servidor.stop();
console.log('\nsitio (404, sitemap y cabeceras de Cloudflare Pages)');
for (const [ok, texto] of chequeos) console.log(`  ${ok ? 'ok   ' : 'FALLA'} ${texto}`);
const fallas = chequeos.filter(([ok]) => !ok).length;
console.log(`\n${chequeos.length - fallas} ok, ${fallas} falla(s).`);
process.exitCode = fallas ? 1 : 0;
