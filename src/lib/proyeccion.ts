import { RAD, type Vec2, type Vec3 } from './vec';

/**
 * Cámara ortográfica para escenas 3D en SVG.
 * Convención física: x e y horizontales, z hacia arriba (sistema derecho).
 * Con azimut ≈ −35° el eje x apunta hacia el lector (abajo a la izquierda),
 * el eje y hacia la derecha y el eje z hacia arriba, como en los libros.
 */
export type Camara = {
  /** Giro alrededor de z, en grados. */
  azimut: number;
  /** Inclinación de la mirada desde el plano xy, en grados (0 = de lado, 90 = desde arriba). */
  elevacion: number;
  /** Píxeles por unidad. */
  escala: number;
  /** Centro de la imagen (dónde cae el origen). */
  cx: number;
  cy: number;
};

export type Proyectado = Vec2 & { prof: number };

export const proyectar = (p: Vec3, c: Camara): Proyectado => {
  const a = c.azimut * RAD;
  const e = c.elevacion * RAD;
  const x1 = p.x * Math.cos(a) - p.y * Math.sin(a);
  const y1 = p.x * Math.sin(a) + p.y * Math.cos(a);
  const u = y1;
  const v = p.z * Math.cos(e) - x1 * Math.sin(e);
  const prof = x1 * Math.cos(e) + p.z * Math.sin(e);
  return { x: c.cx + u * c.escala, y: c.cy - v * c.escala, prof };
};
