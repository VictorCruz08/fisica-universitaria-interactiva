// Interactivo 1.10f: el ciclo î → ĵ → k̂ para los productos cruz de unitarios.
import { html } from '@/lib/dom';
import { tex } from '@/lib/katex';

const ORDEN = ['i', 'j', 'k'];
const NOMBRE = { i: '\\hat\\imath', j: '\\hat\\jmath', k: '\\hat k' };
// Posiciones en el círculo (sentido horario: î → ĵ → k̂ → î)
const R = 78;
const C = { x: 120, y: 112 };
const ANG = { i: -90, j: 30, k: 150 };
const enCirculo = (g) => ({ x: C.x + R * Math.cos((g * Math.PI) / 180), y: C.y + R * Math.sin((g * Math.PI) / 180) });
const pos = (u) => enCirculo(ANG[u]);

const flechasCiclo = ORDEN.map((u, n) => {
  const a = ANG[u] + 22;
  const b = ANG[ORDEN[(n + 1) % 3]] - 22;
  const s = enCirculo(a);
  const e = enCirculo(b);
  const atras = enCirculo(b - 6);
  const L = Math.hypot(e.x - atras.x, e.y - atras.y);
  const ux = (e.x - atras.x) / L;
  const uy = (e.y - atras.y) / L;
  const k = 8;
  return `<path d="M${s.x},${s.y} A${R},${R} 0 0 1 ${e.x},${e.y}" class="ciclo"/><path d="M${e.x},${e.y} L${e.x - ux * k - uy * k * 0.5},${e.y - uy * k + ux * k * 0.5} L${e.x - ux * k + uy * k * 0.5},${e.y - uy * k - ux * k * 0.5} Z" class="cabeza"/>`;
}).join('');

export default function montar(raiz) {
  const el = html(`<div class="int i-ciclo">
    <div class="dos">
      <svg viewBox="0 0 240 230" role="img" aria-label="Ciclo i, j, k para productos cruz de vectores unitarios">
        ${flechasCiclo}
        <g class="trazo"></g>
        ${ORDEN.map((u) => {
          const p = pos(u);
          return `<g class="nodo" data-u="${u}" role="button" tabindex="0" aria-label="Elegir ${u}"><circle cx="${p.x}" cy="${p.y}" r="24"/><foreignObject x="${p.x - 24}" y="${p.y - 24}" width="48" height="48"><div xmlns="http://www.w3.org/1999/xhtml" class="et-nodo">${tex(NOMBRE[u])}</div></foreignObject></g>`;
        }).join('')}
      </svg>
      <div class="lado">
        <p class="instr">Toca dos vectores unitarios, en orden.</p>
        <p class="ecu" aria-live="polite"></p>
        <p class="expl"></p>
      </div>
    </div>
  </div>`);
  raiz.append(el);

  let primero = 'i';
  let segundo = 'j';

  const resultado = () => {
    if (!primero || !segundo) return null;
    if (primero === segundo) return { tex: '\\mathbf{0}', signo: 0, tercero: null };
    const tercero = ORDEN.find((u) => u !== primero && u !== segundo);
    const aFavor = (ORDEN.indexOf(primero) + 1) % 3 === ORDEN.indexOf(segundo);
    return { tex: `${aFavor ? '' : '-'}${NOMBRE[tercero]}`, signo: aFavor ? 1 : -1, tercero };
  };

  function dibujar() {
    const r = resultado();
    el.querySelectorAll('.nodo').forEach((n) => {
      const u = n.dataset.u;
      n.classList.toggle('p1', primero === u);
      n.classList.toggle('p2', segundo === u);
      n.classList.toggle('res', r?.tercero === u);
    });
    let trazo = '';
    if (r && r.signo !== 0) {
      const a = pos(primero);
      const b = pos(segundo);
      trazo = `<path d="M${a.x},${a.y} A${R},${R} 0 0 ${r.signo === 1 ? 1 : 0} ${b.x},${b.y}" class="recorrido ${r.signo === -1 ? 'contra' : ''}" pathLength="1"/>`;
    }
    el.querySelector('.trazo').innerHTML = trazo; // nuevo nodo: la animación del trazo se repite
    el.querySelector('.ecu').innerHTML = r
      ? tex(`${NOMBRE[primero]} \\times ${NOMBRE[segundo]} = ${r.tex}`, true)
      : primero
        ? tex(`${NOMBRE[primero]} \\times \\;?`, true)
        : '';
    el.querySelector('.expl').innerHTML =
      r?.signo === 1
        ? 'A favor de las flechas del ciclo: el resultado es el tercer vector, con signo <strong>+</strong>.'
        : r?.signo === -1
          ? 'En contra de las flechas: el resultado es el tercer vector con signo <strong>−</strong>.'
          : r?.signo === 0
            ? 'Un vector cruzado consigo mismo da el vector cero (son paralelos).'
            : '';
  }

  const elegir = (u) => {
    if (!primero || segundo) {
      primero = u;
      segundo = null;
    } else segundo = u;
    dibujar();
  };
  el.querySelectorAll('.nodo').forEach((n) => {
    n.addEventListener('click', () => elegir(n.dataset.u));
    n.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), elegir(n.dataset.u)));
  });
  dibujar();
}
