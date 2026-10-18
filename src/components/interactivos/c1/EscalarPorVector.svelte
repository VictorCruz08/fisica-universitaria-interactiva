<script lang="ts">
  import Plano from '../nucleo/Plano.svelte';
  import Flecha from '../nucleo/Flecha.svelte';
  import Etiqueta from '../nucleo/Etiqueta.svelte';
  import { tex } from '../../../lib/katex';
  import { escala, fmt, magnitud, type Vec2 } from '../../../lib/vec';

  const A: Vec2 = { x: 1.6, y: 0.9 };
  const base: Vec2 = { x: 0, y: 0 };
  let c = $state(2);

  const cA = $derived(escala(c, A));
  const relacion = $derived(
    c > 0 ? 'paralelo a' : c < 0 ? 'antiparalelo a' : 'el vector cero (sin dirección definida)',
  );
  const cTex = $derived(Number.isInteger(c) ? String(c) : fmt(c, 1));
</script>

<div class="int">
  <div class="int-lienzo">
    <Plano x={[-5.5, 5.5]} y={[-3, 3]} rejilla={0.5} titulo="Un vector multiplicado por un escalar c" altoMax={320}>
      <Flecha desde={base} hasta={cA} color="var(--vec-r)" grosor={3.2} opacidad={c === 0 ? 0 : 1} />
      <Flecha desde={base} hasta={A} color="var(--vec-a)" grosor={2.4} />
      <Etiqueta en={A} t={'\\vec{A}'} color="var(--vec-a)" dx={c > 0 && c < 1.3 ? 26 : 0} dy={c > 1 ? 20 : -18} fondo />
      {#if c !== 0 && c !== 1}
        <Etiqueta en={cA} t={`${cTex}\\vec{A}`} color="var(--vec-r)" dx={c > 0 ? 22 : -22} dy={-16} fondo />
      {/if}
    </Plano>
  </div>
  <div class="int-lectura">
    <span>{@html tex(`|${cTex}\\vec A\\,| = |${cTex}|\\,A = ${fmt(magnitud(cA), 2)}`)}</span>
    <span class="tenue">{@html tex(`${cTex}\\vec A \\text{ es ${relacion} } \\vec A`)}</span>
  </div>
  <div class="int-barra">
    <label class="int-deslizador">
      <span>{@html tex('c')}</span>
      <input type="range" min="-3" max="3" step="0.5" bind:value={c} />
      <output>{cTex}</output>
    </label>
  </div>
</div>

<style>
  .tenue {
    color: var(--tinta-3);
  }
</style>
