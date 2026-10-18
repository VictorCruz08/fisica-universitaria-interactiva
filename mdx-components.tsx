import type { MDXComponents } from 'mdx/types';
import Ecuacion from '@/components/libro/Ecuacion';
import Termino from '@/components/libro/Termino';
import Figura from '@/components/libro/Figura';
import { Cuidado, Ejemplo, Enunciado, Estrategia, Evalua, Ipee, Paso, Resumen, Solucion } from '@/components/libro/Cajas';
import OpcionMultiple from '@/components/evaluacion/OpcionMultiple';
import CalculoMental from '@/components/evaluacion/CalculoMental';
import Reflexion from '@/components/evaluacion/Reflexion';

/** Componentes disponibles en todos los .mdx sin necesidad de importarlos. */
const componentes: MDXComponents = {
  Ecuacion,
  Termino,
  Figura,
  Cuidado,
  Estrategia,
  Ipee,
  Ejemplo,
  Enunciado,
  Solucion,
  Paso,
  Evalua,
  Resumen,
  OpcionMultiple,
  CalculoMental,
  Reflexion,
  // Las tablas anchas se desplazan en horizontal en móvil.
  table: (props) => (
    <div className="tabla-desplazable">
      <table {...props} />
    </div>
  ),
};

export function useMDXComponents(): MDXComponents {
  return componentes;
}
