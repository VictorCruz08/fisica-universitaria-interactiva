/** ¿El usuario pidió reducir el movimiento? (falso en SSR) */
export const reducirMovimiento = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Curva ease-out tipo Apple para animaciones con requestAnimationFrame. */
export const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Anima un valor de 0 a 1 durante `ms`. Devuelve una función para cancelar.
 * Con movimiento reducido salta directamente al final.
 */
export const animar = (ms: number, cadaCuadro: (t: number) => void, curva = easeInOut): (() => void) => {
  if (reducirMovimiento() || ms <= 0) {
    cadaCuadro(1);
    return () => {};
  }
  let id = 0;
  const inicio = performance.now();
  const paso = (ahora: number) => {
    const t = Math.min(1, (ahora - inicio) / ms);
    cadaCuadro(curva(t));
    if (t < 1) id = requestAnimationFrame(paso);
  };
  id = requestAnimationFrame(paso);
  return () => cancelAnimationFrame(id);
};
