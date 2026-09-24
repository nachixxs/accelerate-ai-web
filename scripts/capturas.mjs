// Capturas de la web en celular (360 px) y escritorio (1280 px), más los chequeos que una
// captura no muestra a simple vista. Uso: npm run capturas (compila antes). Salida en capturas/.
// La captura completa va con prefers-reduced-motion: lo que se arma con el scroll saldría a
// medio camino (o invisible) en una foto de la página entera sin scrollear. La primera
// pantalla va con movimiento, cuando la historia de la portada ya terminó.
// Los chequeos del botón se repiten con la letra al 150 %, como la ve quien usa letra grande en
// el celular: las secciones con glow tienen overflow: hidden, así que lo que se sale no hace
// scroll horizontal, queda recortado sin aviso.
import { preview } from 'astro';
import { chromium } from 'playwright';

const ANCHOS = [
	{ nombre: 'celular-360', width: 360, height: 740 },
	{ nombre: 'escritorio-1280', width: 1280, height: 800 },
];

const servidor = await preview({ root: '.', logLevel: 'error' });
const url = `http://localhost:${servidor.port}/`;
const navegador = await chromium.launch();
let fallas = 0;

for (const { nombre, width, height } of ANCHOS) {
	const pagina = await navegador.newPage({ viewport: { width, height } });
	await pagina.goto(url, { waitUntil: 'networkidle' });
	await pagina.evaluate(() => document.fonts.ready);
	// La historia de la portada dura unos 4 segundos en escritorio.
	await pagina.waitForTimeout(4500);
	await pagina.screenshot({ path: `capturas/${nombre}-primera-pantalla.png` });

	// Las animaciones atadas al scroll tienen que tener su timeline. Si el minificador las junta
	// en el shorthand `animation`, o si un overflow: hidden las deja sin contenedor de scroll,
	// Chrome no las corre y la página se ve quieta sin avisar.
	const sinTimeline = await pagina.evaluate(() => {
		const atadas = ['.linea', '.paso__marca', '.ejemplo', '.encabezado'];
		return atadas.filter((selector) => {
			const el = document.querySelector(selector);
			const animaciones = el.getAnimations({ subtree: true });
			return !animaciones.some((a) => a.timeline && !(a.timeline instanceof DocumentTimeline));
		});
	});

	// El interruptor de Qué resolvemos cambia los dolores por las soluciones.
	await pagina.locator('.interruptor label').nth(1).click();
	await pagina.waitForTimeout(900);
	const interruptor = await pagina.evaluate(() => {
		const visible = (el) => getComputedStyle(el).visibility === 'visible';
		const lista = document.querySelector('.lista');
		return [...lista.querySelectorAll('.dolor__textos > .sistema')].every(visible) && ![...lista.querySelectorAll('.dolor__textos > .hoy')].some(visible);
	});
	await pagina.close();

	// Captura completa y chequeos de maquetación: sin movimiento, con todo en su lugar final.
	const quieta = await navegador.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
	const pagina2 = await quieta.newPage();
	await pagina2.goto(url, { waitUntil: 'networkidle' });
	await pagina2.evaluate(() => document.fonts.ready);
	// La captura completa no hace scroll: sin esto, las imágenes lazy (el logo del pie) no cargan.
	await pagina2.evaluate(() => Promise.all([...document.querySelectorAll('img[loading="lazy"]')].map((img) => {
		img.loading = 'eager';
		return img.decode();
	})));
	await pagina2.screenshot({ path: `capturas/${nombre}-completa.png`, fullPage: true });
	await revisar(pagina2, { nombre, width, height, sinTimeline, interruptor });
	await quieta.close();
}

