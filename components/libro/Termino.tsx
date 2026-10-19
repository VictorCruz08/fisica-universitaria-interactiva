'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { glosario } from '@/lib/glosario';

const MARGEN = 16;

/**
 * Palabra con definición del glosario. La definición se dibuja en un portal
 * sobre <body> (así no la recorta ni la desplaza ninguna tarjeta de vidrio) y
 * se mantiene dentro de la pantalla. En móvil aparece como hoja inferior.
 * Un id que no exista en lib/glosario.ts rompe el build a propósito.
 */
export default function Termino({ id, children }: { id: string; children: ReactNode }) {
  const idTip = useId();
  const entrada = glosario[id];
  if (!entrada) throw new Error(`Término de glosario desconocido: "${id}"`);

  const boton = useRef<HTMLButtonElement>(null);
  const tip = useRef<HTMLSpanElement>(null);
  const [abierto, setAbierto] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number; abajo: boolean } | null>(null);
  const [hoja, setHoja] = useState(false);

  const abrir = () => {
    setHoja(window.innerWidth <= 560);
    setAbierto(true);
  };

  // Coloca la definición sobre la palabra (o debajo si no cabe), sin salirse de la pantalla.
  useLayoutEffect(() => {
    if (!abierto) {
      setPos(null);
      return;
    }
    if (!boton.current || !tip.current || hoja) return;
    const b = boton.current.getBoundingClientRect();
    const t = tip.current.getBoundingClientRect();
    const left = Math.min(Math.max(MARGEN, b.left + b.width / 2 - t.width / 2), window.innerWidth - t.width - MARGEN);
    const arriba = b.top - t.height - 10;
    const abajo = arriba < MARGEN;
    setPos({ left, top: abajo ? b.bottom + 10 : arriba, abajo });
  }, [abierto, hoja]);

  // Se cierra al hacer scroll o al tocar fuera.
  useEffect(() => {
    if (!abierto) return;
    const cerrar = (e: Event) => {
      if (e.type === 'pointerdown' && boton.current?.contains(e.target as Node)) return;
      setAbierto(false);
    };
    window.addEventListener('scroll', cerrar, { passive: true });
    document.addEventListener('pointerdown', cerrar);
    return () => {
      window.removeEventListener('scroll', cerrar);
      document.removeEventListener('pointerdown', cerrar);
    };
  }, [abierto]);

  return (
    <span className="termino">
      <button
        ref={boton}
        type="button"
        className="palabra"
        aria-describedby={abierto ? idTip : undefined}
        aria-expanded={abierto}
        onMouseEnter={() => abrir()}
        onMouseLeave={() => setAbierto(false)}
        onFocus={() => abrir()}
        onBlur={() => setAbierto(false)}
        onClick={() => abrir()}
        onKeyDown={(e) => e.key === 'Escape' && setAbierto(false)}
      >
        {children}
      </button>
      {abierto &&
        createPortal(
          <span
            ref={tip}
            className={`tip-glosario ui${hoja ? ' hoja' : ' flotante'}`}
            role="tooltip"
            id={idTip}
            // Primero se mide fuera de la vista; luego se coloca junto a la palabra.
            style={hoja ? undefined : pos ? { left: pos.left, top: pos.top } : { left: -9999, top: 0, visibility: 'hidden' }}
          >
            <strong>{entrada.termino}</strong>
            {entrada.definicion}
          </span>,
          document.body,
        )}
    </span>
  );
}
