// Interactivo 1.7e: el orden de la suma no cambia la resultante (asociatividad).
import { Plano, flecha, etiqueta } from '../nucleo/lienzo.js';
import { html, segmentado } from '../lib/dom.js';
import { tex } from '../lib/katex.js';
import { Tween } from '../lib/movimiento.js';
import { escala, suma } from '../lib/vec.js';

const VEC = { A: { x: 3, y: 1 }, B: { x: -1, y: 2.5 }, C: { x: 2, y: -1.5 } };
const COLOR = { A: 'var(--vec-a)', B: 'var(--vec-b)', C: 'var(--vec-d)' };
const R = suma(suma(VEC.A, VEC.B), VEC.C);
const ORDENES = [['A', 'B', 'C'], ['B', 'C', 'A'], ['C', 'A', 'B'], ['A', 'C', 'B']];

const colas = (orden) => {
  const r = {};
  let p = { x: 0, y: 0 };
  for (const id of orden) {
    r[id] = p;
    p = suma(p, VEC[id]);
  }
  return r;
};

export default function montar(raiz) {
  const el = html(`<div class="int">
    <div class="int-lienzo"></div>
    <div class="int-lectura"><span class="expr"></span></div>
    <div class="int-barra"><button type="button" class="boton empuje" aria-pressed="false">Suma parcial</button></div>
  </div>`);
  raiz.append(el);
  const plano = new Plano(el.querySelector('.int-lienzo'), {
    x: [-2.5, 6.5],
    y: [-1.2, 4.6],
    rejilla: 0.5,
    altoMax: 380,
    titulo: 'Tres vectores sumados en distintos órdenes; la resultante no cambia',
  });

  let orden = ORDENES[0];
  let parcial = false;
  const inicial = colas(orden);
  const t = Object.fromEntries(['A', 'B', 'C'].map((id) => [id, new Tween(inicial[id], { alCambiar: () => dibujar() })]));

  function dibujar() {
    const primera = suma(VEC[orden[0]], VEC[orden[1]]);
    plano.pintar([
      flecha(plano, { x: 0, y: 0 }, R, { color: 'var(--vec-r)', grosor: 3.2 }),
      etiqueta(plano, escala(0.5, R), '\\vec{R}', { color: 'var(--vec-r)', dy: 18, dx: 6, fondo: true }),
      parcial && flecha(plano, { x: 0, y: 0 }, primera, { color: 'var(--tinta-3)', discontinua: true, grosor: 2 }),
      parcial && etiqueta(plano, escala(0.5, primera), `\\vec{${orden[0]}}+\\vec{${orden[1]}}`, { color: 'var(--tinta-2)', dx: -30, dy: -6, tamano: 14, fondo: true }),
      ...['A', 'B', 'C'].flatMap((id) => {
        const c = t[id].actual;
        return [
          flecha(plano, c, suma(c, VEC[id]), { color: COLOR[id] }),
          etiqueta(plano, suma(c, escala(0.5, VEC[id])), `\\vec{${id}}`, { color: COLOR[id], dx: 14, dy: -12, fondo: true }),
        ];
      }),
    ]);
    el.querySelector('.expr').innerHTML = tex(`\\vec R = \\vec ${orden[0]} + \\vec ${orden[1]} + \\vec ${orden[2]}`);
  }

  const control = segmentado({
    opciones: ORDENES.map((o) => ({ id: o.join(''), texto: o.join(' + ') })),
    actual: 'ABC',
    etiqueta: 'Orden de la suma',
    alCambiar: (id) => {
      orden = id.split('');
      const c = colas(orden);
      ['A', 'B', 'C'].forEach((v, i) => t[v].ir(c[v], { duracion: 750, retraso: i * 90 }));
      dibujar();
    },
  });
  el.querySelector('.int-barra').prepend(control.el);

  const boton = el.querySelector('.int-barra .boton');
  boton.addEventListener('click', () => {
    parcial = !parcial;
    boton.setAttribute('aria-pressed', String(parcial));
    dibujar();
  });
  plano.alRedibujar(dibujar);
  dibujar();
}
