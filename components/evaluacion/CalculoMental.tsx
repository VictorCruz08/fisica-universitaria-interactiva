'use client';

import { useId, useRef, useState } from 'react';
import { conMath } from '@/lib/katex';
import { registrarRespuesta } from '@/lib/progreso';

type Reto = {
  pregunta: string;
  respuesta: number;
  /** Tolerancia absoluta (por defecto 2 % de la respuesta, mínimo 0.05). */
  tolerancia?: number;
  unidad?: string;
  pista?: string;
  /** Cómo se hace de cabeza. */
  truco: string;
};

type Estado = 'pendiente' | 'bien' | 'mal';

const Html = ({ html, className }: { html: string; className?: string }) => (
  <p className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

export default function CalculoMental({ id, retos }: { id: string; retos: Reto[] }) {
  const idInput = useId();
  const input = useRef<HTMLInputElement>(null);
  const [indice, setIndice] = useState(0);
  const [entrada, setEntrada] = useState('');
  const [estado, setEstado] = useState<Estado>('pendiente');
  const [verPista, setVerPista] = useState(false);
  const [intento, setIntento] = useState(0); // reinicia la animación de "sacudida"
  const reto = retos[indice];

  const comprobar = () => {
    const texto = entrada.replace(',', '.').trim();
    const v = Number(texto);
    if (texto === '' || !Number.isFinite(v)) return;
    const tol = reto.tolerancia ?? Math.max(0.05, Math.abs(reto.respuesta) * 0.02);
    const nuevo: Estado = Math.abs(v - reto.respuesta) <= tol ? 'bien' : 'mal';
    setEstado(nuevo);
    setIntento((n) => n + 1);
    registrarRespuesta(`${id}-${indice}`, nuevo === 'bien');
  };

  const siguiente = () => {
    setIndice((i) => (i + 1) % retos.length);
    setEntrada('');
    setEstado('pendiente');
    setVerPista(false);
    input.current?.focus();
  };

  return (
    <div className="cm">
      <div className="cabeza">
        <span className="titulo">
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <rect x="3.5" y="2.5" width="13" height="15" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M7 6.5h6M7 10h1.5M11.5 10H13M7 13.5h1.5M11.5 13.5H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Cálculo mental · sin calculadora
        </span>
        <span className="contador">
          {indice + 1} / {retos.length}
        </span>
      </div>

      <div className="reto actual" key={indice}>
        <Html className="pregunta" html={conMath(reto.pregunta)} />
      </div>

      <div className="fila">
        <label className="sr-only" htmlFor={idInput}>
          Tu respuesta
        </label>
        <input
          key={intento}
          ref={input}
          id={idInput}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="Tu respuesta"
          className={estado === 'pendiente' ? '' : estado}
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && comprobar()}
          disabled={estado === 'bien'}
          autoFocus={intento > 0 && estado === 'mal'}
        />
        {reto.unidad && <span className="unidad">{reto.unidad}</span>}
        {estado !== 'bien' && (
          <button type="button" className="boton primario" onClick={comprobar}>
            Comprobar
          </button>
        )}
      </div>

      <div aria-live="polite">
        {estado === 'mal' && <p className="mensaje mal">Todavía no. Inténtalo otra vez{reto.pista ? ' o pide una pista' : ''}.</p>}
        {estado === 'bien' && <p className="mensaje bien">¡Exacto!</p>}
        {estado === 'bien' && <Html className="truco visible" html={conMath(reto.truco)} />}
        {verPista && reto.pista && estado !== 'bien' && <Html className="pista visible" html={conMath(reto.pista)} />}
      </div>

      <div className="acciones">
        {reto.pista && !verPista && estado !== 'bien' && (
          <button type="button" className="boton" onClick={() => setVerPista(true)}>
            Pista
          </button>
        )}
        {estado === 'mal' && (
          <button type="button" className="boton" onClick={() => setEstado('bien')}>
            Ver respuesta
          </button>
        )}
        {estado === 'bien' && retos.length > 1 && (
          <button type="button" className="boton" onClick={siguiente}>
            {indice + 1 < retos.length ? 'Siguiente' : 'Volver al primero'}
          </button>
        )}
      </div>
      {estado === 'bien' && (
        <p className="valor">
          Respuesta: {reto.respuesta} {reto.unidad ?? ''}
        </p>
      )}
    </div>
  );
}
