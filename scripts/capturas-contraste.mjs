// Modo de alto contraste de Windows (forced-colors: active), a 360: el interruptor de "Qué
// resolvemos" pierde el fondo de la perilla y el texto con background-clip, así que marca cuál
// está elegido con un outline (ver QueResolvemos.astro). Este chequeo confirma que solo el label
// elegido lo tiene.
export async function revisarAltoContraste(navegador, url) {
	const inicio = Date.now();
	const contexto = await navegador.newContext({ viewport: { width: 360, height: 800 }, forcedColors: 'active', reducedMotion: 'reduce' });
	const pagina = await contexto.newPage();
	await pagina.goto(url, { waitUntil: 'load' });
	await pagina.evaluate(async () => {
		await document.fonts.ready;
	});
	await pagina.addStyleTag({ content: '*, *::before, *::after { animation: none !important; }' });
	await pagina.evaluate(() =>
		Promise.all(
			[...document.querySelectorAll('img[loading="lazy"]')].map((img) => {
				img.loading = 'eager';
				return img.decode().catch(() => {});
			}),
		),
	);
	await pagina.screenshot({ path: 'capturas/alto-contraste-360-completa.png', fullPage: true });
	const outlines = await pagina.evaluate(() =>
		[...document.querySelectorAll('.interruptor label')].map((label) => ({
			elegido: !!label.querySelector('input:checked'),
			outline: getComputedStyle(label).outlineStyle,
		})),
	);
	await contexto.close();
	const elegido = outlines.find((o) => o.elegido);
	const otro = outlines.find((o) => !o.elegido);
	const chequeos = [
		[!!elegido && elegido.outline !== 'none', `alto contraste: el label elegido tiene outline visible (outline-style: ${elegido?.outline ?? 'no encontrado'})`],
		[!!otro && otro.outline === 'none', `alto contraste: el label no elegido no tiene outline (outline-style: ${otro?.outline ?? 'no encontrado'})`],
	];
	return { chequeos, ms: Date.now() - inicio };
}
