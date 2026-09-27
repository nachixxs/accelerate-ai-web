// Barrido de accesibilidad con axe-core, en el estado final: movimiento reducido y animaciones
// apagadas (mismo truco que capturas.mjs: la base sin animar ya es el layout terminado). Falla
// con cualquier violación "serious" o "critical".
import AxeBuilder from '@axe-core/playwright';

const ANCHOS = [360, 1280];

// La cinta de rubros se funde en los dos costados con mask-image (Rubros.astro): decisión de
// marca del usuario, no un bug, y por construcción baja el contraste de las fichas que entran y
// salen. axe no distingue esa mancha del resto de la ficha, así que se excluye su ventana.
//
// La fila de módulos del tablero (MockPanel.astro, .modulos, mismo truco de mask-image que la
// cinta) da un falso positivo distinto: axe mide el texto muted (#8a97b3) contra #f7f9fc (el
// fondo claro de la página), no contra el fondo real (#111b30, el navy de .ventana), porque
// .modulos y sus ancestros hasta ahí tienen background transparente y axe no sube más para
// buscarlo. A mano, con la fórmula de WCAG, #8a97b3 sobre #111b30 da 5,85:1 (pasa AA, que pide
// 4,5:1): no es un problema de contraste real, es que axe no encuentra el fondo. Se excluye para
// no repetir este falso positivo en cada corrida; si el texto muted o el fondo de .ventana
// cambian, hay que volver a medir a mano.
const EXCLUIDOS = ['.rubros__ventana', '.modulos'];

async function revisarUnAncho(navegador, url, width) {
	const contexto = await navegador.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
	const pagina = await contexto.newPage();
	await pagina.goto(url, { waitUntil: 'load' });
	await pagina.evaluate(async () => {
		await document.fonts.ready;
	});
	await pagina.addStyleTag({ content: '*, *::before, *::after { animation: none !important; }' });
	const builder = new AxeBuilder({ page: pagina });
	for (const excluido of EXCLUIDOS) builder.exclude(excluido);
	const resultado = await builder.analyze();
	await contexto.close();
	return resultado.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
}

export async function revisarAxe(navegador, url) {
	const inicio = Date.now();
	const porAncho = await Promise.all(ANCHOS.map(async (width) => ({ width, graves: await revisarUnAncho(navegador, url, width) })));
	const chequeos = [];
	for (const { width, graves } of porAncho) {
		if (!graves.length) {
			chequeos.push([true, `axe a ${width}px: sin violaciones serias ni críticas`]);
			continue;
		}
		for (const v of graves) {
			for (const nodo of v.nodes) {
				chequeos.push([false, `axe a ${width}px: ${v.id} (${v.impact}) en ${nodo.target.join(' ')}`]);
			}
		}
	}
	return { chequeos, ms: Date.now() - inicio };
}
