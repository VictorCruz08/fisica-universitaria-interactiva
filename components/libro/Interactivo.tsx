'use client';

import { useEffect, useRef, useState } from 'react';
import { interactivos, type NombreInteractivo } from '@/interactivos/registro';

/**
 * Monta un interactivo (código imperativo en interactivos/) cuando está por
 * entrar en pantalla. Cada interactivo exporta `default function montar(el)`.
 */
export default function Interactivo({ nombre }: { nombre: NombreInteractivo }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let vivo = true;
    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((e) => e.isIntersecting)) return;
        observador.disconnect();
        interactivos[nombre]()
          .then((m) => {
            if (!vivo) return;
            el.replaceChildren();
            m.default(el);
            el.dataset.montado = '';
          })
          .catch((err) => {
            console.error(`No se pudo cargar el interactivo "${nombre}"`, err);
            if (vivo) setError(true);
          });
      },
      { rootMargin: '600px 0px 1500px 0px' },
    );
    observador.observe(el);
    return () => {
      vivo = false;
      observador.disconnect();
      el.replaceChildren();
      delete el.dataset.montado;
    };
  }, [nombre]);

  return (
    <div className="lienzo" ref={ref} data-interactivo={nombre}>
      {error && <p className="int-texto">No se pudo cargar este interactivo.</p>}
    </div>
  );
}
