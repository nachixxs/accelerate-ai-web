// Chequeos de /legal (privacidad y términos), a 360 y 1280, con y sin `reducedMotion: 'reduce'`:
// carga limpia, sin desborde, una sola h1 con títulos en orden, índice con anclas que existen y títulos
// que quedan debajo de la cápsula, links del encabezado y del pie que llevan a la portada, link del pie
// de la portada que lleva a /legal, sin el azul #2971f2 ni rayas, un solo glow, la card montada sobre el
// borde de la franja. Suma axe, la letra al 200 % y el alto contraste sobre /legal. Avisa (sin fallar)
// si quedan marcadores [...]: la página no se publica con ellos.
import { revisarAxe } from './capturas-axe.mjs';
import { revisarLetra200 } from './capturas-letra200.mjs';
import { terminarCarga } from './capturas-utils.mjs';

const ANCHOS = [360, 1280];
const SECCIONES = ['resolvemos', 'sistemas', 'proceso', 'tiempo', 'preguntas'];
// Desde 1080 px (67,5 em) los links de sección van en la cápsula, sin menú; antes, en el menú. "Tu tiempo" solo está en el menú.
const enCapsula = (width, id) => width >= 1080 && id !== 'tiempo';

async function nuevaPagina(navegador, width, reducir, opciones = {}) {
	const contexto = await navegador.newContext({ viewport: { width, height: 800 }, reducedMotion: reducir ? 'reduce' : 'no-preference', ...opciones });
	const pagina = await contexto.newPage();
	const errores = [];
	pagina.on('console', (m) => m.type() === 'error' && errores.push(m.text()));
	pagina.on('pageerror', (e) => errores.push(String(e)));
	return { contexto, pagina, errores };
}

// El © es lo último del pie: ningún otro elemento de la fila termina más abajo (portada y /legal).
const ultimoDelPie = () => {
	const legal = document.querySelector('.pie__legal').getBoundingClientRect().bottom;
	return [...document.querySelectorAll('.pie__base > *')].every((el) => el.getBoundingClientRect().bottom <= legal + 1);
};

// Los links de la fila del pie, en el orden del DOM (el del Tab), se ven en el mismo orden: más abajo
// en la columna (menos de 768 px) o más a la derecha en la fila.
const focoEnOrden = () => {
	const eje = innerWidth >= 768 ? 'left' : 'top';
	const links = [...document.querySelectorAll('.pie__base a')];
	return links.length === 2 && links.every((a, i) => i === 0 || a.getBoundingClientRect()[eje] > links[i - 1].getBoundingClientRect()[eje]);
};

// Mide todo lo que se puede leer de /legal sin navegar.
const medirPagina = (pagina) =>
	pagina.evaluate(() => {
		const caja = (el) => el.getBoundingClientRect();
		const niveles = [...document.querySelectorAll('h1, h2, h3')].map((h) => +h.tagName[1]);
		const anclas = [...document.querySelectorAll('.indice a')].map((a) => {
			const destino = document.getElementById(a.hash.slice(1));
			return { id: a.hash, existe: !!destino, igual: destino?.textContent.trim() === a.textContent.trim() };
		});
		// El isotipo del encabezado lleva la A en #2971f2 (la versión claro de la marca): no cuenta.
		const azul = [...document.body.querySelectorAll('*:not(.isotipo *)')].filter((el) => {
			const e = getComputedStyle(el);
			return [e.color, e.backgroundColor, e.borderTopColor, e.fill].includes('rgb(41, 113, 242)');
		});
		const corta = caja(document.querySelector('.corta'));
		const franja = caja(document.querySelector('.cabecera__franja'));
		const texto = document.querySelector('main').innerText;
		return {
			ancho: [document.documentElement.scrollWidth, document.documentElement.clientWidth],
			h1: document.querySelectorAll('h1').length,
			ordenOk: niveles.every((n, i) => i === 0 || n - niveles[i - 1] <= 1),
			anclas, inicio: !!document.getElementById('inicio'), contenido: !!document.querySelector('main#contenido'),
			rayas: /[–—]/.test(document.body.innerText), azul: azul.length, glows: document.querySelectorAll('.glow').length,
			montada: corta.top < franja.bottom && franja.bottom < corta.bottom,
			marcadores: [...new Set(texto.match(/\[[^\]]+\]/g) ?? [])],
			// Los links en medio de una oración quedan afuera de las áreas de 44 px (WCAG 2.5.8).
			chicos: [...document.querySelectorAll('a')].filter((a) => !a.closest('.parte p, .parte li') && caja(a).height > 0 && caja(a).height < 44).map((a) => a.textContent.trim()),
			// Sin timeline de sección, ningún link de la cápsula tiene que verse como el activo.
			activo: [...document.querySelectorAll('.capsula__nav a')].some((a) => getComputedStyle(a).color !== 'rgb(51, 65, 85)' || getComputedStyle(a, '::before').opacity !== '0' || getComputedStyle(a, '::after').opacity !== '0'),
			cta: document.querySelector('.capsula__cta').classList.contains('capsula__cta--lleno'),
		};
	});

