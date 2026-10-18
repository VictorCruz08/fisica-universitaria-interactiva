# Guía de diseño

La meta: la sencillez y elegancia de un producto de Apple con el aire académico de un buen libro de texto.

## Tipografía

| Uso | Fuente | Token |
|---|---|---|
| Texto corrido | Source Serif 4 (variable, óptica) | `--fuente-texto` |
| Títulos, interfaz, etiquetas | Inter (variable) | `--fuente-ui` / clase `.ui` |
| Matemáticas | KaTeX (Computer Modern, aspecto LaTeX) | — |

Escala en `css/tokens.css` (`--t-xs` … `--t-3xl`). Títulos con `letter-spacing` negativo; números de sección en ocre y peso 700.

## Color

Paleta extraída de los colores de proceso del PDF de la 12.ª edición:

| Token | Claro | Uso |
|---|---|---|
| `--azul` | #0082C9 | títulos de figura, enlaces, vector **A**, componente x |
| `--magenta` | #CC33B2 | vector **B**, componente y, reflexiones |
| `--verde` | #2D9972 | resultante, componente z, respuestas correctas, cálculo mental |
| `--naranja` | #F7933D | cuarto vector (p. ej. **C**, peso) |
| `--ocre` | #AF7C28 | números de sección y ecuación, ángulos, ejemplos, términos del glosario |
| `--rojo` | #EF4F28 | `Cuidado`, errores |
| `--arena` / `--crema` | #D6B584 / #FFFCD6 | fondo de `Estrategia` |
| `--tinta` | #231E21 | texto |

Cada token tiene variante oscura (en `prefers-color-scheme: dark` y en `[data-theme='dark']`). Nunca uses un hex suelto en un componente: añade un token si hace falta.

**Convención de vectores** (`--vec-a`, `--vec-b`, `--vec-r`, `--vec-d`, `--vec-x`, `--vec-y`, `--vec-z`): A azul, B magenta, resultante verde, cuarto vector naranja; componentes x/y/z en azul/magenta/verde. Los vectores componentes van con opacidad reducida; las proyecciones y guías, discontinuas en `--tinta-3`.

## Superficies

- Figuras: tarjeta blanca (`--fondo-elevado`), borde `--linea`, `--radio-l` (22 px), sombra suave `--sombra`. Más anchas que la columna de texto (`--ancho-figura`).
- Cajas del libro: `.ejemplo` (crema/ocre), `.cuidado` (rojo muy claro), `.evalua` (azul muy claro), `.estrategia` (crema), `.cm` (gris hundido), `.reflexion` (borde discontinuo).
- Barra de controles de cada interactivo: `.int-barra`; controles segmentados `.int-segmentado`; deslizadores `.int-deslizador`.

## Movimiento

- Curvas: `--ease-out` (entradas), `easeInOut` (transformaciones de un estado a otro), `--ease-spring` sólo en microinteracciones (manijas).
- Duraciones: 160 ms (hover), 320 ms (estados), 600–900 ms (explicaciones animadas).
- Cada animación explica algo: un vector que se invierte, componentes que se apilan, una curva que se traza. Nada de movimiento decorativo dentro del contenido (la portada es la única licencia).
- `prefers-reduced-motion`: todo salta al estado final (`Tween` y `animar()` de `js/lib/movimiento.js` lo respetan; los tokens `--dur-*` valen 0).

## Núcleo de dibujo (`js/nucleo/lienzo.js`)

- `Plano`: mide su ancho real y calcula la escala, así el texto de los SVG no se encoge en móvil. Escala uniforme en x e y (los vectores no se deforman). Para gráficas con ejes de distinta escala, usa un SVG propio (ver `js/interactivos/seno-coseno.js`).
- `Escena3D`: cámara ortográfica, z hacia arriba, sistema derecho; se gira arrastrando o con flechas.
- Funciones de dibujo (`flecha`, `etiqueta`, `poligono`, `arco`, `punto`): reciben el lienzo y coordenadas del mundo y devuelven SVG. `etiqueta` pone TeX dentro de un `foreignObject`; usa `fondo: true` cuando cruce la rejilla.
- `Manija`: nodo persistente, arrastrable con puntero y con teclado; `paso` = ajuste a la rejilla; `restringir` para mantenerla dentro del lienzo; `pos` puede ser una función para seguir a otro vector.

## Accesibilidad y móvil

- Sin scroll horizontal a 390 px; las tablas anchas van en contenedores con `overflow-x: auto`.
- Lienzos con `aria-label` descriptivo; manijas con `role="slider"`.
- Foco visible (`:focus-visible` azul).
- Tooltips de glosario funcionan con foco y, en móvil, se muestran como hoja inferior.
