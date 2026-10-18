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

## Tecnología: HTML, CSS y JavaScript puros

Sin frameworks, sin compilación y sin dependencias de npm. Cada página es un `.html` que se sirve tal cual.

- **Matemáticas:** KaTeX copiado en `vendor/katex/` (se carga como módulo ES). En el HTML se escribe `$…$` en línea y `$$…$$` en bloque; `js/sitio.js` las renderiza al cargar.
- **Fuentes:** Inter y Source Serif 4 en `vendor/fuentes/` (archivos locales, `@font-face` en `css/base.css`).
- **JavaScript:** módulos ES nativos (`<script type="module">`). Animaciones con `requestAnimationFrame` (`js/lib/movimiento.js`); 3D con proyección propia en SVG (`js/lib/proyeccion.js`).
- **Rutas relativas** en todo el HTML (`../../css/…`): así funciona igual en local y bajo `/fisica-universitaria-interactiva/` en Pages. En JS, los enlaces se construyen con `url()` de `js/sitio.js`, que deduce la raíz de su propia ubicación.
- **Publicación:** GitHub Actions (`.github/workflows/deploy.yml`) corre las pruebas y sube el sitio a Pages. No hay paso de compilación.

## Comandos

```bash
npm run dev        # servidor local sin dependencias: http://localhost:4321/fisica-universitaria-interactiva/
npm test           # pruebas de js/lib/vec.js con node:test
python -I scripts/extraer_texto.py 11 27   # texto de las págs. 11–27 del libro → .referencia/ (requiere pypdf)
```

