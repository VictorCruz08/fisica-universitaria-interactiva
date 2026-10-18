/** Antepone la base del sitio (GitHub Pages sirve en /fisica-universitaria-interactiva/). */
export const url = (ruta: string): string => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${ruta.replace(/^\//, '')}`;
};
