/**
 * Álgebra vectorial mínima para los interactivos.
 * Todos los ángulos se manejan en grados en la API pública (como en el libro)
 * y en radianes sólo internamente.
 */

export type Vec2 = { x: number; y: number };
export type Vec3 = { x: number; y: number; z: number };

export const RAD = Math.PI / 180;
export const DEG = 180 / Math.PI;

export const v2 = (x: number, y: number): Vec2 => ({ x, y });
export const v3 = (x: number, y: number, z: number): Vec3 => ({ x, y, z });

export const suma = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });
export const resta = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y });
export const escala = (c: number, a: Vec2): Vec2 => ({ x: c * a.x, y: c * a.y });
export const magnitud = (a: Vec2): number => Math.hypot(a.x, a.y);
export const punto = (a: Vec2, b: Vec2): number => a.x * b.x + a.y * b.y;

/** Componentes a partir de magnitud y ángulo θ medido desde +x hacia +y (ec. 1.6). */
export const desdePolar = (A: number, thetaGrados: number): Vec2 => ({
  x: A * Math.cos(thetaGrados * RAD),
  y: A * Math.sin(thetaGrados * RAD),
});

/**
 * Dirección del vector en grados, en [0, 360). Usa atan2, que ya elige el
 * cuadrante correcto (a diferencia de arctan(Ay/Ax), ver ec. 1.8).
 */
export const angulo = (a: Vec2): number => {
  const t = Math.atan2(a.y, a.x) * DEG;
  return t < 0 ? t + 360 : t;
};

/** Lo que devuelve una calculadora de bolsillo: arctan(Ay/Ax) en (−90°, 90°). */
export const arctanCalculadora = (a: Vec2): number => Math.atan(a.y / a.x) * DEG;

/** Cuadrante 1–4 (0 si el vector está sobre un eje). */
export const cuadrante = (a: Vec2): 0 | 1 | 2 | 3 | 4 => {
  if (a.x === 0 || a.y === 0) return 0;
  if (a.x > 0) return a.y > 0 ? 1 : 4;
  return a.y > 0 ? 2 : 3;
};

/** Ángulo entre dos vectores en grados, en [0, 180]. */
export const anguloEntre = (a: Vec2, b: Vec2): number => {
  const d = magnitud(a) * magnitud(b);
  if (d === 0) return 0;
  return Math.acos(Math.max(-1, Math.min(1, punto(a, b) / d))) * DEG;
};

export const rotar = (a: Vec2, grados: number): Vec2 => {
  const c = Math.cos(grados * RAD);
  const s = Math.sin(grados * RAD);
  return { x: a.x * c - a.y * s, y: a.x * s + a.y * c };
};

// ——— 3D ———

export const suma3 = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
export const resta3 = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
export const escala3 = (c: number, a: Vec3): Vec3 => ({ x: c * a.x, y: c * a.y, z: c * a.z });
export const magnitud3 = (a: Vec3): number => Math.hypot(a.x, a.y, a.z);

/** Producto escalar por componentes (ec. 1.21). */
export const punto3 = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z;

/** Producto vectorial por componentes (ec. 1.27). */
export const cruz = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});

export const anguloEntre3 = (a: Vec3, b: Vec3): number => {
  const d = magnitud3(a) * magnitud3(b);
  if (d === 0) return 0;
  return Math.acos(Math.max(-1, Math.min(1, punto3(a, b) / d))) * DEG;
};

export const unitario3 = (a: Vec3): Vec3 => {
  const m = magnitud3(a);
  return m === 0 ? { x: 0, y: 0, z: 0 } : escala3(1 / m, a);
};

// ——— Formato ———

/** Redondea y evita "-0". */
export const fmt = (n: number, dec = 2): string => {
  const r = Number(n.toFixed(dec));
  return (Object.is(r, -0) ? 0 : r).toFixed(dec);
};

/** Entero si lo es; si no, con un decimal. */
export const num = (v: number): string => (Number.isInteger(v) ? String(v) : fmt(v, 1));
