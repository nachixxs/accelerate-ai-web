// Lo visual de los controles: la perilla con el valor adentro, el tramo elegido y la marca que
// viaja entre chips. El range nativo sigue siendo el control (teclado, arrastre, lector); esto solo
// mueve lo que se ve, con transform y clip-path. El total y el mensaje los maneja TuTiempo.
export function controles(seccion: HTMLElement) {
	const rangos = [...seccion.querySelectorAll<HTMLInputElement>('input[type="range"]')];
	const chips = seccion.querySelector<HTMLElement>('.tiempo__chips')!;
	const marca = chips.querySelector<HTMLElement>('.tiempo__marca')!;
	const anchos = new Map<HTMLInputElement, number>();

	// `suave` es para el teclado (120 ms); al arrastrar la perilla va pegada al dedo, sin transición.
	function perillas(suave: boolean) {
		for (const r of rangos) {
			const control = r.closest<HTMLElement>('.tiempo__control')!;
			const perilla = control.querySelector<HTMLElement>('.tiempo__perilla')!;
			const ancho = anchos.get(r) ?? r.clientWidth;
			const fraccion = (Number(r.value) - Number(r.min)) / (Number(r.max) - Number(r.min));
			const x = (ancho - perilla.offsetWidth) * fraccion;
			control.toggleAttribute('data-suave', suave);
			if (perilla.textContent !== r.value) perilla.textContent = r.value;
			perilla.style.left = '0';
			perilla.style.transform = `translateX(${x}px)`;
			control.querySelector<HTMLElement>('.tiempo__relleno')!.style.clipPath = `inset(0 ${ancho - x - perilla.offsetWidth / 2}px 0 0)`;
			r.setAttribute('aria-valuetext', `${r.value} ${r.value === '1' ? r.dataset.uno : r.dataset.varias}`);
		}
	}

	// La marca es una copia de los chips, recortada al elegido. `animar` es falso al cargar y al
	// cambiar el ancho: ahí el recorte se acomoda de golpe, sin correr detrás del chip.
	function marcar(animar: boolean) {
		const c = chips.querySelector<HTMLElement>('input:checked + .tiempo__cara')!.getBoundingClientRect();
		const b = chips.getBoundingClientRect();
		if (!animar) marca.style.transition = 'none';
		marca.style.clipPath = `inset(${c.top - b.top}px ${b.right - c.right}px ${b.bottom - c.bottom}px ${c.left - b.left}px round 999px)`;
		if (!animar) {
			marca.getBoundingClientRect();
			marca.style.transition = '';
		}
		seccion.dataset.marca = '';
	}

	// Cualquier cambio de tamaño (ancho de la ventana, letra, fuente que llega) reacomoda todo.
	const observador = new ResizeObserver((entradas) => {
		for (const e of entradas) if (e.target instanceof HTMLInputElement) anchos.set(e.target, e.contentRect.width);
		perillas(false);
		marcar(false);
	});
	observador.observe(chips);
	rangos.forEach((r) => observador.observe(r));
	chips.querySelectorAll('input + .tiempo__cara').forEach((c) => observador.observe(c));
	document.fonts.ready.then(() => marcar(false));

	return { perillas, marcar };
}
