<script lang="ts">
  import { tex } from '../../../lib/katex';
  import type { Vec2, Vec3 } from '../../../lib/vec';
  import { usarLienzo } from './contexto';

  interface Props {
    en: Vec2 | Vec3;
    /** Fuente TeX, p. ej. "\\vec{A}". */
    t: string;
    color?: string;
    /** Desplazamiento en píxeles desde el punto. */
    dx?: number;
    dy?: number;
    tamano?: number;
    opacidad?: number;
    /** Fondo translúcido para que se lea sobre la rejilla. */
    fondo?: boolean;
  }

  let { en, t, color = 'var(--tinta)', dx = 0, dy = 0, tamano = 17, opacidad = 1, fondo = false }: Props = $props();
  const l = usarLienzo();
  const p = $derived(l.aPx(en));
  const html = $derived(tex(t));
  const W = 220;
  const H = 44;
</script>

<foreignObject x={p.x + dx - W / 2} y={p.y + dy - H / 2} width={W} height={H} style:opacity={opacidad} class="et">
  <div class="caja" style:color style:font-size={`${tamano}px`}>
    <span class:fondo>{@html html}</span>
  </div>
</foreignObject>

<style>
  .et {
    pointer-events: none;
    overflow: visible;
    transition: opacity var(--dur-2) var(--ease);
  }
  .caja {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    white-space: nowrap;
  }
  .caja :global(.katex) {
    font-size: 1em;
  }
  .fondo {
    padding: 0.15em 0.35em;
    border-radius: 6px;
    background: color-mix(in srgb, var(--fondo-elevado) 85%, transparent);
  }
</style>
