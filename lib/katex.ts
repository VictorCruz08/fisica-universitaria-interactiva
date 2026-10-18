import katex from 'katex';

const cache = new Map<string, string>();

/** Renderiza TeX a HTML (con caché: los interactivos lo piden en cada cuadro). */
export const tex = (fuente: string, display = false): string => {
  const clave = (display ? 'D' : 'i') + fuente;
  let html = cache.get(clave);
  if (html === undefined) {
    html = katex.renderToString(fuente, { throwOnError: false, displayMode: display, strict: false });
    if (cache.size > 2000) cache.clear();
    cache.set(clave, html);
  }
  return html;
};

const escapar = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Texto con matemáticas en línea delimitadas por $…$ (y **negritas**).
 * Para enunciados de preguntas pasados como props de cadena.
 */
export const conMath = (s: string): string =>
  s
    .split(/(\$[^$]+\$)/g)
    .map((trozo) =>
      trozo.startsWith('$') && trozo.endsWith('$') && trozo.length > 2
        ? tex(trozo.slice(1, -1))
        : escapar(trozo).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'),
    )
    .join('');
