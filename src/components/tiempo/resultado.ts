// La card del resultado: el odómetro, la luz y la pastilla de la tarea. El HTML ya trae el estado
// final; esto solo lo cambia. Todo lo que se mueve es transform, opacity o clip-path, y lo dispara
// quien toca, así que corre también con movimiento reducido.
// La misma curva que las transiciones del CSS (global.css), para no repetir el valor.
const salida = () => getComputedStyle(document.documentElement).getPropertyValue('--curva-salida').trim();

export function resultado(seccion: HTMLElement) {
	const numero = seccion.querySelector<HTMLElement>('[data-total]')!;
	const unidad = seccion.querySelector<HTMLElement>('.tiempo__unidad')!;
	const luz = seccion.querySelector<HTMLElement>('.tiempo__luz')!;
	const pastilla = seccion.querySelector<HTMLElement>('.tiempo__pastilla')!;
	const columnas = [...numero.querySelectorAll<HTMLElement>('.tiempo__col')];
	const izquierda = (el: HTMLElement) => el.getBoundingClientRect().left;

	// Centenas, decenas y unidades. Cada columna es una tira 0 a 9 que sube con translateY (el % es
	// de la tira: 10 % por dígito), con transición: si llega otro valor a mitad de camino, sigue
	// desde donde esté.
	function ponerNumero(n: number, animar: boolean) {
		const digitos = String(n).padStart(columnas.length, ' ');
		const distinto = columnas.filter((c) => !c.hidden).length !== String(n).length;
		// Si cambia la cantidad de dígitos, el resto se acomoda de golpe. Se mide antes y después y
		// se desliza desde donde estaba (FLIP): la columna nueva se funde y la que sobra se va
		// como una copia suelta, en su lugar.
		const sigue = distinto && animar ? [...columnas.filter((c) => !c.hidden), unidad] : [];
		const antes = sigue.map(izquierda);
		const donde = columnas.map((c) => (c.hidden ? 0 : izquierda(c) - izquierda(numero)));
		sigue.forEach((el) => el.getAnimations().forEach((a) => a.cancel()));

		const nuevas: HTMLElement[] = [];
		columnas.forEach((col, i) => {
			const d = digitos[i];
			if (d !== ' ') {
				col.querySelector<HTMLElement>('.tiempo__tira')!.style.transform = `translateY(-${Number(d) * 10}%)`;
				if (col.hidden) {
					col.hidden = false;
					nuevas.push(col);
				}
			} else if (!col.hidden) {
				if (distinto && animar) {
					const fantasma = col.cloneNode(true) as HTMLElement;
					fantasma.classList.add('tiempo__fantasma');
					fantasma.style.left = `${donde[i]}px`;
					numero.append(fantasma);
					fantasma.animate({ opacity: [1, 0] }, { duration: 160, easing: 'ease-out' }).onfinish = () => fantasma.remove();
				}
				col.hidden = true;
			}
		});
		if (!distinto || !animar) return;
		sigue.forEach((el, i) => {
			const dx = antes[i] - izquierda(el);
			if (!el.hidden && Math.abs(dx) > 0.5) el.animate({ transform: [`translateX(${dx}px)`, 'none'] }, { duration: 260, easing: salida() });
		});
		nuevas.forEach((col) => col.animate({ opacity: [0, 1] }, { duration: 160, easing: 'ease-out' }));
	}

	return {
		// `animar` es falso al arrancar: el HTML ya trae el ejemplo.
		poner(n: number, tarea: string, animar: boolean) {
			numero.dataset.total = String(n);
			luz.style.setProperty('--t', String(n / 800));
			ponerNumero(n, animar);
			// La pastilla: la tarea nueva aparece con un fundido de 160 ms.
			const activa = pastilla.querySelector<HTMLElement>(`[data-tarea="${tarea}"]`)!;
			if (!activa.hidden) return;
			pastilla.querySelectorAll<HTMLElement>('[data-tarea]').forEach((el) => (el.hidden = el !== activa));
			if (animar) activa.animate({ opacity: [0, 1] }, { duration: 160, easing: 'ease-out' });
		},
	};
}
