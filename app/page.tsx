import Link from 'next/link';
import { indice } from '@/lib/indice';

// Fondo: rejilla de flechitas orientadas como un campo vectorial.
const flechas = Array.from({ length: 13 * 7 }, (_, n) => {
  const i = n % 13;
  const j = Math.floor(n / 13);
  const x = 40 + i * 76;
  const y = 40 + j * 76;
  return { x, y, ang: (Math.atan2(y - 300, x - 520) * 180) / Math.PI + 90, retraso: (i + j) * 60 };
});

const partes = indice.map((p, k) => {
  const caps = p.capitulos;
  const secciones = caps.flatMap((c) => c.secciones);
  return {
    numero: k + 1,
    titulo: p.titulo,
    rango: `Capítulos ${caps[0].numero}–${caps.at(-1)!.numero}`,
    capitulos: caps.length,
    disponibles: secciones.filter((s) => s.slug).length,
    total: secciones.length,
    temas: caps.slice(0, 4).map((c) => c.titulo),
  };
});

export default function Portada() {
  return (
    <>
      <header className="portada">
        <svg className="campo" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {flechas.map((f) => (
            <g key={`${f.x}-${f.y}`} transform={`translate(${f.x} ${f.y}) rotate(${f.ang})`}>
              <g className="mini" style={{ animationDelay: `${f.retraso}ms` }}>
                <line x1="-11" y1="0" x2="8" y2="0" />
                <path d="M12 0 L5 -3.6 L5 3.6 Z" />
              </g>
            </g>
          ))}
        </svg>

        <div className="contenido">
          <p className="sobre">Volumen 1 · Mecánica, ondas y termodinámica</p>
          <h1>
            <span className="l1">Física</span>
            <span className="l2">Universitaria</span>
            <span className="l3">Interactiva</span>
          </h1>

          <svg className="suma" viewBox="0 0 360 150" role="img" aria-label="Dos vectores sumados cabeza con cola y su resultante">
            <line className="v a" x1="20" y1="130" x2="200" y2="40" pathLength={1} />
            <path className="p a" d="M210 35 L194.5 37 L201.4 50.4 Z" />
            <line className="v b" x1="200" y1="40" x2="330" y2="96" pathLength={1} />
            <path className="p b" d="M340 100 L327.5 88.7 L321.9 101.6 Z" />
            <line className="v r" x1="20" y1="130" x2="330" y2="103" pathLength={1} />
            <path className="p r" d="M341 102 L327.9 96.6 L329 110.6 Z" />
            <text className="t a" x="96" y="72">A</text>
            <text className="t b" x="276" y="56">B</text>
            <text className="t r" x="170" y="140">A + B</text>
          </svg>

          <p className="lema">
            Un libro de física para quienes entienden mejor <em>viendo</em>: cada concepto con animaciones precisas,
            figuras que puedes mover y preguntas para comprobar lo aprendido.
          </p>
          <div className="acciones">
            <Link className="boton-grande" href="/indice/">
              Explorar el libro
            </Link>
            <Link className="enlace" href="/como-usar/">
              Cómo usar este libro →
            </Link>
          </div>
        </div>
      </header>

      <main className="debajo">
        <section className="principios">
          <article className="vidrio aparece">
            <h2 className="ui">Visual</h2>
            <p>Cada idea importante tiene una animación que la muestra paso a paso. Nada de adorno: cada movimiento explica algo.</p>
          </article>
          <article className="vidrio aparece">
            <h2 className="ui">Interactivo</h2>
            <p>Arrastra vectores, mueve deslizadores, gira escenas en 3D. Aprendes preguntándole al modelo “¿y si…?”.</p>
          </article>
          <article className="vidrio aparece">
            <h2 className="ui">Riguroso</h2>
            <p>Sigue el orden, el nivel y la notación de un curso universitario, con la estrategia Identificar · Plantear · Ejecutar · Evaluar.</p>
          </article>
        </section>

        <section className="partes">
          <h2 className="ui titulo-bloque">El libro</h2>
          <ul>
            {partes.map((p) => (
              <li key={p.numero}>
                <Link className="tarjeta-parte aparece" href={`/indice/#parte-${p.numero}`}>
                  <span className="tp-sup">
                    Parte {p.numero} · {p.rango}
                  </span>
                  <span className="tp-titulo">{p.titulo}</span>
                  <span className="tp-temas">{p.temas.join(' · ')}{p.capitulos > 4 ? ' · …' : ''}</span>
                  <span className="tp-pie">
                    {p.disponibles > 0 ? (
                      <span className="pastilla">{p.disponibles} secciones disponibles</span>
                    ) : (
                      <span className="tenue">Próximamente</span>
                    )}
                    <span className="tenue">{p.capitulos} capítulos</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
