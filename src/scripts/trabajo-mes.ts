// "El mes de prueba" (ElMes.astro). Un solo bucle de cuadros mueve el número y las marcas juntos
// (1600 ms, salida cúbica, la misma de contar.ts): marcas dibujadas = valor que se ve, y cada marca
// nace en tinta fresca. Después, una partícula por arqueo viaja del campo a la barra, y los que no
// cuadraron pasan a cian mientras el 32 de la leyenda cuenta; el viaje espera a que la barra esté a la vista.
// Los valores salen de los data-* del HTML.
// Sin movimiento reducido y sin JS el HTML ya trae el valor final.
import { movimientoReducido, unidades } from './contar';

const MS = 1600; // el conteo
const PAUSA = 200; // entre el conteo y el viaje a la barra
const SALTO = 5; // entre una partícula y la siguiente
const VUELO = 520; // lo que tarda cada una
const ESCALON = 15; // entre un arqueo con diferencia y el siguiente
const TINTE = 300; // cada uno pasa a cian
const FRESCA = 280; // la marca nueva pasa de tinta fresca a su color
const salida = (t: number) => 1 - (1 - t) ** 3;
const tramo = (t: number) => Math.max(0, Math.min(1, t));

// --curva-cruce, cubic-bezier(0.77, 0, 0.175, 1): las partículas van en un canvas, donde Element.animate no llega.
const cruce = (x: number) => {
	const b = (a: number, c: number, t: number) => 3 * a * (1 - t) ** 2 * t + 3 * c * (1 - t) * t * t + t ** 3;
	let [lo, hi] = [0, 1];
	for (let n = 0; n < 20; n++) {
		const m = (lo + hi) / 2;
		if (b(0.77, 0.175, m) < x) lo = m;
		else hi = m;
	}
	return b(0, 1, (lo + hi) / 2);
};

// Un lienzo con su geometría. `preparar` ajusta el tamaño al ancho y lo deja limpio; `px` alinea al píxel real.
function lienzo(c: HTMLCanvasElement) {
	const g = c.getContext('2d')!;
	let dpr = 1;
	// Devuelve el ancho (0 si todavía no tiene).
	const preparar = (alto: (ancho: number) => number) => {
		const ancho = c.clientWidth;
		if (!ancho) return 0;
		dpr = window.devicePixelRatio || 1;
		const h = alto(ancho);
		c.style.height = `${h}px`;
		c.width = Math.round(ancho * dpr);
		c.height = Math.round(h * dpr);
		g.setTransform(dpr, 0, 0, dpr, 0, 0);
		c.classList.add('listo');
		return ancho;
	};
	const px = (v: number) => Math.round(v * dpr) / dpr;
	const color = (n: string) => getComputedStyle(c).getPropertyValue(n).trim();
	return { g, el: c, preparar, px, color };
}

