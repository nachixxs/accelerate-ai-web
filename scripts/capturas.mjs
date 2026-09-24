// Capturas de la web en celular (360 px) y escritorio (1280 px), más los chequeos que una
// captura no muestra a simple vista. Uso: npm run capturas (compila antes). Salida en capturas/.
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

	await pagina.screenshot({ path: `capturas/${nombre}-primera-pantalla.png` });
	// La captura completa no hace scroll: sin esto, las imágenes lazy (el logo del pie) no cargan.
	await pagina.evaluate(() => Promise.all([...document.querySelectorAll('img[loading="lazy"]')].map((img) => {
		img.loading = 'eager';
		return img.decode();
	})));
	await pagina.screenshot({ path: `capturas/${nombre}-completa.png`, fullPage: true });

	const medidas = await pagina.evaluate(() => {
		const boton = document.querySelector('.portada a[href^="https://wa.me"]').getBoundingClientRect();
		const chicos = [...document.querySelectorAll('a, summary')]
			.map((el) => ({ texto: el.textContent.trim().slice(0, 40), caja: el.getBoundingClientRect() }))
			.filter(({ caja }) => caja.height < 44)
			.map(({ texto, caja }) => `"${texto}" (${Math.round(caja.height)} px de alto)`);
		return {
			anchoPagina: document.documentElement.scrollWidth,
			botonDerecha: Math.round(boton.right),
			botonAncho: Math.round(boton.width),
			botonAbajo: Math.round(boton.bottom),
			chicos,
		};
	});

	const chequeos = [
		[medidas.anchoPagina <= width, `sin scroll horizontal (página de ${medidas.anchoPagina} px)`],
		[medidas.botonDerecha <= width - 16, `el botón entra con el margen (${medidas.botonAncho} px de ancho, termina en ${medidas.botonDerecha} px)`],
		[medidas.botonAbajo <= height, `el botón de la portada se ve sin scroll (termina en ${medidas.botonAbajo} de ${height} px)`],
		[medidas.chicos.length === 0, `áreas táctiles de 44 px o más${medidas.chicos.length ? ': ' + medidas.chicos.join(', ') : ''}`],
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
	await pagina.close();
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
