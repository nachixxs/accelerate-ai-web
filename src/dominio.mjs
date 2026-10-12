// La única fuente del dominio. Es .mjs (y no .ts) porque astro.config.mjs lo importa y Node no
// carga TypeScript sin un cargador. Con el dominio comprado se cambia solo DOMINIO (ej. 'accelerate.com.ar').
// Solo el apex final: nunca un *.pages.dev ni www, porque el mail de /legal sale de acá y no existiría.
// PROVISORIA hasta entonces: .example es un dominio reservado que no existe (ESTADO.md, "Dominio provisorio").
export const DOMINIO = 'accelerate-ai.example';

export const PROVISORIO = DOMINIO.endsWith('.example');
// Apex con https y sin barra final: de acá salen canonical, Open Graph, robots.txt y sitemap.xml.
export const SITIO = `https://${DOMINIO}`;
// null mientras el dominio sea provisorio: /legal muestra el marcador [MAIL] en vez de un mail falso.
export const MAIL = PROVISORIO ? null : `ignacionogpa@${DOMINIO}`;
