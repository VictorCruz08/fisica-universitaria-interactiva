/**
 * Progreso del estudiante guardado sólo en su navegador.
 * Todo acceso va en try/catch: en modo privado localStorage puede fallar.
 * (Si más adelante hay cuentas de usuario, éste es el único punto a cambiar.)
 */
const CLAVE = 'fui:progreso:v1';

type Progreso = Record<string, { correcto: boolean; fecha: number }>;

const leer = (): Progreso => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) ?? '{}') as Progreso;
  } catch {
    return {};
  }
};

export const registrarRespuesta = (id: string, correcto: boolean): void => {
  try {
    const p = leer();
    p[id] = { correcto, fecha: Date.now() };
    localStorage.setItem(CLAVE, JSON.stringify(p));
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
};

export const respuestaPrevia = (id: string): boolean | undefined => leer()[id]?.correcto;
