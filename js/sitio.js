/**
 * Punto de entrada de todas las páginas: <script type="module" src="…/js/sitio.js"></script>
 *
 * - Inserta la barra superior y el pie.
 * - Renderiza las matemáticas ($…$, $$…$$) con KaTeX.
 * - Convierte ecuaciones numeradas, términos del glosario y preguntas.
 * - En las secciones: índice lateral, barra de progreso y navegación anterior/siguiente.
 * - Carga cada interactivo (data-interactivo="nombre") cuando está por entrar en pantalla.
 * - Genera las listas de la portada, el índice y el glosario.
 */
import { renderizarMath } from './lib/katex.js';
import { indice, seccionesPublicadas } from './datos/indice.js';
import { glosario } from './datos/glosario.js';
import { opcionMultiple, calculoMental, reflexion } from './evaluacion.js';
import { uid } from './lib/dom.js';

/** Raíz del sitio, deducida de la ubicación de este archivo (funciona en local y en GitHub Pages). */
const RAIZ = new URL('../', import.meta.url);
export const url = (ruta = '') => new URL(ruta, RAIZ).href;

const publicadas = seccionesPublicadas();
const LOGO = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 18 L13 6" stroke="var(--azul)" stroke-width="2.2" stroke-linecap="round"/><path d="M13 6 L20 14" stroke="var(--magenta)" stroke-width="2.2" stroke-linecap="round"/><path d="M4 18 L20 14" stroke="var(--verde)" stroke-width="2.2" stroke-linecap="round"/></svg>`;

// ——— Barra y pie ———

