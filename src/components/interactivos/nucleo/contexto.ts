import { getContext, setContext } from 'svelte';
import type { Vec2, Vec3 } from '../../../lib/vec';

/**
 * Contexto que comparten Plano (2D) y Escena3D (3D) con sus hijos
 * (Flecha, Etiqueta, Manija, Arco…). Los hijos dibujan en coordenadas
 * del mundo y el lienzo las convierte a píxeles.
 */
export type Lienzo = {
  /** Mundo → píxeles. En 2D se ignora z. */
  aPx: (p: Vec2 | Vec3) => Vec2;
  /** Píxeles por unidad del mundo. */
  readonly escala: number;
  /** Puntero → mundo (sólo 2D). */
  aMundo: (ev: PointerEvent) => Vec2;
};

const CLAVE = Symbol('lienzo');

export const darLienzo = (l: Lienzo): Lienzo => setContext(CLAVE, l);
export const usarLienzo = (): Lienzo => {
  const l = getContext<Lienzo>(CLAVE);
  if (!l) throw new Error('Este componente debe ir dentro de <Plano> o <Escena3D>.');
  return l;
};
