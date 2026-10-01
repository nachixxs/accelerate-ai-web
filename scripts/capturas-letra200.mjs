// Letra del navegador al 200 % real (WCAG 1.4.4 y 1.4.10), con CDP Page.setFontSizes: escala los
// rem y las media queries en em como lo hace Chrome, algo que un simple `html { font-size: 200% }`
// no reproduce. Recorre la página entera con scroll, de a una pantalla, y en cada parada confirma
// que document.documentElement.scrollWidth no supera el clientWidth (si lo supera, algo se corta
// sin avisar: el proyecto usa overflow-x: clip en vez de scroll).
const ANCHOS = [360, 320];
const ALTO_VENTANA = 800;

// El texto que se sale, no la caja del elemento (que puede medir 320px y aun así desbordar por
// dentro): mismo método que el script de referencia (08-desborde.mjs). Se excluye lo pensado para
// quedar fuera de la vista o cortado a propósito: el texto para lectores de pantalla
// (.solo-lector, position off-screen), la cinta de rubros (se mueve entera, mask-image en los
// costados) y lo aria-hidden. Lo cortado a propósito dentro de un mock (la fila de módulos del
// tablero, con su propio mask-image) se nombra igual, marcado "[mock]", para que quede visible sin
// contarlo como el mismo tipo de bug que un párrafo que se corta de verdad.
async function elementosQueSeSalen(pagina) {
	return pagina.evaluate(() => {
		const vw = innerWidth;
		const nombre = (el) => (el.className && typeof el.className === 'string' && el.className ? `.${el.className.trim().split(/\s+/)[0]}` : el.tagName);
		const encontrados = [];
		const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
		for (let n = walker.nextNode(); n; n = walker.nextNode()) {
			if (!n.textContent.trim()) continue;
			const el = n.parentElement;
			if (!el || el.closest('.solo-lector, .rubros__pista, [aria-hidden="true"], script, style')) continue;
			const r = document.createRange();
			r.selectNodeContents(n);
			const rects = [...r.getClientRects()].filter((q) => q.width > 1);
			if (!rects.length) continue;
			const right = Math.max(...rects.map((x) => x.right));
			const left = Math.min(...rects.map((x) => x.left));
			if (right > vw + 1 || left < -1) {
				encontrados.push({
					texto: n.textContent.trim().slice(0, 40),
					clase: nombre(el),
					right: Math.round(right),
					mock: !!el.closest('.modulos, .stock, [role="img"]'),
				});
			}
		}
		// Primero lo que no es de un mock (más probable que sea un bug real), y recién después lo
		// cortado a propósito dentro de un mock: si no, la fila de módulos del tablero (varios
		// elementos, muy anchos) tapa todo lo demás en el top 5.
		const porDerecha = (a, b) => b.right - a.right;
		const reales = encontrados.filter((p) => !p.mock).sort(porDerecha);
		const mocks = encontrados.filter((p) => p.mock).sort(porDerecha);
		return [...reales, ...mocks].slice(0, 5).map((p) => `${p.mock ? '[mock] ' : ''}${p.clase} "${p.texto}" (llega a ${p.right}px)`);
	});
}

async function revisarUnAncho(navegador, url, width, prefijo) {
	const contexto = await navegador.newContext({ viewport: { width, height: ALTO_VENTANA }, reducedMotion: 'reduce' });
	const pagina = await contexto.newPage();
	const cdp = await contexto.newCDPSession(pagina);
	await cdp.send('Page.enable');
	// standard y fixed al 200 % de los valores por default del navegador (16 px y 13 px).
	await cdp.send('Page.setFontSizes', { fontSizes: { standard: 32, fixed: 26 } });
	await pagina.goto(url, { waitUntil: 'load' });
	await pagina.evaluate(async () => {
		await document.fonts.ready;
	});
	await pagina.addStyleTag({ content: '*, *::before, *::after { animation: none !important; }' });
	const alto = await pagina.evaluate(() => document.documentElement.scrollHeight);

	let clientWidth = width;
	let anchoMaximo = width;
	let fallas = 0;
	let primeraFallaY = null;
	let ultimaFallaY = null;
	for (let y = 0; y <= alto; y += ALTO_VENTANA) {
		await pagina.evaluate((y) => scrollTo(0, y), y);
		await pagina.waitForTimeout(100);
		const medida = await pagina.evaluate(() => ({
			scrollWidth: document.documentElement.scrollWidth,
			clientWidth: document.documentElement.clientWidth,
		}));
		clientWidth = medida.clientWidth;
		anchoMaximo = Math.max(anchoMaximo, medida.scrollWidth);
		if (medida.scrollWidth > medida.clientWidth) {
			fallas++;
			primeraFallaY ??= y;
			ultimaFallaY = y;
		}
	}

	let salidos = [];
	if (fallas) {
		await pagina.evaluate(() => scrollTo(0, 0));
		salidos = await elementosQueSeSalen(pagina);
		await pagina.screenshot({ path: `capturas/${prefijo}letra-200-${width}px-desborde.png`, fullPage: true });
	}
	await contexto.close();
	return { clientWidth, anchoMaximo, fallas, primeraFallaY, ultimaFallaY, salidos };
}

export async function revisarLetra200(navegador, url, prefijo = '') {
	const inicio = Date.now();
	const porAncho = await Promise.all(ANCHOS.map(async (width) => ({ width, r: await revisarUnAncho(navegador, url, width, prefijo) })));
	const chequeos = [];
	for (const { width, r } of porAncho) {
		if (!r.fallas) {
			chequeos.push([true, `letra al 200 % en ${width}px: sin scroll horizontal en todo el recorrido`]);
			continue;
		}
		chequeos.push([
			false,
			`letra al 200 % en ${width}px: scrollWidth llega a ${r.anchoMaximo}px (viewport ${r.clientWidth}px) en ${r.fallas} parada(s) de scroll, de y=${r.primeraFallaY}px a y=${r.ultimaFallaY}px. Elementos que más se salen: ${r.salidos.join(', ') || 'sin elemento identificado'}`,
		]);
	}
	return { chequeos, ms: Date.now() - inicio };
}
