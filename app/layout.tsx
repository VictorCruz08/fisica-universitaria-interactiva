import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import Pie from '@/components/sitio/Pie';
import Aparece from '@/components/sitio/Aparece';
import 'katex/dist/katex.min.css';
import './estilos/tokens.css';
import './estilos/base.css';
import './estilos/libro.css';
import './estilos/interactivos.css';
import './estilos/vidrio.css';
import './estilos/navegacion.css';

const ui = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-ui', display: 'swap' });
const serif = Source_Serif_4({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Física Universitaria Interactiva', template: '%s · Física Universitaria Interactiva' },
  description: 'Libro interactivo de física universitaria: vectores, movimiento y más, con animaciones y ejercicios.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfaf7' },
    { media: '(prefers-color-scheme: dark)', color: '#121113' },
  ],
};

// Fija el tema elegido antes de pintar, para evitar un destello de color.
const scriptTema = `try{var t=localStorage.getItem('fui:tema');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${ui.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body>
        {children}
        <Pie />
        <Aparece />
      </body>
    </html>
  );
}

