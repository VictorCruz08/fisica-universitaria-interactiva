import { tex } from '@/lib/katex';

type Props = {
  /** Fuente TeX de la ecuación (modo display). */
  tex: string;
  /** Número de la ecuación en el libro, p. ej. "1.6". */
  n?: string;
  /** Nota corta a la derecha, p. ej. "θ medido desde +x". */
  nota?: string;
  destacada?: boolean;
};

/** Ecuación numerada como en el libro. Se renderiza con KaTeX al compilar. */
export default function Ecuacion({ tex: fuente, n, nota, destacada = false }: Props) {
  return (
    <div className={`ecuacion${destacada ? ' destacada' : ''}`} id={n ? `ec-${n}` : undefined}>
      <div className="cuerpo" dangerouslySetInnerHTML={{ __html: tex(fuente, true) }} />
      {(n || nota) && (
        <div className="lado">
          {nota && <span className="nota">{nota}</span>}
          {n && <span className="num">({n})</span>}
        </div>
      )}
    </div>
  );
}
