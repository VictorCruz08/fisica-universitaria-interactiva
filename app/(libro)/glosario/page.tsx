import type { Metadata } from 'next';
import { glosario } from '@/lib/glosario';

export const metadata: Metadata = {
  title: 'Glosario',
  description: 'Términos clave con definiciones breves, en orden alfabético.',
};

const entradas = Object.entries(glosario).sort((a, b) => a[1].termino.localeCompare(b[1].termino, 'es'));
const letras = [...new Set(entradas.map(([, e]) => e.termino[0].toUpperCase()))];

export default function Glosario() {
  return (
    <main className="pagina">
      <p className="sobre">Referencia</p>
      <h1>Glosario</h1>
      <p className="lead">
        Las palabras subrayadas con puntos en el texto aparecen aquí. Cada definición indica la sección donde se presenta.
      </p>
      <nav className="letras" aria-label="Letras">
        {letras.map((l) => (
          <a href={`#letra-${l}`} key={l}>
            {l}
          </a>
        ))}
      </nav>
      {letras.map((l) => (
        <section className="letra" id={`letra-${l}`} key={l}>
          <h2 className="ui">{l}</h2>
          <dl>
            {entradas
              .filter(([, e]) => e.termino[0].toUpperCase() === l)
              .map(([id, e]) => (
                <div className="entrada aparece" id={id} key={id}>
                  <dt>{e.termino}</dt>
                  <dd>
                    {e.definicion} <span className="sec">§ {e.seccion}</span>
                  </dd>
                </div>
              ))}
          </dl>
        </section>
      ))}
    </main>
  );
}
