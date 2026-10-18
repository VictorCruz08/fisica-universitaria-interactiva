'use client';

import { useId, useState } from 'react';
import { conMath } from '@/lib/katex';

type Props = {
  pregunta: string;
  /** Respuesta modelo que se revela cuando el estudiante decide. */
  respuesta: string;
  pista?: string;
};

const Html = ({ html, className }: { html: string; className?: string }) => (
  <p className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

export default function Reflexion({ pregunta, respuesta, pista }: Props) {
  const idNotas = useId();
  const [verPista, setVerPista] = useState(false);
  const [revelada, setRevelada] = useState(false);

  return (
    <div className="reflexion">
      <Html className="pregunta" html={conMath(pregunta)} />
      <label className="sr-only" htmlFor={idNotas}>
        Tus ideas (opcional)
      </label>
      <textarea id={idNotas} rows={2} placeholder="Escribe tu idea antes de ver la respuesta (opcional)…" />
      <div className="acciones">
        {pista && !verPista && !revelada && (
          <button type="button" className="boton" onClick={() => setVerPista(true)}>
            Pista
          </button>
        )}
        {!revelada && (
          <button type="button" className="boton primario" onClick={() => setRevelada(true)}>
            Ver una respuesta
          </button>
        )}
      </div>
      {pista && verPista && !revelada && <Html className="pista visible" html={conMath(pista)} />}
      {revelada && <Html className="respuesta visible" html={conMath(respuesta)} />}
    </div>
  );
}
