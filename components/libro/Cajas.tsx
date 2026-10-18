import type { ReactNode } from 'react';
import { tex } from '@/lib/katex';

/** Caja roja de errores frecuentes. */
export function Cuidado({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <aside className="cuidado aparece">
      <p className="cabeza">
        <strong>{titulo}</strong>
      </p>
      {children}
    </aside>
  );
}

/** Estrategia para resolver problemas (IDENTIFICAR · PLANTEAR · EJECUTAR · EVALUAR). */
export function Estrategia({ numero, titulo, children }: { numero: string; titulo: string; children: ReactNode }) {
  return (
    <section className="estrategia aparece">
      <header>
        <span className="sup">Estrategia para resolver problemas {numero}</span>
        <h4>{titulo}</h4>
      </header>
      {children}
    </section>
  );
}

/** Etiqueta de etapa dentro de una Estrategia: <Ipee>Plantear</Ipee>. */
export function Ipee({ children }: { children: ReactNode }) {
  return <span className="ipee">{children}</span>;
}

/** Ejemplo resuelto. Hijos: <Enunciado> y un <Paso etapa="…"> por etapa. */
export function Ejemplo({ numero, titulo, children }: { numero: string; titulo: string; children: ReactNode }) {
  return (
    <section className="ejemplo aparece" aria-label={`Ejemplo ${numero}: ${titulo}`}>
      <header>
        <span className="sup">Ejemplo {numero}</span>
        <h4>{titulo}</h4>
      </header>
      {children}
    </section>
  );
}

export function Enunciado({ children }: { children: ReactNode }) {
  return <div className="enunciado">{children}</div>;
}

/** Solución desplegable: envuelve los pasos (la solución arranca oculta). */
export function Solucion({ children }: { children: ReactNode }) {
  return (
    <details className="solucion">
      <summary>Ver solución</summary>
      <div className="pasos">{children}</div>
    </details>
  );
}

export function Paso({ etapa, children }: { etapa: 'Identificar' | 'Plantear' | 'Ejecutar' | 'Evaluar'; children: ReactNode }) {
  return (
    <div className="paso">
      <span className="etq">{etapa}</span>
      <div>{children}</div>
    </div>
  );
}

/** “Evalúe su comprensión de la sección x.y”. */
export function Evalua({ seccion, children }: { seccion: string; children: ReactNode }) {
  return (
    <section className="evalua aparece">
      <p className="cabeza">
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="M6.5 10.2 L9 12.6 L13.8 7.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Evalúe su comprensión de la sección {seccion}
      </p>
      {children}
    </section>
  );
}

type Tarjeta = { titulo: string; texto: string; formula?: string; n?: string };

/** Resumen de fin de sección en tarjetas. */
export function Resumen({ tarjetas }: { tarjetas: Tarjeta[] }) {
  return (
    <section className="resumen">
      {tarjetas.map((t) => (
        <article className="aparece" key={t.titulo}>
          <h4 className="ui">{t.titulo}</h4>
          {t.formula && <div dangerouslySetInnerHTML={{ __html: tex(t.formula, true) }} />}
          <p>{t.texto}</p>
          {t.n && <span className="n">Ec. ({t.n})</span>}
        </article>
      ))}
    </section>
  );
}
