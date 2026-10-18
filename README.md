# Física Universitaria Interactiva

Un libro web de física universitaria pensado para quienes aprenden mejor **viendo**: animaciones precisas, figuras que se pueden manipular, fórmulas con tipografía LaTeX y preguntas para comprobar lo aprendido en cada sección.

**Leer en línea:** https://victorcruz08.github.io/fisica-universitaria-interactiva/

Sigue el orden, el nivel y la notación de *Física Universitaria* de Sears, Zemansky, Young y Freedman (12.ª ed., Vol. 1), de modo que se puede estudiar junto al libro: los números de sección y de ecuación coinciden.

## Contenido disponible

| Capítulo | Secciones |
|---|---|
| 1. Unidades, cantidades físicas y vectores | 1.7 Vectores y suma de vectores · 1.8 Componentes de vectores · 1.9 Vectores unitarios · 1.10 Producto de vectores |

El libro crece sección por sección.

## Desarrollo

Construido con [Next.js](https://nextjs.org) (exportación estática), React, TypeScript, MDX y [KaTeX](https://katex.org). Requiere Node 20+.

```bash
npm install
npm run dev      # http://localhost:3000/fisica-universitaria-interactiva/
npm test         # pruebas de la biblioteca vectorial
npm run check    # revisión de tipos
npm run build    # sitio estático en out/
```

Cada push a `main` se publica en GitHub Pages. La guía para contribuir contenido está en [`CLAUDE.md`](CLAUDE.md), [`docs/pedagogia.md`](docs/pedagogia.md) y [`docs/diseno.md`](docs/diseno.md).

## Aviso

Éstas son notas de estudio independientes. El texto, los ejemplos, las preguntas y las figuras son originales; no reproducen ni sustituyen al libro, que tiene derechos de autor de Pearson Educación. Este proyecto no está afiliado ni respaldado por Pearson.

## Licencia

- Código: [MIT](LICENSE).
- Contenido (textos, ejemplos, figuras): [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es).
