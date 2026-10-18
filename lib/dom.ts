/** Utilidades pequeñas para construir los interactivos (código imperativo sobre el DOM). */

/** Crea un elemento HTML a partir de una cadena (un solo nodo raíz). */
export const html = <T extends Element = HTMLElement>(cadena: string): T => {
  const t = document.createElement('template');
  t.innerHTML = cadena.trim();
  return t.content.firstElementChild as T;
};

type Deslizador = {
  etiqueta: string;
  min: number;
  max: number;
  paso: number;
  valor: number;
  formato?: (v: number) => string;
  alCambiar: (v: number) => void;
};

/** Deslizador con etiqueta y salida (`.int-deslizador`). `etiqueta` admite HTML (p. ej. KaTeX). */
export const deslizador = ({ etiqueta, min, max, paso, valor, formato = String, alCambiar }: Deslizador) => {
  const el = html(`<label class="int-deslizador">
      <span>${etiqueta}</span>
      <input type="range" min="${min}" max="${max}" step="${paso}" value="${valor}" />
      <output>${formato(valor)}</output>
    </label>`);
  const input = el.querySelector('input')!;
  const out = el.querySelector('output')!;
  const fijar = (v: number) => {
    input.value = String(v);
    out.textContent = formato(v);
  };
  input.addEventListener('input', () => {
    const v = Number(input.value);
    out.textContent = formato(v);
    alCambiar(v);
  });
  return {
    el,
    fijar,
    get valor() {
      return Number(input.value);
    },
    set deshabilitado(d: boolean) {
      input.disabled = d;
    },
  };
};

type Segmentado = {
  opciones: { id: string; texto: string }[];
  actual: string;
  etiqueta: string;
  alCambiar: (id: string) => void;
};

/** Control segmentado (`.int-segmentado`). */
export const segmentado = ({ opciones, actual, etiqueta, alCambiar }: Segmentado) => {
  const el = html(`<div class="int-segmentado" role="group" aria-label="${etiqueta}"></div>`);
  const botones = opciones.map((o) => {
    const b = html<HTMLButtonElement>(`<button type="button">${o.texto}</button>`);
    b.addEventListener('click', () => {
      marcar(o.id);
      alCambiar(o.id);
    });
    el.append(b);
    return [o.id, b] as const;
  });
  const marcar = (id: string) => botones.forEach(([i, b]) => b.setAttribute('aria-pressed', String(i === id)));
  marcar(actual);
  return { el, marcar };
};
