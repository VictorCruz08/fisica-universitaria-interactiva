// Interactivo 1.10e: AB cos φ (producto escalar) frente a AB sen φ (producto vectorial).
import { Plano, flecha, arco } from './nucleo/lienzo';
import { html, deslizador } from '@/lib/dom';
import { tex } from '@/lib/katex';
import { RAD, fmt } from '@/lib/vec';

// Gráfica propia (escala no uniforme): φ ∈ [0, 180], valor ∈ [−1, 1]
const W = 420;
const H = 220;
const M = { izq: 34, der: 12, arr: 14, aba: 28 };
const X = (g) => M.izq + (g / 180) * (W - M.izq - M.der);
const Y = (v) => M.arr + ((1 - v) / 2) * (H - M.arr - M.aba);
const curva = (f) => Array.from({ length: 91 }, (_, i) => `${i ? 'L' : 'M'}${X(i * 2).toFixed(1)},${Y(f(i * 2 * RAD)).toFixed(1)}`).join(' ');

export default function montar(raiz) {
  const el = html(`<div class="int i-senocos">
    <div class="dos">
      <div class="grafica">
        <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráficas de coseno y seno de phi entre 0 y 180 grados">
          <line x1="${M.izq}" x2="${W - M.der}" y1="${Y(0)}" y2="${Y(0)}" class="eje-g"/>
          <line x1="${M.izq}" x2="${M.izq}" y1="${Y(1)}" y2="${Y(-1)}" class="eje-g"/>
          ${[1, -1].map((v) => `<line x1="${M.izq}" x2="${W - M.der}" y1="${Y(v)}" y2="${Y(v)}" class="guia"/><text x="${M.izq - 6}" y="${Y(v) + 4}" text-anchor="end" class="marca-g">${v > 0 ? '+AB' : '−AB'}</text>`).join('')}
          ${[0, 90, 180].map((g) => `<text x="${X(g)}" y="${H - 8}" text-anchor="middle" class="marca-g">${g}°</text>`).join('')}
          <path d="${curva(Math.cos)}" class="cos"/>
          <path d="${curva(Math.sin)}" class="sen"/>
          <line class="cursor" y1="${Y(1)}" y2="${Y(-1)}"/>
          <circle r="5.5" class="p-cos"/>
          <circle r="5.5" class="p-sen"/>
        </svg>
        <div class="leyenda"><span class="lc"></span><span class="ls"></span></div>
      </div>
      <div class="mini"><div class="mini-plano"></div><p class="nota"></p></div>
    </div>
    <div class="int-barra"></div>
  </div>`);
  raiz.append(el);
  const plano = new Plano(el.querySelector('.mini-plano'), { x: [-1.4, 1.6], y: [-0.4, 1.4], rejilla: false, ejes: false, altoMax: 180, titulo: 'Los dos vectores con el ángulo phi' });
  const svg = el.querySelector('svg');
  let phi = 30;

  function dibujar() {
    const c = Math.cos(phi * RAD);
    const s = Math.sin(phi * RAD);
    const cursor = svg.querySelector('.cursor');
    cursor.setAttribute('x1', X(phi));
    cursor.setAttribute('x2', X(phi));
    svg.querySelector('.p-cos').setAttribute('cx', X(phi));
    svg.querySelector('.p-cos').setAttribute('cy', Y(c));
    svg.querySelector('.p-sen').setAttribute('cx', X(phi));
    svg.querySelector('.p-sen').setAttribute('cy', Y(s));
    el.querySelector('.lc').innerHTML = tex(`\\vec A\\cdot\\vec B = AB\\cos\\phi = ${fmt(c)}\\,AB`);
    el.querySelector('.ls').innerHTML = tex(`|\\vec A\\times\\vec B| = AB\\sin\\phi = ${fmt(s)}\\,AB`);
    plano.pintar([
      arco(plano, { x: 0, y: 0 }, 0, phi, { radio: 26, relleno: true }),
      flecha(plano, { x: 0, y: 0 }, { x: 1.3, y: 0 }, { color: 'var(--vec-a)' }),
      flecha(plano, { x: 0, y: 0 }, { x: 1.1 * c, y: 1.1 * s }, { color: 'var(--vec-b)' }),
    ]);
    el.querySelector('.nota').innerHTML =
      phi === 0 || phi === 180
        ? 'Paralelos o antiparalelos: el producto cruz se anula y el punto es máximo en valor absoluto.'
        : phi === 90
          ? 'Perpendiculares: el producto punto se anula y el cruz es máximo.'
          : `Arrastra sobre la gráfica para cambiar ${tex('\\phi')}.`;
  }

  const d = deslizador({ etiqueta: tex('\\phi'), min: 0, max: 180, paso: 1, valor: phi, formato: (v) => `${v}°`, alCambiar: (v) => ((phi = v), dibujar()) });
  el.querySelector('.int-barra').append(d.el);
  const entrada = d.el.querySelector('input');

  let arrastrando = false;
  const aAngulo = (ev) => {
    const r = svg.getBoundingClientRect();
    const x = ((ev.clientX - r.left) / r.width) * W;
    phi = Math.round(Math.max(0, Math.min(180, ((x - M.izq) / (W - M.izq - M.der)) * 180)));
    entrada.value = phi;
    d.el.querySelector('output').textContent = `${phi}°`;
    dibujar();
  };
  svg.addEventListener('pointerdown', (ev) => {
    arrastrando = true;
    svg.setPointerCapture(ev.pointerId);
    aAngulo(ev);
  });
  svg.addEventListener('pointermove', (ev) => arrastrando && aAngulo(ev));
  svg.addEventListener('pointerup', () => (arrastrando = false));
  plano.alRedibujar(dibujar);
  dibujar();
}
