/**
 * Registro de interactivos. Cada entrada se carga sólo cuando hace falta
 * (división de código por interactivo). Para añadir uno nuevo: crea
 * interactivos/<nombre>.js con `export default function montar(el)` y regístralo aquí.
 */
type Modulo = { default: (el: HTMLElement) => void };

export const interactivos = {
  'clasificador-escalar-vector': () => import('./clasificador-escalar-vector'),
  'trayectoria-desplazamiento': () => import('./trayectoria-desplazamiento'),
  'igualdad-negativo': () => import('./igualdad-negativo'),
  'suma-vectores': () => import('./suma-vectores'),
  'suma-varios-vectores': () => import('./suma-varios-vectores'),
  'resta-vectores': () => import('./resta-vectores'),
  'escalar-por-vector': () => import('./escalar-por-vector'),
  componentes: () => import('./componentes'),
  'ejes-inclinados': () => import('./ejes-inclinados'),
  'ambiguedad-arctan': () => import('./ambiguedad-arctan'),
  'suma-componentes': () => import('./suma-componentes'),
  'caja-diagonal-3d': () => import('./caja-diagonal-3d'),
  'vectores-unitarios': () => import('./vectores-unitarios'),
  'producto-escalar': () => import('./producto-escalar'),
  'tabla-unitarios': () => import('./tabla-unitarios'),
  'angulo-entre-vectores': () => import('./angulo-entre-vectores'),
  'producto-cruz-3d': () => import('./producto-cruz-3d'),
  'seno-coseno': () => import('./seno-coseno'),
  'ciclo-unitarios': () => import('./ciclo-unitarios'),
  'sistema-derecho': () => import('./sistema-derecho'),
} satisfies Record<string, () => Promise<Modulo>>;

export type NombreInteractivo = keyof typeof interactivos;
