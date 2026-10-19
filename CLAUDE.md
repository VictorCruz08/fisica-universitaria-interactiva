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

## Stack

- **Next.js 16** (App Router, Turbopack) con `output: 'export'`: el sitio se genera como HTML estático en `out/` y se publica en GitHub Pages bajo `basePath: '/fisica-universitaria-interactiva'`. Usa siempre `next/link` (añade el basePath solo); nada de `<a href="/…">` internos.
- **React 19 + TypeScript** estricto.
- **MDX** (`@next/mdx`) para el contenido, con `remark-math` + `rehype-katex` (fórmulas renderizadas al compilar) y `rehype-slug` (ids en los títulos). Con Turbopack los plugins se declaran por nombre en `next.config.ts`.
- **KaTeX** también en el cliente (`lib/katex.ts`) para valores que cambian en vivo.
- Fuentes con `next/font/google` (Inter y Source Serif 4), expuestas como `--font-ui` y `--font-serif`.
- Pruebas con **Vitest**. Sin ESLint (Next 16 retiró `next lint`); el control de tipos es `npm run check`.
- Pensado para crecer hacia funciones de aplicación (cuentas, progreso en la nube): el progreso del estudiante pasa todo por `lib/progreso.ts`. Ojo: `output: 'export'` no admite rutas de API ni middleware; si algún día hacen falta, habrá que publicar en otro sitio (p. ej. Vercel) y quitar `output: 'export'`.

## Comandos

```bash
npm install
npm run dev      # http://localhost:3000/fisica-universitaria-interactiva/
npm run build    # sitio estático en out/
npm run check    # tsc --noEmit
npm test         # vitest
python -I scripts/extraer_texto.py 11 27   # texto de las págs. 11–27 del libro → .referencia/ (requiere pypdf)
```

No hay `pdftoppm` en esta máquina: el PDF se lee con `scripts/extraer_texto.py`. Página impresa + 22 = índice de página del PDF.

## Mapa del código

```
app/layout.tsx                        raíz: fuentes, estilos, script de tema, pie, animación de aparición
app/page.tsx                          portada general (sin barra superior): partes del libro
app/(libro)/indice/                   índice: partes → tarjetas de capítulo
app/(libro)/[capitulo]/               portada de cada capítulo con la lista de sus secciones
app/(libro)/layout.tsx                barra superior para el resto de páginas
app/(libro)/[capitulo]/[seccion]/     página de cada sección (generateStaticParams desde lib/indice.ts)
app/(libro)/glosario|como-usar        páginas generales
app/estilos/                          tokens.css (paleta), base.css, libro.css (cajas, layout), interactivos.css,
                                      vidrio.css (glassmorphism + fondo ambiental), navegacion.css (migas, índice, capítulos)
contenido/1/7.mdx …                   una sección por archivo; exporta `meta` (titulo, resumen, paginaLibro, minutos)
contenido/registro.ts                 mapa slug → import del MDX
mdx-components.tsx                    componentes disponibles en todos los MDX sin importarlos
components/libro/                     Ecuacion, Termino, Figura, Interactivo, Cajas (Cuidado, Estrategia, Ipee, Ejemplo, Enunciado, Solucion, Paso, Evalua, Resumen)
components/evaluacion/                OpcionMultiple, CalculoMental, Reflexion (cliente)
components/sitio/                     Barra, BotonTema, Pie, Aparece, GuiaLectura (progreso + índice lateral), Migas
interactivos/registro.ts              mapa nombre → import dinámico de cada interactivo
interactivos/<nombre>.js              cada interactivo: `export default function montar(el)` (código imperativo sobre SVG)
interactivos/nucleo/lienzo.js         Plano (2D), Escena3D, Manija y funciones de dibujo (flecha, etiqueta, poligono, arco, punto)
lib/                                  vec.ts, proyeccion.ts, katex.ts, movimiento.ts (Tween), progreso.ts, dom.ts, indice.ts, glosario.ts
tests/                                vitest
```

Los interactivos son módulos imperativos (no componentes React) a propósito: dibujan con SVG a 60 fps durante los arrastres y animaciones sin pasar por el ciclo de render de React. `components/libro/Interactivo.tsx` los monta cuando están por entrar en pantalla y los desmonta al salir de la página. Un interactivo nuevo puede ser un módulo así o, si es más de interfaz que de dibujo, un componente React normal.

## Receta: añadir una sección

