// Interactivo 1.9a: construir A = Ax î + Ay ĵ estirando los vectores unitarios.
import { Plano, flecha, etiqueta } from '../nucleo/lienzo.js';
import { html, deslizador } from '../lib/dom.js';
import { tex } from '../lib/katex.js';
import { Tween } from '../lib/movimiento.js';
import { num } from '../lib/vec.js';

export default function montar(raiz) {
  const el = html(`<div class="int">
    <div class="int-lienzo"></div>
    <div class="int-lectura"><span class="expr" style="font-size:1.12rem"></span></div>
    <div class="int-barra"><button type="button" class="boton primario construir">Construir</button></div>
  </div>`);
  raiz.append(el);
  const plano = new Plano(el.querySelector('.int-lienzo'), {
    x: [-4.6, 4.6],
    y: [-3.4, 3.4],
    rejilla: 0.5,
    marcas: 1,
    altoMax: 380,
    titulo: 'Construcción de un vector a partir de los vectores unitarios i y j',
  });

  let ax = 3;
  let ay = 2;
  let construido = false;
  let animando = false;
  const redibujar = () => dibujar();
  const sx = new Tween(1, { alCambiar: redibujar });
  const sy = new Tween(1, { alCambiar: redibujar });
  const vA = new Tween(0, { alCambiar: redibujar });
  const btn = el.querySelector('.construir');

  function dibujar() {
    const vis = animando || construido ? 0.8 : 0;
    const X = sx.actual;
    const Y = sy.actual;
    plano.pintar([
      flecha(plano, { x: 0, y: 0 }, { x: X, y: 0 }, { color: 'var(--vec-x)', grosor: 3, opacidad: vis }),
      flecha(plano, { x: X, y: 0 }, { x: X, y: Y }, { color: 'var(--vec-y)', grosor: 3, opacidad: vis }),
      flecha(plano, { x: 0, y: 0 }, { x: ax, y: ay }, { color: 'var(--vec-a)', grosor: 3.2, opacidad: vA.actual }),
      etiqueta(plano, { x: ax, y: ay }, '\\vec{A}', { color: 'var(--vec-a)', dx: ax >= 0 ? 18 : -18, dy: ay >= 0 ? -14 : 14, opacidad: vA.actual }),
      vis && Math.abs(X) > 1.2 && etiqueta(plano, { x: X / 2, y: 0 }, `${num(Math.round(X * 2) / 2)}\\,\\hat\\imath`, { color: 'var(--vec-x)', dy: ay >= 0 ? 16 : -16, tamano: 15, fondo: true }),
      vis && Math.abs(Y) > 1.2 && etiqueta(plano, { x: X, y: Y / 2 }, `${num(Math.round(Y * 2) / 2)}\\,\\hat\\jmath`, { color: 'var(--vec-y)', dx: ax >= 0 ? 26 : -26, tamano: 15, fondo: true }),
      // Los unitarios: magnitud 1, sólo dirección
      flecha(plano, { x: 0, y: 0 }, { x: 1, y: 0 }, { color: 'var(--tinta)', grosor: 3.4, punta: 11 }),
      flecha(plano, { x: 0, y: 0 }, { x: 0, y: 1 }, { color: 'var(--tinta)', grosor: 3.4, punta: 11 }),
      etiqueta(plano, { x: 0.5, y: 0 }, '\\hat\\imath', { dy: -14 }),
      etiqueta(plano, { x: 0, y: 0.5 }, '\\hat\\jmath', { dx: -14 }),
    ]);
    const y = ay < 0 ? `- ${num(-ay)}` : `+ ${num(ay)}`;
    el.querySelector('.expr').innerHTML = tex(`\\vec A = ${num(ax)}\\,\\hat\\imath ${y}\\,\\hat\\jmath`);
    btn.disabled = animando;
    btn.textContent = construido ? 'Repetir' : 'Construir';
    deslizadores.forEach((d) => (d.deshabilitado = animando));
  }

  const alMoverDesl = () => {
    // Después de construir, todo sigue en vivo.
    if (construido) {
      sx.fijar(ax);
      sy.fijar(ay);
    }
    dibujar();
  };
  const deslizadores = [
    deslizador({ etiqueta: `<span class="c-x">${tex('A_x')}</span>`, min: -4, max: 4, paso: 0.5, valor: ax, formato: num, alCambiar: (v) => ((ax = v), alMoverDesl()) }),
    deslizador({ etiqueta: `<span class="c-y">${tex('A_y')}</span>`, min: -3, max: 3, paso: 0.5, valor: ay, formato: num, alCambiar: (v) => ((ay = v), alMoverDesl()) }),
  ];
  el.querySelector('.int-barra').prepend(...deslizadores.map((d) => d.el));

  btn.addEventListener('click', async () => {
    animando = true;
    construido = false;
    sx.fijar(1);
    sy.fijar(1);
    vA.fijar(0);
    await sx.ir(ax, { duracion: 900 });
    await sy.ir(ay, { duracion: 900, retraso: 150 });
    await vA.ir(1, { duracion: 600 });
    construido = true;
    animando = false;
    dibujar();
  });
  plano.alRedibujar(dibujar);
  dibujar();
}
