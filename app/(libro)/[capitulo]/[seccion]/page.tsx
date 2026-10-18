import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import GuiaLectura from '@/components/sitio/GuiaLectura';
import { secciones } from '@/contenido/registro';
import { seccionesPublicadas, type SeccionPublicada } from '@/lib/indice';

type Params = { capitulo: string; seccion: string };

const publicadas = seccionesPublicadas();

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return publicadas.map((s) => {
    const [capitulo, seccion] = s.slug.split('/');
    return { capitulo, seccion };
  });
}

const cargar = async ({ capitulo, seccion }: Params) => {
  const slug = `${capitulo}/${seccion}`;
  const i = publicadas.findIndex((s) => s.slug === slug);
  if (i < 0 || !secciones[slug]) notFound();
  const modulo = await secciones[slug]();
  return { ...modulo, actual: publicadas[i], anterior: publicadas[i - 1], siguiente: publicadas[i + 1] };
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { meta, actual } = await cargar(await params);
  return { title: `${actual.numero} ${meta.titulo}`, description: meta.resumen };
}

function Tarjeta({ s, dir, derecha = false }: { s?: SeccionPublicada; dir: 'anterior' | 'siguiente'; derecha?: boolean }) {
  const clase = `tarjeta-paso${derecha ? ' der' : ''}`;
  if (!s)
    return (
      <Link className={clase} href="/indice/">
        <span className="dir">{dir === 'anterior' ? '← Índice' : 'Índice →'}</span>
        <span className="t">{dir === 'anterior' ? 'Contenido del libro' : 'Más secciones próximamente'}</span>
      </Link>
    );
  return (
    <Link className={clase} href={`/${s.slug}/`}>
      <span className="dir">{dir === 'anterior' ? '← Anterior' : 'Siguiente →'}</span>
      <span className="t">
        {s.numero} {s.titulo}
      </span>
    </Link>
  );
}

export default async function PaginaSeccion({ params }: { params: Promise<Params> }) {
  const { default: Contenido, meta, actual, anterior, siguiente } = await cargar(await params);
  return (
    <div className="marco">
      <GuiaLectura />
      <main id="contenido">
        <header className="cabecera">
          <Link className="cap ui" href="/indice/">
            Capítulo {actual.capitulo} · {actual.tituloCapitulo}
          </Link>
          <div className="titular">
            <span className="num">{actual.numero}</span>
            <h1>{meta.titulo}</h1>
          </div>
          <p className="lead">{meta.resumen}</p>
          <p className="meta ui">
            <span>≈ {meta.minutos} min</span>
            <span aria-hidden="true">·</span>
            <span>pág. {meta.paginaLibro} del libro (12.ª ed.)</span>
          </p>
        </header>

        <article className="prosa">
          <Contenido />
        </article>

        <nav className="paso-seccion ui" aria-label="Navegación entre secciones">
          <Tarjeta s={anterior} dir="anterior" />
          <Tarjeta s={siguiente} dir="siguiente" derecha />
        </nav>
      </main>
    </div>
  );
}
