'use client';

/** Alterna claro/oscuro. El tema inicial lo fija el script en <head> (app/layout.tsx). */
export default function BotonTema() {
  const cambiar = () => {
    const raiz = document.documentElement;
    const oscuroAhora =
      raiz.dataset.theme === 'dark' || (!raiz.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const nuevo = oscuroAhora ? 'light' : 'dark';
    raiz.dataset.theme = nuevo;
    try {
      localStorage.setItem('fui:tema', nuevo);
    } catch {}
  };
  return (
    <button className="tema" type="button" aria-label="Cambiar tema claro/oscuro" title="Tema" onClick={cambiar}>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 4 A8 8 0 0 1 12 20 Z" fill="currentColor" />
      </svg>
    </button>
  );
}
