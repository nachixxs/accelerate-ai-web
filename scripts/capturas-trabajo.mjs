// Chequeos de #trabajo (el escenario con los celulares, la conversación, el selector y el mes de prueba),
// a 360, 768, 1024 y 1280, en su estado final de tres maneras: con movimiento (después de llegar con el
// scroll y esperar a que termine), con movimiento reducido y sin JS. Mide lo que una captura no avisa:
// sin desborde, el sello de demo montado en el borde del escenario y a la vista, las burbujas sin tapar
// las pantallas de los celulares, la columna de texto centrada en alto contra el escenario (desde 1024),
// el selector sin pegarse a la conversación, y las cifras en el valor que dice el HTML (no en 0).
// Con JS, además, elegir otra pantalla la trae al frente y deja la conversación fuera del foco, y las marcas
// del mes esperan a ver la barra de arqueos para viajar (revisarViaje).
const ANCHOS = [360, 768, 1024, 1280];
const MODOS = ['movimiento', 'reducido', 'sin JS'];

// Todo lo que se mide del estado final, en una sola pasada.
const medir = (pagina) =>
	pagina.evaluate(() => {
		const caja = (el) => el.getBoundingClientRect();
		const un = (s) => document.querySelector(`#trabajo ${s}`);
		const pisa = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
		const escenario = caja(un('.escenario'));
		const sello = un('.sello');
		const s = caja(sello);
		const intro = caja(un('.trabajo__intro'));
		const selector = caja(un('.selector'));
		const resp = caja(un('.resp'));
		const pantallas = [...document.querySelectorAll('#trabajo .cel__img')].map(caja);
		const burbujas = ['.preg', '.resp'].map((b) => caja(un(b)));
		const mes = un('[data-mes]');
		return {
			ancho: document.documentElement.scrollWidth,
			sello: {
				montado: s.top < escenario.top && escenario.top < s.bottom,
				dentro: s.left >= 0 && s.right <= innerWidth,
				visible: getComputedStyle(sello).opacity === '1' && getComputedStyle(sello).visibility === 'visible',
				texto: sello.textContent.trim(),
			},
			pantallas: pantallas.length,
			solape: Math.round(Math.max(...burbujas.flatMap((b) => pantallas.map((p) => pisa(b, p))))),
			// Desde 1024: aire arriba de la columna (título) y abajo (selector) contra el escenario.
			centrado: [Math.round(intro.top - escenario.top), Math.round(escenario.bottom - selector.bottom)],
			// Debajo de 1024 el selector va después de la conversación, que cruza el borde de abajo del escenario.
			aire: Math.round(selector.top - Math.max(resp.bottom, escenario.bottom)),
			numero: [un('[data-numero]').textContent.trim(), un('[data-numero]').dataset.final],
			dif: [un('[data-dif-n]').textContent.trim(), mes.dataset.dif],
			armado: [un('.escenario').hasAttribute('data-entra'), un('[data-conv]').hasAttribute('data-habla')],
			// Con JS los dos lienzos dibujados (.listo) y ninguna capa de partículas suelta; sin JS, la barra de CSS con
			// una marca por arqueo y los de diferencia en cian (--cyan-600).
			lienzos: [mes.querySelectorAll('canvas').length, mes.querySelectorAll('canvas.listo').length],
			barraCss: (() => {
				const b = mes.querySelector('[data-barra]');
				return getComputedStyle(b).backgroundImage.includes('rgb(10, 145, 168)') && b.style.getPropertyValue('--n') === mes.dataset.arqueos;
			})(),
		};
	});

