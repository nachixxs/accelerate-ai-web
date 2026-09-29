// Capturas de la web en celular (360 px), tablet (768 px) y escritorio (1280 px), más los chequeos que una
// captura no muestra a simple vista. Uso: npm run capturas (compila antes). Salida en capturas/.
// La captura completa va con prefers-reduced-motion y sin animaciones: lo que se arma con el
// scroll saldría a medio camino (o invisible) en una foto de la página entera sin scrollear. La primera
// pantalla va con movimiento, cuando la historia de la portada ya terminó. Los tres anchos corren a
// la vez, cada uno en su pestaña.
// Los chequeos del botón se repiten con la letra al 150 %, como la ve quien usa letra grande en
// el celular: las secciones con glow tienen overflow: hidden, así que lo que se sale no hace
// scroll horizontal, queda recortado sin aviso.
import { preview } from 'astro';
import { chromium } from 'playwright';
import { revisarAxe } from './capturas-axe.mjs';
import { revisarLetra200 } from './capturas-letra200.mjs';
import { revisarAltoContraste } from './capturas-contraste.mjs';
import { revisarNavegadores } from './capturas-navegadores.mjs';
import { terminarCarga } from './capturas-utils.mjs';

const ANCHOS = [
	{ nombre: 'celular-360', width: 360, height: 740 },
	{ nombre: 'tablet-768', width: 768, height: 1024 },
	{ nombre: 'escritorio-1280', width: 1280, height: 800 },
];

const servidor = await preview({ root: '.', logLevel: 'error' });
const url = `http://localhost:${servidor.port}/`;
const navegador = await chromium.launch();
let fallas = 0;

