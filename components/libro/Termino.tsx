'use client';

import { useId, type ReactNode } from 'react';
import { glosario } from '@/lib/glosario';

/**
 * Palabra con definición del glosario (tooltip al pasar el cursor o al enfocar).
 * Un id que no exista en lib/glosario.ts rompe el build a propósito.
 */
export default function Termino({ id, children }: { id: string; children: ReactNode }) {
  const idTip = useId();
  const entrada = glosario[id];
  if (!entrada) throw new Error(`Término de glosario desconocido: "${id}"`);
  return (
    <span className="termino">
      <button type="button" className="palabra" aria-describedby={idTip}>
        {children}
      </button>
      <span className="tip ui" role="tooltip" id={idTip}>
        <strong>{entrada.termino}</strong>
        {entrada.definicion}
      </span>
    </span>
  );
}
