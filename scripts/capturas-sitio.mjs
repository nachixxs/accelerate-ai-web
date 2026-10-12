// Chequeos del sitio que no son de una página: la 404, las cabeceras de Cloudflare Pages y el menú de la portada.
// Va aparte de capturas.mjs (que está en su techo de líneas) y corre después, con su propio preview.
// - Una ruta que no existe responde 404 con la página propia (sin dist/404.html, Cloudflare Pages
//   trata el sitio como SPA y sirve la portada con 200 en cualquier ruta).
// - La 404 a 360 y 1280: una sola h1, un link a la portada de 44 px o más, sin desborde, sin errores
//   de consola, con noindex y fuera del sitemap.
// - En la 404 y con un secundario a la vista, el CTA del encabezado en contorno; el menú abierto a 768 se cierra al pasar a 1280.
// - Los links del menú del celular (768 con letra al 200 % y al 100 %, 360) dejan su sección bajo el encabezado.
// - Con la letra al 200 % (a 1280 y 360): los nombres del stock no pisan su barra, el ícono del sello "Cierra" mide 12 px o más
//   y cada monto del ticket queda en una línea, pegado a la derecha como los demás.
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

// Un solo azul lleno a la vista (Nacho, 2026-10-10): con un secundario en pantalla, el CTA del encabezado va en contorno.
for (const width of [360, 1280]) {
	const pagina = await navegador.newPage({ viewport: { width, height: 800 } });
	await pagina.goto(url, { waitUntil: 'load' });
	await terminarCarga(pagina);
	const llenos = [];
	for (let i = 0; i < (await pagina.locator('main .boton--secundario').count()); i++) {
		await pagina.evaluate((i) => document.querySelectorAll('main .boton--secundario')[i].scrollIntoView({ block: 'center', behavior: 'instant' }), i);
		await pagina.waitForTimeout(400);
		if (await pagina.evaluate(() => document.querySelector('.capsula__cta').classList.contains('capsula__cta--lleno'))) llenos.push(i);
	}
	chequear(!llenos.length, `secundarios ${width}: el CTA del encabezado en contorno con cada secundario a la vista${llenos.length ? ` (lleno con el secundario ${llenos.join(', ')})` : ''}`);
	await pagina.close();
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

// Los links del menú del celular que pasan por el ticket y el mes llevan su sección bajo el encabezado, con
// movimiento (scroll suave) y con la letra al 200 % (CDP, como capturas-letra200.mjs). El destino del scroll suave se calcula al tocar, con la
// página todavía a medio acomodar por el cierre del menú: si algo cambia de alto después (el campo de marcas
// del mes, el total del ticket), la sección queda pasada o corta (a 768 con letra al 200 %: 311 px pasada).
// El título tiene que quedar a scroll-padding-top (96 px) del borde, con 16 px de margen.
for (const [width, letra] of [[768, 200], [768, 100], [360, 100]]) {
	const contexto = await navegador.newContext({ viewport: { width, height: width === 360 ? 800 : 1024 }, reducedMotion: 'no-preference' });
	const pagina = await contexto.newPage();
	const cdp = await contexto.newCDPSession(pagina);
	await cdp.send('Page.enable');
	if (letra === 200) await cdp.send('Page.setFontSizes', { fontSizes: { standard: 32, fixed: 26 } });
	await pagina.goto(url, { waitUntil: 'load' });
	await terminarCarga(pagina);
	const tops = {};
	for (const id of ['tiempo', 'sistemas', 'proceso', 'preguntas']) {
		await pagina.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
		await pagina.click('.encabezado .capsula__menu');
		await pagina.click(`#menu a[href$="#${id}"]`);
		// Quieto: la misma posición en 5 lecturas seguidas, una cada 100 ms (con tope de 8 s).
		let ultimo = NaN;
		for (let quietas = 0, i = 0; quietas < 5 && i < 80; i++) {
			await pagina.waitForTimeout(100);
			const top = await pagina.evaluate((id) => Math.round(document.getElementById(id).getBoundingClientRect().top), id);
			quietas = top === ultimo ? quietas + 1 : 0;
			ultimo = top;
		}
		tops[id] = ultimo;
	}
	const fuera = Object.entries(tops).filter(([, top]) => top < 80 || top > 112);
	chequear(!fuera.length, `menú ${width} con letra al ${letra} %: cada link lleva su sección a 96 ± 16 px del borde (${Object.entries(tops).map(([id, top]) => `#${id} ${top}`).join(', ')})`);
	await contexto.close();
}

// Los mocks de stock y de caja con la letra al 200 % (CDP). Con movimiento reducido, para medir sin la entrada por scroll.
// Antes: los nombres del stock se montaban sobre la barra (3 columnas con un corte en px), el ícono del sello quedaba en 3-5 px
// y "Diferencia $ 0" se partía; "Transferencias" dejaba su monto a la izquierda.
for (const width of [1280, 360]) {
	const contexto = await navegador.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
	const pagina = await contexto.newPage();
	const cdp = await contexto.newCDPSession(pagina);
	await cdp.send('Page.enable');
	await cdp.send('Page.setFontSizes', { fontSizes: { standard: 32, fixed: 26 } });
	await pagina.goto(url, { waitUntil: 'load' });
	await terminarCarga(pagina);
	const m = await pagina.evaluate(() => {
		const lineas = (el) => { const r = document.createRange(); r.selectNodeContents(el); return new Set([...r.getClientRects()].filter((q) => q.width > 1).map((q) => Math.round(q.top / 4))).size; };
		const solapes = [...document.querySelectorAll('.producto')].filter((p) => {
			const b = p.querySelector('.producto__nivel').getBoundingClientRect();
			const r = document.createRange();
			r.selectNodeContents(p.querySelector('.producto__nombre'));
			return [...r.getClientRects()].some((q) => q.width > 1 && q.left < b.right && b.left < q.right && q.top < b.bottom + 4 && b.top - 4 < q.bottom);
		}).map((p) => p.querySelector('.producto__nombre').firstChild.textContent.trim());
		const montos = [...document.querySelectorAll('.ticket__monto')].map((d) => ({ texto: d.firstChild.textContent, lineas: lineas(d.firstChild), aDerecha: Math.abs(d.getBoundingClientRect().right - d.closest('.ticket__fila').getBoundingClientRect().right) < 1 }));
		montos.push({ texto: 'Diferencia $ 0', lineas: lineas(document.querySelector('.ticket__cierre span')), aDerecha: true });
		return { solapes, icono: parseFloat(getComputedStyle(document.querySelector('.ticket__sello svg')).width), mal: montos.filter((x) => x.lineas !== 1 || !x.aDerecha).map((x) => `${x.texto} (${x.lineas} línea(s)${x.aDerecha ? '' : ', no queda a la derecha'})`) };
	});
	chequear(!m.solapes.length, `stock ${width} con letra al 200 %: ningún nombre se superpone con su barra${m.solapes.length ? ` (pisa: ${m.solapes.join(', ')})` : ''}`);
	chequear(m.icono >= 12, `ticket ${width} con letra al 200 %: el ícono del sello mide 12 px o más (${m.icono.toFixed(1)} px)`);
	chequear(!m.mal.length, `ticket ${width} con letra al 200 %: cada monto en una sola línea, a la derecha${m.mal.length ? ` (${m.mal.join(', ')})` : ''}`);
	await contexto.close();
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