async function revisarAncho({ nombre, width, height }) {
	const pagina = await navegador.newPage({ viewport: { width, height } });
	await pagina.goto(url, { waitUntil: 'load' });
	await terminarCarga(pagina);
	await pagina.screenshot({ path: `capturas/${nombre}-primera-pantalla.png` });

	// Las animaciones atadas al scroll tienen que tener su timeline. Si el minificador las junta
	// en el shorthand `animation`, o si un overflow: hidden las deja sin contenedor de scroll,
	// Chrome no las corre y la página se ve quieta sin avisar. Se revisan todas: cada animación
	// cuyo animation-timeline no es auto y quedó sin timeline de scroll es una que se murió.
	const sinTimeline = await pagina.evaluate(() => {
		const muertas = document.getAnimations().filter((a) => {
			const { target, pseudoElement } = a.effect;
			const pedido = getComputedStyle(target, pseudoElement).animationTimeline;
			const deScroll = pedido.split(',').some((t) => t.trim() !== 'auto');
			return deScroll && (!a.timeline || a.timeline instanceof DocumentTimeline);
		});
		const nombrar = (a) => `${a.animationName} en .${[...a.effect.target.classList][0] ?? a.effect.target.tagName}${a.effect.pseudoElement ?? ''}`;
		return [...new Set(muertas.map(nombrar))];
	});

	// El menú del celular y la tablet (popover): abre, y al tocar un link se cierra y lleva a la
	// sección. En escritorio los links están en la cápsula y el botón no se muestra.
	let menu = true;
	if (width < 1080) {
		await pagina.locator('.capsula .capsula__menu').click();
		const abierto = await pagina
			.waitForFunction(() => document.getElementById('menu').matches(':popover-open'), null, { timeout: 2000 })
			.then(() => true, () => false);
		await pagina.locator('#menu a[href="#tiempo"]').click();
		// El scroll es suave: espera a que la sección llegue arriba (o se rinde a los 3 s).
		await pagina
			.waitForFunction(() => Math.abs(document.getElementById('tiempo').getBoundingClientRect().top) < 200, null, { timeout: 3000 })
			.catch(() => {});
		const despues = await pagina.evaluate(() => ({
			cerrado: !document.getElementById('menu').matches(':popover-open'),
			hash: location.hash,
			seccionArriba: Math.round(document.getElementById('tiempo').getBoundingClientRect().top),
		}));
		menu = abierto && despues.cerrado && despues.hash === '#tiempo' && Math.abs(despues.seccionArriba) < 200;
		await pagina.evaluate(() => scrollTo(0, 0));
	}

	// El interruptor de Qué resolvemos cambia los dolores por las soluciones.
	await pagina.locator('.interruptor label').nth(1).click();
	const interruptor = await pagina
		.waitForFunction(() => {
			const visible = (el) => getComputedStyle(el).visibility === 'visible';
			const caras = (cual) => [...document.querySelectorAll(`.lista .cara--${cual}`)];
			return caras('sistema').every((c) => visible(c) && /^inset\(0(px)? 0(px)?/.test(getComputedStyle(c).clipPath)) && !caras('hoy').some(visible);
		}, null, { timeout: 2000 })
		.then(() => true, () => false);
	await pagina.close();

	// Captura completa y chequeos de maquetación: sin movimiento, con todo en su lugar final.
	const quieta = await navegador.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
	const pagina2 = await quieta.newPage();
	await pagina2.goto(url, { waitUntil: 'load' });
	await terminarCarga(pagina2);
	// La captura completa no hace scroll: sin esto, las imágenes lazy (el logo del pie) no cargan.
	await pagina2.evaluate(() => Promise.all([...document.querySelectorAll('img[loading="lazy"]')].map((img) => {
		img.loading = 'eager';
		return img.decode();
	})));
	await pagina2.screenshot({ path: `capturas/${nombre}-primera-pantalla-reducido.png` });
	// Con movimiento reducido quedan fundidos cortos atados al scroll, y la captura completa no
	// scrollea: se apagan todas las animaciones. El estado de base es el final, así que la foto
	// muestra la página armada.
	await pagina2.addStyleTag({ content: '*, *::before, *::after { animation: none !important; }' });
	await pagina2.screenshot({ path: `capturas/${nombre}-completa.png`, fullPage: true });
	const chequeos = await revisar(pagina2, { nombre, width, height, sinTimeline, interruptor, menu });
	await quieta.close();
	return chequeos;
}

async function revisar(pagina, { nombre, width, height, sinTimeline, interruptor, menu }) {
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
			// Los links internos (encabezado, menú, sistemas, pie) tienen que llevar a algo que exista.
			anclasRotas: [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')).filter((h) => !document.querySelector(h)),
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
		[medidas.anclasRotas.length === 0, `los links internos llevan a su sección${medidas.anclasRotas.length ? ': faltan ' + medidas.anclasRotas.join(', ') : ''}`],
		[sinTimeline.length === 0, `las animaciones de scroll tienen timeline${sinTimeline.length ? ': sin timeline en ' + sinTimeline.join(', ') : ''}`],
		[interruptor, 'el interruptor muestra las soluciones al pasar a "Con un sistema"'],
		[menu, 'el menú abre, y al tocar un link se cierra y lleva a la sección'],
		[medidas.gradientes <= 2, `gradiente de texto 2 veces como máximo (hay ${medidas.gradientes})`],
		[medidas.eyebrows <= Math.ceil(medidas.secciones / 3), `eyebrows: ${medidas.eyebrows} en ${medidas.secciones} secciones (máximo 1 cada 3)`],
		[!medidas.rayas, 'sin rayas largas (— o –) en el texto'],
	];

	// Tu tiempo: al cambiar tarea, horas y personas cambian el total (horas × personas × 4) y el
	// mensaje del botón, y ni el "800" del máximo se sale de su card ni de la página. Debajo de 1024
	// la card va arriba de los controles: el total tiene que verse entero, bajo la cápsula, al usar cada uno.
	const calculadora = await revisarCalculadora(pagina, width, height);
	chequeos.push([calculadora.length === 0, `la calculadora de Tu tiempo cambia el total y el botón, y el máximo entra${width < 1024 ? ' y se ve al usar cada control' : ''}${calculadora.length ? ': ' + calculadora.join(', ') : ''}`]);

	// Lo que va montado sobre un borde no puede salirse de costado de su card. Los que van en el
	// flujo, con margen negativo, tampoco pueden tapar lo que tienen al lado (sus hermanos y, en el
	// cierre, la línea de abajo). El chip del tablero flota sobre la ventana a propósito: de ese
	// solo se mide el costado. Se mide con la letra normal y al 150 %.
	const montados = () =>
		pagina.evaluate(() => {
			const caja = (el) => el.getBoundingClientRect();
			const pisa = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom - 1 && b.top < a.bottom - 1;
			return [
				['.ordenes__chip', '.ejemplo--ordenes', []],
				['.pedido', '.ejemplo--stock', []],
				['.tablero__chip', '.tablero', null],
				['.cierre__accion', '.cierre__card', ['.cierre__quien']],
			]
				.filter(([chip, card, otros]) => {
					const el = document.querySelector(chip);
					if (caja(el).right > caja(document.querySelector(card)).right + 1) return true;
					if (!otros) return false;
					const vecinos = [...el.parentElement.children, ...otros.map((o) => document.querySelector(o))].filter((v) => v !== el);
					return vecinos.some((v) => pisa(caja(el), caja(v)));
				})
				.map(([chip]) => chip);
		});
	const montadosNormal = await montados();
	chequeos.push([montadosNormal.length === 0, `lo montado sobre un borde entra en su card y no tapa nada${montadosNormal.length ? ': ' + montadosNormal.join(', ') : ''}`]);

	await pagina.evaluate(() => (document.documentElement.style.fontSize = '150%'));
	await pagina.screenshot({ path: `capturas/${nombre}-texto-150-primera-pantalla.png` });
	const botones = await pagina.evaluate(() => Math.round(Math.max(...[...document.querySelectorAll('a[href^="https://wa.me"]')].map((el) => el.getBoundingClientRect().right))));
	const montadosGrande = await montados();
	chequeos.push(
		[botones <= width - 16, `con letra al 150 %, los botones entran con el margen (terminan en ${botones} px)`],
		[montadosGrande.length === 0, `con letra al 150 %, lo montado sobre un borde entra en su card y no tapa nada${montadosGrande.length ? ': ' + montadosGrande.join(', ') : ''}`],
	);
	return chequeos;
}

// Devuelve la lista de lo que falló (vacía si todo bien). Deja la calculadora como la encontró.
// El total se lee de dos lados: `data-total` (lo que calculó el script) y las columnas del odómetro
// (lo que se ve: el dígito al que llegó cada tira). La card es `.tiempo__fondo`: desde 1024
// `.tiempo__resultado` es `display: contents` y no tiene caja.
async function revisarCalculadora(pagina, width, height) {
	const leer = () =>
		pagina.evaluate(() => {
			const caja = (el) => el.getBoundingClientRect();
			const numero = caja(document.querySelector('#tiempo [data-total]'));
			const card = caja(document.querySelector('#tiempo .tiempo__fondo'));
			const boton = document.querySelector('#tiempo .tiempo__accion a');
			const columnas = [...document.querySelectorAll('#tiempo .tiempo__numero > .tiempo__col:not([hidden]):not(.tiempo__fantasma)')];
			const visto = columnas.map((c) => Math.round(-new DOMMatrix(getComputedStyle(c.firstElementChild).transform).f / caja(c).height)).join('');
			// La marca que viaja: su recorte tiene que coincidir con el chip elegido.
			const chip = caja(document.querySelector('#tiempo input[name="tarea"]:checked + .tiempo__cara'));
			const chips = caja(document.querySelector('#tiempo .tiempo__chips'));
			const recorte = getComputedStyle(document.querySelector('#tiempo .tiempo__marca')).clipPath.match(/-?[\d.]+px/g)?.map(parseFloat) ?? [];
			const [arriba, derecha, abajo, izquierda] = recorte;
			const marcaOk = recorte.length >= 4 && [arriba - (chip.top - chips.top), derecha - (chips.right - chip.right), abajo - (chips.bottom - chip.bottom), izquierda - (chip.left - chips.left)].every((d) => Math.abs(d) <= 1);
			return {
				total: document.querySelector('#tiempo [data-total]').dataset.total,
				visto,
				texto: new URL(boton.href).searchParams.get('text'),
				anuncio: document.querySelector('#tiempo [data-anuncio]').textContent,
				valuetext: [...document.querySelectorAll('#tiempo input[type="range"]')].map((r) => r.getAttribute('aria-valuetext')),
				entra: numero.left >= card.left && numero.right <= card.right,
				botonDentro: caja(boton).left >= card.left && caja(boton).right <= card.right && caja(boton).bottom <= card.bottom,
				marcaOk,
				pagina: document.documentElement.scrollWidth,
			};
		});
	const casos = [
		[null, null, null, '40', 'Hola, vi la web. Se me van unas 40 horas por mes haciendo la caja.'],
		['Pasar datos', '20', '10', '800', 'Hola, vi la web. Se me van unas 800 horas por mes pasando datos de un lado a otro.'],
		['Otra', '1', '1', '4', 'Hola, vi la web. Se me van unas 4 horas por mes en tareas que se repiten.'],
		['Cargar pedidos', '7', '3', '84', 'Hola, vi la web. Se me van unas 84 horas por mes cargando pedidos.'],
		['Hacer la caja', '5', '2', '40', 'Hola, vi la web. Se me van unas 40 horas por mes haciendo la caja.'],
	];
	const fallas = [];
	let horasAhora = '5';
	let personasAhora = '2';
	for (const [tarea, horas, personas, total, texto] of casos) {
		if (tarea) await pagina.locator('#tiempo label.tiempo__chip', { hasText: tarea }).click();
		if (horas) await pagina.locator('#tiempo-horas').fill((horasAhora = horas));
		if (personas) await pagina.locator('#tiempo-personas').fill((personasAhora = personas));
		// El odómetro corre 0,26 s hasta el total y la marca 0,28 s hasta el chip: se espera a que lleguen.
		await pagina.waitForFunction((t) => [...document.querySelectorAll('#tiempo .tiempo__numero > .tiempo__col:not([hidden]):not(.tiempo__fantasma)')].map((c) => Math.round(-new DOMMatrix(getComputedStyle(c.firstElementChild).transform).f / c.getBoundingClientRect().height)).join('') === t, total, { timeout: 2000 }).catch(() => {});
		await pagina.waitForTimeout(350);
		const ahora = await leer();
		if (ahora.total !== total) fallas.push(`total ${ahora.total} en vez de ${total}`);
		if (ahora.visto !== total) fallas.push(`el odómetro muestra ${ahora.visto} en vez de ${total}`);
		if (ahora.texto !== texto) fallas.push(`mensaje "${ahora.texto}"`);
		if (!ahora.entra) fallas.push(`el ${total} se sale de su card a ${width} px`);
		if (!ahora.marcaOk) fallas.push(`la marca azul no coincide con el chip elegido (${tarea ?? 'inicial'})`);
		if (width >= 1024 && !ahora.botonDentro) fallas.push(`el botón no entra en la card a ${width} px`);
		if (ahora.pagina > width) fallas.push(`página de ${ahora.pagina} px con el ${total}`);
		// El anuncio se actualiza a los 700 ms de la última acción; nombra el total y la tarea.
		const anuncio = `Se te van ${total} horas por mes ${texto.match(/por mes (.*)\.$/)[1]}`;
		await pagina.waitForFunction((a) => document.querySelector('#tiempo [data-anuncio]').textContent === a, anuncio, { timeout: 1500 }).catch(() => {});
		const dicho = (await leer()).anuncio;
		if (dicho !== anuncio) fallas.push(`anuncio "${dicho}" en vez de "${anuncio}"`);
		const unidades = [horasAhora === '1' ? '1 hora por semana' : `${horasAhora} horas por semana`, personasAhora === '1' ? '1 persona' : `${personasAhora} personas`];
		if (ahora.valuetext.join('|') !== unidades.join('|')) fallas.push(`aria-valuetext "${ahora.valuetext.join('|')}" en vez de "${unidades.join('|')}"`);
	}

	// Recorrido de arriba abajo, como lo haría quien usa la sección: cada chip y cada range entra en
	// pantalla con scrollIntoView (nearest) y el número tiene que quedar entero, debajo de la cápsula.
	// En el celular se mide también con una ventana de 640 de alto, la más chica que se usa.
	if (width < 1024) {
		for (const alto of width < 768 ? [height, 640] : [height]) {
			await pagina.setViewportSize({ width, height: alto });
			const fuera = await pagina.evaluate(() => {
				document.documentElement.style.scrollBehavior = 'auto';
				scrollTo(0, 0);
				const controles = [...document.querySelectorAll('#tiempo label.tiempo__chip, #tiempo input[type="range"]')];
				return controles.flatMap((el) => {
					el.scrollIntoView({ block: 'nearest' });
					const n = document.querySelector('#tiempo [data-total]').getBoundingClientRect();
					const capsula = document.querySelector('.capsula').getBoundingClientRect().bottom;
					return n.top >= capsula && n.bottom <= innerHeight ? [] : [el.id || el.textContent.trim()];
				});
			});
			if (fuera.length) fallas.push(`a ${width}x${alto} el total no se ve entero al usar: ${fuera.join(', ')}`);
		}
		await pagina.setViewportSize({ width, height });
	}
	return fallas;
}

function imprimir(titulo, chequeos) {
	console.log(`\n${titulo}`);
	for (const [ok, texto] of chequeos) {
		console.log(`  ${ok ? 'ok   ' : 'FALLA'} ${texto}`);
		if (!ok) fallas++;
	}
}

// Todo corre a la vez: los tres anchos de siempre, más axe, la letra al 200 % y el alto
// contraste (los tres con la misma instancia de Chromium) y WebKit/Firefox (instancias propias).
const inicioExtra = Date.now();
const [resultados, axe, letra200, altoContraste, otrosNavegadores] = await Promise.all([
	Promise.all(ANCHOS.map(revisarAncho)),
	revisarAxe(navegador, url),
	revisarLetra200(navegador, url),
	revisarAltoContraste(navegador, url),
	revisarNavegadores(navegador, url),
]);
ANCHOS.forEach(({ nombre }, i) => imprimir(nombre, resultados[i]));
imprimir('axe (accesibilidad, 360 y 1280, estado final)', axe.chequeos);
imprimir('letra al 200 % (360 y 320, recorriendo la página)', letra200.chequeos);
imprimir('alto contraste de windows (360)', altoContraste.chequeos);
imprimir('webkit y firefox (360 y 1280, con y sin movimiento)', otrosNavegadores.chequeos);
console.log(
	`\nTiempos: axe ${axe.ms}ms, letra 200% ${letra200.ms}ms, alto contraste ${altoContraste.ms}ms, ` +
		`webkit/firefox ${otrosNavegadores.ms}ms, total de los cuatro en paralelo ${Date.now() - inicioExtra}ms`,
);

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
imprimir('open graph', chequeosOg);

await navegador.close();
await servidor.stop();
console.log(`\nCapturas en capturas/. ${fallas ? `${fallas} chequeo(s) fallaron.` : 'Todos los chequeos pasan.'}`);
process.exitCode = fallas ? 1 : 0;
