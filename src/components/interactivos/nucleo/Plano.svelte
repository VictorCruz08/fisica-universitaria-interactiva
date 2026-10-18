<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Vec2, Vec3 } from '../../../lib/vec';
  import { darLienzo } from './contexto';

  interface Props {
    /** Rango visible en x y en y, en unidades del mundo. */
    x: [number, number];
    y: [number, number];
    /** Descripción para lectores de pantalla. */
    titulo: string;
    /** Separación de la rejilla (false = sin rejilla). */
    rejilla?: number | false;
    ejes?: boolean;
    etiquetasEjes?: [string, string];
    /** Marcas numéricas en los ejes cada n unidades (0 = sin marcas). */
    marcas?: number;
    /** Alto máximo en píxeles: si el rango es muy alto, se reduce la escala. */
    altoMax?: number;
    children?: Snippet;
    /** Capa por debajo de la rejilla (p. ej. un mapa). */
    fondo?: Snippet;
  }

  let {
    x,
    y,
    titulo,
    rejilla = 1,
    ejes = true,
    etiquetasEjes = ['x', 'y'],
    marcas = 0,
    altoMax = 520,
    children,
    fondo,
  }: Props = $props();

  let ancho = $state(720);
  let svg: SVGSVGElement | undefined = $state();

  const escala = $derived(Math.min(ancho / (x[1] - x[0]), altoMax / (y[1] - y[0])));
  const anchoUtil = $derived((x[1] - x[0]) * escala);
  const alto = $derived((y[1] - y[0]) * escala);
  const margenX = $derived((ancho - anchoUtil) / 2);

  const X = (wx: number) => margenX + (wx - x[0]) * escala;
  const Y = (wy: number) => (y[1] - wy) * escala;

  darLienzo({
    aPx: (p: Vec2 | Vec3) => ({ x: X(p.x), y: Y(p.y) }),
    get escala() {
      return escala;
    },
    aMundo: (ev: PointerEvent) => {
      const r = svg!.getBoundingClientRect();
      return { x: (ev.clientX - r.left - margenX) / escala + x[0], y: y[1] - (ev.clientY - r.top) / escala };
    },
  });

  const rango = (a: number, b: number, paso: number) => {
    const out: number[] = [];
    for (let v = Math.ceil(a / paso) * paso; v <= b + 1e-9; v += paso) out.push(Number(v.toFixed(6)));
    return out;
  };
</script>

<div class="plano" bind:clientWidth={ancho}>
  <svg bind:this={svg} viewBox={`0 0 ${ancho} ${alto}`} role="img" aria-label={titulo}>
    {@render fondo?.()}
    {#if rejilla}
      <g class="rejilla">
        {#each rango(x[0], x[1], rejilla) as gx}
          <line x1={X(gx)} y1={0} x2={X(gx)} y2={alto} />
        {/each}
        {#each rango(y[0], y[1], rejilla) as gy}
          <line x1={X(x[0])} y1={Y(gy)} x2={X(x[1])} y2={Y(gy)} />
        {/each}
      </g>
    {/if}
    {#if ejes}
      <g class="ejes">
        {#if x[0] <= 0 && x[1] >= 0}
          <line x1={X(0)} y1={alto} x2={X(0)} y2={6} />
          <path d={`M${X(0)} 2 l-4.5 9 h9 Z`} />
          <text class="eje" x={X(0) + 10} y={16}>{etiquetasEjes[1]}</text>
        {/if}
        {#if y[0] <= 0 && y[1] >= 0}
          <line x1={X(x[0])} y1={Y(0)} x2={X(x[1]) - 6} y2={Y(0)} />
          <path d={`M${X(x[1]) - 2} ${Y(0)} l-9 -4.5 v9 Z`} />
          <text class="eje" x={X(x[1]) - 14} y={Y(0) - 10} text-anchor="end">{etiquetasEjes[0]}</text>
        {/if}
        {#if marcas}
          {#each rango(x[0] + marcas, x[1] - marcas, marcas) as m}
            {#if m !== 0}<text class="marca" x={X(m)} y={Y(0) + 16} text-anchor="middle">{m}</text>{/if}
          {/each}
          {#each rango(y[0] + marcas, y[1] - marcas, marcas) as m}
            {#if m !== 0}<text class="marca" x={X(0) - 7} y={Y(m) + 4} text-anchor="end">{m}</text>{/if}
          {/each}
        {/if}
      </g>
    {/if}
    {@render children?.()}
  </svg>
</div>

<style>
  .plano {
    width: 100%;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }
  .rejilla line {
    stroke: var(--rejilla);
    stroke-width: 1;
  }
  .ejes line {
    stroke: var(--tinta-3);
    stroke-width: 1.2;
  }
  .ejes path {
    fill: var(--tinta-3);
  }
  .eje {
    font-family: var(--fuente-texto);
    font-style: italic;
    font-size: 17px;
    fill: var(--tinta-2);
  }
  .marca {
    font-family: var(--fuente-ui);
    font-size: 11px;
    fill: var(--tinta-3);
    font-variant-numeric: tabular-nums;
  }
</style>
