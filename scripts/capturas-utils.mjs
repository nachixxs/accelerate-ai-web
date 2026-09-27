// Compartido entre capturas.mjs y los módulos de accesibilidad/navegadores: espera a que
// terminen las animaciones por tiempo de la carga (la historia de la portada, los avisos con
// retraso como el del tablero), sin contar las que no terminan nunca (la cinta de rubros) ni las
// atadas al scroll. Sin esto, un chequeo que arranca antes de que pase el retraso de una
// animación (por ejemplo, el aviso del tablero, a los 3 s) puede leer un estado a mitad de camino
// que no es un bug: es que todavía no le tocaba.
export const terminarCarga = (pagina) =>
	pagina.evaluate(async () => {
		await document.fonts.ready;
		const deTiempo = document
			.getAnimations()
			.filter((a) => a.timeline instanceof DocumentTimeline && a.effect.getComputedTiming().iterations !== Infinity);
		await Promise.all(deTiempo.map((a) => a.finished.catch(() => {})));
	});
