import { RAD } from './vec.js';

/**
 * Cámara ortográfica para escenas 3D en SVG.
 * Convención física: x e y horizontales, z hacia arriba (sistema derecho).
 * Con azimut ≈ −35° el eje x apunta hacia el lector (abajo a la izquierda),
 * el eje y hacia la derecha y el eje z hacia arriba, como en los libros.
 *
 * @typedef {object} Camara
 * @property {number} azimut     giro alrededor de z, en grados
 * @property {number} elevacion  inclinación de la mirada desde el plano xy, en grados
 * @property {number} escala     píxeles por unidad
 * @property {number} cx         dónde cae el origen en pantalla
 * @property {number} cy
 */

/** @param {{x:number,y:number,z:number}} p  @param {Camara} c */
export const proyectar = (p, c) => {
  const a = c.azimut * RAD;
  const e = c.elevacion * RAD;
  const x1 = p.x * Math.cos(a) - p.y * Math.sin(a);
  const y1 = p.x * Math.sin(a) + p.y * Math.cos(a);
  const u = y1;
  const v = p.z * Math.cos(e) - x1 * Math.sin(e);
  const prof = x1 * Math.cos(e) + p.z * Math.sin(e);
  return { x: c.cx + u * c.escala, y: c.cy - v * c.escala, prof };
};
