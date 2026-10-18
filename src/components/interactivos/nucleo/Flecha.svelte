<script lang="ts">
  import type { Vec2, Vec3 } from '../../../lib/vec';
  import { usarLienzo } from './contexto';

  interface Props {
    desde: Vec2 | Vec3;
    hasta: Vec2 | Vec3;
    /** Color CSS, normalmente un token: "var(--vec-a)". */
    color?: string;
    grosor?: number;
    discontinua?: boolean;
    opacidad?: number;
    /** Tamaño de la punta en px. */
    punta?: number;
  }

  let {
    desde,
    hasta,
    color = 'var(--vec-a)',
    grosor = 2.6,
    discontinua = false,
    opacidad = 1,
    punta = 13,
  }: Props = $props();

  const l = usarLienzo();

  const g = $derived.by(() => {
    const a = l.aPx(desde);
    const b = l.aPx(hasta);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const largo = Math.hypot(dx, dy);
    if (largo < 0.5) return null;
    const ux = dx / largo;
    const uy = dy / largo;
    const p = Math.min(punta, largo * 0.55);
    const ancho = p * 0.42;
    const base = { x: b.x - ux * p, y: b.y - uy * p };
    // La línea termina un poco dentro de la punta para que no asome.
    const fin = { x: b.x - ux * p * 0.7, y: b.y - uy * p * 0.7 };
    const cabeza = `M${b.x},${b.y} L${base.x - uy * ancho},${base.y + ux * ancho} Q${base.x + ux * p * 0.18},${base.y + uy * p * 0.18} ${base.x + uy * ancho},${base.y - ux * ancho} Z`;
    return { a, fin, cabeza };
  });
</script>

{#if g}
  <g class="flecha" style:opacity={opacidad}>
    <line
      x1={g.a.x}
      y1={g.a.y}
      x2={g.fin.x}
      y2={g.fin.y}
      stroke={color}
      stroke-width={grosor}
      stroke-linecap="round"
      stroke-dasharray={discontinua ? '6 6' : undefined}
    />
    <path d={g.cabeza} fill={color} stroke={color} stroke-width="1" stroke-linejoin="round" />
  </g>
{/if}

<style>
  .flecha {
    transition: opacity var(--dur-2) var(--ease);
  }
</style>
