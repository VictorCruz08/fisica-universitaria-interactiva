// Interactivo 1.8d: sumar dos vectores apilando sus componentes sobre los ejes.
import { Plano, flecha, etiqueta } from './nucleo/lienzo';
import { html } from '@/lib/dom';
import { tex } from '@/lib/katex';
import { Tween } from '@/lib/movimiento';
import { angulo, fmt, magnitud, resta, suma } from '@/lib/vec';

const O = { x: 0, y: 0 };
const mezcla = (p, q, t) => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t });
const limitar = (p) => ({ x: Math.max(-4.5, Math.min(5.5, p.x)), y: Math.max(-2.5, Math.min(4.5, p.y)) });

export default function montar(raiz) {
  const el = html(`<div class="int i-sumacomp">
    <div class="int-lienzo"></div>
    <div class="int-tabla">
      <table>
        <thead><tr><th></th><th>Componente x</th><th>Componente y</th></tr></thead>
        <tbody>
          <tr><td class="c-a">${tex('\\vec A')}</td><td class="ax"></td><td class="ay"></td></tr>
          <tr><td class="c-b">${tex('\\vec B')}</td><td class="bx"></td><td class="by"></td></tr>
          <tr class="fila-r"><td class="c-r">${tex('\\vec R')}</td><td class="rx c-r"></td><td class="ry c-r"></td></tr>
        </tbody>
      </table>
      <p class="final" hidden></p>
    </div>
    <div class="int-barra">
      <button type="button" class="boton primario reproducir">Sumar por componentes</button>
      <button type="button" class="boton editar" hidden>Editar vectores</button>
      <span class="empuje int-nota nota-editar">Primero acomoda A y B a tu gusto</span>
    </div>
  </div>`);
  raiz.append(el);
  const plano = new Plano(el.querySelector('.int-lienzo'), { x: [-5, 6], y: [-3, 5], rejilla: 0.5, marcas: 1, altoMax: 420, titulo: 'Suma de dos vectores por componentes' });

  let A = { x: 3, y: 1 };
  let B = { x: -1, y: 2 };
  // 0: vectores · 1: componentes en escalera · 2: componentes sobre los ejes · 3: resultante
  let fase = 0;
  const redibujar = () => dibujar();
  const aparece = new Tween(0, { alCambiar: redibujar });
  const desliza = new Tween(0, { alCambiar: redibujar });
  const resultante = new Tween(0, { alCambiar: redibujar });

  function dibujar() {
    const C = suma(A, B);
    const a = aparece.actual;
    const t = desliza.actual;
    const r = resultante.actual;
    // Colas de cada componente: en escalera (t = 0) o apiladas sobre los ejes (t = 1)
    const colaAy = mezcla({ x: A.x, y: 0 }, O, t);
    const colaBx = mezcla(A, { x: A.x, y: 0 }, t);
    const colaBy = mezcla({ x: C.x, y: A.y }, { x: 0, y: A.y }, t);
    const comp = { grosor: 4, punta: 10, opacidad: a };
    plano.pintar([
      r > 0.01 && flecha(plano, { x: C.x, y: 0 }, C, { color: 'var(--tinta-3)', grosor: 1, discontinua: true, opacidad: r, punta: 0 }),
      r > 0.01 && flecha(plano, { x: 0, y: C.y }, C, { color: 'var(--tinta-3)', grosor: 1, discontinua: true, opacidad: r, punta: 0 }),
      r > 0.01 && flecha(plano, O, C, { color: 'var(--vec-r)', grosor: 3.2, opacidad: r }),
      r > 0.01 && etiqueta(plano, C, '\\vec{R}', { color: 'var(--vec-r)', dx: C.x >= 0 ? 18 : -18, dy: -14, opacidad: r }),
      flecha(plano, O, A, { color: 'var(--vec-a)', opacidad: 1 - 0.7 * a }),
      flecha(plano, A, C, { color: 'var(--vec-b)', opacidad: 1 - 0.7 * a }),
      etiqueta(plano, { x: A.x / 2, y: A.y / 2 }, '\\vec{A}', { color: 'var(--vec-a)', dx: -10, dy: -16, opacidad: 1 - 0.7 * a }),
      etiqueta(plano, suma(A, { x: B.x / 2, y: B.y / 2 }), '\\vec{B}', { color: 'var(--vec-b)', dx: 16, dy: -6, opacidad: 1 - 0.7 * a }),
      a > 0.01 && flecha(plano, O, { x: A.x, y: 0 }, { color: 'var(--vec-a)', ...comp }),
      a > 0.01 && flecha(plano, colaAy, suma(colaAy, { x: 0, y: A.y }), { color: 'var(--vec-a)', ...comp }),
      a > 0.01 && flecha(plano, colaBx, suma(colaBx, { x: B.x, y: 0 }), { color: 'var(--vec-b)', ...comp }),
      a > 0.01 && flecha(plano, colaBy, suma(colaBy, { x: 0, y: B.y }), { color: 'var(--vec-b)', ...comp }),
    ]);
    const celda = (sel, v) => (el.querySelector(sel).textContent = fmt(v, 1));
    celda('.ax', A.x);
    celda('.ay', A.y);
    celda('.bx', B.x);
    celda('.by', B.y);
    el.querySelector('.rx').innerHTML = tex(`R_x = ${fmt(C.x, 1)}`);
    el.querySelector('.ry').innerHTML = tex(`R_y = ${fmt(C.y, 1)}`);
    el.querySelector('.fila-r').classList.toggle('visible', fase >= 2);
    const final = el.querySelector('.final');
    final.hidden = fase !== 3;
    if (fase === 3) final.innerHTML = tex(`R = \\sqrt{R_x^2 + R_y^2} = ${fmt(magnitud(C))}, \\quad \\theta = ${fmt(angulo(C), 1)}^\\circ`);
    const btn = el.querySelector('.reproducir');
    btn.disabled = fase === 1 || fase === 2;
    btn.textContent = fase === 3 ? 'Repetir' : 'Sumar por componentes';
    el.querySelector('.editar').hidden = fase !== 3;
    el.querySelector('.nota-editar').hidden = fase !== 0;
    manijas.forEach((m) => m.ocultar(fase !== 0));
  }

  const manijas = [
    plano.manija({ pos: () => A, color: 'var(--vec-a)', restringir: limitar, nombre: 'punta de A', alMover: (p) => ((A = p), dibujar(), manijas[1].colocar()) }),
    plano.manija({ pos: () => suma(A, B), color: 'var(--vec-b)', restringir: limitar, nombre: 'punta de B', alMover: (p) => ((B = resta(p, A)), dibujar()) }),
  ];

  async function reiniciar(rapido = false) {
    fase = 0;
    if (rapido) [aparece, desliza, resultante].forEach((tw) => tw.fijar(0));
    else await Promise.all([aparece, desliza, resultante].map((tw) => tw.ir(0, { duracion: 400 })));
    dibujar();
  }

  el.querySelector('.reproducir').addEventListener('click', async () => {
    if (fase === 3) await reiniciar(true);
    fase = 1;
    dibujar();
    await aparece.ir(1, { duracion: 700 });
    fase = 2;
    dibujar();
    await desliza.ir(1, { duracion: 1100, retraso: 250 });
    fase = 3;
    dibujar();
    await resultante.ir(1, { duracion: 700 });
  });
  el.querySelector('.editar').addEventListener('click', () => reiniciar());
  plano.alRedibujar(dibujar);
  dibujar();
}
