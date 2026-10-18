import katex from '../../vendor/katex/katex.mjs';
import renderMathInElement from '../../vendor/katex/contrib/auto-render.mjs';

const cache = new Map();

/** Renderiza TeX a HTML (con caché: los interactivos lo piden en cada cuadro). */
export const tex = (fuente, display = false) => {
  const clave = (display ? 'D' : 'i') + fuente;
  let html = cache.get(clave);
  if (html === undefined) {
    html = katex.renderToString(fuente, { throwOnError: false, displayMode: display, strict: false });
    if (cache.size > 2000) cache.clear();
    cache.set(clave, html);
  }
  return html;
};

const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Texto con matemáticas en línea delimitadas por $…$ (y **negritas**). */
export const conMath = (s) =>
  s
    .split(/(\$[^$]+\$)/g)
    .map((trozo) =>
      trozo.startsWith('$') && trozo.endsWith('$') && trozo.length > 2
        ? tex(trozo.slice(1, -1))
        : escapar(trozo).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'),
    )
    .join('');

/** Busca $…$ y $$…$$ dentro de un elemento y los convierte en KaTeX. */
export const renderizarMath = (el) =>
  renderMathInElement(el, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
    ],
    ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option', 'svg'],
    ignoredClasses: ['sin-math'],
    throwOnError: false,
    strict: false,
  });
