<script lang="ts">
  import type { Vec2, Vec3 } from '../../../lib/vec';
  import { usarLienzo } from './contexto';

  interface Props {
    en: Vec2 | Vec3;
    radio?: number;
    color?: string;
    /** Anillo blanco alrededor (para que destaque sobre las flechas). */
    anillo?: boolean;
  }

  let { en, radio = 5, color = 'var(--tinta)', anillo = true }: Props = $props();
  const l = usarLienzo();
  const p = $derived(l.aPx(en));
</script>

<circle
  cx={p.x}
  cy={p.y}
  r={radio}
  fill={color}
  stroke={anillo ? 'var(--fondo-elevado)' : 'none'}
  stroke-width={anillo ? 2.5 : 0}
/>
