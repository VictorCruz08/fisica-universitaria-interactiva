// Interactivo 1.8a: componentes de un vector y sus signos por cuadrante.
import { Plano, flecha, etiqueta, poligono, arco } from '../nucleo/lienzo.js';
import { html } from '../lib/dom.js';
import { tex } from '../lib/katex.js';
import { RAD, angulo, cuadrante, fmt, magnitud } from '../lib/vec.js';

const O = { x: 0, y: 0 };
const SIGNOS = { x: ['+', '−', '−', '+'], y: ['+', '+', '−', '−'] };
const signo = (v) => (Math.abs(v) < 1e-9 ? '0' : v > 0 ? '+' : '−');

export default function montar(raiz) {
  const el = html(`<div class="int">
    <div class="int-lienzo"></div>
    <div class="int-lectura"><span class="m"></span><span class="t"></span><span class="ax c-x"></span><span class="ay c-y"></span></div>
    <div class="int-tabla i-signos">
      <table aria-label="Signos de las componentes por cuadrante">
        <thead><tr><th>Cuadrante</th><th>I</th><th>II</th><th>III</th><th>IV</th><th>Ahora</th></tr></thead>
        <tbody>
          <tr data-c="x"><td>${tex('A_x')}</td>${SIGNOS.x.map((s) => `<td>${s}</td>`).join('')}<td class="ahora"></td></tr>
          <tr data-c="y"><td>${tex('A_y')}</td>${SIGNOS.y.map((s) => `<td>${s}</td>`).join('')}<td class="ahora"></td></tr>
        </tbody>
      </table>
    </div>
    <div class="int-barra"><span class="int-nota">Arrastra la punta de ${tex('\\vec A')} por los cuatro cuadrantes y observa los signos.</span></div>
  </div>`);
  raiz.append(el);
  const plano = new Plano(el.querySelector('.int-lienzo'), { x: [-5, 5], y: [-3.4, 3.4], rejilla: 0.5, marcas: 1, altoMax: 400, titulo: 'Un vector y sus componentes x e y' });

  let A = { x: 3.5, y: 2 };

  function dibujar() {
    const mA = magnitud(A);
    const th = angulo(A);
    const q = cuadrante(A);
    const medio = (th / 2) * RAD;
    plano.pintar([
      poligono(plano, [{ x: A.x, y: 0 }, A, { x: 0, y: A.y }], { cerrado: false, borde: 'var(--tinta-3)', grosor: 1, discontinuo: true }),
      flecha(plano, O, { x: A.x, y: 0 }, { color: 'var(--vec-x)', grosor: 2.2, opacidad: 0.55 }),
      flecha(plano, O, { x: 0, y: A.y }, { color: 'var(--vec-y)', grosor: 2.2, opacidad: 0.55 }),
      mA > 0.4 && arco(plano, O, 0, th, { radio: 30, sentido: true, relleno: true }),
      mA > 0.4 && etiqueta(plano, O, '\\theta', { color: 'var(--ocre)', dx: 46 * Math.cos(medio), dy: -46 * Math.sin(medio), tamano: 15 }),
      flecha(plano, O, A, { color: 'var(--vec-a)', grosor: 3 }),
      etiqueta(plano, A, '\\vec{A}', { color: 'var(--vec-a)', dx: A.x >= 0 ? 20 : -20, dy: A.y >= 0 ? -14 : 14 }),
      Math.abs(A.x) > 0.6 && etiqueta(plano, { x: A.x / 2, y: 0 }, 'A_x', { color: 'var(--vec-x)', dy: A.y >= 0 ? 26 : -24, tamano: 15, fondo: true }),
      Math.abs(A.y) > 0.6 && etiqueta(plano, { x: 0, y: A.y / 2 }, 'A_y', { color: 'var(--vec-y)', dx: A.x >= 0 ? -22 : 22, tamano: 15, fondo: true }),
    ]);
    el.querySelector('.m').innerHTML = tex(`A = ${fmt(mA)}`);
    el.querySelector('.t').innerHTML = tex(`\\theta = ${fmt(th, 1)}^\\circ`);
    el.querySelector('.ax').innerHTML = tex(`A_x = A\\cos\\theta = ${fmt(A.x)}`);
    el.querySelector('.ay').innerHTML = tex(`A_y = A\\sin\\theta = ${fmt(A.y)}`);
    el.querySelectorAll('thead th').forEach((th, i) => th.classList.toggle('activo', i >= 1 && i <= 4 && i === q));
    el.querySelectorAll('tbody tr').forEach((tr) => {
      [...tr.children].forEach((td, i) => i >= 1 && i <= 4 && td.classList.toggle('activo', i === q));
      tr.querySelector('.ahora').textContent = signo(tr.dataset.c === 'x' ? A.x : A.y);
    });
  }

  plano.manija({
    pos: () => A,
    paso: 0.25,
    nombre: 'punta del vector A',
    restringir: (p) => ({ x: Math.max(-4.5, Math.min(4.5, p.x)), y: Math.max(-3, Math.min(3, p.y)) }),
    alMover: (p) => ((A = p), dibujar()),
  });
  plano.alRedibujar(dibujar);
  dibujar();
}
