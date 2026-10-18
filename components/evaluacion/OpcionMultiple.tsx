'use client';

import { useState } from 'react';
import { conMath } from '@/lib/katex';
import { registrarRespuesta } from '@/lib/progreso';

type Opcion = { texto: string; correcta?: boolean; explicacion: string };

type Props = {
  /** Identificador estable, p. ej. "1.7-evalua". Se usa para guardar progreso. */
  id: string;
  pregunta: string;
  opciones: Opcion[];
  /** Varias respuestas correctas posibles. */
  multiple?: boolean;
  /** Idea general que aparece al comprobar. */
  cierre?: string;
};

const Html = ({ como: Tag = 'span', html, className }: { como?: 'span' | 'p'; html: string; className?: string }) => (
  <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

export default function OpcionMultiple({ id, pregunta, opciones, multiple = false, cierre }: Props) {
  const [elegidas, setElegidas] = useState<Set<number>>(new Set());
  const [comprobado, setComprobado] = useState(false);

  const correctas = opciones.flatMap((o, i) => (o.correcta ? [i] : []));
  const acierto = correctas.length === elegidas.size && correctas.every((i) => elegidas.has(i));

  const alternar = (i: number) => {
    if (comprobado) return;
    const s = new Set(multiple ? elegidas : []);
    if (s.has(i)) s.delete(i);
    else s.add(i);
    setElegidas(s);
  };

  const comprobar = () => {
    setComprobado(true);
    registrarRespuesta(id, acierto);
  };

  return (
    <div className={`om${comprobado ? ' comprobado' : ''}`}>
      <Html como="p" className="pregunta" html={conMath(pregunta)} />
      {multiple && <p className="ayuda">Puede haber más de una respuesta correcta.</p>}

      <ol className="opciones" role={multiple ? 'group' : 'radiogroup'} aria-label="Opciones">
        {opciones.map((o, i) => {
          const marcada = elegidas.has(i);
          const clases = [
            'opcion',
            marcada && 'marcada',
            comprobado && o.correcta && 'bien',
            comprobado && marcada && !o.correcta && 'mal',
            comprobado && !marcada && !o.correcta && 'atenuada',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <li key={i}>
              <button
                type="button"
                className={clases}
                role={multiple ? 'checkbox' : 'radio'}
                aria-checked={marcada}
                onClick={() => alternar(i)}
                disabled={comprobado}
              >
                <span className="letra">{String.fromCharCode(97 + i)}</span>
                <Html className="texto" html={conMath(o.texto)} />
              </button>
              {comprobado && (marcada || o.correcta) && (
                <Html como="p" className={`explicacion visible${o.correcta ? ' bien' : ''}`} html={conMath(o.explicacion)} />
              )}
            </li>
          );
        })}
      </ol>

      <div className="acciones">
        {!comprobado ? (
          <button type="button" className="boton primario" onClick={comprobar} disabled={elegidas.size === 0}>
            Comprobar
          </button>
        ) : (
          <>
            <p className={`veredicto${acierto ? ' bien' : ''}`} aria-live="polite">
              {acierto ? '¡Correcto!' : multiple ? 'Revisa las opciones marcadas.' : 'No exactamente.'}
            </p>
            <button
              type="button"
              className="boton"
              onClick={() => {
                setComprobado(false);
                setElegidas(new Set());
              }}
            >
              Intentar de nuevo
            </button>
          </>
        )}
      </div>
      {cierre && <Html como="p" className="cierre" html={conMath(cierre)} />}
    </div>
  );
}
