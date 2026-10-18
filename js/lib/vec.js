/**
 * Álgebra vectorial mínima para los interactivos.
 * Todos los ángulos se manejan en grados en la API pública (como en el libro)
 * y en radianes sólo internamente.
 *
 * @typedef {{ x: number, y: number }} Vec2
 * @typedef {{ x: number, y: number, z: number }} Vec3
 */

export const RAD = Math.PI / 180;
export const DEG = 180 / Math.PI;

/** @returns {Vec2} */
export const v2 = (x, y) => ({ x, y });
/** @returns {Vec3} */
export const v3 = (x, y, z) => ({ x, y, z });

export const suma = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
export const resta = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
export const escala = (c, a) => ({ x: c * a.x, y: c * a.y });
export const magnitud = (a) => Math.hypot(a.x, a.y);
export const punto = (a, b) => a.x * b.x + a.y * b.y;

/** Componentes a partir de magnitud y ángulo θ medido desde +x hacia +y (ec. 1.6). */
export const desdePolar = (A, thetaGrados) => ({
  x: A * Math.cos(thetaGrados * RAD),
  y: A * Math.sin(thetaGrados * RAD),
});

/**
 * Dirección del vector en grados, en [0, 360). Usa atan2, que ya elige el
 * cuadrante correcto (a diferencia de arctan(Ay/Ax), ver ec. 1.8).
 */
export const angulo = (a) => {
  const t = Math.atan2(a.y, a.x) * DEG;
  return t < 0 ? t + 360 : t;
};

/** Lo que devuelve una calculadora de bolsillo: arctan(Ay/Ax) en (−90°, 90°). */
export const arctanCalculadora = (a) => Math.atan(a.y / a.x) * DEG;

/** Cuadrante 1–4 (0 si el vector está sobre un eje). */
export const cuadrante = (a) => {
  if (a.x === 0 || a.y === 0) return 0;
  if (a.x > 0) return a.y > 0 ? 1 : 4;
  return a.y > 0 ? 2 : 3;
};

/** Ángulo entre dos vectores en grados, en [0, 180]. */
export const anguloEntre = (a, b) => {
  const d = magnitud(a) * magnitud(b);
  if (d === 0) return 0;
  return Math.acos(Math.max(-1, Math.min(1, punto(a, b) / d))) * DEG;
};

export const rotar = (a, grados) => {
  const c = Math.cos(grados * RAD);
  const s = Math.sin(grados * RAD);
  return { x: a.x * c - a.y * s, y: a.x * s + a.y * c };
};

// ——— 3D ———

export const suma3 = (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
export const resta3 = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
export const escala3 = (c, a) => ({ x: c * a.x, y: c * a.y, z: c * a.z });
export const magnitud3 = (a) => Math.hypot(a.x, a.y, a.z);

/** Producto escalar por componentes (ec. 1.21). */
export const punto3 = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;

/** Producto vectorial por componentes (ec. 1.27). */
export const cruz = (a, b) => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});

export const anguloEntre3 = (a, b) => {
  const d = magnitud3(a) * magnitud3(b);
  if (d === 0) return 0;
  return Math.acos(Math.max(-1, Math.min(1, punto3(a, b) / d))) * DEG;
};

export const unitario3 = (a) => {
  const m = magnitud3(a);
  return m === 0 ? { x: 0, y: 0, z: 0 } : escala3(1 / m, a);
};

// ——— Formato ———

/** Redondea y evita "-0". */
export const fmt = (n, dec = 2) => {
  const r = Number(n.toFixed(dec));
  return (Object.is(r, -0) ? 0 : r).toFixed(dec);
};

/** Entero si lo es; si no, con un decimal. */
export const num = (v) => (Number.isInteger(v) ? String(v) : fmt(v, 1));
