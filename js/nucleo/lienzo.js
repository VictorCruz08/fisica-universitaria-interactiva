/**
 * Núcleo de dibujo de los interactivos (SVG, sin dependencias).
 *
 * - `Plano`: lienzo 2D con rejilla y ejes, coordenadas del mundo con y hacia arriba.
 * - `Escena3D`: lienzo 3D con proyección ortográfica; se gira arrastrando.
 *
 * Ambos exponen la misma interfaz `aPx(p)` (mundo → píxeles), así que las
 * funciones de dibujo (`flecha`, `etiqueta`, `poligono`, `arco`, `punto`)
 * sirven para los dos. Esas funciones devuelven cadenas SVG: cada interactivo
 * compone su escena en una función `dibujar()` y la vuelve a llamar cuando
 * cambia algo. Las manijas, en cambio, son nodos persistentes (para no perder
 * el arrastre al redibujar).
 */
import { proyectar } from '../lib/proyeccion.js';
import { tex } from '../lib/katex.js';
import { RAD } from '../lib/vec.js';

const NS = 'http://www.w3.org/2000/svg';

const crearSvg = (titulo, rol = 'img') => {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('role', rol);
  svg.setAttribute('aria-label', titulo);
  const capa = (clase) => {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', clase);
    svg.append(g);
    return g;
  };
  return { svg, fondo: capa('capa-fondo'), base: capa('capa-base'), contenido: capa('capa-contenido'), manijas: capa('capa-manijas') };
};

const rango = (a, b, paso) => {
  const out = [];
  for (let v = Math.ceil(a / paso) * paso; v <= b + 1e-9; v += paso) out.push(Number(v.toFixed(6)));
  return out;
};

class LienzoBase {
  constructor(contenedor, titulo, rol) {
    this.el = document.createElement('div');
    this.el.className = 'lienzo-svg';
    const c = crearSvg(titulo, rol);
    Object.assign(this, c);
    this.el.append(this.svg);
    contenedor.append(this.el);
    this.ancho = contenedor.clientWidth || 720;
    this._alRedibujar = [];
    this._manijas = [];
    new ResizeObserver(() => {
      const w = this.el.clientWidth;
      if (w > 0 && Math.abs(w - this.ancho) > 0.5) {
        this.ancho = w;
        this.medir();
        this.redibujar();
      }
    }).observe(this.el);
  }

  /** Registra la función que vuelve a pintar la escena (al cambiar tamaño o cámara). */
  alRedibujar(fn) {
    this._alRedibujar.push(fn);
    return this;
  }

  redibujar() {
    this._alRedibujar.forEach((fn) => fn());
    this._manijas.forEach((m) => m.colocar());
  }

  /** Reemplaza el contenido dibujado (cadenas SVG). */
  pintar(partes) {
    this.contenido.innerHTML = Array.isArray(partes) ? partes.filter(Boolean).join('') : partes;
  }

  pintarFondo(partes) {
    this.fondo.innerHTML = Array.isArray(partes) ? partes.filter(Boolean).join('') : partes;
  }

  _ajustarSvg(alto) {
    this.alto = alto;
    this.svg.setAttribute('viewBox', `0 0 ${this.ancho} ${alto}`);
    this.svg.setAttribute('width', this.ancho);
    this.svg.setAttribute('height', alto);
  }
}

export class Plano extends LienzoBase {
  /**
   * @param {HTMLElement} contenedor
   * @param {object} o
   * @param {[number, number]} o.x  rango visible en x
   * @param {[number, number]} o.y  rango visible en y
   * @param {string} o.titulo        descripción accesible
   * @param {number|false} [o.rejilla=1]
   * @param {boolean} [o.ejes=true]
   * @param {[string, string]} [o.etiquetasEjes]
   * @param {number} [o.marcas=0]    marcas numéricas cada n unidades
   * @param {number} [o.altoMax=520]
   */
  constructor(contenedor, { x, y, titulo, rejilla = 1, ejes = true, etiquetasEjes = ['x', 'y'], marcas = 0, altoMax = 520 }) {
    super(contenedor, titulo);
    Object.assign(this, { x, y, rejilla, ejes, etiquetasEjes, marcas, altoMax });
    this.el.classList.add('plano');
    this.medir();
  }

