# Guía pedagógica

Cómo escribir una sección de Física Universitaria Interactiva.

## Principios

1. **Fiel al libro en estructura, original en forma.** Mismo orden de ideas, mismo nivel matemático, misma notación y numeración de ecuaciones. Pero el texto, los ejemplos, los números y las preguntas se escriben desde cero (ver "Derechos de autor" en `CLAUDE.md`).
2. **Primero la intuición, luego la fórmula.** Antes de una ecuación, una frase que diga qué significa físicamente y, si ayuda, un interactivo que lo muestre.
3. **Nada de términos sin explicar.** Si un estudiante de primer semestre podría no conocer una palabra (cuadrante, arctan, proyección, determinante…), va en `<Termino>` y en el glosario. Las definiciones son breves, concretas y originales.
4. **Explicar el porqué de los errores.** Las cajas `Cuidado` recogen confusiones reales y frecuentes; cada distractor de opción múltiple explica en qué se equivoca.
5. **Tono:** cercano y preciso, en segunda persona ("arrastra", "observa"). Español neutro. Punto decimal (como el libro).

## Estructura de una sección

```
frontmatter (titulo, resumen = párrafo introductorio, paginaLibro, minutos)
## Subtemas en el orden del libro
   texto → <Ecuacion n="…"> → <Figura><Interactivo/></Figura> → <Cuidado> cuando aplique
   <OpcionMultiple> o <CalculoMental> entre subtemas cuando refuercen algo recién visto
<Ejemplo> con IDENTIFICAR · PLANTEAR · EJECUTAR · EVALUAR (la solución arranca oculta)
<Estrategia> si el libro propone una estrategia de resolución en esa sección
<Evalua seccion="x.y"> al final
<Reflexion> opcional para cerrar con una pregunta abierta
```

## Interactivos

Un interactivo se justifica si **mover algo** revela una relación que un dibujo fijo no muestra (cómo cambia una magnitud con un ángulo, por qué el orden no importa, qué pasa al cruzar un caso límite).

- Una idea por interactivo. Si necesita dos párrafos de instrucciones, son dos interactivos.
- Estado inicial con un caso "típico" (no degenerado: nada de ángulos de 0° o 90° de entrada salvo que ése sea el punto).
- Los valores numéricos que se muestran se calculan en vivo y coinciden con el dibujo.
- El pie de figura dice **qué hacer** y **qué observar**.
- Las animaciones de varios pasos (resta de vectores, suma por componentes) llevan texto que narra cada paso y botón de repetir.

## Ejemplos

- Situaciones cotidianas sólo cuando encajan sin forzar: caminar por un barrio (desplazamiento), un dron de reparto (suma perpendicular), jalar una maleta (producto escalar), apretar un tornillo (producto vectorial). Si no hay una situación natural, usa vectores abstractos bien elegidos.
- Números "amables" que permitan verificar mentalmente (ternas 3-4-5, 5-12-13, 2-3-6-7, ángulos de 30°/45°/60°), salvo cuando el objetivo sea practicar con calculadora.
- Evaluar siempre: ¿el orden de magnitud es razonable? ¿los signos coinciden con el dibujo? ¿se cumple una desigualdad conocida?

## Evaluación

| Tipo | Cuándo | Reglas |
|---|---|---|
| `OpcionMultiple` | Conceptos con errores típicos | 3–6 opciones; cada una con `explicacion`; `multiple` si puede haber varias correctas; `cierre` con la idea general. |
| `CalculoMental` | Desarrollar intuición numérica | 2–4 retos encadenados; `truco` que enseñe el atajo; `pista` opcional. |
| `Reflexion` | Ideas abiertas, conexiones con capítulos futuros | Pregunta que no se responda con un número; respuesta modelo breve. |
| `Evalua` | Cierre de cada sección | Envuelve una o dos `OpcionMultiple` propias (no las del libro). |

Los `id` de las preguntas son estables (`"1.7-evalua"`): se usan para guardar el progreso en el navegador.