// Al llegar por el índice, cada título tiene que quedar entero debajo de la cápsula.
const titulosBajoCapsula = (pagina) =>
	pagina.evaluate(() => {
		document.documentElement.style.scrollBehavior = 'auto';
		const capsula = document.querySelector('.capsula').getBoundingClientRect().bottom;
		return [...document.querySelectorAll('.indice a')].filter((a) => {
			location.hash = a.hash;
			const arriba = document.querySelector(a.hash).getBoundingClientRect().top;
			return arriba < capsula || arriba > innerHeight / 2;
		}).map((a) => a.hash);
	});

// Los links de la cápsula (o del menú, en el celular), el logo y los del pie llevan a la sección de la portada.
// Adónde lleva un link no depende del movimiento (el scroll suave se apaga acá): se corre una vez por ancho.
async function revisarLinks(navegador, url, width) {
	const fallas = [];
	const { contexto, pagina } = await nuevaPagina(navegador, width, false);
	const pruebas = [
		...SECCIONES.filter((id) => width < 1080 || enCapsula(width, id)).map((id) => [id, width < 1080 ? `#menu a[href="/#${id}"]` : `.capsula__nav a[href="/#${id}"]`, width < 1080]),
		...SECCIONES.map((id) => [id, `.pie a[href="/#${id}"]`, false]),
		['inicio', '.capsula__logo', false],
	];
	for (const [id, selector, menu] of pruebas) {
		await pagina.goto(url + 'legal/', { waitUntil: 'domcontentloaded' });
		// Sin scroll suave, para que el scroll hasta el link sea inmediato.
		await pagina.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
		if (menu) await pagina.locator('.capsula .capsula__menu').click();
		// Los links del pie entran con el scroll: se espera a que el pie termine de asentarse antes del clic.
		if (selector.startsWith('.pie')) await pagina.locator(selector).scrollIntoViewIfNeeded().then(() => pagina.waitForTimeout(400));
		// 'commit': la portada tarda en cargar con los otros chequeos corriendo; lo que importa es adónde va y dónde queda el scroll.
		await Promise.all([pagina.waitForURL((u) => u.pathname === '/' && u.hash === `#${id}`, { timeout: 15000, waitUntil: 'commit' }), pagina.locator(selector).click()]).catch(() => {});
		await pagina.waitForFunction((i) => Math.abs(document.getElementById(i)?.getBoundingClientRect().top ?? 9999) < 200, id, { timeout: 10000 }).catch(() => {});
		const [ruta, arriba] = await pagina.evaluate((i) => [location.pathname + location.hash, Math.round(document.getElementById(i)?.getBoundingClientRect().top ?? 9999)], id);
		if (ruta !== `/#${id}` || Math.abs(arriba) >= 200) fallas.push(`${selector} termina en ${ruta} con la sección a ${arriba} px`);
	}
	// Desde la portada, el link del pie lleva a /legal.
	await pagina.goto(url, { waitUntil: 'load' });
	await Promise.all([pagina.waitForURL((u) => u.pathname === '/legal/', { timeout: 15000 }), pagina.locator('.pie a[href="/legal/"]').click()]).catch(() => {});
	const titulo = await pagina.locator('h1').first().textContent().catch(() => '');
	if (!pagina.url().endsWith('/legal/') || titulo !== 'Privacidad y términos') fallas.push(`el link del pie de la portada termina en ${pagina.url()}`);
	// En la portada el © también es lo último de la fila del pie.
	await pagina.goto(url, { waitUntil: 'load' });
	if (!(await pagina.evaluate(ultimoDelPie))) fallas.push('en la portada, algo del pie termina más abajo que el ©');
	if (!(await pagina.evaluate(focoEnOrden))) fallas.push('en la portada, el foco de la fila del pie no sigue el orden en que se ve');
	await contexto.close();
	return fallas;
}

