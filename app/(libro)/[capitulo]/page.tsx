import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Migas from '@/components/sitio/Migas';
import { capitulo, capitulos, descripcionCapitulo } from '@/lib/indice';

type Params = { capitulo: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return capitulos().map((c) => ({ capitulo: String(c.numero) }));
}

const cargar = async (params: Promise<Params>) => {
  const c = capitulo(Number((await params).capitulo));
  if (!c) notFound();
  return c;
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const c = await cargar(params);
  return { title: `Capítulo ${c.numero}: ${c.titulo}`, description: descripcionCapitulo[c.numero] };
}

export default async function PaginaCapitulo({ params }: { params: Promise<Params> }) {
  const c = await cargar(params);
  const disponibles = c.secciones.filter((s) => s.slug);
  const primera = disponibles[0];
  const anterior = capitulo(c.numero - 1);
  const siguiente = capitulo(c.numero + 1);

  return (
    <main className="pagina pagina-capitulo">
      <Migas pasos={[{ texto: 'Índice', href: '/indice/' }, { texto: `Capítulo ${c.numero}` }]} />

      <header className="portadilla">
        <span className="numero-capitulo" aria-hidden="true">
          {c.numero}
        </span>
        <p className="sobre">Capítulo {c.numero}</p>
        <h1>{c.titulo}</h1>
        <p className="lead">{descripcionCapitulo[c.numero]}</p>
        <div className="estado">
          <div className="barra-p" aria-hidden="true">
            <span style={{ width: `${(100 * disponibles.length) / c.secciones.length}%` }} />
          </div>
          <span>
            {disponibles.length} de {c.secciones.length} secciones disponibles · pág. {c.pagina} del libro
          </span>
        </div>
        {primera && (
          <div className="acciones">
            <Link className="boton-grande" href={`/${primera.slug}/`}>
              Empezar por {primera.numero}
            </Link>
          </div>
        )}
      </header>

      <ol className="lista-secciones">
        {c.secciones.map((s) => {
          const contenido = (
            <>
              <span className="sn">{s.numero}</span>
              <span className="st">
                {s.titulo}
                {s.opcional && <span className="opc">opcional</span>}
              </span>
              <span className="sp">{s.slug ? 'Leer →' : 'Próximamente'}</span>
            </>
          );
          return (
            <li key={s.numero}>
              {s.slug ? (
                <Link className="tarjeta-seccion disponible" href={`/${s.slug}/`}>
                  {contenido}
                </Link>
              ) : (
                <div className="tarjeta-seccion">{contenido}</div>
              )}
            </li>
          );
        })}
      </ol>

      <nav className="paso-seccion ui" aria-label="Otros capítulos">
        {anterior ? (
          <Link className="tarjeta-paso" href={`/${anterior.numero}/`}>
            <span className="dir">← Capítulo {anterior.numero}</span>
            <span className="t">{anterior.titulo}</span>
          </Link>
        ) : (
          <Link className="tarjeta-paso" href="/indice/">
            <span className="dir">← Índice</span>
            <span className="t">Contenido del libro</span>
          </Link>
        )}
        {siguiente ? (
          <Link className="tarjeta-paso der" href={`/${siguiente.numero}/`}>
            <span className="dir">Capítulo {siguiente.numero} →</span>
            <span className="t">{siguiente.titulo}</span>
          </Link>
        ) : (
          <Link className="tarjeta-paso der" href="/indice/">
            <span className="dir">Índice →</span>
            <span className="t">Contenido del libro</span>
          </Link>
        )}
      </nav>
    </main>
  );
}
