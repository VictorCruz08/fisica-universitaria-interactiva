/** ¿El usuario pidió reducir el movimiento? (falso fuera del navegador) */
export const reducirMovimiento = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Curvas tipo Apple. */
export const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const lineal = (t: number): number => t;

type Curva = (t: number) => number;

/**
 * Anima de 0 a 1 durante `ms`. Devuelve una función para cancelar.
 * Con movimiento reducido salta directamente al final.
 */
export const animar = (ms: number, cadaCuadro: (t: number) => void, curva: Curva = easeInOut): (() => void) => {
  if (reducirMovimiento() || ms <= 0) {
    cadaCuadro(1);
    return () => {};
  }
  let id = 0;
  const inicio = performance.now();
  const paso = (ahora: number) => {
    const t = Math.min(1, (ahora - inicio) / ms);
    cadaCuadro(curva(t));
    if (t < 1) id = requestAnimationFrame(paso);
  };
  id = requestAnimationFrame(paso);
  return () => cancelAnimationFrame(id);
};

type Animable = number | Record<string, number>;

const mezclar = <T extends Animable>(a: T, b: T, t: number): T => {
  if (typeof a === 'number' && typeof b === 'number') return (a + (b - a) * t) as T;
  const r: Record<string, number> = {};
  const A = a as Record<string, number>;
  const B = b as Record<string, number>;
  for (const k of Object.keys(B)) r[k] = A[k] + (B[k] - A[k]) * t;
  return r as T;
};

/**
 * Valor animable (número o {x, y, …}). `ir()` devuelve una promesa que se
 * resuelve al terminar; una nueva llamada interrumpe la anterior desde donde iba.
 */
export class Tween<T extends Animable> {
  actual: T;
  alCambiar: (v: T) => void;
  curva: Curva;
  private cancelar: (() => void) | null = null;
  private resolver: (() => void) | null = null;

  constructor(valor: T, { alCambiar = () => {}, curva = easeInOut }: { alCambiar?: (v: T) => void; curva?: Curva } = {}) {
    this.actual = valor;
    this.alCambiar = alCambiar;
    this.curva = curva;
  }

  ir(destino: T, { duracion = 600, retraso = 0, curva = this.curva }: { duracion?: number; retraso?: number; curva?: Curva } = {}): Promise<void> {
    this.cancelar?.();
    this.resolver?.();
    const desde = this.actual;
    const ms = reducirMovimiento() ? 0 : duracion;
    return new Promise((resolver) => {
      this.resolver = resolver;
      const arrancar = () => {
        this.cancelar = animar(
          ms,
          (t) => {
            this.actual = mezclar(desde, destino, t);
            this.alCambiar(this.actual);
            if (t === 1) {
              this.resolver = null;
              resolver();
            }
          },
          curva,
        );
      };
      if (retraso > 0 && ms > 0) {
        const id = setTimeout(arrancar, retraso);
        this.cancelar = () => clearTimeout(id);
      } else arrancar();
    });
  }

  /** Salta sin animar. */
  fijar(valor: T): void {
    this.cancelar?.();
    this.resolver?.();
    this.resolver = null;
    this.actual = valor;
    this.alCambiar(valor);
  }
}

export const esperar = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, reducirMovimiento() ? 0 : ms));
