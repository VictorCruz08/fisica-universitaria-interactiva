import Link from 'next/link';
import BotonTema from './BotonTema';

export default function Barra() {
  return (
    <header className="barra">
      <Link className="marca" href="/">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M4 18 L13 6" stroke="var(--azul)" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M13 6 L20 14" stroke="var(--magenta)" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M4 18 L20 14" stroke="var(--verde)" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <span>
          Física Universitaria <em>Interactiva</em>
        </span>
      </Link>
      <nav aria-label="Principal">
        <Link href="/indice/">Índice</Link>
        <Link href="/glosario/">Glosario</Link>
        <Link href="/como-usar/" className="ocultar-movil">
          Cómo usar
        </Link>
        <BotonTema />
      </nav>
    </header>
  );
}
