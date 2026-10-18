<script lang="ts">
  import Escena3D from '../nucleo/Escena3D.svelte';
  import Flecha from '../nucleo/Flecha.svelte';
  import Etiqueta from '../nucleo/Etiqueta.svelte';
  import { tex } from '../../../lib/katex';
  import { anguloEntre3, escala3, fmt, magnitud3, punto3, type Vec3 } from '../../../lib/vec';

  let A = $state<Vec3>({ x: 1, y: 2, z: 2 });
  let B = $state<Vec3>({ x: 4, y: 0, z: 3 });

  const ejes = ['x', 'y', 'z'] as const;
  const mA = $derived(magnitud3(A));
  const mB = $derived(magnitud3(B));
  const p = $derived(punto3(A, B));
  const phi = $derived(anguloEntre3(A, B));
  const k = $derived(3.4 / Math.max(mA, mB, 1));
  const par = (v: number) => (v < 0 ? `(${v})` : String(v));

  function cambiar(v: Vec3, eje: (typeof ejes)[number], d: number) {
    v[eje] = Math.max(-5, Math.min(5, v[eje] + d));
  }
</script>

<div class="int">
  <div class="dos">
    <div class="escena">
      <Escena3D titulo="Dos vectores en tres dimensiones" tamano={3.6} alto={340}>
        <Flecha desde={{ x: 0, y: 0, z: 0 }} hasta={escala3(k, A)} color="var(--vec-a)" grosor={3} />
        <Flecha desde={{ x: 0, y: 0, z: 0 }} hasta={escala3(k, B)} color="var(--vec-b)" grosor={3} />
        <Etiqueta en={escala3(k, A)} t={'\\vec{A}'} color="var(--vec-a)" dx={14} dy={-12} />
        <Etiqueta en={escala3(k, B)} t={'\\vec{B}'} color="var(--vec-b)" dx={14} dy={-12} />
      </Escena3D>
    </div>
    <div class="panel">
      {#each [['A', A], ['B', B]] as const as [nombre, v]}
        <div class="fila">
          <span class="nom" class:a={nombre === 'A'} class:b={nombre === 'B'}>{@html tex(`\\vec ${nombre}`)}</span>
          {#each ejes as e}
            <div class="paso">
              <button type="button" aria-label={`Disminuir ${nombre}${e}`} onclick={() => cambiar(v, e, -1)}>−</button>
              <span class="num">{v[e]}</span>
              <button type="button" aria-label={`Aumentar ${nombre}${e}`} onclick={() => cambiar(v, e, 1)}>+</button>
            </div>
          {/each}
        </div>
      {/each}
      <div class="calculo">
        <p>{@html tex(`\\vec A\\cdot\\vec B = ${par(A.x)}${par(B.x)} + ${par(A.y)}${par(B.y)} + ${par(A.z)}${par(B.z)} = ${p}`)}</p>
        <p>{@html tex(`A = ${fmt(mA, 3)},\\quad B = ${fmt(mB, 3)}`)}</p>
        {#if mA > 0 && mB > 0}
          <p>{@html tex(`\\cos\\phi = \\dfrac{\\vec A\\cdot\\vec B}{AB} = ${fmt(p / (mA * mB), 3)}`)}</p>
          <p class="phi">{@html tex(`\\phi = ${fmt(phi, 1)}^\\circ`)}</p>
        {:else}
          <p class="tenue">Un vector cero no tiene dirección: el ángulo no está definido.</p>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .dos {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: 0.5rem;
    align-items: center;
  }
  .escena {
    padding: 0.8rem;
    min-width: 0;
  }
  .panel {
    padding: 1rem 1.2rem 1.2rem;
  }
  .fila {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.5rem;
  }
  .nom {
    width: 1.8rem;
    font-size: 1.1rem;
  }
  .nom.a :global(.katex) {
    color: var(--vec-a);
  }
  .nom.b :global(.katex) {
    color: var(--vec-b);
  }
  .paso {
    display: flex;
    align-items: center;
    border: 1px solid var(--linea-fuerte);
    border-radius: 999px;
    overflow: hidden;
  }
  .paso button {
    width: 1.8rem;
    height: 1.9rem;
    border: 0;
    background: transparent;
    cursor: pointer;
    color: var(--tinta-2);
    font-size: 1rem;
  }
  .paso button:hover {
    background: var(--fondo-hundido);
  }
  .num {
    min-width: 1.6rem;
    text-align: center;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
  }
  .calculo {
    margin-top: 0.8rem;
    font-size: 0.98rem;
  }
  .calculo p {
    margin: 0.4rem 0;
  }
  .phi {
    font-size: 1.2rem;
  }
  .phi :global(.katex) {
    color: var(--ocre);
  }
  .tenue {
    color: var(--tinta-3);
  }
  @media (max-width: 720px) {
    .dos {
      grid-template-columns: 1fr;
    }
  }
</style>