export function elMes(raiz: HTMLElement) {
	const movimientos = Number(raiz.dataset.movimientos);
	const arqueos = Number(raiz.dataset.arqueos);
	const dif = Number(raiz.dataset.dif);
	const numero = raiz.querySelector<HTMLElement>('[data-numero]')!;
	const difN = raiz.querySelector<HTMLElement>('[data-dif-n]')!;
	const campo = lienzo(raiz.querySelector<HTMLCanvasElement>('[data-campo]')!);
	const barra = lienzo(raiz.querySelector<HTMLCanvasElement>('[data-barra]')!);
	const TODAS = (arqueos - 1) * SALTO + VUELO; // hasta que aterriza la última partícula
	const FIN = MS + PAUSA + TODAS + (dif - 1) * ESCALON + TINTE;

	// Los colores salen de los tokens (--marca, --marca-nueva y --marca-dif en el CSS), cada uno de su lienzo.
	let [base, nueva, ok, cian] = ['', '', '', ''];
	const leer = () => {
		[base, nueva] = [campo.color('--marca'), campo.color('--marca-nueva')];
		[ok, cian] = [barra.color('--marca'), barra.color('--marca-dif')];
	};
	leer();

	// Lo que se ve ahora: marcas del campo, marcas de la barra y ms desde que empezó el tinte (negativo: sin tinte).
	let nCampo = movimientos;
	let nBarra = arqueos;
	let tinte = Infinity;
	let vuelo = Infinity; // ms desde que salió la primera partícula: cada marca aterriza en tinta fresca y se funde a su color
	let pintadas = 0; // marcas del campo ya dibujadas (el campo solo crece: se dibuja lo que falta)
	let frescas: Array<{ a: number; b: number; t: number }> = []; // rangos de marcas todavía en tinta fresca
	let [cols, paso, lado] = [1, 8, 2];
	let [anchoBarra, p, w] = [0, 1, 1];

	const geometria = (ancho: number) => {
		const celda = ancho >= 520 ? 8 : 6;
		cols = Math.max(1, Math.floor(ancho / celda));
		paso = ancho / cols;
		lado = campo.px(Math.max(2, paso - 3));
		return Math.ceil(movimientos / cols) * paso;
	};

	const marca = (k: number, alfa: number) => {
		const [x, y] = [campo.px((k % cols) * paso), campo.px(Math.floor(k / cols) * paso)];
		campo.g.fillStyle = base;
		campo.g.fillRect(x, y, lado, lado);
		if (alfa <= 0) return;
		campo.g.globalAlpha = alfa;
		campo.g.fillStyle = nueva;
		campo.g.fillRect(x, y, lado, lado);
		campo.g.globalAlpha = 1;
	};

	const dibujarCampo = (completo: boolean, ahora = 0) => {
		if (completo || !pintadas) {
			if (!campo.preparar(geometria)) return;
			pintadas = 0;
			frescas = [];
		}
		if (completo) {
			for (; pintadas < nCampo; pintadas++) marca(pintadas, 0);
			return;
		}
		if (pintadas < nCampo) frescas.push({ a: pintadas, b: (pintadas = nCampo), t: ahora });
		frescas = frescas.filter((f) => {
			const alfa = 1 - tramo((ahora - f.t) / FRESCA);
			for (let k = f.a; k < f.b; k++) marca(k, alfa);
			return alfa > 0;
		});
	};

	// El lienzo de la barra se prepara una vez por tamaño; cada cuadro solo borra y dibuja.
	const prepararBarra = () => {
		anchoBarra = barra.preparar(() => 24);
		p = anchoBarra / arqueos;
		w = Math.max(1, Math.round(Math.max(1.5, p * 0.5) * (window.devicePixelRatio || 1))) / (window.devicePixelRatio || 1);
	};

	const pintarBarra = () => {
		if (!anchoBarra) return;
		barra.g.clearRect(0, 0, anchoBarra, 24);
		for (let i = 0; i < nBarra; i++) {
			const x = barra.px(i * p);
			barra.g.fillStyle = ok;
			barra.g.fillRect(x, 8, w, 16);
			const fresca = 1 - tramo((vuelo - (i * SALTO + VUELO)) / FRESCA);
			if (fresca > 0) {
				barra.g.globalAlpha = fresca;
				barra.g.fillStyle = nueva;
				barra.g.fillRect(x, 8, w, 16);
				barra.g.globalAlpha = 1;
			}
			const k = i - (arqueos - dif); // los últimos `dif` son los que no cuadraron
			if (k >= 0 && tinte > 0) {
				barra.g.globalAlpha = salida(tramo((tinte - k * ESCALON) / TINTE));
				barra.g.fillStyle = cian;
				barra.g.fillRect(x, 0, w, 24);
				barra.g.globalAlpha = 1;
			}
		}
	};

	// El 32 de la leyenda cuenta a la par del tinte (el lector de pantalla tiene su propio texto).
	const contarDif = () => (difN.textContent = String(tinte === Infinity ? dif : tinte > 0 ? Math.min(dif, Math.ceil(tinte / ESCALON)) : 0));

	const dibujar = () => {
		leer();
		dibujarCampo(true);
		prepararBarra();
		pintarBarra();
		contarDif();
	};

	// Las partículas: un canvas temporal sobre el bloque, que se borra al terminar.
	let capa: { el: HTMLCanvasElement; g: CanvasRenderingContext2D; x0: number; y0: number; x1: number; y1: number } | undefined;
	const quitarCapa = () => {
		capa?.el.remove();
		capa = undefined;
	};
	const armarCapa = () => {
		const [r, a, b] = [raiz, campo.el, barra.el].map((e) => e.getBoundingClientRect());
		const dpr = window.devicePixelRatio || 1;
		const el = document.createElement('canvas');
		el.setAttribute('aria-hidden', 'true');
		el.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
		el.width = Math.round(r.width * dpr);
		el.height = Math.round(r.height * dpr);
		const g = el.getContext('2d')!;
		g.setTransform(dpr, 0, 0, dpr, 0, 0);
		raiz.append(el);
		capa = { el, g, x0: a.left - r.left, y0: a.top - r.top, x1: b.left - r.left, y1: b.top - r.top };
	};
	const volar = (tb: number) => {
		if (!capa) armarCapa();
		const { g, el, x0, y0, x1, y1 } = capa!;
		g.clearRect(0, 0, el.clientWidth, el.clientHeight); // en px de CSS: con el transform del dpr, el.width deja rastros si dpr < 1
		g.fillStyle = nueva;
		for (let i = 0; i < arqueos; i++) {
			const t = tb - i * SALTO; // 0 = sale; VUELO = aterriza (ahí ya la dibuja la barra)
			if (t < 0 || t >= VUELO) continue;
			const e = cruce(t / VUELO);
			const k = Math.floor(((i + 0.5) * movimientos) / arqueos); // el movimiento de donde sale
			const [ax, ay] = [x0 + campo.px((k % cols) * paso), y0 + campo.px(Math.floor(k / cols) * paso)];
			const [bx, by] = [x1 + barra.px(i * p), y1 + 8];
			g.fillRect(ax + (bx - ax) * e, ay + (by - ay) * e, lado + (w - lado) * e, lado + (16 - lado) * e);
		}
	};

	// Un solo bucle: número y marcas con el mismo valor en cada cuadro; después, el viaje y el tinte.
	// El viaje espera a que la barra esté a la vista (barraVista): hasta entonces el reloj queda en la pausa,
	// y cuando las marcas frescas del campo terminan de fundirse el bucle se frena (esperando) hasta que llegue.
	let [cuadro, t0, corriendo, barraVista, esperando] = [0, 0, false, false, false];
	const paseo = (ahora: number) => {
		const espera = !barraVista && ahora - t0 >= MS + PAUSA;
		if (espera) t0 = ahora - MS - PAUSA;
		const t = ahora - t0;
		const valor = Math.round(movimientos * salida(tramo(t / MS)));
		numero.textContent = unidades(valor);
		nCampo = valor;
		dibujarCampo(false, ahora);
		const tb = t - MS - PAUSA;
		if (espera && !frescas.length) {
			esperando = true;
			return;
		}
		if (tb >= 0 && !espera) {
			vuelo = tb;
			if (tb < TODAS) volar(tb);
			else quitarCapa();
			nBarra = tb >= VUELO ? Math.min(arqueos, Math.floor((tb - VUELO) / SALTO) + 1) : 0;
			tinte = tb - TODAS;
			pintarBarra();
			contarDif();
		}
		if (t < FIN) cuadro = requestAnimationFrame(paseo);
		else corriendo = false;
	};

	const final = () => {
		cancelAnimationFrame(cuadro);
		corriendo = esperando = false;
		quitarCapa();
		numero.textContent = unidades(movimientos);
		[nCampo, nBarra, tinte, vuelo] = [movimientos, arqueos, Infinity, Infinity];
		dibujar();
	};

	// Al cambiar el ancho se redibuja con lo que se ve; si la animación está corriendo, salta al final.
	let pendiente = 0;
	let anchoVisto = 0;
	const ro = new ResizeObserver(() => {
		if (campo.el.clientWidth === anchoVisto) return;
		anchoVisto = campo.el.clientWidth;
		cancelAnimationFrame(pendiente);
		pendiente = requestAnimationFrame(corriendo ? final : dibujar);
	});
	ro.observe(campo.el);

	// Si cambia la densidad de píxeles (otro monitor, zoom), las marcas se vuelven a alinear.
	const alCambiarDensidad = () => {
		if (corriendo) final();
		else dibujar();
		vigilar();
	};
	const vigilar = () => matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`).addEventListener('change', alCambiarDensidad, { once: true });
	vigilar();

	if (movimientoReducido()) {
		final();
	} else {
		// Armado: en cero hasta ver el bloque. La barra no se dibuja hasta que le toca.
		[nCampo, nBarra, tinte] = [0, 0, -1];
		numero.textContent = '0';
		dibujar();
		const io = new IntersectionObserver(
			([e]) => {
				// Si al cargar ya quedó arriba de la pantalla (scroll restaurado): el valor final directo.
				if (e.boundingClientRect.bottom < 0) {
					io.disconnect();
					ioBarra.disconnect();
					final();
					return;
				}
				// Con el 60 % a la vista; en pantallas bajas, donde el bloque no entra, con la mitad del alto.
				if (e.intersectionRatio < 0.6 && e.intersectionRect.height < innerHeight * 0.5) return;
				io.disconnect();
				t0 = performance.now();
				corriendo = true;
				cuadro = requestAnimationFrame(paseo);
			},
			{ threshold: [0, 0.1, 0.25, 0.4, 0.6] },
		);
		// El viaje sale cuando la barra se ve entera (con 48 px de aire contra el borde de abajo), una sola vez.
		// Si el lector pasa de largo, queda esperando: al volver a verla, viaja.
		const ioBarra = new IntersectionObserver(
			(entradas) => {
				if (entradas[entradas.length - 1].intersectionRatio < 0.95) return; // el estado más reciente
				ioBarra.disconnect();
				barraVista = true;
				if (!esperando) return;
				esperando = false;
				t0 = performance.now() - MS - PAUSA;
				cuadro = requestAnimationFrame(paseo);
			},
			{ threshold: [0, 0.95], rootMargin: '0px 0px -48px 0px' },
		);
		io.observe(raiz);
		ioBarra.observe(barra.el);
	}
}
