import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cómo usar este libro',
  description: 'Qué significa cada elemento del libro y cómo sacarle provecho.',
};

const bloques = [
  {
    muestra: 'Interactivo 1.7d',
    clase: 'interactivo',
    titulo: 'Figuras interactivas',
    texto: (
      <>
        Casi todas las figuras se pueden manipular. Los círculos con borde de color son manijas: arrástralas con el ratón
        o el dedo, o selecciónalas con <kbd>Tab</kbd> y muévelas con las flechas del teclado. Las escenas en 3D se giran
        arrastrando.
      </>
    ),
  },
  {
    muestra: 'Ejemplo 1.8b',
    clase: 'ejemplo-m',
    titulo: 'Ejemplos resueltos',
    texto: (
      <>
        Siguen siempre cuatro pasos: <strong>Identificar</strong> los conceptos y la incógnita, <strong>Plantear</strong>{' '}
        el problema con un dibujo, <strong>Ejecutar</strong> los cálculos y <strong>Evaluar</strong> si el resultado tiene
        sentido. La solución está oculta: inténtalo primero.
      </>
    ),
  },
  {
    muestra: 'Cuidado',
    clase: 'cuidado-m',
    titulo: 'Errores comunes',
    texto: <>Las cajas rojas señalan las confusiones más frecuentes. Léelas aunque creas que no te aplican.</>,
  },
  {
    muestra: 'Evalúe su comprensión',
    clase: 'evalua-m',
    titulo: 'Preguntas de opción múltiple',
    texto: (
      <>
        Al final de cada sección (y a veces en medio). Cada respuesta incorrecta explica <em>por qué</em> lo es, así que
        equivocarse también enseña. Tu progreso se guarda sólo en tu navegador.
      </>
    ),
  },
  {
    muestra: 'Cálculo mental',
    clase: 'mental-m',
    titulo: 'Sin calculadora',
    texto: <>Retos cortos para desarrollar intuición numérica: ternas pitagóricas, ángulos notables, órdenes de magnitud.</>,
  },
  {
    muestra: 'Para reflexionar',
    clase: 'reflexion-m',
    titulo: 'Preguntas abiertas',
    texto: <>No tienen una sola respuesta correcta. Escribe tu idea antes de ver una respuesta modelo.</>,
  },
  {
    muestra: 'magnitud',
    clase: 'termino-m',
    titulo: 'Términos con definición',
    texto: (
      <>
        Las palabras subrayadas con puntos ocres muestran su definición al pasar el cursor o al tocarlas. Todas están
        reunidas en el <Link href="/glosario/">glosario</Link>.
      </>
    ),
  },
];

export default function ComoUsar() {
  return (
    <main className="pagina">
      <p className="sobre">Antes de empezar</p>
      <h1>Cómo usar este libro</h1>
      <p className="lead">
        Este sitio sigue capítulo a capítulo un curso de física universitaria. Puedes leerlo solo o junto a tu libro de
        texto: los números de sección y de ecuación coinciden con los de la 12.ª edición de <em>Física Universitaria</em>{' '}
        (Sears y Zemansky), para que puedas ir y venir entre ambos.
      </p>

      <section className="bloques">
        {bloques.map((b) => (
          <article className="aparece" key={b.titulo}>
            <div className={`muestra ${b.clase}`}>{b.muestra}</div>
            <h2 className="ui">{b.titulo}</h2>
            <p>{b.texto}</p>
          </article>
        ))}
      </section>

      <section className="aviso aparece">
        <h2 className="ui">Sobre el contenido</h2>
        <p>
          Éstas son notas de estudio independientes: el texto, los ejemplos, las preguntas y las figuras son originales.
          Siguen el orden, la notación y el enfoque pedagógico del libro de Sears, Zemansky, Young y Freedman, pero no lo
          reproducen ni lo sustituyen. Este proyecto no está afiliado a Pearson.
        </p>
      </section>
    </main>
  );
}