  medir() {
    const { x, y } = this;
    this.escala = Math.min(this.ancho / (x[1] - x[0]), this.altoMax / (y[1] - y[0]));
    this.margenX = (this.ancho - (x[1] - x[0]) * this.escala) / 2;
    this._ajustarSvg((y[1] - y[0]) * this.escala);
    this._pintarBase();
  }

  X(wx) {
    return this.margenX + (wx - this.x[0]) * this.escala;
  }

  Y(wy) {
    return (this.y[1] - wy) * this.escala;
  }

  aPx(p) {
    return { x: this.X(p.x), y: this.Y(p.y) };
  }

  aMundo(ev) {
    const r = this.svg.getBoundingClientRect();
    const k = this.ancho / r.width; // por si el svg está escalado por CSS
    return {
      x: ((ev.clientX - r.left) * k - this.margenX) / this.escala + this.x[0],
      y: this.y[1] - ((ev.clientY - r.top) * k) / this.escala,
    };
  }

  _pintarBase() {
    const { x, y, alto } = this;
    const X = (v) => this.X(v);
    const Y = (v) => this.Y(v);
    let s = '';
    if (this.rejilla) {
      s += '<g class="rejilla">';
      for (const gx of rango(x[0], x[1], this.rejilla)) s += `<line x1="${X(gx)}" y1="0" x2="${X(gx)}" y2="${alto}"/>`;
      for (const gy of rango(y[0], y[1], this.rejilla)) s += `<line x1="${X(x[0])}" y1="${Y(gy)}" x2="${X(x[1])}" y2="${Y(gy)}"/>`;
      s += '</g>';
    }
    if (this.ejes) {
      s += '<g class="ejes">';
      if (x[0] <= 0 && x[1] >= 0) {
        s += `<line x1="${X(0)}" y1="${alto}" x2="${X(0)}" y2="6"/><path d="M${X(0)} 2 l-4.5 9 h9 Z"/>`;
        s += `<text class="eje" x="${X(0) + 10}" y="16">${this.etiquetasEjes[1]}</text>`;
      }
      if (y[0] <= 0 && y[1] >= 0) {
        s += `<line x1="${X(x[0])}" y1="${Y(0)}" x2="${X(x[1]) - 6}" y2="${Y(0)}"/><path d="M${X(x[1]) - 2} ${Y(0)} l-9 -4.5 v9 Z"/>`;
        s += `<text class="eje" x="${X(x[1]) - 14}" y="${Y(0) - 10}" text-anchor="end">${this.etiquetasEjes[0]}</text>`;
      }
      if (this.marcas) {
        for (const m of rango(x[0] + this.marcas, x[1] - this.marcas, this.marcas))
          if (m !== 0) s += `<text class="marca" x="${X(m)}" y="${Y(0) + 16}" text-anchor="middle">${m}</text>`;
        for (const m of rango(y[0] + this.marcas, y[1] - this.marcas, this.marcas))
          if (m !== 0) s += `<text class="marca" x="${X(0) - 7}" y="${Y(m) + 4}" text-anchor="end">${m}</text>`;
      }
      s += '</g>';
    }
    this.base.innerHTML = s;
  }

  /** Crea una manija arrastrable (ver clase Manija). */
  manija(opciones) {
    const m = new Manija(this, opciones);
    this._manijas.push(m);
    return m;
  }
}

export class Escena3D extends LienzoBase {
  /**
   * @param {HTMLElement} contenedor
   * @param {object} o
   * @param {string} o.titulo
   * @param {number} [o.tamano=4]   semilongitud de los ejes
   * @param {number} [o.alto=380]
   * @param {number} [o.azimut=-35]
   * @param {number} [o.elevacion=22]
   * @param {boolean} [o.ejes=true]
   * @param {[string,string,string]} [o.etiquetasEjes]
   */
  constructor(contenedor, { titulo, tamano = 4, alto = 380, azimut = -35, elevacion = 22, ejes = true, etiquetasEjes = ['x', 'y', 'z'] }) {
    super(contenedor, `${titulo}. Arrastra o usa las flechas para girar la vista.`, 'application');
    Object.assign(this, { tamano, altoBase: alto, azimut, elevacion, ejes, etiquetasEjes, zInvertido: false });
    this.el.classList.add('escena3d');
    this.svg.setAttribute('tabindex', '0');
    this.el.insertAdjacentHTML(
      'beforeend',
      `<span class="pista-giro ui" aria-hidden="true"><svg viewBox="0 0 20 20" width="14" height="14"><path d="M3 10a7 3 0 0 0 14 0" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M15 7.5 L17.2 10 L14.4 11.2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Arrastra para girar</span>`,
    );
    this._orbitar();
    this.medir();
  }