async function revisarCaso(navegador, url, width, modo) {
	const contexto = await navegador.newContext({
		viewport: { width, height: 800 },
		reducedMotion: modo === 'reducido' ? 'reduce' : 'no-preference',
		javaScriptEnabled: modo !== 'sin JS',
	});
	const pagina = await contexto.newPage();
	const errores = [];
	pagina.on('pageerror', (e) => errores.push(String(e)));
	await pagina.goto(url, { waitUntil: 'load' });
	await pagina.evaluate(() => (document.documentElement.style.scrollBehavior = 'auto'));

	// Llega como quien scrollea: el escenario y después el mes entran a la pantalla y se arman.
	const recorrer = async (selector) => {
		await pagina.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), selector);
		await pagina.waitForTimeout(100);
	};
	await recorrer('#trabajo .escenario');
	if (modo === 'movimiento') {
		await pagina.waitForFunction(() => !document.querySelector('#trabajo .escenario').hasAttribute('data-entra') && !document.querySelector('#trabajo [data-conv]').hasAttribute('data-habla'), null, { timeout: 8000 }).catch(() => {});
	}
	await recorrer('#trabajo [data-mes]');
	if (modo === 'movimiento') {
		await pagina.waitForFunction(() => {
			const mes = document.querySelector('#trabajo [data-mes]');
			return mes.querySelector('[data-numero]').textContent === mes.querySelector('[data-numero]').dataset.final && mes.querySelector('[data-dif-n]').textContent === mes.dataset.dif && mes.querySelectorAll('canvas').length === 2;
		}, null, { timeout: 8000 }).catch(() => {});
	}
	// Las transiciones que quedan (la burbuja, los celulares) terminan antes de medir. Las atadas al
	// scroll (.revelar) no terminan nunca por sí solas: quedan afuera.
	await pagina.evaluate(() => Promise.allSettled(document.getElementById('trabajo').getAnimations({ subtree: true }).filter((a) => a.timeline instanceof DocumentTimeline).map((a) => a.finished)));
	await pagina.evaluate(() => document.querySelector('#trabajo .escenario').scrollIntoView({ block: 'center' }));
	const m = await medir(pagina);

	// Con JS: elegir "Arqueo" lo trae al frente, marca el botón y saca la conversación del foco; volver deja todo como estaba.
	let selector = null;
	if (modo !== 'sin JS') {
		const elegir = (id) => pagina.locator(`#trabajo [data-sel="${id}"] button`).click();
		await elegir('arqueo');
		const arqueo = await pagina.evaluate(() => {
			const e = document.querySelector('#trabajo .escenario');
			return e.dataset.frente === 'arqueo' && document.querySelector('#trabajo [data-cel="arqueo"]').dataset.pose === 'frente' && document.querySelector('#trabajo [data-sel="arqueo"] button').getAttribute('aria-pressed') === 'true' && document.querySelector('#trabajo [data-conv]').inert;
		});
		await elegir('asistente');
		const vuelta = await pagina.evaluate(() => document.querySelector('#trabajo .escenario').dataset.frente === 'asistente' && !document.querySelector('#trabajo [data-conv]').inert);
		selector = arqueo && vuelta;
	}
	await contexto.close();

	const et = `${width} px, ${modo}`;
	const chequeos = [
		[m.ancho <= width && errores.length === 0, `${et}: sin desborde (${m.ancho} px) ni errores${errores.length ? ': ' + errores.join(' | ') : ''}`],
		[m.sello.montado && m.sello.dentro && m.sello.visible && m.sello.texto === 'Demo con datos simulados', `${et}: el sello "Demo con datos simulados" se ve, montado en el borde del escenario`],
		[m.pantallas === 3 && m.solape === 0, `${et}: las burbujas no tapan las pantallas de los ${m.pantallas} celulares (${m.solape} px² de solape)`],
		[m.numero[0] === m.numero[1] && m.dif[0] === m.dif[1] && !m.armado[0] && !m.armado[1], `${et}: estado final (${m.numero[0]} movimientos, ${m.dif[0]} con diferencia, la escena y la conversación completas)`],
		modo === 'sin JS'
			? [m.lienzos[1] === 0 && m.barraCss, `${et}: la barra de arqueos se ve sin JS, con una marca por arqueo y las de diferencia en cian`]
			: [m.lienzos[0] === 2 && m.lienzos[1] === 2, `${et}: el campo de marcas y la barra quedan dibujados (${m.lienzos[1]} de ${m.lienzos[0]} lienzos)`],
	];
	if (width >= 1024) {
		const [arriba, abajo] = m.centrado;
		chequeos.push([Math.abs(arriba - abajo) <= 8, `${et}: la columna de texto queda centrada contra el escenario (${arriba} px arriba, ${abajo} abajo)`]);
	} else {
		chequeos.push([m.aire >= 16 && m.aire <= 96, `${et}: el selector va debajo de la conversación sin pegarse ni dejar un hueco (${m.aire} px)`]);
	}
	if (selector !== null) chequeos.push([selector, `${et}: el selector trae "Arqueo" al frente y vuelve al asistente`]);
	return chequeos;
}

