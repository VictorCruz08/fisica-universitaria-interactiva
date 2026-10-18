// Interactivo 1.10c: el ángulo entre dos vectores en 3D con el producto escalar.
import { Escena3D, flecha, etiqueta } from '../nucleo/lienzo.js';
import { html } from '../lib/dom.js';
import { tex } from '../lib/katex.js';
import { anguloEntre3, escala3, fmt, magnitud3, punto3 } from '../lib/vec.js';

const EJES = ['x', 'y', 'z'];
const par = (v) => (v < 0 ? `(${v})` : String(v));

export default function montar(raiz) {
  const V = { A: { x: 1, y: 2, z: 2 }, B: { x: 4, y: 0, z: 3 } };
  const el = html(`<div class="int i-angulo">
    <div class="dos">
      <div class="escena"></div>
      <div class="panel">
        ${['A', 'B']
          .map(
            (n) => `<div class="fila"><span class="nom c-${n.toLowerCase()}">${tex(`\\vec ${n}`)}</span>${EJES.map(
              (e) => `<div class="paso"><button type="button" data-v="${n}" data-e="${e}" data-d="-1" aria-label="Disminuir ${n}${e}">−</button><span class="n" data-v="${n}" data-e="${e}"></span><button type="button" data-v="${n}" data-e="${e}" data-d="1" aria-label="Aumentar ${n}${e}">+</button></div>`,
            ).join('')}</div>`,
          )
          .join('')}
        <div class="calculo"></div>
      </div>
    </div>
  </div>`);
  raiz.append(el);
  const escena = new Escena3D(el.querySelector('.escena'), { titulo: 'Dos vectores en tres dimensiones', tamano: 3.6, alto: 340 });

  function dibujar() {
    const { A, B } = V;
    const mA = magnitud3(A);
    const mB = magnitud3(B);
    const p = punto3(A, B);
    const k = 3.4 / Math.max(mA, mB, 1);
    const O = { x: 0, y: 0, z: 0 };
    escena.pintar([
      flecha(escena, O, escala3(k, A), { color: 'var(--vec-a)', grosor: 3 }),
      flecha(escena, O, escala3(k, B), { color: 'var(--vec-b)', grosor: 3 }),
      etiqueta(escena, escala3(k, A), '\\vec{A}', { color: 'var(--vec-a)', dx: 14, dy: -12 }),
      etiqueta(escena, escala3(k, B), '\\vec{B}', { color: 'var(--vec-b)', dx: 14, dy: -12 }),
    ]);
    el.querySelectorAll('.n').forEach((s) => (s.textContent = V[s.dataset.v][s.dataset.e]));
    el.querySelector('.calculo').innerHTML =
      `<p>${tex(`\\vec A\\cdot\\vec B = ${par(A.x)}${par(B.x)} + ${par(A.y)}${par(B.y)} + ${par(A.z)}${par(B.z)} = ${p}`)}</p>` +
      `<p>${tex(`A = ${fmt(mA, 3)},\\quad B = ${fmt(mB, 3)}`)}</p>` +
      (mA > 0 && mB > 0
        ? `<p>${tex(`\\cos\\phi = \\dfrac{\\vec A\\cdot\\vec B}{AB} = ${fmt(p / (mA * mB), 3)}`)}</p><p class="phi c-ocre">${tex(`\\phi = ${fmt(anguloEntre3(A, B), 1)}^\\circ`)}</p>`
        : '<p class="tenue">Un vector cero no tiene dirección: el ángulo no está definido.</p>');
  }

  el.querySelectorAll('.paso button').forEach((b) =>
    b.addEventListener('click', () => {
      const v = V[b.dataset.v];
      v[b.dataset.e] = Math.max(-5, Math.min(5, v[b.dataset.e] + Number(b.dataset.d)));
      dibujar();
    }),
  );
  escena.alRedibujar(dibujar);
  dibujar();
}
