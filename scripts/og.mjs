// Genera public/og.jpg, la imagen de la vista previa al compartir el link (SPECS §9).
// Uso: npm run og, cada vez que cambie la plantilla (src/pages/[plantilla].astro) o el titular.
// Compila en una carpeta aparte con la plantilla activada, así el build del sitio no la incluye.
import { rm, stat } from 'node:fs/promises';
import { build, preview } from 'astro';
import { chromium } from 'playwright';

const SALIDA = 'public/og.jpg';
const BUILD = './.astro/og';

process.env.OG_PLANTILLA = '1';
await build({ root: '.', outDir: BUILD, logLevel: 'error' });
const servidor = await preview({ root: '.', outDir: BUILD, logLevel: 'error' });
const navegador = await chromium.launch();

const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
await pagina.goto(`http://localhost:${servidor.port}/og/`, { waitUntil: 'networkidle' });
await pagina.evaluate(() => document.fonts.ready);
// JPEG y no PNG: con el glow, el PNG pesa varias veces más, y WhatsApp a veces no muestra
// imágenes de más de 300 KB.
await pagina.screenshot({ path: SALIDA, type: 'jpeg', quality: 90 });

await navegador.close();
await servidor.stop();
await rm(BUILD, { recursive: true });

const kb = Math.round((await stat(SALIDA)).size / 1024);
console.log(`${SALIDA}: ${kb} KB${kb > 300 ? ' — FALLA: pasa los 300 KB' : ''}`);
process.exitCode = kb > 300 ? 1 : 0;
