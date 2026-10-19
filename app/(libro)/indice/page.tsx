import type { Metadata } from 'next';
import Link from 'next/link';
import { descripcionCapitulo, indice } from '@/lib/indice';

export const metadata: Metadata = {
  title: 'Índice',
  description: 'Contenido completo del Volumen 1: partes, capítulos y secciones disponibles.',
};

const todas = indice.flatMap((p) => p.capitulos.flatMap((c) => c.secciones));
const listas = todas.filter((s) => s.slug).length;

export default function Indice() {
  return (
    <main className="pagina pagina-ancha">
      <header className="cabeza-pagina">
        <p className="sobre">Contenido · Volumen 1</p>
        <h1>Índice</h1>
        <p className="lead">
          Tres partes y veinte capítulos, en el mismo orden que el libro de texto. Elige un capítulo para ver sus
          secciones.
        </p>
        <div className="estado">
          <div className="barra-p" aria-hidden="true">
            <span style={{ width: `${(100 * listas) / todas.length}%` }} />
          </div>
          <span>
            {listas} de {todas.length} secciones disponibles
          </span>
        </div>
      </header>

      {indice.map((parte, k) => (
        <section className="parte" key={parte.titulo} id={`parte-${k + 1}`}>
          <h2>
            <span className="parte-num">Parte {k + 1}</span>
            {parte.titulo}
          </h2>
          <ul className="rejilla-capitulos">
            {parte.capitulos.map((c) => {
              const disp = c.secciones.filter((s) => s.slug).length;
              return (
                <li key={c.numero}>
                  <Link className={`tarjeta-capitulo aparece${disp ? ' con-contenido' : ''}`} href={`/${c.numero}/`}>
                    <span className="tc-num">{c.numero}</span>
                    <span className="tc-titulo">{c.titulo}</span>
                    <span className="tc-desc">{descripcionCapitulo[c.numero]}</span>
                    <span className="tc-pie">
                      {disp > 0 ? (
                        <span className="pastilla">
                          {disp} de {c.secciones.length} disponibles
                        </span>
                      ) : (
                        <span className="tenue">Próximamente</span>
                      )}
                      <span className="tenue">{c.secciones.length} secciones</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  );
}
