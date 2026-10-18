// Interactivo 1.10g: sistema derecho (î × ĵ = k̂) frente a sistema izquierdo.
import { Escena3D, flecha, etiqueta } from '../nucleo/lienzo.js';
import { html, segmentado } from '../lib/dom.js';
import { tex } from '../lib/katex.js';

export default function montar(raiz) {
  const el = html(`<div class="int">
    <div class="int-lienzo"></div>
    <div class="int-lectura"><span class="res" style="font-size:1.1rem"></span><span class="tenue desc"></span></div>
    <div class="int-barra"></div>
  </div>`);
  raiz.append(el);
  const escena = new Escena3D(el.querySelector('.int-lienzo'), { titulo: 'Sistema de coordenadas derecho o izquierdo', tamano: 2.6, alto: 320 });
  let izquierdo = false;
  const O = { x: 0, y: 0, z: 0 };

  function dibujar() {
    // k̂ apunta a lo largo del eje z dibujado; la regla de la mano derecha siempre da "arriba".
    const k = { x: 0, y: 0, z: izquierdo ? -1.6 : 1.6 };
    const mano = { x: 0.12, y: 0.12, z: 2.1 };
    escena.pintar([
      flecha(escena, O, { x: 1.6, y: 0, z: 0 }, { color: 'var(--vec-x)', grosor: 3 }),
      flecha(escena, O, { x: 0, y: 1.6, z: 0 }, { color: 'var(--vec-y)', grosor: 3 }),
      flecha(escena, O, k, { color: 'var(--vec-z)', grosor: 3 }),
      flecha(escena, { x: 0.12, y: 0.12, z: 0 }, mano, { color: 'var(--ocre)', grosor: 2, discontinua: true }),
      etiqueta(escena, { x: 1.6, y: 0, z: 0 }, '\\hat\\imath', { color: 'var(--vec-x)', dx: -12, dy: 12 }),
      etiqueta(escena, { x: 0, y: 1.6, z: 0 }, '\\hat\\jmath', { color: 'var(--vec-y)', dy: 14 }),
      etiqueta(escena, k, '\\hat k', { color: 'var(--vec-z)', dx: -16 }),
      etiqueta(escena, mano, '\\text{mano derecha: }\\hat\\imath\\times\\hat\\jmath', { color: 'var(--ocre)', dx: 92, tamano: 13, fondo: true }),
    ]);
    el.querySelector('.res').innerHTML = tex(izquierdo ? '\\hat\\imath\\times\\hat\\jmath = -\\hat k' : '\\hat\\imath\\times\\hat\\jmath = \\hat k');
    el.querySelector('.desc').textContent = izquierdo ? 'Sistema izquierdo: no lo usaremos.' : 'Sistema derecho: el que usa el libro.';
  }

  el.querySelector('.int-barra').append(
    segmentado({
      opciones: [
        { id: 'der', texto: 'Derecho' },
        { id: 'izq', texto: 'Izquierdo (z invertido)' },
      ],
      actual: 'der',
      etiqueta: 'Tipo de sistema',
      alCambiar: (id) => {
        izquierdo = id === 'izq';
        escena.invertirZ(izquierdo);
        dibujar();
      },
    }).el,
  );
  escena.alRedibujar(dibujar);
  dibujar();
}
