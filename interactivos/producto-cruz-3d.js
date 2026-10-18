// Interactivo 1.10d: el producto vectorial, perpendicular al plano de A y B.
import { Escena3D, flecha, etiqueta, poligono } from './nucleo/lienzo';
import { html, deslizador, segmentado } from '@/lib/dom';
import { tex } from '@/lib/katex';
import { Tween } from '@/lib/movimiento';
import { RAD, fmt } from '@/lib/vec';

const K_C = 0.3; // A × B se dibuja a escala reducida para que quepa

export default function montar(raiz) {
  const el = html(`<div class="int">
    <div class="int-lienzo"></div>
    <div class="int-lectura"><span class="m"></span><span class="tenue">${tex('= \\text{área del paralelogramo}')}</span></div>
    <p class="int-texto regla"></p>
    <div class="int-barra"></div>
  </div>`);
  raiz.append(el);
  const escena = new Escena3D(el.querySelector('.int-lienzo'), { titulo: 'Producto vectorial: vector perpendicular al plano de A y B', tamano: 3.1, alto: 400, elevacion: 30, azimut: -38 });

  const e = { a: 3, b: 2.5, phi: 60, invertido: false };
  const signo = new Tween(1, { alCambiar: () => dibujar() });

  function dibujar() {
    const A = { x: e.a, y: 0, z: 0 };
    const B = { x: e.b * Math.cos(e.phi * RAD), y: e.b * Math.sin(e.phi * RAD), z: 0 };
    const magC = e.a * e.b * Math.sin(e.phi * RAD);
    const C = { x: 0, y: 0, z: signo.actual * magC * K_C };
    // Flecha curva del primer factor hacia el segundo (dedos de la mano derecha)
    const [desde, hasta] = e.invertido ? [e.phi, 0] : [0, e.phi];
    const giro = Array.from({ length: 25 }, (_, i) => {
      const t = (desde + ((hasta - desde) * i) / 24) * RAD;
      return { x: 1.1 * Math.cos(t), y: 1.1 * Math.sin(t), z: 0 };
    });
    const O = { x: 0, y: 0, z: 0 };
    escena.pintar([
      poligono(escena, [O, A, { x: A.x + B.x, y: A.y + B.y, z: 0 }, B], { relleno: 'var(--vec-r)', borde: 'var(--vec-r)', grosor: 1, opacidad: 0.16 }),
      poligono(escena, giro, { cerrado: false, borde: 'var(--ocre)', grosor: 2 }),
      e.phi > 12 && flecha(escena, giro.at(-3), giro.at(-1), { color: 'var(--ocre)', grosor: 2, punta: 10 }),
      flecha(escena, O, A, { color: 'var(--vec-a)', grosor: 3 }),
      flecha(escena, O, B, { color: 'var(--vec-b)', grosor: 3 }),
      flecha(escena, O, C, { color: 'var(--vec-r)', grosor: 3.4 }),
      etiqueta(escena, A, '\\vec{A}', { color: 'var(--vec-a)', dx: 10, dy: 16 }),
      etiqueta(escena, B, '\\vec{B}', { color: 'var(--vec-b)', dx: 16, dy: -8 }),
      Math.abs(C.z) > 0.3 && etiqueta(escena, C, e.invertido ? '\\vec{B}\\times\\vec{A}' : '\\vec{A}\\times\\vec{B}', { color: 'var(--vec-r)', dx: 44, dy: C.z > 0 ? -6 : 6, fondo: true }),
    ]);
    const [p, s] = e.invertido ? ['B', 'A'] : ['A', 'B'];
    el.querySelector('.m').innerHTML = tex(`|\\vec ${p}\\times\\vec ${s}| = AB\\sin\\phi = ${fmt(magC)}`);
    el.querySelector('.regla').innerHTML = `Curva los dedos de la mano derecha desde ${tex(`\\vec ${p}`)} hacia ${tex(`\\vec ${s}`)} (flecha ocre): el pulgar apunta ${e.invertido ? 'hacia abajo' : 'hacia arriba'}, en la dirección de ${tex(`\\vec ${p}\\times\\vec ${s}`)}.`;
  }

  const barra = el.querySelector('.int-barra');
  barra.append(
    deslizador({ etiqueta: tex('\\phi'), min: 0, max: 180, paso: 5, valor: e.phi, formato: (v) => `${v}°`, alCambiar: (v) => ((e.phi = v), dibujar()) }).el,
    deslizador({ etiqueta: tex('A'), min: 1, max: 3.5, paso: 0.5, valor: e.a, alCambiar: (v) => ((e.a = v), dibujar()) }).el,
    deslizador({ etiqueta: tex('B'), min: 1, max: 3.5, paso: 0.5, valor: e.b, alCambiar: (v) => ((e.b = v), dibujar()) }).el,
    segmentado({
      opciones: [
        { id: 'AB', texto: 'A × B' },
        { id: 'BA', texto: 'B × A' },
      ],
      actual: 'AB',
      etiqueta: 'Orden de los factores',
      alCambiar: (id) => {
        e.invertido = id === 'BA';
        signo.ir(e.invertido ? -1 : 1, { duracion: 800 });
        dibujar();
      },
    }).el,
  );
  escena.alRedibujar(dibujar);
  dibujar();
}
