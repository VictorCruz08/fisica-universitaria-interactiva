import type { ComponentType } from 'react';

/** Metadatos que cada sección exporta desde su MDX: `export const meta = { … }`. */
export type MetaSeccion = {
  titulo: string;
  /** Párrafo introductorio (también es la descripción de la página). */
  resumen: string;
  /** Página del libro impreso donde empieza la sección (12.ª ed.). */
  paginaLibro: number;
  /** Minutos estimados de estudio. */
  minutos: number;
};

type ModuloSeccion = { default: ComponentType; meta: MetaSeccion };

/**
 * Una entrada por sección publicada. La clave coincide con el `slug` de
 * lib/indice.ts y con la ruta del archivo: contenido/1/7.mdx → /1/7/.
 */
export const secciones: Record<string, () => Promise<ModuloSeccion>> = {
  '1/7': () => import('./1/7.mdx'),
  '1/8': () => import('./1/8.mdx'),
  '1/9': () => import('./1/9.mdx'),
  '1/10': () => import('./1/10.mdx'),
};
