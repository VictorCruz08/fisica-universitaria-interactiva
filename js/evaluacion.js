/**
 * Mejora progresiva de las preguntas escritas en HTML:
 *
 * Opción múltiple
 *   <div class="om" data-id="1.7-x" [data-multiple]>
 *     <p class="pregunta">…</p>
 *     <ol class="opciones">
 *       <li [data-correcta]>Texto de la opción<p class="explicacion">Por qué sí / por qué no</p></li>
 *     </ol>
 *     [<p class="cierre">Idea general</p>]
 *   </div>
 *
 * Cálculo mental
 *   <div class="cm" data-id="1.7-mental">
 *     <div class="reto" data-respuesta="10" [data-unidad="m"] [data-tolerancia="0.1"]>
 *       <p class="pregunta">…</p> [<p class="pista">…</p>] <p class="truco">…</p>
 *     </div> …
 *   </div>
 *
 * Reflexión
 *   <div class="reflexion"><p class="pregunta">…</p>[<p class="pista">…</p>]<div class="respuesta">…</div></div>
 */
import { registrarRespuesta } from './lib/progreso.js';
import { html, uid } from './lib/dom.js';

const letra = (i) => String.fromCharCode(97 + i);

export function opcionMultiple(raiz) {
  const id = raiz.dataset.id;
  const multiple = raiz.hasAttribute('data-multiple');
  const lista = raiz.querySelector('.opciones');
  const items = [...lista.children];
  lista.setAttribute('role', multiple ? 'group' : 'radiogroup');
  lista.setAttribute('aria-label', 'Opciones');
  if (multiple) raiz.querySelector('.pregunta').insertAdjacentHTML('afterend', '<p class="ayuda">Puede haber más de una respuesta correcta.</p>');

  const opciones = items.map((li, i) => {
    const explicacion = li.querySelector('.explicacion');
    const boton = html(`<button type="button" class="opcion" role="${multiple ? 'checkbox' : 'radio'}" aria-checked="false"><span class="letra">${letra(i)}</span><span class="texto"></span></button>`);
    const texto = boton.querySelector('.texto');
    [...li.childNodes].forEach((n) => n !== explicacion && texto.append(n));
    li.prepend(boton);
    if (explicacion && li.hasAttribute('data-correcta')) explicacion.classList.add('bien');
    return { li, boton, explicacion, correcta: li.hasAttribute('data-correcta') };
  });

  const acciones = html(`<div class="acciones"><button type="button" class="boton primario" disabled>Comprobar</button></div>`);
  const comprobarBtn = acciones.querySelector('button');
  lista.after(acciones);

  let elegidas = new Set();
  const pintar = () => {
    opciones.forEach((o, i) => {
      const m = elegidas.has(i);
      o.boton.classList.toggle('marcada', m);
      o.boton.setAttribute('aria-checked', String(m));
    });
    comprobarBtn.disabled = elegidas.size === 0;
  };

  opciones.forEach((o, i) =>
    o.boton.addEventListener('click', () => {
      if (raiz.classList.contains('comprobado')) return;
      if (!multiple) elegidas = new Set();
      elegidas.has(i) ? elegidas.delete(i) : elegidas.add(i);
      pintar();
    }),
  );

  comprobarBtn.addEventListener('click', () => {
    const correctas = opciones.flatMap((o, i) => (o.correcta ? [i] : []));
    const acierto = correctas.length === elegidas.size && correctas.every((i) => elegidas.has(i));
    raiz.classList.add('comprobado');
    opciones.forEach((o, i) => {
      const m = elegidas.has(i);
      o.boton.disabled = true;
      o.boton.classList.toggle('bien', o.correcta);
      o.boton.classList.toggle('mal', m && !o.correcta);
      o.boton.classList.toggle('atenuada', !m && !o.correcta);
      o.explicacion?.classList.toggle('visible', m || o.correcta);
    });
    acciones.innerHTML = `<p class="veredicto ${acierto ? 'bien' : ''}" aria-live="polite">${acierto ? '¡Correcto!' : multiple ? 'Revisa las opciones marcadas.' : 'No exactamente.'}</p><button type="button" class="boton">Intentar de nuevo</button>`;
    acciones.querySelector('button').addEventListener('click', reintentar);
    registrarRespuesta(id, acierto);
  });

  function reintentar() {
    raiz.classList.remove('comprobado');
    elegidas = new Set();
    opciones.forEach((o) => {
      o.boton.disabled = false;
      o.boton.classList.remove('bien', 'mal', 'atenuada');
      o.explicacion?.classList.remove('visible');
    });
    acciones.replaceChildren(comprobarBtn);
    pintar();
  }
}

