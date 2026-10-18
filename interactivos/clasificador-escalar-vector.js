// Interactivo 1.7a: clasificar cantidades en escalares o vectoriales.
import { html } from '@/lib/dom';
import { reducirMovimiento } from '@/lib/movimiento';

const ITEMS = [
  { id: 1, nombre: 'Masa', ejemplo: 'una mochila de 6 kg', tipo: 'escalar', porque: '6 kg no apunta hacia ningún lado.' },
  { id: 2, nombre: 'Velocidad', ejemplo: '80 km/h hacia el norte', tipo: 'vector', porque: 'Importa qué tan rápido y hacia dónde.' },
  { id: 3, nombre: 'Temperatura', ejemplo: '23 °C en el salón', tipo: 'escalar', porque: 'Un solo número la describe por completo.' },
  { id: 4, nombre: 'Fuerza', ejemplo: 'empujar una puerta', tipo: 'vector', porque: 'No es lo mismo empujar que jalar: la dirección cuenta.' },
  { id: 5, nombre: 'Tiempo', ejemplo: 'una clase de 50 min', tipo: 'escalar', porque: 'Una duración no tiene dirección en el espacio.' },
  { id: 6, nombre: 'Desplazamiento', ejemplo: '3 cuadras al este', tipo: 'vector', porque: '3 cuadras al este ≠ 3 cuadras al oeste.' },
  { id: 7, nombre: 'Rapidez', ejemplo: 'el velocímetro marca 60', tipo: 'escalar', porque: 'Es sólo el “qué tan rápido”, sin dirección.' },
  { id: 8, nombre: 'Densidad', ejemplo: 'agua: 1 g/cm³', tipo: 'escalar', porque: 'Un número con unidades, nada más.' },
];

export default function montar(raiz) {
  const el = html(`<div class="int i-clasif">
    <p class="instr" aria-live="polite"></p>
    <div class="pozo" aria-label="Cantidades por clasificar"></div>
    <div class="bandejas">
      <div class="bandeja" data-tipo="escalar" role="button" tabindex="-1" aria-label="Colocar en Escalares">
        <div class="cab"><svg viewBox="0 0 30 12" width="30" height="12" aria-hidden="true"><circle cx="15" cy="6" r="4" fill="var(--ocre)"/></svg><strong>Escalares</strong><span>sólo magnitud</span></div>
        <div class="contenido"></div>
      </div>
      <div class="bandeja" data-tipo="vector" role="button" tabindex="-1" aria-label="Colocar en Vectoriales">
        <div class="cab"><svg viewBox="0 0 30 12" width="30" height="12" aria-hidden="true"><path d="M2 6 H24" stroke="var(--azul)" stroke-width="2.2" stroke-linecap="round"/><path d="M28 6 L21 2.2 V9.8 Z" fill="var(--azul)"/></svg><strong>Vectoriales</strong><span>magnitud + dirección</span></div>
        <div class="contenido"></div>
      </div>
    </div>
    <div class="int-barra"><span class="cuenta"></span><button type="button" class="boton empuje">Reiniciar</button></div>
  </div>`);
  raiz.append(el);

  const instr = el.querySelector('.instr');
  const pozo = el.querySelector('.pozo');
  const cuenta = el.querySelector('.cuenta');
  const bandejas = [...el.querySelectorAll('.bandeja')];
  const ubicacion = new Map(ITEMS.map((i) => [i.id, null]));
  let elegido = null;

  // Una ficha por cantidad; se mueve entre contenedores con una animación FLIP.
  const fichas = new Map(
    ITEMS.map((it) => {
      const f = html(`<button type="button" class="ficha"><span class="nombre">${it.nombre}</span><span class="ej">${it.ejemplo}</span><span class="porque">${it.porque}</span></button>`);
      f.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (ubicacion.get(it.id) === null) elegido = elegido === it.id ? null : it.id;
        else mover(it.id, null);
        pintar();
      });
      pozo.append(f);
      return [it.id, f];
    }),
  );

  /** Mueve una ficha a otro contenedor animando desde su posición anterior. */
  function mover(id, tipo) {
    const todas = [...fichas.values()];
    const antes = new Map(todas.map((f) => [f, f.getBoundingClientRect()]));
    ubicacion.set(id, tipo);
    const destino = tipo === null ? pozo : el.querySelector(`.bandeja[data-tipo="${tipo}"] .contenido`);
    // Mantener el orden original dentro de cada contenedor.
    const hermanos = ITEMS.filter((i) => ubicacion.get(i.id) === tipo).map((i) => fichas.get(i.id));
    destino.append(...hermanos);
    if (reducirMovimiento()) return;
    for (const f of todas) {
      const a = antes.get(f);
      const b = f.getBoundingClientRect();
      const dx = a.left - b.left;
      const dy = a.top - b.top;
      if (Math.abs(dx) + Math.abs(dy) > 0.5)
        f.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 380, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    }
  }

  function colocar(tipo) {
    if (elegido === null) return;
    mover(elegido, tipo);
    elegido = null;
    pintar();
  }

  bandejas.forEach((b) => {
    b.addEventListener('click', () => colocar(b.dataset.tipo));
    b.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), colocar(b.dataset.tipo)));
  });

  el.querySelector('.int-barra .boton').addEventListener('click', () => {
    ITEMS.forEach((i) => ubicacion.get(i.id) !== null && mover(i.id, null));
    elegido = null;
    pintar();
  });

  function pintar() {
    const restantes = ITEMS.filter((i) => ubicacion.get(i.id) === null).length;
    const terminado = restantes === 0;
    const errores = ITEMS.filter((i) => ubicacion.get(i.id) && ubicacion.get(i.id) !== i.tipo).length;
    el.classList.toggle('eligiendo', elegido !== null);
    el.classList.toggle('terminado', terminado);
    bandejas.forEach((b) => (b.tabIndex = elegido !== null ? 0 : -1));
    for (const it of ITEMS) {
      const f = fichas.get(it.id);
      const u = ubicacion.get(it.id);
      f.classList.toggle('activa', elegido === it.id);
      f.classList.toggle('bien', u !== null && u === it.tipo);
      f.classList.toggle('mal', u !== null && u !== it.tipo);
      f.title = u === null ? '' : 'Regresar';
    }
    if (elegido !== null) instr.innerHTML = `¿<strong>${ITEMS.find((i) => i.id === elegido).nombre}</strong> es escalar o vectorial?`;
    else if (!terminado) instr.textContent = 'Toca una cantidad y luego la bandeja donde crees que va.';
    else instr.textContent = errores === 0 ? '¡Todas bien clasificadas!' : `Hay ${errores} en la bandeja equivocada (marcadas en rojo). Tócalas para regresarlas.`;
    cuenta.textContent = `${ITEMS.length - restantes} de ${ITEMS.length} clasificadas`;
  }
  pintar();
}
