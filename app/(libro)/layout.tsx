import Barra from '@/components/sitio/Barra';

/** Todas las páginas del libro (menos la portada) llevan la barra superior. */
export default function LayoutLibro({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Barra />
      {children}
    </>
  );
}
