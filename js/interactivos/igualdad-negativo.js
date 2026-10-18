// Interactivo 1.7c: vectores iguales, paralelos, negativos y antiparalelos.
import { Plano, flecha, etiqueta } from '../nucleo/lienzo.js';
import { html, segmentado } from '../lib/dom.js';
import { conMath } from '../lib/katex.js';
import { Tween } from '../lib/movimiento.js';
import { escala, rotar, suma } from '../lib/vec.js';

const MODOS = [
  { id: 'igual', texto: 'Igual', giro: 0, k: 1, etiqueta: "\\vec{A}\\,'", explica: "Misma magnitud y misma dirección: $\\vec A\\,' = \\vec A$, aunque empiece en otro punto." },
  { id: 'doble', texto: 'Paralelo', giro: 0, k: 2, etiqueta: '\\vec{B}', explica: 'Misma dirección pero distinta magnitud: son **paralelos**, pero no iguales.' },
  { id: 'negativo', texto: 'Negativo', giro: 180, k: 1, etiqueta: '-\\vec{A}', explica: 'Misma magnitud, dirección opuesta: es el **negativo** de $\\vec A$.' },
  { id: 'anti', texto: 'Antiparalelo', giro: 180, k: 0.5, etiqueta: '\\vec{C}', explica: 'Dirección opuesta y otra magnitud: **antiparalelo**, pero no es $-\\vec A$.' },
];

const A = { x: 3, y: 2 };
const ORIGEN_A = { x: -4.5, y: -1.5 };

export default function montar(raiz) {
  const el = html(`<div class="int">
    <div class="int-lienzo"></div>
    <p class="int-texto" aria-live="polite"></p>
    <div class="int-barra"><span class="empuje int-nota">Arrastra el punto para mover la copia</span></div>
  </div>`);
  raiz.append(el);
  const texto = el.querySelector('.int-texto');

  const plano = new Plano(el.querySelector('.int-lienzo'), {
    x: [-6, 6.5],
    y: [-3.6, 3.8],
    rejilla: 0.5,
    ejes: false,
    altoMax: 380,
    titulo: 'Un vector A y una copia que se puede mover, invertir o estirar',
  });

  let cola = { x: 1, y: -1 };
  let modo = MODOS[0];
  const giro = new Tween(0, { alCambiar: () => dibujar() });
  const k = new Tween(1, { alCambiar: () => dibujar() });

  function dibujar() {
    const copia = rotar(escala(k.actual, A), giro.actual);
    plano.pintar([
      flecha(plano, ORIGEN_A, suma(ORIGEN_A, A), { color: 'var(--vec-a)' }),
      etiqueta(plano, suma(ORIGEN_A, escala(0.5, A)), '\\vec{A}', { color: 'var(--vec-a)', dx: -14, dy: -14 }),
      flecha(plano, cola, suma(cola, copia), { color: 'var(--vec-b)' }),
      etiqueta(plano, suma(cola, escala(0.5, copia)), modo.etiqueta, { color: 'var(--vec-b)', dx: 16, dy: -16, fondo: true }),
    ]);
    texto.innerHTML = conMath(modo.explica);
  }

  plano.manija({
    pos: () => cola,
    color: 'var(--vec-b)',
    nombre: 'cola de la copia',
    restringir: (p) => ({ x: Math.max(-5, Math.min(5.5, p.x)), y: Math.max(-3.2, Math.min(3.2, p.y)) }),
    alMover: (p) => {
      cola = p;
      dibujar();
    },
  });

  const control = segmentado({
    opciones: MODOS,
    actual: 'igual',
    etiqueta: 'Relación con A',
    alCambiar: (id) => {
      modo = MODOS.find((m) => m.id === id);
      giro.ir(modo.giro, { duracion: 700 });
      k.ir(modo.k, { duracion: 700 });
      dibujar();
    },
  });
  el.querySelector('.int-barra').prepend(control.el);
  plano.alRedibujar(dibujar);
  dibujar();
}