function barraYPie() {
  if (!document.body.hasAttribute('data-sin-barra')) {
    document.body.insertAdjacentHTML(
      'afterbegin',
      `<header class="barra">
        <a class="marca" href="${url()}">${LOGO}<span>Física Universitaria <em>Interactiva</em></span></a>
        <nav aria-label="Principal">
          <a href="${url('indice.html')}">Índice</a>
          <a href="${url('glosario.html')}">Glosario</a>
          <a href="${url('como-usar.html')}" class="ocultar-movil">Cómo usar</a>
          <button class="tema" type="button" aria-label="Cambiar tema claro/oscuro" title="Tema">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 4 A8 8 0 0 1 12 20 Z" fill="currentColor"/></svg>
          </button>
        </nav>
      </header>`,
    );
  }
  document.body.insertAdjacentHTML(
    'beforeend',
    `<footer class="pie ui">
      <p><strong>Física Universitaria Interactiva</strong> — notas de estudio independientes que siguen el orden y la pedagogía de <em>Física Universitaria</em> de Sears, Zemansky, Young y Freedman (12.ª ed.). No está afiliado ni respaldado por Pearson. Textos, ejemplos y figuras son originales.</p>
      <p>Contenido bajo <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es">CC BY-NC-SA 4.0</a> · Código bajo licencia MIT.</p>
    </footer>`,
  );
  document.querySelector('.barra .tema')?.addEventListener('click', () => {
    const raiz = document.documentElement;
    const oscuroAhora = raiz.dataset.theme === 'dark' || (!raiz.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
    const nuevo = oscuroAhora ? 'light' : 'dark';
    raiz.dataset.theme = nuevo;
    try {
      localStorage.setItem('fui:tema', nuevo);
    } catch {}
  });
}

// ——— Piezas del libro ———

function ecuaciones() {
  document.querySelectorAll('.ecuacion').forEach((el) => {
    const { n, nota } = el.dataset;
    const cuerpo = document.createElement('div');
    cuerpo.className = 'cuerpo';
    cuerpo.append(...el.childNodes);
    el.append(cuerpo);
    if (n) el.id ||= `ec-${n}`;
    if (n || nota) {
      el.insertAdjacentHTML('beforeend', `<div class="lado">${nota ? `<span class="nota">${nota}</span>` : ''}${n ? `<span class="num">(${n})</span>` : ''}</div>`);
    }
  });
}

function terminos() {
  document.querySelectorAll('.termino[data-id]').forEach((el) => {
    const e = glosario[el.dataset.id];
    if (!e) {
      el.classList.add('desconocido');
      console.error(`Término de glosario desconocido: "${el.dataset.id}"`);
      return;
    }
    const idTip = uid('tip');
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'palabra';
    boton.setAttribute('aria-describedby', idTip);
    boton.append(...el.childNodes);
    const tip = document.createElement('span');
    tip.className = 'tip ui';
    tip.id = idTip;
    tip.setAttribute('role', 'tooltip');
    tip.innerHTML = `<strong>${e.termino}</strong>${e.definicion}`;
    el.append(boton, tip);
  });
}

function evaluaciones() {
  document.querySelectorAll('.om').forEach(opcionMultiple);
  document.querySelectorAll('.cm').forEach(calculoMental);
  document.querySelectorAll('.reflexion').forEach(reflexion);
  document.querySelectorAll('.evalua').forEach((el) => {
    el.insertAdjacentHTML(
      'afterbegin',
      `<p class="cabeza"><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M6.5 10.2 L9 12.6 L13.8 7.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Evalúe su comprensión de la sección ${el.dataset.seccion}</p>`,
    );
  });
}

// ——— Página de sección ———

const slugTitulo = (t) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function seccion() {
  const slug = document.body.dataset.seccion;
  if (!slug) return;
  const i = publicadas.findIndex((s) => s.slug === slug);
  const actual = publicadas[i];
  const anterior = publicadas[i - 1];
  const siguiente = publicadas[i + 1];

  // Cabecera con datos del índice
  const cap = document.querySelector('.cabecera .cap');
  if (cap && actual) {
    cap.href = url('indice.html');
    cap.textContent = `Capítulo ${actual.capitulo} · ${actual.tituloCapitulo}`;
  }

  // Índice lateral
  const h2 = [...document.querySelectorAll('.prosa h2')];
  h2.forEach((h) => (h.id ||= slugTitulo(h.textContent)));
  const main = document.querySelector('.marco > main');
  if (h2.length && main) {
    main.insertAdjacentHTML(
      'beforebegin',
      `<aside class="toc ui" aria-label="En esta sección"><nav><p class="toc-tit">En esta sección</p><ol>${h2.map((h) => `<li><a href="#${h.id}">${h.textContent}</a></li>`).join('')}</ol></nav></aside>`,
    );
  }

  // Anterior / siguiente
  const tarjeta = (s, dir, clase = '') =>
    s
      ? `<a class="tarjeta-paso ${clase}" href="${url(s.slug + '/')}"><span class="dir">${dir}</span><span class="t">${s.numero} ${s.titulo}</span></a>`
      : `<a class="tarjeta-paso ${clase}" href="${url('indice.html')}"><span class="dir">${dir.includes('←') ? '← Índice' : 'Índice →'}</span><span class="t">${dir.includes('←') ? 'Contenido del libro' : 'Más secciones próximamente'}</span></a>`;
  main?.insertAdjacentHTML('beforeend', `<nav class="paso-seccion ui" aria-label="Navegación entre secciones">${tarjeta(anterior, '← Anterior')}${tarjeta(siguiente, 'Siguiente →', 'der')}</nav>`);

  // Barra de progreso y resaltado del índice lateral
  document.body.insertAdjacentHTML('afterbegin', '<div class="progreso-lectura" aria-hidden="true"><span></span></div>');
  const barra = document.querySelector('.progreso-lectura span');
  const enlaces = [...document.querySelectorAll('.toc a')];
  const actualizar = () => {
    const d = document.documentElement;
    const p = d.scrollTop / Math.max(1, d.scrollHeight - d.clientHeight);
    barra.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    let activo = 0;
    h2.forEach((h, k) => {
      if (h.getBoundingClientRect().top < 140) activo = k;
    });
    enlaces.forEach((a, k) => a.classList.toggle('activo', k === activo));
  };
  document.addEventListener('scroll', actualizar, { passive: true });
  actualizar();
}

// ——— Listas generadas ———

function listaDisponibles(el) {
  el.innerHTML = publicadas
    .map((s) => `<li class="aparece"><a href="${url(s.slug + '/')}"><span class="n">${s.numero}</span><span class="tt">${s.titulo}</span><span class="cap">Cap. ${s.capitulo}</span></a></li>`)
    .join('');
  const primera = publicadas[0];
  const comenzar = document.querySelector('[data-comenzar]');
  if (comenzar && primera) {
    comenzar.href = url(primera.slug + '/');
    comenzar.textContent = `Comenzar: ${primera.numero} ${primera.titulo}`;
  }
}

function listaIndice(el) {
  const todas = indice.flatMap((p) => p.capitulos.flatMap((c) => c.secciones));
  const listas = todas.filter((s) => s.slug).length;
  el.innerHTML =
    `<div class="progreso-indice" aria-label="${listas} de ${todas.length} secciones disponibles"><div class="barra-p"><span style="width:${(100 * listas) / todas.length}%"></span></div><span>${listas} de ${todas.length} secciones</span></div>` +
    indice
      .map(
        (parte) => `<section class="parte"><h2>${parte.titulo}</h2>${parte.capitulos
          .map((cap) => {
            const disp = cap.secciones.filter((s) => s.slug).length;
            return `<details class="capitulo aparece"${disp ? ' open' : ''}>
              <summary><span class="num">${cap.numero}</span><span class="tit">${cap.titulo}</span>${disp ? `<span class="pastilla">${disp} disponibles</span>` : ''}<span class="pag">${cap.pagina}</span></summary>
              <ol>${cap.secciones
                .map(
                  (s) =>
                    `<li class="${s.slug ? 'lista' : ''}">${
                      s.slug
                        ? `<a href="${url(s.slug + '/')}"><span class="sn">${s.numero}</span><span>${s.titulo}</span></a>`
                        : `<span class="pendiente"><span class="sn">${s.numero}</span><span>${s.titulo}${s.opcional ? '<span class="opc"> opcional</span>' : ''}</span></span>`
                    }<span class="pag">${s.pagina}</span></li>`,
                )
                .join('')}</ol>
            </details>`;
          })
          .join('')}</section>`,
      )
      .join('');
}

function listaGlosario(el) {
  const entradas = Object.entries(glosario).sort((a, b) => a[1].termino.localeCompare(b[1].termino, 'es'));
  const letras = [...new Set(entradas.map(([, e]) => e.termino[0].toUpperCase()))];
  el.innerHTML =
    `<nav class="letras" aria-label="Letras">${letras.map((l) => `<a href="#letra-${l}">${l}</a>`).join('')}</nav>` +
    letras
      .map(
        (l) => `<section class="letra" id="letra-${l}"><h2 class="ui">${l}</h2><dl>${entradas
          .filter(([, e]) => e.termino[0].toUpperCase() === l)
          .map(([id, e]) => `<div class="entrada aparece" id="${id}"><dt>${e.termino}</dt><dd>${e.definicion} <span class="sec">§ ${e.seccion}</span></dd></div>`)
          .join('')}</dl></section>`,
      )
      .join('');
}

/** Fondo de la portada: rejilla de flechitas orientadas como un campo vectorial. */
function campoPortada(el) {
  let s = '';
  for (let n = 0; n < 13 * 7; n++) {
    const i = n % 13;
    const j = Math.floor(n / 13);
    const x = 40 + i * 76;
    const y = 40 + j * 76;
    const ang = (Math.atan2(y - 300, x - 520) * 180) / Math.PI + 90;
    s += `<g transform="translate(${x} ${y}) rotate(${ang})"><g class="mini" style="animation-delay:${(i + j) * 60}ms"><line x1="-11" y1="0" x2="8" y2="0"/><path d="M12 0 L5 -3.6 L5 3.6 Z"/></g></g>`;
  }
  el.innerHTML = s;
}

function generadas() {
  document.querySelectorAll('[data-generar]').forEach((el) => {
    ({ disponibles: listaDisponibles, indice: listaIndice, glosario: listaGlosario, campo: campoPortada })[el.dataset.generar]?.(el);
  });
}

// ——— Aparición suave y carga perezosa de interactivos ———

function aparecer() {
  const obs = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  document.querySelectorAll('.aparece').forEach((el) => obs.observe(el));
}

function interactivos() {
  const montar = async (el) => {
    const nombre = el.dataset.interactivo;
    try {
      const m = await import(`./interactivos/${nombre}.js`);
      el.replaceChildren();
      m.default(el);
      el.dataset.montado = '';
    } catch (err) {
      console.error(`No se pudo cargar el interactivo "${nombre}"`, err);
      el.innerHTML = `<p class="int-texto">No se pudo cargar este interactivo.</p>`;
    }
  };
  const obs = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) {
          obs.unobserve(e.target);
          montar(e.target);
        }
      }
    },
    { rootMargin: '300px 0px' },
  );
  document.querySelectorAll('[data-interactivo]').forEach((el) => obs.observe(el));
}

// ——— Arranque ———

barraYPie();
generadas();
ecuaciones();
terminos();
renderizarMath(document.body);
evaluaciones();
seccion();
aparecer();
interactivos();
