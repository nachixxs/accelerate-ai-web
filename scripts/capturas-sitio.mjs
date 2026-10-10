// Chequeos del sitio que no son de una página: la 404 y las cabeceras de Cloudflare Pages.
// Va aparte de capturas.mjs (que está en su techo de líneas) y corre después, con su propio preview.
// - Una ruta que no existe responde 404 con la página propia (sin dist/404.html, Cloudflare Pages
//   trata el sitio como SPA y sirve la portada con 200 en cualquier ruta).
// - La 404 a 360 y 1280: una sola h1, un link a la portada de 44 px o más, sin desborde, sin errores
//   de consola, con noindex y fuera del sitemap.
// - En la 404, el CTA del encabezado en contorno; el menú abierto a 768 se cierra al pasar a 1280.
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
	// El 404 del documento es el esperado; cualquier otro recurso que falte (fuente, script, ícono) es error.
	pagina.on('response', (r) => r.status() >= 400 && !r.url().includes('esta-ruta-no-existe') && errores.push(`${r.status()} ${r.url()}`));
	pagina.on('console', (m) => m.type() === 'error' && !m.text().startsWith('Failed to load resource') && errores.push(m.text()));
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
			canonical: !!document.querySelector('link[rel="canonical"]'),
		};
	});
	await pagina.screenshot({ path: `capturas/404-${width}.png`, fullPage: true });
	chequear(respuesta?.status() === 404, `404 ${width}: una ruta inexistente responde 404 (dio ${respuesta?.status()})`);
	chequear(m.propia && m.h1 === 1, `404 ${width}: página propia con una sola h1 ("${m.titulo}")`);
	chequear(m.links > 0 && m.altoLink >= 44, `404 ${width}: link a la portada de 44 px o más (${m.links} link(s), ${Math.round(m.altoLink)} px)`);
	chequear(m.desborde <= 0, `404 ${width}: sin desborde horizontal (${m.desborde} px)`);
	chequear(m.noindex && !m.canonical, `404 ${width}: meta robots noindex y sin canonical`);
	chequear(!errores.length, `404 ${width}: sin errores de consola${errores.length ? ` (${errores.join(' | ')})` : ''}`);
	await pagina.close();
}

// En la 404 a 1280 el CTA del encabezado queda en contorno mientras se ve "Ir a la portada" (nunca dos azules llenos).
{
	const pagina = await navegador.newPage({ viewport: { width: 1280, height: 800 } });
	await pagina.goto(`${url}esta-ruta-no-existe/`, { waitUntil: 'load' });
	await terminarCarga(pagina);
	const lleno = await pagina.evaluate(() => document.querySelector('.capsula__cta').classList.contains('capsula__cta--lleno'));
	chequear(!lleno, '404 1280: el CTA del encabezado en contorno con "Ir a la portada" a la vista');
	await pagina.close();
}

// La 404 es corta: el pie entra en la primera pantalla y tiene que verse entero, sin quedar a mitad de su
// fundido por scroll. Y sin JS, el CTA del encabezado ya arranca en contorno (no hay quien lo cambie).
{
	const contexto = await navegador.newContext({ viewport: { width: 1280, height: 720 }, reducedMotion: 'no-preference' });
	const pagina = await contexto.newPage();
	await pagina.goto(`${url}esta-ruta-no-existe/`, { waitUntil: 'load' });
	await terminarCarga(pagina);
	const opacidad = await pagina.evaluate(() => {
		const efectiva = (el) => (el ? Number(getComputedStyle(el).opacity) * efectiva(el.parentElement) : 1);
		return Math.min(...[...document.querySelectorAll('.pie a, .pie p, .pie h2, .pie h3')].map(efectiva));
	});
	chequear(opacidad > 0.99, `404 1280x720: el pie se ve entero sin scrollear (opacidad mínima ${opacidad.toFixed(2)})`);
	await contexto.close();
	const sinJs = await navegador.newContext({ viewport: { width: 1280, height: 800 }, javaScriptEnabled: false });
	const pagina2 = await sinJs.newPage();
	await pagina2.goto(`${url}esta-ruta-no-existe/`, { waitUntil: 'load' });
	const llenoSinJs = await pagina2.evaluate(() => document.querySelector('.capsula__cta').classList.contains('capsula__cta--lleno'));
	chequear(!llenoSinJs, '404 sin JS: el CTA del encabezado arranca en contorno');
	await sinJs.close();
}

// Menú abierto a 768 y la ventana se ensancha a 1280 (tablet que gira): el menú se cierra y libera el scroll.
{
	const pagina = await navegador.newPage({ viewport: { width: 768, height: 1024 } });
	await pagina.goto(url, { waitUntil: 'load' });
	await terminarCarga(pagina);
	await pagina.click('.encabezado .capsula__menu');
	const abierto = await pagina.evaluate(() => document.querySelector('#menu').matches(':popover-open'));
	await pagina.setViewportSize({ width: 1280, height: 800 });
	await pagina.waitForTimeout(300);
	const despues = await pagina.evaluate(() => ({ abierto: document.querySelector('#menu').matches(':popover-open'), bloqueado: getComputedStyle(document.documentElement).overflowY === 'hidden' }));
	chequear(abierto && !despues.abierto && !despues.bloqueado, `menú: abierto a 768, al pasar a 1280 se cierra y libera el scroll (abrió ${abierto}, sigue abierto ${despues.abierto}, scroll bloqueado ${despues.bloqueado})`);
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