`npm run dev` sólo ejecuta `node servidor.js`. Los módulos ES necesitan un servidor: abrir el `.html` con doble clic (file://) no funciona.

No hay `pdftoppm` en esta máquina: el PDF se lee con `scripts/extraer_texto.py`. Página impresa + 22 = índice de página del PDF.

## Mapa del código

```
index.html, indice.html, glosario.html, como-usar.html   páginas generales
1/7/index.html … 1/10/index.html          una sección por carpeta: <capítulo>/<sección>/index.html
css/tokens.css                             paleta y escala (claro y oscuro)
css/base.css                               fuentes, tipografía, botones
css/libro.css                              barra, pie, página de sección y cajas del libro
css/interactivos.css                       núcleo de dibujo, preguntas y estilos de cada interactivo (.i-…)
js/sitio.js                                entrada de todas las páginas (ver abajo)
js/evaluacion.js                           opción múltiple, cálculo mental, reflexión
js/datos/indice.js                         índice del Vol. 1; una sección se publica al darle `slug: 'cap/sec'`
js/datos/glosario.js                       términos (tooltips y página de glosario)
js/nucleo/lienzo.js                        Plano (2D), Escena3D, Manija y funciones de dibujo (flecha, etiqueta, poligono, arco, punto)
js/interactivos/<nombre>.js                un interactivo por archivo; exporta `default function montar(contenedor)`
js/lib/                                    vec.js, proyeccion.js, katex.js, movimiento.js (Tween), progreso.js, dom.js
vendor/                                    KaTeX y fuentes (no editar)
tests/                                     pruebas con node:test
servidor.js                                servidor de desarrollo
```

`js/sitio.js` hace todo el trabajo común: inserta barra y pie; convierte `.ecuacion`, `.termino`, `.om`, `.cm`, `.reflexion` y `.evalua`; renderiza KaTeX; en las secciones arma el índice lateral, la barra de progreso y la navegación anterior/siguiente (desde `indice.js`); y carga cada `[data-interactivo="nombre"]` cuando está por entrar en pantalla, importando `js/interactivos/nombre.js`.

## Receta: añadir una sección

1. **Leer** la sección en el libro con `scripts/extraer_texto.py` (texto sólo para consulta). Anota el orden de ideas, las ecuaciones numeradas y qué conceptos previos supone.
2. **Esquema**: mismo orden y nivel que el libro. Decide qué idea merece un interactivo (ver `docs/pedagogia.md`) y dónde van las preguntas.
3. **HTML**: copia una sección existente (p. ej. `1/9/index.html`) a `<cap>/<sec>/index.html`, cambia `<title>`, `description`, `data-seccion` del `<body>` y la cabecera, y escribe el contenido dentro de `<article class="prosa">` con estos bloques:

   | Elemento | Marcado |
   |---|---|
   | Ecuación numerada | `<div class="ecuacion destacada" data-n="1.6" data-nota="θ desde +x">$$A_x = A\cos\theta$$</div>` |
   | Término del glosario | `<span class="termino" data-id="vector">cantidad vectorial</span>` |
   | Figura interactiva | `<figure class="figura ancha aparece"><div class="lienzo" data-interactivo="suma-vectores"></div><figcaption><span class="etq">Interactivo 1.7d</span><span>Qué hacer y qué observar.</span></figcaption></figure>` |
   | Cuidado | `<aside class="cuidado aparece"><p class="cabeza"><strong>Título</strong></p><p>…</p></aside>` |
   | Ejemplo | `<section class="ejemplo aparece">` con `header`, `.enunciado` y `<details class="solucion">` con un `.paso` por etapa (Identificar, Plantear, Ejecutar, Evaluar) |
   | Estrategia | `<section class="estrategia aparece">` con `<span class="ipee">Plantear</span>` en cada paso |
   | Opción múltiple | `<div class="om" data-id="1.7-x" [data-multiple]><p class="pregunta">…</p><ol class="opciones"><li data-correcta>…<p class="explicacion">…</p></li>…</ol><p class="cierre">…</p></div>` |
   | Cálculo mental | `<div class="cm" data-id="…"><div class="reto" data-respuesta="10" data-unidad="m"><p class="pregunta">…</p><p class="pista">…</p><p class="truco">…</p></div>…</div>` |
   | Reflexión | `<div class="reflexion"><p class="pregunta">…</p><p class="pista">…</p><p class="respuesta">…</p></div>` |
   | Evalúe su comprensión | `<section class="evalua aparece" data-seccion="1.7">` con una o dos `.om` dentro |
   | Resumen | `<section class="resumen">` con un `<article class="aparece">` por tarjeta |

   Matemáticas: `$…$` en el texto; `$$…$$` en un bloque. En atributos HTML escribe el TeX normal (`$\vec A$`), sin escapar barras.
4. **Interactivos** en `js/interactivos/<nombre>.js`, construidos con `js/nucleo/lienzo.js`: crea un `Plano` o `Escena3D`, escribe una función `dibujar()` que llame a `plano.pintar([...])` con las funciones de dibujo, regístrala con `plano.alRedibujar(dibujar)` y añade manijas con `plano.manija({...})`. Estilos propios en `css/interactivos.css` con prefijo `.i-<nombre>`.
5. **Registrar**: `slug` en `js/datos/indice.js` y términos nuevos en `js/datos/glosario.js` (un id desconocido se marca en rojo y sale un error en consola).
6. **Verificar**: `npm test`, `npm run dev` y revisar la página en el navegador (claro/oscuro, 390 px de ancho, arrastrar cada manija, responder cada pregunta, consola sin errores).

## Reglas pedagógicas (resumen; detalle en docs/pedagogia.md)

- Respeta el orden, el nivel y la notación del libro (flecha sobre vectores, θ desde +x, IDENTIFICAR · PLANTEAR · EJECUTAR · EVALUAR en los ejemplos).
- Todo término que un estudiante de primer semestre podría no conocer va en `<span class="termino">` con una definición breve en el glosario.
- Ejemplos cotidianos **sólo** cuando encajan de forma natural con el concepto. Si hay que forzarlo, mejor un ejemplo abstracto bien elegido.
- Cada interactivo explica **una** idea. Su pie de figura dice qué hacer y qué observar.
- Preguntas con criterio: opción múltiple para conceptos con distractores típicos; cálculo mental para intuición numérica (ternas pitagóricas, ángulos notables); reflexión para ideas abiertas. Cada distractor explica *por qué* está mal.

## Reglas de diseño (resumen; detalle en docs/diseno.md)

- Usa siempre los tokens de `css/tokens.css` (paleta extraída del libro). Nada de colores sueltos.
- Convención fija de vectores: **A azul, B magenta, resultante verde, cuarto vector naranja**; componentes x azul, y magenta, z verde. Ocre = ángulos, números de sección y acentos editoriales; rojo = Cuidado/error.
- Animaciones estilo Apple: sobrias, 300–900 ms, curvas `easeOut`/`easeInOut`, una idea por movimiento. Respeta `prefers-reduced-motion` (`Tween` y `animar()` ya lo hacen; en CSS usa los tokens `--dur-*`).
- Matemáticas siempre en KaTeX (también dentro de los SVG, con `etiqueta(lienzo, punto, 'TeX')`).
- Accesible: manijas con teclado (flechas), `aria-label` en lienzos, contraste suficiente en claro y oscuro.
- Móvil: sin scroll horizontal a 390 px; los lienzos miden su ancho real (no escalan el texto).
- No pongas `max-width` a todos los `svg`: rompe las flechas de `\vec` de KaTeX.

## Convenciones de código

- Español en contenido, nombres de archivos, variables y comentarios.
- JavaScript moderno (módulos ES, sin transpilar), con JSDoc donde ayude.
- Lógica matemática en `js/lib/vec.js` con pruebas en `tests/vec.test.js`; añade pruebas cuando un interactivo nuevo calcule algo nuevo.
- Commits en español, descriptivos.