async function revisar(pagina, { nombre, width, height, sinTimeline, interruptor }) {
	const medidas = await pagina.evaluate(() => {
		const boton = document.querySelector('.portada a[href^="https://wa.me"]').getBoundingClientRect();
		const chicos = [...document.querySelectorAll('a, summary')]
			.map((el) => ({ texto: el.textContent.trim().slice(0, 40), caja: el.getBoundingClientRect() }))
			// Lo oculto (el menú en el celular) mide 0 y no cuenta.
			.filter(({ caja }) => caja.height > 0 && caja.height < 44)
			.map(({ texto, caja }) => `"${texto}" (${Math.round(caja.height)} px de alto)`);
		return {
			anchoPagina: document.documentElement.scrollWidth,
			botonDerecha: Math.round(boton.right),
			botonAncho: Math.round(boton.width),
			botonAbajo: Math.round(boton.bottom),
			chicos,
			// Los links del encabezado tienen que llevar a una sección que exista.
			anclasRotas: [...document.querySelectorAll('.encabezado a[href^="#"]')].map((a) => a.getAttribute('href')).filter((h) => !document.querySelector(h)),
			// Topes de la marca y de Taste: gradiente de texto 1-2 veces, eyebrows 1 cada 3 secciones.
			gradientes: document.querySelectorAll('.texto-gradiente').length,
			eyebrows: document.querySelectorAll('.t-eyebrow').length,
			secciones: document.querySelectorAll('main > section').length,
			rayas: /[–—]/.test(document.body.innerText),
		};
	});

	const chequeos = [
		[medidas.anchoPagina <= width, `sin scroll horizontal (página de ${medidas.anchoPagina} px)`],
		[medidas.botonDerecha <= width - 16, `el botón entra con el margen (${medidas.botonAncho} px de ancho, termina en ${medidas.botonDerecha} px)`],
		[medidas.botonAbajo <= height, `el botón de la portada se ve sin scroll (termina en ${medidas.botonAbajo} de ${height} px)`],
		[medidas.chicos.length === 0, `áreas táctiles de 44 px o más${medidas.chicos.length ? ': ' + medidas.chicos.join(', ') : ''}`],
		[medidas.anclasRotas.length === 0, `los links del encabezado llevan a su sección${medidas.anclasRotas.length ? ': faltan ' + medidas.anclasRotas.join(', ') : ''}`],
		[sinTimeline.length === 0, `las animaciones de scroll tienen timeline${sinTimeline.length ? ': sin timeline en ' + sinTimeline.join(', ') : ''}`],
		[interruptor, 'el interruptor muestra las soluciones al pasar a "Con un sistema"'],
		[medidas.gradientes <= 2, `gradiente de texto 2 veces como máximo (hay ${medidas.gradientes})`],
		[medidas.eyebrows <= Math.ceil(medidas.secciones / 3), `eyebrows: ${medidas.eyebrows} en ${medidas.secciones} secciones (máximo 1 cada 3)`],
		[!medidas.rayas, 'sin rayas largas (— o –) en el texto'],
	];

	await pagina.evaluate(() => (document.documentElement.style.fontSize = '150%'));
	await pagina.screenshot({ path: `capturas/${nombre}-texto-150-primera-pantalla.png` });
	const grande = await pagina.evaluate(() => {
		const derecha = (selector) => Math.round(Math.max(...[...document.querySelectorAll(selector)].map((el) => el.getBoundingClientRect().right)));
		return { botones: derecha('a[href^="https://wa.me"]'), chip: derecha('.chip-montado'), card: derecha('.ejemplo--destacado') };
	});
	chequeos.push(
		[grande.botones <= width - 16, `con letra al 150 %, los botones entran con el margen (terminan en ${grande.botones} px)`],
		[grande.chip <= grande.card, `con letra al 150 %, el chip entra en su card (termina en ${grande.chip} de ${grande.card} px)`],
	);

	console.log(`\n${nombre}`);
	for (const [ok, texto] of chequeos) {
		console.log(`  ${ok ? 'ok   ' : 'FALLA'} ${texto}`);
		if (!ok) fallas++;
	}
}

// Open Graph: la imagen tiene que estar publicada y con URL completa, o WhatsApp no la muestra.
const pagina = await navegador.newPage();
await pagina.goto(url);
const og = await pagina.evaluate(() => {
	const meta = (p) => document.querySelector(`meta[property="${p}"]`)?.content ?? '';
	return { titulo: meta('og:title'), descripcion: meta('og:description'), imagen: meta('og:image') };
});
const imagenPublicada = (await pagina.request.get(new URL(new URL(og.imagen).pathname, url).href)).ok();
const chequeosOg = [
	[og.titulo && og.descripcion, 'Open Graph: título y descripción'],
	[og.imagen.startsWith('https://') && imagenPublicada, `Open Graph: imagen con URL completa y publicada (${og.imagen})`],
];
console.log('\nopen graph');
for (const [ok, texto] of chequeosOg) {
	console.log(`  ${ok ? 'ok   ' : 'FALLA'} ${texto}`);
	if (!ok) fallas++;
}

await navegador.close();
await servidor.stop();
console.log(`\nCapturas en capturas/. ${fallas ? `${fallas} chequeo(s) fallaron.` : 'Todos los chequeos pasan.'}`);
process.exitCode = fallas ? 1 : 0;
