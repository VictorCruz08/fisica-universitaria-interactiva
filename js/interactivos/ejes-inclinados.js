// Interactivo 1.8b: las componentes dependen de los ejes; el vector no.
import { Plano, flecha, etiqueta, poligono, arco } from '../nucleo/lienzo.js';
import { html, deslizador } from '../lib/dom.js';
import { tex } from '../lib/katex.js';
import { RAD, escala, fmt, rotar, suma } from '../lib/vec.js';

const W = 2.6;
const PIE = { x: -3.2, y: -1.6 };
const LARGO = 6.4;
const LADO = 0.9;

export default function montar(raiz) {
  const el = html(`<div class="int">
    <div class="int-lienzo"></div>
    <div class="int-lectura"><span class="wx c-x"></span><span class="wy c-y"></span><span class="tenue">${tex('\\sqrt{w_{x\'}^2 + w_{y\'}^2} = w \\;\\text{(siempre)}')}</span></div>
    <div class="int-barra"></div>
  </div>`);
  raiz.append(el);
  const plano = new Plano(el.querySelector('.int-lienzo'), { x: [-3.8, 3.8], y: [-2.2, 3.4], rejilla: false, ejes: false, altoMax: 380, titulo: 'Caja en una rampa con ejes inclinados' });

  let alfa = 25;
  function dibujar() {
    const u = rotar({ x: 1, y: 0 }, alfa); // a lo largo de la rampa (x')
    const n = rotar({ x: 0, y: 1 }, alfa); // perpendicular (y')
    const cima = suma(PIE, escala(LARGO, u));
    const esquina = { x: cima.x, y: PIE.y };
    const c = suma(PIE, escala(LARGO * 0.55, u));
    const caja = [c, suma(c, escala(LADO, u)), suma(suma(c, escala(LADO, u)), escala(LADO, n)), suma(c, escala(LADO, n))];
    const centro = suma(suma(c, escala(LADO / 2, u)), escala(LADO / 2, n));
    const peso = { x: 0, y: -W };
    const Wx = -W * Math.sin(alfa * RAD);
    const Wy = -W * Math.cos(alfa * RAD);
    plano.pintar([
      poligono(plano, [PIE, cima, esquina], { relleno: 'var(--fondo-hundido)', borde: 'var(--linea-fuerte)' }),
      arco(plano, PIE, 0, alfa, { radio: 46, color: 'var(--tinta-3)' }),
      etiqueta(plano, PIE, '\\alpha', { color: 'var(--tinta-2)', dx: 60 * Math.cos((alfa / 2) * RAD), dy: -60 * Math.sin((alfa / 2) * RAD), tamano: 14 }),
      poligono(plano, caja, { relleno: 'color-mix(in srgb, var(--arena) 55%, var(--fondo-elevado))', borde: 'var(--ocre)' }),
      flecha(plano, suma(centro, escala(-1.6, u)), suma(centro, escala(2.2, u)), { color: 'var(--tinta-3)', grosor: 1.2, punta: 9 }),
      flecha(plano, suma(centro, escala(-1.4, n)), suma(centro, escala(2.0, n)), { color: 'var(--tinta-3)', grosor: 1.2, punta: 9 }),
      etiqueta(plano, suma(centro, escala(2.2, u)), "x'", { color: 'var(--tinta-2)', dx: 10, dy: -12, tamano: 15 }),
      etiqueta(plano, suma(centro, escala(2.0, n)), "y'", { color: 'var(--tinta-2)', dx: 14, tamano: 15 }),
      poligono(plano, [suma(centro, escala(Wx, u)), suma(centro, peso), suma(centro, escala(Wy, n))], { cerrado: false, borde: 'var(--tinta-3)', grosor: 1, discontinuo: true }),
      flecha(plano, centro, suma(centro, escala(Wx, u)), { color: 'var(--vec-x)', grosor: 2.2, opacidad: 0.7 }),
      flecha(plano, centro, suma(centro, escala(Wy, n)), { color: 'var(--vec-y)', grosor: 2.2, opacidad: 0.7 }),
      flecha(plano, centro, suma(centro, peso), { color: 'var(--vec-d)', grosor: 3 }),
      etiqueta(plano, suma(centro, peso), '\\vec{w}', { color: 'var(--vec-d)', dx: 16, dy: 6 }),
    ]);
    el.querySelector('.wx').innerHTML = tex(`w_{x'} = -w\\sin\\alpha = ${fmt(Wx / W)}\\,w`);
    el.querySelector('.wy').innerHTML = tex(`w_{y'} = -w\\cos\\alpha = ${fmt(Wy / W)}\\,w`);
  }

  const d = deslizador({ etiqueta: `Inclinación ${tex('\\alpha')}`, min: 0, max: 50, paso: 1, valor: alfa, formato: (v) => `${v}°`, alCambiar: (v) => ((alfa = v), dibujar()) });
  el.querySelector('.int-barra').append(d.el);
  plano.alRedibujar(dibujar);
  dibujar();
}
