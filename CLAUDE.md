# Física Universitaria Interactiva

Libro web interactivo de física universitaria, en español. Sigue capítulo a capítulo *Física Universitaria* de Sears, Zemansky, Young y Freedman (12.ª ed., Vol. 1), con el que el autor del repo estudia. Público: estudiantes visuales que quieren entender, no sólo memorizar. Se publica en GitHub Pages: https://victorcruz08.github.io/fisica-universitaria-interactiva/

El trabajo avanza **sección por sección**, a petición del usuario. No adelantes capítulos que no se pidieron.

## Derechos de autor (regla no negociable)

El repo es público y el libro tiene copyright de Pearson. Por lo tanto:

- **Todo el texto es original.** Se sigue el orden de los temas, el nivel, la notación y la pedagogía del libro, pero se redacta desde cero. Nada de copiar ni de "parafrasear línea por línea" párrafos del libro.
- **Ejemplos, números, preguntas y figuras son nuevos.** No reproduzcas ejemplos resueltos, ejercicios, problemas ni preguntas "Evalúe su comprensión" del libro cambiando sólo los números.
- Sí se permite: títulos de capítulos y secciones (índice), la numeración de ecuaciones (1.1, 1.2, …) para que el estudiante cruce con su libro, las fórmulas físicas (son conocimiento común) y la atribución "basado en".
- Sin logos, portada ni marca de Pearson. El sitio dice que no está afiliado.
- `FisicaUniversitaria.pdf` y `.referencia/` están en `.gitignore`: **nunca** se suben.

## Comandos

```bash
npm install          # dependencias
npm run dev          # servidor local: http://localhost:4321/fisica-universitaria-interactiva/
npm run build        # sitio estático en dist/
npm run preview      # sirve dist/
npm run test         # vitest (src/**/*.test.ts)
npm run check        # astro check (tipos de .astro, .svelte y .ts)
python -I scripts/extraer_texto.py 11 27   # texto de las págs. 11–27 del libro → .referencia/
```

No hay `pdftoppm` en esta máquina: el PDF se lee con `scripts/extraer_texto.py` (pypdf). Página impresa + 22 = índice de página del PDF.

## Stack

Astro 5 (estático) + MDX + Svelte 5 (islas, runes) + KaTeX (remark-math/rehype-katex) + Vitest. Sin librerías de animación: `Tween`/`Spring` de `svelte/motion`, transiciones de Svelte y CSS. 3D con proyección propia en SVG (`src/lib/proyeccion.ts`), sin Three.js. Deploy con GitHub Actions (`.github/workflows/deploy.yml`) a Pages; `base` = `/fisica-universitaria-interactiva`, así que **todo enlace interno pasa por `url()`** de `src/lib/url.ts`.

## Mapa del código

```
src/content/secciones/NN/C-SS-slug.mdx   una sección del libro (frontmatter: capitulo, seccion, titulo, resumen, paginaLibro, minutos)
src/data/indice.ts                        índice completo del Vol. 1; una sección se publica al darle `slug: 'cap/sec'`
src/data/glosario.ts                      términos (alimenta <Termino> y /glosario)
src/pages/[cap]/[seccion].astro           ruta de cada sección (anterior/siguiente salen de indice.ts)
src/layouts/                              BaseLayout (barra, tema, pie) y SeccionLayout (cabecera, TOC, progreso)
src/components/libro/                     cajas del libro en Astro: Ecuacion, Termino, Figura, Ejemplo, Cuidado, Estrategia, Evalua, Resumen
src/components/evaluacion/                OpcionMultiple, Reflexion, CalculoMental (Svelte)
src/components/interactivos/nucleo/       Plano (2D), Escena3D, Flecha, Etiqueta (TeX en SVG), Manija, Arco, Poligono, Punto
src/components/interactivos/cN/           interactivos del capítulo N
src/lib/                                  vec.ts (álgebra vectorial + tests), proyeccion.ts, katex.ts (tex, conMath), movimiento.ts, progreso.ts, url.ts
src/styles/                               tokens.css (paleta y escala) y global.css
docs/pedagogia.md · docs/diseno.md        guías detalladas: léelas antes de escribir una sección nueva
```

