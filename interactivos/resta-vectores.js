// Interactivo 1.7f: la resta A − B como A + (−B), paso a paso.
import { Plano, flecha, etiqueta } from './nucleo/lienzo';
import { html } from '@/lib/dom';
import { conMath, tex } from '@/lib/katex';
import { Tween } from '@/lib/movimiento';
import { escala, rotar, suma } from '@/lib/vec';

const A = { x: 4, y: 1.5 };
const B = { x: 1.5, y: 3 };
const O = { x: 0, y: 0 };
const D = suma(A, escala(-1, B));

const TEXTOS = [
  'Queremos restar $\\vec B$ de $\\vec A$.',
  'Primero obtenemos $-\\vec B$: misma magnitud, dirección opuesta.',
  'Colocamos la cola de $-\\vec B$ en la punta de $\\vec A$.',
  'La diferencia $\\vec A - \\vec B$ va de la cola de $\\vec A$ a la punta de $-\\vec B$.',
];

export default function montar(raiz) {
  const el = html(`<div class="int">
    <div class="int-lienzo"></div>
    <p class="int-texto" aria-live="polite"></p>
    <div class="int-lectura"><span>${tex('\\vec A - \\vec B = \\vec A + (-\\vec B)')}</span></div>
    <div class="int-barra">
      <button type="button" class="boton primario reproducir">Reproducir</button>
      <button type="button" class="boton reiniciar">Reiniciar</button>
      <span class="empuje int-nota atajo" hidden>La flecha punteada muestra el atajo: “punta con punta”.</span>
    </div>
  </div>`);
  raiz.append(el);
  const plano = new Plano(el.querySelector('.int-lienzo'), {
    x: [-1.5, 6.5],
    y: [-2.8, 4],
    rejilla: 0.5,
    altoMax: 360,
    titulo: 'Animación de la resta A menos B como A más menos B',
  });

  // Fases: 0 = cola con cola · 1 = B se invierte · 2 = −B viaja a la punta de A · 3 = aparece A − B
  let fase = 0;
  const redibujar = () => dibujar();
  const giro = new Tween(0, { alCambiar: redibujar });
  const viaje = new Tween(0, { alCambiar: redibujar });
  const brillo = new Tween(0, { alCambiar: redibujar });
  const btn = el.querySelector('.reproducir');

  function dibujar() {
    const vB = rotar(B, giro.actual);
    const colaB = escala(viaje.actual, A);
    const b = brillo.actual;
    plano.pintar([
      b > 0.01 && flecha(plano, O, D, { color: 'var(--vec-r)', grosor: 3.2, opacidad: b }),
      b > 0.01 && etiqueta(plano, escala(0.5, D), '\\vec{A}-\\vec{B}', { color: 'var(--vec-r)', dx: -34, dy: 10, opacidad: b, fondo: true }),
      b > 0.01 && flecha(plano, B, A, { color: 'var(--vec-r)', discontinua: true, grosor: 2, opacidad: 0.5 * b }),
      b > 0.01 && flecha(plano, O, B, { color: 'var(--vec-b)', grosor: 2, opacidad: 0.3 * b }),
      flecha(plano, O, A, { color: 'var(--vec-a)' }),
      etiqueta(plano, escala(0.5, A), '\\vec{A}', { color: 'var(--vec-a)', dy: 16, dx: 10, fondo: true }),
      flecha(plano, colaB, suma(colaB, vB), { color: 'var(--vec-b)' }),
      etiqueta(plano, suma(colaB, escala(0.5, vB)), giro.actual > 90 ? '-\\vec{B}' : '\\vec{B}', { color: 'var(--vec-b)', dx: -18, dy: -4, fondo: true }),
    ]);
    el.querySelector('.int-texto').innerHTML = conMath(TEXTOS[fase]);
    btn.disabled = fase === 1 || fase === 2;
    btn.textContent = fase === 3 ? 'Repetir' : 'Reproducir';
    el.querySelector('.atajo').hidden = fase !== 3;
  }

  function reiniciar(instantaneo = false) {
    fase = 0;
    for (const tw of [giro, viaje, brillo]) instantaneo ? tw.fijar(0) : tw.ir(0, { duracion: 500 });
    dibujar();
  }

  btn.addEventListener('click', async () => {
    if (fase === 3) reiniciar(true);
    fase = 1;
    dibujar();
    await giro.ir(180, { duracion: 900 });
    fase = 2;
    dibujar();
    await viaje.ir(1, { duracion: 900 });
    fase = 3;
    dibujar();
    await brillo.ir(1, { duracion: 600 });
  });
  el.querySelector('.reiniciar').addEventListener('click', () => reiniciar());
  plano.alRedibujar(dibujar);
  dibujar();
}
