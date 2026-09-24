// Capturas de la web en celular (360 px) y escritorio (1280 px), más los chequeos que una
// captura no muestra a simple vista. Uso: npm run capturas (compila antes). Salida en capturas/.
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
	await pagina.screenshot({ path: `capturas/${nombre}-completa.png`, fullPage: true });

	const medidas = await pagina.evaluate(() => {
		const boton = document.querySelector('header a[href^="https://wa.me"]').getBoundingClientRect();
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

	console.log(`\n${nombre}`);
	for (const [ok, texto] of chequeos) {
		console.log(`  ${ok ? 'ok   ' : 'FALLA'} ${texto}`);
		if (!ok) fallas++;
	}
	await pagina.close();
}

await navegador.close();
await servidor.stop();
console.log(`\nCapturas en capturas/. ${fallas ? `${fallas} chequeo(s) fallaron.` : 'Todos los chequeos pasan.'}`);
process.exitCode = fallas ? 1 : 0;