  medir() {
    this.escala = Math.min(this.ancho, this.altoBase * 1.25) / (this.tamano * 2.6);
    this._ajustarSvg(this.altoBase);
    this._pintarBase();
  }

  camara() {
    return { azimut: this.azimut, elevacion: this.elevacion, escala: this.escala, cx: this.ancho / 2, cy: this.alto * 0.56 };
  }

  aPx(p) {
    return proyectar({ x: p.x, y: p.y, z: p.z ?? 0 }, this.camara());
  }

  /** Invierte el eje z dibujado (sistema izquierdo). */
  invertirZ(inv) {
    this.zInvertido = inv;
    this._pintarBase();
  }

  _pintarBase() {
    if (!this.ejes) {
      this.base.innerHTML = '';
      return;
    }
    const t = this.tamano;
    const sz = this.zInvertido ? -1 : 1;
    const o = this.aPx({ x: 0, y: 0, z: 0 });
    const fin = [this.aPx({ x: t, y: 0, z: 0 }), this.aPx({ x: 0, y: t, z: 0 }), this.aPx({ x: 0, y: 0, z: sz * t })];
    const ini = [this.aPx({ x: -t * 0.35, y: 0, z: 0 }), this.aPx({ x: 0, y: -t * 0.35, z: 0 }), this.aPx({ x: 0, y: 0, z: -sz * t * 0.35 })];
    let s = '<g class="ejes">';
    fin.forEach((f, i) => {
      s += `<line x1="${ini[i].x}" y1="${ini[i].y}" x2="${f.x}" y2="${f.y}"/>`;
      s += `<text x="${f.x + (f.x - o.x) * 0.08}" y="${f.y + (f.y - o.y) * 0.08 + 5}" text-anchor="middle">${this.etiquetasEjes[i]}</text>`;
    });
    this.base.innerHTML = s + '</g>';
  }

  _orbitar() {
    let arrastre = null;
    const cambiar = (az, el) => {
      this.azimut = az;
      this.elevacion = Math.max(-10, Math.min(85, el));
      this._pintarBase();
      this.redibujar();
    };
    this.svg.addEventListener('pointerdown', (ev) => {
      arrastre = { x: ev.clientX, y: ev.clientY, az: this.azimut, el: this.elevacion };
      this.svg.setPointerCapture(ev.pointerId);
    });
    this.svg.addEventListener('pointermove', (ev) => {
      if (arrastre) cambiar(arrastre.az - (ev.clientX - arrastre.x) * 0.45, arrastre.el + (ev.clientY - arrastre.y) * 0.35);
    });
    const soltar = () => (arrastre = null);
    this.svg.addEventListener('pointerup', soltar);
    this.svg.addEventListener('pointercancel', soltar);
    this.svg.addEventListener('keydown', (ev) => {
      const d = { ArrowLeft: [5, 0], ArrowRight: [-5, 0], ArrowUp: [0, 5], ArrowDown: [0, -5] }[ev.key];
      if (!d) return;
      ev.preventDefault();
      cambiar(this.azimut + d[0], this.elevacion + d[1]);
    });
  }
}

/**
 * Punto arrastrable con puntero y con teclado.
 * opciones: { pos, color, paso = 0.5, restringir, nombre, alMover }
 * `pos` puede ser una función (se reevalúa en cada redibujado) o un {x, y} fijo.
 */
