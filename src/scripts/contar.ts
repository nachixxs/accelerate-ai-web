// Cifras que cuentan: el HTML trae el valor final (así se ve sin JavaScript y con movimiento
// reducido) y, cuando el elemento entra en pantalla, cuenta hasta él una sola vez.

export const pesos = (n: number) => `$ ${Math.round(n).toLocaleString('es-AR')}`;
export const unidades = (n: number) => Math.round(n).toLocaleString('es-AR');

export const movimientoReducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Un conteo por elemento a la vez: si se pide uno nuevo mientras el anterior sigue corriendo (ej.
// clic en "Reponer" durante el conteo inicial de contarAlVer), se corta el viejo antes de arrancar.
const cortes = new WeakMap<HTMLElement, () => void>();

// Anima el texto de `el` de `desde` a `hasta`, con salida suave. Devuelve una función que la corta.
export function contar(el: HTMLElement, desde: number, hasta: number, formato: (n: number) => string, ms = 900) {
	cortes.get(el)?.();
	const inicio = performance.now();
	let cuadro = 0;
	const paso = (ahora: number) => {
		const t = Math.min(1, Math.max(0, (ahora - inicio) / ms));
		el.textContent = formato(desde + (hasta - desde) * (1 - (1 - t) ** 3));
		if (t < 1) cuadro = requestAnimationFrame(paso);
		else cortes.delete(el);
	};
	cuadro = requestAnimationFrame(paso);
	const cortar = () => cancelAnimationFrame(cuadro);
	cortes.set(el, cortar);
	return cortar;
}

// Cada elemento con data-valor cuenta cuando se ve entero, con 80 ms entre uno y otro. Parte de
// data-desde (0 si no está, como Reponer del stock). `esperar`, si se pasa, es una promesa a
// esperar antes de arrancar el conteo (ej. que termine la animación de entrada de la tarjeta):
// se ignora cualquier rechazo, así que si no hay nada que esperar arranca enseguida.
export function contarAlVer(elementos: HTMLElement[], formato: (n: number) => string, esperar?: () => Promise<unknown>) {
	if (movimientoReducido() || !elementos.length) return;
	const desdeDe = (el: HTMLElement) => Number(el.dataset.desde ?? 0);
	elementos.forEach((el) => (el.textContent = formato(desdeDe(el))));
	const arrancar = () =>
		elementos.forEach((el, i) => setTimeout(() => contar(el, desdeDe(el), Number(el.dataset.valor), formato), i * 80));
	const observador = new IntersectionObserver(
		(entradas) => {
			const [entrada] = entradas;
			// Si al cargar el elemento ya quedó arriba de la pantalla (scroll restaurado por el
			// navegador), el valor final directo: si no, se queda en el de partida hasta volver a
			// pasar por acá.
			if (entrada.boundingClientRect.bottom < 0) {
				observador.disconnect();
				elementos.forEach((el) => (el.textContent = formato(Number(el.dataset.valor))));
				return;
			}
			if (!entradas.some((e) => e.isIntersecting)) return;
			observador.disconnect();
			if (esperar) Promise.resolve(esperar()).catch(() => {}).then(arrancar);
			else arrancar();
		},
		{ threshold: 0.6 },
	);
	observador.observe(elementos[0]);
}