// #7: las marcas del mes salen cuando la barra de arqueos está a la vista, no antes. Un lector llega hasta que
// arranca el conteo con la barra todavía debajo del borde: las marcas no salen; al bajar hasta verla,
// viajan y la barra termina completa. Si baja de golpe y la barra queda arriba, va al valor final sin viaje.
async function revisarViaje(navegador, url, width) {
	const nuevaPagina = async () => {
		const contexto = await navegador.newContext({ viewport: { width, height: 480 }, reducedMotion: 'no-preference' });
		const pagina = await contexto.newPage();
		await pagina.goto(url, { waitUntil: 'load' });
		await pagina.evaluate(() => (document.documentElement.style.scrollBehavior = 'auto'));
		return [contexto, pagina];
	};
	const estado = (pagina) =>
		pagina.evaluate(() => {
			const mes = document.querySelector('#trabajo [data-mes]');
			const b = mes.querySelector('[data-barra]').getBoundingClientRect();
			const n = mes.querySelector('[data-numero]');
			const lienzo = mes.querySelector('[data-barra]');
			const pintada = lienzo.getContext('2d').getImageData(0, 0, lienzo.width, lienzo.height).data.some((v, i) => i % 4 === 3 && v > 0);
			return { pintada, lienzos: mes.querySelectorAll('canvas').length, cuenta: n.textContent, final: n.dataset.final, dif: [mes.querySelector('[data-dif-n]').textContent, mes.dataset.dif], visible: b.top >= 0 && b.bottom <= innerHeight };
		});
	const terminado = () => {
		const m = document.querySelector('#trabajo [data-mes]');
		const n = m.querySelector('[data-numero]');
		return m.querySelectorAll('canvas').length === 2 && n.textContent === n.dataset.final && m.querySelector('[data-dif-n]').textContent === m.dataset.dif;
	};
	const et = `${width} px, viaje de las marcas`;

	const [contexto, pagina] = await nuevaPagina();
	// La barra queda justo debajo del borde (24 px); el bloque se ve de sobra para que arranque el conteo.
	await pagina.evaluate(() => scrollTo(0, document.querySelector('#trabajo [data-barra]').getBoundingClientRect().bottom + scrollY - innerHeight - 24));
	await pagina.waitForFunction(() => document.querySelector('#trabajo [data-numero]').textContent !== '0', null, { timeout: 3000 }).catch(() => {});
	const arranque = await estado(pagina);
	await pagina.waitForTimeout(3500); // el conteo, la pausa y el fundido: el viaje saldría si no esperara
	const espera = await estado(pagina);
	await pagina.evaluate(() => document.querySelector('#trabajo [data-barra]').scrollIntoView({ block: 'center' }));
	// Sale con la barra a la vista (se mira en cada cuadro) y termina completa.
	const sale = await pagina.waitForFunction(() => { const b = document.querySelector('#trabajo [data-barra]').getBoundingClientRect(); return document.querySelectorAll('#trabajo [data-mes] canvas').length === 3 && b.top >= 0 && b.bottom <= innerHeight; }, null, { timeout: 3000, polling: 'raf' }).then(() => true, () => false);
	const completo = await pagina.waitForFunction(terminado, null, { timeout: 6000 }).then(() => true, () => false);
	await contexto.close();

	// Scroll de golpe hasta pasar de largo el bloque: espera sin quedar a medias; al volver a verla, viaja una sola vez.
	const [contexto2, p2] = await nuevaPagina();
	await p2.evaluate(() => scrollTo(0, document.querySelector('#trabajo [data-mes]').getBoundingClientRect().top + scrollY - innerHeight * 0.2));
	await p2.waitForFunction(() => document.querySelector('#trabajo [data-numero]').textContent !== '0', null, { timeout: 3000 }).catch(() => {}); // arrancó el conteo; la barra todavía no entra
	await p2.evaluate(() => scrollTo(0, document.querySelector('#trabajo [data-mes]').getBoundingClientRect().bottom + scrollY + 100));
	await p2.waitForTimeout(3500);
	const quieta = await estado(p2);
	await p2.evaluate(() => document.querySelector('#trabajo [data-barra]').scrollIntoView({ block: 'center' }));
	const vuelve = await p2.waitForFunction(() => document.querySelectorAll('#trabajo [data-mes] canvas').length === 3, null, { timeout: 3000, polling: 'raf' }).then(() => true, () => false);
	const cierra = await p2.waitForFunction(terminado, null, { timeout: 6000 }).then(() => true, () => false);
	await contexto2.close();

	return [
		[!arranque.visible && arranque.lienzos === 2 && espera.lienzos === 2 && !espera.pintada && !espera.visible && espera.cuenta === espera.final, `${et}: con la barra fuera de vista no sale ninguna marca (conteo en ${espera.cuenta}, barra ${espera.pintada ? 'con marcas' : 'vacía'})`],
		[sale && completo, `${et}: al ver la barra las marcas viajan (${sale ? 'salen' : 'no salen'}) y la barra termina completa (${completo ? 'sí' : 'no'})`],
		[quieta.lienzos === 2 && !quieta.pintada && quieta.cuenta === quieta.final && vuelve && cierra, `${et}: si el scroll pasa de largo la barra, espera sin quedar a medias y viaja al volver a verla`],
	];
}

export async function revisarTrabajo(navegador, url) {
	const inicio = Date.now();
	const casos = await Promise.all([...ANCHOS.flatMap((w) => MODOS.map((modo) => revisarCaso(navegador, url, w, modo))), ...[360, 768, 1280].map((w) => revisarViaje(navegador, url, w))]);
	return { chequeos: casos.flat(), ms: Date.now() - inicio };
}
