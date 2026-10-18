import type { Metadata } from 'next';
import Link from 'next/link';
import { indice } from '@/lib/indice';

export const metadata: Metadata = {
  title: 'Índice',
  description: 'Contenido completo del Volumen 1: secciones disponibles y próximas.',
};

const todas = indice.flatMap((p) => p.capitulos.flatMap((c) => c.secciones));
const listas = todas.filter((s) => s.slug).length;

export default function Indice() {
  return (
    <main className="pagina">
      <p className="sobre">Contenido · Volumen 1</p>
      <h1>Índice</h1>
      <p className="lead">
        Sigue el orden del libro de texto. Las secciones con enlace ya están disponibles; las demás irán apareciendo. El
        número de página corresponde a la 12.ª edición impresa, por si estudias con ella.
      </p>
      <div className="progreso-indice" aria-label={`${listas} de ${todas.length} secciones disponibles`}>
        <div className="barra-p">
          <span style={{ width: `${(100 * listas) / todas.length}%` }} />
        </div>
        <span>
          {listas} de {todas.length} secciones
        </span>
      </div>

      {indice.map((parte) => (
        <section className="parte" key={parte.titulo}>
          <h2>{parte.titulo}</h2>
          {parte.capitulos.map((cap) => {
            const disponibles = cap.secciones.filter((s) => s.slug).length;
            return (
              <details className="capitulo aparece" open={disponibles > 0} key={cap.numero}>
                <summary>
                  <span className="num">{cap.numero}</span>
                  <span className="tit">{cap.titulo}</span>
                  {disponibles > 0 && <span className="pastilla">{disponibles} disponibles</span>}
                  <span className="pag">{cap.pagina}</span>
                </summary>
                <ol>
                  {cap.secciones.map((s) => (
                    <li className={s.slug ? 'lista' : undefined} key={s.numero}>
                      {s.slug ? (
                        <Link href={`/${s.slug}/`}>
                          <span className="sn">{s.numero}</span>
                          <span>{s.titulo}</span>
                        </Link>
                      ) : (
                        <span className="pendiente">
                          <span className="sn">{s.numero}</span>
                          <span>
                            {s.titulo}
                            {s.opcional && <span className="opc"> opcional</span>}
                          </span>
                        </span>
                      )}
                      <span className="pag">{s.pagina}</span>
                    </li>
                  ))}
                </ol>
              </details>
            );
          })}
        </section>
      ))}
    </main>
  );
}
