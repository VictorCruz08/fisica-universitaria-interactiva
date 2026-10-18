// Interactivo 1.8c: lo que da arctan en la calculadora frente a la dirección real.
import { Plano, flecha, etiqueta, arco } from './nucleo/lienzo';
import { html } from '@/lib/dom';
import { tex } from '@/lib/katex';
import { angulo, arctanCalculadora, cuadrante, desdePolar, fmt } from '@/lib/vec';

const O = { x: 0, y: 0 };
const ROMANOS = ['sobre un eje', 'I', 'II', 'III', 'IV'];

export default function montar(raiz) {
  const el = html(`<div class="int">
    <div class="int-lienzo"></div>
    <div class="int-lectura"><span class="comp"></span><span class="calc"></span></div>
    <p class="int-texto" aria-live="polite"></p>
    <div class="int-barra"><span class="int-nota">Prueba con un vector en el cuadrante II o III.</span></div>
  </div>`);
  raiz.append(el);
  const plano = new Plano(el.querySelector('.int-lienzo'), { x: [-5, 5], y: [-3.4, 3.4], rejilla: 0.5, altoMax: 380, titulo: 'Comparación entre lo que da la calculadora y la dirección real del vector' });

  let A = { x: -3, y: 2 };

  function dibujar() {
    const valido = Math.abs(A.x) > 1e-9;
    const calc = valido ? arctanCalculadora(A) : NaN;
    const real = angulo(A);
    const realFirmado = real > 180 ? real - 360 : real;
    const corregir = valido && Math.abs(calc - realFirmado) > 1;
    const q = cuadrante(A);
    plano.pintar([
      corregir && flecha(plano, O, desdePolar(4.2, calc), { color: 'var(--tinta-3)', grosor: 1.6, discontinua: true }),
      corregir && etiqueta(plano, desdePolar(4.2, calc), '\\text{calculadora}', { color: 'var(--tinta-2)', dx: 10, dy: calc > 0 ? -16 : 16, tamano: 13, fondo: true }),
      corregir && arco(plano, O, calc, realFirmado, { radio: 52, color: 'var(--rojo)', sentido: true }),
      arco(plano, O, 0, real, { radio: 28 }),
      flecha(plano, O, A, { color: 'var(--vec-a)', grosor: 3 }),
      etiqueta(plano, A, '\\vec{A}', { color: 'var(--vec-a)', dx: A.x >= 0 ? 18 : -18, dy: A.y >= 0 ? -14 : 14 }),
    ]);
    el.querySelector('.comp').innerHTML = tex(`A_x = ${fmt(A.x, 1)},\\; A_y = ${fmt(A.y, 1)}`);
    el.querySelector('.calc').innerHTML = valido
      ? tex(`\\arctan\\frac{A_y}{A_x} = \\arctan(${fmt(A.y / A.x)}) = ${fmt(calc, 1)}^\\circ`)
      : tex('A_x = 0:\\ \\text{la tangente no está definida}');
    const texto = el.querySelector('.int-texto');
    if (!valido) texto.innerHTML = `El vector es vertical: ${tex(A.y >= 0 ? '\\theta = 90^\\circ' : '\\theta = 270^\\circ')}.`;
    else if (corregir)
      texto.innerHTML = `El dibujo está en el cuadrante <strong style="color:var(--rojo)">${ROMANOS[q]}</strong>, pero la calculadora apunta al opuesto. Hay que sumar ${tex('180^\\circ')}: ${tex(`\\theta = ${fmt(calc, 1)}^\\circ + 180^\\circ = ${fmt(calc + 180, 1)}^\\circ`)}.`;
    else texto.innerHTML = `Aquí la calculadora acierta: el vector está en el cuadrante <strong>${ROMANOS[q]}</strong> y ${tex(`\\theta = ${fmt(realFirmado, 1)}^\\circ`)}.`;
  }

  plano.manija({
    pos: () => A,
    nombre: 'punta del vector A',
    restringir: (p) => ({ x: Math.max(-4.5, Math.min(4.5, p.x)), y: Math.max(-3, Math.min(3, p.y)) }),
    alMover: (p) => ((A = p), dibujar()),
  });
  plano.alRedibujar(dibujar);
  dibujar();
}
