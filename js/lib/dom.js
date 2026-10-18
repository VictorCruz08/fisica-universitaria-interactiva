/** Utilidades pequeñas para construir los interactivos sin framework. */

/** Crea un elemento HTML a partir de una cadena (un solo nodo raíz). */
export const html = (cadena) => {
  const t = document.createElement('template');
  t.innerHTML = cadena.trim();
  return t.content.firstElementChild;
};

/** querySelector acotado y estricto: falla en voz alta si la plantilla cambió. */
export const $ = (raiz, selector) => {
  const el = raiz.querySelector(selector);
  if (!el) throw new Error(`No se encontró ${selector}`);
  return el;
};

export const $$ = (raiz, selector) => [...raiz.querySelectorAll(selector)];

let contador = 0;
/** Identificador único para enlazar etiquetas y controles. */
export const uid = (prefijo = 'fui') => `${prefijo}-${++contador}`;

/**
 * Deslizador con etiqueta y salida, con las clases comunes `.int-deslizador`.
 * `etiqueta` puede contener HTML (p. ej. KaTeX ya renderizado).
 */
export const deslizador = ({ etiqueta, min, max, paso, valor, formato = String, alCambiar }) => {
  const el = html(`<label class="int-deslizador">
      <span>${etiqueta}</span>
      <input type="range" min="${min}" max="${max}" step="${paso}" value="${valor}" />
      <output>${formato(valor)}</output>
    </label>`);
  const input = el.querySelector('input');
  const out = el.querySelector('output');
  input.addEventListener('input', () => {
    const v = Number(input.value);
    out.textContent = formato(v);
    alCambiar(v);
  });
  return {
    el,
    get valor() {
      return Number(input.value);
    },
    set deshabilitado(d) {
      input.disabled = d;
    },
  };
};

/**
 * Control segmentado (`.int-segmentado`). `opciones`: [{ id, texto }].
 */
export const segmentado = ({ opciones, actual, etiqueta, alCambiar }) => {
  const el = html(`<div class="int-segmentado" role="group" aria-label="${etiqueta}"></div>`);
  const botones = opciones.map((o) => {
    const b = html(`<button type="button">${o.texto}</button>`);
    b.addEventListener('click', () => {
      marcar(o.id);
      alCambiar(o.id);
    });
    el.append(b);
    return [o.id, b];
  });
  const marcar = (id) => botones.forEach(([i, b]) => b.setAttribute('aria-pressed', String(i === id)));
  marcar(actual);
  return { el, marcar };
};
