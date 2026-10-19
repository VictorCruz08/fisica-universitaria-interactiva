import Link from 'next/link';
import { Fragment } from 'react';

type Paso = { texto: string; href?: string };

/** Ruta de navegación: Índice › Capítulo 1 › 1.7 */
export default function Migas({ pasos }: { pasos: Paso[] }) {
  return (
    <nav className="migas ui" aria-label="Ruta de navegación">
      <ol>
        {pasos.map((p, i) => (
          <Fragment key={p.texto}>
            <li>{p.href ? <Link href={p.href}>{p.texto}</Link> : <span aria-current="page">{p.texto}</span>}</li>
            {i < pasos.length - 1 && (
              <li aria-hidden="true" className="sep">
                ›
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
