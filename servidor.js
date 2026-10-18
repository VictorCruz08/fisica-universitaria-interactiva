// Servidor local mínimo, sin dependencias: `npm run dev` (o `node servidor.js`).
// Sirve la carpeta del proyecto bajo /fisica-universitaria-interactiva/, igual que
// GitHub Pages, para que las rutas relativas se comporten exactamente igual.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('.', import.meta.url));
const BASE = '/fisica-universitaria-interactiva';
const PUERTO = Number(process.env.PUERTO ?? 4321);

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

createServer(async (req, res) => {
  const ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (ruta === '/' || ruta === BASE) {
    res.writeHead(302, { Location: `${BASE}/` });
    return res.end();
  }
  if (!ruta.startsWith(`${BASE}/`)) {
    res.writeHead(404);
    return res.end('No encontrado');
  }
  let archivo = normalize(join(RAIZ, ruta.slice(BASE.length)));
  if (!archivo.startsWith(normalize(RAIZ)) || archivo.split(sep).some((p) => p.startsWith('.') && p.length > 1)) {
    res.writeHead(403);
    return res.end();
  }
  try {
    const info = await stat(archivo);
    if (info.isDirectory()) {
      if (!ruta.endsWith('/')) {
        res.writeHead(301, { Location: `${ruta}/` });
        return res.end();
      }
      archivo = join(archivo, 'index.html');
    }
    const datos = await readFile(archivo);
    res.writeHead(200, { 'Content-Type': TIPOS[extname(archivo)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(datos);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('No encontrado');
  }
}).listen(PUERTO, () => {
  console.log(`Física Universitaria Interactiva → http://localhost:${PUERTO}${BASE}/`);
});
