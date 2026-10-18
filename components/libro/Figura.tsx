import type { ReactNode } from 'react';
import Interactivo from './Interactivo';
import type { NombreInteractivo } from '@/interactivos/registro';

type Props = {
  /** Etiqueta corta, p. ej. "Interactivo 1.7a". */
  etiqueta: string;
  /** Qué hacer y qué observar. */
  pie?: ReactNode;
  /** Interactivo a montar (ver interactivos/registro.ts). */
  interactivo?: NombreInteractivo;
  /** Más ancha que la columna de texto (por defecto) o igual. */
  ancha?: boolean;
  children?: ReactNode;
};

export default function Figura({ etiqueta, pie, interactivo, ancha = true, children }: Props) {
  return (
    <figure className={`figura aparece${ancha ? ' ancha' : ''}`}>
      {interactivo ? <Interactivo nombre={interactivo} /> : <div className="lienzo">{children}</div>}
      <figcaption>
        <span className="etq">{etiqueta}</span>
        {pie && <span>{pie}</span>}
      </figcaption>
    </figure>
  );
}