export class Manija {
  constructor(lienzo, { pos, color = 'var(--vec-a)', paso = 0.5, restringir, nombre, alMover = () => {} }) {
    Object.assign(this, { lienzo, color, paso, restringir, alMover });
    this.leerPos = typeof pos === 'function' ? pos : () => this._pos;
    this._pos = typeof pos === 'function' ? pos() : pos;
    this.g = document.createElementNS(NS, 'g');
    this.g.setAttribute('class', 'manija');
    this.g.setAttribute('role', 'slider');
    this.g.setAttribute('tabindex', '0');
    this.g.setAttribute('aria-label', `${nombre}: arrastra o usa las flechas del teclado`);
    this.g.innerHTML = `<circle class="zona" r="22"/><circle class="halo" r="13" fill="${color}"/><circle class="punto" r="6.5" fill="var(--fondo-elevado)" stroke="${color}"/>`;
    lienzo.manijas.append(this.g);
    this._eventos();
    this.colocar();
  }

  get pos() {
    return this.leerPos();
  }

  /** Actualiza el dibujo de la manija a su posición actual. */
  colocar() {
    const p = this.pos;
    const q = this.lienzo.aPx(p);
    this.g.querySelectorAll('circle').forEach((c) => {
      c.setAttribute('cx', q.x);
      c.setAttribute('cy', q.y);
    });
    this.g.setAttribute('aria-valuetext', `x = ${p.x}, y = ${p.y}`);
  }

  ocultar(oculta) {
    this.g.style.display = oculta ? 'none' : '';
  }

  _ajustar(v) {
    const s = this.paso > 0 ? { x: Math.round(v.x / this.paso) * this.paso, y: Math.round(v.y / this.paso) * this.paso } : v;
    const r = this.restringir ? this.restringir(s) : s;
    return { x: Number(r.x.toFixed(4)), y: Number(r.y.toFixed(4)) };
  }

  _fijar(v) {
    const p = this._ajustar(v);
    this._pos = p;
    this.alMover(p);
    this.colocar();
  }

  _eventos() {
    let arrastrando = false;
    this.g.addEventListener('pointerdown', (ev) => {
      arrastrando = true;
      this.g.classList.add('arrastrando');
      this.g.setPointerCapture(ev.pointerId);
      ev.preventDefault();
      ev.stopPropagation();
    });
    this.g.addEventListener('pointermove', (ev) => {
      if (arrastrando) this._fijar(this.lienzo.aMundo(ev));
    });
    const soltar = () => {
      arrastrando = false;
      this.g.classList.remove('arrastrando');
    };
    this.g.addEventListener('pointerup', soltar);
    this.g.addEventListener('pointercancel', soltar);
    this.g.addEventListener('keydown', (ev) => {
      const d = this.paso > 0 ? this.paso : 0.1;
      const m = { ArrowRight: [d, 0], ArrowLeft: [-d, 0], ArrowUp: [0, d], ArrowDown: [0, -d] }[ev.key];
      if (!m) return;
      ev.preventDefault();
      const p = this.pos;
      this._fijar({ x: p.x + m[0], y: p.y + m[1] });
    });
  }
}

// ——— Funciones de dibujo (devuelven cadenas SVG) ———

/**
 * Flecha de `desde` a `hasta` (coordenadas del mundo).
 * o: { color, grosor = 2.6, discontinua, opacidad = 1, punta = 13 }
 */
export const flecha = (l, desde, hasta, { color = 'var(--vec-a)', grosor = 2.6, discontinua = false, opacidad = 1, punta = 13 } = {}) => {
  if (opacidad <= 0.001) return '';
  const a = l.aPx(desde);
  const b = l.aPx(hasta);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const largo = Math.hypot(dx, dy);
  if (largo < 0.5) return '';
  const ux = dx / largo;
  const uy = dy / largo;
  const p = Math.min(punta, largo * 0.55);
  const w = p * 0.42;
  const base = { x: b.x - ux * p, y: b.y - uy * p };
  // La línea termina dentro de la punta para que no asome.
  const fin = { x: b.x - ux * p * 0.7, y: b.y - uy * p * 0.7 };
  const cabeza =
    p > 0
      ? `<path d="M${b.x},${b.y} L${base.x - uy * w},${base.y + ux * w} Q${base.x + ux * p * 0.18},${base.y + uy * p * 0.18} ${base.x + uy * w},${base.y - ux * w} Z" fill="${color}" stroke="${color}" stroke-width="1" stroke-linejoin="round"/>`
      : '';
  return `<g class="flecha" opacity="${opacidad}"><line x1="${a.x}" y1="${a.y}" x2="${p > 0 ? fin.x : b.x}" y2="${p > 0 ? fin.y : b.y}" stroke="${color}" stroke-width="${grosor}" stroke-linecap="round"${discontinua ? ' stroke-dasharray="6 6"' : ''}/>${cabeza}</g>`;
};

