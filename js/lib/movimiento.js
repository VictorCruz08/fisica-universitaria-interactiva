/** ¿El usuario pidió reducir el movimiento? */
export const reducirMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Curvas tipo Apple. */
export const easeOut = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const lineal = (t) => t;

/**
 * Anima de 0 a 1 durante `ms`. Devuelve una función para cancelar.
 * Con movimiento reducido salta directamente al final.
 */
export const animar = (ms, cadaCuadro, curva = easeInOut) => {
  if (reducirMovimiento() || ms <= 0) {
    cadaCuadro(1);
    return () => {};
  }
  let id = 0;
  const inicio = performance.now();
  const paso = (ahora) => {
    const t = Math.min(1, (ahora - inicio) / ms);
    cadaCuadro(curva(t));
    if (t < 1) id = requestAnimationFrame(paso);
  };
  id = requestAnimationFrame(paso);
  return () => cancelAnimationFrame(id);
};

const mezclar = (a, b, t) => {
  if (typeof a === 'number') return a + (b - a) * t;
  const r = {};
  for (const k of Object.keys(b)) r[k] = a[k] + (b[k] - a[k]) * t;
  return r;
};

/**
 * Valor animable (número o {x, y, …}). `ir()` devuelve una promesa que se
 * resuelve al terminar; una nueva llamada interrumpe la anterior desde donde iba.
 */
export class Tween {
  constructor(valor, { alCambiar = () => {}, curva = easeInOut } = {}) {
    this.actual = valor;
    this.alCambiar = alCambiar;
    this.curva = curva;
    this._cancelar = null;
    this._resolver = null;
  }

  ir(destino, { duracion = 600, retraso = 0, curva = this.curva } = {}) {
    this._cancelar?.();
    this._resolver?.();
    const desde = this.actual;
    const ms = reducirMovimiento() ? 0 : duracion;
    return new Promise((resolver) => {
      this._resolver = resolver;
      const arrancar = () => {
        this._cancelar = animar(
          ms,
          (t) => {
            this.actual = mezclar(desde, destino, t);
            this.alCambiar(this.actual);
            if (t === 1) {
              this._resolver = null;
              resolver();
            }
          },
          curva,
        );
      };
      if (retraso > 0 && ms > 0) {
        const id = setTimeout(arrancar, retraso);
        this._cancelar = () => clearTimeout(id);
      } else arrancar();
    });
  }

  /** Salta sin animar. */
  fijar(valor) {
    this._cancelar?.();
    this._resolver?.();
    this._resolver = null;
    this.actual = valor;
    this.alCambiar(valor);
  }
}

export const esperar = (ms) => new Promise((r) => setTimeout(r, reducirMovimiento() ? 0 : ms));
