'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** Aparición suave al hacer scroll de todo lo que tenga la clase `.aparece`. */
export default function Aparece() {
  const ruta = usePathname();
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    document.querySelectorAll('.aparece:not(.visible)').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ruta]);
  return null;
}
