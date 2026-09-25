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

const ANCHOS = [
	{ nombre: 'celular-360', width: 360, height: 740 },
	{ nombre: 'tablet-768', width: 768, height: 1024 },
	{ nombre: 'escritorio-1280', width: 1280, height: 800 },
];

const servidor = await preview({ root: '.', logLevel: 'error' });
const url = `http://localhost:${servidor.port}/`;
const navegador = await chromium.launch();
let fallas = 0;

// Espera a que terminen las animaciones de la carga (la historia de la portada, los fundidos),
// sin contar las que no terminan nunca (la cinta de rubros) ni las atadas al scroll.
const terminarCarga = (pagina) =>
	pagina.evaluate(async () => {
		await document.fonts.ready;
		const deTiempo = document.getAnimations().filter((a) => a.timeline instanceof DocumentTimeline && a.effect.getComputedTiming().iterations !== Infinity);
		await Promise.all(deTiempo.map((a) => a.finished.catch(() => {})));
	});

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
		await pagina.locator('#menu a[href="#somos"]').click();
		// El scroll es suave: espera a que la sección llegue arriba (o se rinde a los 3 s).
		await pagina
			.waitForFunction(() => Math.abs(document.getElementById('somos').getBoundingClientRect().top) < 200, null, { timeout: 3000 })
			.catch(() => {});
		const despues = await pagina.evaluate(() => ({
			cerrado: !document.getElementById('menu').matches(':popover-open'),
			hash: location.hash,
			seccionArriba: Math.round(document.getElementById('somos').getBoundingClientRect().top),
		}));
		menu = abierto && despues.cerrado && despues.hash === '#somos' && Math.abs(despues.seccionArriba) < 200;
		await pagina.evaluate(() => scrollTo(0, 0));
	}

	// El interruptor de Qué resolvemos cambia los dolores por las soluciones.
	await pagina.locator('.interruptor label').nth(1).click();
	const interruptor = await pagina
		.waitForFunction(() => {
			const visible = (el) => getComputedStyle(el).visibility === 'visible';
			const lista = document.querySelector('.lista');
			return [...lista.querySelectorAll('.dolor__textos > .sistema')].every(visible) && ![...lista.querySelectorAll('.dolor__textos > .hoy')].some(visible);
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

function imprimir(titulo, chequeos) {
	console.log(`\n${titulo}`);
	for (const [ok, texto] of chequeos) {
		console.log(`  ${ok ? 'ok   ' : 'FALLA'} ${texto}`);
		if (!ok) fallas++;
	}
}

const resultados = await Promise.all(ANCHOS.map(revisarAncho));
ANCHOS.forEach(({ nombre }, i) => imprimir(nombre, resultados[i]));

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
