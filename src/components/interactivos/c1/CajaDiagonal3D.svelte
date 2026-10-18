<script lang="ts">
  import Escena3D from '../nucleo/Escena3D.svelte';
  import Flecha from '../nucleo/Flecha.svelte';
  import Etiqueta from '../nucleo/Etiqueta.svelte';
  import Poligono from '../nucleo/Poligono.svelte';
  import { tex } from '../../../lib/katex';
  import { fmt, magnitud3, type Vec3 } from '../../../lib/vec';

  let ax = $state(2);
  let ay = $state(3);
  let az = $state(6);

  // Escala visual: la caja más grande cabe en la escena.
  const k = $derived(3.2 / Math.max(ax, ay, az, 1));
  const v = (x: number, y: number, z: number): Vec3 => ({ x: x * k, y: y * k, z: z * k });
  const A = $derived(v(ax, ay, az));
  const m = $derived(magnitud3({ x: ax, y: ay, z: az }));

  const aristas = $derived([
    [v(ax, 0, 0), v(ax, ay, 0)],
    [v(0, ay, 0), v(ax, ay, 0)],
    [v(ax, 0, 0), v(ax, 0, az)],
    [v(0, ay, 0), v(0, ay, az)],
    [v(ax, ay, 0), v(ax, ay, az)],
    [v(0, 0, az), v(ax, 0, az)],
    [v(0, 0, az), v(0, ay, az)],
    [v(ax, 0, az), v(ax, ay, az)],
    [v(0, ay, az), v(ax, ay, az)],
  ]);
</script>

<div class="int">
  <div class="int-lienzo">
    <Escena3D titulo="Vector en tres dimensiones como diagonal de una caja" tamano={3.6} alto={380}>
      <Poligono puntos={[v(0, 0, 0), v(ax, 0, 0), v(ax, ay, 0), v(0, ay, 0)]} relleno="var(--azul)" opacidad={0.06} />
      {#each aristas as [p, q]}
        <Poligono puntos={[p, q]} cerrado={false} borde="var(--tinta-3)" grosor={1} discontinuo />
      {/each}
      <Flecha desde={v(0, 0, 0)} hasta={v(ax, 0, 0)} color="var(--vec-x)" grosor={2.4} opacidad={0.7} />
      <Flecha desde={v(0, 0, 0)} hasta={v(0, ay, 0)} color="var(--vec-y)" grosor={2.4} opacidad={0.7} />
      <Flecha desde={v(0, 0, 0)} hasta={v(0, 0, az)} color="var(--vec-z)" grosor={2.4} opacidad={0.7} />
      <Flecha desde={v(0, 0, 0)} hasta={A} color="var(--vec-a)" grosor={3.2} />
      <Etiqueta en={A} t={'\\vec{A}'} color="var(--vec-a)" dx={16} dy={-12} />
      <Etiqueta en={v(ax / 2, 0, 0)} t={'A_x'} color="var(--vec-x)" dx={-16} dy={10} tamano={14} fondo />
      <Etiqueta en={v(0, ay / 2, 0)} t={'A_y'} color="var(--vec-y)" dy={14} tamano={14} fondo />
      <Etiqueta en={v(0, 0, az / 2)} t={'A_z'} color="var(--vec-z)" dx={-18} tamano={14} fondo />
    </Escena3D>
  </div>
  <div class="int-lectura">
    <span>{@html tex(`A = \\sqrt{A_x^2 + A_y^2 + A_z^2} = \\sqrt{${ax}^2 + ${ay}^2 + ${az}^2} = ${fmt(m, 2)}`)}</span>
  </div>
  <div class="int-barra deslizadores">
    <label class="int-deslizador"><span class="x">{@html tex('A_x')}</span><input type="range" min="0" max="8" step="1" bind:value={ax} /><output>{ax}</output></label>
    <label class="int-deslizador"><span class="y">{@html tex('A_y')}</span><input type="range" min="0" max="8" step="1" bind:value={ay} /><output>{ay}</output></label>
    <label class="int-deslizador"><span class="z">{@html tex('A_z')}</span><input type="range" min="0" max="8" step="1" bind:value={az} /><output>{az}</output></label>
  </div>
</div>

<style>
  .x :global(.katex) {
    color: var(--vec-x);
  }
  .y :global(.katex) {
    color: var(--vec-y);
  }
  .z :global(.katex) {
    color: var(--vec-z);
  }
</style>
