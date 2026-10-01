// Genera public/favicon.png (48 × 48) y public/apple-touch-icon.png (180 × 180) desde public/favicon.svg.
// Uso: npm run iconos, cada vez que cambie el SVG. Sin esquinas redondeadas: las plataformas recortan solas.
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const ICONOS = { 'public/favicon.png': 48, 'public/apple-touch-icon.png': 180 };
const navegador = await chromium.launch();
for (const [salida, lado] of Object.entries(ICONOS)) {
	const pagina = await navegador.newPage({ viewport: { width: lado, height: lado } });
	await pagina.goto(pathToFileURL('public/favicon.svg').href);
	await pagina.screenshot({ path: salida });
	console.log(`${salida}: ${lado} × ${lado}`);
}
await navegador.close();
