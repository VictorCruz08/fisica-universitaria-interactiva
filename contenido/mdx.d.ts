// Cada sección MDX exporta sus metadatos además del componente por defecto.
declare module '*.mdx' {
  export const meta: import('./registro').MetaSeccion;
}
