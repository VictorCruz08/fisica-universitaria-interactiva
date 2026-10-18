// Interactivo 1.8e: un vector en 3D como la diagonal de una caja.
import { Escena3D, flecha, etiqueta, poligono } from '../nucleo/lienzo.js';
import { html, deslizador } from '../lib/dom.js';
import { tex } from '../lib/katex.js';
import { fmt, magnitud3 } from '../lib/vec.js';

export default function montar(raiz) {
  const el = html(`<div class="int">
    <div class="int-lienzo"></div>
    <div class="int-lectura"><span class="m"></span></div>
    <div class="int-barra"></div>
  </div>`);
  raiz.append(el);
  const escena = new Escena3D(el.querySelector('.int-lienzo'), { titulo: 'Vector en tres dimensiones como diagonal de una caja', tamano: 3.6, alto: 380 });

  const comp = { x: 2, y: 3, z: 6 };

  function dibujar() {
    const { x: ax, y: ay, z: az } = comp;
    const k = 3.2 / Math.max(ax, ay, az, 1); // la caja más grande cabe en la escena
    const v = (x, y, z) => ({ x: x * k, y: y * k, z: z * k });
    const A = v(ax, ay, az);
    const aristas = [
      [v(ax, 0, 0), v(ax, ay, 0)],
      [v(0, ay, 0), v(ax, ay, 0)],
      [v(ax, 0, 0), v(ax, 0, az)],
      [v(0, ay, 0), v(0, ay, az)],
      [v(ax, ay, 0), v(ax, ay, az)],
      [v(0, 0, az), v(ax, 0, az)],
      [v(0, 0, az), v(0, ay, az)],
      [v(ax, 0, az), v(ax, ay, az)],
      [v(0, ay, az), v(ax, ay, az)],
    ];
    const O = v(0, 0, 0);
    escena.pintar([
      poligono(escena, [O, v(ax, 0, 0), v(ax, ay, 0), v(0, ay, 0)], { relleno: 'var(--azul)', opacidad: 0.06 }),
      ...aristas.map(([p, q]) => poligono(escena, [p, q], { cerrado: false, borde: 'var(--tinta-3)', grosor: 1, discontinuo: true })),
      flecha(escena, O, v(ax, 0, 0), { color: 'var(--vec-x)', grosor: 2.4, opacidad: 0.7 }),
      flecha(escena, O, v(0, ay, 0), { color: 'var(--vec-y)', grosor: 2.4, opacidad: 0.7 }),
      flecha(escena, O, v(0, 0, az), { color: 'var(--vec-z)', grosor: 2.4, opacidad: 0.7 }),
      flecha(escena, O, A, { color: 'var(--vec-a)', grosor: 3.2 }),
      etiqueta(escena, A, '\\vec{A}', { color: 'var(--vec-a)', dx: 16, dy: -12 }),
      etiqueta(escena, v(ax / 2, 0, 0), 'A_x', { color: 'var(--vec-x)', dx: -16, dy: 10, tamano: 14, fondo: true }),
      etiqueta(escena, v(0, ay / 2, 0), 'A_y', { color: 'var(--vec-y)', dy: 14, tamano: 14, fondo: true }),
      etiqueta(escena, v(0, 0, az / 2), 'A_z', { color: 'var(--vec-z)', dx: -18, tamano: 14, fondo: true }),
    ]);
    el.querySelector('.m').innerHTML = tex(`A = \\sqrt{A_x^2 + A_y^2 + A_z^2} = \\sqrt{${ax}^2 + ${ay}^2 + ${az}^2} = ${fmt(magnitud3(comp))}`);
  }

  for (const [eje, clase] of [['x', 'c-x'], ['y', 'c-y'], ['z', 'c-z']]) {
    const d = deslizador({ etiqueta: `<span class="${clase}">${tex(`A_${eje}`)}</span>`, min: 0, max: 8, paso: 1, valor: comp[eje], alCambiar: (v) => ((comp[eje] = v), dibujar()) });
    el.querySelector('.int-barra').append(d.el);
  }
  escena.alRedibujar(dibujar);
  dibujar();
}