1. **Leer** la sección en el libro con `scripts/extraer_texto.py` (texto sólo para consulta). Anota el orden de ideas, las ecuaciones numeradas y qué conceptos previos supone.
2. **Esquema**: mismo orden y nivel que el libro. Decide qué idea merece un interactivo (ver `docs/pedagogia.md`) y dónde van las preguntas.
3. **MDX** en `contenido/<cap>/<sec>.mdx`, empezando por `export const meta = { titulo, resumen, paginaLibro, minutos };` seguido de una línea en blanco. Componentes disponibles (sin importar):

   ```mdx
   <Ecuacion tex="A_x = A\cos\theta" n="1.6" nota="θ desde +x" destacada />
   <Termino id="vector">cantidad vectorial</Termino>
   <Figura etiqueta="Interactivo 1.7d" pie="Qué hacer y qué observar." interactivo="suma-vectores" />
   <Cuidado titulo="…">texto</Cuidado>
   <Estrategia numero="1.3" titulo="…"><Ipee>Plantear</Ipee> …</Estrategia>
   <Ejemplo numero="1.7a" titulo="…">
     <Enunciado>…</Enunciado>
     <Solucion>
       <Paso etapa="Identificar">…</Paso>  (Plantear, Ejecutar, Evaluar)
     </Solucion>
   </Ejemplo>
   <OpcionMultiple id="1.7-x" pregunta="…" opciones={[{ texto: '…', correcta: true, explicacion: '…' }]} cierre="…" multiple />
   <CalculoMental id="…" retos={[{ pregunta: '…', respuesta: 10, unidad: 'm', pista: '…', truco: '…' }]} />
   <Reflexion pregunta="…" pista="…" respuesta="…" />
   <Evalua seccion="1.7"> …una o dos OpcionMultiple… </Evalua>
   <Resumen tarjetas={[{ titulo, texto, formula, n }]} />
   ```

   Matemáticas: `$…$` en línea y bloques `$$` en líneas propias. Dentro de componentes deja líneas en blanco alrededor del contenido Markdown. En atributos `"…"` el TeX va tal cual (`$\vec A$`); dentro de `{[…]}` son cadenas de JS y las barras se duplican (`'$\\vec A$'`).
4. **Registrar**: `slug` en `lib/indice.ts`, una línea en `contenido/registro.ts` y los términos nuevos en `lib/glosario.ts` (un id desconocido en `<Termino>` rompe el build, a propósito).
5. **Interactivos** nuevos en `interactivos/<nombre>.js` y su línea en `interactivos/registro.ts`. Se construyen con `interactivos/nucleo/lienzo.js`: crea un `Plano` o `Escena3D`, escribe `dibujar()` que llame a `plano.pintar([...])`, regístrala con `plano.alRedibujar(dibujar)` y añade manijas con `plano.manija({...})`. Estilos propios en `app/estilos/interactivos.css` con prefijo `.i-<nombre>`.
6. **Verificar**: `npm test`, `npm run check`, `npm run build` y revisar en el navegador (claro/oscuro, 390 px de ancho, arrastrar cada manija, responder cada pregunta, consola sin errores).

## Reglas pedagógicas (resumen; detalle en docs/pedagogia.md)

- Respeta el orden, el nivel y la notación del libro (flecha sobre vectores, θ desde +x, IDENTIFICAR · PLANTEAR · EJECUTAR · EVALUAR en los ejemplos).
- Todo término que un estudiante de primer semestre podría no conocer va en `<Termino>` con una definición breve en el glosario.
- Ejemplos cotidianos **sólo** cuando encajan de forma natural con el concepto. Si hay que forzarlo, mejor un ejemplo abstracto bien elegido.
- Cada interactivo explica **una** idea. Su pie de figura dice qué hacer y qué observar.
- Preguntas con criterio: opción múltiple para conceptos con distractores típicos; cálculo mental para intuición numérica (ternas pitagóricas, ángulos notables); reflexión para ideas abiertas. Cada distractor explica *por qué* está mal.

## Reglas de diseño (resumen; detalle en docs/diseno.md)

- Usa siempre los tokens de `app/estilos/tokens.css` (paleta extraída del libro). Nada de colores sueltos.
- Jerarquía de navegación: portada → índice → capítulo → sección, con migas (`<Migas>`) en cada nivel.
- Tarjetas de vidrio (`app/estilos/vidrio.css`): fondo translúcido, desenfoque, filo claro y luz interior sobre el fondo ambiental del `<body>`. Para una tarjeta nueva añade su clase a la lista de `vidrio.css` o usa `.vidrio`. Respeta `prefers-reduced-transparency`.
- Retícula única: en las secciones, texto, figuras, ejemplos y cajas comparten el ancho de la columna (`--ancho-texto`); el índice lateral vive en su propia columna y nunca se superpone. Nada de márgenes negativos para "sacar" figuras de la columna.
- Respiración: dentro de las tarjetas, 1.5 rem de padding lateral en escritorio y ~1.1 rem en móvil; ningún texto ni dibujo toca el borde.
- Las definiciones del glosario (`<Termino>`) se pintan en un portal sobre `<body>`: el `backdrop-filter` del vidrio crea un bloque contenedor y recortaría un `position: fixed` dentro de la tarjeta.
- Convención fija de vectores: **A azul, B magenta, resultante verde, cuarto vector naranja**; componentes x azul, y magenta, z verde. Ocre = ángulos, números de sección y acentos editoriales; rojo = Cuidado/error.
- Animaciones estilo Apple: sobrias, 300–900 ms, curvas `easeOut`/`easeInOut`, una idea por movimiento. Respeta `prefers-reduced-motion` (`Tween` y `animar()` ya lo hacen; en CSS usa los tokens `--dur-*`).
- Matemáticas siempre en KaTeX (también dentro de los SVG, con `etiqueta(lienzo, punto, 'TeX')`).
- Accesible: manijas con teclado (flechas), `aria-label` en lienzos, contraste suficiente en claro y oscuro.
- Móvil: sin scroll horizontal a 390 px; los lienzos miden su ancho real (no escalan el texto).
- No pongas `max-width` a todos los `svg`: rompe las flechas de `\vec` de KaTeX.

## Convenciones de código

- Español en contenido, nombres de componentes, variables y comentarios.
- Componentes de servidor por defecto; `'use client'` sólo donde hay estado o eventos.
- Lógica matemática en `lib/vec.ts` con pruebas en `tests/vec.test.ts`; añade pruebas cuando un interactivo nuevo calcule algo nuevo.
- Commits en español, descriptivos.
