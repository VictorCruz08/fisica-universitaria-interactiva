// Interactivo 1.10b: los nueve términos de A·B y por qué seis se anulan.
import { html, segmentado } from '@/lib/dom';
import { tex } from '@/lib/katex';

const EJES = ['x', 'y', 'z'];
const GORRO = { x: '\\hat\\imath', y: '\\hat\\jmath', z: '\\hat k' };
const A = { x: 2, y: -1, z: 3 };
const B = { x: 1, y: 4, z: 2 };
const par = (v) => (v < 0 ? `(${v})` : String(v));

export default function montar(raiz) {
  const el = html(`<div class="int i-tabla9">
    <div class="cuerpo">
      <p class="arriba"></p>
      <div class="rejilla9" role="table" aria-label="Los nueve términos del producto"></div>
      <p class="abajo" aria-live="polite"></p>
    </div>
    <div class="int-barra"><button type="button" class="boton primario">Aplicar î·î = 1 e î·ĵ = 0</button></div>
  </div>`);
  raiz.append(el);
  let simplificado = false;
  let numerico = false;

  function dibujar() {
    el.classList.toggle('simplificado', simplificado);
    el.querySelector('.arriba').innerHTML = numerico
      ? tex('\\vec A\\cdot\\vec B = (2\\hat\\imath - \\hat\\jmath + 3\\hat k)\\cdot(\\hat\\imath + 4\\hat\\jmath + 2\\hat k)', true)
      : tex('\\vec A\\cdot\\vec B = (A_x\\hat\\imath + A_y\\hat\\jmath + A_z\\hat k)\\cdot(B_x\\hat\\imath + B_y\\hat\\jmath + B_z\\hat k)', true);
    el.querySelector('.rejilla9').innerHTML = EJES.flatMap((f, i) =>
      EJES.map((c, j) => {
        const diag = f === c;
        const termino = numerico ? `${par(A[f])}\\cdot${par(B[c])}\\,(${GORRO[f]}\\cdot${GORRO[c]})` : `A_${f}B_${c}\\,(${GORRO[f]}\\cdot${GORRO[c]})`;
        const valor = diag ? (numerico ? String(A[f] * B[c]) : `A_${f}B_${c}`) : '0';
        return `<div class="celda ${diag ? 'diag' : ''}" style="--retraso:${(i * 3 + j) * 45}ms" role="cell"><span class="termino9">${tex(termino)}</span><span class="val">${simplificado ? tex(valor) : ''}</span></div>`;
      }),
    ).join('');
    el.querySelector('.abajo').innerHTML = simplificado
      ? tex(numerico ? `\\vec A\\cdot\\vec B = 2 + (-4) + 6 = ${A.x * B.x + A.y * B.y + A.z * B.z}` : '\\vec A\\cdot\\vec B = A_xB_x + A_yB_y + A_zB_z', true)
      : '';
    el.querySelector('.int-barra .boton').textContent = simplificado ? 'Ver los nueve términos' : 'Aplicar î·î = 1 e î·ĵ = 0';
  }

  el.querySelector('.int-barra .boton').addEventListener('click', () => {
    simplificado = !simplificado;
    dibujar();
  });
  const control = segmentado({
    opciones: [
      { id: 'sim', texto: 'Símbolos' },
      { id: 'num', texto: 'Números' },
    ],
    actual: 'sim',
    etiqueta: 'Tipo de ejemplo',
    alCambiar: (id) => ((numerico = id === 'num'), dibujar()),
  });
  control.el.classList.add('empuje');
  el.querySelector('.int-barra').append(control.el);
  dibujar();
}
