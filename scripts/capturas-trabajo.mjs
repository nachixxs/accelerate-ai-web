// Chequeos de #trabajo (el escenario con los celulares, la conversación, el selector y el mes de prueba),
// a 360, 768, 1024 y 1280, en su estado final de tres maneras: con movimiento (después de llegar con el
// scroll y esperar a que termine), con movimiento reducido y sin JS. Mide lo que una captura no avisa:
// sin desborde, el sello de demo montado en el borde del escenario y a la vista, las burbujas sin tapar
// las pantallas de los celulares, la columna de texto centrada en alto contra el escenario (desde 1024),
// el selector sin pegarse a la conversación, y las cifras en el valor que dice el HTML (no en 0).
// Con JS, además, elegir otra pantalla la trae al frente y deja la conversación fuera del foco.
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

export async function revisarTrabajo(navegador, url) {
	const inicio = Date.now();
	const casos = await Promise.all(ANCHOS.flatMap((w) => MODOS.map((modo) => revisarCaso(navegador, url, w, modo))));
	return { chequeos: casos.flat(), ms: Date.now() - inicio };
}