async function revisarCombinacion(navegador, url, width, reducir) {
	const etiqueta = `/legal a ${width} px${reducir ? ' con movimiento reducido' : ' con movimiento'}`;
	const { contexto, pagina, errores } = await nuevaPagina(navegador, width, reducir);
	await pagina.goto(url + 'legal/', { waitUntil: 'load' });
	await terminarCarga(pagina);
	const m = await medirPagina(pagina);
	const sinAlto = await titulosBajoCapsula(pagina);
	const logos = await pagina.getByRole('link', { name: 'Accelerate.ai', exact: true }).evaluateAll((l) => l.map((a) => a.className));
	const ultimo = await pagina.evaluate(ultimoDelPie);
	// El foco, al ancho de la combinación y, en la de escritorio, justo a cada lado del corte de 768 px.
	let foco = await pagina.evaluate(focoEnOrden);
	if (width > 768) {
		for (const w of [768, 767]) {
			await pagina.setViewportSize({ width: w, height: 800 });
			foco = foco && (await pagina.evaluate(focoEnOrden));
		}
	}
	await contexto.close();
	const fallasLinks = reducir ? [] : await revisarLinks(navegador, url, width);
	const malas = m.anclas.filter((a) => !a.existe || !a.igual).map((a) => a.id);
	const chequeos = [
		[logos.length === 1 && logos[0] === 'capsula__logo', `${etiqueta}: el logo es un link con nombre accesible "Accelerate.ai"`],
		[errores.length === 0, `${etiqueta}: carga sin errores de consola${errores.length ? ': ' + errores.join(' | ') : ''}`],
		[m.ancho[0] === m.ancho[1], `${etiqueta}: sin desborde horizontal (${m.ancho[0]} de ${m.ancho[1]} px)`],
		[m.h1 === 1 && m.ordenOk, `${etiqueta}: una sola h1 y títulos en orden (h1: ${m.h1})`],
		[m.anclas.length > 0 && malas.length === 0 && m.inicio && m.contenido, `${etiqueta}: las anclas del índice existen y dicen lo mismo que su título${malas.length ? ': ' + malas.join(', ') : ''}`],
		[sinAlto.length === 0, `${etiqueta}: al llegar por el índice, los títulos quedan debajo de la cápsula${sinAlto.length ? ': ' + sinAlto.join(', ') : ''}`],
		...(reducir ? [] : [[fallasLinks.length === 0, `/legal a ${width} px: los links del encabezado y del pie llevan a su sección, el del pie de la portada a /legal y el © queda último${fallasLinks.length ? ': ' + fallasLinks.join('; ') : ''}`]]),
		[m.chicos.length === 0, `${etiqueta}: áreas táctiles de 44 px o más${m.chicos.length ? ': ' + m.chicos.join(', ') : ''}`],
		[m.azul === 0 && !m.rayas, `${etiqueta}: sin el azul #2971f2 (${m.azul} elementos) y sin rayas largas`],
		[m.glows === 1 && m.montada, `${etiqueta}: un solo glow (${m.glows}) y la card montada sobre el borde de la franja`],
		[!m.activo && m.cta && ultimo && foco, `${etiqueta}: ningún link de la cápsula se ve activo, el botón va lleno, el © es lo último del pie y el foco recorre sus links en el orden en que se ven`],
	];
	if (m.marcadores.length && width === 360 && !reducir) chequeos.push([true, `AVISO /legal: hay ${m.marcadores.length} marcadores (${m.marcadores.join(' ')}): no publicar con marcadores`]);
	return chequeos;
}

// Alto contraste de Windows: sin el fondo, la card oscura necesita su borde para verse.
async function revisarAltoContrasteLegal(navegador, url) {
	const { contexto, pagina } = await nuevaPagina(navegador, 360, true, { forcedColors: 'active' });
	await pagina.goto(url + 'legal/', { waitUntil: 'load' });
	await pagina.screenshot({ path: 'capturas/legal-alto-contraste-360.png' });
	const borde = await pagina.evaluate(() => getComputedStyle(document.querySelector('.corta')).borderTopWidth);
	await contexto.close();
	return [[parseFloat(borde) >= 1, `/legal en alto contraste: la card de la versión corta tiene borde (${borde})`]];
}

export async function revisarLegal(navegador, url) {
	const inicio = Date.now();
	const legal = url + 'legal/';
	const [combinaciones, axe, letra200, contraste] = await Promise.all([
		Promise.all(ANCHOS.flatMap((w) => [false, true].map((reducir) => revisarCombinacion(navegador, url, w, reducir)))),
		revisarAxe(navegador, legal),
		revisarLetra200(navegador, legal, 'legal-'),
		revisarAltoContrasteLegal(navegador, url),
	]);
	const con = (prefijo, { chequeos }) => chequeos.map(([ok, texto]) => [ok, `/legal ${prefijo}: ${texto}`]);
	return { chequeos: [...combinaciones.flat(), ...con('axe', axe), ...con('letra', letra200), ...contraste], ms: Date.now() - inicio };
}
