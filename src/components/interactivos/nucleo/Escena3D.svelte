<script lang="ts">
  import type { Snippet } from 'svelte';
  import { proyectar, type Camara } from '../../../lib/proyeccion';
  import type { Vec2, Vec3 } from '../../../lib/vec';
  import { darLienzo } from './contexto';

  interface Props {
    titulo: string;
    /** Semilongitud de los ejes, en unidades del mundo. */
    tamano?: number;
    /** Alto del lienzo en px. */
    alto?: number;
    azimut?: number;
    elevacion?: number;
    ejes?: boolean;
    /** Etiquetas de los ejes (por defecto x, y, z). */
    etiquetasEjes?: [string, string, string];
    /** Invierte el eje z (sistema izquierdo). */
    zInvertido?: boolean;
    children?: Snippet;
  }

  let {
    titulo,
    tamano = 4,
    alto = 380,
    azimut = $bindable(-35),
    elevacion = $bindable(22),
    ejes = true,
    etiquetasEjes = ['x', 'y', 'z'],
    zInvertido = false,
    children,
  }: Props = $props();

  let ancho = $state(720);
  const escala = $derived(Math.min(ancho, alto * 1.25) / (tamano * 2.6));

  const camara = (): Camara => ({ azimut, elevacion, escala, cx: ancho / 2, cy: alto * 0.56 });

  darLienzo({
    aPx: (p: Vec2 | Vec3) => proyectar({ x: p.x, y: p.y, z: 'z' in p ? p.z : 0 }, camara()),
    get escala() {
      return escala;
    },
    aMundo: () => ({ x: 0, y: 0 }),
  });

  const eje = (v: Vec3) => proyectar(v, camara());
  const o = $derived(eje({ x: 0, y: 0, z: 0 }));
  const finEjes = $derived([
    eje({ x: tamano, y: 0, z: 0 }),
    eje({ x: 0, y: tamano, z: 0 }),
    eje({ x: 0, y: 0, z: zInvertido ? -tamano : tamano }),
  ]);
  const inicioEjes = $derived([
    eje({ x: -tamano * 0.35, y: 0, z: 0 }),
    eje({ x: 0, y: -tamano * 0.35, z: 0 }),
    eje({ x: 0, y: 0, z: zInvertido ? tamano * 0.35 : -tamano * 0.35 }),
  ]);

  let arrastre: { x: number; y: number; az: number; el: number } | null = null;
  function bajar(ev: PointerEvent) {
    arrastre = { x: ev.clientX, y: ev.clientY, az: azimut, el: elevacion };
    (ev.currentTarget as Element).setPointerCapture(ev.pointerId);
  }
  function mover(ev: PointerEvent) {
    if (!arrastre) return;
    azimut = arrastre.az - (ev.clientX - arrastre.x) * 0.45;
    elevacion = Math.max(-10, Math.min(85, arrastre.el + (ev.clientY - arrastre.y) * 0.35));
  }
  function subir() {
    arrastre = null;
  }
  function teclado(ev: KeyboardEvent) {
    if (ev.key === 'ArrowLeft') azimut += 5;
    else if (ev.key === 'ArrowRight') azimut -= 5;
    else if (ev.key === 'ArrowUp') elevacion = Math.min(85, elevacion + 5);
    else if (ev.key === 'ArrowDown') elevacion = Math.max(-10, elevacion - 5);
    else return;
    ev.preventDefault();
  }
</script>

<div class="escena" bind:clientWidth={ancho}>
  <svg
    viewBox={`0 0 ${ancho} ${alto}`}
    role="application"
    aria-label={`${titulo}. Arrastra o usa las flechas para girar la vista.`}
    tabindex="0"
    onpointerdown={bajar}
    onpointermove={mover}
    onpointerup={subir}
    onpointercancel={subir}
    onkeydown={teclado}
  >
    {#if ejes}
      <g class="ejes">
        {#each finEjes as f, i}
          <line x1={inicioEjes[i].x} y1={inicioEjes[i].y} x2={f.x} y2={f.y} />
          <text x={f.x + (f.x - o.x) * 0.08} y={f.y + (f.y - o.y) * 0.08 + 5} text-anchor="middle">{etiquetasEjes[i]}</text>
        {/each}
      </g>
    {/if}
    {@render children?.()}
  </svg>
  <span class="pista ui" aria-hidden="true">
    <svg viewBox="0 0 20 20" width="14" height="14">
      <path d="M3 10a7 3 0 0 0 14 0" fill="none" stroke="currentColor" stroke-width="1.5" />
      <path d="M15 7.5 L17.2 10 L14.4 11.2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    Arrastra para girar
  </span>
</div>

<style>
  .escena {
    position: relative;
    width: 100%;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
    cursor: grab;
    overflow: visible;
  }
  svg:active {
    cursor: grabbing;
  }
  .ejes line {
    stroke: var(--tinta-3);
    stroke-width: 1.2;
  }
  .ejes text {
    font-family: var(--fuente-texto);
    font-style: italic;
    font-size: 17px;
    fill: var(--tinta-2);
  }
  .pista {
    position: absolute;
    right: 12px;
    bottom: 10px;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: var(--t-xs);
    color: var(--tinta-3);
    pointer-events: none;
  }
</style>
