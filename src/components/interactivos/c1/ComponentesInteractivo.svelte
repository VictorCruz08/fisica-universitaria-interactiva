<script lang="ts">
  import Plano from '../nucleo/Plano.svelte';
  import Flecha from '../nucleo/Flecha.svelte';
  import Etiqueta from '../nucleo/Etiqueta.svelte';
  import Manija from '../nucleo/Manija.svelte';
  import Arco from '../nucleo/Arco.svelte';
  import Poligono from '../nucleo/Poligono.svelte';
  import { tex } from '../../../lib/katex';
  import { angulo, cuadrante, fmt, magnitud, type Vec2 } from '../../../lib/vec';

  let A = $state<Vec2>({ x: 3.5, y: 2 });
  const O = { x: 0, y: 0 };
  const mA = $derived(magnitud(A));
  const th = $derived(angulo(A));
  const q = $derived(cuadrante(A));
  const limitar = (p: Vec2): Vec2 => ({ x: Math.max(-4.5, Math.min(4.5, p.x)), y: Math.max(-3, Math.min(3, p.y)) });
  const signo = (v: number) => (Math.abs(v) < 1e-9 ? '0' : v > 0 ? '+' : '−');
</script>

<div class="int">
  <div class="int-lienzo">
    <Plano x={[-5, 5]} y={[-3.4, 3.4]} rejilla={0.5} marcas={1} titulo="Un vector y sus componentes x e y" altoMax={400}>
      <Poligono puntos={[{ x: A.x, y: 0 }, A, { x: 0, y: A.y }]} cerrado={false} borde="var(--tinta-3)" grosor={1} discontinuo />
      <Flecha desde={O} hasta={{ x: A.x, y: 0 }} color="var(--vec-x)" grosor={2.2} opacidad={0.55} />
      <Flecha desde={O} hasta={{ x: 0, y: A.y }} color="var(--vec-y)" grosor={2.2} opacidad={0.55} />
      {#if mA > 0.4}
        <Arco centro={O} desde={0} hasta={th} radio={30} color="var(--ocre)" sentido relleno />
        <Etiqueta en={O} t={'\\theta'} color="var(--ocre)" dx={44 * Math.cos(((th / 2) * Math.PI) / 180)} dy={-44 * Math.sin(((th / 2) * Math.PI) / 180)} tamano={15} />
      {/if}
      <Flecha desde={O} hasta={A} color="var(--vec-a)" grosor={3} />
      <Etiqueta en={A} t={'\\vec{A}'} color="var(--vec-a)" dx={A.x >= 0 ? 20 : -20} dy={A.y >= 0 ? -14 : 14} />
      {#if Math.abs(A.x) > 0.6}
        <Etiqueta en={{ x: A.x / 2, y: 0 }} t={'A_x'} color="var(--vec-x)" dy={A.y >= 0 ? 16 : -16} tamano={15} fondo />
      {/if}
      {#if Math.abs(A.y) > 0.6}
        <Etiqueta en={{ x: 0, y: A.y / 2 }} t={'A_y'} color="var(--vec-y)" dx={A.x >= 0 ? -20 : 20} tamano={15} fondo />
      {/if}
      <Manija bind:pos={A} color="var(--vec-a)" paso={0.25} restringir={limitar} nombre="punta del vector A" />
    </Plano>
  </div>

  <div class="int-lectura">
    <span>{@html tex(`A = ${fmt(mA, 2)}`)}</span>
    <span>{@html tex(`\\theta = ${fmt(th, 1)}^\\circ`)}</span>
    <span class="x">{@html tex(`A_x = A\\cos\\theta = ${fmt(A.x, 2)}`)}</span>
    <span class="y">{@html tex(`A_y = A\\sin\\theta = ${fmt(A.y, 2)}`)}</span>
  </div>

  <div class="tabla-wrap">
    <table class="signos" aria-label="Signos de las componentes por cuadrante">
      <thead>
        <tr>
          <th>Cuadrante</th>
          <th class:activo={q === 1}>I</th>
          <th class:activo={q === 2}>II</th>
          <th class:activo={q === 3}>III</th>
          <th class:activo={q === 4}>IV</th>
          <th>Ahora</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{@html tex('A_x')}</td>
          <td class:activo={q === 1}>+</td>
          <td class:activo={q === 2}>−</td>
          <td class:activo={q === 3}>−</td>
          <td class:activo={q === 4}>+</td>
          <td class="ahora">{signo(A.x)}</td>
        </tr>
        <tr>
          <td>{@html tex('A_y')}</td>
          <td class:activo={q === 1}>+</td>
          <td class:activo={q === 2}>+</td>
          <td class:activo={q === 3}>−</td>
          <td class:activo={q === 4}>−</td>
          <td class="ahora">{signo(A.y)}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="int-barra">
    <span class="nota">Arrastra la punta de {@html tex('\\vec A')} por los cuatro cuadrantes y observa los signos.</span>
  </div>
</div>

<style>
  .x :global(.katex) {
    color: var(--vec-x);
  }
  .y :global(.katex) {
    color: var(--vec-y);
  }
  .nota {
    color: var(--tinta-3);
    font-size: var(--t-xs);
  }
  .tabla-wrap {
    padding: 0 1.2rem 1rem;
    overflow-x: auto;
  }
  .signos {
    border-collapse: separate;
    border-spacing: 0;
    font-size: var(--t-sm);
    font-variant-numeric: tabular-nums;
    min-width: 22rem;
  }
  .signos th,
  .signos td {
    padding: 0.35rem 0.8rem;
    text-align: center;
    border-bottom: 1px solid var(--linea);
    transition:
      background var(--dur-2) var(--ease),
      color var(--dur-2) var(--ease);
  }
  .signos th {
    color: var(--tinta-3);
    font-weight: 600;
  }
  .signos th:first-child,
  .signos td:first-child {
    text-align: left;
  }
  .signos .activo {
    background: color-mix(in srgb, var(--ocre) 14%, transparent);
    color: var(--tinta);
    font-weight: 700;
  }
  .ahora {
    font-weight: 700;
    color: var(--ocre);
  }
</style>