/**
 * Etiqueta TeX en un punto del mundo.
 * o: { color, dx, dy, tamano = 17, opacidad = 1, fondo }
 */
export const etiqueta = (l, en, fuente, { color = 'var(--tinta)', dx = 0, dy = 0, tamano = 17, opacidad = 1, fondo = false } = {}) => {
  if (opacidad <= 0.001) return '';
  const p = l.aPx(en);
  const W = 220;
  const H = 44;
  return `<foreignObject class="et" x="${p.x + dx - W / 2}" y="${p.y + dy - H / 2}" width="${W}" height="${H}" opacity="${opacidad}"><div xmlns="http://www.w3.org/1999/xhtml" class="caja-et" style="color:${color};font-size:${tamano}px"><span class="${fondo ? 'fondo' : ''}">${tex(fuente)}</span></div></foreignObject>`;
};

/** Polígono o polilínea. o: { relleno, borde, grosor = 1.5, opacidad = 1, cerrado = true, discontinuo } */
export const poligono = (l, puntos, { relleno = 'none', borde = 'none', grosor = 1.5, opacidad = 1, cerrado = true, discontinuo = false } = {}) => {
  const d =
    puntos
      .map((p, i) => {
        const q = l.aPx(p);
        return `${i === 0 ? 'M' : 'L'}${q.x.toFixed(2)},${q.y.toFixed(2)}`;
      })
      .join(' ') + (cerrado ? ' Z' : '');
  return `<path d="${d}" fill="${relleno}" stroke="${borde}" stroke-width="${grosor}" stroke-linejoin="round" stroke-linecap="round"${discontinuo ? ' stroke-dasharray="5 5"' : ''} opacity="${opacidad}"/>`;
};

/** Punto. o: { radio = 5, color, anillo = true } */
export const punto = (l, en, { radio = 5, color = 'var(--tinta)', anillo = true } = {}) => {
  const p = l.aPx(en);
  return `<circle cx="${p.x}" cy="${p.y}" r="${radio}" fill="${color}"${anillo ? ' stroke="var(--fondo-elevado)" stroke-width="2.5"' : ''}/>`;
};

/**
 * Arco de ángulo en el plano (grados desde +x, antihorario), radio en px.
 * o: { radio = 34, color, sentido (puntita final), relleno }
 */
export const arco = (l, centro, desde, hasta, { radio = 34, color = 'var(--ocre)', sentido = false, relleno = false } = {}) => {
  const c = l.aPx(centro);
  const pt = (g) => ({ x: c.x + radio * Math.cos(g * RAD), y: c.y - radio * Math.sin(g * RAD) });
  const a = pt(desde);
  const b = pt(hasta);
  const barrido = hasta - desde;
  const grande = Math.abs(barrido) > 180 ? 1 : 0;
  const dir = barrido > 0 ? 0 : 1;
  let s = '';
  if (relleno) s += `<path d="M${c.x},${c.y} L${a.x},${a.y} A${radio},${radio} 0 ${grande} ${dir} ${b.x},${b.y} Z" fill="${color}" opacity="0.1"/>`;
  s += `<path d="M${a.x},${a.y} A${radio},${radio} 0 ${grande} ${dir} ${b.x},${b.y}" fill="none" stroke="${color}" stroke-width="1.6"/>`;
  if (sentido && Math.abs(barrido) > 8) {
    const t = hasta * RAD;
    const sg = Math.sign(barrido);
    const tx = -Math.sin(t) * sg; // tangente en pantalla
    const ty = -Math.cos(t) * sg;
    const nx = Math.cos(t);
    const ny = -Math.sin(t);
    const k = 7;
    s += `<path d="M${b.x + tx * 2},${b.y + ty * 2} L${b.x - tx * k + nx * k * 0.55},${b.y - ty * k + ny * k * 0.55} L${b.x - tx * k - nx * k * 0.55},${b.y - ty * k - ny * k * 0.55} Z" fill="${color}"/>`;
  }
  return s;
};
