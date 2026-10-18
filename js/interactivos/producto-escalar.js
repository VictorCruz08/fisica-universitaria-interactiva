// Interactivo 1.10a: el producto escalar como la "sombra" de B sobre A.
import { Plano, flecha, etiqueta, poligono, arco } from '../nucleo/lienzo.js';
import { html } from '../lib/dom.js';
import { tex } from '../lib/katex.js';
import { angulo, anguloEntre, escala, fmt, magnitud, punto } from '../lib/vec.js';

const O = { x: 0, y: 0 };
const limitar = (p) => ({ x: Math.max(-4.5, Math.min(4.5, p.x)), y: Math.max(-3, Math.min(3, p.y)) });

export default function montar(raiz) {
  const el = html(`<div class="int">
    <div class="int-lienzo"></div>
    <div class="int-lectura"><span class="mags"></span><span class="res"></span></div>
    <div class="i-medidor" aria-hidden="true">
      <span class="ext">${tex('-AB')}</span>
      <div class="pista"><div class="cero"></div><div class="relleno"></div></div>
      <span class="ext">${tex('+AB')}</span>
    </div>
    <div class="int-barra"><span class="nota"></span></div>
  </div>`);
  raiz.append(el);
  const plano = new Plano(el.querySelector('.int-lienzo'), { x: [-5, 5], y: [-3.4, 3.4], rejilla: 0.5, ejes: false, altoMax: 380, titulo: 'Producto escalar como proyección de B sobre la dirección de A' });

  let A = { x: 3.5, y: 1 };
  let B = { x: 1.5, y: 2.5 };

  function dibujar() {
    const mA = magnitud(A);
    const mB = magnitud(B);
    const phi = anguloEntre(A, B);
    const pAB = punto(A, B);
    const uA = mA > 0 ? escala(1 / mA, A) : { x: 1, y: 0 };
    const proy = mA > 0 ? pAB / mA : 0; // B cos φ
    const pie = escala(proy, uA);
    const signo = Math.abs(pAB) < 0.05 ? 'cero' : pAB > 0 ? 'positivo' : 'negativo';
    const color = signo === 'cero' ? 'var(--tinta-3)' : signo === 'positivo' ? 'var(--verde)' : 'var(--rojo)';
    const tA = angulo(A);
    const delta = ((angulo(B) - tA + 540) % 360) - 180; // camino corto de A hacia B
    const medio = ((tA + delta / 2) * Math.PI) / 180;
    plano.pintar([
      poligono(plano, [escala(-6, uA), escala(6, uA)], { cerrado: false, borde: 'var(--linea-fuerte)', grosor: 1, discontinuo: true }),
      poligono(plano, [B, pie], { cerrado: false, borde: 'var(--tinta-3)', grosor: 1, discontinuo: true }),
      poligono(plano, [O, pie], { cerrado: false, borde: color, grosor: 7, opacidad: 0.45 }),
      mA > 0.3 && mB > 0.3 && arco(plano, O, tA, tA + delta, { radio: 30, relleno: true }),
      mA > 0.3 && mB > 0.3 && etiqueta(plano, O, '\\phi', { color: 'var(--ocre)', dx: 46 * Math.cos(medio), dy: -46 * Math.sin(medio), tamano: 15 }),
      flecha(plano, O, A, { color: 'var(--vec-a)' }),
      flecha(plano, O, B, { color: 'var(--vec-b)' }),
      etiqueta(plano, A, '\\vec{A}', { color: 'var(--vec-a)', dx: A.x >= 0 ? 18 : -18, dy: -12 }),
      etiqueta(plano, B, '\\vec{B}', { color: 'var(--vec-b)', dx: B.x >= 0 ? 18 : -18, dy: -12 }),
      Math.abs(proy) > 0.8 && etiqueta(plano, escala(0.5, pie), 'B\\cos\\phi', { color, dx: 14 * uA.y, dy: 18, tamano: 14, fondo: true }),
    ]);
    el.querySelector('.mags').innerHTML = tex(`A = ${fmt(mA)},\\; B = ${fmt(mB)},\\; \\phi = ${fmt(phi, 1)}^\\circ`);
    const res = el.querySelector('.res');
    res.innerHTML = tex(`\\vec A\\cdot\\vec B = AB\\cos\\phi = ${fmt(pAB)}`);
    res.style.color = color;
    const maximo = mA * mB || 1;
    const relleno = el.querySelector('.relleno');
    relleno.style.background = color;
    relleno.style.left = pAB >= 0 ? '50%' : `${50 + (50 * pAB) / maximo}%`;
    relleno.style.width = `${(50 * Math.abs(pAB)) / maximo}%`;
    const extra = { positivo: ': φ < 90°, la “sombra” de B cae a favor de A.', negativo: ': φ > 90°, la “sombra” cae en contra de A.', cero: ': φ = 90°, los vectores son perpendiculares.' }[signo];
    el.querySelector('.nota').innerHTML = `El producto es <strong style="color:${color}">${signo}</strong>${extra}`;
  }

  plano.manija({ pos: () => A, color: 'var(--vec-a)', restringir: limitar, nombre: 'punta de A', alMover: (p) => ((A = p), dibujar()) });
  plano.manija({ pos: () => B, color: 'var(--vec-b)', restringir: limitar, nombre: 'punta de B', alMover: (p) => ((B = p), dibujar()) });
  plano.alRedibujar(dibujar);
  dibujar();
}
