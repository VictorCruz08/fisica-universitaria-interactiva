import katex from 'katex';

/** Renderiza TeX a HTML para usar con {@html} en componentes Svelte. */
export const tex = (fuente: string, display = false): string =>
  katex.renderToString(fuente, { throwOnError: false, displayMode: display, strict: false });

const escapar = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Texto con matemáticas en línea delimitadas por $…$ (y **negritas**).
 * Útil para enunciados de preguntas pasados como props de cadena.
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