export function calculoMental(raiz) {
  const id = raiz.dataset.id;
  const retos = [...raiz.querySelectorAll('.reto')];
  raiz.insertAdjacentHTML(
    'afterbegin',
    `<div class="cabeza"><span class="titulo"><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><rect x="3.5" y="2.5" width="13" height="15" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M7 6.5h6M7 10h1.5M11.5 10H13M7 13.5h1.5M11.5 13.5H13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>Cálculo mental · sin calculadora</span><span class="contador"></span></div>`,
  );
  const contador = raiz.querySelector('.contador');
  const idInput = uid('cm');
  const control = html(`<div class="control">
      <div class="fila">
        <label class="sr-only" for="${idInput}">Tu respuesta</label>
        <input id="${idInput}" type="text" inputmode="decimal" autocomplete="off" placeholder="Tu respuesta" />
        <span class="unidad"></span>
        <button type="button" class="boton primario">Comprobar</button>
      </div>
      <div aria-live="polite"><p class="mensaje" hidden></p></div>
      <div class="acciones"></div>
      <p class="valor" hidden></p>
    </div>`);
  raiz.append(control);
  const input = control.querySelector('input');
  const unidad = control.querySelector('.unidad');
  const comprobarBtn = control.querySelector('.fila .boton');
  const mensaje = control.querySelector('.mensaje');
  const acciones = control.querySelector('.acciones');
  const valor = control.querySelector('.valor');

  let i = 0;
  let estado = 'pendiente';

  const reto = () => retos[i];
  const boton = (texto, fn) => {
    const b = html(`<button type="button" class="boton">${texto}</button>`);
    b.addEventListener('click', fn);
    acciones.append(b);
  };

  function pintar() {
    const r = reto();
    retos.forEach((x, k) => x.classList.toggle('actual', k === i));
    contador.textContent = `${i + 1} / ${retos.length}`;
    unidad.textContent = r.dataset.unidad ?? '';
    input.classList.toggle('bien', estado === 'bien');
    input.classList.toggle('mal', estado === 'mal');
    input.disabled = estado === 'bien';
    comprobarBtn.hidden = estado === 'bien';
    mensaje.hidden = estado === 'pendiente';
    mensaje.className = `mensaje ${estado}`;
    mensaje.textContent =
      estado === 'bien' ? '¡Exacto!' : `Todavía no. Inténtalo otra vez${r.querySelector('.pista') ? ' o pide una pista' : ''}.`;
    r.querySelector('.truco')?.classList.toggle('visible', estado === 'bien');
    if (estado === 'bien') r.querySelector('.pista')?.classList.remove('visible');
    valor.hidden = estado !== 'bien';
    valor.textContent = `Respuesta: ${r.dataset.respuesta} ${r.dataset.unidad ?? ''}`;

    acciones.replaceChildren();
    const pista = r.querySelector('.pista');
    if (pista && !pista.classList.contains('visible') && estado !== 'bien') boton('Pista', () => (pista.classList.add('visible'), pintar()));
    if (estado === 'mal') boton('Ver respuesta', () => ((estado = 'bien'), pintar()));
    if (estado === 'bien' && retos.length > 1) boton(i + 1 < retos.length ? 'Siguiente' : 'Volver al primero', siguiente);
  }

  function comprobar() {
    const texto = input.value.replace(',', '.').trim();
    const v = Number(texto);
    if (texto === '' || !Number.isFinite(v)) return;
    const r = reto();
    const respuesta = Number(r.dataset.respuesta);
    const tol = r.dataset.tolerancia ? Number(r.dataset.tolerancia) : Math.max(0.05, Math.abs(respuesta) * 0.02);
    estado = Math.abs(v - respuesta) <= tol ? 'bien' : 'mal';
    registrarRespuesta(`${id}-${i}`, estado === 'bien');
    // reinicia la animación de "sacudida"
    input.classList.remove('mal');
    void input.offsetWidth;
    pintar();
  }

  function siguiente() {
    i = (i + 1) % retos.length;
    input.value = '';
    estado = 'pendiente';
    pintar();
    input.focus();
  }

  comprobarBtn.addEventListener('click', comprobar);
  input.addEventListener('keydown', (e) => e.key === 'Enter' && comprobar());
  pintar();
}

export function reflexion(raiz) {
  const pista = raiz.querySelector('.pista');
  const respuesta = raiz.querySelector('.respuesta');
  const idNotas = uid('notas');
  raiz.querySelector('.pregunta').insertAdjacentHTML(
    'afterend',
    `<label class="sr-only" for="${idNotas}">Tus ideas (opcional)</label><textarea id="${idNotas}" rows="2" placeholder="Escribe tu idea antes de ver la respuesta (opcional)…"></textarea><div class="acciones"></div>`,
  );
  const acciones = raiz.querySelector('.acciones');
  // Orden final: botones, pista, respuesta.
  acciones.after(respuesta);
  if (pista) acciones.after(pista);

  const pintar = () => {
    acciones.replaceChildren();
    const revelada = respuesta.classList.contains('visible');
    if (pista && !pista.classList.contains('visible') && !revelada) {
      const b = html('<button type="button" class="boton">Pista</button>');
      b.addEventListener('click', () => (pista.classList.add('visible'), pintar()));
      acciones.append(b);
    }
    if (!revelada) {
      const b = html('<button type="button" class="boton primario">Ver una respuesta</button>');
      b.addEventListener('click', () => {
        respuesta.classList.add('visible');
        pista?.classList.remove('visible');
        pintar();
      });
      acciones.append(b);
    }
  };
  pintar();
}
