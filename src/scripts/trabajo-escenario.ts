// El escenario de #trabajo (Escenario.astro). El HTML ya trae el estado final; esto lo arma solo si
// hay JS y el sistema no pidió movimiento reducido. Todo se mueve con transform, opacity o clip-path.
// - Llegada (M1) y conversación (M2): una sola vez, al ver el escenario. Si se va antes, queda completa.
//   Al volver a elegir el asistente, la conversación se repite más corta.
// - Inclinación (M4): resorte crítico a mano, solo con ratón. Con movimiento reducido, a la mitad.
//   Los glows se corren al revés de la inclinación (luz de escena).
// - Cambio de celular (M5): botones, toque en un celular de atrás o deslizar. Reducido: fundido.
import { movimientoReducido } from './contar';

const SALIDA = 'cubic-bezier(0.16, 1, 0.3, 1)'; // --curva-salida
const un = <T extends HTMLElement>(r: ParentNode, s: string) => r.querySelector<T>(s)!;
const todos = <T extends HTMLElement>(r: ParentNode, s: string) => [...r.querySelectorAll<T>(s)];

export function escenario(escena: HTMLElement, selector: HTMLElement) {
	const tablero = un(escena, '[data-escenario]');
	const celulares = todos(escena, '[data-cel]');
	const conv = un(escena, '[data-conv]');
	const glows = un(escena, '.glows');
	const lista = un(selector, 'ul');
	const items = todos(selector, '[data-sel]');
	const limpiezas: Array<() => void> = [];
	const timers: number[] = [];
	const preg = un(conv, '[data-preg]');
	const escribiendo = un(conv, '[data-escribiendo]');
	const resp = un(conv, '[data-resp]');
	const paso = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
	let fuera: IntersectionObserver | undefined;
	let iniciada = false;

	// Deja todo en su estado final al instante (la sección se fue de pantalla antes de terminar, o se eligió otro celular).
	const completar = () => {
		timers.forEach(clearTimeout);
		timers.length = 0;
		tablero.removeAttribute('data-entra');
		tablero.removeAttribute('data-visto');
		conv.removeAttribute('data-habla');
		fuera?.disconnect();
	};

	// La conversación: `t` son los instantes de la pregunta, los puntos, la respuesta y el cierre; `pw`, los ms entre palabras.
	const decir = (t: number[], pw: number) => {
		[preg, escribiendo, resp].forEach((e) => e.classList.remove('en'));
		conv.style.setProperty('--pw', `${pw}ms`);
		conv.setAttribute('data-habla', '');
		paso(t[0], () => preg.classList.add('en'));
		paso(t[1], () => escribiendo.classList.add('en'));
		paso(t[2], () => {
			escribiendo.classList.remove('en');
			resp.classList.add('en');
		});
		paso(t[3], completar);
	};

	conv.inert = tablero.dataset.frente !== 'asistente';

	// --- M5: traer un celular al frente. Intercambia de lugar con el que estaba adelante. ---
	const elegir = (id: string) => {
		const nuevo = celulares.find((c) => c.dataset.cel === id)!;
		const frente = celulares.find((c) => c.dataset.pose === 'frente')!;
		if (nuevo === frente) return;
		[frente.dataset.pose, nuevo.dataset.pose] = [nuevo.dataset.pose, 'frente'];
		tablero.dataset.frente = id;
		conv.inert = id !== 'asistente';
		items.forEach((li, i) => {
			const activo = li.dataset.sel === id;
			li.toggleAttribute('data-activa', activo);
			li.querySelector('button')!.setAttribute('aria-pressed', String(activo));
			if (activo) lista.style.setProperty('--activa', String(i));
		});
		if (movimientoReducido()) {
			[frente, nuevo].forEach((c) => c.animate({ opacity: [0.3, 1] }, { duration: 200, easing: SALIDA }));
			return;
		}
		completar();
		if (id === 'asistente' && iniciada) decir([120, 320, 720, 1800], 20);
	};

	const alClic = (e: Event) => {
		const li = (e.target as HTMLElement).closest<HTMLElement>('[data-sel]');
		if (li) elegir(li.dataset.sel!);
	};
	selector.addEventListener('click', alClic);
	const alToque = (e: Event) => {
		const cel = (e.target as HTMLElement).closest<HTMLElement>('[data-cel]');
		if (cel) elegir(cel.dataset.cel!);
	};
	escena.addEventListener('click', alToque);
	limpiezas.push(() => {
		selector.removeEventListener('click', alClic);
		escena.removeEventListener('click', alToque);
	});

	// Deslizar con el dedo sobre el escenario (48 px o más de 0,11 px/ms): trae el celular del lado hacia donde se
	// desliza, el que se ve en pantalla en ese lado.
	let x0 = NaN;
	let t0 = 0;
	const abajo = (e: PointerEvent) => {
		if (!e.isPrimary) return;
		x0 = e.clientX;
		t0 = e.timeStamp;
	};
	const arriba = (e: PointerEvent) => {
		if (e.pointerType !== 'touch' || !e.isPrimary || Number.isNaN(x0)) return;
		const dx = e.clientX - x0;
		x0 = NaN;
		if (Math.abs(dx) >= 48 || (Math.abs(dx) > 16 && Math.abs(dx) / Math.max(1, e.timeStamp - t0) > 0.11)) {
			const lado = dx < 0 ? 'der' : 'izq';
			const c = celulares.find((c) => c.dataset.pose === lado);
			if (c) elegir(c.dataset.cel!);
		}
	};
	const cancelar = () => (x0 = NaN);
	escena.addEventListener('pointerdown', abajo);
	escena.addEventListener('pointerup', arriba);
	escena.addEventListener('pointercancel', cancelar);
	limpiezas.push(() => {
		escena.removeEventListener('pointerdown', abajo);
		escena.removeEventListener('pointerup', arriba);
		escena.removeEventListener('pointercancel', cancelar);
	});

	const raton = matchMedia('(hover: hover) and (pointer: fine)').matches;

	// Con ratón, el celular del ítem se levanta 8 px mientras se lo señala.
	if (raton) {
		for (const li of items) {
			const cel = celulares.find((c) => c.dataset.cel === li.dataset.sel)!;
			const sube = () => cel.setAttribute('data-levantado', '');
			const baja = () => cel.removeAttribute('data-levantado');
			li.addEventListener('pointerenter', sube);
			li.addEventListener('pointerleave', baja);
			limpiezas.push(() => {
				li.removeEventListener('pointerenter', sube);
				li.removeEventListener('pointerleave', baja);
			});
		}

		// --- M4: inclinación con resorte crítico (rigidez 170, amortiguación 26, sin rebote). ---
		const reducido = movimientoReducido();
		const max = reducido ? { x: 2.5, y: 2 } : { x: 5, y: 4 };
		const mitad = reducido ? 0.5 : 1; // los glows, a la mitad con movimiento reducido
		const K = 170;
		const C = 26;
		let x = 0, y = 0, vx = 0, vy = 0, tx = 0, ty = 0;
		let cuadro = 0, antes = 0, medido = 0;
		let caja = escena.getBoundingClientRect();
		// El rect se mide al entrar y, como mucho, cada 300 ms: por evento solo hay aritmética.
		const medir = (ahora: number) => {
			caja = escena.getBoundingClientRect();
			medido = ahora;
		};
		const mover1 = (ahora: number) => {
			const dt = Math.min(0.033, (ahora - antes) / 1000);
			antes = ahora;
			vx += (K * (tx - x) - C * vx) * dt;
			vy += (K * (ty - y) - C * vy) * dt;
			x += vx * dt;
			y += vy * dt;
			const quieto = Math.abs(tx - x) < 0.002 && Math.abs(ty - y) < 0.002 && Math.abs(vx) < 0.01 && Math.abs(vy) < 0.01;
			if (quieto) [x, y, vx, vy] = [tx, ty, 0, 0];
			tablero.style.transform = `rotateX(${(-y * max.y).toFixed(3)}deg) rotateY(${(x * max.x).toFixed(3)}deg)`;
			glows.style.setProperty('--tx', (x * mitad).toFixed(3));
			glows.style.setProperty('--ty', (y * mitad).toFixed(3));
			cuadro = quieto ? 0 : requestAnimationFrame(mover1);
		};
		const arrancar = () => {
			if (cuadro) return;
			antes = performance.now();
			cuadro = requestAnimationFrame(mover1);
		};
		const entrar = (e: PointerEvent) => e.pointerType !== 'touch' && medir(e.timeStamp);
		const mover = (e: PointerEvent) => {
			if (e.pointerType === 'touch') return;
			if (e.timeStamp - medido > 300) medir(e.timeStamp);
			tx = Math.max(-1, Math.min(1, (e.clientX - caja.left - caja.width / 2) / (caja.width / 2)));
			ty = Math.max(-1, Math.min(1, (e.clientY - caja.top - caja.height / 2) / (caja.height / 2)));
			arrancar();
		};
		const salir = () => {
			tx = ty = 0;
			arrancar();
		};
		escena.addEventListener('pointerenter', entrar);
		escena.addEventListener('pointermove', mover);
		escena.addEventListener('pointerleave', salir);
		limpiezas.push(() => {
			escena.removeEventListener('pointerenter', entrar);
			escena.removeEventListener('pointermove', mover);
			escena.removeEventListener('pointerleave', salir);
			cancelAnimationFrame(cuadro);
		});
	}

	// --- M1 y M2: la llegada y la conversación. Con movimiento reducido no se arma nada. ---
	if (!movimientoReducido()) {
		tablero.setAttribute('data-entra', '');
		conv.setAttribute('data-habla', '');
		const io = new IntersectionObserver(
			([e]) => {
				// Si al cargar ya quedó arriba de la pantalla (scroll restaurado), el estado final directo.
				if (e.boundingClientRect.bottom < 0) {
					io.disconnect();
					iniciada = true;
					completar();
					return;
				}
				if (!e.isIntersecting) return;
				io.disconnect();
				iniciada = true;
				tablero.setAttribute('data-visto', '');
				decir([900, 1250, 1850, 3000], 35);
				paso(1700, () => {
					tablero.removeAttribute('data-entra');
					tablero.removeAttribute('data-visto');
				});
				fuera = new IntersectionObserver(([s]) => !s.isIntersecting && completar());
				fuera.observe(escena);
			},
			{ threshold: 0.25 },
		);
		io.observe(escena);
		limpiezas.push(() => io.disconnect());
	}
	limpiezas.push(() => {
		fuera?.disconnect();
		timers.forEach(clearTimeout);
	});

	return () => limpiezas.forEach((l) => l());
}
