# Guía pedagógica

Cómo escribir una sección de Física Universitaria Interactiva.

## Principios

1. **Fiel al libro en estructura, original en forma.** Mismo orden de ideas, mismo nivel matemático, misma notación y numeración de ecuaciones. Pero el texto, los ejemplos, los números y las preguntas se escriben desde cero (ver "Derechos de autor" en `CLAUDE.md`).
2. **Primero la intuición, luego la fórmula.** Antes de una ecuación, una frase que diga qué significa físicamente y, si ayuda, un interactivo que lo muestre.
3. **Nada de términos sin explicar.** Si un estudiante de primer semestre podría no conocer una palabra (cuadrante, arctan, proyección, determinante…), va en `<span class="termino">` y en el glosario. Las definiciones son breves, concretas y originales.
4. **Explicar el porqué de los errores.** Las cajas `Cuidado` recogen confusiones reales y frecuentes; cada distractor de opción múltiple explica en qué se equivoca.
5. **Tono:** cercano y preciso, en segunda persona ("arrastra", "observa"). Español neutro. Punto decimal (como el libro).

## Estructura de una sección

```
cabecera (número, título, párrafo introductorio, minutos, página del libro)
<h2> Subtemas en el orden del libro
   texto → .ecuacion → figura con data-interactivo → .cuidado cuando aplique
   .om o .cm entre subtemas cuando refuercen algo recién visto
.ejemplo con IDENTIFICAR · PLANTEAR · EJECUTAR · EVALUAR (la solución arranca oculta)
.estrategia si el libro propone una estrategia de resolución en esa sección
.evalua al final
.reflexion opcional para cerrar con una pregunta abierta
```

El marcado exacto de cada bloque está en la tabla de `CLAUDE.md` ("Receta: añadir una sección").

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
| Opción múltiple (`.om`) | Conceptos con errores típicos | 3–6 opciones; cada una con su `.explicacion`; `data-multiple` si puede haber varias correctas; `.cierre` con la idea general. |
| Cálculo mental (`.cm`) | Desarrollar intuición numérica | 2–4 `.reto` encadenados; `.truco` que enseñe el atajo; `.pista` opcional. |
| Reflexión (`.reflexion`) | Ideas abiertas, conexiones con capítulos futuros | Pregunta que no se responda con un número; respuesta modelo breve. |
| Evalúe (`.evalua`) | Cierre de cada sección | Envuelve una o dos `.om` propias (no las del libro). |

Los `data-id` de las preguntas son estables (`"1.7-evalua"`): se usan para guardar el progreso en el navegador.