## Receta: añadir una sección

1. **Leer** la sección en el libro con `scripts/extraer_texto.py` (texto sólo para consulta). Anota el orden de ideas, las ecuaciones numeradas y qué conceptos previos supone.
2. **Esquema**: mismo orden y nivel que el libro. Decide qué idea merece un interactivo (ver `docs/pedagogia.md`) y dónde van las preguntas.
3. **MDX** en `src/content/secciones/NN/`. Usa los componentes de `libro/`. Ecuaciones numeradas con `<Ecuacion tex="…" n="1.6" />`; matemáticas en el texto con `$…$`; bloques con `$$` en líneas propias (no en una sola línea: se renderiza en línea). Dentro de `<Fragment slot="…">` deja líneas en blanco alrededor del contenido.
4. **Interactivos** en `src/components/interactivos/cN/`, construidos con el núcleo (`Plano`/`Escena3D` + `Flecha`, `Etiqueta`, `Manija`…). Hidrátalos con `client:visible`.
5. **Evaluación**: `OpcionMultiple` (con explicación en *cada* opción), `CalculoMental`, `Reflexion`, y una `<Evalua seccion="x.y">` al final.
6. **Registrar**: `slug` en `src/data/indice.ts` y términos nuevos en `src/data/glosario.ts` (un id desconocido en `<Termino>` rompe el build, a propósito).
7. **Verificar**: `npm run test`, `npm run check`, `npm run build`, y revisar la página en el navegador (claro/oscuro, ancho de 390 px, arrastrar cada manija, responder cada pregunta).

## Reglas pedagógicas (resumen; detalle en docs/pedagogia.md)

- Respeta el orden, el nivel y la notación del libro (flecha sobre vectores, θ desde +x, IDENTIFICAR · PLANTEAR · EJECUTAR · EVALUAR en los ejemplos).
- Todo término que un estudiante de primer semestre podría no conocer se envuelve en `<Termino id="…">` con una definición breve en el glosario.
- Ejemplos cotidianos **sólo** cuando encajan de forma natural con el concepto. Si hay que forzarlo, mejor un ejemplo abstracto bien elegido.
- Cada interactivo explica **una** idea. Su pie de figura dice qué hacer y qué observar.
- Preguntas con criterio: opción múltiple para conceptos con distractores típicos; cálculo mental para intuición numérica (ternas pitagóricas, ángulos notables); reflexión para ideas abiertas. Cada distractor explica *por qué* está mal.

## Reglas de diseño (resumen; detalle en docs/diseno.md)

- Usa siempre los tokens de `src/styles/tokens.css` (paleta extraída del libro). Nada de colores sueltos.
- Convención fija de vectores: **A azul, B magenta, resultante verde, cuarto vector naranja**; componentes x azul, y magenta, z verde. Ocre = ángulos, números de sección y acentos editoriales; rojo = Cuidado/error.
- Animaciones estilo Apple: sobrias, 300–900 ms, curvas `--ease-out`/`cubicInOut`, una idea por movimiento. Respeta `prefers-reduced-motion` (usa `reducirMovimiento()` o los tokens `--dur-*`).
- Matemáticas siempre en KaTeX (también dentro de los SVG, con `<Etiqueta t="…">`).
- Accesible: manijas con teclado (flechas), `aria-label` en lienzos, contraste suficiente en claro y oscuro.
- Móvil: sin scroll horizontal a 390 px; los lienzos miden su ancho real (no escalan el texto).
- No pongas `max-width` a todos los `svg`: rompe las flechas de `\vec` de KaTeX.

## Convenciones de código

- Español en contenido, nombres de componentes, variables y comentarios.
- TypeScript estricto. Svelte 5 con runes (`$state`, `$derived`, `$props`).
- Lógica matemática en `src/lib/vec.ts` con pruebas en `vec.test.ts`; añade pruebas cuando un interactivo nuevo calcule algo nuevo.
- Commits en español, descriptivos.
