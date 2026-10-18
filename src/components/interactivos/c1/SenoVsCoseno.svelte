<script lang="ts">
  import Plano from '../nucleo/Plano.svelte';
  import Flecha from '../nucleo/Flecha.svelte';
  import Arco from '../nucleo/Arco.svelte';
  import { tex } from '../../../lib/katex';
  import { RAD, fmt } from '../../../lib/vec';

  let phi = $state(30);
  const cosv = $derived(Math.cos(phi * RAD));
  const senv = $derived(Math.sin(phi * RAD));

  // Gráfica propia (escala no uniforme): φ ∈ [0, 180], valor ∈ [−1, 1]
  const W = 420;
  const H = 220;
  const m = { izq: 34, der: 12, arr: 14, aba: 28 };
  const X = (g: number) => m.izq + (g / 180) * (W - m.izq - m.der);
  const Y = (v: number) => m.arr + ((1 - v) / 2) * (H - m.arr - m.aba);
  const curva = (f: (r: number) => number) =>
    Array.from({ length: 91 }, (_, i) => `${i ? 'L' : 'M'}${X(i * 2).toFixed(1)},${Y(f(i * 2 * RAD)).toFixed(1)}`).join(' ');
  const dCos = curva(Math.cos);
  const dSen = curva(Math.sin);

  let svg: SVGSVGElement | undefined = $state();
  let arrastrando = false;
  function aAngulo(ev: PointerEvent) {
    const r = svg!.getBoundingClientRect();
    const x = ((ev.clientX - r.left) / r.width) * W;
    phi = Math.round(Math.max(0, Math.min(180, ((x - m.izq) / (W - m.izq - m.der)) * 180)));
  }
</script>

<div class="int">
  <div class="dos">
    <div class="grafica">
      <svg
        bind:this={svg}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Gráficas de coseno y seno de phi entre 0 y 180 grados"
        onpointerdown={(e) => {
          arrastrando = true;
          (e.currentTarget as Element).setPointerCapture(e.pointerId);
          aAngulo(e);
        }}
        onpointermove={(e) => arrastrando && aAngulo(e)}
        onpointerup={() => (arrastrando = false)}
      >
        <line x1={m.izq} x2={W - m.der} y1={Y(0)} y2={Y(0)} class="eje" />
        <line x1={m.izq} x2={m.izq} y1={Y(1)} y2={Y(-1)} class="eje" />
        {#each [1, -1] as v}
          <line x1={m.izq} x2={W - m.der} y1={Y(v)} y2={Y(v)} class="guia" />
          <text x={m.izq - 6} y={Y(v) + 4} text-anchor="end" class="marca">{v > 0 ? '+AB' : '−AB'}</text>
        {/each}
        {#each [0, 90, 180] as g}
          <text x={X(g)} y={H - 8} text-anchor="middle" class="marca">{g}°</text>
        {/each}
        <path d={dCos} class="cos" />
        <path d={dSen} class="sen" />
        <line x1={X(phi)} x2={X(phi)} y1={Y(1)} y2={Y(-1)} class="cursor" />
        <circle cx={X(phi)} cy={Y(cosv)} r="5.5" class="p-cos" />
        <circle cx={X(phi)} cy={Y(senv)} r="5.5" class="p-sen" />
      </svg>
      <div class="leyenda">
        <span class="lc">{@html tex(`\\vec A\\cdot\\vec B = AB\\cos\\phi = ${fmt(cosv, 2)}\\,AB`)}</span>
        <span class="ls">{@html tex(`|\\vec A\\times\\vec B| = AB\\sin\\phi = ${fmt(senv, 2)}\\,AB`)}</span>
      </div>
    </div>
    <div class="mini">
      <Plano x={[-1.4, 1.6]} y={[-0.4, 1.4]} rejilla={false} ejes={false} titulo="Los dos vectores con el ángulo phi" altoMax={180}>
        <Arco centro={{ x: 0, y: 0 }} desde={0} hasta={phi} radio={26} color="var(--ocre)" relleno />
        <Flecha desde={{ x: 0, y: 0 }} hasta={{ x: 1.3, y: 0 }} color="var(--vec-a)" />
        <Flecha desde={{ x: 0, y: 0 }} hasta={{ x: 1.1 * Math.cos(phi * RAD), y: 1.1 * Math.sin(phi * RAD) }} color="var(--vec-b)" />
      </Plano>
      <p class="nota">
        {#if phi === 0 || phi === 180}
          Paralelos o antiparalelos: el producto cruz se anula y el punto es máximo en valor absoluto.
        {:else if phi === 90}
          Perpendiculares: el producto punto se anula y el cruz es máximo.
        {:else}
          Arrastra sobre la gráfica para cambiar {@html tex('\\phi')}.
        {/if}
      </p>
    </div>
  </div>
  <div class="int-barra">
    <label class="int-deslizador">
      <span>{@html tex('\\phi')}</span>
      <input type="range" min="0" max="180" step="1" bind:value={phi} />
      <output>{phi}°</output>
    </label>
  </div>
</div>

<style>
  .dos {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: 1rem;
    align-items: center;
    padding: 1rem 1.2rem 0.6rem;
  }
  svg {
    width: 100%;
    height: auto;
    display: block;
    touch-action: none;
    cursor: ew-resize;
  }
  .eje {
    stroke: var(--tinta-3);
    stroke-width: 1;
  }
  .guia {
    stroke: var(--rejilla);
    stroke-width: 1;
  }
  .marca {
    font-family: var(--fuente-ui);
    font-size: 11px;
    fill: var(--tinta-3);
  }
  .cos,
  .sen {
    fill: none;
    stroke-width: 2.6;
    stroke-linecap: round;
  }
  .cos {
    stroke: var(--azul);
  }
  .sen {
    stroke: var(--verde);
  }
  .cursor {
    stroke: var(--ocre);
    stroke-width: 1.2;
    stroke-dasharray: 4 4;
  }
  .p-cos {
    fill: var(--azul);
    stroke: var(--fondo-elevado);
    stroke-width: 2.5;
  }
  .p-sen {
    fill: var(--verde);
    stroke: var(--fondo-elevado);
    stroke-width: 2.5;
  }
  .leyenda {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin-top: 0.5rem;
    font-size: 0.98rem;
  }
  .lc :global(.katex) {
    color: var(--azul);
  }
  .ls :global(.katex) {
    color: var(--verde);
  }
  .nota {
    margin: 0.4rem 0 0;
    font-family: var(--fuente-texto);
    font-size: 0.95rem;
    color: var(--tinta-2);
  }
  @media (max-width: 640px) {
    .dos {
      grid-template-columns: 1fr;
    }
  }
</style>
