import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const secciones = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/secciones' }),
  schema: z.object({
    capitulo: z.number(),
    seccion: z.number(),
    titulo: z.string(),
    resumen: z.string(),
    /** Página del libro impreso donde empieza la sección (12.ª ed.). */
    paginaLibro: z.number(),
    /** Minutos estimados de estudio. */
    minutos: z.number().default(25),
  }),
});

export const collections = { secciones };
