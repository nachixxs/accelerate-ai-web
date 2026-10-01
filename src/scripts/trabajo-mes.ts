// "El mes de prueba" (ElMes.astro). Un solo bucle de cuadros mueve el número y las marcas juntos
// (1600 ms, salida cúbica, la misma de contar.ts): marcas dibujadas = valor que se ve. Después, la
// barra de arqueos y los que no cuadraron pasan a cian. Los valores salen de los data-* del HTML.
// Sin movimiento reducido y sin JS el HTML ya trae el valor final.
import { movimientoReducido, unidades } from './contar';

const MS = 1600; // el conteo
const PAUSA = 200; // entre el conteo y la barra
const BARRA = 600; // las marcas de la barra
const ESCALON = 15; // entre un arqueo con diferencia y el siguiente
const TINTE = 300; // cada uno pasa a cian
const salida = (t: number) => 1 - (1 - t) ** 3;
const tramo = (t: number) => Math.max(0, Math.min(1, t));

// Un lienzo con su geometría. `pintar` ajusta el tamaño al ancho y dibuja todo lo que se le pida.
function lienzo(c: HTMLCanvasElement) {
	const g = c.getContext('2d')!;
	// Deja el lienzo limpio al tamaño actual y devuelve el ancho (0 si todavía no tiene).
	const preparar = (alto: (ancho: number) => number) => {
		const ancho = c.clientWidth;
		if (!ancho) return 0;
		const dpr = window.devicePixelRatio || 1;
		const h = alto(ancho);
		c.style.height = `${h}px`;
		c.width = Math.round(ancho * dpr);
		c.height = Math.round(h * dpr);
		g.setTransform(dpr, 0, 0, dpr, 0, 0);
		c.classList.add('listo');
		return ancho;
	};
	return { g, preparar, el: c };
}

export function elMes(raiz: HTMLElement) {
	const movimientos = Number(raiz.dataset.movimientos);
	const arqueos = Number(raiz.dataset.arqueos);
	const dif = Number(raiz.dataset.dif);
	const numero = raiz.querySelector<HTMLElement>('[data-numero]')!;
	const campo = lienzo(raiz.querySelector<HTMLCanvasElement>('[data-campo]')!);
	const barra = lienzo(raiz.querySelector<HTMLCanvasElement>('[data-barra]')!);

	// Los colores salen de los tokens (--marca y --marca-dif en el CSS); se leen al armar y al cambiar el ancho.
	let base = '';
	let cian = '';
	const leer = () => {
		const est = getComputedStyle(campo.el);
		[base, cian] = [est.getPropertyValue('--marca').trim(), est.getPropertyValue('--marca-dif').trim()];
	};
	leer();

	// Lo que se ve ahora: marcas del campo, marcas de la barra y ms desde que empezó el tinte (-1: sin tinte).
	let nCampo = movimientos;
	let nBarra = arqueos;
	let tinte = Infinity;
	let pintadas = 0; // marcas del campo ya dibujadas (el campo solo crece: se dibuja lo que falta)
	let cols = 1;
	let paso = 8;

	const geometria = (ancho: number) => {
		const base = ancho >= 520 ? 8 : 6;
		cols = Math.floor(ancho / base);
		paso = ancho / cols;
		return Math.ceil(movimientos / cols) * paso;
	};

	const dibujarCampo = (completo: boolean) => {
		if (completo || !pintadas) {
			if (!campo.preparar(geometria)) return;
			pintadas = 0;
		}
		const lado = Math.max(2, paso - 3);
		campo.g.fillStyle = base;
		for (; pintadas < nCampo; pintadas++) {
			campo.g.fillRect((pintadas % cols) * paso, Math.floor(pintadas / cols) * paso, lado, lado);
		}
	};

	const dibujarBarra = () => {
		const ancho = barra.preparar(() => 24);
		if (!ancho) return;
		const p = ancho / arqueos;
		const w = Math.max(1.5, p * 0.5);
		for (let i = 0; i < nBarra; i++) {
			barra.g.fillStyle = base;
			barra.g.fillRect(i * p, 0, w, 24);
			const k = i - (arqueos - dif); // los últimos `dif` son los que no cuadraron
			if (k >= 0 && tinte >= 0) {
				barra.g.globalAlpha = salida(tramo((tinte - k * ESCALON) / TINTE));
				barra.g.fillStyle = cian;
				barra.g.fillRect(i * p, 0, w, 24);
				barra.g.globalAlpha = 1;
			}
		}
	};

	const dibujar = () => {
		leer();
		dibujarCampo(true);
		dibujarBarra();
	};

	// Un solo bucle: número y marcas con el mismo valor en cada cuadro; después, la barra.
	let cuadro = 0;
	let t0 = 0;
	const FIN = MS + PAUSA + BARRA + (dif - 1) * ESCALON + TINTE;
	const paseo = (ahora: number) => {
		const t = ahora - t0;
		const valor = Math.round(movimientos * salida(tramo(t / MS)));
		numero.textContent = unidades(valor);
		nCampo = valor;
		dibujarCampo(false);
		const tb = t - MS - PAUSA;
		if (tb >= 0) {
			nBarra = Math.round(arqueos * tramo(tb / BARRA));
			tinte = tb - BARRA;
			dibujarBarra();
		}
		if (t < FIN) cuadro = requestAnimationFrame(paseo);
	};

	const final = () => {
		cancelAnimationFrame(cuadro);
		numero.textContent = unidades(movimientos);
		[nCampo, nBarra, tinte] = [movimientos, arqueos, Infinity];
		dibujar();
	};

	// Al cambiar el ancho se redibuja con lo que se ve en ese momento (un redibujo por cuadro).
	let pendiente = 0;
	let anchoVisto = 0;
	const ro = new ResizeObserver(() => {
		if (campo.el.clientWidth === anchoVisto) return;
		anchoVisto = campo.el.clientWidth;
		cancelAnimationFrame(pendiente);
		pendiente = requestAnimationFrame(dibujar);
	});
	ro.observe(campo.el);

	let io: IntersectionObserver | undefined;
	if (movimientoReducido()) {
		final();
	} else {
		// Armado: en cero hasta ver el bloque. La barra no se dibuja hasta que le toca.
		[nCampo, nBarra, tinte] = [0, 0, -1];
		numero.textContent = '0';
		dibujar();
		const bloque = raiz;
		io = new IntersectionObserver(
			([e]) => {
				// Si al cargar ya quedó arriba de la pantalla (scroll restaurado): el valor final directo.
				if (e.boundingClientRect.bottom < 0) {
					io!.disconnect();
					final();
					return;
				}
				// Con el 60 % a la vista; en pantallas bajas, donde el bloque no entra, con la mitad del alto.
				if (e.intersectionRatio < 0.6 && e.intersectionRect.height < innerHeight * 0.5) return;
				io!.disconnect();
				t0 = performance.now();
				cuadro = requestAnimationFrame(paseo);
			},
			{ threshold: [0, 0.1, 0.25, 0.4, 0.6] },
		);
		io.observe(bloque);
	}

	return () => {
		io?.disconnect();
		ro.disconnect();
		cancelAnimationFrame(cuadro);
		cancelAnimationFrame(pendiente);
	};
}
