'use client';

import { useEffect, useRef, useState } from 'react';

type Titulo = { id: string; texto: string };

/**
 * Barra de progreso de lectura e índice lateral de la sección.
 * Lee los <h2> de `.prosa` (rehype-slug ya les puso id).
 */
export default function GuiaLectura() {
  const barra = useRef<HTMLSpanElement>(null);
  const [titulos, setTitulos] = useState<Titulo[]>([]);
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    const h2 = [...document.querySelectorAll<HTMLHeadingElement>('.prosa h2[id]')];
    setTitulos(h2.map((h) => ({ id: h.id, texto: h.textContent ?? '' })));
    const actualizar = () => {
      const d = document.documentElement;
      const p = d.scrollTop / Math.max(1, d.scrollHeight - d.clientHeight);
      if (barra.current) barra.current.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
      let a = 0;
      h2.forEach((h, k) => {
        if (h.getBoundingClientRect().top < 140) a = k;
      });
      setActivo(a);
    };
    document.addEventListener('scroll', actualizar, { passive: true });
    actualizar();
    return () => document.removeEventListener('scroll', actualizar);
  }, []);

  return (
    <>
      <div className="progreso-lectura" aria-hidden="true">
        <span ref={barra} />
      </div>
      {titulos.length > 0 && (
        <aside className="toc ui" aria-label="En esta sección">
          <nav>
            <p className="toc-tit">En esta sección</p>
            <ol>
              {titulos.map((t, k) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className={k === activo ? 'activo' : undefined}>
                    {t.texto}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
      )}
    </>
  );
}
