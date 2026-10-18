// Interactivo 1.7g: multiplicar un vector por un escalar c.
import { Plano, flecha, etiqueta } from './nucleo/lienzo';
import { html, deslizador } from '@/lib/dom';
import { tex } from '@/lib/katex';
import { escala, fmt, magnitud, num } from '@/lib/vec';

const A = { x: 1.6, y: 0.9 };
const O = { x: 0, y: 0 };

export default function montar(raiz) {
  const el = html(`<div class="int">
    <div class="int-lienzo"></div>
    <div class="int-lectura"><span class="m"></span><span class="rel tenue"></span></div>
    <div class="int-barra"></div>
  </div>`);
  raiz.append(el);
  const plano = new Plano(el.querySelector('.int-lienzo'), { x: [-5.5, 5.5], y: [-3, 3], rejilla: 0.5, altoMax: 320, titulo: 'Un vector multiplicado por un escalar c' });

  let c = 2;
  function dibujar() {
    const cA = escala(c, A);
    const cTex = num(c);
    plano.pintar([
      c !== 0 && flecha(plano, O, cA, { color: 'var(--vec-r)', grosor: 3.2 }),
      flecha(plano, O, A, { color: 'var(--vec-a)', grosor: 2.4 }),
      etiqueta(plano, A, '\\vec{A}', { color: 'var(--vec-a)', dx: c > 0 && c < 1.3 ? 26 : 0, dy: c > 1 ? 20 : -18, fondo: true }),
      c !== 0 && c !== 1 && etiqueta(plano, cA, `${cTex}\\vec{A}`, { color: 'var(--vec-r)', dx: c > 0 ? 22 : -22, dy: -16, fondo: true }),
    ]);
    const relacion = c > 0 ? 'paralelo a' : c < 0 ? 'antiparalelo a' : 'el vector cero (sin dirección definida)';
    el.querySelector('.m').innerHTML = tex(`|${cTex}\\vec A\\,| = |${cTex}|\\,A = ${fmt(magnitud(cA))}`);
    el.querySelector('.rel').innerHTML = tex(`${cTex}\\vec A \\text{ es ${relacion} } \\vec A`);
  }

  const d = deslizador({ etiqueta: tex('c'), min: -3, max: 3, paso: 0.5, valor: c, formato: num, alCambiar: (v) => ((c = v), dibujar()) });
  el.querySelector('.int-barra').append(d.el);
  plano.alRedibujar(dibujar);
  dibujar();
}
