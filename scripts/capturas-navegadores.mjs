// WebKit y Firefox, a 360 y 1280, con y sin movimiento reducido: la página tiene que cargar sin
// errores, sin scroll horizontal en reposo ni recorriéndola, y el botón de la portada se ve sin
// scroll. Safari 26 ya corre animaciones atadas al scroll y Firefox las prende en la 159, así que
// puede pasar que algo quede a mitad de camino que en Chromium sí llega a su estado final: por eso
// la comparación de opacidad es contra el propio Chromium en la misma combinación de ancho y
// movimiento, no contra un "opacidad 1" fijo (varios paneles del sitio, a propósito, terminan en
// 0: por ejemplo las pantallas de Cómo trabajamos que no están activas, o el contador viejo de una
// orden que ya cambió). Sin esa comparación, ese diseño se reportaría como bug sin serlo.
import { firefox, webkit } from 'playwright';
import { terminarCarga } from './capturas-utils.mjs';

const ANCHOS = [
	{ nombre: '360', width: 360, height: 740 },
	{ nombre: '1280', width: 1280, height: 800 },
];
const MOTIVOS = [
	{ nombre: 'con-movimiento', reducedMotion: 'no-preference' },
	{ nombre: 'movimiento-reducido', reducedMotion: 'reduce' },
];

// Firma estable entre motores: etiqueta + primera clase + inicio del texto + orden de aparición
// entre los que comparten esa firma (para no confundir dos .pantalla distintas, por ejemplo).
async function opacidadesFinales(pagina, height) {
	const alto = await pagina.evaluate(() => document.documentElement.scrollHeight);
	const anchos = [];
	for (let y = 0; y <= alto; y += height) {
		await pagina.evaluate((y) => scrollTo(0, y), y);
		await pagina.waitForTimeout(150);
		anchos.push(await pagina.evaluate(() => document.documentElement.scrollWidth));
	}
	await pagina.waitForTimeout(150);
	const opacidades = await pagina.evaluate(() => {
		const contador = new Map();
		const firmar = (el) => {
			const clase = el.className && typeof el.className === 'string' ? el.className.trim().split(/\s+/)[0] : '';
			const clave = `${el.tagName}.${clase}`;
			const texto = (el.textContent || '').trim().slice(0, 24);
			const n = contador.get(clave + texto) ?? 0;
			contador.set(clave + texto, n + 1);
			return `${clave}"${texto}"#${n}`;
		};
		return [...document.querySelectorAll('body *')]
			.filter((el) => getComputedStyle(el).animationName !== 'none')
			.map((el) => [firmar(el), parseFloat(getComputedStyle(el).opacity)]);
	});
	return { anchoMaximo: Math.max(...anchos), opacidades: new Map(opacidades) };
}

// Referencia: el mismo recorrido en Chromium, con la misma combinación de ancho y movimiento.
async function referenciaChromium(navegadorChromium, url, { width, height }, { reducedMotion }) {
	const contexto = await navegadorChromium.newContext({ viewport: { width, height }, reducedMotion });
	const pagina = await contexto.newPage();
	await pagina.goto(url, { waitUntil: 'load' });
	await terminarCarga(pagina);
	const { opacidades } = await opacidadesFinales(pagina, height);
	await contexto.close();
	return opacidades;
}

async function probarCombo(navegador, nombreNavegador, url, referencia, { nombre: anchoNombre, width, height }, { nombre: motivoNombre, reducedMotion }) {
	const contexto = await navegador.newContext({ viewport: { width, height }, reducedMotion });
	const pagina = await contexto.newPage();
	const errores = [];
	pagina.on('console', (m) => {
		if (m.type() === 'error') errores.push(m.text());
	});
	pagina.on('pageerror', (e) => errores.push(String(e)));
	const prefijo = `${nombreNavegador}-${anchoNombre}-${motivoNombre}`;
	await pagina.goto(url, { waitUntil: 'load' });
	await terminarCarga(pagina);
	await pagina.screenshot({ path: `capturas/${prefijo}-primera-pantalla.png` });
	const botonVisible = await pagina.evaluate((h) => {
		const boton = document.querySelector('.portada a[href^="https://wa.me"]');
		if (!boton) return false;
		const r = boton.getBoundingClientRect();
		return r.top >= 0 && r.bottom <= h;
	}, height);
	const { anchoMaximo, opacidades } = await opacidadesFinales(pagina, height);
	await pagina.evaluate(() => scrollTo(0, 0));
	await pagina.screenshot({ path: `capturas/${prefijo}-completa.png`, fullPage: true });
	await contexto.close();

	// Solo cuenta como diferencia si Chromium, en la misma corrida, sí había llegado a un estado
	// bien distinto (más de 0,1 de opacidad de diferencia): así no se marca lo que ya está a medio
	// camino por diseño en los dos motores.
	const distinto = [];
	for (const [firma, opacidad] of opacidades) {
		const enChromium = referencia.get(firma);
		if (enChromium !== undefined && Math.abs(enChromium - opacidad) > 0.1) {
			distinto.push(`${firma} opacity=${opacidad.toFixed(2)} (Chromium: ${enChromium.toFixed(2)})`);
		}
	}

	const chequeos = [
		[errores.length === 0, `${prefijo}: sin errores de consola ni de página${errores.length ? ': ' + errores.slice(0, 3).join(' | ') : ''}`],
		[anchoMaximo <= width, `${prefijo}: sin scroll horizontal recorriendo la página (máximo ${anchoMaximo}px de ${width}px)`],
		[botonVisible, `${prefijo}: el botón de la portada se ve sin scroll`],
	];
	if (distinto.length) chequeos.push([false, `${prefijo}: termina distinto que Chromium en la misma corrida: ${distinto.slice(0, 5).join(', ')}`]);
	return chequeos;
}

export async function revisarNavegadores(navegadorChromium, url) {
	const inicio = Date.now();
	// Una referencia de Chromium por combinación de ancho y movimiento, para comparar.
	const referencias = new Map();
	await Promise.all(
		ANCHOS.flatMap((ancho) =>
			MOTIVOS.map(async (motivo) => {
				referencias.set(`${ancho.nombre}-${motivo.nombre}`, await referenciaChromium(navegadorChromium, url, ancho, motivo));
			}),
		),
	);

	const porNavegador = await Promise.all(
		[
			{ nombre: 'webkit', tipo: webkit },
			{ nombre: 'firefox', tipo: firefox },
		].map(async ({ nombre, tipo }) => {
			const navegador = await tipo.launch();
			const combos = await Promise.all(
				ANCHOS.flatMap((ancho) =>
					MOTIVOS.map((motivo) => probarCombo(navegador, nombre, url, referencias.get(`${ancho.nombre}-${motivo.nombre}`), ancho, motivo)),
				),
			);
			await navegador.close();
			return combos.flat();
		}),
	);
	return { chequeos: porNavegador.flat(), ms: Date.now() - inicio };
}
