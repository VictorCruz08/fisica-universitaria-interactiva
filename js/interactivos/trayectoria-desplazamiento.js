// Interactivo 1.7b: distancia recorrida por las calles vs. desplazamiento.
import { Plano, flecha, etiqueta, poligono, punto } from '../nucleo/lienzo.js';
import { html } from '../lib/dom.js';
import { tex } from '../lib/katex.js';
import { animar, lineal } from '../lib/movimiento.js';
import { fmt, magnitud } from '../lib/vec.js';

// Una cuadra = 100 m. Ruta por las calles desde casa hasta la panadería.
const IDA = [
  { x: 0, y: 0 },
  { x: 2, y: 0 },
  { x: 2, y: 1 },
  { x: 3, y: 1 },
  { x: 3, y: 3 },
  { x: 4, y: 3 },
];
const RUTA = [...IDA, ...IDA.slice(0, -1).reverse()];
const TRAMOS = RUTA.slice(1).map((p, i) => magnitud({ x: p.x - RUTA[i].x, y: p.y - RUTA[i].y }));
const LARGO_IDA = TRAMOS.slice(0, IDA.length - 1).reduce((a, b) => a + b, 0);
const LARGO_TOTAL = TRAMOS.reduce((a, b) => a + b, 0);

const posicion = (dist) => {
  let resto = dist;
  for (let i = 0; i < TRAMOS.length; i++) {
    if (resto <= TRAMOS[i] || i === TRAMOS.length - 1) {
      const t = Math.min(1, resto / TRAMOS[i]);
      return { x: RUTA[i].x + (RUTA[i + 1].x - RUTA[i].x) * t, y: RUTA[i].y + (RUTA[i + 1].y - RUTA[i].y) * t };
    }
    resto -= TRAMOS[i];
  }
  return RUTA.at(-1);
};

const recorrido = (s) => {
  const pts = [RUTA[0]];
  let acum = 0;
  for (let i = 0; i < TRAMOS.length && acum + TRAMOS[i] <= s + 1e-9; i++) {
    acum += TRAMOS[i];
    pts.push(RUTA[i + 1]);
  }
  pts.push(posicion(s));
  return pts;
};

const MANZANAS = [];
for (let i = -1; i < 5; i++)
  for (let j = -1; j < 4; j++) {
    const m = 0.12;
    MANZANAS.push([
      { x: i + m, y: j + m },
      { x: i + 1 - m, y: j + m },
      { x: i + 1 - m, y: j + 1 - m },
      { x: i + m, y: j + 1 - m },
    ]);
  }

export default function montar(raiz) {
  const el = html(`<div class="int">
    <div class="int-lienzo"></div>
    <div class="int-lectura"><span class="c-ocre d1"></span><span class="c-a d2"></span></div>
    <div class="int-barra">
      <button type="button" class="boton primario ir">Caminar a la panadería</button>
      <button type="button" class="boton volver">Regresar a casa</button>
      <button type="button" class="boton empuje reiniciar">Reiniciar</button>
    </div>
  </div>`);
  raiz.append(el);

  const plano = new Plano(el.querySelector('.int-lienzo'), {
    x: [-0.7, 4.9],
    y: [-0.7, 3.7],
    rejilla: false,
    ejes: false,
    altoMax: 380,
    titulo: 'Mapa de un barrio: ruta por las calles de casa a la panadería',
  });

  let s = 0;
  let cancelar = () => {};
  const [btnIr, btnVolver] = [el.querySelector('.ir'), el.querySelector('.volver')];

  function dibujar() {
    const p = posicion(s);
    const desp = magnitud(p);
    plano.pintarFondo(MANZANAS.map((m) => poligono(plano, m, { relleno: 'var(--fondo-hundido)' })));
    plano.pintar([
      poligono(plano, IDA, { cerrado: false, borde: 'var(--linea-fuerte)', grosor: 5 }),
      poligono(plano, recorrido(s), { cerrado: false, borde: 'var(--ocre)', grosor: 5 }),
      flecha(plano, { x: 0, y: 0 }, p, { color: 'var(--vec-a)', grosor: 3 }),
      etiqueta(plano, { x: 0, y: 0 }, '\\text{casa}', { dy: 20, dx: -6, tamano: 14, color: 'var(--tinta-2)' }),
      etiqueta(plano, { x: 4, y: 3 }, '\\text{panadería}', { dy: -20, tamano: 14, color: 'var(--tinta-2)' }),
      desp > 0.6 && etiqueta(plano, { x: p.x / 2, y: p.y / 2 }, '\\vec{d}', { color: 'var(--vec-a)', dx: -16, dy: -12, fondo: true }),
      punto(plano, { x: 0, y: 0 }, { color: 'var(--tinta-2)' }),
      punto(plano, { x: 4, y: 3 }, { color: 'var(--tinta-2)' }),
      punto(plano, p, { radio: 7, color: 'var(--ocre)' }),
    ]);
    el.querySelector('.d1').innerHTML = tex(`\\text{distancia recorrida} = ${fmt(s * 100, 0)}\\ \\text{m}`);
    el.querySelector('.d2').innerHTML = tex(`|\\vec d\\,| = ${fmt(desp * 100, 0)}\\ \\text{m}`);
    btnIr.disabled = Math.abs(s - LARGO_IDA) < 1e-6;
    btnVolver.disabled = s < LARGO_IDA - 1e-6 || s >= LARGO_TOTAL - 1e-6;
  }

  const ir = (hasta) => {
    cancelar();
    const inicio = s;
    cancelar = animar(Math.abs(hasta - inicio) * 520, (t) => {
      s = inicio + (hasta - inicio) * t;
      dibujar();
    }, lineal);
  };

  btnIr.addEventListener('click', () => ir(LARGO_IDA));
  btnVolver.addEventListener('click', () => ir(LARGO_TOTAL));
  el.querySelector('.reiniciar').addEventListener('click', () => {
    cancelar();
    s = 0;
    dibujar();
  });
  plano.alRedibujar(dibujar);
  dibujar();
}
