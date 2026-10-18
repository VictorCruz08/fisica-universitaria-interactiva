// Interactivo 1.7d: suma cabeza-cola, conmutatividad y rango de la magnitud.
import { Plano, flecha, etiqueta, poligono } from '../nucleo/lienzo.js';
import { html } from '../lib/dom.js';
import { tex } from '../lib/katex.js';
import { Tween, easeOut } from '../lib/movimiento.js';
import { escala, fmt, magnitud, resta, suma } from '../lib/vec.js';

const O = { x: 0, y: 0 };
const limitar = (p) => ({ x: Math.max(-5.5, Math.min(6.5, p.x)), y: Math.max(-2.5, Math.min(5.5, p.y)) });

export default function montar(raiz) {
  const el = html(`<div class="int">
    <div class="int-lienzo"></div>
    <div class="int-lectura"><span class="la"></span><span class="lb"></span><span class="lc c-r"></span><span class="ld tenue"></span></div>
    <div class="i-recta" aria-hidden="true">
      <div class="pista"><div class="intervalo"></div><div class="marcador"><span>C</span></div></div>
      <div class="extremos"><span class="min"></span><span class="max"></span></div>
    </div>
    <div class="int-barra">
      <button type="button" class="boton" aria-pressed="false">Mostrar B + A</button>
      <span class="empuje int-nota">Arrastra las puntas de A y de B</span>
    </div>
  </div>`);
  raiz.append(el);

  const plano = new Plano(el.querySelector('.int-lienzo'), { x: [-6, 7], y: [-3, 6], rejilla: 0.5, altoMax: 420, titulo: 'Suma de dos vectores por el método cabeza-cola' });

  let A = { x: 3, y: 1 };
  let B = { x: 1, y: 2.5 };
  let conmutar = false;
  const alterna = new Tween(0, { curva: easeOut, alCambiar: () => dibujar() });

  function dibujar() {
    const C = suma(A, B);
    const t = alterna.actual;
    plano.pintar([
      t > 0.01 && poligono(plano, [O, A, C, B], { relleno: 'var(--vec-r)', opacidad: 0.06 * t }),
      t > 0.01 && flecha(plano, O, escala(t, B), { color: 'var(--vec-b)', discontinua: true, opacidad: 0.75 * t }),
      t > 0.01 && flecha(plano, B, suma(B, escala(t, A)), { color: 'var(--vec-a)', discontinua: true, opacidad: 0.75 * t }),
      flecha(plano, O, C, { color: 'var(--vec-r)', grosor: 3.2 }),
      flecha(plano, O, A, { color: 'var(--vec-a)' }),
      flecha(plano, A, C, { color: 'var(--vec-b)' }),
      etiqueta(plano, escala(0.5, A), '\\vec{A}', { color: 'var(--vec-a)', dy: 16, dx: 8, fondo: true }),
      etiqueta(plano, suma(A, escala(0.5, B)), '\\vec{B}', { color: 'var(--vec-b)', dx: 18, fondo: true }),
      etiqueta(plano, escala(0.5, C), '\\vec{C}', { color: 'var(--vec-r)', dx: -18, dy: -12, fondo: true }),
    ]);
    const mA = magnitud(A);
    const mB = magnitud(B);
    const mC = magnitud(C);
    const min = Math.abs(mA - mB);
    const max = mA + mB;
    el.querySelector('.la').innerHTML = tex(`A = ${fmt(mA)}`);
    el.querySelector('.lb').innerHTML = tex(`B = ${fmt(mB)}`);
    el.querySelector('.lc').innerHTML = tex(`C = |\\vec A + \\vec B| = ${fmt(mC)}`);
    el.querySelector('.ld').innerHTML = tex(`A + B = ${fmt(max)}`);
    const pct = (v) => `${(100 * v) / Math.max(max, 0.001)}%`;
    const intervalo = el.querySelector('.intervalo');
    intervalo.style.left = pct(min);
    intervalo.style.width = `calc(${pct(max)} - ${pct(min)})`;
    el.querySelector('.marcador').style.left = pct(mC);
    el.querySelector('.min').innerHTML = tex(`|A-B| = ${fmt(min)}`);
    el.querySelector('.max').innerHTML = tex(`A+B = ${fmt(max)}`);
  }

  plano.manija({ pos: () => A, color: 'var(--vec-a)', restringir: limitar, nombre: 'punta de A', alMover: (p) => ((A = p), dibujar(), puntaB.colocar()) });
  const puntaB = plano.manija({ pos: () => suma(A, B), color: 'var(--vec-b)', restringir: limitar, nombre: 'punta de B', alMover: (p) => ((B = resta(p, A)), dibujar()) });

  const boton = el.querySelector('.int-barra .boton');
  boton.addEventListener('click', () => {
    conmutar = !conmutar;
    boton.setAttribute('aria-pressed', String(conmutar));
    boton.textContent = `${conmutar ? 'Ocultar' : 'Mostrar'} B + A`;
    alterna.ir(conmutar ? 1 : 0, { duracion: 600 });
  });
  plano.alRedibujar(dibujar);
  dibujar();
}
