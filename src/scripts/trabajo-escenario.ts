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
	const lista = un(selector, 'ul');
	const items = todos(selector, '[data-sel]');
	const timers: number[] = [];
	const preg = un(conv, '[data-preg]');
	const escribiendo = un(conv, '[data-escribiendo]');
	const resp = un(conv, '[data-resp]');
	const paso = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
	let fuera: IntersectionObserver | undefined;
	let iniciada = false;
	selector.setAttribute('data-listo', ''); // con JS, el control segmentado del celular (Selector.astro)

	// Corta los pasos pendientes de la conversación: lo que se ve queda donde está.
	const parar = () => {
		timers.forEach(clearTimeout);
		timers.length = 0;
	};
	// Deja todo en su estado final al instante (la sección se fue de pantalla antes de terminar).
	const completar = () => {
		parar();
		fuera?.disconnect();
		tablero.removeAttribute('data-entra');
		tablero.removeAttribute('data-visto');
		tablero.removeAttribute('data-elegido');
		conv.removeAttribute('data-habla');
	};

	// La conversación: `t` son los instantes de la pregunta, los puntos y la respuesta; `pw`, los ms entre palabras.
	// El cierre llega cuando apareció la última palabra (100 ms de espera + una por `pw` + su fundido).
	const palabras = conv.querySelectorAll('.w').length;
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
		paso(t[2] + 100 + palabras * pw + 200, completar);
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
		// La conversación se congela donde está y se va con el fundido de .conv (lo que no salió no aparece
		// de golpe). Si la llegada sigue en curso, termina sola; los celulares pasan a la transición del cambio.
		parar();
		tablero.setAttribute('data-elegido', '');
		if (id === 'asistente' && iniciada) decir([120, 320, 720], 20);
	};

	selector.addEventListener('click', (e) => {
		const li = (e.target as HTMLElement).closest<HTMLElement>('[data-sel]');
		if (li) elegir(li.dataset.sel!);
	});
	escena.addEventListener('click', (e) => {
		const cel = (e.target as HTMLElement).closest<HTMLElement>('[data-cel]');
		if (cel) elegir(cel.dataset.cel!);
	});

	// Deslizar con el dedo sobre el escenario (48 px o más de 0,11 px/ms): trae el celular del lado hacia donde se
	// desliza, el que se ve en pantalla en ese lado.
	let x0 = NaN;
	let t0 = 0;
	escena.addEventListener('pointerdown', (e) => {
		if (!e.isPrimary) return;
		x0 = e.clientX;
		t0 = e.timeStamp;
	});
	escena.addEventListener('pointerup', (e) => {
		if (e.pointerType !== 'touch' || !e.isPrimary || Number.isNaN(x0)) return;
		const dx = e.clientX - x0;
		x0 = NaN;
		if (Math.abs(dx) >= 48 || (Math.abs(dx) > 16 && Math.abs(dx) / Math.max(1, e.timeStamp - t0) > 0.11)) {
			const lado = dx < 0 ? 'der' : 'izq';
			const c = celulares.find((c) => c.dataset.pose === lado);
			if (c) elegir(c.dataset.cel!);
		}
	});
	escena.addEventListener('pointercancel', () => (x0 = NaN));

	if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
		// Con ratón, el celular del ítem se levanta 8 px mientras se lo señala.
		for (const li of items) {
			const cel = celulares.find((c) => c.dataset.cel === li.dataset.sel)!;
			li.addEventListener('pointerenter', () => cel.setAttribute('data-levantado', ''));
			li.addEventListener('pointerleave', () => cel.removeAttribute('data-levantado'));
		}

		// --- M4: inclinación con resorte crítico (rigidez 170, amortiguación 26, sin rebote). ---
		const reducido = movimientoReducido();
		const max = reducido ? { x: 2.5, y: 2 } : { x: 5, y: 4 };
		const mitad = reducido ? 0.5 : 1; // los glows, a la mitad con movimiento reducido
		// Luz de escena: cada glow se corre al revés de la inclinación, el cian más que el azul (px a fondo).
		const luces = [
			[un(escena, '.glow--azul-oscuro'), 48, 32],
			[un(escena, '.glow--cian-oscuro'), 72, 48],
		] as const;
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
			for (const [glow, ax, ay] of luces) glow.style.translate = `${(-x * mitad * ax).toFixed(2)}px ${(-y * mitad * ay).toFixed(2)}px`;
			cuadro = quieto ? 0 : requestAnimationFrame(mover1);
		};
		const arrancar = () => {
			if (cuadro) return;
			antes = performance.now();
			cuadro = requestAnimationFrame(mover1);
		};
		escena.addEventListener('pointerenter', (e) => e.pointerType !== 'touch' && medir(e.timeStamp));
		escena.addEventListener('pointermove', (e) => {
			if (e.pointerType === 'touch') return;
			if (e.timeStamp - medido > 300) medir(e.timeStamp);
			tx = Math.max(-1, Math.min(1, (e.clientX - caja.left - caja.width / 2) / (caja.width / 2)));
			ty = Math.max(-1, Math.min(1, (e.clientY - caja.top - caja.height / 2) / (caja.height / 2)));
			arrancar();
		});
		escena.addEventListener('pointerleave', () => {
			tx = ty = 0;
			arrancar();
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
				// El primer aviso llega con cualquier pedazo a la vista: la llegada espera al 25 %.
				if (e.intersectionRatio < 0.25) return;
				io.disconnect();
				iniciada = true;
				tablero.setAttribute('data-visto', '');
				decir([900, 1250, 1850], 35);
				// Fin de la llegada: fuera de `timers`, para que elegir otro celular a mitad de camino no la corte.
				window.setTimeout(() => ['data-entra', 'data-visto', 'data-elegido'].forEach((a) => tablero.removeAttribute(a)), 1700);
				fuera = new IntersectionObserver(([s]) => !s.isIntersecting && completar());
				fuera.observe(escena);
			},
			{ threshold: 0.25 },
		);
		io.observe(escena);
	}
}
